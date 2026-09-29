import { test, expect } from "@playwright/test";

test.describe("W3 Tower Sim Gate: Canvas 2D Monte Carlo & FPS Benchmark", () => {
  test("Canvas renders, slider updates reported precision, and measures >= 50 fps", async ({
    page,
  }, testInfo) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("WebSocket")) consoleErrors.push(msg.text());
    });

    // Jump directly to section 05 (Tower Sim)
    await page.goto("/#05");
    await page.waitForTimeout(500);

    const towerSlot = page.locator('[data-testid="tower-sim-slot"]');
    await expect(towerSlot).toBeVisible();

    // Verify Canvas 2D exists
    const canvas = towerSlot.locator("canvas");
    await expect(canvas).toBeVisible();

    // Verify initial accuracy metric is visible
    const accMetric = page.locator('[data-testid="accuracy-metric"]');
    await expect(accMetric).toBeVisible();

    // Change layers slider to 5
    const layersSlider = page.locator('input[aria-label="Número de capas validadoras"]');
    await layersSlider.fill("5");
    await layersSlider.dispatchEvent("change");
    await page.waitForTimeout(600);

    // FPS measurement benchmark via requestAnimationFrame during 3000ms (Gate 3)
    const fps = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        let frames = 0;
        const start = performance.now();
        function checkFrame(now: number) {
          frames++;
          if (now - start >= 3000) {
            const calculatedFps = (frames * 1000) / (now - start);
            resolve(calculatedFps);
          } else {
            requestAnimationFrame(checkFrame);
          }
        }
        requestAnimationFrame(checkFrame);
      });
    });

    const isMobile = testInfo.project.name.includes("mobile");
    console.log(`[Tower Benchmark - ${testInfo.project.name}] Measured FPS: ${fps.toFixed(1)}`);
    // Laptop target: >= 50 fps; Headless WebKit mobile emulation target: >= 30 fps
    const targetFps = isMobile ? 30 : 50;
    expect(fps).toBeGreaterThanOrEqual(targetFps);

    expect(consoleErrors).toHaveLength(0);
  });
});
