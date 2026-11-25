// Brauzerdagi tekshiruvlar: node scripts/e2e.mjs [URL]
// Oldin: npm run build && npm run preview. Kompyuterda Google Chrome o‘rnatilgan bo‘lishi kerak.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://localhost:4173/';
const SHOTS = process.env.SHOTS ?? '/tmp/kadr-shots';
await mkdir(SHOTS, { recursive: true });

const results = [];
const check = (name, ok, extra = '') => {
  results.push({ name, ok });
  console.log(`${ok ? '✓' : '✗'} ${name}${extra ? ` — ${extra}` : ''}`);
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctxOpts = { locale: 'uz-UZ', timezoneId: 'Asia/Tashkent', hasTouch: true };
const errors = [];

async function newPage(width, height, extra = {}) {
  const ctx = await browser.newContext({ ...ctxOpts, viewport: { width, height }, ...extra });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return { ctx, page };
}

const noHScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
const columns = (page) =>
  page.evaluate(() => getComputedStyle(document.querySelector('.grid')).gridTemplateColumns.split(' ').length);
const norm = (s) => s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

// ---------- 1. Katalog: kengliklar ----------
for (const [w, h, cols] of [
  [360, 740, 1],
  [768, 1024, 2],
  [1440, 900, 3],
]) {
  const { ctx, page } = await newPage(w, h);
  await page.goto(BASE);
  await page.waitForSelector('.card');
  await page.waitForFunction(() => [...document.querySelectorAll('.card img')].slice(0, 2).every((i) => i.complete));
  check(`${w}px: gorizontal skroll yo‘q (katalog)`, await noHScroll(page));
  check(`${w}px: ${cols} ustun`, (await columns(page)) === cols, `topildi ${await columns(page)}`);
  const firstImgTop = await page.locator('.card').first().evaluate((el) => el.getBoundingClientRect().top);
  check(`${w}px: birinchi studiya birinchi ekranda`, firstImgTop < h * 0.6, `karta yuqorisi ${Math.round(firstImgTop)}px`);
  await page.screenshot({ path: `${SHOTS}/catalog-${w}.png`, fullPage: false });

  await page.goto(`${BASE}#/studiya/yorug-loft`);
  await page.waitForSelector('.booking');
  check(`${w}px: gorizontal skroll yo‘q (studiya)`, await noHScroll(page));
  if (w === 360) {
    const ctaVisible = await page.locator('.studio__cta').isVisible();
    const ctaTop = await page.locator('.studio__cta').evaluate((el) => el.getBoundingClientRect().top);
    check('360px: “Vaqt tanlash” tugmasi ko‘rinadi', ctaVisible, `yuqorisi ${Math.round(ctaTop)}px`);
    check('360px: pastki yopishqoq panel bor', await page.locator('.sticky-cta').isVisible());
  }
  if (w === 1440) {
    const [g, a] = await Promise.all([
      page.locator('.gallery').evaluate((el) => el.getBoundingClientRect().left),
      page.locator('.studio__aside').evaluate((el) => el.getBoundingClientRect().left),
    ]);
    check('1440px: galereya chapda, bron paneli o‘ngda', g < a, `galereya ${Math.round(g)}, panel ${Math.round(a)}`);
  }
  await page.screenshot({ path: `${SHOTS}/studio-${w}.png`, fullPage: true });
  await ctx.close();
}

// ---------- 2. Filtrlar ----------
{
  const { ctx, page } = await newPage(360, 740);
  await page.goto(BASE);
  await page.waitForSelector('.card');
  await page.locator('.chip', { hasText: 'Videostudiya' }).click();
  check('Filtr “Videostudiya” → 2 ta', (await page.locator('.card').count()) === 2);
  await page.selectOption('select', 'Chilonzor');
  check('Videostudiya + Chilonzor → 1 ta', (await page.locator('.card').count()) === 1);
  await page.selectOption('select', 'Mirobod');
  const emptyText = await page.locator('.empty').innerText().catch(() => '');
  check('Natija yo‘q → xabar va tozalash tugmasi', emptyText.includes('Filtrlarni tozalash'));
  await page.screenshot({ path: `${SHOTS}/catalog-empty-360.png` });
  await page.getByRole('button', { name: 'Filtrlarni tozalash' }).click();
  check('Filtrlarni tozalash → 6 ta', (await page.locator('.card').count()) === 6);
  await page.locator('.chip', { hasText: 'Podkast' }).click();
  check('Filtr “Podkast” → 2 ta', (await page.locator('.card').count()) === 2);
  // Klaviatura: radio guruhida o‘q tugmasi bilan almashish
  await page.locator('input[name="studio-type"]:checked').focus();
  await page.keyboard.press('ArrowLeft');
  const checked = await page.locator('input[name="studio-type"]:checked').getAttribute('value');
  check('Klaviatura: o‘q tugmasi bilan filtr almashadi', checked === 'video', checked);
  await page.locator('.card__link').first().click();
  await page.waitForSelector('.booking');
  check('Kartadan studiya sahifasi ochiladi', page.url().includes('#/studiya/'));
  await ctx.close();
}

// ---------- 3. Galereya ----------
{
  const { ctx, page } = await newPage(1440, 900);
  await page.goto(`${BASE}#/studiya/yorug-loft`);
  const before = await page.locator('.gallery__main img').getAttribute('src');
  await page.locator('.gallery__thumb').nth(2).click();
  const after = await page.locator('.gallery__main img').getAttribute('src');
  check('Kichik surat bosilganda asosiy surat almashadi', before !== after, `${before} → ${after}`);
  await ctx.close();
}

async function pickTomorrow(page, hour, duration) {
  await page.locator('.date-chip', { hasText: 'Ertaga' }).click();
  await page.locator('.slot', { hasText: `${hour}:00` }).click();
  await page.locator('.segmented__item', { hasText: `${duration} soat` }).click();
}

// ---------- 4. 1-holat: qabul + saqlanish ----------
{
  const { ctx, page } = await newPage(360, 740);
  await page.goto(`${BASE}#/studiya/yorug-loft`);
  await page.waitForSelector('.slot');
  await page.locator('.date-chip', { hasText: 'Ertaga' }).click();
  const s14 = norm(await page.locator('.slot', { hasText: '14:00' }).innerText());
  const s15 = norm(await page.locator('.slot', { hasText: '15:00' }).innerText());
  check('Ertaga 14:00 bo‘sh ko‘rinadi', s14.includes('Bo‘sh'), s14);
  check('Ertaga 15:00 band ko‘rinadi (matn + belgi)', s15.includes('Band') && s15.includes('✕'), s15);
  check('Band soatni tanlab bo‘lmaydi', await page.locator('.slot', { hasText: '15:00' }).locator('input').isDisabled());
  await pickTomorrow(page, 14, 1);
  const sum = norm(await page.locator('.summary__main').innerText());
  check('Xulosa: 14:00–15:00 · 180 000 so‘m', sum === '14:00–15:00 · 180 000 so‘m', sum);
  await page.screenshot({ path: `${SHOTS}/case1-before-360.png`, fullPage: true });
  await page.getByRole('button', { name: 'Bron qilish' }).click();
  await page.waitForSelector('.confirm');
  const conf = norm(await page.locator('.confirm').innerText());
  check(
    '1-holat: “Bron tasdiqlandi” + studiya, sana, vaqt, narx',
    conf.includes('Bron tasdiqlandi') && conf.includes('Yorug‘ Loft') && conf.includes('Ertaga') && conf.includes('14:00–15:00') && conf.includes('180 000 so‘m'),
    conf.slice(0, 120),
  );
  await page.screenshot({ path: `${SHOTS}/case1-confirm-360.png`, fullPage: true });
  await page.getByRole('link', { name: 'Bronlarimga o‘tish' }).click();
  await page.waitForSelector('.booking-item');
  check('Bronlarim ro‘yxatida bron bor', (await page.locator('.booking-item').count()) === 1);
  await page.reload();
  await page.waitForSelector('.booking-item');
  const item = norm(await page.locator('.booking-item').first().innerText());
  check('Sahifa yangilangandan keyin bron saqlangan (localStorage)', item.includes('14:00–15:00'), item);
  check('Sarlavhada bronlar soni', norm(await page.locator('.badge').innerText()) === '1');
  await page.screenshot({ path: `${SHOTS}/bookings-360.png`, fullPage: true });

  // Bir xil vaqtni qayta bron qilib bo‘lmaydi: 14:00 endi band
  await page.goto(`${BASE}#/studiya/yorug-loft`);
  await page.locator('.date-chip', { hasText: 'Ertaga' }).click();
  const s14b = norm(await page.locator('.slot', { hasText: '14:00' }).innerText());
  check('Tasdiqlangan 14:00 endi “Band”', s14b.includes('Band'), s14b);
  // Boshqa studiya shu vaqtda ham bo‘sh
  await page.goto(`${BASE}#/studiya/sado-podkast`);
  await page.locator('.date-chip', { hasText: 'Ertaga' }).click();
  const other = norm(await page.locator('.slot', { hasText: '14:00' }).innerText());
  check('Boshqa studiyada ertaga 14:00 bo‘sh', other.includes('Bo‘sh'), other);

  // Demo holatini tiklash
  await page.goto(`${BASE}#/bronlarim`);
  await page.getByRole('button', { name: 'Demo holatini tiklash' }).click();
  await page.waitForSelector('.empty');
  check('Demo holatini tiklash bronlarni tozalaydi', (await page.locator('.booking-item').count()) === 0);
  await ctx.close();
}

// ---------- 5. 2-holat: rad etish + taklif ----------
{
  const { ctx, page } = await newPage(360, 740);
  await page.goto(`${BASE}#/studiya/yorug-loft`);
  await page.waitForSelector('.slot');
  await pickTomorrow(page, 14, 2);
  const sum = norm(await page.locator('.summary__main').innerText());
  check('Xulosa: 14:00–16:00 · 360 000 so‘m', sum === '14:00–16:00 · 360 000 so‘m', sum);
  await page.getByRole('button', { name: 'Bron qilish' }).click();
  await page.waitForSelector('.result--conflict');
  const alert = norm(await page.locator('.result--conflict').innerText());
  check('2-holat: rad etildi va band oraliq 15:00–16:00 aytildi', alert.includes('rad etildi') && alert.includes('15:00–16:00'), alert.slice(0, 160));
  check('2-holat: eng yaqin bo‘sh vaqt 13:00–15:00 taklif qilindi', alert.includes('13:00–15:00') && alert.includes('Eng yaqin'));
  check('Natija sahifasiga o‘tilmadi', !page.url().includes('#/bron/'));
  await page.screenshot({ path: `${SHOTS}/case2-conflict-360.png`, fullPage: true });
  await page.locator('.suggestion').first().click();
  const sum2 = norm(await page.locator('.summary__main').innerText());
  const dateChecked = norm(await page.locator('.date-chip:has(input:checked)').innerText());
  const durChecked = norm(await page.locator('.segmented__item:has(input:checked)').innerText());
  check('Taklif bosilganda vaqt 13:00–15:00 bo‘ldi', sum2 === '13:00–15:00 · 360 000 so‘m', sum2);
  check('Sana (Ertaga) va davomiylik (2 soat) saqlandi', dateChecked.startsWith('Ertaga') && durChecked === '2 soat', `${dateChecked} / ${durChecked}`);
  check('Studiya saqlandi', page.url().includes('#/studiya/yorug-loft'));
  check('Fokus “Bron qilish” tugmasida', await page.evaluate(() => document.activeElement?.textContent === 'Bron qilish'));
  await page.keyboard.press('Enter');
  await page.waitForSelector('.confirm');
  const conf = norm(await page.locator('.confirm').innerText());
  check('Taklif qilingan vaqt klaviatura bilan tasdiqlandi', conf.includes('13:00–15:00'), conf.slice(0, 100));
  await ctx.close();
}

// ---------- 6. Qo‘shimcha qoidalar ----------
{
  const { ctx, page } = await newPage(1440, 900);
  await page.goto(`${BASE}#/studiya/yorug-loft`);
  await page.waitForSelector('.slot');
  // 16:00–17:00: band 15–16 bilan kesishmaydi
  await pickTomorrow(page, 16, 1);
  await page.getByRole('button', { name: 'Bron qilish' }).click();
  await page.waitForSelector('.confirm');
  check('Ertaga 16:00–17:00 tasdiqlanadi (15–16 bilan kesishmaydi)', true);
  // Yopilish vaqtidan oshish (21:00): indinga 20:00 dan 3 soat
  await page.goto(`${BASE}#/studiya/yorug-loft`);
  await page.locator('.date-chip').nth(2).click();
  await page.locator('.slot', { hasText: '20:00' }).click();
  await page.locator('.segmented__item', { hasText: '3 soat' }).click();
  const warn = norm(await page.locator('.summary .inline-warning').innerText());
  const disabled = await page.getByRole('button', { name: 'Bron qilish' }).isDisabled();
  check('Yopilish vaqtidan oshadigan bron bloklanadi', disabled && warn.includes('21:00'), warn);
  await page.screenshot({ path: `${SHOTS}/after-close-1440.png` });
  // O‘tgan vaqt: bugungi o‘tgan soatlar tanlanmaydi
  await page.goto(`${BASE}#/studiya/neon-box`);
  await page.locator('.date-chip', { hasText: 'Bugun' }).click();
  const nowH = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Asia/Tashkent' }).format(new Date()));
  if (nowH > 12) {
    const p = page.locator('.slot', { hasText: '12:00' });
    check('Bugungi o‘tgan soat “O‘tgan” va tanlanmaydi', (await p.innerText()).includes('O‘tgan') && (await p.locator('input').isDisabled()));
  }
  // Boshqa vkladka uchun reload: bronlar soni 1
  await page.goto(`${BASE}#/bronlarim`);
  await page.waitForSelector('.booking-item');
  check('Bronlarim: 1 ta bron (16:00–17:00)', (await page.locator('.booking-item').count()) === 1);
  await page.screenshot({ path: `${SHOTS}/bookings-1440.png`, fullPage: true });
  await ctx.close();
}

// ---------- 7. Rasmsiz (sekin internet) ----------
{
  const { ctx, page } = await newPage(360, 740);
  await page.route('**/*.webp', () => {}); // rasmlar hech qachon kelmaydi
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.card');
  const price = norm(await page.locator('.card .price').first().innerText());
  check('Rasmlarsiz: narx ko‘rinadi', price === '180 000 so‘m / soat', price);
  const h = await page.locator('.card .media').first().evaluate((el) => el.getBoundingClientRect().height);
  check('Rasm joyi oldindan ajratilgan (4:3)', Math.abs(h - 328 * 0.75) < 3, `${h}px`);
  await page.locator('.chip', { hasText: 'Fotostudiya' }).click();
  check('Rasmlarsiz: filtr ishlaydi', (await page.locator('.card').count()) === 2);
  await page.goto(`${BASE}#/studiya/yorug-loft`, { waitUntil: 'domcontentloaded' });
  await pickTomorrow(page, 12, 1);
  check('Rasmlarsiz: bron formasi ishlaydi', norm(await page.locator('.summary__main').innerText()).startsWith('12:00–13:00'));
  await page.screenshot({ path: `${SHOTS}/no-images-360.png` });
  await ctx.close();
}

// ---------- 8. Lazy loading va reduced motion ----------
{
  const { ctx, page } = await newPage(360, 740, { reducedMotion: 'reduce' });
  const loaded = new Set();
  page.on('request', (r) => r.url().endsWith('.webp') && loaded.add(r.url().split('/').pop()));
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  const eager = await page.locator('.card img').evaluateAll((imgs) => imgs.map((i) => i.loading));
  check('Birinchi 2 ta surat darhol, qolganlari lazy', eager.slice(0, 2).every((l) => l === 'eager') && eager.slice(2).every((l) => l === 'lazy'), eager.join(','));
  // Chrome lazy suratlarni ekrandan ~1250 px oldin yuklay boshlaydi — eng pastdagi (6-) surat esa kutadi.
  check('Eng pastdagi surat skrollgacha yuklanmadi', !loaded.has('suhbat-xonasi-1-480.webp'), [...loaded].join(', '));
  await page.locator('.card').last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  check('Skroll qilinganda pastdagi surat yuklandi', loaded.has('suhbat-xonasi-1-480.webp'));
  check('Telefonda 480/800 px o‘lchamli suratlar tanlanadi', [...loaded].every((f) => !f.endsWith('-1200.webp')), [...loaded].join(', '));
  const td = await page.locator('.chip span').first().evaluate((el) => getComputedStyle(el).transitionDuration);
  check('prefers-reduced-motion: o‘tishlar o‘chadi', parseFloat(td) < 0.001, td);
  await ctx.close();
}

await browser.close();
check('Konsolda xato yo‘q', errors.length === 0, errors.slice(0, 3).join(' | '));
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} tekshiruv o‘tdi`);
process.exit(failed.length ? 1 : 0);
