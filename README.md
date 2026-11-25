# Kadr — foto va video studiyalarni bron qilish (frontend demo)

Suratga olish, video yozish yoki podkast uchun Toshkentdagi studiyalarni soatbay bron qilish sayti.
Bu bosqichda faqat frontend: demo ma’lumotlar, bronlar brauzerning `localStorage`’ida saqlanadi.
Backend, login, to‘lov va admin panel keyingi bosqichda.

**Texnologiyalar:** React 19 + TypeScript + Vite, oddiy CSS. Qo‘shimcha UI yoki animatsiya kutubxonasi yo‘q.

## Ishga tushirish

Node.js 20+ kerak.

```bash
npm install
npm run dev        # ishlab chiqish rejimi → http://localhost:5173
```

Production build:

```bash
npm run build      # dist/ papkasiga
npm run preview    # build’ni ko‘rish → http://localhost:4173
```

`dist/` papkasi istalgan statik hostingga (yoki oddiy papkaga) qo‘yilsa ishlaydi: yo‘llar nisbiy, marshrutlash hash orqali (`#/studiya/...`).

### Tekshiruvlar

```bash
npm test           # bron qoidasining birlik testlari (Vitest)
npm run e2e        # brauzerdagi tekshiruvlar; avval `npm run build && npm run preview`, Google Chrome kerak
```

## Bron holatlarini sinash (universitet namoyishi uchun)

Demo uchun **“Yorug‘ Loft”** studiyasida **ertangi kunga 15:00–16:00 oldindan band qilingan**
(sana har doim bugungi kunga nisbatan hisoblanadi). 14:00 bo‘sh ko‘rinadi.

Ikkala holat bir-biriga ta’sir qilmasligi uchun har biridan oldin boshlang‘ich holatga qayting:
**Bronlarim → “Demo holatini tiklash”** (yoki brauzerning maxfiy oynasini oching).

### 1-holat — bron tasdiqlanadi

1. Bosh sahifada **Yorug‘ Loft** kartasini bosing.
2. Telefonda **“Vaqt tanlash”** tugmasini bosing (kompyuterda panel o‘ngda turadi).
3. Sana: **Ertaga**. Vaqtlar ichida **14:00 — “Bo‘sh”**, **15:00 — “✕ Band”** ekanini ko‘ring.
4. **14:00** ni, davomiylik **1 soat** ni tanlang. Xulosa: `14:00–15:00 · 180 000 so‘m`.
5. **“Bron qilish”** → **“Bron tasdiqlandi”** ekrani: studiya, sana, vaqt, jami narx.
6. **“Bronlarimga o‘tish”** → bron ro‘yxatda. Sahifani yangilang (F5) — bron joyida qoladi.

### 2-holat — bron rad etiladi va bo‘sh vaqt taklif qilinadi

1. **Bronlarim → “Demo holatini tiklash”** ni bosing (1-holatdan keyin 14:00 band bo‘lib qolgan).
2. **Yorug‘ Loft** → sana **Ertaga** → **14:00** → davomiylik **2 soat**. Xulosa: `14:00–16:00 · 360 000 so‘m`.
3. **“Bron qilish”** → qizil xabar: *“Bron rad etildi: bu vaqt band. Siz tanlagan 14:00–16:00 vaqti band oraliq bilan kesishadi: 15:00–16:00 allaqachon bron qilingan.”*
4. Pastda 2 soatlik eng yaqin bo‘sh vaqtlar: **13:00–15:00 (Eng yaqin)** va **16:00–18:00**.
5. **13:00–15:00** ni bosing → studiya, sana (Ertaga) va davomiylik (2 soat) saqlanadi, faqat boshlanish vaqti o‘zgaradi.
6. **“Bron qilish”** → bron tasdiqlanadi.

### Qo‘shimcha holatlar

- **Kesishmaydigan vaqt:** ertaga 16:00 dan 1 soat → tasdiqlanadi (15:00–16:00 bilan faqat chegarada tutashadi).
- **Boshqa studiya:** “Oq Siklorama”da ertaga 14:00–16:00 band, lekin bu “Yorug‘ Loft”ga xalaqit bermaydi.
- **Yopilish vaqti:** Yorug‘ Loft 21:00 da yopiladi. Indinga 20:00 dan 3 soat tanlansa, ogohlantirish chiqadi va tugma bloklanadi.
- **O‘tgan vaqt:** bugungi o‘tib ketgan soatlar “O‘tgan” deb belgilanadi va tanlanmaydi.

