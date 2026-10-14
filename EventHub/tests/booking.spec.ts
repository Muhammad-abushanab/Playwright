
import { test, expect } from '@playwright/test';
import { config } from '../config/config';
import { LoginPage } from '../Pages/Login/Login.page';
import { HomePage } from '../Pages/Home/home.page';
import { EventsPage } from '../Pages/Events/events.page';
import { NewEventPage } from '../Pages/Events/newEvent.page';
import { BookNewEventTicketPage } from '../Pages/Events/BookNewEventTicket.page';
import { MyBookingsPage } from '../Pages/Mybookings/MyBooking.page';

test.describe('Event creation and ticket booking', () => {
    test('Admin can create an event and book tickets', async ({ page }) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }as const;
        const currentDateTime: string = new Date().toLocaleString('en-US',options);
        const eventTitle = `Automation Testing ${currentDateTime}`;
        const ticketQuantity = 3;

        await page.goto(config.URL);
        await expect(page).toHaveTitle(/EventHub/);

        const loginPage = new LoginPage(page);
        await loginPage.login(config.email, config.password);

        const homePage = new HomePage(page);
        await homePage.navigateToEvents();

        const eventsPage = new EventsPage(page);
        await eventsPage.navigateToAddEvent();

        await expect(page).toHaveURL(/\/admin\/events/);

        const newEventPage = new NewEventPage(page);

        await newEventPage.addNewEvent(
            eventTitle,
            'Event created using Playwright',
            'Sports',
            'New York',
            'Madison Square Garden',
            '2027-12-31T20:00',
            Math.floor(Math.random() * 15),
            500
        );

        await expect(
            newEventPage.getLastAddedEventTitle(eventTitle)
        ).resolves.toBe(eventTitle);

        await homePage.navigateToEvents();
        await eventsPage.searchEvent(eventTitle);
        await page.waitForTimeout(1000)

        expect(await eventsPage.getEventTitle(eventTitle)).toBeInViewport()
        await page.waitForLoadState('domcontentloaded')
        await expect(
            eventsPage.getEventCount()
        ).resolves.toBe(1);

        const initialSeats = Number(
            (await eventsPage.getEventAvailableSeats(eventTitle))
                .split(' ')[0]
        );

        const eventPrice = await eventsPage.getEventPrice(eventTitle);

        await eventsPage.getEventBookButtonAndClick(eventTitle);

        const bookingPage = new BookNewEventTicketPage(page);

        await expect(bookingPage.bookingTotalForm).toBeVisible();
        await expect(bookingPage.topRightPrice).toHaveText(eventPrice);

        await bookingPage.increaseTicketQuantity(ticketQuantity);

        await bookingPage.fillBookingForm(
            'John Doe',
            'john.doe@example.com',
            '07987654321'
        );

        await bookingPage.submitBooking();

        await expect(page).toHaveURL(/\/events\/\d+/);

        const referenceId = await bookingPage.getBookingReferenceID();

        expect(referenceId).toBeTruthy();

        await homePage.navigateToEvents();
        await eventsPage.searchEvent(eventTitle);
        await page.waitForTimeout(1000)
        await expect(
            eventsPage.getEventAvailableSeats(eventTitle)
        ).resolves.toBe(
            `${initialSeats - ticketQuantity - 1} seats available`
        );

        const myBookingsPage = new MyBookingsPage(page);

        await homePage.navigateToMyBookings();
        await expect(page).toHaveURL(/\/bookings/);

        expect(
            await myBookingsPage.getLastbookingRefId()
        ).toBe(referenceId);
    });

    test('As an Admin I should be able to manage events and detlete them', async ({ page }) => {
        await page.goto(config.URL);
        await expect(page).toHaveTitle(/EventHub/);

        const loginPage = new LoginPage(page);
        await loginPage.login(config.email, config.password);

        const homePage = new HomePage(page);
        await homePage.navigateToAdmin('Manage Events');

        const newEventPage = new NewEventPage(page);
        await expect(newEventPage.allEvents.first()).toBeVisible()
        //await newEventPage.deleteEventBasedOnTitle("Automation Testing 1791710296080");
        await newEventPage.deleteLastEvent();
        await expect(newEventPage.eventDeleteStatus).toBeVisible();
    })

    test('As an Admin I should be Able to view the details of my booking and check refund eligibilty', async ({ page }) => {
        await page.goto(config.URL);
        await expect(page).toHaveTitle(/EventHub/);

        const loginPage = new LoginPage(page);
        await loginPage.login(config.email, config.password);

        const homePage = new HomePage(page);
        await homePage.navigateToMyBookings();
        const mybookings = new MyBookingsPage(page)
        await expect(mybookings.bookingsList.first()).toBeVisible();
        await mybookings.clickViewDetailsBasedOnRefID("A-CCJZXJ");
        await expect(page).toHaveURL(/bookings/);
        await expect(mybookings.elibilityBTN).toBeVisible();
        await mybookings.checkElibility();
        await expect(mybookings.refundStatus).toBeVisible();
    })

    test('As an Admin I should be Able to cancel my booking', async ({ page }) => {
        await page.goto(config.URL);
        await expect(page).toHaveTitle(/EventHub/);

        const loginPage = new LoginPage(page);
        await loginPage.login(config.email, config.password);

        const homePage = new HomePage(page);
        await homePage.navigateToMyBookings();
        const mybookings = new MyBookingsPage(page)
        await expect(mybookings.bookingsList.first()).toBeVisible();
        const totalBookingsCountBeforeCancel = await mybookings.totalBookingCount();
        await mybookings.cancelBookingRefID("A-CCJZXJ")
        expect(await mybookings.cancelStatusMessage.innerText()).toBe("Booking cancelled successfully");
        expect(await mybookings.totalBookingCount()).toEqual(totalBookingsCountBeforeCancel - 1);
    })
});