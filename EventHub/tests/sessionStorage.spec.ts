import { test, expect } from "@playwright/test"
import { config } from "../config/config";
import { LoginPage } from "../Pages/Login/Login.page";
import { HomePage } from "../Pages/Home/home.page";
import { EventsPage } from "../Pages/Events/events.page";
import { NewEventPage } from "../Pages/Events/newEvent.page";
import { BookNewEventTicketPage } from "../Pages/Events/BookNewEventTicket.page";
import { MyBookingsPage } from "../Pages/Mybookings/MyBooking.page";


test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(config.URL);
    await expect(page).toHaveTitle(/EventHub/);
    const loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);
    const homepage = new HomePage(page)
    await expect(homepage.eventLink).toBeVisible()
    await context.storageState({ path: '../Utils/state.json' })
})

test('Admin can create an event and book tickets', async ({browser}) => {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    } as const;
    const currentDateTime: string = new Date().toLocaleString('en-US', options);
    const eventTitle = `Automation Testing ${currentDateTime}`;
    const ticketQuantity = 3;
    const page =await (await browser.newContext({storageState: "../Utils/state.json"})).newPage()
    await page.goto(config.URL)
    const homePage = new HomePage(page);
    await homePage.navigateToEvents();

    const eventsPage = new EventsPage(page);
    await eventsPage.navigateToAddEvent();

    await expect(page).toHaveURL(/\/admin\/events/);

    const newEventPage = new NewEventPage(page);

    await newEventPage.addNewEvent({
        title: eventTitle,
        description: 'Event created using Playwright',
        category: 'Sports',
        city: 'New York',
        venue: 'Madison Square Garden',
        dateAndTime: '2027-12-31T20:00',
        price: Math.floor(Math.random() * 15),
        totalSeats: 500,
    });

    await homePage.navigateToEvents();
    await eventsPage.searchEvent(eventTitle);
    await expect(eventsPage.getEventTitle(eventTitle)).toBeInViewport();
    await expect(eventsPage.eventCards).toHaveCount(1);

    const initialSeats = Number(
        (await eventsPage.getEventAvailableSeats(eventTitle))
            .split(' ')[0]
    );

    const eventPrice = await eventsPage.getEventPrice(eventTitle);

    await eventsPage.clickBookNow(eventTitle);

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
    await expect(eventsPage.eventCards).toHaveCount(1);
    await expect.poll(() => eventsPage.getEventAvailableSeats(eventTitle)).toBe(
        `${initialSeats - ticketQuantity - 1} seats available`
    );

    const myBookingsPage = new MyBookingsPage(page);

    await homePage.navigateToMyBookings();
    await expect(page).toHaveURL(/\/bookings/);

    await expect.poll(() => myBookingsPage.getFirstBookingRefId()).toBe(referenceId);
});