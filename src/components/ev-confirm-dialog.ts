import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cssVar } from "../lib/theme.js";

export type ConfirmTone = "primary" | "warning" | "danger";

@customElement("ev-confirm-dialog")
export class EvConfirmDialog extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) override title = "";
  @property({ type: String }) body = "";
  @property({ type: String }) confirmLabel = "Confirm";
  @property({ type: String }) cancelLabel = "Cancel";
  @property({ type: String }) tone: ConfirmTone = "primary";

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
      border: 1px solid transparent;
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
    button.primary { color: white; }
    button.primary.primary-tone { background: ${unsafeCSS(cssVar("primary", "#3b82f6"))}; }
    button.primary.warning-tone { background: ${unsafeCSS(cssVar("warning", "#d97706"))}; }
    button.primary.danger-tone  { background: ${unsafeCSS(cssVar("error", "#ef4444"))}; }
  `;

  override render() {
    if (!this.open) return html``;
    return html`
      <div class="backdrop" @click=${this._onBackdrop} role="presentation">
        <div
          class="dialog"
          @click=${(e: Event) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cnf-title"
          aria-describedby="cnf-desc"
        >
          <div class="title" id="cnf-title">${this.title}</div>
          <div class="subtitle" id="cnf-desc">${this.body}</div>
          <div class="row">
            <button class="cancel" @click=${this._cancel}>${this.cancelLabel}</button>
            <button class="primary ${this.tone}-tone" @click=${this._confirm}>${this.confirmLabel}</button>
          </div>
        </div>
      </div>
    `;
  }

  private _onBackdrop = () => this._cancel();

  private _cancel = () => {
    this.open = false;
    this.dispatchEvent(new CustomEvent("confirm-cancel", { bubbles: true, composed: true }));
  };

  private _confirm = () => {
    this.open = false;
    this.dispatchEvent(new CustomEvent("confirm-accept", { bubbles: true, composed: true }));
  };

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this._cancel();
    }
  };

  override updated(changed: Map<string, unknown>) {
    if (!changed.has("open")) return;
    if (this.open) {
      document.addEventListener("keydown", this._onKeyDown);
      this.shadowRoot?.querySelector<HTMLButtonElement>("button.primary")?.focus();
    } else {
      document.removeEventListener("keydown", this._onKeyDown);
    }
  }

  override disconnectedCallback() {
    document.removeEventListener("keydown", this._onKeyDown);
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-confirm-dialog": EvConfirmDialog;
  }
}
