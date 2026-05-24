# Active Charge Visibility

## Problem

Users cannot easily tell at a glance that the car is actually drawing power right now. The `actively_charging` binary_sensor is wired through `discover.ts` but is not surfaced in any UI affordance. The `Charge now` button stays the primary action even while charging is in progress, with no quick way to stop a plan-driven charge.

## Goal

Make active charging unmistakably visible, and turn `Charge now` into `Stop charge` when charging is currently flowing.

## Definitions

- **chargingNow** — `hass.states[entities.activelyCharging]?.state === "on"`. Source of truth for "current is flowing right now," regardless of whether it came from the smart plan, a force override, or manual.
- **forceActive** — existing: `planStatus.attributes.override_mode === "force"`.
- **cancelled** — existing: `planStatus.state === "cancelled"` (user flipped the master switch off).

## UI Changes

### 1. Status tile (`src/components/ev-status.ts`)

Add a "Charging now" pill in `.controls`, rendered to the left of the existing plan-status pill, only when `chargingNow` is true.

- Background: green tint (`rgba(34,197,94,0.22)`), foreground: `cssVar("success", "#16a34a")`.
- Leading dot: animated pulse via `@keyframes` (scale + opacity, ~1.2s cycle).
- Label: `t("status.charging_now")` (default "Charging now").
- aria-label: same text.

Add an animated shimmer to `.soc-fill` when `chargingNow`:

- New class `.soc-fill.charging` adds a `::before` overlay with a diagonal striped gradient that translates horizontally (~2s loop). Honors `prefers-reduced-motion: reduce` by disabling the keyframes.

### 2. Active-charge banner (`src/components/ev-actions.ts`)

Above the buttons, when `chargingNow && !cancelled`, render a full-width banner reusing `.banner` styling with green tint instead of red.

- Icon: `mdi:flash`.
- Text: `t("status.charging_now_banner")` (default "Charging now").
- New class `.banner-charging` overrides the red background/color with green equivalents.

The existing cancelled banner takes precedence when `cancelled` is true (cancelled implies charging is not flowing).

### 3. Stop-charge button (`src/components/ev-actions.ts`)

Replace existing button-precedence with:

1. `cancelled` → Resume button (unchanged).
2. `chargingNow && forceActive` → "Stop force charge" → `resume_plan` (unchanged).
3. `chargingNow && !forceActive` → **NEW** "Stop charge" button.
   - Class: `.stop` (new), red tint matching the existing `.stop-force` palette.
   - Icon: `mdi:stop-circle-outline`.
   - Label: `t("actions.stop_charge")` (default "Stop charge").
   - Action: `hass.callService("switch", "turn_off", undefined, { entity_id: entities.smartCharging })`. Use `turn_off` (not `toggle`) so the action is idempotent if the user double-taps.
   - Confirmation: none. Stop is reversible via Resume.
4. else → "Charge now" (unchanged, including unplugged-disabled).

## i18n

Add to `src/lang/en.json` and `src/lang/da.json`:

- `status.charging_now`
- `status.charging_now_banner`
- `actions.stop_charge`

English defaults are the strings in this spec. Danish: translate equivalents (e.g. "Oplader nu", "Stop opladning").

## Edge cases

- **Cancelled wins over chargingNow.** If `cancelled` is true the cancelled banner + Resume button render; the charging-now banner and Stop-charge button do not. (Defensive: cancelled means charging shouldn't be flowing, but if the sensor briefly lags we still show the cancelled affordance to avoid contradicting the user's action.)
- **Force + chargingNow.** Force-charge takes precedence for the button (Stop force charge). The charging-now pill and SoC shimmer still render. The existing Force-charging badge remains; both badges are fine — they convey different facts.
- **Unplugged + chargingNow.** Impossible by physics; if the sensors disagree, trust `activelyCharging` for the pill/shimmer and the existing `unplugged` flag for the Charge-now disabled state.
- **`prefers-reduced-motion`.** Pulse and shimmer keyframes wrapped in `@media (prefers-reduced-motion: no-preference)` so they're off by default for users who request reduced motion.

## Tests (`tests/`)

Extend the existing vitest suites:

- `tests/status.test.ts` (or wherever ev-status is covered today; create if missing):
  - Renders "Charging now" pill when `activelyCharging` is on; absent when off.
  - SoC fill has `.charging` class when on; not when off.
- `tests/actions.test.ts`:
  - `chargingNow && !forceActive && !cancelled` → Stop-charge button is rendered; clicking it calls `switch.turn_off` on `smartCharging`.
  - `chargingNow && forceActive` → Stop force-charge button still rendered (no regression).
  - `chargingNow && !cancelled` → charging-now banner rendered.
  - `cancelled` → cancelled banner rendered, charging-now banner suppressed, Resume button shown.

## Non-goals

- No changes to the integration. All wiring uses existing entities and services.
- No live kW readout in the pill/banner. (Can be added later if `activelyCharging` exposes a power attribute; not in scope here.)
- No new override service ("skip"). Stop reuses the master-switch path.
