import { beforeEach, describe, expect, it } from "vitest";
import "../src/components/ev-confirm-dialog.js";
import type { EvConfirmDialog } from "../src/components/ev-confirm-dialog.js";

function mount(props: Partial<EvConfirmDialog> = {}): EvConfirmDialog {
  const el = document.createElement("ev-confirm-dialog") as EvConfirmDialog;
  Object.assign(el, props);
  document.body.appendChild(el);
  return el;
}

beforeEach(() => {
  // happy-dom's ShadowRoot.activeElement getter walks getRootNode() across
  // shadow boundaries and crashes when a previous test left focus on a
  // button inside a now-detached/orphan shadow tree. Clear the DOM and any
  // lingering focus between tests so each test starts isolated.
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  document.body.innerHTML = "";
});

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

describe("ev-confirm-dialog events", () => {
  it("primary click dispatches confirm-accept and closes", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;
    const accepts: Event[] = [];
    el.addEventListener("confirm-accept", (e) => accepts.push(e));

    el.shadowRoot!.querySelector<HTMLButtonElement>("button.primary")!.click();
    await el.updateComplete;

    expect(accepts.length).toBe(1);
    expect(el.open).toBe(false);
  });

  it("cancel click dispatches confirm-cancel and closes", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;
    const cancels: Event[] = [];
    el.addEventListener("confirm-cancel", (e) => cancels.push(e));

    el.shadowRoot!.querySelector<HTMLButtonElement>("button.cancel")!.click();
    await el.updateComplete;

    expect(cancels.length).toBe(1);
    expect(el.open).toBe(false);
  });

  it("backdrop click cancels", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;
    const cancels: Event[] = [];
    el.addEventListener("confirm-cancel", (e) => cancels.push(e));

    el.shadowRoot!.querySelector<HTMLElement>(".backdrop")!.click();
    await el.updateComplete;

    expect(cancels.length).toBe(1);
    expect(el.open).toBe(false);
  });

  it("clicking inside the dialog does not cancel", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;
    const cancels: Event[] = [];
    el.addEventListener("confirm-cancel", (e) => cancels.push(e));

    el.shadowRoot!.querySelector<HTMLElement>(".dialog")!.click();
    await el.updateComplete;

    expect(cancels.length).toBe(0);
    expect(el.open).toBe(true);
  });
});

describe("ev-confirm-dialog tone variants", () => {
  it("applies warning-tone class when tone='warning'", async () => {
    const el = mount({ open: true, title: "T", body: "B", tone: "warning" });
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.primary")!;
    expect(btn.classList.contains("warning-tone")).toBe(true);
    expect(btn.classList.contains("primary-tone")).toBe(false);
  });

  it("defaults to primary-tone", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.primary")!;
    expect(btn.classList.contains("primary-tone")).toBe(true);
  });
});

describe("ev-confirm-dialog keyboard a11y", () => {
  it("focuses the primary button when open flips to true", async () => {
    const el = mount({ open: false, title: "T", body: "B" });
    await el.updateComplete;

    el.open = true;
    await el.updateComplete;
    // updated() schedules focus; allow a microtask for it.
    await Promise.resolve();

    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.primary")!;
    expect(el.shadowRoot!.activeElement).toBe(btn);
  });

  it("does not move focus while open stays false", async () => {
    const el = mount({ open: false, title: "T", body: "B" });
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement).toBeNull();
  });

  it("Escape key triggers confirm-cancel and closes", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;
    const cancels: Event[] = [];
    el.addEventListener("confirm-cancel", (e) => cancels.push(e));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;

    expect(cancels.length).toBe(1);
    expect(el.open).toBe(false);
  });

  it("Escape key does nothing when dialog is closed", async () => {
    const el = mount({ open: false, title: "T", body: "B" });
    await el.updateComplete;
    const cancels: Event[] = [];
    el.addEventListener("confirm-cancel", (e) => cancels.push(e));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;

    expect(cancels.length).toBe(0);
  });

  it("removes the Escape listener after closing to avoid leaks", async () => {
    const el = mount({ open: true, title: "T", body: "B" });
    await el.updateComplete;

    // Cancel via primary first → open=false → listener should detach.
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.cancel")!.click();
    await el.updateComplete;

    const cancels: Event[] = [];
    el.addEventListener("confirm-cancel", (e) => cancels.push(e));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;

    expect(cancels.length).toBe(0);
  });
});
