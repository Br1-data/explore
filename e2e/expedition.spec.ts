import { expect, test } from '@playwright/test';

test('two astronauts join, gather, craft and move in the same expedition', async ({ page, browser }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#world canvas')).toBeVisible();
  await page.getByLabel('IL TUO NOMINATIVO').fill('Ada');
  await page.getByRole('button', { name: 'Nuova spedizione' }).click();
  await expect(page.locator('#hud')).toBeVisible();
  await expect(page.locator('#room-code')).toHaveText(/^[A-Z]{4}$/);
  const room = await page.locator('#room-code').innerText();
  const otherContext = await browser.newContext({ viewport: { width: 1000, height: 700 } });
  try {
    const other = await otherContext.newPage();
    other.on('pageerror', (error) => errors.push(error.message));
    await other.goto(`/?room=${room}`);
    await expect(other.getByLabel('Codice stanza')).toHaveValue(room);
    await other.getByLabel('IL TUO NOMINATIVO').fill('Bruno');
    await other.getByRole('button', { name: 'Unisciti' }).click();
    await expect(other.locator('#crew')).toContainText('Ada');
    await expect(page.locator('#crew')).toContainText('Bruno');
    await expect(page.locator('#crew')).toContainText('2/4');

    // Both starter materials are reachable from the landing point.
    await page.bringToFront();
    await expect(page.locator('#interaction')).toBeVisible();
    const firstNode = await page.locator('#node-name').innerText();
    await page.keyboard.press('e');
    await expect(page.locator('#node-name')).not.toHaveText(firstNode);
    await page.waitForTimeout(550); // Server multi-tool cooldown.
    await page.keyboard.press('e');
    await page.keyboard.press('Tab');
    await expect(page.locator('#inventory')).toBeVisible();
    await expect(page.locator('#inventory-items')).toContainText('Cristalli');
    await expect(page.locator('#inventory-items')).toContainText('Rottami');
    await expect(page.getByRole('button', { name: 'Crea cella' })).toBeEnabled();
    await page.waitForTimeout(550);
    await page.getByRole('button', { name: 'Crea cella' }).click();
    await expect(page.locator('#cell-count')).toHaveText('1 CELLE');
    await expect(page.locator('#recipe-cost')).toHaveText('0/2 Cristalli + 1/1 Rottame');
    await page.waitForTimeout(550);
    await page.locator('[data-consume=oxycell]').click();
    await page.keyboard.press('Tab');
    await expect(page.locator('#cell-count')).toHaveText('0 CELLE');
    await expect(page.locator('#o2-value')).toHaveText('100');

    const before = Number((await page.locator('#distance').innerText()).replace(/\D/g, ''));
    await page.keyboard.down('w');
    try {
      await expect
        .poll(async () => Number((await page.locator('#distance').innerText()).replace(/\D/g, '')))
        .toBeLessThan(before - 3);
    } finally {
      await page.keyboard.up('w');
    }
    await expect(other.locator('#crew')).toContainText('Ada');

    // A reload keeps the tab token and returns the same astronaut and inventory.
    await page.reload();
    await page.getByRole('button', { name: 'Unisciti' }).click();
    await expect(page.locator('#hud')).toBeVisible();
    await expect(page.locator('#crew')).toContainText('2/4');
    await page.keyboard.press('Tab');
    await expect(page.locator('#recipe-cost')).toHaveText('0/2 Cristalli + 1/1 Rottame');
    expect(errors).toEqual([]);
  } finally {
    await otherContext.close();
  }
});

test('an unknown room gives a useful error and leaves the menu usable', async ({ page }) => {
  await page.goto('/?room=IIII');
  await page.getByRole('button', { name: 'Unisciti' }).click();
  await expect(page.locator('#lobby-error')).toContainText('Stanza non trovata');
  await expect(page.getByRole('button', { name: 'Nuova spedizione' })).toBeEnabled();
  await expect(page.locator('#hud')).toBeHidden();
});
