import { test, expect } from '@playwright/test';

test('verify dashboard and admin routes existence', async ({ page }) => {
  // We'll check if the routes are defined in App.jsx and if navigating to them does something (like redirecting to login)
  await page.goto('http://localhost:5173/dashboard');
  // It should probably redirect or show login since we aren't authenticated
  // But let's see if we can see the text "Login" or similar
  await page.waitForTimeout(1000);
  console.log('Dashboard title:', await page.title());

  await page.goto('http://localhost:5173/admin');
  await page.waitForTimeout(1000);
  console.log('Admin title:', await page.title());
});
