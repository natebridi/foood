import { test, expect } from "@playwright/test";

test.describe("Admin auth", () => {
  test("redirects /admin/edit to /admin/login when not authenticated", async ({ page }) => {
    await page.goto("/admin/edit");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("login page renders a password field", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByPlaceholder("Password")).toBeVisible();
  });

  test("shows error message on wrong password", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByPlaceholder("Password").fill("wrong-password-xyz");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Incorrect password")).toBeVisible({ timeout: 5000 });
  });

  test("visual snapshot of login page", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page).toHaveScreenshot("admin-login.png", {
      maxDiffPixelRatio: 0.05,
    });
  });
});
