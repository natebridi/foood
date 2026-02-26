import { test, expect } from "@playwright/test";

test.describe("Recipe detail page", () => {
  test("returns 404 for an unknown slug", async ({ page }) => {
    const response = await page.goto("/this-recipe-does-not-exist-xyz");
    expect(response?.status()).toBe(404);
  });

  // Note: Tests below require at least one recipe in the database.
  // If the DB is empty, these will be skipped gracefully.

  test("homepage tiles link to recipe detail pages", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500);

    // Find the first recipe tile link and click it
    const firstLink = page
      .locator("a[href^='/']")
      .filter({ hasNot: page.locator("a[href='/']") })
      .first();
    const href = await firstLink.getAttribute("href");

    if (!href || href === "/") {
      // No recipe tiles found — skip
      return;
    }

    await firstLink.click();
    // Should navigate to a recipe detail page
    await expect(page).toHaveURL(new RegExp(href));
  });
});
