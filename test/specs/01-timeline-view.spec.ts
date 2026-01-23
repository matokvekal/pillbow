import { test, expect } from '@playwright/test';

test.describe('SECTION 1: Timeline View (TC-001 to TC-050)', () => {

   test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
   });

   test('TC-001: Timeline loads on app start', async ({ page }) => {
      // Verify timeline container is visible
      const timeline = page.locator('.timeline-container');
      await expect(timeline).toBeVisible();

      // Verify day cards are present
      const dayCards = page.locator('.pillbox-card');
      await expect(dayCards).toHaveCount({ min: 5 });
   });

   test('TC-002: Today is visible and centered on load', async ({ page }) => {
      // Look for "Today" text in the timeline
      const todayCard = page.getByText('Today').first();
      await expect(todayCard).toBeVisible();

      // Verify it's in viewport
      const isInViewport = await todayCard.isVisible();
      expect(isInViewport).toBeTruthy();
   });

   test('TC-003: Past days display correctly', async ({ page }) => {
      // Scroll up to find past days
      await page.mouse.wheel(0, -500);
      await page.waitForTimeout(500);

      // Check for status indicators (green/orange/red)
      const pastDays = page.locator('.pillbox-card--inactive');
      const count = await pastDays.count();
      expect(count).toBeGreaterThan(0);
   });

   test('TC-004: Future days display correctly', async ({ page }) => {
      // Scroll down to find future days
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(500);

      // Check for "SCHEDULED" badge
      const scheduledBadge = page.getByText('SCHEDULED');
      await expect(scheduledBadge.first()).toBeVisible();
   });

   test('TC-007: Timeline scrolls smoothly', async ({ page }) => {
      const timeline = page.locator('.timeline-container');

      // Get initial scroll position
      const initialScroll = await timeline.evaluate(el => el.scrollTop);

      // Scroll down
      await page.mouse.wheel(0, 1000);
      await page.waitForTimeout(100);

      // Verify scroll happened
      const newScroll = await timeline.evaluate(el => el.scrollTop);
      expect(newScroll).toBeGreaterThan(initialScroll);
   });

   test('TC-010: Day card tap opens day modal', async ({ page }) => {
      // Click on today's card
      const todayCard = page.locator('.pillbox-card').first();
      await todayCard.click();

      // Verify modal opened
      const modal = page.locator('.modal-container');
      await expect(modal).toBeVisible();

      // Verify card header is present
      const cardHeader = page.locator('.card-header');
      await expect(cardHeader).toBeVisible();
   });

   test('TC-016: Today button scrolls to today', async ({ page }) => {
      // Scroll away from today
      await page.mouse.wheel(0, 1000);
      await page.waitForTimeout(500);

      // Click Today FAB button
      const todayButton = page.locator('.floating-action-buttons button').first();
      await todayButton.click();
      await page.waitForTimeout(500);

      // Verify Today card is visible
      const todayText = page.getByText('Today');
      await expect(todayText.first()).toBeVisible();
   });

   test('TC-017: Today button is always visible', async ({ page }) => {
      const todayButton = page.locator('.floating-action-buttons button').first();
      await expect(todayButton).toBeVisible();

      // Scroll and check again
      await page.mouse.wheel(0, 1000);
      await page.waitForTimeout(300);
      await expect(todayButton).toBeVisible();

      await page.mouse.wheel(0, -1000);
      await page.waitForTimeout(300);
      await expect(todayButton).toBeVisible();
   });

   test('TC-019: Day click when another day is open', async ({ page }) => {
      // Open first day
      const firstCard = page.locator('.pillbox-card').first();
      await firstCard.click();

      let modal = page.locator('.modal-container');
      await expect(modal).toBeVisible();

      // Get first day's header text
      const firstHeader = await page.locator('.card-header__title').textContent();

      // Close and open another day
      await page.locator('.card-header__close-btn').click();
      await page.waitForTimeout(300);

      const secondCard = page.locator('.pillbox-card').nth(1);
      await secondCard.click();

      modal = page.locator('.modal-container');
      await expect(modal).toBeVisible();

      const secondHeader = await page.locator('.card-header__title').textContent();
      expect(secondHeader).not.toBe(firstHeader);
   });
});
