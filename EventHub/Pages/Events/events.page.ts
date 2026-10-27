import { Page, Locator } from "@playwright/test";

export class EventsPage {
    readonly page: Page
    readonly eventCards: Locator
    readonly addEventButton: Locator
    readonly searchInput: Locator

    constructor(page: Page) {
        this.page = page
        this.eventCards = page.getByTestId('event-card')
        this.addEventButton = page.getByRole('button', { name: 'Add New Event' })
        this.searchInput = page.getByPlaceholder('Search events, venues…')
    }
    async navigateToAddEvent(): Promise<void> {
        await this.addEventButton.click()
    }
    async searchEvent(eventName: string): Promise<void> {
        await this.searchInput.fill(eventName)
    }
    async getEventCount(): Promise<number> {
        return this.eventCards.count()
    }
    async clickBookNow(eventName: string): Promise<void> {
        const eventCard = this.eventCard(eventName)
        await eventCard.getByRole('link', { name: 'Book Now' }).click()
    }
    async getEventPrice(eventName: string): Promise<string> {
        const eventCard = this.eventCard(eventName)
        const priceLocator = eventCard.getByText(/\$\d+(\.\d{2})?/)
        return priceLocator.innerText()
    }
    async getEventAvailableSeats(eventName: string): Promise<string> {
        const eventCard = this.eventCard(eventName)
        const availableSeatsLocator = eventCard.getByText(/\d+\s+seats available/i)
        return availableSeatsLocator.innerText()
    }
    getEventTitle(eventName: string): Locator {
        return this.eventCard(eventName).getByText(eventName, { exact: true });
    }

    private eventCard(eventName: string): Locator {
        return this.eventCards.filter({ hasText: eventName });
    }
}