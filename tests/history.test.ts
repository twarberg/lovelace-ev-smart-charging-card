import { describe, expect, it } from "vitest";
import { attachCost, detectSessions, mergePrices, pricesFromStateHistory, rollupByDay } from "../src/lib/history.js";

describe("detectSessions", () => {
  it("groups contiguous on-runs of charge_now into sessions", () => {
    const series = [
      { state: "off", t: "2026-05-01T00:00:00Z" },
      { state: "on", t: "2026-05-01T02:00:00Z" },
      { state: "on", t: "2026-05-01T03:00:00Z" },
      { state: "off", t: "2026-05-01T05:00:00Z" },
      { state: "on", t: "2026-05-02T02:00:00Z" },
      { state: "off", t: "2026-05-02T04:00:00Z" },
    ];
    const sessions = detectSessions(series);
    expect(sessions).toHaveLength(2);
    expect(sessions[0]).toMatchObject({
      start: "2026-05-01T02:00:00Z",
      end: "2026-05-01T05:00:00Z",
      durationHours: 3,
    });
    expect(sessions[1]?.durationHours).toBe(2);
  });

  it("handles an unfinished trailing session as ending at the series end", () => {
    const series = [
      { state: "off", t: "2026-05-01T00:00:00Z" },
      { state: "on", t: "2026-05-01T02:00:00Z" },
    ];
    const sessions = detectSessions(series, "2026-05-01T04:00:00Z");
    expect(sessions[0]).toMatchObject({ durationHours: 2 });
  });

  it("returns empty array when never charged", () => {
    expect(detectSessions([{ state: "off", t: "x" }])).toEqual([]);
  });
});

describe("rollupByDay", () => {
  it("buckets sessions by local-day start date", () => {
    const buckets = rollupByDay([
      { start: "2026-05-01T02:00:00Z", end: "2026-05-01T05:00:00Z", durationHours: 3, cost: 9.0 },
      { start: "2026-05-01T22:00:00Z", end: "2026-05-02T02:00:00Z", durationHours: 4, cost: 5.0 },
      { start: "2026-05-02T03:00:00Z", end: "2026-05-02T05:00:00Z", durationHours: 2, cost: 4.5 },
    ]);
    expect(buckets.find((b) => b.date === "2026-05-01")?.cost).toBeCloseTo(9.0 + 5.0, 5);
    expect(buckets.find((b) => b.date === "2026-05-02")?.cost).toBeCloseTo(4.5, 5);
  });
});

describe("pricesFromStateHistory", () => {
  it("turns numeric state samples into step price points", () => {
    const pts = pricesFromStateHistory(
      [
        { state: "1.5", t: "2026-05-01T00:00:00.000Z" },
        { state: "unavailable", t: "2026-05-01T01:00:00.000Z" },
        { state: "2.0", t: "2026-05-01T02:00:00.000Z" },
      ],
      "2026-05-01T03:00:00.000Z",
    );
    expect(pts).toEqual([
      { start: "2026-05-01T00:00:00.000Z", end: "2026-05-01T01:00:00.000Z", price: 1.5 },
      { start: "2026-05-01T02:00:00.000Z", end: "2026-05-01T03:00:00.000Z", price: 2.0 },
    ]);
  });
});

describe("mergePrices", () => {
  const forecast = [{ start: "2026-05-02T00:00:00.000Z", end: "2026-05-02T01:00:00.000Z", price: 3 }];

  it("keeps history only before the forecast window", () => {
    const history = [
      { start: "2026-05-01T23:00:00.000Z", end: "2026-05-02T00:30:00.000Z", price: 1 },
    ];
    expect(mergePrices(forecast, history)).toEqual([
      { start: "2026-05-01T23:00:00.000Z", end: "2026-05-02T00:00:00.000Z", price: 1 },
      ...forecast,
    ]);
  });

  it("prices an old session from history instead of zero", () => {
    const history = [
      { start: "2026-04-20T00:00:00.000Z", end: "2026-04-20T02:00:00.000Z", price: 2 },
    ];
    const [s] = attachCost(
      [{ start: "2026-04-20T00:00:00.000Z", end: "2026-04-20T01:00:00.000Z", durationHours: 1 }],
      mergePrices(forecast, history),
      10,
    );
    expect(s!.cost).toBe(20);
  });

  it("returns history alone when there is no forecast", () => {
    const history = [{ start: "2026-04-20T00:00:00.000Z", end: "2026-04-20T01:00:00.000Z", price: 2 }];
    expect(mergePrices([], history)).toEqual(history);
  });
});
