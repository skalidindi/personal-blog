import { expect, test } from "@playwright/test";

test("a reader can open the blog and read a post", async ({ page }) => {
  await page.goto("/");

  const blogLink = page.getByRole("link", { name: "Blog" });
  await expect(blogLink).toHaveAttribute("href", "/blog");

  await blogLink.click();

  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByText("May 1, 2025")).toBeVisible();

  await page.getByRole("link", { name: /New Parent Essentials/ }).click();

  await expect(page).toHaveURL(/\/blog\/new-parent-essentials$/);
  await expect(page).toHaveTitle(/New Parent Essentials/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "The three most useful items my partner and I have purchased so far",
  );
  await expect(
    page.getByRole("heading", { name: "New Parent Essentials", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "1. Nanit Baby Monitor: Your New Best Friend",
    }),
  ).toBeVisible();
  await expect(page.locator("article")).toHaveClass(/\bprose\b/);

  await page.getByRole("link", { name: "Blogs" }).click();
  await expect(page).toHaveURL(/\/blog$/);
});

test("an unknown blog slug returns 404", async ({ page }) => {
  const response = await page.goto("/blog/not-a-real-post");

  expect(response?.status()).toBe(404);
});
