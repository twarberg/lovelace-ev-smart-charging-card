import type { HassEntity, HassEntityRegistryEntry, HomeAssistant } from "../../src/types.js";

export interface StubOpts {
  deviceId?: string;
  entries?: Partial<Record<string, Partial<HassEntityRegistryEntry>>>;
  states?: Partial<Record<string, Partial<HassEntity>>>;
}

const DEFAULT_DEVICE = "test_dev";
const KEYS = [
  "plan_status",
  "planned_hours",
  "slots_needed",
  "active_deadline",
  "effective_departure",
  "plugged_in",
  "actively_charging",
  "charge_now",
  "smart_charging_enabled",
];

export function stubHass(opts: StubOpts = {}): HomeAssistant {
  const deviceId = opts.deviceId ?? DEFAULT_DEVICE;
  const entries: Record<string, HassEntityRegistryEntry> = {};
  const states: Record<string, HassEntity> = {};
  for (const key of KEYS) {
    const platform =
      key === "smart_charging_enabled"
        ? "switch"
        : key.endsWith("_in") || key === "actively_charging" || key === "charge_now"
          ? "binary_sensor"
          : "sensor";
    const entityId = `${platform}.daily_${key}`;
    entries[entityId] = {
      entity_id: entityId,
      device_id: deviceId,
      config_entry_id: "entry_x",
      translation_key: key,
      platform: "smart_ev_charging",
      unique_id: `entry_x_${key}`,
      original_name: null,
      ...opts.entries?.[entityId],
    };
    states[entityId] = {
      entity_id: entityId,
      state: "ok",
      attributes: {},
      last_changed: new Date(0).toISOString(),
      last_updated: new Date(0).toISOString(),
      ...opts.states?.[entityId],
    };
  }
  // PlanStatusSensor carries the discovery hints (only when caller hasn't overridden attributes)
  const planStatusOverride = opts.states?.["sensor.daily_plan_status"];
  if (!planStatusOverride || !("attributes" in planStatusOverride)) {
    const existing = states["sensor.daily_plan_status"]!;
    states["sensor.daily_plan_status"] = {
      entity_id: existing.entity_id,
      state: existing.state,
      last_changed: existing.last_changed,
      last_updated: existing.last_updated,
      attributes: {
        source_price_entity: "sensor.test_prices",
        charger_kw: 11.0,
        soc_entity: "sensor.test_soc",
        target_soc_entity: "number.test_target",
      },
    };
  }
  // Merge in any extra states (e.g. sensor.test_prices) that aren't in the KEYS list
  for (const [entityId, partial] of Object.entries(opts.states ?? {})) {
    if (!(entityId in states)) {
      states[entityId] = {
        entity_id: entityId,
        state: "ok",
        attributes: {},
        last_changed: new Date(0).toISOString(),
        last_updated: new Date(0).toISOString(),
        ...partial,
      };
    }
  }

  return {
    states,
    entities: entries,
    connection: { subscribeEvents: async () => async () => {} },
    locale: { language: "en" },
    callService: async () => {},
    callWS: async <T>(): Promise<T> => ({} as T),
  };
}
