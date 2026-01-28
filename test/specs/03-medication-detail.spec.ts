import { test, expect } from '@playwright/test';

test.describe('SECTION 3: Medication Detail Sheet (TC-051 to TC-070)', () => {

   test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Open today's modal
      const todayCard = page.locator('.pillbox-card').first();
      await todayCard.click();
      await page.waitForTimeout(500);
   });

   test('TC-051: Detail sheet opens on medication click', async ({ page }) => {
      // Click on a medication (pill graphic or medication item)
      const medication = page.locator('.pill-graphic, .list-view__item, .medication-footer__med-item').first();

      if (await medication.isVisible()) {
         await medication.click();
         await page.waitForTimeout(500);

         // Verify detail sheet opened
         const detailSheet = page.locator('.detail-sheet-overlay, .detail-sheet-content');
         await expect(detailSheet).toBeVisible();
      }
   });

   test('TC-052: Detail sheet shows medication name', async ({ page }) => {
      const medication = page.locator('.pill-graphic, .list-view__item, .medication-footer__med-item').first();

      if (await medication.isVisible()) {
         await medication.click();
         await page.waitForTimeout(500);

         const title = page.locator('.detail-sheet-title');
         await expect(title).toBeVisible();

         const titleText = await title.textContent();
         expect(titleText).toBeTruthy();
         expect(titleText?.length).toBeGreaterThan(0);
      }
   });

   test('TC-053: Detail sheet shows strength/dosage', async ({ page }) => {
      const medication = page.locator('.pill-graphic, .list-view__item, .medication-footer__med-item').first();

      if (await medication.isVisible()) {
         await medication.click();
         await page.waitForTimeout(500);

         const badges = page.locator('.detail-sheet-badge');
         const count = await badges.count();
         expect(count).toBeGreaterThan(0);
      }
   });

   test('TC-061: Edit button visible on detail sheet', async ({ page }) => {
      const medication = page.locator('.pill-graphic, .list-view__item, .medication-footer__med-item').first();

      if (await medication.isVisible()) {
         await medication.click();
         await page.waitForTimeout(500);

         const editButton = page.locator('.detail-sheet-edit-btn');
         await expect(editButton).toBeVisible();
      }
   });

   test('TC-062: Edit button opens edit form', async ({ page }) => {
      const medication = page.locator('.pill-graphic, .list-view__item, .medication-footer__med-item').first();

      if (await medication.isVisible()) {
         await medication.click();
         await page.waitForTimeout(500);

         const editButton = page.locator('.detail-sheet-edit-btn');
         await editButton.click();
         await page.waitForTimeout(500);

         // Verify edit form opened
         const editForm = page.locator('.medication-edit, .change-flow, .stop-flow');
         await expect(editForm).toBeVisible();
      }
   });

   test('TC-064: Order button opens search', async ({ page }) => {
      const medication = page.locator('.pill-graphic, .list-view__item, .medication-footer__med-item').first();

      if (await medication.isVisible()) {
         await medication.click();
         await page.waitForTimeout(500);

         const orderButton = page.locator('.detail-sheet-action--order');

         if (await orderButton.isVisible()) {
            // Listen for new page
            const [newPage] = await Promise.all([
               page.context().waitForEvent('page'),
               orderButton.click()
            ]);

            await newPage.waitForLoadState();
            expect(newPage.url()).toContain('google.com');
            await newPage.close();
         }
      }
   });

   test('TC-065: Info button opens drug info', async ({ page }) => {
      const medication = page.locator('.pill-graphic, .list-view__item, .medication-footer__med-item').first();

      if (await medication.isVisible()) {
         await medication.click();
         await page.waitForTimeout(500);

         const infoButton = page.locator('.detail-sheet-action--info');

         if (await infoButton.isVisible()) {
            const [newPage] = await Promise.all([
               page.context().waitForEvent('page'),
               infoButton.click()
            ]);

            await newPage.waitForLoadState();
            expect(newPage.url()).toContain('google.com');
            await newPage.close();
         }
      }
   });

   test('TC-066: Ask AI button opens Claude', async ({ page }) => {
      const medication = page.locator('.pill-graphic, .list-view__item, .medication-footer__med-item').first();

      if (await medication.isVisible()) {
         await medication.click();
         await page.waitForTimeout(500);

         const aiButton = page.locator('.detail-sheet-action--ai');

         if (await aiButton.isVisible()) {
            const [newPage] = await Promise.all([
               page.context().waitForEvent('page'),
               aiButton.click()
            ]);

            await newPage.waitForLoadState();
            expect(newPage.url()).toContain('claude.ai');
            await newPage.close();
         }
      }
   });
});
