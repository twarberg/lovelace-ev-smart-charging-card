import type { DeviceEntities, HassEntityRegistryEntry, HomeAssistant } from "../types.js";

const KEY_TO_FIELD: Record<string, keyof DeviceEntities> = {
  plan_status: "planStatus",
  planned_hours: "plannedHours",
  slots_needed: "slotsNeeded",
  active_deadline: "activeDeadline",
  effective_departure: "effectiveDeparture",
  plugged_in: "pluggedIn",
  actively_charging: "activelyCharging",
  charge_now: "chargeNow",
  smart_charging_enabled: "smartCharging",
};

export function discover(hass: HomeAssistant, deviceId: string): DeviceEntities {
  const ours: HassEntityRegistryEntry[] = Object.values(hass.entities).filter(
    (e) => e.device_id === deviceId && e.platform === "smart_ev_charging",
  );
  if (ours.length === 0) {
    throw new Error(`discover: no entities found for device ${deviceId}`);
  }
  const partial: Partial<DeviceEntities> = {};
  for (const entry of ours) {
    const key = entry.translation_key ?? deriveKey(entry.unique_id);
    if (!key) continue;
    const field = KEY_TO_FIELD[key];
    if (field) (partial as Record<string, unknown>)[field] = entry.entity_id;
  }
  const required: (keyof DeviceEntities)[] = [
    "planStatus",
    "plannedHours",
    "slotsNeeded",
    "activeDeadline",
    "effectiveDeparture",
    "pluggedIn",
    "activelyCharging",
    "chargeNow",
    "smartCharging",
  ];
  for (const r of required) {
    if (!partial[r]) throw new Error(`discover: missing entity for ${r} on device ${deviceId}`);
  }

  const planStatusState = hass.states[partial.planStatus!];
  const attrs = planStatusState?.attributes ?? {};
  const priceEntity = pickString(attrs.source_price_entity);
  const chargerKw = pickNumber(attrs.charger_kw);
  const socEntity = pickString(attrs.soc_entity);
  const targetSocEntity = pickString(attrs.target_soc_entity);

  return {
    ...partial,
    ...(priceEntity ? { priceEntity } : {}),
    ...(chargerKw !== undefined ? { chargerKw } : {}),
    ...(socEntity ? { socEntity } : {}),
    ...(targetSocEntity ? { targetSocEntity } : {}),
  } as DeviceEntities;
}

function deriveKey(uniqueId: string): string | null {
  const idx = uniqueId.indexOf("_");
  return idx >= 0 ? uniqueId.slice(idx + 1) : null;
}

function pickString(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function pickNumber(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}
