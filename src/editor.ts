import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CardConfig, HomeAssistant, ShowTile } from "./types.js";

const ALL_TILES: ShowTile[] = ["status", "timeline", "window", "history", "soc", "actions"];

@customElement("ev-smart-charging-card-editor")
export class EvSmartChargingCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config: Partial<CardConfig> = {};

  setConfig(config: Partial<CardConfig>) {
    this._config = { ...config };
  }

  static override styles = css`
    :host { display: block; padding: 12px; }
    label { display: block; margin-top: 8px; font-size: 0.9em; }
    input[type="text"], input[type="number"], select { width: 100%; padding: 4px; margin-top: 2px; box-sizing: border-box; }
    fieldset { border: 1px solid #ddd; padding: 8px; margin-top: 8px; }
    legend { font-size: 0.85em; }
    label.inline { display: inline-flex; align-items: center; gap: 4px; margin-right: 8px; }
    .hint { display: block; font-size: 0.78em; color: #6b7280; margin-top: 2px; line-height: 1.3; }
  `;

  override render() {
    return html`
      <label>Device
        ${this.hass
          ? html`
              <ha-selector
                .hass=${this.hass}
                .selector=${{ device: { integration: "smart_ev_charging" } }}
                .value=${this._config.device_id ?? ""}
                @value-changed=${this._onDeviceChanged}
              ></ha-selector>
            `
          : html`<input type="text" name="device_id" .value=${this._config.device_id ?? ""}
              @input=${this._setField("device_id")} />`}
        <span class="hint">Pick the Smart EV Charging device (one per car / charger combination).</span>
      </label>
      <label>Name (optional)
        <input type="text" name="name" .value=${this._config.name ?? ""}
          @input=${this._setField("name")} />
        <span class="hint">Display title above the card. Defaults to the device name.</span>
      </label>
      <label>History days (7–90)
        <input type="number" name="history_days" min="7" max="90"
          .value=${String(this._config.history_days ?? 30)}
          @input=${this._setNumber("history_days")} />
        <span class="hint">How many days of past charging sessions to show in the cost-history chart. Higher = more bars, slower load.</span>
      </label>
      <label>SoC days (1–30)
        <input type="number" name="soc_days" min="1" max="30"
          .value=${String(this._config.soc_days ?? 7)}
          @input=${this._setNumber("soc_days")} />
        <span class="hint">How many days of state-of-charge history to plot. Only shown if the integration is configured with a SoC sensor.</span>
      </label>
      <label>Helper entity (optional)
        <input type="text" name="helper_entity" .value=${this._config.helper_entity ?? ""}
          @input=${this._setField("helper_entity")} />
        <span class="hint">If you use an input_datetime helper + automation to apply one-off deadlines, point at it here. Leave blank to call the service directly.</span>
      </label>
      <fieldset>
        <legend>Show tiles</legend>
        <span class="hint">Toggle which tiles render in the card.</span>
        ${ALL_TILES.map((t) => html`
          <label class="inline">
            <input type="checkbox" name="show_${t}"
              .checked=${(this._config.show ?? ALL_TILES).includes(t)}
              @change=${this._toggleTile(t)} /> ${t}
          </label>
        `)}
      </fieldset>
    `;
  }

  private _emit() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  private _onDeviceChanged = (e: CustomEvent<{ value: string }>) => {
    const v = e.detail.value;
    this._config = { ...this._config, device_id: v || "" };
    this._emit();
  };

  private _setField = (key: keyof CardConfig) => (e: Event) => {
    const v = (e.target as HTMLInputElement).value;
    this._config = { ...this._config, [key]: v || undefined };
    this._emit();
  };

  private _setNumber = (key: keyof CardConfig) => (e: Event) => {
    const v = Number((e.target as HTMLInputElement).value);
    this._config = { ...this._config, [key]: Number.isFinite(v) ? v : undefined };
    this._emit();
  };

  private _toggleTile = (tile: ShowTile) => (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    const current = new Set(this._config.show ?? ALL_TILES);
    if (checked) current.add(tile);
    else current.delete(tile);
    this._config = { ...this._config, show: [...current] };
    this._emit();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "ev-smart-charging-card-editor": EvSmartChargingCardEditor;
  }
}
