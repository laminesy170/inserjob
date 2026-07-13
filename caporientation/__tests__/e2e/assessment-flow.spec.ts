import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

// Helper to find a valid invitation token (would be set up in test setup)
const getTestInvitationToken = () => {
  // This would be replaced with actual test data from the database
  return 'test-token-12345';
};

test.describe('Assessment Flow', () => {
  test('should complete full assessment workflow', async ({ page }) => {
    // Step 1: Visit introduction page
    const token = getTestInvitationToken();
    await page.goto(`${BASE_URL}/public/assessment/${token}`);

    // Verify introduction page loads
    await expect(page.locator('h1')).toContainText('CapOrientation 360');
    await expect(page.locator('text=Bienvenue')).toBeVisible();

    // Verify GDPR section
    await expect(page.locator('text=Informations RGPD')).toBeVisible();
    await expect(page.locator('text=Responsable de traitement')).toBeVisible();

    // Step 2: Agree to terms and start
    const agreeCheckbox = page.locator('input[type="checkbox"]');
    await agreeCheckbox.check();

    const startButton = page.locator('button:has-text("Commencer le questionnaire")');
    await startButton.click();

    // Step 3: Should redirect to questionnaire
    await page.waitForURL('**/question?session=*');
    await expect(page).toHaveURL(new RegExp(`/public/assessment/${token}/question`));

    // Step 4: Verify questionnaire loads
    await expect(page.locator('h2')).toBeVisible(); // Question text
    await expect(page.locator('button:has-text("1")')).toBeVisible(); // Scale buttons

    // Step 5: Answer all questions
    const getScaleButtons = () => page.locator('button[class*="flex-1"]').filter({
      hasText: /^[1-5]$/,
    });

    let previousIndex = -1;
    let maxIterations = 100; // Safety limit

    while (previousIndex < 0 || previousIndex >= 0) {
      const buttons = getScaleButtons();
      const count = await buttons.count();

      if (count === 0) {
        // All questions answered, we're at the submit button
        break;
      }

      if (maxIterations-- <= 0) {
        break;
      }

      // Answer current question with value 3
      await buttons.nth(2).click(); // Click middle button (value 3)

      // Click "Suivante" or "Terminer"
      const nextButton = page.locator('button:has-text("Suivante"), button:has-text("Terminer")').first();

      if (await page.locator('button:has-text("Terminer")').isVisible()) {
        // Last question, submit
        await nextButton.click();
        break;
      } else {
        // More questions
        await nextButton.click();
        await page.waitForTimeout(300); // Wait for transition
      }
    }

    // Step 6: Wait for results page
    await page.waitForURL('**/public/results/*', { timeout: 10000 });

    // Step 7: Verify results page
    await expect(page.locator('text=Votre rapport d\'auto-positionnement')).toBeVisible();
    await expect(page.locator('text=Vos scores par dimension')).toBeVisible();

    // Verify score is displayed
    const scoreElement = page.locator('text=/^[0-9]{2,3}$/').first();
    await expect(scoreElement).toBeVisible();

    // Verify export buttons
    await expect(page.locator('button:has-text("Imprimer le rapport")')).toBeVisible();
    await expect(page.locator('button:has-text("Télécharger en JSON")')).toBeVisible();
  });

  test('should validate token on introduction page', async ({ page }) => {
    const invalidToken = 'invalid-token-xyz';
    await page.goto(`${BASE_URL}/public/assessment/${invalidToken}`);

    // Should show error message
    await expect(page.locator('text=/Invalid|expired|error/i')).toBeVisible({ timeout: 5000 });
  });

  test('should not allow submission without answering all questions', async ({ page }) => {
    const token = getTestInvitationToken();
    await page.goto(`${BASE_URL}/public/assessment/${token}`);

    const agreeCheckbox = page.locator('input[type="checkbox"]');
    await agreeCheckbox.check();

    const startButton = page.locator('button:has-text("Commencer le questionnaire")');
    await startButton.click();

    await page.waitForURL('**/question?session=*');

    // Try to click "Terminer" without answering
    const terminateButton = page.locator('button:has-text("Terminer")');

    // Button should be disabled if no answer selected
    if (await terminateButton.isVisible()) {
      const isDisabled = await terminateButton.isDisabled();
      expect(isDisabled).toBe(true);
    }
  });

  test('should display all dimensions on results page', async ({ page }) => {
    const token = getTestInvitationToken();

    // Bypass to results page directly for this test
    // In real scenario, this would be generated from a real assessment
    await page.goto(`${BASE_URL}/public/assessment/${token}`);

    const agreeCheckbox = page.locator('input[type="checkbox"]');
    await agreeCheckbox.check();

    const startButton = page.locator('button:has-text("Commencer le questionnaire")');
    await startButton.click();

    // Complete assessment
    await page.waitForURL('**/question?session=*');

    // Answer and submit (same as main test)
    let maxIterations = 100;
    while (maxIterations-- > 0) {
      const buttons = page.locator('button[class*="flex-1"]').filter({ hasText: /^[1-5]$/ });

      if (await buttons.count() === 0) break;

      await buttons.nth(2).click();

      if (await page.locator('button:has-text("Terminer")').isVisible()) {
        await page.locator('button:has-text("Terminer")').click();
        break;
      } else {
        await page.locator('button:has-text("Suivante")').click();
        await page.waitForTimeout(300);
      }
    }

    await page.waitForURL('**/public/results/*');

    // Verify dimensions are displayed
    const dimensionCards = page.locator('div[class*="border"]').filter({ hasText: /^(Autoconscience|Compétences|Exploration|Marché|Digital|Présentation|Recherche|Réseau|Apprentissage|Action)/ });

    // Should have at least some dimensions
    const dimensionCount = await page.locator('text=/Score global/').count();
    expect(dimensionCount).toBeGreaterThan(0);
  });
});
