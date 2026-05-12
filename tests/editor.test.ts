import { describe, expect, it } from "vitest";
import "../src/editor.js";
import type { CardConfig } from "../src/types.js";

describe("editor", () => {
  it("emits a config-changed event with valid CardConfig", async () => {
    const el = document.createElement("ev-smart-charging-card-editor") as unknown as HTMLElement & {
      setConfig: (c: Partial<CardConfig>) => void;
      updateComplete: Promise<boolean>;
    };
    el.setConfig({ device_id: "abc" });
    document.body.appendChild(el);
    await el.updateComplete;

    let detail: Partial<CardConfig> | null = null;
    el.addEventListener("config-changed", (e) => {
      detail = (e as CustomEvent<{ config: Partial<CardConfig> }>).detail.config;
    });
    const root = el.shadowRoot!;
    const nameInput = root.querySelector<HTMLInputElement>('input[name="name"]')!;
    nameInput.value = "Daily";
    nameInput.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    expect(detail).toMatchObject({ device_id: "abc", name: "Daily" });
  });
});
