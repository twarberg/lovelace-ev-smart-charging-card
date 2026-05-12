// Stub — real implementation in Task E2.
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("ev-smart-charging-card-editor")
export class EvSmartChargingCardEditor extends LitElement {
  override render() {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-smart-charging-card-editor": EvSmartChargingCardEditor;
  }
}
