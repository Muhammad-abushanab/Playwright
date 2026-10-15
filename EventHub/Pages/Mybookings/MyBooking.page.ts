import { Locator, Page } from "@playwright/test";

export class MyBookingsPage {
    readonly page: Page
    readonly bookingsList: Locator
    readonly clearAllBookings: Locator
    readonly elibilityBTN: Locator;
    readonly refundStatus: Locator
    readonly cancelStatusMessage: Locator
    readonly noBookingsText: Locator

    constructor(page: Page) {
        this.page = page;
        this.bookingsList = page.getByTestId('booking-card')
        this.elibilityBTN = page.getByTestId("check-refund-btn")
        this.refundStatus = page.getByTestId('refund-result');
        this.cancelStatusMessage = page.getByText("Booking cancelled successfully")
        this.clearAllBookings = page.getByText("Clear all bookings");
        this.noBookingsText = page.getByText("No bookings yet");
    }

    async getLastBookingCard(): Promise<Locator> {
        return await this.bookingsList.first();
    }

    async getLastbookingRefId(): Promise<string> {
        return (await this.getLastBookingCard()).locator('span.booking-ref').innerText();
    }

    async clickViewDetails(): Promise<void> {
        await this.bookingsList.first().getByRole("button", { name: "View Details" }).click()
    }

    async clickViewDetailsBasedOnRefID(refID: string): Promise<void> {
        await this.bookingsList.filter({ hasText: refID }).getByRole("button", { name: "view Details" }).click();
    }

    async checkElibility(): Promise<void> {
        await this.elibilityBTN.click();
    }

    async cancelBookingRefID(refId: string): Promise<void> {
        await this.bookingsList.filter({ hasText: refId }).getByTestId(`cancel-booking-btn`).click().then(async () => {
            await this.page.getByTestId('confirm-dialog-yes').click();
        })
    }
    async grapAllRefIDs(): Promise<string[]> {
        try {
            const refs = this.bookingsList.locator(".booking-ref");
            await refs.first().waitFor({ state: "visible" });
            return await refs.allInnerTexts();
        }
        catch {
            return []
        }
    }
    async totalBookingCount(): Promise<number> {
        return await this.bookingsList.count();
    }

}