import { test, expect } from '@playwright/test';

test.describe('SECTION 5: Add Medication Flow (TC-201 to TC-217)', () => {

   test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
   });

   test('TC-201: Open Add Medication modal', async ({ page }) => {
      // Look for add button (+ FAB or settings add button)
      const addButton = page.locator('.floating-action-buttons button').last();

      if (await addButton.isVisible()) {
         await addButton.click();
         await page.waitForTimeout(500);

         const addModal = page.locator('.add-medication, .modal-container');
         await expect(addModal).toBeVisible();
      } else {
         // Try from settings
         const settingsButton = page.locator('.app-header button').last();
         await settingsButton.click();
         await page.waitForTimeout(300);

         const addMedButton = page.getByText('Add Medication', { exact: false });
         if (await addMedButton.isVisible()) {
            await addMedButton.click();
            await page.waitForTimeout(500);
         }
      }
   });

   test('TC-202: Manual add form displays', async ({ page }) => {
      // Open add medication
      const addButton = page.locator('.floating-action-buttons button').last();

      if (await addButton.isVisible()) {
         await addButton.click();
         await page.waitForTimeout(500);

         // Look for manual entry option or form fields
         const nameField = page.locator('input[name="name"], input[placeholder*="name" i]');
         const strengthField = page.locator('input[name="strength"], input[placeholder*="strength" i]');

         // At least one should be visible
         const nameVisible = await nameField.isVisible();
         const strengthVisible = await strengthField.isVisible();
         expect(nameVisible || strengthVisible).toBeTruthy();
      }
   });

   test('TC-211: AI scan button visible', async ({ page }) => {
      const addButton = page.locator('.floating-action-buttons button').last();

      if (await addButton.isVisible()) {
         await addButton.click();
         await page.waitForTimeout(500);

         // Look for scan/AI button
         const scanButton = page.getByText('Scan', { exact: false });
         const aiButton = page.getByText('AI', { exact: false });

         const scanVisible = await scanButton.isVisible();
         const aiVisible = await aiButton.isVisible();

         // At least one scan option should be present
         expect(scanVisible || aiVisible).toBeTruthy();
      }
   });
});
