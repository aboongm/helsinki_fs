const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // await page.getByRole('textbox').first().fill('test')
    // await page.getByRole('textbox').last().fill('password')
    // await page.getByRole('button', { name: 'login' }).click()
  
    // await expect(page.getByText('test logged in')).toBeVisible()
  })
})