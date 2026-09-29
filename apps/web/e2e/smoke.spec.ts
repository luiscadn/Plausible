import { test, expect } from "@playwright/test";

test.describe("Fase 0: Smoke & Foundations Gate", () => {
  test("Live server health check responds with 200 ok", async ({ request }) => {
    const res = await request.get("http://localhost:4000/health");
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(data.service).toBe("@plausible/live");
  });

  test("Home deck loads without console errors and contains 9 sections and ECG divider", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await expect(page).toHaveTitle(/PLAUSIBLE/);

    // Verify EcgDivider presence
    const ecgDividers = page.locator('[data-testid="ecg-divider"]');
    await expect(ecgDividers.first()).toBeVisible();

    // Verify 9 sections are present
    const sections = page.locator("section[data-section-id]");
    await expect(sections).toHaveCount(9);

    // Verify no console errors
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

  test("Stage view (/stage) renders cleanly", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/stage");
    await expect(page.locator("h1")).toContainText("¿Humano o Loro?");
    expect(consoleErrors).toHaveLength(0);
  });
});
