import { expect, test, type Page } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

const tag = uuidv4();

async function goToHomePage(page: Page) {
	await page.goto("/");

	expect(page.url()).toBe("http://localhost:4173/");
	expect(await page.title()).toContain("Linkday - Home");
	expect(await page.isVisible("text=LINKDAY")).toBeTruthy();
	expect(await page.isVisible("text=Get Started")).toBeTruthy();
}

async function login(page: Page) {
	await page.getByRole("button", { name: "Get Started" }).click();
	await page.waitForURL("http://localhost:4173/bookmarks");

	expect(page.url()).toBe("http://localhost:4173/bookmarks");
	expect(await page.title()).toContain("Linkday - Bookmarks");
	expect(await page.isVisible("text=LINKDAY")).toBeTruthy();
}

async function logout(page: Page) {
	await page.getByRole("link", { name: "LOGOUT" }).click();
	await page.waitForURL("http://localhost:4173/");

	expect(page.url()).toBe("http://localhost:4173/");
	expect(await page.title()).toContain("Linkday - Home");
	expect(await page.isVisible("text=LINKDAY")).toBeTruthy();
	expect(await page.isVisible("text=Get Started")).toBeTruthy();
}

test("login and logout", async ({ page }) => {
	await goToHomePage(page);

	await login(page);

	await page.getByPlaceholder("Search Bookmarks...").click();
	await page.getByPlaceholder("Search Bookmarks...").fill("test");
	await page.locator("#filter-button").click();

	expect(await page.isVisible("text=Filter Tags")).toBeTruthy();

	await page.locator("html").click();

	await logout(page);
});

test("add bookmark", async ({ page }) => {
	await goToHomePage(page);

	await login(page);

	await page.getByRole("button", { name: "+ Add Bookmark" }).click();
	await page.waitForURL("http://localhost:4173/bookmarks/add");

	expect(page.url()).toBe("http://localhost:4173/bookmarks/add");
	expect(await page.title()).toContain("Linkday - Add Bookmark");
	expect(await page.isVisible("text=LINKDAY")).toBeTruthy();
	expect(await page.isVisible("text=Add Bookmark")).toBeTruthy();
	expect(await page.getByRole("button", { name: "+ Add Bookmark" }).isDisabled()).toBeTruthy();

	await page.getByPlaceholder("https://example.com").click();
	await page.getByPlaceholder("https://example.com").fill("https://www.google.com");
	await page.getByPlaceholder("https://example.com").fill("");

	expect(await page.isVisible("text=Invalid url")).toBeTruthy();

	await page.getByPlaceholder("Add tags...").click();
	await page.getByPlaceholder("Add tags...").fill(tag);
	await page.getByRole("button", { name: `No tags found Create new tag: ${tag}` }).click();
	await page.getByRole("button", { name: `# ${tag}` }).click();

	expect(await page.isVisible("text=At least one tag is required")).toBeTruthy();
});
