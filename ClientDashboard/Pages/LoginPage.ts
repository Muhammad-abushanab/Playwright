import { Page, Locator } from "@playwright/test";
import { RegisterPage } from "./RegisterPage";

export class LoginPage {
    readonly page: Page
    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator
    readonly registerLink: Locator
    readonly forgotPasswordLink: Locator

    constructor(page: Page) {
        this.page = page
        this.emailInput = page.getByPlaceholder('email@example.com')
        this.passwordInput = page.getByPlaceholder('enter your password')
        this.loginButton = page.getByRole('button', { name: 'Login' })
        this.registerLink = page.getByRole('link', { name: 'Register' })
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' })
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }

    async goToRegister(): Promise<RegisterPage> {
        await this.registerLink.click()
        return new RegisterPage(this.page)
    }

    async forgotPassword() {
        await this.forgotPasswordLink.click()
    }
}
