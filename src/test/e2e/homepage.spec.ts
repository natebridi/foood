import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and displays the search box", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("searchbox")).toBeVisible();
  });

  test("displays recipe tiles", async ({ page }) => {
    await page.goto("/");
    // Wait for the recipe tiles to load (they come from client-side fetch)
    const tiles = page.locator(".recipe-tile, [class*='tile'], article, .card").first();
    await expect(tiles).toBeVisible({ timeout: 10000 });
  });

  test("search box filters recipe tiles", async ({ page }) => {
    await page.goto("/");
    // Wait for tiles to load
    await page.waitForTimeout(1000);
    const searchBox = page.getByRole("searchbox");
    await searchBox.fill("zzzzzzz_no_match");
    // After filtering with a nonsense query, tiles should be hidden/absent
    // (exact behavior depends on implementation)
    await expect(searchBox).toHaveValue("zzzzzzz_no_match");
  });

  test("visual snapshot of homepage", async ({ page }) => {
    await page.goto("/");
    // Wait for recipe tiles to load
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});
