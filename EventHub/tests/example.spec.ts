import { test, expect } from '@playwright/test';
import { config } from '../config/config';
import { LoginPage } from '../Pages/Login/Login.page';
import { HomePage } from '../Pages/Home/home.page';
import { EventsPage } from '../Pages/Events/events.page';
import { NewEventPage } from '../Pages/Events/newEvent.page';

test.describe('EventHub Login Tests', () => {
  test('Login with valid credentials', async ({ page }) => {
    await page.goto(config.URL);
    await expect(page).toHaveTitle(/EventHub/);
    const loginPage = new LoginPage(page);
    loginPage.login(config.email, config.password);
    const homePage = new HomePage(page);
    await expect(homePage.homeLink).toBeVisible();
  })
  test('Login with invalid credentials', async ({ page }) => {
    await page.goto(config.URL);
    await expect(page).toHaveTitle(/EventHub/);
    const loginPage = new LoginPage(page);
    loginPage.login('invalid@example.com', 'InvalidPassword');
    await expect(loginPage.errorMessage).toBeVisible();
  });
  test('Login with empty credentials', async ({ page }) => {
    await page.goto(config.URL);
    await expect(page).toHaveTitle(/EventHub/);
    const loginPage = new LoginPage(page);
    loginPage.login('', '');
    await expect(loginPage.passwordErrorMessage).toBeVisible();
  });
});


test.describe('As an Admin I should be able to add new Event and book from it', () => {
  test.only('Add new Event', async ({ page }) => {
    await page.goto(config.URL);
    await expect(page).toHaveTitle(/EventHub/);
    const loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);
    const homePage = new HomePage(page);
    await homePage.navigateToEvents();
    const eventsPage = new EventsPage(page);
    await eventsPage.navigateToAddEvent();
    await expect(page).toHaveURL(/events/);
    await expect(page).toHaveURL(/admin\/events/);
    const newEventPage = new NewEventPage(page);
    await newEventPage.addNewEvent('Playwright Test Event', 'This is a test event created using Playwright', 'Sports', 'New York', 'Madison Square Garden', '2027-12-31T20:00', 100, 500);
    await expect(page).toHaveURL(/events/);
    await page.waitForLoadState('networkidle');
    await expect(newEventPage.getLastEventTitle()).resolves.toBe('Playwright Test Event');
    await homePage.navigateToEvents();
    await eventsPage.searchEvent('Playwright Test Event');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
    await expect(eventsPage.getEventCount()).resolves.toBe(1);
    //await expect(eventsPage.getEventCount()).resolves.toBe(1);
    //await page.pause();
  });
});