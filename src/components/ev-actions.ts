import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cssVar } from "../lib/theme.js";
import "./ev-deadline-picker.js";
import type { DeviceEntities, HomeAssistant } from "../types.js";

@customElement("ev-actions")
export class EvActions extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) entities!: DeviceEntities;
  @property({ type: String }) helperEntity = "";

  @state() private _deadlineOpen = false;

  static override styles = css`
    :host { display: block; }
    .tile {
      background: ${unsafeCSS(cssVar("cardBg", "#fff"))};
      border-radius: 12px;
      padding: 12px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    button {
      flex: 1 1 auto;
      min-width: 110px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px 12px;
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      font-size: 0.88em;
      font-weight: 500;
      transition: filter .12s, transform .05s;
      background: rgba(148,163,184,0.12);
      color: ${unsafeCSS(cssVar("primaryText", "#0f172a"))};
    }
    button:hover { filter: brightness(0.95); }
    button:active { transform: translateY(1px); }
    button ha-icon { --mdc-icon-size: 18px; }

    button.replan { background: rgba(59,130,246,0.15); color: ${unsafeCSS(cssVar("primary", "#3b82f6"))}; }
    button.force  { background: rgba(245,158,11,0.18); color: ${unsafeCSS(cssVar("warning", "#d97706"))}; }
    button.skip   { background: rgba(148,163,184,0.20); color: ${unsafeCSS(cssVar("secondaryText", "#475569"))}; }
    button.set    { background: rgba(34,197,94,0.18); color: ${unsafeCSS(cssVar("success", "#16a34a"))}; }
    button.clear  { background: rgba(239,68,68,0.15); color: ${unsafeCSS(cssVar("error", "#ef4444"))}; }
  `;

  override render() {
    const initial = this.hass.states[this.entities.effectiveDeparture]?.state ?? "06:00";
    const overrideActive =
      (this.hass.states[this.entities.effectiveDeparture]?.attributes.source ?? "default") === "one_off";

    return html`
      <div class="tile">
        <button class="replan" @click=${this._replan}>
          <ha-icon icon="mdi:refresh"></ha-icon> Replan
        </button>
        <button class="force" @click=${this._force}>
          <ha-icon icon="mdi:flash"></ha-icon> Force 2h
        </button>
        <button class="skip" @click=${this._skip}>
          <ha-icon icon="mdi:fast-forward"></ha-icon> Skip 1h
        </button>
        <button class="set" @click=${this._openDeadline}>
          <ha-icon icon="mdi:clock-edit-outline"></ha-icon> Set deadline
        </button>
        ${overrideActive
          ? html`<button class="clear" @click=${this._clearOverride}>
              <ha-icon icon="mdi:close-circle-outline"></ha-icon> Clear
            </button>`
          : ""}
      </div>
      <ev-deadline-picker
        .initialTime=${initial}
        .open=${this._deadlineOpen}
        @deadline-confirm=${this._onDeadlineConfirm}
        @deadline-cancel=${() => (this._deadlineOpen = false)}
      ></ev-deadline-picker>
    `;
  }

  private _replan = () => {
    void this.hass.callService("smart_ev_charging", "replan", {}, this._target());
  };
  private _force = () => {
    void this.hass.callService("smart_ev_charging", "force_charge_now", { duration: { hours: 2 } }, this._target());
  };
  private _skip = () => {
    const until = new Date(Date.now() + 3_600_000).toISOString();
    void this.hass.callService("smart_ev_charging", "skip_until", { until }, this._target());
  };
  private _clearOverride = () => {
    void this.hass.callService("smart_ev_charging", "set_one_off_departure", {}, this._target());
  };
  private _openDeadline = () => {
    this._deadlineOpen = true;
  };

  private _onDeadlineConfirm = (e: CustomEvent<{ time: string }>) => {
    const time = e.detail.time;
    if (this.helperEntity) {
      void this.hass.callService("input_datetime", "set_datetime", { time }, { entity_id: this.helperEntity });
    } else {
      void this.hass.callService("smart_ev_charging", "set_one_off_departure", { departure_time: time }, this._target());
    }
  };

  private _target() {
    return { entity_id: this.entities.planStatus };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-actions": EvActions;
  }
}
