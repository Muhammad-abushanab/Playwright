import {Page, Locator} from "@playwright/test";

export class HomePage {
    readonly page: Page
    readonly homeLink: Locator
    readonly eventLink: Locator
    readonly myBookingsLink: Locator
    readonly apiDocsLink: Locator
    readonly adminButton: Locator

    constructor(page: Page) {
        this.page = page
        this.homeLink = page.getByRole('link', { name: 'Home' })
        this.eventLink = page.getByRole('link', { name: 'Events' , exact: true })
        this.myBookingsLink = page.getByRole('link', { name: 'My Bookings' })
        this.apiDocsLink = page.getByRole('link', { name: 'API Docs' })
        this.adminButton = page.getByRole('button', { name: 'Admin' })
    }

    async navigateToHome(): Promise<void> {
        await this.homeLink.click()
    }
    async navigateToEvents(): Promise<void> {
        await this.eventLink.click()
    }
    async navigateToMyBookings(): Promise<void> {
        await this.myBookingsLink.click()
    }
    async navigateToApiDocs(): Promise<void> {
        await this.apiDocsLink.click()
    }
    async navigateToAdmin(option:string): Promise<void> {
        await this.adminButton.click().then(async () => {
            await this.page.getByRole('link', { name: option }).click()
        })
    }
}