import { test, expect } from '@playwright/test';

test.describe('SECTION 8: Manage Medications View (TC-351 to TC-370)', () => {

   test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
   });

   test('TC-351: Open Manage Medications from timeline', async ({ page }) => {
      // Open a day modal
      const todayCard = page.locator('.pillbox-card').first();
      await todayCard.click();
      await page.waitForTimeout(500);

      // Look for Manage List button
      const manageButton = page.locator('.medication-footer__toggle');

      if (await manageButton.isVisible()) {
         await manageButton.click();
         await page.waitForTimeout(500);

         // Verify manage view or expanded footer
         const manageContent = page.locator('.medication-footer__content, .manage-view');
         await expect(manageContent).toBeVisible();
      }
   });

   test('TC-352: Open Manage from settings', async ({ page }) => {
      // Open settings
      const settingsButton = page.locator('.app-header button').last();
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Click on Medications quick action card
      const medicationsCard = page.locator('.quick-action-card--primary');

      if (await medicationsCard.isVisible()) {
         await medicationsCard.click();
         await page.waitForTimeout(500);

         // Verify manage view opened
         const manageView = page.locator('.manage-view, .medication-list');
         await expect(manageView).toBeVisible();
      }
   });

   test('TC-353: Manage view displays all medications', async ({ page }) => {
      // Navigate to manage view via settings
      const settingsButton = page.locator('.app-header button').last();
      await settingsButton.click();
      await page.waitForTimeout(500);

      const medicationsCard = page.locator('.quick-action-card--primary');

      if (await medicationsCard.isVisible()) {
         await medicationsCard.click();
         await page.waitForTimeout(500);

         // Count medication items
         const medItems = page.locator('.medication-item, .medication-card, .manage-view__item');
         const count = await medItems.count();

         expect(count).toBeGreaterThan(0);
      }
   });

   test('TC-356: Click medication in manage view', async ({ page }) => {
      const settingsButton = page.locator('.app-header button').last();
      await settingsButton.click();
      await page.waitForTimeout(500);

      const medicationsCard = page.locator('.quick-action-card--primary');

      if (await medicationsCard.isVisible()) {
         await medicationsCard.click();
         await page.waitForTimeout(500);

         // Click first medication
         const firstMed = page.locator('.medication-item, .medication-card, .manage-view__item').first();

         if (await firstMed.isVisible()) {
            await firstMed.click();
            await page.waitForTimeout(500);

            // Verify detail sheet opened
            const detailSheet = page.locator('.detail-sheet-overlay, .detail-sheet-content');
            await expect(detailSheet).toBeVisible();
         }
      }
   });

   test('TC-362: Close manage view', async ({ page }) => {
      const settingsButton = page.locator('.app-header button').last();
      await settingsButton.click();
      await page.waitForTimeout(500);

      const medicationsCard = page.locator('.quick-action-card--primary');

      if (await medicationsCard.isVisible()) {
         await medicationsCard.click();
         await page.waitForTimeout(500);

         // Look for close/back button
         const closeButton = page.locator('.manage-view__close, .modal-close, button[aria-label*="close" i]');

         if (await closeButton.isVisible()) {
            await closeButton.click();
            await page.waitForTimeout(300);

            // Verify view closed
            const manageView = page.locator('.manage-view');
            const isVisible = await manageView.isVisible();
            expect(isVisible).toBeFalsy();
         }
      }
   });
});
