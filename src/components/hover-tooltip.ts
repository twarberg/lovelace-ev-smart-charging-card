import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cssVar } from "../lib/theme.js";

@customElement("ev-hover-tooltip")
export class EvHoverTooltip extends LitElement {
  @property({ type: Boolean }) visible = false;
  @property({ type: Number }) x = 0;
  @property({ type: Number }) y = 0;
  @property({ type: String }) text = "";

  static override styles = css`
    :host {
      display: block;
      pointer-events: none;
    }
    .box {
      position: fixed;
      transform: translate(-50%, calc(-100% - 8px));
      background: ${unsafeCSS(cssVar("primaryText", "#0f172a"))};
      color: ${unsafeCSS(cssVar("cardBg", "#fff"))};
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 0.78em;
      font-weight: 500;
      white-space: nowrap;
      box-shadow: 0 4px 10px rgba(0,0,0,0.18);
      z-index: 9999;
    }
  `;

  override render() {
    if (!this.visible || !this.text) return html``;
    return html`<div class="box" style="left:${this.x}px;top:${this.y}px;">${this.text}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { "ev-hover-tooltip": EvHoverTooltip; }
}
