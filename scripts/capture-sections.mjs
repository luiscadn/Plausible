import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";

const outDir = process.argv[2] || "apps/web/e2e/screenshots/before";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

for (const id of ["01", "02", "03", "04", "05", "06", "07", "08", "09"]) {
  await page.evaluate((secId) => {
    document.getElementById(`sec-${secId}`)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, id);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/sec-${id}.png` });
  console.log(`captured sec-${id}`);
}

await browser.close();
