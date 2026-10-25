import { expect, test } from '@playwright/test';
import { ExpeditionSimulation, createSimulationActor } from '../packages/shared/src/simulation';
import { heightAt, valleyCenter } from '../packages/shared/src/world';
import { STORM, TICK_DT, WORLD } from '../packages/shared/src/constants';

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
  await page.waitForTimeout(550);
  await page.keyboard.press('e');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Crea cella' })).toBeEnabled();
  await page.waitForTimeout(550);
  await page.getByRole('button', { name: 'Crea cella' }).click();
  await expect(page.locator('#cell-count')).toHaveText('1 CELLE');
  await page.waitForTimeout(550);
  await page.locator('[data-consume=oxycell]').click();
  await page.keyboard.press('Tab');
  await expect(page.locator('#cell-count')).toHaveText('0 CELLE');
  await expect(page.locator('#o2-value')).toHaveText('100');
  await page.getByRole('button', { name: 'Esci', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Esplora in solitaria' })).toBeEnabled();
  expect(sockets).toEqual([]);
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('local research unlocks a starting loadout, builds a camp and resumes the saved world', async ({
  page,
}) => {
  // A profile fixture supplies earned research; all purchases and construction
  // still go through the real interface and shared gameplay rules.
  await page.addInitScript(() => {
    if (!localStorage.getItem('qa-profile-seeded')) {
      localStorage.setItem(
        'segnale-profile-v1',
        JSON.stringify({
          profile: { research: 50, unlocks: [], runs: 1, wins: 0 },
          settled: [],
        }),
      );
      localStorage.setItem('qa-profile-seeded', '1');
    }
  });
  await page.goto('http://127.0.0.1:5176/explore/');
  await page.locator('#open-lab').click();
  await expect(page.locator('#lab-balance')).toHaveText('50');
  await page.locator('[data-unlock=supplies]').click();
  await expect(page.locator('#lab-balance')).toHaveText('25');
  await expect(page.locator('[data-unlock=supplies]')).toBeDisabled();
  await expect(page.locator('[data-unlock=engineer]')).toBeDisabled();
  await page.locator('#close-lab').click();
  await page.getByRole('button', { name: 'Esplora in solitaria' }).click();
  await expect(page.locator('#hud')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('#inventory-items')).toContainText('Rottami');
  await expect(page.locator('#inventory-items')).toContainText('Fibra');
  await expect(page.locator('[data-craft=blaster]')).toBeDisabled();
  await expect(page.locator('#station-status')).toContainText('Nessuna stazione');
  await page.keyboard.press('Tab');
  // At most two starter interactions obtain the crystals needed for the beacon.
  for (let i = 0; i < 2; i++) {
    await expect(page.locator('#interaction')).toBeVisible();
    const first = await page.locator('#node-name').innerText();
    await page.keyboard.press('e');
    await expect
      .poll(
        async () =>
          !(await page.locator('#interaction').isVisible()) ||
          (await page.locator('#node-name').innerText()) !== first,
      )
      .toBe(true);
    await page.waitForTimeout(550);
  }
  await page.keyboard.press('b');
  await expect(page.locator('#build-menu')).toBeVisible();
  await page.locator('[data-build=beacon]').click();
  await expect(page.locator('#placement-valid')).toContainText('Posizione valida');
  await page.locator('#world canvas').click({ position: { x: 550, y: 320 } });
  await expect(page.locator('#structure-count')).toContainText('1 STRUTTURE');
  // Select an affordable workbench, then clear the occupied beacon position.
  await page.keyboard.press('b');
  await page.locator('[data-build=workbench]').click();
  await expect(page.locator('#placement-valid')).toContainText('Troppo vicino');
  await page.keyboard.down('a');
  try {
    await expect(page.locator('#placement-valid')).toContainText('Posizione valida');
  } finally {
    await page.keyboard.up('a');
  }
  await page.locator('#world canvas').click({ position: { x: 550, y: 320 } });
  await expect(page.locator('#structure-count')).toContainText('2 STRUTTURE');
  await page.keyboard.press('Tab');
  await expect(page.locator('#station-status')).toContainText('Banco collegato');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');
  await expect(page.locator('#pause-menu')).toBeVisible();
  const oxygen = await page.locator('#o2-value').innerText();
  await page.waitForTimeout(1100);
  await expect(page.locator('#o2-value')).toHaveText(oxygen);
  await page.locator('#resume').click();
  await expect(page.locator('#pause-menu')).toBeHidden();
  await page.keyboard.press('Escape');
  await page.locator('#pause-leave').click();
  await expect(page.locator('#continue-resume')).toBeVisible();
  await page.reload();
  await page.locator('#continue-resume').click();
  await expect(page.locator('#hud')).toBeVisible();
  await expect(page.locator('#structure-count')).toContainText('2 STRUTTURE');
  await page.keyboard.press('Tab');
  await expect(page.locator('#station-status')).toContainText('Banco collegato');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('segnale-profile-v1')!).profile);
  expect(stored.research).toBe(25);
  expect(stored.unlocks).toContain('supplies');
});

test('resuming the final extraction shows victory and settles research once', async ({ page }) => {
  // Resume a valid expedition near the end of its defense, rather than exposing
  // debug controls or making the browser test wait a full two minutes.
  const simulation = new ExpeditionSimulation(42);
  const actor = createSimulationActor('extraction-survivor', 'Ada', 42);
  actor.player.x = valleyCenter(42, WORLD.signalZ);
  actor.player.z = WORLD.signalZ;
  actor.player.y = heightAt(42, actor.player.x, actor.player.z);
  simulation.tickNumber = 6000;
  simulation.elapsed = simulation.tickNumber * TICK_DT;
  simulation.run = {
    phase: 'extracting',
    elapsed: simulation.elapsed,
    stormZ: STORM.startZ + (simulation.elapsed - STORM.grace) * STORM.speed,
    extraction: 119,
    research: 30,
    kills: 0,
    biomes: [0, 1, 2, 3],
  };
  const save = {
    version: 1,
    id: 'qa-final-extraction',
    data: simulation.serialize([actor]),
    savedAt: Date.now(),
  };
  await page.addInitScript((saved) => {
    if (localStorage.getItem('qa-final-extraction-seeded')) return;
    localStorage.setItem('segnale-expedition-v1', JSON.stringify(saved));
    localStorage.setItem('qa-final-extraction-seeded', '1');
  }, save);
  await page.goto('http://127.0.0.1:5176/explore/');
  await page.locator('#continue-resume').click();
  await expect(page.locator('#result')).toBeVisible();
  const settled = await page.evaluate(() => JSON.parse(localStorage.getItem('segnale-profile-v1')!).profile);
  expect(settled).toMatchObject({ research: 80, runs: 1, wins: 1 });
  expect(await page.evaluate(() => localStorage.getItem('segnale-expedition-v1'))).toBeNull();
  await page.reload();
  await expect(page.locator('#continue-resume')).toBeHidden();
  await page.locator('#open-lab').click();
  await expect(page.locator('#lab-balance')).toHaveText('80');
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('segnale-profile-v1')!).profile);
  expect(after).toEqual(settled);
});
