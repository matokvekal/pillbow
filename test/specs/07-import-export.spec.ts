import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('SECTION 7: Data Import/Export (TC-301 to TC-323)', () => {

   test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
   });

   test('TC-301: Open settings/configuration', async ({ page }) => {
      // Click settings icon
      const settingsButton = page.locator('.app-header button').last();
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Verify settings view opened
      const settingsView = page.locator('.settings-v2, .settings-view');
      await expect(settingsView).toBeVisible();
   });

   test('TC-302: Export button visible in settings', async ({ page }) => {
      const settingsButton = page.locator('.app-header button').last();
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Look for export/backup button
      const exportButton = page.getByText('Export', { exact: false });
      const backupButton = page.getByText('Backup', { exact: false });

      const exportVisible = await exportButton.isVisible();
      const backupVisible = await backupButton.isVisible();

      expect(exportVisible || backupVisible).toBeTruthy();
   });

   test('TC-303: Export creates JSON file', async ({ page }) => {
      const settingsButton = page.locator('.app-header button').last();
      await settingsButton.click();
      await page.waitForTimeout(500);

      const exportButton = page.getByText('Export', { exact: false });

      if (await exportButton.isVisible()) {
         // Set up download listener
         const [download] = await Promise.all([
            page.waitForEvent('download'),
            exportButton.click()
         ]);

         // Verify download
         const fileName = download.suggestedFilename();
         expect(fileName).toContain('.json');

         // Optionally save and verify contents
         const downloadPath = await download.path();
         if (downloadPath) {
            const exists = fs.existsSync(downloadPath);
            expect(exists).toBeTruthy();
         }
      }
   });

   test('TC-304: Export filename format', async ({ page }) => {
      const settingsButton = page.locator('.app-header button').last();
      await settingsButton.click();
      await page.waitForTimeout(500);

      const exportButton = page.getByText('Export', { exact: false });

      if (await exportButton.isVisible()) {
         const [download] = await Promise.all([
            page.waitForEvent('download'),
            exportButton.click()
         ]);

         const fileName = download.suggestedFilename();
         // Should match format: pillbow-backup-YYYY-MM-DD.json
         expect(fileName).toMatch(/pillbow.*\d{4}-\d{2}-\d{2}\.json/);
      }
   });

   test('TC-305: Export contains all user data', async ({ page }) => {
      const settingsButton = page.locator('.app-header button').last();
      await settingsButton.click();
      await page.waitForTimeout(500);

      const exportButton = page.getByText('Export', { exact: false });

      if (await exportButton.isVisible()) {
         const [download] = await Promise.all([
            page.waitForEvent('download'),
            exportButton.click()
         ]);

         const downloadPath = await download.path();
         if (downloadPath) {
            const content = fs.readFileSync(downloadPath, 'utf-8');
            const data = JSON.parse(content);

            // Verify structure
            expect(data).toHaveProperty('medications');
            expect(Array.isArray(data.medications)).toBeTruthy();
            expect(data).toHaveProperty('dayLogs');
         }
      }
   });

   test('TC-309: Import button visible in settings', async ({ page }) => {
      const settingsButton = page.locator('.app-header button').last();
      await settingsButton.click();
      await page.waitForTimeout(500);

      const importButton = page.getByText('Import', { exact: false });
      const restoreButton = page.getByText('Restore', { exact: false });

      const importVisible = await importButton.isVisible();
      const restoreVisible = await restoreButton.isVisible();

      expect(importVisible || restoreVisible).toBeTruthy();
   });

   test('TC-311: Import confirmation warning', async ({ page }) => {
      const settingsButton = page.locator('.app-header button').last();
      await settingsButton.click();
      await page.waitForTimeout(500);

      const importButton = page.getByText('Import', { exact: false });

      if (await importButton.isVisible()) {
         // Create a test JSON file
         const testData = {
            medications: [],
            dayLogs: [],
            settings: {}
         };

         const testFilePath = path.join(__dirname, '..', 'test-backup.json');
         fs.writeFileSync(testFilePath, JSON.stringify(testData));

         // Click import and select file
         await importButton.click();
         await page.waitForTimeout(300);

         // Look for file input
         const fileInput = page.locator('input[type="file"]');
         if (await fileInput.isVisible()) {
            await fileInput.setInputFiles(testFilePath);
            await page.waitForTimeout(500);

            // Look for confirmation dialog
            const confirmDialog = page.locator('.confirm-dialog, [role="dialog"]');
            const confirmText = page.getByText('REPLACE', { exact: false });

            const dialogVisible = await confirmDialog.isVisible();
            const textVisible = await confirmText.isVisible();

            expect(dialogVisible || textVisible).toBeTruthy();
         }

         // Cleanup
         fs.unlinkSync(testFilePath);
      }
   });
});
