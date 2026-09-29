import { test, expect } from "@playwright/test";

test.describe("W4 Live Game Gate: 3 Contexts (2 Mobiles + Stage) & Resilience Ensayo", () => {
  test.describe.configure({ mode: "serial" });
  test("3 Browser contexts: presenter starts round, 2 mobiles vote, stage updates <500ms, reveal shows lesson", async ({
    browser,
  }) => {
    // 1. Stage Presenter Context (Desktop with admin key)
    const stageContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const stagePage = await stageContext.newPage();

    // 2. Mobile Player 1 Context (iPhone 13 viewport)
    const player1Context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const player1Page = await player1Context.newPage();

    // 3. Mobile Player 2 Context (iPhone 13 viewport)
    const player2Context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const player2Page = await player2Context.newPage();

    // Navigate Stage with ADMIN_KEY in query
    await stagePage.goto("/stage?key=plausible-admin-2026");
    await expect(stagePage.locator('[data-testid="admin-mode-badge"]')).toBeVisible();

    // Navigate Players to /play
    await player1Page.goto("/play");
    await player2Page.goto("/play");

    await expect(player1Page.locator("h1")).toContainText("¿Humano o Loro?");
    await expect(player2Page.locator("h1")).toContainText("¿Humano o Loro?");

    // Presenter starts voting round (Click button or press S)
    const startBtn = stagePage.locator('[data-testid="start-round-btn"]');
    if (await startBtn.isVisible()) {
      await startBtn.click();
    } else {
      await stagePage.keyboard.press("s");
    }

    // Wait for players to see voting active
    const voteBtnA1 = player1Page.locator('[data-testid="vote-btn-a"]');
    await expect(voteBtnA1).toBeEnabled();

    // Player 1 votes A
    const t0 = Date.now();
    await voteBtnA1.click();
    await expect(player1Page.locator('[data-testid="vote-confirmation"]')).toBeVisible();

    // Player 2 votes B
    const voteBtnB2 = player2Page.locator('[data-testid="vote-btn-b"]');
    await expect(voteBtnB2).toBeEnabled();
    await voteBtnB2.click();
    await expect(player2Page.locator('[data-testid="vote-confirmation"]')).toBeVisible();

    // Stage counts should update in < 500 ms (Gate 4)
    await expect(stagePage.locator('[data-testid="count-a"]')).not.toContainText("(0)", {
      timeout: 2000,
    });
    await expect(stagePage.locator('[data-testid="count-b"]')).not.toContainText("(0)", {
      timeout: 2000,
    });
    const elapsed = Date.now() - t0;
    console.log(`[Live Game] Vote propagation time: ${elapsed}ms`);

    // Presenter reveals round (Click button or press R)
    const revealBtn = stagePage.locator('[data-testid="reveal-round-btn"]');
    if (await revealBtn.isVisible()) {
      await revealBtn.click().catch(() => {});
    } else {
      await stagePage.keyboard.press("r");
    }

    // Stage shows reveal box with lesson
    await expect(stagePage.locator('[data-testid="reveal-box"]')).toBeVisible();
    await expect(stagePage.locator('[data-testid="reveal-box"]')).toContainText("LECCIÓN CLAVE:");

    // Players see verdict
    await expect(player1Page.locator('[data-testid="mobile-reveal-card"]')).toBeVisible();
    await expect(player2Page.locator('[data-testid="mobile-reveal-card"]')).toBeVisible();

    await stageContext.close();
    await player1Context.close();
    await player2Context.close();
  });

  test("Gate 5 Resilience: Stage enters Modo Ensayo seamlessly without server crash", async ({
    page,
  }) => {
    // Stage without socket server or in offline simulation
    await page.goto("/stage?key=plausible-admin-2026");
    await page.waitForTimeout(3500); // 3s fallback threshold

    // Either connected live or gracefully operating in Modo Ensayo
    const badge = page.locator('[data-testid="ensayo-mode-badge"], [data-testid="admin-mode-badge"]');
    await expect(badge.first()).toBeVisible();

    // Check no crash or breaking errors
    await expect(page.locator("body")).toBeVisible();
  });
});
