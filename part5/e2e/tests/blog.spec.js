const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    try {
      await request.post("http://localhost:5173/api/testing/reset");
      await request.post("http://localhost:5173/api/users", {
        data: {
          name: "Aboongm Maye",
          username: "aboongm",
          password: "boon11",
        },
      });
    } catch (error) {
      console.error("Error occurred during setup:", error);
      throw error;
    }
  });

  test("Login form is shown", async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.goto("http://localhost:5173");
      await page.getByTestId("username").fill("aboongm");
      await page.getByTestId("password").fill("boon11");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Aboongm Maye logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.goto("http://localhost:5173");
      await page.getByTestId("username").fill("aboongm");
      await page.getByTestId("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("wrong credentials")).toBeVisible();
    });
  });
});
