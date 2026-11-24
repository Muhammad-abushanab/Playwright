import { Page, Locator } from "@playwright/test";

export interface RegisterDetails {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    phoneNumber: string
    occupation: string
    gender: string
}

export class RegisterPage {
    readonly page: Page
    readonly firstNameInput: Locator
    readonly lastNameInput: Locator
    readonly emailInput: Locator
    readonly phoneNumberInput: Locator
    readonly occupationSelect: Locator
    readonly passwordInput: Locator
    readonly confirmPasswordInput: Locator
    readonly confirmAgeCheckbox: Locator
    readonly registerButton: Locator

    constructor(page: Page) {
        this.page = page
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name', exact: true })
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name', exact: true })
        // The "Email" label isn't linked to the input (its name comes from the placeholder), so use the id.
        this.emailInput = page.locator('#userEmail')
        this.phoneNumberInput = page.getByPlaceholder('enter your number')
        this.occupationSelect = page.getByRole('combobox')
        // The site's "Password" label has for="password" but the input id is "userPassword",
        // so the label isn't linked and a role/name locator can't find this field.
        this.passwordInput = page.locator('#userPassword')
        this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password', exact: true })
        this.confirmAgeCheckbox = page.locator('input[type="checkbox"][formcontrolname="required"]')
        this.registerButton = page.getByRole('button', { name: 'Register' })
    }

    genderRadio(gender: string): Locator {
        return this.page.getByRole('radio', { name: gender, exact: true })
    }

    async register(details: RegisterDetails) {
        await this.firstNameInput.fill(details.firstName)
        await this.lastNameInput.fill(details.lastName)
        await this.emailInput.fill(details.email)
        await this.phoneNumberInput.fill(details.phoneNumber)
        await this.occupationSelect.selectOption(details.occupation)
        await this.genderRadio(details.gender).check()
        await this.passwordInput.fill(details.password)
        await this.confirmPasswordInput.fill(details.confirmPassword)
        await this.confirmAgeCheckbox.check()
        await this.registerButton.click()
    }
}
