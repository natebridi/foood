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

    const firstTile = page.getByTestId("recipe-tile").first();
    const tileCount = await page.getByTestId("recipe-tile").count();

    if (tileCount === 0) {
      // No recipes in DB — skip
      return;
    }

    const link = firstTile.getByRole("link");
    const href = await link.getAttribute("href");
    await link.click();

    await expect(page).toHaveURL(new RegExp(String(href)));
  });
});
