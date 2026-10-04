import {Locator, Page} from '@playwright/test';

export class LoginPage {
    readonly page: Page
    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator
    readonly registerButton: Locator
    readonly errorMessage: Locator
    readonly passwordErrorMessage: Locator

    constructor(page: Page) {
        this.page = page
        this.emailInput = page.getByRole('textbox', { name: 'Email' })
        this.passwordInput = page.getByRole('textbox', { name: 'Password' })
        this.loginButton = page.getByRole('button', { name: 'Sign In' })
        this.registerButton = page.getByRole('button', { name: 'Register' })
        this.errorMessage = page.getByText('Invalid email or password')
        this.passwordErrorMessage = page.getByText('Password must be at least 6 characters')
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }
}