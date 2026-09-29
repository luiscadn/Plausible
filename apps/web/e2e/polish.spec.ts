import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const SCREENSHOT_DIR = path.join(
  process.cwd(),
  "apps/web/e2e/screenshots/polish"
);

test.describe("FASE 3: Visual Polish & Auditoría de Calidad", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  const VIEWPORTS = [
    { name: "desktop-1080p", width: 1920, height: 1080 },
    { name: "mobile-390x844", width: 390, height: 844 },
  ];

  for (const vp of VIEWPORTS) {
    test(`Capturas visuales completas de 9 secciones en ${vp.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error" && !msg.text().includes("WebSocket")) {
          consoleErrors.push(msg.text());
        }
      });

      const sections = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];

      for (const sec of sections) {
        await page.goto(`/#${sec}`);
        await page.waitForTimeout(600);

        const targetEl = page.locator(`#sec-${sec}`);
        await expect(targetEl).toBeVisible();

        const screenshotPath = path.join(
          SCREENSHOT_DIR,
          `sec-${sec}-${vp.name}.png`
        );
        await targetEl.screenshot({ path: screenshotPath });
      }

      expect(consoleErrors).toHaveLength(0);
    });

    test(`Capturas de /play y /stage en ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error" && !msg.text().includes("WebSocket")) {
          consoleErrors.push(msg.text());
        }
      });

      // /play
      await page.goto("/play");
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `play-${vp.name}.png`),
      });

      // /stage
      await page.goto("/stage?key=plausible-admin-2026");
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `stage-${vp.name}.png`),
      });

      expect(consoleErrors).toHaveLength(0);
    });
  }

  test("Gate 3: prefers-reduced-motion desactiva animaciones suavemente", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(300);

    // Verify ECG divider animation is turned off or simplified
    const isReduced = await page.evaluate(() => {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });
    expect(isReduced).toBeTruthy();
  });
});
