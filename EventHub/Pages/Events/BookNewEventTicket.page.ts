import { Page, Locator } from "@playwright/test";

export class BookNewEventTicketPage {
    readonly page: Page
    readonly ticketQuantityIncreaseButton: Locator
    readonly ticketQuantityDecreaseButton: Locator
    readonly fullNameInput: Locator
    readonly emailInput: Locator
    readonly phoneNumberInput: Locator
    readonly confirmBookingButton: Locator
    readonly bookingTotalForm: Locator
    readonly topRightPrice: Locator

    constructor(page: Page) {
        this.page = page
        this.ticketQuantityIncreaseButton = page.getByRole('button', { name: '+' })
        this.ticketQuantityDecreaseButton = page.getByRole('button', { name: '-' })
        this.fullNameInput = page.getByLabel('Full Name')
        this.emailInput = page.getByLabel('Email')
        this.phoneNumberInput = page.getByLabel('Phone Number')
        this.confirmBookingButton = page.getByRole('button', { name: 'Confirm Booking' })
        this.bookingTotalForm = page.locator('form div.bg-indigo-50')
        this.topRightPrice = page.getByRole('heading', { name: 'Book Tickets' }).locator('+ span');
    }

    async increaseTicketQuantity(times: number): Promise<void> {
        for (let i = 0; i < times; i++) {
            await this.ticketQuantityIncreaseButton.click()
        }
    }

    async decreaseTicketQuantity(times: number): Promise<void> {
        for (let i = 0; i < times; i++) {
            await this.ticketQuantityDecreaseButton.click()
        }
    }
    async fillBookingForm(fullName: string, email: string, phoneNumber: string): Promise<void> {
        await this.fullNameInput.fill(fullName)
        await this.emailInput.fill(email)
        await this.phoneNumberInput.fill(phoneNumber)
    }
    async submitBooking(): Promise<void> {
        await this.confirmBookingButton.click()
    }
    async getTopRightPrice(): Promise<string> {
        return await this.topRightPrice.textContent() || ''
    }
}