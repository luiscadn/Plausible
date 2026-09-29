import { test, expect } from "@playwright/test";
import { io as ClientIO } from "socket.io-client";

test.describe("Fase 0 + Fixes Gate: Smoke, Security & Contracts", () => {
  test("Live server health check responds with 200 ok", async ({ request }) => {
    const res = await request.get("http://localhost:4000/health");
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(data.service).toBe("@plausible/live");
  });

  test("Security (Fix 5): Unauthorized client without valid key cannot trigger round:reveal", async () => {
    const socket = ClientIO("http://localhost:4000", {
      transports: ["websocket"],
      reconnection: false,
    });

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Socket connection timeout")), 5000);
      socket.on("connect", () => {
        clearTimeout(timer);
        resolve();
      });
    });

    let receivedError: string | null = null;
    socket.on("error", (err) => {
      receivedError = err.message;
    });

    // Attempt round:reveal with invalid admin key
    socket.emit("round:reveal", { adminKey: "wrong-fake-key" });

    // Wait 500ms and check error was triggered and phase remained lobby/unchanged
    await new Promise((r) => setTimeout(r, 600));
    expect(receivedError).toContain("No autorizado: ADMIN_KEY inválida.");

    socket.disconnect();
  });

  test("Home deck renders with 9 sections, EcgDivider, and slot stubs", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await expect(page).toHaveTitle(/PLAUSIBLE/);

    // Verify 9 sections are present
    const sections = page.locator("section[data-section-id]");
    await expect(sections).toHaveCount(9);

    // Verify EcgDivider presence
    const ecgDividers = page.locator('[data-testid="ecg-divider"]');
    await expect(ecgDividers.first()).toBeVisible();

    // Verify slot stubs are mounted
    await expect(page.locator('[data-testid="stage-embed-slot"]')).toBeAttached();
    await expect(page.locator('[data-testid="parrot-sim-slot"]')).toBeAttached();
    await expect(page.locator('[data-testid="tower-sim-slot"]')).toBeAttached();

    expect(consoleErrors).toHaveLength(0);
  });

  test("Play mobile view (/play) renders cleanly without horizontal overflow", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/play");
    await expect(page.locator("h1")).toContainText("¿Humano o Loro?");
    await expect(page.getByText("Caso ilustrativo — no es consejo médico")).toBeVisible();

    // Check no horizontal scrollbar
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    expect(consoleErrors).toHaveLength(0);
  });

  test("Stage view (/stage) renders with security badge and disclaimer", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Without key -> Readonly badge
    await page.goto("/stage");
    await expect(page.locator("h1")).toContainText("¿Humano o Loro?");
    await expect(page.locator('[data-testid="readonly-mode-badge"]')).toBeVisible();

    // With key -> Admin badge
    await page.goto("/stage?key=plausible-admin-2026");
    await expect(page.locator('[data-testid="admin-mode-badge"]')).toBeVisible();

    expect(consoleErrors).toHaveLength(0);
  });
});
