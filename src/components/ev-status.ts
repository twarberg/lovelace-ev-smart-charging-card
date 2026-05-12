import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cssVar } from "../lib/theme.js";
import type { DeviceEntities, HomeAssistant } from "../types.js";

const STATUS_COLORS: Record<string, string> = {
  ok: cssVar("success", "#22c55e"),
  partial: cssVar("warning", "#f59e0b"),
  extended: cssVar("warning", "#f59e0b"),
  no_data: cssVar("secondaryText", "#94a3b8"),
  unplugged: cssVar("secondaryText", "#94a3b8"),
  disabled: cssVar("secondaryText", "#94a3b8"),
};

@customElement("ev-status")
export class EvStatus extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) entities!: DeviceEntities;

  static override styles = css`
    :host { display: block; }
    .tile { background: ${unsafeCSS(cssVar("cardBg", "#fff"))}; border-radius: 12px; padding: 12px; }
    .header { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .name { font-weight: 600; font-size: 1.05em; }
    .pill { padding: 2px 10px; border-radius: 999px; color: white; font-size: 0.85em; }
    .row { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; font-size: 0.9em; color: ${unsafeCSS(cssVar("secondaryText", "#475569"))}; }
    .soc-track { height: 8px; background: ${unsafeCSS(cssVar("divider", "#e5e7eb"))}; border-radius: 999px; overflow: hidden; margin-top: 6px; position: relative; }
    .soc-fill { height: 100%; background: ${unsafeCSS(cssVar("primary", "#3b82f6"))}; transition: width .3s; }
    .soc-target { position: absolute; top: -2px; width: 2px; height: 12px; background: ${unsafeCSS(cssVar("primaryText", "#0f172a"))}; }
    .toggle-btn { background: none; border: 1px solid ${unsafeCSS(cssVar("divider", "#e5e7eb"))}; padding: 4px 10px; border-radius: 8px; cursor: pointer; }
  `;

  override render() {
    const planStatus = this.hass.states[this.entities.planStatus];
    const smart = this.hass.states[this.entities.smartCharging];
    const departure = this.hass.states[this.entities.effectiveDeparture];
    const status = planStatus?.state ?? "no_data";
    const color = STATUS_COLORS[status] ?? STATUS_COLORS["no_data"] ?? "#94a3b8";
    const oneOff = (departure?.attributes["source"] ?? "default") === "one_off";

    const soc = this.entities.socEntity ? Number(this.hass.states[this.entities.socEntity]?.state) : NaN;
    const target = this.entities.targetSocEntity ? Number(this.hass.states[this.entities.targetSocEntity]?.state) : NaN;
    const hasSoC = Number.isFinite(soc);

    const titleFromId = this.entities.planStatus.split(".")[1]?.replace(/_/g, " ").replace(/plan status$/, "").trim() ?? "EV";

    return html`
      <div class="tile">
        <div class="header">
          <span class="name">${titleFromId}</span>
          <span class="pill" style="background:${color}">${status}</span>
          <button class="toggle-btn" @click=${this._toggle}>
            ${smart?.state === "on" ? "Smart: ON" : "Smart: OFF"}
          </button>
        </div>
        <div class="row">
          <span>Deadline: ${departure?.state ?? "—"}</span>
          ${oneOff ? html`<span title="one-off override active">★</span>` : ""}
        </div>
        ${hasSoC
          ? html`
              <div class="soc-track">
                <div class="soc-fill" style="width:${Math.max(0, Math.min(100, soc))}%"></div>
                ${Number.isFinite(target) ? html`<div class="soc-target" style="left:${target}%"></div>` : ""}
              </div>
              <div class="row"><span>SoC ${soc.toFixed(0)}% → ${Number.isFinite(target) ? target.toFixed(0) + "%" : "—"}</span></div>
            `
          : ""}
      </div>
    `;
  }

  private _toggle = () => {
    this.hass.callService("switch", "toggle", undefined, { entity_id: this.entities.smartCharging });
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-status": EvStatus;
  }
}
