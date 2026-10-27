import {test, expect , request} from '@playwright/test';
import { config } from '../config/config';
import { HomePage } from '../Pages/Home/home.page';
import { EventsPage } from '../Pages/Events/events.page';

const payload = {
    "email": `${config.email}`,
    "password": `${config.password}`
}
let token:string;
test.beforeAll('verify the token from API', async () => {
    const apiContext = await request.newContext()
    const loginResponse = await apiContext.post(`${config.api}/api/auth/login`, {
        data: payload,
    })
    expect(loginResponse.ok()).toBeTruthy();
    const responseBody = await loginResponse.json();
    token = responseBody.token;
    expect(token).toMatch(
        /^eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/
    );
})

test('inject the token to local storage', async ({page})=>{
    await page.addInitScript(value => {
        window.localStorage.setItem("eventhub_token",value)
    },token)

    await page.goto(`${config.URL}`)
    expect(page).toHaveURL(`${config.URL}`)
    const homepage = new HomePage(page)
    await expect(homepage.eventLink).toBeInViewport({ratio: 1.0});
    await homepage.navigateToEvents();
    const evenPage = new EventsPage(page)
    await evenPage.eventCards.filter({ hasText:"Automation Testing Wednesday, October 14, 2026 at 10:05 AM"}).scrollIntoViewIfNeeded()
    await expect(evenPage.eventCards.filter({ hasText:"Automation Testing Wednesday, October 14, 2026 at 10:05 AM"})).toBeInViewport({ratio:0.7})
})