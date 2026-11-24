import { test, expect } from '@playwright/test';
import { LoginPage } from "../Pages/LoginPage"
import { createUser } from "../test-data/userFactory"
import { existsSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import dotenv from "dotenv";
import { getRandomEmail } from '../helpers/getRandomRegisteredUser';
dotenv.config();

const filePath = 'test-data/RegisteredUsers.csv';

test.describe('Register Page Tests', () => {
  test('Register a New User', async ({ page }) => {
    const user = createUser();
    const loginPage = new LoginPage(page);
    await page.goto(process.env.URL!);
    await expect(page).toHaveTitle(/Let's Shop/);
    const registerPage = await loginPage.goToRegister();
    await registerPage.register(user);
    console.log(`Registered user with email: ${user.email}`);
    await expect(page.getByText('Registered Successfully')).toBeVisible();
    const headers = ['First Name', 'Last Name', 'Email', 'Phone Number', 'Occupation', 'Gender'];
    const row = [user.firstName, user.lastName, user.email, user.phoneNumber, user.occupation, user.gender];
    const rowString = row.join(',');

    if (existsSync(filePath)) {
      appendFileSync(filePath, `\n${rowString}`, 'utf8');
      console.log('Row appended to existing CSV.');
    } else {
      mkdirSync(dirname(filePath), { recursive: true });
      const csvContent = `${headers.join(',')}\n${rowString}`;
      writeFileSync(filePath, csvContent, 'utf8');
      console.log('CSV created with headers and first row.');
    }
  });
  test('Register with an existing email', async ({ page }) => {
    const user = createUser();
    const loginPage = new LoginPage(page);
    await page.goto(process.env.URL!);
    await expect(page).toHaveTitle(/Let's Shop/);
    const registerPage = await loginPage.goToRegister();
    user.email = getRandomEmail(); // Use an email that is already registered
    await registerPage.register(user);
    console.log(`Attempted to register user with existing email: ${user.email}`);
    await expect(page.getByText('User already exisits')).toBeVisible();
  });
  test('Register with mismatched passwords', async ({ page }) => {
    const user = createUser();
    user.confirmPassword = 'DifferentPassword123!';
    const loginPage = new LoginPage(page);
    await page.goto(process.env.URL!);
    await expect(page).toHaveTitle(/Let's Shop/);
    const registerPage = await loginPage.goToRegister();
    await registerPage.register(user);
    console.log(`Attempted to register user with mismatched passwords: ${user.email}`);
    await expect(page.getByText('Password and Confirm Password must match with each other.')).toBeVisible();
  });
  test('Register with invalid email format', async ({ page }) => {
    const user = createUser();
    user.email = 'invalid-email-format';
    const loginPage = new LoginPage(page);
    await page.goto(process.env.URL!);
    await expect(page).toHaveTitle(/Let's Shop/);
    const registerPage = await loginPage.goToRegister();
    await registerPage.register(user);
    console.log(`Attempted to register user with invalid email format: ${user.email}`);
    await expect(page.getByText('*Enter Valid Email')).toBeVisible();
  })
  test('Register with empty required fields', async ({ page }) => {
    const user = createUser();
    user.firstName = ''; 
    const loginPage = new LoginPage(page);
    await page.goto(process.env.URL!);
    await expect(page).toHaveTitle(/Let's Shop/);
    const registerPage = await loginPage.goToRegister();
    await registerPage.register(user);
    console.log(`Attempted to register user with empty required fields: ${user.email}`);
    await expect(page.getByText('*First Name is required')).toBeVisible();
  });
  test('Register with invalid phone number format', async ({ page }) => {
    const user = createUser();
    user.phoneNumber = '12345'; // Invalid phone number format
    const loginPage = new LoginPage(page);
    await page.goto(process.env.URL!);
    await expect(page).toHaveTitle(/Let's Shop/);
    const registerPage = await loginPage.goToRegister();
    await registerPage.register(user);
    console.log(`Attempted to register user with invalid phone number format: ${user.email}`);
    await expect(page.getByText('*Phone Number must be 10 digit')).toBeVisible();
  })
  test('Register with invalid password format', async ({ page }) => {
    const user = createUser();
    user.password = 'short'; // Invalid password format
    user.confirmPassword = 'short';
    const loginPage = new LoginPage(page);
    await page.goto(process.env.URL!);
    await expect(page).toHaveTitle(/Let's Shop/);
    const registerPage = await loginPage.goToRegister();
    await registerPage.register(user);
    console.log(`Attempted to register user with invalid password format: ${user.email}`);
    await expect(page.getByRole('alert', { name: 'Password must be 8 Character' })).toBeVisible();
  });
});
