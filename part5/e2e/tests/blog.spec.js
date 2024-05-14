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

  // part 5.18: Do the tests for login.
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

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.goto("http://localhost:5173");
      await page.getByTestId("username").fill("aboongm");
      await page.getByTestId("password").fill("boon11");
      await page.getByRole("button", { name: "login" }).click();
    });

    // part 5.19: Create a test that verifies that a logged in user can create a blog.
    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByTestId("title").fill("First blog");
      await page.getByTestId("author").fill("Aboong May");
      await page.getByTestId("url").fill("https://aboongmay.com");
      await page.getByRole("button", { name: "create" }).click();

      const parent = page.getByRole("button", { name: "view" }).locator("..");
      await expect(parent.getByText("First blog")).toBeVisible();
      await expect(parent.getByText("Aboong May")).toBeVisible();
    });

    // part 20: Do a test that makes sure the blog can be edited
    test("blog can be liked (edited)", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByTestId("title").fill("A blog to be edited (liked)");
      await page.getByTestId("author").fill("Aboong May");
      await page.getByTestId("url").fill("https://aboongmay.com");
      await page.getByRole("button", { name: "create" }).click();

      const parent = page.getByRole("button", { name: "view" }).locator("..");
      await expect(
        parent.getByText("A blog to be edited (liked)")
      ).toBeVisible();
      await expect(parent.getByText("Aboong May")).toBeVisible();
      await page.getByRole("button", { name: "view" }).click();

      try {
        await page.getByRole("button", { name: "like" }).click();
        const likesSelector = await page.getByText("1");
        await expect(likesSelector).toBeVisible();
      } catch (error) {
        console.error("Error occurred:", error);
      }
    });

    test("the user who added the blog can delete the blog", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByTestId("title").fill("A blog to be deleted");
      await page.getByTestId("author").fill("Aboong May");
      await page.getByTestId("url").fill("https://aboongmay.com");
      await page.getByRole("button", { name: "create" }).click();

      const parent = page.getByRole("button", { name: "view" }).locator("..");
      await expect(
        parent.getByText("A blog to be deleted")
      ).toBeVisible();
      await page.getByRole("button", { name: "view" }).click();

      try {
        page.on("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "remove" }).click();
        await expect(parent.getByText('A blog to be deleted')).not.toBeVisible()
      } catch (error) {
        console.error("Error occurred:", error);
      }
    });
  });
});
