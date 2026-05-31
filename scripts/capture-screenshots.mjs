import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screensDir = path.join(__dirname, '..', 'screens');

async function capture() {
  await mkdir(screensDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForSelector('table tbody tr');

  await page.screenshot({
    path: path.join(screensDir, '01-vue-principale.png'),
    fullPage: true,
  });

  await page.getByRole('button', { name: 'Modifier' }).first().click();
  await page.waitForSelector('h2:text("Modifier un utilisateur")');

  await page.screenshot({
    path: path.join(screensDir, '02-mode-modification.png'),
    fullPage: true,
  });

  await page.getByRole('button', { name: 'Annuler' }).click();
  await page.waitForSelector('h2:text("Ajouter un utilisateur")');

  await page.getByLabel('Nom').fill('Nouveau User');
  await page.getByLabel('Email').fill('nouveau@mail.com');

  await page.screenshot({
    path: path.join(screensDir, '03-formulaire-creation.png'),
    fullPage: true,
  });

  const apiPage = await browser.newPage({ viewport: { width: 1280, height: 600 } });
  await apiPage.goto('http://localhost:4000/api/users', { waitUntil: 'networkidle' });

  await apiPage.screenshot({
    path: path.join(screensDir, '04-api-json.png'),
    fullPage: true,
  });

  await browser.close();
  console.log('Captures enregistrées dans screens/');
}

capture().catch((error) => {
  console.error(error);
  process.exit(1);
});
