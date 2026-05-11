import { describe, expect, it } from "vitest";
import { detectSessions, rollupByDay } from "../src/lib/history.js";

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
