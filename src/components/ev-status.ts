import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cssVar } from "../lib/theme.js";
import type { DeviceEntities, HomeAssistant } from "../types.js";

interface StatusStyle {
  bg: string;
  fg: string;
}

function statusStyleFor(status: string): StatusStyle {
  switch (status) {
    case "ok":
      return { bg: "rgba(34,197,94,0.15)", fg: cssVar("success", "#16a34a") };
    case "partial":
    case "extended":
      return { bg: "rgba(245,158,11,0.15)", fg: cssVar("warning", "#d97706") };
    default:
      return { bg: "rgba(148,163,184,0.18)", fg: cssVar("secondaryText", "#475569") };
  }
}

@customElement("ev-status")
export class EvStatus extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) entities!: DeviceEntities;
  @property({ type: String }) cardTitle = "";

  @state() private _replanning = false;

  static override styles = css`
    :host { display: block; }
    .tile {
      background: ${unsafeCSS(cssVar("cardBg", "#fff"))};
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow: hidden;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }
    .title-icon { color: ${unsafeCSS(cssVar("primary", "#3b82f6"))}; --mdc-icon-size: 22px; }
    .name {
      font-weight: 600;
      font-size: 1.05em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.82em;
      font-weight: 500;
      text-transform: capitalize;
    }
    .pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    .controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: auto;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9em;
      color: ${unsafeCSS(cssVar("secondaryText", "#475569"))};
    }
    .badge {
      padding: 2px 8px;
      border-radius: 6px;
      background: rgba(59,130,246,0.12);
      color: ${unsafeCSS(cssVar("primary", "#3b82f6"))};
      font-size: 0.78em;
    }
    .soc {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .soc-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.82em;
      color: ${unsafeCSS(cssVar("secondaryText", "#475569"))};
    }
    .soc-track {
      height: 8px;
      background: ${unsafeCSS(cssVar("divider", "#e5e7eb"))};
      border-radius: 0;
      overflow: visible;
      position: relative;
      margin: 4px -14px 0;
    }
    .soc-fill {
      height: 100%;
      border-radius: 0;
      background: linear-gradient(90deg, ${unsafeCSS(cssVar("primary", "#3b82f6"))}, ${unsafeCSS(cssVar("success", "#22c55e"))});
      transition: width .35s ease;
    }
    .soc-target {
      position: absolute;
      top: -3px;
      width: 2px;
      height: 14px;
      background: ${unsafeCSS(cssVar("primaryText", "#0f172a"))};
      border-radius: 1px;
    }
    .replan-btn {
      border: none;
      background: transparent;
      color: ${unsafeCSS(cssVar("primary", "#3b82f6"))};
      cursor: pointer;
      padding: 4px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      --mdc-icon-size: 20px;
    }
    .replan-btn:hover { background: rgba(59,130,246,0.10); }
    .replan-btn:focus-visible { outline: 2px solid ${unsafeCSS(cssVar("primary", "#3b82f6"))}; outline-offset: 2px; }
    .replan-btn:disabled { cursor: progress; opacity: 0.7; }
    .replan-btn.spinning ha-icon { animation: spin 0.9s linear infinite; }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  override render() {
    const planStatus = this.hass.states[this.entities.planStatus];
    const smart = this.hass.states[this.entities.smartCharging];
    const departure = this.hass.states[this.entities.effectiveDeparture];
    const status = planStatus?.state ?? "no_data";
    const style = statusStyleFor(status);
    const oneOff = (departure?.attributes.source ?? "default") === "one_off";

    const soc = this.entities.socEntity ? Number(this.hass.states[this.entities.socEntity]?.state) : NaN;
    const target = this.entities.targetSocEntity ? Number(this.hass.states[this.entities.targetSocEntity]?.state) : NaN;
    const hasSoC = Number.isFinite(soc);

    const titleFromId = this.entities.planStatus.split(".")[1]?.replace(/_/g, " ").replace(/plan status$/, "").trim() || "EV";
    const titleToShow = this.cardTitle?.trim() || titleFromId;

    return html`
      <div class="tile">
        <div class="header">
          <div class="title-wrap">
            <ha-icon class="title-icon" icon="mdi:car-electric"></ha-icon>
            <span class="name">${titleToShow}</span>
          </div>
          <div class="controls">
            <button
              class="replan-btn ${this._replanning ? "spinning" : ""}"
              title="Replan the charge window now."
              aria-label="Replan"
              @click=${this._replan}
              ?disabled=${this._replanning}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
            <span class="pill" style="background:${style.bg}; color:${style.fg};">
              <span class="pill-dot"></span>${status}
            </span>
            <ha-switch
              .checked=${smart?.state === "on"}
              @change=${this._toggle}
            ></ha-switch>
          </div>
        </div>

        <div class="meta">
          <span>
            <ha-icon icon="mdi:flag-checkered" style="--mdc-icon-size:16px;vertical-align:-3px;"></ha-icon>
            Deadline ${departure?.state ?? "—"}
          </span>
          ${oneOff
            ? html`<span class="badge">
                <ha-icon icon="mdi:star" style="--mdc-icon-size:14px;vertical-align:-2px;"></ha-icon>
                one-off
              </span>`
            : ""}
        </div>

        ${hasSoC
          ? html`
              <div class="soc">
                <div class="soc-row">
                  <span>SoC ${soc.toFixed(0)}%</span>
                  <span>${Number.isFinite(target) ? "target " + target.toFixed(0) + "%" : ""}</span>
                </div>
                <div class="soc-track">
                  <div class="soc-fill" style="width:${Math.max(0, Math.min(100, soc))}%"></div>
                  ${Number.isFinite(target)
                    ? html`<div class="soc-target" style="left:${Math.max(0, Math.min(100, target))}%"></div>`
                    : ""}
                </div>
              </div>
            `
          : ""}
      </div>
    `;
  }

  private _replan = async () => {
    if (this._replanning) return;
    this._replanning = true;
    try {
      await this.hass.callService("smart_ev_charging", "replan", {}, { entity_id: this.entities.planStatus });
    } finally {
      // small minimum spin so feedback is visible even on instant returns
      setTimeout(() => { this._replanning = false; }, 400);
    }
  };

  private _toggle = () => {
    void this.hass.callService("switch", "toggle", undefined, { entity_id: this.entities.smartCharging });
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-status": EvStatus;
  }
}
