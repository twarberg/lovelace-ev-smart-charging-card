import { LitElement, css, html, svg, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { attachCost, detectSessions, fetchHistory, rollupByDay } from "../lib/history.js";
import type { DayBucket, PricePoint } from "../lib/history.js";
import { formatCurrency } from "../lib/format.js";
import { cssVar } from "../lib/theme.js";
import type { DeviceEntities, HomeAssistant } from "../types.js";

@customElement("ev-history")
export class EvHistory extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) entities!: DeviceEntities;
  @property({ type: Number }) days = 30;

  @state() private _buckets?: DayBucket[];
  @state() private _loading = false;
  @state() private _expanded: string | null = null;
  @state() private _error: string | null = null;
  private _lastFetchKey = "";

  static override styles = css`
    :host { display: block; min-width: 0; }
    .tile { background: ${unsafeCSS(cssVar("cardBg", "#fff"))}; border-radius: 12px; padding: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); }
    h3 { margin: 0 0 8px; font-size: 0.95em; color: ${unsafeCSS(cssVar("secondaryText", "#475569"))}; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap; }
    .header { display: flex; justify-content: space-between; font-size: 0.85em; color: ${unsafeCSS(cssVar("secondaryText", "#475569"))}; margin-bottom: 6px; gap: 8px; flex-wrap: nowrap; }
    .header > span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    svg { width: 100%; height: 80px; display: block; }
    .bar { cursor: pointer; }
    .bar:hover { opacity: 0.7; }
    .drawer { margin-top: 8px; font-size: 0.85em; }
    .drawer ul { list-style: none; padding: 0; margin: 0; }
    .drawer li { padding: 2px 0; border-bottom: 1px solid ${unsafeCSS(cssVar("divider", "#eee"))}; }
    .empty { color: ${unsafeCSS(cssVar("secondaryText", "#94a3b8"))}; font-style: italic; }
  `;

  override updated() {
    const key = `${this.entities?.chargeNow}|${this.days}`;
    if (key !== this._lastFetchKey && this.hass && this.entities) {
      this._lastFetchKey = key;
      void this._fetch();
    }
  }

  override render() {
    const language = this.hass.locale.language;
    const unit = (this.hass.states[this.entities.planStatus]?.attributes.cost_unit as string | null) ?? null;
    const buckets = this._buckets ?? [];
    const total = buckets.reduce((a, b) => a + b.cost, 0);
    const sessionCount = buckets.reduce((a, b) => a + b.sessions.length, 0);
    const maxCost = Math.max(0, ...buckets.map((b) => b.cost));

    const body = this._error
      ? html`<div class="empty">${this._error}</div>`
      : this._loading && !this._buckets
        ? html`<div class="empty">Loading…</div>`
        : buckets.length === 0
          ? html`<div class="empty">No charging sessions in the last ${this.days} days</div>`
          : html`
            <svg viewBox="0 0 ${buckets.length * 8} 80">
              ${buckets.map((b, i) => {
                const h = maxCost > 0 ? (b.cost / maxCost) * 76 : 0;
                return svg`<rect class="bar" x="${i * 8}" y="${80 - h}" width="7" height="${h}"
                  fill="${cssVar("primary", "#3b82f6")}"
                  @click=${() => (this._expanded = this._expanded === b.date ? null : b.date)}>
                  <title>${b.date}: ${b.cost.toFixed(2)} ${unit ?? ""}</title></rect>`;
              })}
            </svg>
            ${this._expanded
              ? html`<div class="drawer">
                  <strong>${this._expanded}</strong>
                  <ul>
                    ${buckets
                      .find((b) => b.date === this._expanded)
                      ?.sessions.map(
                        (s) => html`<li>${new Date(s.start).toLocaleTimeString()}–${new Date(s.end).toLocaleTimeString()} · ${(s.kwh ?? 0).toFixed(1)} kWh · ${formatCurrency(s.cost ?? null, unit, language)}</li>`,
                      )}
                  </ul>
                </div>`
              : ""}
          `;

    return html`
      <div class="tile">
        <h3>History — ${this.days}d</h3>
        <div class="header">
          <span>Total ${formatCurrency(total, unit, language)}</span>
          <span>${sessionCount} sessions</span>
        </div>
        ${body}
      </div>
    `;
  }

  private async _fetch() {
    this._error = null;
    this._loading = true;
    try {
      const end = new Date();
      const start = new Date(end.getTime() - this.days * 86_400_000);
      const ids: string[] = [this.entities.chargeNow];
      if (this.entities.priceEntity) ids.push(this.entities.priceEntity);
      const history = await fetchHistory(this.hass, ids, start, end);
      if (typeof console !== "undefined") {
        console.debug("ev-history fetch", {
          days: this.days,
          chargeNow: this.entities.chargeNow,
          samples: history[this.entities.chargeNow]?.length ?? 0,
        });
      }
      const chargeSeries = history[this.entities.chargeNow] ?? [];
      const sessions = detectSessions(chargeSeries, end.toISOString());
      const pricesAttr = this.entities.priceEntity
        ? ((this.hass.states[this.entities.priceEntity]?.attributes.prices as PricePoint[] | undefined) ?? [])
        : [];
      const kw = this.entities.chargerKw ?? 11.0;
      this._buckets = rollupByDay(attachCost(sessions, pricesAttr, kw));
    } catch (e) {
      this._error = `History fetch failed: ${(e as Error).message}`;
    } finally {
      this._loading = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-history": EvHistory;
  }
}
