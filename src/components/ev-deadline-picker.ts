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
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }
    .dialog {
      background: ${unsafeCSS(cssVar("cardBg", "#fff"))};
      padding: 22px 22px 18px;
      border-radius: 14px;
      min-width: 300px;
      max-width: 92vw;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.30);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .title {
      font-size: 1.05em;
      font-weight: 600;
      color: ${unsafeCSS(cssVar("primaryText", "#0f172a"))};
    }
    .subtitle {
      font-size: 0.85em;
      color: ${unsafeCSS(cssVar("secondaryText", "#475569"))};
      line-height: 1.35;
    }
    input[type=time] {
      font-size: 1.5em;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid ${unsafeCSS(cssVar("divider", "#e5e7eb"))};
      background: ${unsafeCSS(cssVar("cardBg", "#fff"))};
      color: ${unsafeCSS(cssVar("primaryText", "#0f172a"))};
      width: 100%;
      box-sizing: border-box;
    }
    input[type=time]:focus-visible {
      outline: 2px solid ${unsafeCSS(cssVar("primary", "#3b82f6"))};
      outline-offset: 2px;
    }
    .row {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 4px;
    }
    button {
      padding: 9px 16px;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.92em;
      font-weight: 500;
      transition: filter .12s;
    }
    button:hover { filter: brightness(0.95); }
    button:focus-visible {
      outline: 2px solid ${unsafeCSS(cssVar("primary", "#3b82f6"))};
      outline-offset: 2px;
    }
    button.cancel {
      background: transparent;
      border: 1px solid ${unsafeCSS(cssVar("divider", "#e5e7eb"))};
      color: ${unsafeCSS(cssVar("primaryText", "#0f172a"))};
    }
    button.primary {
      background: ${unsafeCSS(cssVar("primary", "#3b82f6"))};
      color: white;
      border: 1px solid transparent;
    }
  `;

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("initialTime") || changed.has("open")) this._value = this.initialTime;
  }

  override render() {
    if (!this.open) return html``;
    return html`
      <div class="backdrop" @click=${this._onBackdrop} role="presentation">
        <div
          class="dialog"
          @click=${(e: Event) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dlg-title"
          aria-describedby="dlg-desc"
        >
          <div class="title" id="dlg-title">Set one-off departure</div>
          <div class="subtitle" id="dlg-desc">
            Override the departure deadline for the next charge cycle only.
            Reverts automatically once the deadline passes.
          </div>
          <input
            type="time"
            .value=${this._value}
            @change=${this._onChange}
            aria-label="Departure time"
          />
          <div class="row">
            <button class="cancel" @click=${this._cancel}>Cancel</button>
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
