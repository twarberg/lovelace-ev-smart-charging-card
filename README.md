# Smart EV Charging Card

A Lovelace custom card for the [Smart EV Charging](https://github.com/twarberg/ev-smart-charging) Home Assistant integration.

![status](https://github.com/twarberg/lovelace-ev-smart-charging-card/actions/workflows/ci.yml/badge.svg)

## Features

- Status pill, master toggle, SoC bar
- 24-hour price-and-plan timeline (click slots to skip / force-charge)
- Charge-window table with per-hour price and estimated total cost
- 30-day cost history with per-day session drawer
- 7-day SoC trend
- Action buttons (Replan, Force, Skip-until, Set deadline)
- Visual GUI editor — picks the integration's device from a dropdown
- Fully theme-aware (light / dark / community themes)
- en + da translations (string table in place; v0.1 ships English UI)

Requires `smart_ev_charging` integration version 0.2.0+.

## Install

### HACS (recommended)

1. HACS → Frontend → ⋮ → Custom repositories.
2. Add `https://github.com/twarberg/lovelace-ev-smart-charging-card` as Plugin.
3. Install **Smart EV Charging Card**.
4. Reload your dashboard.

### Manual

1. Download `ev-smart-charging-card.js` from the [latest release](https://github.com/twarberg/lovelace-ev-smart-charging-card/releases/latest).
2. Copy to `<config>/www/`.
3. Settings → Dashboards → ⋮ → Resources → Add `/local/ev-smart-charging-card.js` as a JavaScript Module.

## Configure

Edit a dashboard → Add Card → search "Smart EV Charging" → pick the device. The GUI editor handles the rest.

YAML form:

```yaml
type: custom:ev-smart-charging-card
device_id: 7f3a9d2c...
name: Daily EV
history_days: 30
soc_days: 7
```

Find your `device_id` at Settings → Devices & Services → Smart EV Charging → click the device. The URL ends in `…&device=<id>`.

## Development

```bash
npm install
npm test
npm run build
```

Bundle output at `dist/ev-smart-charging-card.js`. Symlink to your dev HA's `<config>/www/` directory for live iteration.

## License

MIT.
