import { Locator, Page } from "@playwright/test";

export class ManageEventsPage {
    readonly page: Page;
    readonly eventRows: Locator;
    readonly eventDeleteStatus: Locator;

    constructor(page: Page) {
        this.page = page;
        this.eventRows = page.getByTestId('event-table-row');
        this.eventDeleteStatus = page.getByText('Event deleted');
    }

    eventTitleCell(eventTitle: string): Locator {
        return this.eventRows
            .filter({ hasText: eventTitle })
            .locator('td')
            .first();
    }

    async deleteEventByTitle(eventTitle: string): Promise<void> {
        await this.eventRows
            .filter({ hasText: eventTitle })
            .getByTestId('delete-event-btn')
            .click();
        await this.confirmEventDeletion();
    }

    async deleteLastEvent(): Promise<void> {
        await this.eventRows.last().getByTestId('delete-event-btn').click();
        await this.confirmEventDeletion();
    }

    private async confirmEventDeletion(): Promise<void> {
        await this.page.getByTestId('confirm-dialog-yes').click();
    }
}