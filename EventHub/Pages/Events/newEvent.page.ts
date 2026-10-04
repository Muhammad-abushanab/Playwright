import { Page, Locator } from "@playwright/test";
import { EventsPage } from "./events.page";
export class NewEventPage extends EventsPage {
    readonly eventTitleInput: Locator
    readonly eventDescriptionInput: Locator
    readonly eventCategorySelect: Locator
    readonly eventCityInput: Locator
    readonly eventVenueInput: Locator
    readonly eventDateAndTimeInput: Locator
    readonly eventPriceInput: Locator
    readonly eventTotalSeatsInput: Locator
    readonly addEventSubmitButton: Locator
    readonly allEvents: Locator

    constructor(page: Page) {
        super(page)
        this.eventTitleInput = page.getByRole('textbox', { name: 'Title' })
        this.eventDescriptionInput = page.getByPlaceholder('Describe the event…')
        this.eventCategorySelect = page.getByRole('combobox', { name: 'Category' })
        this.eventCityInput = page.getByRole('textbox', { name: 'City' })
        this.eventVenueInput = page.getByRole('textbox', { name: 'Venue' })
        this.eventDateAndTimeInput = page.getByLabel('Event Date & Time')
        this.eventPriceInput = page.getByRole('spinbutton', { name: 'Price' })
        this.eventTotalSeatsInput = page.getByRole('spinbutton', { name: 'Total Seats' })
        this.addEventSubmitButton = page.getByRole('button', { name: 'Add Event' })
        this.allEvents = page.getByTestId('event-table-row')
    }

    async addNewEvent(eventTitle: string, eventDescription: string, eventCategory: string, eventCity: string, eventVenue: string, eventDateAndTime: string, eventPrice: number, eventTotalSeats: number): Promise<void> {
        await this.eventTitleInput.fill(eventTitle)
        await this.eventDescriptionInput.fill(eventDescription)
        await this.eventCategorySelect.selectOption({ label: eventCategory })
        await this.eventCityInput.fill(eventCity)
        await this.eventVenueInput.fill(eventVenue)
        await this.eventDateAndTimeInput.fill(eventDateAndTime)
        await this.eventPriceInput.fill(eventPrice.toString())
        await this.eventTotalSeatsInput.fill(eventTotalSeats.toString())
        await this.addEventSubmitButton.click()
    }

    async getLastEventTitle(): Promise<string> {
        const lastEvent = this.allEvents.last()
        const titleLocator = lastEvent.locator('td').nth(0)
        return await titleLocator.textContent() || ''
    }
}
    