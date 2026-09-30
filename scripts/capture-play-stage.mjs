import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";

const outDir = "apps/web/e2e/screenshots/after";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

const desktop = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await desktop.goto("http://localhost:3000/stage", { waitUntil: "networkidle" });
await desktop.waitForTimeout(500);
await desktop.screenshot({ path: `${outDir}/stage.png` });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3000/play", { waitUntil: "networkidle" });
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: `${outDir}/play.png` });

console.log("done");
await browser.close();
