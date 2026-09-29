import { test, expect } from "@playwright/test";

test.describe("W1 Deck Gate: Navigation, Keyboard & Sliders Focus", () => {
  test("Navigates sections with keyboard, updates hash and verifies slider focus isolation", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    await expect(page).toHaveTitle(/PLAUSIBLE/);
    await page.locator("body").click();

    // Initial section is 01
    await expect(page.locator("header")).toContainText("SECCIÓN 01 / 09");

    // Press Space to advance to 02
    await page.keyboard.press("Space");
    await expect(page.locator("header")).toContainText("SECCIÓN 02 / 09");
    expect(page.url()).toContain("#02");

    // Press ArrowDown to advance to 03
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(300);
    await expect(page.locator("header")).toContainText("SECCIÓN 03 / 09");
    expect(page.url()).toContain("#03");

    // Jump to section 06 using number key '6'
    await page.keyboard.press("6");
    await page.waitForTimeout(300);
    await expect(page.locator("header")).toContainText("SECCIÓN 06 / 09");
    expect(page.url()).toContain("#06");

    // Fix 3: Locate slider in section 06
    const slider = page.locator("#sec-06 input[type='range']");
    await expect(slider).toBeVisible();
    await slider.focus();

    // With focus on slider, ArrowRight should change slider, NOT change deck section
    const initialVal = await slider.inputValue();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);

    // Deck must still be on section 06!
    await expect(page.locator("header")).toContainText("SECCIÓN 06 / 09");
    const newVal = await slider.inputValue();
    expect(Number(newVal)).toBeGreaterThanOrEqual(Number(initialVal));

    // Press Escape -> focus returns to deck
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);

    // Now ArrowRight advances deck to section 07
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);
    await expect(page.locator("header")).toContainText("SECCIÓN 07 / 09");

    // Jump to 09
    await page.keyboard.press("9");
    await page.waitForTimeout(300);
    await expect(page.locator("header")).toContainText("SECCIÓN 09 / 09");
    expect(page.url()).toContain("#09");

    expect(consoleErrors).toHaveLength(0);
  });
});
