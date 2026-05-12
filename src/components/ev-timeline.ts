import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cssVar } from "../lib/theme.js";
import type { DeviceEntities, HomeAssistant } from "../types.js";
import "./hover-tooltip.js";

interface PricePoint {
  start: string;
  end: string;
  price: number;
}

export interface SlotClickDetail {
  start: string;
  end: string;
  isPlanned: boolean;
  price: number;
}

const W = 480;
const H = 80;

@customElement("ev-timeline")
export class EvTimeline extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) entities!: DeviceEntities;
  @property({ type: Number }) hours = 24;

  static override styles = css`
    :host { display: block; }
    .tile { background: ${unsafeCSS(cssVar("cardBg", "#fff"))}; border-radius: 12px; padding: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); position: relative; }
    h3 { margin: 0 0 8px; font-size: 0.95em; color: ${unsafeCSS(cssVar("secondaryText", "#475569"))}; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    svg { width: 100%; height: auto; display: block; }
    .slot { cursor: pointer; }
    .slot:hover rect { fill: ${unsafeCSS(cssVar("primary", "#3b82f6"))}; opacity: 0.15; }
    .planned-rect { fill: ${unsafeCSS(cssVar("success", "#22c55e"))}; opacity: 0.35; pointer-events: none; }
    .now-line { stroke: ${unsafeCSS(cssVar("primaryText", "#0f172a"))}; stroke-width: 1; stroke-dasharray: 2 2; }
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

  @state() private _tip = { visible: false, x: 0, y: 0, text: "" };

  /** Computed once per render, used in updated() to populate rects */
  private _lastPrices: PricePoint[] = [];
  private _lastPlanned: Set<string> = new Set();

  override render() {
    const prices = this._prices().slice(0, Math.max(1, Math.min(this.hours, 48)));
    this._lastPrices = prices;

    if (prices.length === 0) {
      this._lastPlanned = new Set();
      return html`<div class="tile"><h3>Price &amp; plan</h3><div class="empty">No price data yet</div></div>`;
    }

    const plannedAttr = this.hass.states[this.entities.plannedHours]?.attributes;
    this._lastPlanned = new Set<string>((plannedAttr?.hours as string[] | undefined) ?? []);

    const min = Math.min(...prices.map((p) => p.price));
    const max = Math.max(...prices.map((p) => p.price));
    const span = max - min || 1;
    const slotW = W / prices.length;
    const linePts = prices
      .map((p, i) => {
        const y = H - 8 - ((p.price - min) / span) * (H - 16);
        const x = i * slotW + slotW / 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

    const now = new Date();
    const nowIdx = prices.findIndex((p) => new Date(p.start) <= now && now < new Date(p.end));
    const nowX =
      nowIdx >= 0
        ? nowIdx * slotW +
          slotW * ((now.getTime() - new Date(prices[nowIdx]!.start).getTime()) / 3_600_000)
        : -1;

    return html`
      <div class="tile">
        <h3 id="timeline-title">Price &amp; plan — next ${prices.length}h</h3>
        <svg
          id="chart"
          viewBox="0 0 ${W} ${H}"
          role="img"
          aria-labelledby="timeline-title"
          aria-describedby="timeline-desc"
          @mousemove=${this._onMove(prices)}
          @mouseleave=${this._onLeave}
        >
          <polyline points="${linePts}" fill="none" stroke="${cssVar("primary", "#3b82f6")}" stroke-width="1.5" />
          ${nowX >= 0
            ? html`<line class="now-line" x1="${nowX}" y1="0" x2="${nowX}" y2="${H}"></line>`
            : ""}
        </svg>
        <span id="timeline-desc" class="sr-only">
          24-hour electricity price curve. Hover or focus a bar to see the slot price.
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

  override updated() {
    const svgEl = this.shadowRoot?.querySelector<SVGSVGElement>("#chart");
    if (!svgEl || this._lastPrices.length === 0) return;

    // Remove any previously inserted slot rects
    svgEl.querySelectorAll(".slot-group").forEach((n) => n.remove());

    const prices = this._lastPrices;
    const planned = this._lastPlanned;
    const slotW = W / prices.length;

    for (let i = 0; i < prices.length; i++) {
      const p = prices[i]!;
      const isPlanned = planned.has(p.start);

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "slot-group");

      // Clickable transparent overlay rect
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("class", "slot");
      rect.setAttribute("x", String(i * slotW));
      rect.setAttribute("y", "0");
      rect.setAttribute("width", String(slotW));
      rect.setAttribute("height", String(H));
      rect.setAttribute("fill", "transparent");
      rect.setAttribute("stroke", cssVar("divider", "#e5e7eb"));
      rect.setAttribute("stroke-width", "0.25");
      rect.setAttribute("data-slot-hour", String(i));
      rect.addEventListener("click", () => this._emitSlot(p, isPlanned));

      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = `${new Date(p.start).toLocaleString()} · ${p.price.toFixed(2)}`;
      rect.appendChild(title);
      g.appendChild(rect);

      // Planned highlight rect
      if (isPlanned) {
        const planRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        planRect.setAttribute("class", "planned-rect");
        planRect.setAttribute("x", String(i * slotW));
        planRect.setAttribute("y", "8");
        planRect.setAttribute("width", String(slotW));
        planRect.setAttribute("height", String(H - 16));
        g.appendChild(planRect);
      }

      // Insert slot groups before the polyline so the polyline renders on top
      svgEl.insertBefore(g, svgEl.firstChild);
    }
  }

  private _onMove = (prices: PricePoint[]) => (e: MouseEvent) => {
    const svg = e.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const ratioX = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(prices.length - 1, Math.max(0, Math.floor(ratioX * prices.length)));
    const p = prices[idx];
    if (!p) return;
    const text = `${new Date(p.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${p.price.toFixed(2)}`;
    const tileRect = svg.closest(".tile")!.getBoundingClientRect();
    this._tip = {
      visible: true,
      x: e.clientX - tileRect.left,
      y: e.clientY - tileRect.top,
      text,
    };
  };

  private _onLeave = () => { this._tip = { ...this._tip, visible: false }; };

  private _emitSlot = (p: PricePoint, isPlanned: boolean) => {
    const detail: SlotClickDetail = { start: p.start, end: p.end, isPlanned, price: p.price };
    this.dispatchEvent(new CustomEvent("slot-click", { detail, bubbles: true, composed: true }));
  };

  private _prices(): PricePoint[] {
    if (!this.entities?.priceEntity) return [];
    const raw = this.hass.states[this.entities.priceEntity]?.attributes.prices;
    if (!Array.isArray(raw)) return [];
    return (raw as PricePoint[]).filter(
      (p) => p && typeof p.start === "string" && typeof p.end === "string" && typeof p.price === "number",
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-timeline": EvTimeline;
  }
}
