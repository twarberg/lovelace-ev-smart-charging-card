import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cssVar } from "../lib/theme.js";

@customElement("ev-deadline-picker")
export class EvDeadlinePicker extends LitElement {
  @property({ type: String }) initialTime = "06:00";
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private _value = "06:00";

  static override styles = css`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4);
      display: flex; align-items: center; justify-content: center; z-index: 100;
    }
    .dialog {
      background: ${unsafeCSS(cssVar("cardBg", "#fff"))}; padding: 16px; border-radius: 12px;
      min-width: 240px; max-width: 90vw;
    }
    .row { display: flex; gap: 8px; margin-top: 12px; justify-content: flex-end; }
    button { background: none; border: 1px solid ${unsafeCSS(cssVar("divider", "#e5e7eb"))}; padding: 6px 12px; border-radius: 8px; cursor: pointer; }
    button.primary { background: ${unsafeCSS(cssVar("primary", "#3b82f6"))}; color: white; border-color: transparent; }
    input[type=time] { font-size: 1.2em; padding: 4px; }
  `;

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("initialTime") || changed.has("open")) this._value = this.initialTime;
  }

  override render() {
    if (!this.open) return html``;
    return html`
      <div class="backdrop" @click=${this._onBackdrop}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <strong>Set one-off departure</strong>
          <div style="margin-top: 12px">
            <input type="time" .value=${this._value} @change=${this._onChange} />
          </div>
          <div class="row">
            <button @click=${this._cancel}>Cancel</button>
            <button class="primary" @click=${this._confirm}>Set</button>
          </div>
        </div>
      </div>
    `;
  }

  private _onChange = (e: Event) => {
    this._value = (e.target as HTMLInputElement).value;
  };

  private _onBackdrop = () => this._cancel();

  private _cancel = () => {
    this.dispatchEvent(new CustomEvent("deadline-cancel", { bubbles: true, composed: true }));
    this.open = false;
  };

  private _confirm = () => {
    this.dispatchEvent(new CustomEvent("deadline-confirm", {
      detail: { time: this._value },
      bubbles: true,
      composed: true,
    }));
    this.open = false;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-deadline-picker": EvDeadlinePicker;
  }
}
