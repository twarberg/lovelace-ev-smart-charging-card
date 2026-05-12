import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CardConfig, ShowTile } from "./types.js";

const ALL_TILES: ShowTile[] = ["status", "timeline", "window", "history", "soc", "actions"];

@customElement("ev-smart-charging-card-editor")
export class EvSmartChargingCardEditor extends LitElement {
  @property({ attribute: false }) hass?: unknown;
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
  `;

  override render() {
    return html`
      <label>Device ID
        <input type="text" name="device_id" .value=${this._config.device_id ?? ""}
          @input=${this._setField("device_id")} />
      </label>
      <label>Name (optional)
        <input type="text" name="name" .value=${this._config.name ?? ""}
          @input=${this._setField("name")} />
      </label>
      <label>History days (7–90)
        <input type="number" name="history_days" min="7" max="90"
          .value=${String(this._config.history_days ?? 30)}
          @input=${this._setNumber("history_days")} />
      </label>
      <label>SoC days (1–30)
        <input type="number" name="soc_days" min="1" max="30"
          .value=${String(this._config.soc_days ?? 7)}
          @input=${this._setNumber("soc_days")} />
      </label>
      <label>Helper entity (optional)
        <input type="text" name="helper_entity" .value=${this._config.helper_entity ?? ""}
          @input=${this._setField("helper_entity")} />
      </label>
      <fieldset>
        <legend>Show tiles</legend>
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
