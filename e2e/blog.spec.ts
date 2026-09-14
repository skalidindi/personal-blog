import { expect, test } from "@playwright/test";

test("a reader can open the blog and read a post", async ({ page }) => {
  const response = await page.goto("/");
  const contentSecurityPolicy = response?.headers()["content-security-policy"];

  expect(contentSecurityPolicy).toContain("default-src 'self'");
  expect(contentSecurityPolicy).toContain("object-src 'none'");
  expect(contentSecurityPolicy).toContain("frame-ancestors 'none'");
  expect(contentSecurityPolicy).toContain("worker-src 'self' blob:");
  expect(contentSecurityPolicy).toContain("upgrade-insecure-requests");
  expect(contentSecurityPolicy).not.toContain("'unsafe-eval'");

  const blogLink = page.getByRole("link", { name: "Blog" });
  await expect(blogLink).toHaveAttribute("href", "/blog");

  await blogLink.click();

  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByText("September 13, 2026")).toBeVisible();

  await page
    .getByRole("link", { name: /Four ES2026 features worth using/ })
    .click();

  await expect(page).toHaveURL(/\/blog\/es2026-features$/);
  await expect(page).toHaveTitle(/Four ES2026 features worth using/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Practical examples of Map upsert, iterator sequencing, lossless JSON parsing, and Uint8Array base64 APIs",
  );
  await expect(
    page.getByRole("heading", {
      name: "Four ES2026 features worth using",
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Map upsert without a manual branch",
    }),
  ).toBeVisible();
  await expect(page.locator("article")).toHaveClass(/\bprose\b/);
  await expect(page.locator("pre.shiki")).toHaveCount(4);

  await page.getByRole("link", { name: "Blogs" }).click();
  await expect(page).toHaveURL(/\/blog$/);
});

test("an unknown blog slug returns 404", async ({ page }) => {
  const response = await page.goto("/blog/not-a-real-post");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Return home" })).toHaveAttribute(
    "href",
    "/",
  );
});
