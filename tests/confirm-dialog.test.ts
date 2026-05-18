import { describe, expect, it } from "vitest";
import "../src/components/ev-confirm-dialog.js";
import type { EvConfirmDialog } from "../src/components/ev-confirm-dialog.js";

function mount(props: Partial<EvConfirmDialog> = {}): EvConfirmDialog {
  const el = document.createElement("ev-confirm-dialog") as EvConfirmDialog;
  Object.assign(el, props);
  document.body.appendChild(el);
  return el;
}

describe("ev-confirm-dialog rendering", () => {
  it("renders nothing when open is false", async () => {
    const el = mount({ open: false, title: "T", body: "B" });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".dialog")).toBeNull();
  });

  it("renders title, body, and labels when open", async () => {
    const el = mount({
      open: true,
      title: "Force charge now?",
      body: "Ignores the price plan.",
      confirmLabel: "Charge now",
      cancelLabel: "Cancel",
    });
    await el.updateComplete;
    const root = el.shadowRoot!;
    expect(root.querySelector(".title")!.textContent).toBe("Force charge now?");
    expect(root.querySelector(".subtitle")!.textContent!.trim()).toBe("Ignores the price plan.");
    expect(root.querySelector<HTMLButtonElement>("button.primary")!.textContent!.trim()).toBe("Charge now");
    expect(root.querySelector<HTMLButtonElement>("button.cancel")!.textContent!.trim()).toBe("Cancel");
  });
});
