import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fetchHistory } from "../lib/history.js";
import type { StateSample } from "../lib/history.js";
import { cssVar } from "../lib/theme.js";
import type { DeviceEntities, HomeAssistant } from "../types.js";

@customElement("ev-soc-trend")
export class EvSocTrend extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) entities!: DeviceEntities;
  @property({ type: Number }) days = 7;

  @state() private _series?: StateSample[];
  @state() private _error: string | null = null;
  private _lastKey = "";

  static override styles = css`
    :host { display: block; }
    .tile {
      background: ${unsafeCSS(cssVar("cardBg", "#fff"))};
      border-radius: 12px;
      padding: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    h3 {
      margin: 0 0 8px;
      font-size: 0.95em;
      color: ${unsafeCSS(cssVar("secondaryText", "#475569"))};
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .graph-wrap {
      margin: 0;
    }
    svg {
      width: 100%;
      height: 60px;
      display: block;
    }
    .empty { color: ${unsafeCSS(cssVar("secondaryText", "#94a3b8"))}; font-style: italic; }
  `;

  override updated() {
    if (!this.entities?.socEntity) return;
    const key = `${this.entities.socEntity}|${this.days}`;
    if (key !== this._lastKey) {
      this._lastKey = key;
      void this._fetch();
    }
  }

  override render() {
    if (!this.entities?.socEntity) {
      return html`<div class="tile"><h3>SoC — ${this.days}d</h3><div class="empty">No SoC entity configured</div></div>`;
    }
    if (this._error) {
      return html`<div class="tile"><h3>SoC — ${this.days}d</h3><div class="empty">${this._error}</div></div>`;
    }
    const samples = (this._series ?? []).filter((s) => Number.isFinite(Number(s.state)));
    if (samples.length < 2) {
      return html`<div class="tile"><h3>SoC — ${this.days}d</h3><div class="empty">Loading…</div></div>`;
    }
    const tStart = new Date(samples[0]!.t).getTime();
    const tEnd = new Date(samples[samples.length - 1]!.t).getTime();
    const span = tEnd - tStart || 1;
    const W = 200, H = 50;
    const pts = samples
      .map((s) => {
        const x = ((new Date(s.t).getTime() - tStart) / span) * W;
        const y = H - (Number(s.state) / 100) * H;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

    return html`
      <div class="tile">
        <h3>SoC — ${this.days}d</h3>
        <div class="graph-wrap">
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
            <polyline points="${pts}" fill="none" stroke="${cssVar("success", "#22c55e")}" stroke-width="1.5" />
          </svg>
        </div>
      </div>
    `;
  }

  private async _fetch() {
    if (!this.entities.socEntity) return;
    try {
      this._error = null;
      const end = new Date();
      const start = new Date(end.getTime() - this.days * 86_400_000);
      const h = await fetchHistory(this.hass, [this.entities.socEntity], start, end);
      this._series = h[this.entities.socEntity] ?? [];
    } catch (e) {
      this._error = `SoC fetch failed: ${(e as Error).message}`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-soc-trend": EvSocTrend;
  }
}
