import { expect, test, type Page } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

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

test("login and logout", async ({ page }) => {
	await goToHomePage(page);

	await login(page);

	await page.getByRole("link", { name: "LOGOUT" }).click();
	await page.waitForURL("http://localhost:4173/");

	expect(page.url()).toBe("http://localhost:4173/");
	expect(await page.title()).toContain("Linkday - Home");
	expect(await page.isVisible("text=LINKDAY")).toBeTruthy();
	expect(await page.isVisible("text=Get Started")).toBeTruthy();
});

test("add bookmark and validation", async ({ page }) => {
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

	const tag = uuidv4();

	await page.getByPlaceholder("Add tags...").click();
	await page.getByPlaceholder("Add tags...").fill(tag);
	await page.getByRole("button", { name: `No tags found Create new tag: ${tag}` }).click();
	await page.waitForTimeout(5000);

	expect(await page.getByRole("button", { name: `# ${tag}` }).isVisible()).toBeTruthy();

	await page.getByPlaceholder("Add tags...").click();
	await page.getByPlaceholder("Add tags...").fill(tag);

	expect(await page.getByRole("button", { name: `${tag} Click to add` }).isDisabled()).toBeTruthy();

	await page.getByRole("img", { name: "add-bookmark" }).click();
	await page.getByRole("button", { name: `# ${tag}` }).click();

	expect(await page.isVisible("text=At least one tag is required")).toBeTruthy();

	await page.getByPlaceholder("https://example.com").click();
	await page.getByPlaceholder("https://example.com").fill("https://github.com/");

	expect(await page.isHidden("text=Invalid url")).toBeTruthy();

	await page.getByPlaceholder("Add tags...").click();
	await page.getByPlaceholder("Add tags...").fill("");
	await page.getByPlaceholder("Add tags...").fill(tag);
	await page.getByRole("button", { name: `${tag} Click to add` }).click();

	expect(await page.isHidden("text=At least one tag is required")).toBeTruthy();

	await page.getByRole("button", { name: "Add", exact: true }).click();
	await page.waitForURL("http://localhost:4173/bookmarks");

	expect(page.url()).toBe("http://localhost:4173/bookmarks");

	const tags = await page.locator(`text=# ${tag}`).all();

	expect(tags.length).toEqual(2);
	expect(await tags[1].isVisible()).toBeTruthy();
	// expect(await page.isVisible("text=GitHub")).toBeTruthy();
});

test("search bookmarks and filter", async ({ page }) => {
	await goToHomePage(page);

	await login(page);

	const tag1 = uuidv4();
	const tag2 = uuidv4();
	const tag3 = uuidv4();

	await page.getByRole("button", { name: "+ Add Bookmark" }).click();
	await page.waitForURL("http://localhost:4173/bookmarks/add");
	await page.getByPlaceholder("https://example.com").click();
	await page.getByPlaceholder("https://example.com").fill("https://github.com/");
	await page.getByPlaceholder("Add tags...").click();
	await page.getByPlaceholder("Add tags...").fill(tag1);
	await page.getByRole("button", { name: `No tags found Create new tag: ${tag1}` }).click();
	await page.waitForTimeout(5000);
	await page.getByPlaceholder("Add tags...").click();
	await page.getByPlaceholder("Add tags...").fill(tag2);
	await page.getByRole("button", { name: `No tags found Create new tag: ${tag2}` }).click();
	await page.waitForTimeout(5000);
	await page.getByRole("button", { name: "Add", exact: true }).click();
	await page.waitForURL("http://localhost:4173/bookmarks");

	await page.getByRole("button", { name: "+ Add Bookmark" }).click();
	await page.waitForURL("http://localhost:4173/bookmarks/add");
	await page.getByPlaceholder("https://example.com").click();
	await page.getByPlaceholder("https://example.com").fill("https://gitlab.com");
	await page.getByPlaceholder("Add tags...").click();
	await page.getByPlaceholder("Add tags...").fill(tag2);
	await page.getByRole("button", { name: `${tag2} Click to add` }).click();
	await page.getByPlaceholder("Add tags...").click();
	await page.getByPlaceholder("Add tags...").fill(tag3);
	await page.getByRole("button", { name: `No tags found Create new tag: ${tag3}` }).click();
	await page.waitForTimeout(5000);
	await page.getByRole("button", { name: "Add", exact: true }).click();
	await page.waitForURL("http://localhost:4173/bookmarks");

	const tag1s = await page.locator(`text=# ${tag1}`).all();
	const tag2s = await page.locator(`text=# ${tag2}`).all();
	const tag3s = await page.locator(`text=# ${tag3}`).all();

	expect(tag1s.length).toEqual(2);
	expect(tag2s.length).toEqual(3);
	expect(tag3s.length).toEqual(2);

	await page.getByPlaceholder("Search Bookmarks...").click();
	await page.getByPlaceholder("Search Bookmarks...").fill("GitHub");
	await page.waitForTimeout(100);

	expect(await tag1s[1].isVisible()).toBeTruthy();
	expect(await tag2s[1].isVisible()).toBeTruthy();

	await page.getByPlaceholder("Search Bookmarks...").click();
	await page.getByPlaceholder("Search Bookmarks...").fill("");
	await page.getByPlaceholder("Search Bookmarks...").fill("DevSecOps");

	expect(await tag2s[1].isVisible()).toBeTruthy();
	expect(await tag3s[1].isVisible()).toBeTruthy();

	await page.getByPlaceholder("Search Bookmarks...").click();
	await page.getByPlaceholder("Search Bookmarks...").fill("");
	await page.locator("#open-filter-panel").click();

	expect(await page.isVisible("text=Filter Tags")).toBeTruthy();
	expect(await tag1s[0].isVisible()).toBeTruthy();
	expect(await tag2s[0].isVisible()).toBeTruthy();
	expect(await tag3s[0].isVisible()).toBeTruthy();

	await await tag1s[0].click();

	expect(await tag1s[0].isEnabled()).toBeTruthy();
	expect(await tag2s[0].isEnabled()).toBeTruthy();
	expect(await tag3s[0].isDisabled()).toBeTruthy();

	await page.locator("#close-filter-panel").click();

	expect(await tag1s[1].isVisible()).toBeTruthy();
	expect(await tag2s[1].isVisible()).toBeTruthy();
	expect(await tag3s[1].isHidden()).toBeTruthy();

	await page.locator("#open-filter-panel").click();

	await await tag2s[0].click();

	expect(await tag3s[0].isDisabled()).toBeTruthy();

	await await tag1s[0].click();

	expect(await tag3s[0].isEnabled()).toBeTruthy();

	await await tag3s[0].click();
	await await tag2s[0].click();

	expect(await tag1s[0].isDisabled()).toBeTruthy();
	expect(await tag2s[0].isEnabled()).toBeTruthy();
	expect(await tag3s[0].isEnabled()).toBeTruthy();

	await page.locator("#close-filter-panel").click();

	expect(await tag1s[1].isHidden()).toBeTruthy();
	expect(await tag2s[1].isVisible()).toBeTruthy();
	expect(await tag3s[1].isVisible()).toBeTruthy();
});
