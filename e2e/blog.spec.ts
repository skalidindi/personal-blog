import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const postPath = "/blog/es2026-features";
const postTitle = "Four ES2026 features worth using";
const postDescription =
  "Practical examples of Map upsert, iterator sequencing, lossless JSON parsing, and Uint8Array base64 APIs";

async function expectCanonical(page: Page, pathname: string) {
  const canonical = page.locator('link[rel="canonical"]');

  await expect(canonical).toHaveCount(1);
  const href = await canonical.getAttribute("href");

  expect(href).toBeTruthy();
  const url = new URL(href!);
  expect(url.origin).toBe("https://www.santoshk.me");
  expect(url.pathname).toBe(pathname);
}

async function expectBlogPostingJsonLd(page: Page) {
  const scripts = page.locator('script[type="application/ld+json"]');

  expect(await scripts.count()).toBeGreaterThan(0);
  const documents = await scripts.evaluateAll((elements: Element[]) =>
    elements.map((element: Element) => JSON.parse(element.textContent ?? "")),
  );

  const blogPosting = documents.find(
    (document) =>
      document &&
      typeof document === "object" &&
      document["@type"] === "BlogPosting",
  );
  expect(blogPosting).toMatchObject({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postTitle,
    description: postDescription,
    url: `https://www.santoshk.me${postPath}`,
    author: { "@type": "Person", name: "Santosh Kalidindi" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.santoshk.me${postPath}`,
    },
  });
}

test("the homepage exposes navigation and canonical metadata", async ({
  page,
}) => {
  const response = await page.goto("/");
  const contentSecurityPolicy = response?.headers()["content-security-policy"];

  expect(contentSecurityPolicy).toContain("default-src 'self'");
  expect(contentSecurityPolicy).toContain("object-src 'none'");
  expect(contentSecurityPolicy).toContain("frame-ancestors 'none'");
  expect(contentSecurityPolicy).toContain("worker-src 'self' blob:");
  expect(contentSecurityPolicy).toContain("upgrade-insecure-requests");
  expect(contentSecurityPolicy).not.toContain("'unsafe-eval'");

  await expect(page).toHaveTitle(/Santosh Kalidindi/);
  await expect(page.getByRole("link", { name: "Blog" })).toHaveAttribute(
    "href",
    "/blog",
  );
  await expectCanonical(page, "/");

  const githubLink = page.locator('a[href="https://github.com/skalidindi"]');
  await expect(githubLink).toHaveAttribute("target", "_blank");
  await expect(githubLink).toHaveAttribute("rel", /noopener/);
});

test("the blog index lists the representative post", async ({ page }) => {
  await page.goto("/blog");

  await expect(page).toHaveTitle(/Engineering notes/);
  await expect(
    page.getByRole("heading", { name: "Engineering notes", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: postTitle })).toHaveAttribute(
    "href",
    postPath,
  );
  await expect(page.getByRole("link", { name: "JavaScript" })).toHaveAttribute(
    "href",
    "/blog/tags/javascript",
  );
  await expectCanonical(page, "/blog");
});

test("a reader can navigate and copy code from a post", async ({
  context,
  page,
}) => {
  await page.goto(postPath);

  await expect(page).toHaveTitle(new RegExp(postTitle));
  await expect(
    page.getByRole("heading", { name: postTitle, level: 1 }),
  ).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    postDescription,
  );
  await expectCanonical(page, postPath);
  await expectBlogPostingJsonLd(page);

  const toc = page.getByRole("navigation", { name: "On this page" });
  const headingText = "Map upsert without a manual branch";
  const headingId = "map-upsert-without-a-manual-branch";

  await expect(toc.getByRole("link", { name: headingText })).toHaveAttribute(
    "href",
    `#${headingId}`,
  );
  await expect(page.locator(`#${headingId}`)).toBeVisible();
  const headingLink = toc.getByRole("link", { name: headingText });
  await headingLink.click();
  await expect(page).toHaveURL(new RegExp(`${postPath}#${headingId}$`));
  await expect(headingLink).toHaveAttribute("aria-current", "location");

  const table = page.getByRole("region", { name: "Scrollable table" });
  await expect(table).toBeVisible();
  await expect(table.locator("table")).toBeVisible();

  const externalLink = page.locator(
    'a[href="https://github.com/tc39/proposals/blob/main/finished-proposals.md"]',
  );
  await expect(externalLink).toHaveAttribute("rel", "external");
  await expect(externalLink).toContainText("external site");

  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: new URL(page.url()).origin,
  });
  const copyButton = page.getByRole("button", { name: "Copy code" }).first();
  await copyButton.click();
  await expect(
    page.getByRole("button", { name: "Code copied" }).first(),
  ).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("getOrInsertComputed");
});

test("the homepage, blog, and post fit a mobile viewport without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });

  for (const path of ["/", "/blog", postPath]) {
    await page.goto(path);
    const widths = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));

    expect(widths.document).toBeLessThanOrEqual(widths.viewport);
  }
});

test("the homepage, blog, and post pass accessibility scans", async ({
  page,
}) => {
  for (const path of ["/", "/blog", postPath]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations, `${path} accessibility violations`).toEqual([]);
  }
});

test("an unknown blog slug returns a navigable 404", async ({ page }) => {
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

test("SEO feeds and crawler endpoints advertise their content types", async ({
  request,
}) => {
  const endpoints = [
    { path: "/sitemap.xml", contentType: /(?:application|text)\/xml/ },
    { path: "/robots.txt", contentType: /text\/plain/ },
    { path: "/rss.xml", contentType: /application\/rss\+xml/ },
  ];

  for (const endpoint of endpoints) {
    const response = await request.get(endpoint.path);

    expect(response.ok(), endpoint.path).toBe(true);
    expect(response.headers()["content-type"], endpoint.path).toMatch(
      endpoint.contentType,
    );
  }

  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain(
    "https://www.santoshk.me/blog/es2026-features",
  );

  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain(
    "Sitemap: https://www.santoshk.me/sitemap.xml",
  );

  const rss = await request.get("/rss.xml");
  const rssBody = await rss.text();
  expect(rssBody).toContain('<rss version="2.0">');
  expect(rssBody).toContain("https://www.santoshk.me/blog/es2026-features");

  const tagPage = await request.get("/blog/tags/javascript");
  expect(tagPage.ok()).toBe(true);
  expect(await tagPage.text()).toContain(postTitle);
});
