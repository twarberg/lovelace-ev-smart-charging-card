import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { discover } from "./lib/discover.js";
import { cssVar } from "./lib/theme.js";
import type { CardConfig, DeviceEntities, HomeAssistant } from "./types.js";
import "./components/ev-status.js";
import "./components/ev-timeline.js";
import "./components/ev-window.js";
import "./components/ev-history.js";
import "./components/ev-soc-trend.js";
import "./components/ev-actions.js";

const DEFAULT_SHOW: NonNullable<CardConfig["show"]> = [
  "status", "timeline", "window", "history", "soc", "actions",
];

@customElement("ev-smart-charging-card")
export class EvSmartChargingCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config?: CardConfig;
  @state() private _entities?: DeviceEntities;
  @state() private _error?: string;
  private _unsubscribe?: () => Promise<void>;

  static getStubConfig(): Partial<CardConfig> {
    return { device_id: "" };
  }

  static async getConfigElement() {
    await import("./editor.js");
    return document.createElement("ev-smart-charging-card-editor");
  }

  setConfig(config: CardConfig) {
    if (!config?.device_id) {
      throw new Error("device_id is required");
    }
    this._config = config;
    this._entities = undefined;
    this._error = undefined;
  }

  getCardSize() {
    return 6;
  }

  override connectedCallback() {
    super.connectedCallback();
    void this._maybeSubscribe();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    void this._unsubscribe?.();
    this._unsubscribe = undefined;
  }

  static override styles = css`
    :host { display: block; }
    ha-card {
      padding: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(520px, 1fr));
      gap: 10px;
      padding: 6px;
    }
    .span2 { grid-column: span 2; }
    .full { grid-column: 1 / -1; }
    .error { padding: 14px; color: ${unsafeCSS(cssVar("error", "#ef4444"))}; }
  `;

  override render() {
    if (!this._config) return html``;
    if (this.hass && !this._entities && !this._error) {
      try {
        this._entities = discover(this.hass, this._config.device_id);
        void this._maybeSubscribe();
      } catch (e) {
        this._error = (e as Error).message;
      }
    }
    if (this._error || !this._entities) {
      return html`<div class="error">${this._error ?? "Loading…"}</div>`;
    }
    const show = new Set(this._config.show ?? DEFAULT_SHOW);
    return html`
      <ha-card>
        <div class="grid">
          ${show.has("status") ? html`<ev-status
  .hass=${this.hass}
  .entities=${this._entities}
  .cardTitle=${this._config?.name ?? ""}
></ev-status>` : ""}
          ${show.has("timeline") ? html`<ev-timeline class="span2"
            .hass=${this.hass} .entities=${this._entities}
            .hours=${this._config.timeline_hours ?? 24}
            @slot-click=${this._onSlotClick}></ev-timeline>` : ""}
          ${show.has("window") ? html`<ev-window .hass=${this.hass} .entities=${this._entities}></ev-window>` : ""}
          ${show.has("history") ? html`<ev-history .hass=${this.hass} .entities=${this._entities}
            .days=${this._config.history_days ?? 30}></ev-history>` : ""}
          ${show.has("soc") ? html`<ev-soc-trend .hass=${this.hass} .entities=${this._entities}
            .days=${this._config.soc_days ?? 7}></ev-soc-trend>` : ""}
          ${show.has("actions") ? html`<ev-actions class="full"
            .hass=${this.hass} .entities=${this._entities}
            .helperEntity=${this._config.helper_entity ?? ""}></ev-actions>` : ""}
        </div>
      </ha-card>
    `;
  }

  private async _maybeSubscribe() {
    if (this._unsubscribe || !this.hass) return;
    this._unsubscribe = await this.hass.connection.subscribeEvents(
      () => this.requestUpdate(),
      "smart_ev_charging_plan_updated",
    );
  }

  private _onSlotClick = (e: CustomEvent<{ start: string; end: string; isPlanned: boolean }>) => {
    if (!this._entities) return;
    const target = { entity_id: this._entities.planStatus };
    if (e.detail.isPlanned) {
      void this.hass.callService("smart_ev_charging", "skip_until", { until: e.detail.end }, target);
    } else {
      void this.hass.callService("smart_ev_charging", "force_charge_now", { duration: { hours: 1 } }, target);
    }
  };
}

(window as unknown as { customCards?: unknown[] }).customCards ||= [];
(window as unknown as { customCards: Array<Record<string, unknown>> }).customCards.push({
  type: "ev-smart-charging-card",
  name: "Smart EV Charging",
  description: "Status, plan timeline, history and actions for the Smart EV Charging integration.",
  preview: false,
});

declare global {
  interface HTMLElementTagNameMap {
    "ev-smart-charging-card": EvSmartChargingCard;
  }
}

console.info(
  "%c ev-smart-charging-card%c v0.1.0 ",
  "color:white;background:#3b82f6;font-weight:700",
  "color:#3b82f6",
);
