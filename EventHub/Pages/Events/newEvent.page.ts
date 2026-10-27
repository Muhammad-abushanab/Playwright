import { Page, Locator } from "@playwright/test";

export interface NewEventDetails {
    title: string;
    description: string;
    category: string;
    city: string;
    venue: string;
    dateAndTime: string;
    price: number;
    totalSeats: number;
}

export class NewEventPage {
    readonly page: Page
    readonly eventTitleInput: Locator
    readonly eventDescriptionInput: Locator
    readonly eventCategorySelect: Locator
    readonly eventCityInput: Locator
    readonly eventVenueInput: Locator
    readonly eventDateAndTimeInput: Locator
    readonly eventPriceInput: Locator
    readonly eventTotalSeatsInput: Locator
    readonly addEventSubmitButton: Locator

    constructor(page: Page) {
        this.page = page
        this.eventTitleInput = page.getByRole('textbox', { name: 'Title' })
        this.eventDescriptionInput = page.getByPlaceholder('Describe the event…')
        this.eventCategorySelect = page.getByRole('combobox', { name: 'Category' })
        this.eventCityInput = page.getByRole('textbox', { name: 'City' })
        this.eventVenueInput = page.getByRole('textbox', { name: 'Venue' })
        this.eventDateAndTimeInput = page.getByLabel('Event Date & Time')
        this.eventPriceInput = page.getByRole('spinbutton', { name: 'Price' })
        this.eventTotalSeatsInput = page.getByRole('spinbutton', { name: 'Total Seats' })
        this.addEventSubmitButton = page.getByRole('button', { name: 'Add Event' })
    }

    async addNewEvent(event: NewEventDetails): Promise<void> {
        await this.eventTitleInput.fill(event.title)
        await this.eventDescriptionInput.fill(event.description)
        await this.eventCategorySelect.selectOption({ label: event.category })
        await this.eventCityInput.fill(event.city)
        await this.eventVenueInput.fill(event.venue)
        await this.eventDateAndTimeInput.fill(event.dateAndTime)
        await this.eventPriceInput.fill(event.price.toString())
        await this.eventTotalSeatsInput.fill(event.totalSeats.toString())
        await this.addEventSubmitButton.click()
    }
}
