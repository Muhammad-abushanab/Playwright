import { Page, Locator } from "@playwright/test";

export class EventsPage {
    readonly page: Page
    readonly allEvents: Locator
    readonly addEventButton: Locator
    readonly searchInput: Locator

    constructor(page: Page) {
        this.page = page
        this.allEvents = page.getByTestId('event-card')
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
        return await this.allEvents.count()
    }
    async getEventBookButtonAndClick(eventName: string): Promise<void> {
        const eventCard = this.page.getByTestId('event-card').filter({ hasText: eventName })
        await eventCard.getByRole('link', { name: 'Book Now' }).click()
    }
    async getEventPrice(eventName: string): Promise<string> {
        const eventCard = this.page.getByTestId('event-card').filter({ hasText: eventName })
        const priceLocator = eventCard.getByText(/\$\d+(\.\d{2})?/)
        return await priceLocator.textContent() || ''
    }
    async getEventAvailableSeats(eventName: string): Promise<string> {
        const eventCard = this.page.getByTestId('event-card').filter({ hasText: eventName })
        const availableSeatsLocator = eventCard.getByText(/\d+\s+seats available/i)
        return await availableSeatsLocator.textContent() || ''
    }
}