// Subset of the Home Assistant frontend API the card relies on.
// We deliberately keep this self-contained (no @types/home-assistant)
// because HA's frontend types aren't published as a package.

export type HassEntityAttribute = Record<string, unknown>;

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: HassEntityAttribute;
  last_changed: string;
  last_updated: string;
}

export interface HassEntityRegistryEntry {
  entity_id: string;
  device_id: string | null;
  config_entry_id: string | null;
  translation_key: string | null;
  platform: string;
  unique_id: string;
  original_name: string | null;
}

export interface HassConnection {
  subscribeEvents<T = unknown>(
    callback: (event: { event_type: string; data: T }) => void,
    eventType: string,
  ): Promise<() => Promise<void>>;
}

export interface HassLocale {
  language: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, HassEntityRegistryEntry>;
  connection: HassConnection;
  locale: HassLocale;
  callService(domain: string, service: string, serviceData?: Record<string, unknown>, target?: { entity_id?: string; device_id?: string }): Promise<void>;
  callWS<T = unknown>(msg: Record<string, unknown>): Promise<T>;
}

export type ShowTile = "status" | "timeline" | "window" | "history" | "soc" | "actions";

export interface CardConfig {
  type: string;
  device_id: string;
  name?: string;
  show?: ShowTile[];
  history_days?: number;
  soc_days?: number;
  timeline_hours?: number;
  theme?: "auto" | "light" | "dark";
  helper_entity?: string;
  language?: "auto" | "en" | "da";
}

export interface DeviceEntities {
  planStatus: string;
  plannedHours: string;
  slotsNeeded: string;
  activeDeadline: string;
  effectiveDeparture: string;
  pluggedIn: string;
  activelyCharging: string;
  chargeNow: string;
  smartCharging: string;
  socEntity?: string;
  targetSocEntity?: string;
  priceEntity?: string;
  chargerKw?: number;
  minSocThreshold?: number;
}
