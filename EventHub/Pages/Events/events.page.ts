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
}