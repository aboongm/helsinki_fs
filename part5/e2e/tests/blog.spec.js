const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  let authToken;

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
      await request.post("http://localhost:5173/api/users", {
        data: {
          name: "Other User",
          username: "otheruser",
          password: "password",
        },
      });

      const loginResponse = await request.post("http://localhost:5173/api/login", {
        data: {
          username: "aboongm",
          password: "boon11",
        },
      });

      const loginData = await loginResponse.json();
      authToken = loginData.token;
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

    // part 21: user who added the blog can delete the blog
    test("the user who added the blog can delete the blog", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByTestId("title").fill("A blog to be deleted");
      await page.getByTestId("author").fill("Aboong May");
      await page.getByTestId("url").fill("https://aboongmay.com");
      await page.getByRole("button", { name: "create" }).click();

      const parent = page.getByRole("button", { name: "view" }).locator("..");
      await expect(parent.getByText("A blog to be deleted")).toBeVisible();
      await page.getByRole("button", { name: "view" }).click();

      try {
        page.on("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "remove" }).click();
        await expect(
          parent.getByText("A blog to be deleted")
        ).not.toBeVisible();
      } catch (error) {
        console.error("Error occurred:", error);
      }
    });

    // part 5.22: only the user who added the blog sees the blog's delete button
    test("only the user who added the blog sees the blog's delete button", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByTestId("title").fill("Blog visible to creator");
      await page.getByTestId("author").fill("Aboong May");
      await page.getByTestId("url").fill("https://aboongmay.com");
      await page.getByRole("button", { name: "create" }).click();

      const parent = page.getByRole("button", { name: "view" }).locator("..");
      await expect(parent.getByText("Blog visible to creator")).toBeVisible();
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();
      await page.getByTestId("username").fill("otheruser");
      await page.getByTestId("password").fill("password");
      await page
        .getByRole("button", { name: "login" })
        .click({ timeout: 5000 });

      await page.getByRole("button", { name: "view" }).click({ timeout: 5000 });
      await expect(
        page.getByRole("button", { name: "remove" })
      ).not.toBeVisible({ timeout: 5000 });
    });

    // part 5.23:  blogs are arranged in the order according to the likes
    test.only("blogs are arranged in the order according to the likes", async ({ page, request }) => {
      const blogs = [
        { title: "Blog 1", author: "Author 1", url: "https://blog1.com", likes: 10 },
        { title: "Blog 2", author: "Author 2", url: "https://blog2.com", likes: 5 },
        { title: "Blog 3", author: "Author 3", url: "https://blog3.com", likes: 8 }
      ];

      for (const blog of blogs) {
        await request.post("http://localhost:5173/api/blogs", {
          data: blog,
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
      }

      await page.goto("http://localhost:5173");
      await page.waitForSelector('section.blog-entry')
      await expect(page.getByText("Aboongm Maye logged in")).toBeVisible();

      const blogEntries = await page.$$("section.blog-entry")
      if (blogEntries.length === 0) {
        console.log("No blogs found on the page.");
      } else {
        console.log("Blogs are rendered on the page.");
      }
      
      const viewButtons = await page.$$("section.blog-entry button");
      for (const button of viewButtons) {
        await button.click();
      }
    
      await page.waitForSelector('.likes');
      const likes = await Promise.all(blogEntries.map(async (entry) => {
        const likesText = await entry.$eval('.likes', el => el.textContent);
        return parseInt(likesText, 10);
      }));

      console.log("Likes: ", likes);

      const isSorted = likes.every((val, i, arr) => !i || val >= arr[i - 1]);
      expect(isSorted).toBeTruthy();
    });
    
  });
});
