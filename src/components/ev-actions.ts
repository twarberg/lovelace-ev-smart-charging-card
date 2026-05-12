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
    .tile { background: ${unsafeCSS(cssVar("cardBg", "#fff"))}; border-radius: 12px; padding: 12px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: space-around; }
    button { background: none; border: 1px solid ${unsafeCSS(cssVar("divider", "#e5e7eb"))}; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.9em; }
    button:hover { background: ${unsafeCSS(cssVar("primary", "#3b82f6"))}; color: white; border-color: transparent; }
  `;

  override render() {
    const initial = this.hass.states[this.entities.effectiveDeparture]?.state ?? "06:00";
    const overrideActive =
      (this.hass.states[this.entities.effectiveDeparture]?.attributes.source ?? "default") === "one_off";
    return html`
      <div class="tile">
        <button @click=${this._replan}>Replan</button>
        <button @click=${this._force}>Force charge (2h)</button>
        <button @click=${this._skip}>Skip 1h</button>
        <button @click=${this._openDeadline}>Set deadline</button>
        ${overrideActive ? html`<button @click=${this._clearOverride}>Clear override</button>` : ""}
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
