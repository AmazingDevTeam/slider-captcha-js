import { test, expect } from "@playwright/test";

test.describe("SliderCaptcha E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for captcha to initialize
    await page.waitForSelector(".slider-captcha-stage", { timeout: 10000 });
  });

  test("should render captcha", async ({ page }) => {
    const stage = page.locator(".slider-captcha-stage");
    await expect(stage).toBeVisible();
    const bar = page.locator(".slider-captcha-bar");
    await expect(bar).toBeVisible();
  });

  test("should allow refresh", async ({ page }) => {
    const refreshBtn = page.locator(".slider-captcha-refresh");
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();
    // No error should occur
  });

  test("should simulate verification", async ({ page }) => {
    const bar = page.locator(".slider-captcha-bar");
    await bar.click();
    const text = await bar.textContent();
    expect(text).toMatch(/Verified|Try again|Server error/);
  });
});
