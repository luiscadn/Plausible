import { test, expect } from "@playwright/test";

test.describe("W2 Parrot Sim Gate: Token-by-token, Softmax Temperature & False Stamp", () => {
  test("Selecting candidates updates text, slider reweights probabilities, and false path shows stamp", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    // Jump directly to section 04 (Parrot Sim)
    await page.goto("/#04");
    await page.waitForTimeout(500);

    const parrotSlot = page.locator('[data-testid="parrot-sim-slot"]');
    await expect(parrotSlot).toBeVisible();

    // Verify initial candidates
    const candBtn0 = page.locator('[data-testid="candidate-btn-0"]');
    await expect(candBtn0).toBeVisible();
    const initialTextCand0 = await candBtn0.innerText();

    // Verify temperature slider
    const tempSlider = page.locator('input[aria-label="Temperatura Softmax"]');
    await expect(tempSlider).toBeVisible();

    // Change temperature to 0.1 (near deterministic)
    await tempSlider.fill("0.1");
    await tempSlider.dispatchEvent("change");
    await page.waitForTimeout(300);

    // Probability of top candidate should spike towards 100%
    const spikePercent = await candBtn0.locator("span.font-bold").innerText();
    expect(Number(spikePercent.replace("%", ""))).toBeGreaterThan(80);

    // Click candidate 0: "se recomienda"
    await candBtn0.click();
    await page.waitForTimeout(300);

    // Sentence box should include chosen token
    const sentenceBox = parrotSlot.locator(".min-h-\\[120px\\]");
    await expect(sentenceBox).toContainText("se recomienda");

    // Click candidate 0 of node-recomienda: "iniciar anticoagulación directa estándar" (false route)
    const candDirecta = page.locator('[data-testid="candidate-btn-0"]');
    await candDirecta.click();
    await page.waitForTimeout(300);

    // Sello "NADIE VERIFICÓ ESTO" must appear! (Gate 2)
    const stamp = page.locator('[data-testid="false-stamp"]');
    await expect(stamp).toBeVisible();
    await expect(stamp).toContainText("NADIE VERIFICÓ ESTO");

    // Click reset button
    const resetBtn = page.locator('[data-testid="reset-btn"]');
    await resetBtn.click();
    await page.waitForTimeout(200);

    // Stamp should be gone and root token restored
    await expect(stamp).not.toBeVisible();
    await expect(sentenceBox).toContainText("En paciente hospitalizado");

    expect(consoleErrors).toHaveLength(0);
  });
});
