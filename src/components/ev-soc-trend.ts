import { LitElement, css, html, svg, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fetchHistory } from "../lib/history.js";
import type { StateSample } from "../lib/history.js";
import { cssVar } from "../lib/theme.js";
import type { DeviceEntities, HomeAssistant } from "../types.js";
import "./hover-tooltip.js";

@customElement("ev-soc-trend")
export class EvSocTrend extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) entities!: DeviceEntities;
  @property({ type: Number }) days = 7;

  @state() private _series?: StateSample[];
  @state() private _error: string | null = null;
  @state() private _tip = { visible: false, x: 0, y: 0, text: "" };
  private _lastKey = "";

  static override styles = css`
    :host { display: block; }
    .tile {
      background: ${unsafeCSS(cssVar("cardBg", "#fff"))};
      border-radius: 12px;
      padding: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      position: relative;
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
      position: relative;
    }
    svg {
      width: 100%;
      height: 60px;
      display: block;
    }
    .date-line {
      stroke: ${unsafeCSS(cssVar("secondaryText", "#94a3b8"))};
      stroke-width: 1;
      stroke-dasharray: 3 3;
      opacity: 0.6;
      pointer-events: none;
      vector-effect: non-scaling-stroke;
    }
    .date-label {
      position: absolute;
      top: 0;
      transform: translateX(2px);
      color: ${unsafeCSS(cssVar("secondaryText", "#94a3b8"))};
      font-size: 9px;
      font-weight: 500;
      line-height: 1;
      pointer-events: none;
      white-space: nowrap;
    }
    .empty { color: ${unsafeCSS(cssVar("secondaryText", "#94a3b8"))}; font-style: italic; }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }
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

    const dividers: { x: number; pct: number; label: string }[] = [];
    const first = new Date(tStart);
    const firstMidnight = new Date(first.getFullYear(), first.getMonth(), first.getDate() + 1).getTime();
    for (let t = firstMidnight; t < tEnd; t += 86_400_000) {
      const pct = (t - tStart) / span;
      dividers.push({
        x: pct * W,
        pct,
        label: new Date(t).toLocaleDateString([], { weekday: "short", day: "2-digit" }),
      });
    }

    return html`
      <div class="tile">
        <h3 id="soc-title">SoC — ${this.days}d</h3>
        <div class="graph-wrap">
          <svg
            viewBox="0 0 ${W} ${H}"
            preserveAspectRatio="none"
            role="img"
            aria-labelledby="soc-title"
            aria-describedby="soc-desc"
            @mousemove=${this._onMove(samples)}
            @mouseleave=${this._onLeave}
          >
            ${dividers.map(
              (d) => svg`<line
                class="date-line"
                x1=${d.x.toFixed(1)}
                y1="0"
                x2=${d.x.toFixed(1)}
                y2=${H}
              ></line>`,
            )}
            <polyline points="${pts}" fill="none" stroke="${cssVar("success", "#22c55e")}" stroke-width="1.5" />
          </svg>
          ${dividers.map(
            (d) =>
              html`<span class="date-label" style="left: ${(d.pct * 100).toFixed(2)}%">${d.label}</span>`,
          )}
        </div>
        <span id="soc-desc" class="sr-only">
          State of charge trend over the last ${this.days} days. Hover to see value at a point in time.
        </span>
        <ev-hover-tooltip
          .visible=${this._tip.visible}
          .x=${this._tip.x}
          .y=${this._tip.y}
          .text=${this._tip.text}
        ></ev-hover-tooltip>
      </div>
    `;
  }

  private _onMove = (samples: StateSample[]) => (e: MouseEvent) => {
    const svg = e.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratioX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    const tStart = new Date(samples[0]!.t).getTime();
    const tEnd = new Date(samples[samples.length - 1]!.t).getTime();
    const targetTime = tStart + ratioX * (tEnd - tStart);

    // Linear scan — sample count is small (≤ few hundred for 7-30d).
    let nearest = samples[0]!;
    let minDelta = Infinity;
    for (const s of samples) {
      const delta = Math.abs(new Date(s.t).getTime() - targetTime);
      if (delta < minDelta) {
        minDelta = delta;
        nearest = s;
      }
    }
    const text = `${new Date(nearest.t).toLocaleString()} · ${Number(nearest.state).toFixed(0)}%`;
    this._tip = { visible: true, x: e.clientX, y: e.clientY, text };
  };

  private _onLeave = () => { this._tip = { ...this._tip, visible: false }; };

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
