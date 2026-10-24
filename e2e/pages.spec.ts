import { expect, test } from '@playwright/test';

test('the production game runs entirely as static files under the Pages repository path', async ({
  page,
}) => {
  const errors: string[] = [];
  const sockets: string[] = [];
  const externalRequests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('websocket', (socket) => sockets.push(socket.url()));
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:5176/')) externalRequests.push(request.url());
  });
  await page.goto('http://127.0.0.1:5176/explore/');
  await expect(page.locator('#world canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Esplora in solitaria' }).click();
  await expect(page.locator('#hud')).toBeVisible();
  await expect(page.locator('#connection-label')).toHaveText('MODALITÀ LOCALE');
  await expect(page.locator('#share')).toBeHidden();
  await expect(page.locator('#crew')).toContainText('1/1');
  await expect(page.locator('#interaction')).toBeVisible();
  const firstNode = await page.locator('#node-name').innerText();
  await page.keyboard.press('e');
  await expect(page.locator('#node-name')).not.toHaveText(firstNode);
  await page.waitForTimeout(400);
  await page.keyboard.press('e');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Crea cella' })).toBeEnabled();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Crea cella' }).click();
  await expect(page.locator('#cell-count')).toHaveText('1 CELLE');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(400);
  await page.keyboard.press('2');
  await expect(page.locator('#cell-count')).toHaveText('0 CELLE');
  await expect(page.locator('#o2-value')).toHaveText('100');
  await page.getByRole('button', { name: 'Esci', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Esplora in solitaria' })).toBeEnabled();
  expect(sockets).toEqual([]);
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});
