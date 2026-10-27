import { Locator, Page } from "@playwright/test";

export class MyBookingsPage {
    readonly page: Page
    readonly bookingsList: Locator
    readonly clearAllBookings: Locator
    readonly checkRefundEligibilityButton: Locator;
    readonly refundStatus: Locator
    readonly cancelStatusMessage: Locator
    readonly noBookingsText: Locator

    constructor(page: Page) {
        this.page = page;
        this.bookingsList = page.getByTestId('booking-card')
        this.checkRefundEligibilityButton = page.getByTestId("check-refund-btn")
        this.refundStatus = page.getByTestId('refund-result');
        this.cancelStatusMessage = page.getByText("Booking cancelled successfully")
        this.clearAllBookings = page.getByText("Clear all bookings");
        this.noBookingsText = page.getByText("No bookings yet");
    }

    getFirstBookingCard(): Locator {
        return this.bookingsList.first();
    }

    async getFirstBookingRefId(): Promise<string> {
        return this.getFirstBookingCard().locator('span.booking-ref').innerText();
    }

    async clickViewDetails(): Promise<void> {
        await this.bookingsList.first().getByRole("button", { name: "View Details" }).click()
    }

    async clickViewDetailsByRefId(refId: string): Promise<void> {
        await this.bookingsList.filter({ hasText: refId }).getByRole("button", { name: "View Details" }).click();
    }

    async checkRefundEligibility(): Promise<void> {
        await this.checkRefundEligibilityButton.click();
    }

    async cancelBookingByRefId(refId: string): Promise<void> {
        await this.bookingsList.filter({ hasText: refId }).getByTestId('cancel-booking-btn').click();
        await this.page.getByTestId('confirm-dialog-yes').click();
    }
    async getBookingRefIds(): Promise<string[]> {
        await this.bookingsList.first().or(this.noBookingsText).first().waitFor({ state: 'visible' });
        return this.bookingsList.locator(".booking-ref").allInnerTexts();
    }
    async totalBookingCount(): Promise<number> {
        return await this.bookingsList.count();
    }

}