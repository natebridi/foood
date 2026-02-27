import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and displays the search box", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("searchbox")).toBeVisible();
  });

  test("displays recipe tiles", async ({ page }) => {
    await page.goto("/");
    // Tiles are client-side fetched; wait for at least one to appear
    await expect(page.getByTestId("recipe-tile").first()).toBeVisible({ timeout: 10000 });
  });

  test("search box filters recipe tiles", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("recipe-tile").first()).toBeVisible({ timeout: 10000 });
    const initialCount = await page.getByTestId("recipe-tile").count();

    const searchBox = page.getByRole("searchbox");
    await searchBox.fill("zzzzzzz_no_match");

    // Nonsense query should filter out all tiles
    await expect(page.getByTestId("recipe-tile")).toHaveCount(0);

    // Clearing the search should restore tiles
    await searchBox.clear();
    await expect(page.getByTestId("recipe-tile")).toHaveCount(initialCount);
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
