import { describe, expect, it } from "vitest";
import { discover } from "../src/lib/discover.js";
import { stubHass } from "./helpers/stub-hass.js";

describe("discover", () => {
  it("resolves all required entities from a device id", () => {
    const hass = stubHass();
    const d = discover(hass, "test_dev");
    expect(d.planStatus).toBe("sensor.daily_plan_status");
    expect(d.plannedHours).toBe("sensor.daily_planned_hours");
    expect(d.smartCharging).toBe("switch.daily_smart_charging_enabled");
    expect(d.chargeNow).toBe("binary_sensor.daily_charge_now");
  });

  it("reads optional source entities from plan_status attributes", () => {
    const hass = stubHass();
    const d = discover(hass, "test_dev");
    expect(d.priceEntity).toBe("sensor.test_prices");
    expect(d.chargerKw).toBe(11.0);
    expect(d.socEntity).toBe("sensor.test_soc");
    expect(d.targetSocEntity).toBe("number.test_target");
    expect(d.minSocThreshold).toBe(100);
  });

  it("reads min_soc_threshold from plan_status when configured below 100", () => {
    const hass = stubHass({
      states: {
        "sensor.daily_plan_status": {
          attributes: {
            source_price_entity: "sensor.test_prices",
            charger_kw: 11.0,
            soc_entity: "sensor.test_soc",
            target_soc_entity: "number.test_target",
            min_soc_threshold: 80,
            min_soc_gate_active: true,
          },
        },
      },
    });
    const d = discover(hass, "test_dev");
    expect(d.minSocThreshold).toBe(80);
  });

  it("returns undefined source entities when plan_status attrs missing", () => {
    const hass = stubHass({
      states: { "sensor.daily_plan_status": { attributes: {} } },
    });
    const d = discover(hass, "test_dev");
    expect(d.priceEntity).toBeUndefined();
    expect(d.chargerKw).toBeUndefined();
    expect(d.socEntity).toBeUndefined();
    expect(d.minSocThreshold).toBeUndefined();
  });

  it("throws when device has no integration entities", () => {
    const hass = stubHass({ deviceId: "other" });
    expect(() => discover(hass, "test_dev")).toThrow(/no entities/i);
  });
});
