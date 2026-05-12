import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { formatCurrency, formatHourMinute, formatKwh } from "../lib/format.js";
import { cssVar } from "../lib/theme.js";
import type { DeviceEntities, HomeAssistant } from "../types.js";

@customElement("ev-window")
export class EvWindow extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) entities!: DeviceEntities;

  static override styles = css`
    :host { display: block; }
    .tile { background: ${unsafeCSS(cssVar("cardBg", "#fff"))}; border-radius: 12px; padding: 12px; }
    h3 { margin: 0 0 8px; font-size: 0.95em; color: ${unsafeCSS(cssVar("secondaryText", "#475569"))}; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9em; }
    th, td { padding: 4px 6px; border-bottom: 1px solid ${unsafeCSS(cssVar("divider", "#eee"))}; text-align: right; }
    th:first-child, td:first-child { text-align: left; }
    tfoot td { font-weight: 600; border-top: 2px solid ${unsafeCSS(cssVar("divider", "#eee"))}; border-bottom: none; padding-top: 8px; }
    .empty { color: ${unsafeCSS(cssVar("secondaryText", "#94a3b8"))}; font-style: italic; }
  `;

  override render() {
    const attrs = this.hass.states[this.entities.plannedHours]?.attributes ?? {};
    const hours = (attrs.hours as string[] | undefined) ?? [];
    const prices = (attrs.hour_prices as number[] | undefined) ?? [];
    const kwh = (attrs.hour_kwh as number[] | undefined) ?? [];
    const unit = (attrs.cost_unit as string | null) ?? null;
    const total = (attrs.estimated_cost as number | null) ?? null;
    const language = this.hass.locale.language;

    if (hours.length === 0) {
      return html`<div class="tile"><h3>Charge window</h3><div class="empty">No charging planned</div></div>`;
    }
    let cumulative = 0;
    return html`
      <div class="tile">
        <h3>Charge window</h3>
        <table>
          <thead><tr><th>Time</th><th>Price/kWh</th><th>kWh</th><th>Cumulative</th></tr></thead>
          <tbody>
            ${hours.map((h, i) => {
              const price = prices[i] ?? 0;
              const slotKwh = kwh[i] ?? 0;
              cumulative += price * slotKwh;
              return html`
                <tr>
                  <td>${formatHourMinute(h)}</td>
                  <td>${price.toFixed(2)}</td>
                  <td>${formatKwh(slotKwh)}</td>
                  <td>${formatCurrency(cumulative, unit, language)}</td>
                </tr>
              `;
            })}
          </tbody>
          <tfoot><tr><td colspan="3">Estimated total</td><td>${formatCurrency(total, unit, language)}</td></tr></tfoot>
        </table>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-window": EvWindow;
  }
}
