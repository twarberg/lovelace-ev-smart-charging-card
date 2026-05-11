import type { HomeAssistant } from "../types.js";

export interface StateSample {
  state: string;
  t: string;
}

export interface Session {
  start: string;
  end: string;
  durationHours: number;
  cost?: number;
  kwh?: number;
}

export interface DayBucket {
  date: string;
  cost: number;
  sessions: Session[];
}

export interface PricePoint {
  start: string;
  end: string;
  price: number;
}

export function detectSessions(series: StateSample[], seriesEnd?: string): Session[] {
  const out: Session[] = [];
  let runStart: string | null = null;
  for (const s of series) {
    if (s.state === "on" && runStart === null) {
      runStart = s.t;
    } else if (s.state !== "on" && runStart !== null) {
      out.push(makeSession(runStart, s.t));
      runStart = null;
    }
  }
  if (runStart !== null) {
    const end = seriesEnd ?? new Date().toISOString();
    out.push(makeSession(runStart, end));
  }
  return out;
}

function makeSession(start: string, end: string): Session {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const durationHours = Math.max(0, ms / 3_600_000);
  return { start, end, durationHours };
}

export function priceOverRun(prices: PricePoint[], start: string, end: string): number {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  let weighted = 0;
  let totalHours = 0;
  for (const p of prices) {
    const ps = new Date(p.start).getTime();
    const pe = new Date(p.end).getTime();
    const overlapMs = Math.max(0, Math.min(b, pe) - Math.max(a, ps));
    if (overlapMs === 0) continue;
    const h = overlapMs / 3_600_000;
    weighted += p.price * h;
    totalHours += h;
  }
  return totalHours > 0 ? weighted / totalHours : 0;
}

export function attachCost(sessions: Session[], prices: PricePoint[], chargerKw: number): Session[] {
  return sessions.map((s) => {
    const avgPrice = priceOverRun(prices, s.start, s.end);
    const kwh = s.durationHours * chargerKw;
    return { ...s, kwh, cost: kwh * avgPrice };
  });
}

export function rollupByDay(sessions: Session[]): DayBucket[] {
  const map = new Map<string, DayBucket>();
  for (const s of sessions) {
    const date = new Date(s.start).toISOString().slice(0, 10);
    const bucket = map.get(date) ?? { date, cost: 0, sessions: [] };
    bucket.cost += s.cost ?? 0;
    bucket.sessions.push(s);
    map.set(date, bucket);
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchHistory(
  hass: HomeAssistant,
  entityIds: string[],
  start: Date,
  end: Date,
): Promise<Record<string, StateSample[]>> {
  const res = await hass.callWS<Record<string, Array<{ s: string; lu: number }>>>({
    type: "history/history_during_period",
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    entity_ids: entityIds,
    minimal_response: true,
    no_attributes: true,
  });
  const out: Record<string, StateSample[]> = {};
  for (const [eid, items] of Object.entries(res)) {
    out[eid] = items.map((it) => ({ state: it.s, t: new Date(it.lu * 1000).toISOString() }));
  }
  return out;
}
