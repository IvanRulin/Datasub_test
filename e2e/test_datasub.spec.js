import {test, expect} from "@playwright/test"

test.beforeEach(async({page}) => {
    await page.goto('https://qatest.datasub.com/index.html')
})

test('positive', async ({page}) => {
    const interceptResponse = page.waitForResponse('https://example.com/api/subscribe', {timeout: 10000})

    await page.locator('#subscriptionForm').scrollIntoViewIfNeeded()
    await page.locator('#subscriptionForm #name').fill("Test Name")
    await page.locator('#subscriptionForm #email').fill("test@test.test")
    await page.locator('#subscriptionForm #message').fill("Eirmod sed tempor lorem ut dolores")

    await page.locator('#subscriptionForm #service').selectOption('Select B Service')
    await page.locator('#subscriptionForm #purposeBusiness').check()
    await page.locator('#subscriptionForm #withdrawCash').check()
    await page.locator('#subscriptionForm #withdrawCard').check()
    await page.locator('#subscriptionForm #withdrawCrypto').check()

    await page.getByRole('button', {name: 'Request A Quote'}).click()

    const response = await interceptResponse
    expect(response.status()).toBe(200)

    await page.locator('#formStatus').waitFor({state: 'visible'})
    await expect(page.locator('#formStatus')).toBeVisible()
    await expect(page.locator('#formStatus')).toContainText('Форма отправлена')

    
})

test('negative case (empty email)', async ({page}) => {
    await page.locator('#subscriptionForm').scrollIntoViewIfNeeded()
    await page.locator('#subscriptionForm #name').fill("Test Name")
    await page.locator('#subscriptionForm #message').fill("Eirmod sed tempor lorem ut dolores")

    await page.locator('#subscriptionForm #service').selectOption('Select B Service')
    await page.locator('#subscriptionForm #purposeBusiness').check()
    await page.locator('#subscriptionForm #withdrawCash').check()
    await page.locator('#subscriptionForm #withdrawCard').check()
    await page.locator('#subscriptionForm #withdrawCrypto').check()

    await page.getByRole('button', {name: 'Request A Quote'}).click()

    await page.locator('#email.is-invalid').waitFor({state: 'visible'})
    await expect(page.locator('#email.is-invalid')).toBeVisible()
    
})