## Bron qoidasi

`src/booking/rules.ts` — UI’ga bog‘liq bo‘lmagan sof funksiyalar:

- oraliqlar yarim ochiq `[boshlanish, tugash)`: `14:00–16:00` va `16:00–17:00` kesishmaydi;
- bir studiyada bir sanada oraliqlar kesishsa — rad etiladi (`status: 'conflict'`), boshqa studiyalar hisobga olinmaydi;
- o‘tgan vaqt, ochilishdan oldin, yopilishdan keyin tugaydigan bron va 1/2/3 soatdan boshqa davomiylik qabul qilinmaydi;
- rad etilganda shu kunning o‘zida, shu davomiylikdagi eng yaqin bo‘sh vaqt va qarama-qarshi tomondagi eng yaqin variant taklif qilinadi.

## Tuzilma

```
src/
  data/
    studios.ts              studiya ma’lumotlari (demo)
    demoBookings.ts         boshqa mijozlarning namunaviy bronlari
    images.generated.ts     surat manifesti (rang, xira oldindan ko‘rinish)
  booking/
    rules.ts                bron qoidasi (sof funksiyalar) + rules.test.ts
    messages.ts             qoida kodlari → o‘zbekcha xabarlar
    repository.ts           saqlash qatlami: BookingRepository interfeysi + localStorage
  components/               Header, StudioCard, Filters, Gallery, StudioImage, booking/*
  pages/                    Katalog, Studiya, Tasdiq, Bronlarim
  lib/                      sana/narx formatlash, hash-router
  hooks/                    bronlar va joriy vaqt
scripts/
  scene-kit.mjs, scenes.mjs studiya interyer suratlarini chizish (SVG)
  generate-images.mjs       SVG → WebP 480/800/1200 px (`npm run images`)
  e2e.mjs                   brauzerdagi tekshiruvlar
public/studios/             tayyor WebP suratlar
```

### Backend ulash

UI faqat `bookingRepository` (`src/booking/repository.ts`) bilan ishlaydi. Backend tayyor bo‘lganda
`BookingRepository` interfeysini amalga oshiruvchi `HttpBookingRepository` yozish kifoya, masalan:

| Metod        | So‘rov                                        |
| ------------ | --------------------------------------------- |
| `getBusy`    | `GET /api/studios/:id/bookings?date=YYYY-MM-DD` |
| `listMine`   | `GET /api/me/bookings`                        |
| `create`     | `POST /api/bookings` → `BookingDecision`      |
| `cancel`     | `DELETE /api/bookings/:id`                    |

Server ham xuddi shu qoidani tekshirishi kerak (kesishish → `409` va takliflar). Studiyalar ro‘yxati
`src/data/studios.ts`dan API’ga ko‘chiriladi.

## Suratlar

Studiya suratlari loyiha ichida: `scripts/scenes.mjs` interyerlarni SVG ko‘rinishida chizadi, `sharp`
ularni 480, 800 va 1200 px kenglikdagi WebP’ga aylantiradi (18 ta surat, jami ~600 KB).
Brauzer ekran kengligiga mos o‘lchamni `srcset` orqali tanlaydi. Har bir surat uchun 4:3 joy oldindan
ajratiladi, surat kelguncha asosiy rang va 16 px xira nusxa ko‘rinadi. Birinchi ikkita karta va studiya
sahifasidagi asosiy surat darhol, qolganlari `loading="lazy"` bilan yuklanadi.
Haqiqiy fotosuratlar tayyor bo‘lsa, ularni xuddi shu nomlar bilan `public/studios/` ga qo‘yish kifoya.

## Moslashuvchanlik va qulaylik

- 360 px telefonda gorizontal skroll yo‘q; katalog: telefonda 1, planshetda (≥700 px) 2, keng ekranda (≥1100 px) 3 ustun.
- Studiya sahifasi: ≥1024 px da galereya chapda, bron paneli o‘ngda (yopishqoq). Telefonda pastda “Vaqt tanlash” paneli.
- Barcha tanlovlar haqiqiy radio/select/tugmalar: sensorli ekran va klaviatura (Tab, o‘q tugmalari, Enter/Space) bilan ishlaydi.
- Vaqt holatlari rangdan tashqari matn va belgi bilan farqlanadi: “Bo‘sh”, “✓ Tanlandi”, “✕ Band”, “O‘tgan”.
- Harakat faqat qisqa CSS o‘tishlari; `prefers-reduced-motion` yoqilsa o‘chadi.
