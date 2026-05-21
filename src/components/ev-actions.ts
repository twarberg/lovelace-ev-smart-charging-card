import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cssVar } from "../lib/theme.js";
import "./ev-deadline-picker.js";
import "./ev-confirm-dialog.js";
import type { DeviceEntities, HomeAssistant } from "../types.js";

@customElement("ev-actions")
export class EvActions extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) entities!: DeviceEntities;
  @property({ type: String }) helperEntity = "";

  @state() private _deadlineOpen = false;
  @state() private _clearing = false;
  @state() private _confirmOpen = false;
  @state() private _resuming = false;

  static override styles = css`
    :host { display: block; }
    .tile {
      background: ${unsafeCSS(cssVar("cardBg", "#fff"))};
      border-radius: 12px;
      padding: 12px;
      overflow: hidden;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    .banner {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      background: rgba(239,68,68,0.12);
      color: ${unsafeCSS(cssVar("error", "#ef4444"))};
      font-size: 0.9em;
      margin-bottom: 4px;
    }
    .banner ha-icon { --mdc-icon-size: 20px; flex: 0 0 auto; }
    .banner .banner-text { flex: 1 1 auto; min-width: 0; color: ${unsafeCSS(cssVar("primaryText", "#0f172a"))}; }
    .fallback {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 4px 0;
      font-size: 0.86em;
      color: ${unsafeCSS(cssVar("secondaryText", "#475569"))};
    }
    .fallback input[type=time] {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid ${unsafeCSS(cssVar("divider", "#e5e7eb"))};
      background: ${unsafeCSS(cssVar("cardBg", "#fff"))};
      color: ${unsafeCSS(cssVar("primaryText", "#0f172a"))};
      font-size: 0.95em;
    }
    button {
      flex: 1 1 auto;
      min-width: 130px;
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
    button:focus-visible { outline: 2px solid ${unsafeCSS(cssVar("primary", "#3b82f6"))}; outline-offset: 2px; }
    button ha-icon { --mdc-icon-size: 18px; }

    button.charge { background: rgba(245,158,11,0.18); color: ${unsafeCSS(cssVar("warning", "#d97706"))}; }
    button.set    { background: rgba(34,197,94,0.18); color: ${unsafeCSS(cssVar("success", "#16a34a"))}; }
    button.clear  { background: rgba(239,68,68,0.15); color: ${unsafeCSS(cssVar("error", "#ef4444"))}; }
    button.resume { background: rgba(59,130,246,0.18); color: ${unsafeCSS(cssVar("primary", "#3b82f6"))}; }
    button.stop-force { background: rgba(239,68,68,0.15); color: ${unsafeCSS(cssVar("error", "#ef4444"))}; }
    button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      background: rgba(148,163,184,0.12);
      color: ${unsafeCSS(cssVar("secondaryText", "#94a3b8"))};
    }
    button:disabled:hover { filter: none; }
    button.spinning:disabled {
      cursor: progress;
      opacity: 0.7;
      background: rgba(239,68,68,0.15);
      color: ${unsafeCSS(cssVar("error", "#ef4444"))};
    }
    button.spinning ha-icon { animation: spin 0.9s linear infinite; }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  override render() {
    const initial = this.hass.states[this.entities.effectiveDeparture]?.state ?? "06:00";
    const overrideActive =
      (this.hass.states[this.entities.effectiveDeparture]?.attributes.source ?? "default") === "one_off";
    const unplugged = this.hass.states[this.entities.pluggedIn]?.state === "off";
    const planStatus = this.hass.states[this.entities.planStatus];
    const status = planStatus?.state ?? "no_data";
    const overrideMode = (planStatus?.attributes.override_mode ?? null) as
      | "force"
      | "skip"
      | null;
    const cancelled = status === "cancelled";
    const forceActive = overrideMode === "force";
    const fallback = this.entities.departureFallback
      ? this.hass.states[this.entities.departureFallback]
      : undefined;

    return html`
      <div class="tile">
        ${cancelled
          ? html`<div class="banner" role="status">
              <ha-icon icon="mdi:hand-back-left"></ha-icon>
              <span class="banner-text">Charging cancelled — flipped off manually. Resume to re-enable smart charging.</span>
            </div>`
          : ""}
        ${cancelled
          ? html`<button
              class="resume ${this._resuming ? "spinning" : ""}"
              title="Clear cancel override and resume smart charging."
              aria-label="Resume plan"
              aria-busy=${this._resuming ? "true" : "false"}
              ?disabled=${this._resuming}
              @click=${this._resumePlan}
            >
              <ha-icon icon="${this._resuming ? "mdi:loading" : "mdi:play-circle-outline"}"></ha-icon>
              ${this._resuming ? "Resuming…" : "Resume"}
            </button>`
          : forceActive
            ? html`<button
                class="stop-force ${this._resuming ? "spinning" : ""}"
                title="Stop force charging and return to the smart plan."
                aria-label="Stop force charge"
                aria-busy=${this._resuming ? "true" : "false"}
                ?disabled=${this._resuming}
                @click=${this._resumePlan}
              >
                <ha-icon icon="${this._resuming ? "mdi:loading" : "mdi:stop-circle-outline"}"></ha-icon>
                ${this._resuming ? "Stopping…" : "Stop force charge"}
              </button>`
            : html`<button
                class="charge"
                title="${unplugged
                  ? "Car is unplugged — plug in to force charge."
                  : "Charge immediately, ignoring the price plan, until target SoC or unplug."}"
                aria-label="Charge now"
                ?disabled=${unplugged}
                @click=${this._chargeNow}
              >
                <ha-icon icon="mdi:flash"></ha-icon> Charge now
              </button>`}
        <button
          class="set"
          title="One-time override of the departure deadline for the next charge cycle only. Reverts after the deadline passes."
          aria-label="Set one-off departure"
          @click=${this._openDeadline}
        >
          <ha-icon icon="mdi:clock-edit-outline"></ha-icon> Set departure
        </button>
        ${overrideActive
          ? html`<button
              class="clear ${this._clearing ? "spinning" : ""}"
              title="Clear the active one-off departure override."
              aria-label="Clear override"
              aria-busy=${this._clearing ? "true" : "false"}
              ?disabled=${this._clearing}
              @click=${this._clearOverride}
            >
              <ha-icon icon="${this._clearing ? "mdi:loading" : "mdi:close-circle-outline"}"></ha-icon>
              ${this._clearing ? "Clearing…" : "Clear"}
            </button>`
          : ""}
        ${fallback
          ? html`<label class="fallback">
              <ha-icon icon="mdi:calendar-clock" style="--mdc-icon-size:16px;"></ha-icon>
              Default departure
              <input
                type="time"
                .value=${this._fallbackValue(fallback.state)}
                aria-label="Default departure time"
                @change=${this._onFallbackChange}
              />
            </label>`
          : ""}
      </div>
      <ev-deadline-picker
        .initialTime=${initial}
        .open=${this._deadlineOpen}
        @deadline-confirm=${this._onDeadlineConfirm}
        @deadline-cancel=${() => (this._deadlineOpen = false)}
      ></ev-deadline-picker>
      <ev-confirm-dialog
        .open=${this._confirmOpen}
        title="Force charge now?"
        body="Ignores the price plan and charges until target SoC or unplug."
        confirmLabel="Charge now"
        tone="warning"
        @confirm-accept=${this._onChargeConfirm}
        @confirm-cancel=${this._onChargeCancel}
      ></ev-confirm-dialog>
    `;
  }

  private _chargeNow = () => {
    this._confirmOpen = true;
  };

  private _onChargeConfirm = () => {
    this._confirmOpen = false;
    void this.hass.callService("smart_ev_charging", "force_charge_now", {}, this._target());
  };

  private _onChargeCancel = () => {
    this._confirmOpen = false;
  };
  private _resumePlan = async () => {
    if (this._resuming) return;
    this._resuming = true;
    try {
      await this.hass.callService("smart_ev_charging", "resume_plan", {}, this._target());
    } finally {
      setTimeout(() => { this._resuming = false; }, 400);
    }
  };

  private _fallbackValue(state: string): string {
    if (!state || state === "unknown" || state === "unavailable") return "06:00";
    const m = /^(\d{2}):(\d{2})/.exec(state);
    return m ? `${m[1]}:${m[2]}` : "06:00";
  }

  private _onFallbackChange = (e: Event) => {
    const v = (e.target as HTMLInputElement).value;
    if (!v || !this.entities.departureFallback) return;
    void this.hass.callService(
      "time",
      "set_value",
      { time: v.length === 5 ? `${v}:00` : v },
      { entity_id: this.entities.departureFallback },
    );
  };

  private _clearOverride = async () => {
    if (this._clearing) return;
    this._clearing = true;
    try {
      await this.hass.callService("smart_ev_charging", "set_one_off_departure", {}, this._target());
    } finally {
      setTimeout(() => { this._clearing = false; }, 400);
    }
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
