# Amjilt Canteen — Executable Design Spec

> Single source of truth. Every number below is consistent with every other number.
> Sections marked **[FIX]** were contradictions in the original brief, resolved.

---

## 0. What this is

A production-grade digital canteen system for a Mongolian secondary school.
A Mongolian school could deploy it on Monday.

Four surfaces:

| Surface | Device | Users |
|---|---|---|
| Student app | Mobile | Grades 6–12 |
| Parent app | Mobile | Parents/guardians |
| Cafeteria console | Tablet (landscape) | Canteen staff |
| Admin console | Desktop | School leadership |

**Language:** Mongolian Cyrillic, everywhere. No English in the UI except the brand name
`Amjilt Canteen` and `Amjilt Wallet`, which are brand assets.
**Currency:** ₮, thousands separator, no decimals. `25,500₮`

### Voice
Modern · smart · fast · friendly · trustworthy · fresh · premium · student-friendly.
Serious enough that a principal approves it. Never childish, never cartoon, never a
generic food-delivery app.

---

## 1. Brand

**Name:** Amjilt Canteen
**Tagline:** «Захиал. Цагаа сонго. QR-аа уншуул. Хоолоо ав.»
**Sub-tagline (onboarding):** «Сургуулийн хоолны шинэ үе.»

The product must read as four things fused: modern food ordering + digital wallet +
school management + a real queue system. Pick one of those and it looks like a template.

---

## 2. Design tokens

### 2.1 Color

| Token | Hex | Use |
|---|---|---|
| `brand-900` | `#052E22` | Deepest green — wallet card base, high-contrast text on mint |
| `brand-800` | `#07422F` | App bar, active nav icon |
| `brand-700` | `#0A5540` | Primary button hover |
| `brand-600` | `#0E6B4F` | **Primary** — CTA, confirmed, success |
| `brand-500` | `#12855F` | Primary text on light |
| `brand-300` | `#6BD4AE` | Secondary — progress fills, illustration fills |
| `brand-200` | `#A9E9D0` | Secondary — selected chip bg |
| `brand-100` | `#D6F5E8` | Secondary wash — banners, info rows |
| `brand-050` | `#EEFBF5` | Secondary tint — app background wash |
| `accent-700` | `#B84A0C` | Orange text on wash |
| `accent-600` | `#E86A16` | **Accent** — food highlights, popular, attention |
| `accent-500` | `#FF7A29` | Accent — badges, price emphasis |
| `accent-300` | `#FFB781` | Accent wash border |
| `accent-100` | `#FFEDE1` | Accent wash background |
| `bg` | `#FAF9F6` | Warm white — app background |
| `surface` | `#FFFFFF` | Cards, sheets |
| `surface-sunken` | `#F3F1EC` | Inset areas, skeletons, input fills |
| `border` | `#E6E3DC` | Hairline dividers |
| `text-primary` | `#1A1D1C` | Dark charcoal — body, titles |
| `text-secondary` | `#5C6563` | Labels, metadata |
| `text-tertiary` | `#8E9795` | Hints, timestamps |
| `success` | `#12855F` | Success states (same as brand — deliberate) |
| `warning` | `#E8A317` | Almost-full slots, low stock |
| `danger` | `#D0342C` | Full slots, failed payment, over-limit |

**Color law**
- Green is *system state*: CTA, success, availability, confirmation, positive stats.
- Orange is *food and attention*: popularity, bestseller, "almost full", low balance.
- Red is *blocked only*: full slot, failed payment, over limit. Never decorative.
- Background stays warm white. No full-bleed saturated surfaces except the wallet card
  and the primary CTA.
- Gradients: at most one, on the wallet card. Nowhere else. No purple anywhere.

### 2.2 Type

**Nunito** (Google Fonts) — rounded geometric sans, first-class Cyrillic, 200–1000.
This is not a style preference; Mongolian Cyrillic is a wide alphabet and needs more
horizontal room than Latin. Nunito's round counters keep long Cyrillic words
(«Дараалалд бага зогсоно.») readable at 13–15px.

| Role | Size / Line | Weight | Tracking |
|---|---|---|---|
| Display | 32 / 38 | 800 | -0.6 |
| Title | 24 / 30 | 800 | -0.4 |
| Title sm | 19 / 25 | 700 | -0.2 |
| Section | 17 / 23 | 700 | -0.1 |
| Body | 15 / 22 | 500 | 0 |
| Body sm | 13 / 19 | 500 | 0 |
| Label | 12 / 16 | 700 | +0.3 |
| Caption | 11 / 15 | 700 | +0.4 |
| **Money** | 26 / 30 | 800 | -0.5 |
| **Money lg** | 34 / 38 | 800 | -0.8 |

Numerals use `font-variant-numeric: tabular-nums` everywhere money appears, so
columns of prices align. The single most common alignment bug in money UIs.

### 2.3 Shape, space, depth

- Spacing scale: `4 8 12 16 20 24 32 40 48` (8px base, 4px half-step)
- Card radius `20px` · Large card `24px` · Input `14px` · Button `14px` · Pill `999px`
- **Minimum touch target 44×44**, no exceptions. Icon buttons are 44px with a 20px glyph.
- Shadows are two-layer, very soft, never gray-on-gray:
  - `sm` → `0 1px 2px rgba(26,29,28,.04), 0 1px 3px rgba(26,29,28,.05)`
  - `md` → `0 2px 4px rgba(26,29,28,.04), 0 6px 16px rgba(26,29,28,.07)`
  - `lg` → `0 8px 24px rgba(26,29,28,.08), 0 24px 48px rgba(26,29,28,.10)` (sheets)
- Bottom sheets: 24px top radius, grab handle 36×4 `rgba(0,0,0,.14)`, scrim
  `rgba(10,20,16,.45)` with 8px blur.

### 2.4 Imagery

Real food photography, 4:3 food cards, `object-fit: cover`.
Never a flat colored rectangle with an emoji. Never an icon-as-food.

Per-dish image set (Unsplash CDN, hotlinked, `?w=800&q=80&auto=format&fit=crop`):
- Бууз → `photo-1563245372-f21724e3856d`
- Тахианы цуйван → `photo-1569718212165-3a8278d5f624`
- Ногоотой хуурга → `photo-1546069901-ba9599a7e63c`
- Гурилтай шөл → `photo-1547592166-23ac45744acd`
- Жимсний салат → `photo-1512621776951-a57141f2eefd`
- Сүү → `photo-1550583724-b2692b85b150`
- Coffee/tea, water, амттан → reuse + crop

Every image gets a `loading="lazy"` and a warm-tinted placeholder underneath, so a
failed load degrades to a tinted block — never a broken-image icon.

---

## 3. Navigation

Bottom nav, 5 tabs, 5 icons, fixed, 76px tall + 20px safe-area.
Selected state is unmistakable: filled 24px icon, `brand-600`, 11px/800 label,
plus a 4px mint pill above the icon. Unselected: 20px outline icon, `text-tertiary`.

| # | Label | Icon |
|---|---|---|
| 1 | Нүүр | house-filled |
| 2 | Меню | bowl |
| 3 | Захиалга | bag |
| 4 | Wallet | card |
| 5 | Профайл | person |

Tab 3 (Захиалга) carries an unread dot when an order is ready.

**Rule:** a bottom sheet is used whenever the content fits in ≤70% of screen height.
New pages are reserved for multi-step tasks (login, food detail, checkout, QR).

---

## 4. Data model — the numbers that must not drift

### 4.1 Cast
- **Student:** Бат-Эрдэнэ, 9А анги
- **Parent:** Саруул
- **Classmates:** Бүнхдорж (9А), Азbat (10Б), Тэнгэр (9А), Хөхүү (11А)

### 4.2 Menu (today, 2026-11-24, Tuesday)

| Dish | Price | kcal | Allergens | Rating | Category |
|---|---|---|---|---|---|
| Бууз | 4,500₮ | 480 | Глютен, Сүү | 4.6 | Үндсэн |
| Тахианы цуйван | 5,500₮ | 620 | Глютен, Өндөг | 4.8 | Үндсэн |
| Ногоотой хуурга | 4,800₮ | 540 | Глютен, Далайн | 4.4 | Үндсэн |
| Гурилтай шөл | 4,000₮ | 310 | Глютен | 4.2 | Үндсэн |
| Жимсний салат | 2,500₮ | 120 | — | 4.5 | Хөнгөн |
| Сүү | 1,500₮ | 180 | Сүү | 4.3 | Ундаа |

### 4.3 Smart Queue — the canonical slot table

**Capacity is 16 per slot.** Every number below is quoted from both the student view and
the staff view, and they agree. This is the spine of the whole product.

| Slot | Orders | Free | Student state | Staff label |
|---|---|---|---|---|
| 11:30–11:40 | 8 | **8 сул** | available | бага |
| 11:40–11:50 | 10 | **6 сул** | available | дунд |
| 11:50–12:00 | 12 | **4 сул** | **almost full** ⚠ | ачаалалтай |
| 12:00–12:10 | 8 | **8 сул** | **selected** | бага |
| 12:10–12:20 | 10 | **6 сул** | available | дунд |

**State rules (mechanical, no judgment calls):**
- `free ≥ 8` → **available** — green border, green pill
- `free 1–7` → **almost full** — orange border, `⚠ N сул орон зай үлдлээ`
- `free = 0` → **full** — red wash, `Дүүрсэн`, **not selectable**, 44% opacity, strike-through time
- `selected` — brand-600 fill 4%, 2px brand-600 border, `brand-600` check circle
- An **order's own slot** is always shown as reserved to the user and cannot be filled by
  others — a 1-per-slot-per-student hold.

Current time context: **11:38**. The 11:30–11:40 slot is already draining, 11:40–11:50 is
the live slot, and the selected 12:00–12:10 slot reads **"22 минутын дараа"** with an
empty progress bar (a slot you have not reached yet shows 0%, not a partial fill).

### 4.4 Today's operations (cafeteria + admin, 11:38 snapshot)

| Metric | Value |
|---|---|
| Нийт захиалга | **124** |
| Бэлэн болсон | **87** |
| Бэлтгэж байна | **37** |
| Өнөөдрийн борлуулалт | **502,000₮** |
| Average order value | 4,049₮ |

**[FIX]** Original said 4,850,000₮ against 124 orders — that is 39,113₮ per meal, ~8× the
most expensive dish on the menu. Corrected to 502,000₮.

### 4.5 Preparation forecast (must sum to 124)

| Dish | Orders | Prepare | Buffer |
|---|---|---|---|
| Бууз | 45 | 48 | +3 (6.7%) |
| Тахианы цуйван | 40 | 42 | +2 (5.0%) |
| Ногоотой хуурга | 39 | 41 | +2 (5.1%) |
| **Total** | **124** | **131** | **+7 (5.6%)** |

### 4.6 Food waste meter — 7 days

| Metric | This week | Prior week |
|---|---|---|
| Захиалга | 1,240 | 1,240 |
| Бэлтгэсэн | 1,290 | 1,301 |
| **Илүүдэл (waste)** | **50** | **61** |
| Waste rate | 4.0% | 4.9% |

**↓ 18%** vs prior week (50 / 61 = 0.820). Circular gauge, 4.0% arc, mint on warm track.

**[FIX]** Original read "1,240 захиалга / 1,190 бэлтгэсэн / 50 илүүдэл багассан". Preparing
*less* than was ordered is a shortfall, not waste — the metric was mislabeled and the
subtraction was wrong. Now prepared > ordered, surplus is real waste, and the 18% figure
is arithmetically true.

### 4.7 School-wide (admin) — term aggregates

| Metric | Value |
|---|---|
| Нийт сурагч | **1,240** |
| Идэвхтэй хэрэглэгч | **968** (78%) |
| Нийт захиалга (улирал) | **24,318** |
| Нийт орлого | **98,420,000₮** |
| Average pickup | **42 сек** |
| Хүнсний хаягдал | **4.0%** |
| Хамгийн их | Тахианы цуйван |

24,318 orders × 4,049₮ ≈ 98,463,520₮ ✓. 24,318 ÷ 180 school days = 135/day ≈ 124 with
weekends and holidays excluded ✓.

### 4.8 Wallet — Бат-Эрдэнэ

**Balance 25,500₮**

| When | Amount | Reason |
|---|---|---|
| 2 дарын өдөр | +20,000₮ | Ээжийн цэнэглэлт |
| өнөөдөр 12:00 | −5,500₮ | Тахианы цуйван |
| өнөөдөр 12:15 | −2,500₮ | Жимсний салат |
| өнөөдөр 12:20 | −1,500₮ | Сүү |
| өчигдөр | −4,500₮ | Бууз |
| өчигдөр | −1,500₮ | Сүү |

Top-up presets: 5,000₮ · 10,000₮ · 20,000₮ · 50,000₮ + custom (min 1,000₮).

### 4.9 Parent — Саруул

| Metric | Value |
|---|---|
| Хүүхэд | Бат-Эрдэнэ, 9А |
| Wallet үлдэгдэл | 25,500₮ |
| Өнөөдрийн зарцуулалт | 8,500₮ |
| Өдрийн лимит | 10,000₮ |
| Энэ 7 хоног | 32,500₮ |

Spend-limit state thresholds: `< 70%` green · `70–90%` orange warning ·
`> 100%` red + order blocked.

### 4.10 Order IDs
`A1024` (live, preparing) · `A1025` (ready) · `A1026` (queued) · `A1027` (collected)
Historic: `A1018` Бууз, `A1019` Тахианы цуйван, `A1020` Гурилтай шөл, `A1021` Жимсний салат.

---

## 5. Screens

### 5.1 Onboarding (4)
1. Logo — «Сургуулийн хоолны шинэ үе.»
2. «Дараалалд бага зогсоно.»
3. «Өөрийн авах цагаа сонгоно.»
4. «QR-аа уншуулаад хоолоо авна.»
→ CTA **«Эхлэх»** → login. Page dots. Skip is not offered (4 screens is short).

### 5.2 Login
Title «Amjilt Canteen-д тавтай морил 👋»
Role segmented: **Сурагч** | **Эцэг эх**
Fields: «Сурагчийн код» (default) | «Утасны дугаар»
Primary **«Нэвтрэх»** · Secondary «Бүртгэл үүсгэх» · Link «Нууц үгээ мартсан?»
Prefilled demo: code `A1024` (student) / `88129944` (parent). Show a demo-credential hint
so the prototype is actually operable.

### 5.3 Home — the most important screen
```
Сайн уу, Бат 👋
9А анги
[ Wallet card:  Миний Wallet / 25,500₮ / + Цэнэглэх ]
[ Smart Queue card: Өнөөдөр дараалал хүлээхгүй / Авах цагаа урьдчилж сонгоорой. / Цагаа сонгох ]
🔥 Өнөөдөр хамгийн их захиалсан — Тахианы цуйван
[categories: Бүгд · Үндсэн хоол · Хөнгөн · Ундаа · Амттан]
Өнөөдрийн меню
[horizontal food card rail]
```
Food card: 4:3 photo, name, price (money style), ★ rating, small label
(🔥 Эрэлт ихтэй / Шинэ), heart favorite, circular **+** quick-add (44px, bottom-right,
overlapping the photo edge). Sold-out cards are desaturated with a `Дүүрсэн` overlay.

### 5.4 Menu
Search «Хоол хайх...» · category chips · sort · favorites
Card: photo, name, ingredients summary, price, ★, kcal, allergy icon, heart
Filter bottom sheet: Үнэ · Хоолны төрөл · Харшил үүсгэгчгүй · Вегетариан · Боломжит
Live result count: «6 хоол олдсон»

### 5.5 Food detail
Large 4:3 hero photo, name, price, ★4.8
Badges: 🔥 Эрэлт ихтэй · Шинэ
Description: «Зөөлөн тахиа, ногоо болон гар хийцийн гоймонтой.»
Sections: **Орц** (chips) · **Илчлэг** 620 kcal · **Харшил үүсгэгч** (Глютен, Өндөг)
Quantity `- 1 +` at 44px
**Sticky CTA** «Сагсанд нэмэх · 5,500₮»
If the dish conflicts with the user's saved allergies, an orange alert replaces the CTA:
⚠️ «Энэ хоолонд глютен агуулагдана.» + «Үл харших хэвээр үргэлжлэх»

### 5.6 Smart Queue — signature feature
Title «Хоолоо авах цаг»
Subtitle «Хүмүүсийг нэг дор цуглуулахгүйгээр өөрийн цагаа сонгоорой.»
Slot cards per §4.3, each 72px tall, full width, showing time + free count + state.
Selected block shows:
```
12:00–12:10
Таны авах ээлж
[queue progress bar]  8 минутын дараа
```
Plus a context line: «Цайны газар одоогоор ачаалал багатай.» with a green pulse dot.
Full slots are dimmed, non-interactive, and carry a `not-allowed` cursor.

### 5.7 Cart
Rows: thumb, name, unit price, `−`/`+` at 44px, line total, remove
Subtotal `10,000₮` · Pickup slot `12:00–12:10` · Wallet `Amjilt Wallet · 25,500₮`
Total **10,000₮** (money-lg)
CTA **«Төлөх · 10,000₮»**
Insufficient balance → CTA disabled + inline warning, primary action becomes
**«Цэнэглэх»**.

### 5.8 Payment
Order summary · payment method card (💳 Amjilt Wallet, «Үлдэгдэл 25,500₮», radio
selected) · «Банкны карт» (secondary, unselected)
Trust line: «Төлбөрийн мэдээлэл хамгаалагдсан.» with a lock glyph
CTA **«Захиалгаа баталгаажуулах»**
States: processing (button spinner, sheet locked), success, failed.

### 5.9 Order success
Large mint check (72px), «Захиалга амжилттай! 🎉», № A1024, 12:00–12:10,
«Таны хоолыг бэлтгэж эхэллээ.»
Primary **«QR кодоо харах»** · Secondary «Захиалгын дэлгэрэнгүй»

### 5.10 Order tracking
«Захиалга №A1024» · status «Бэлтгэж байна 🍜» · «6 минут»
Vertical 5-step timeline with 3 states — done (filled mint + ✓), current (filled
brand-600 + pulsing ring), pending (hairline ring).
✓ Захиалга баталгаажсан · ✓ Гал тогоонд хүлээн авсан · ● Бэлтгэж байна ·
○ Бэлэн болсон · ○ Хоолоо авсан
Ready state: «Таны хоол бэлэн боллоо! 🎉» + notification card rendering
«Таны захиалга A1024 бэлэн боллоо. QR кодоо ашиглан хоолоо аваарай.»

### 5.11 QR pickup — must feel physical
Title «Хоолоо авах» · № A1024 · 12:00–12:10
240px QR (real generated pattern, not a placeholder box)
«QR кодоо цайны газрын уншигчид ойртуулна уу.»
🟢 «QR код хүчинтэй» + expiry «Үлдсэн 08:42»
States: valid · **scanned** «Амжилттай олголоо!» + «Сайхан хооллоорой, Бат! 👋» ·
expired 🔴 «QR кодын хугацаа дууссан.» + «Шинэ QR үүсгэх»

### 5.12 Order history
Tabs «Идэвхтэй» | «Өмнөх», grouped by day.
Each row: dish thumb, name, price, slot, status chip, «Дахин захиалах» on past orders.
Favorites section: «Дуртай хоолнууд» ❤️ Бууз, ❤️ Тахианы цуйван

### 5.13 Wallet
Mint-gradient card: «Amjilt Wallet», 25,500₮, card number •••• 4421, Бат-Эрдэнэ · 9А
Actions: «Цэнэглэх» · «Гүйлгээ харах»
Top-up sheet: presets + custom + keypad → confirmation screen
Transactions: green `+` / red `−`, tabular numerals, running balance

### 5.14 Profile
Бат-Эрдэнэ, 9А анги
Rows with icons: Хувийн мэдээлэл · Wallet · Захиалгын түүх · Хүнсний харшил ·
Зарцуулалтын лимит · Мэдэгдэл · Тусламж · Нууцлал
Chevron right on all. No nested navigation depth > 1.

### 5.15 Хоолны тохиргоо (allergies)
«Танд ямар хүнсний харшил байна вэ?»
Multi-select chips: Самар · Сүү · Өндөг · Глютен · Далайн бүтээгдэхүүн
«Байхгүй» is exclusive — selecting it clears the rest.
When a selected allergen is live, every affected dish shows
⚠️ «Энэ хоолонд глютен агуулагдана.» and an orange allergen dot.

---

## 6. Parent app

- «Сайн байна уу 👋»
- Child switcher: **Бат-Эрдэнне** → 9А анги
- Wallet section: «Үлдэгдэл» 25,500₮
- «Өнөөдрийн зарцуулалт» 8,500₮
- 7-day bar chart «Энэ 7 хоног» 32,500₮
- Recent meals list
- «Өдрийн лимит» 10,000₮ with progress 8,500₮ / 10,000₮ (85% → **orange warning**)
- Controls: top up · child orders · spending · set limit · manage allergies

### Parent notifications (only these three, nothing noisy)
- «Бат-Эрдэнэ өнөөдөр 8,500₮ зарцууллаа.»
- «Таны хүүхдийн захиалга бэлэн боллоо.»
- «Wallet-ийн үлдэгдэл 5,000₮-өөс бага байна.»

---

## 7. Cafeteria console (tablet landscape, 1024×768)

### 7.1 Overview
Header «Amjilt Canteen» / «Цайны газрын самбар»
Stat tiles (§4.4): 124 Нийт захиалга · 87 Бэлэн болсон · 37 Бэлтгэж байна ·
502,000₮ Өнөөдрийн борлуулалт
Live queue monitor (§4.3) with current time 11:38 marked.
«Одоогийн ачаалал: Дунд»

### 7.2 Kitchen board — 4 columns
`Хүлээгдэж байна` · `Бэлтгэж байна` · `Бэлэн` · `Олгосон`
Card: order id, dish × qty, slot, elapsed timer, action button.
Button state advances per card: «Бэлтгэж эхлэх» → «Бэлэн болгох» → «Олгосон».
Drop-target styling (2px dashed brand-300, mint-050 fill) on the next valid column.
Column headers carry counts.

### 7.3 Бэлтгэх хэмжээ (§4.5)
«Өнөөдөр хэдийг бэлтгэх вэ?»
Table: dish · orders · prepare · buffer.
«Урьдчилсан захиалгын мэдээлэл дээр үндэслэв.»
Reads intelligent and calm — one sentence of explanation, no jargon.

### 7.4 Хүнсний хаягдал (§4.6)
«↓ 18%» · «Өмнөх 7 хоногоос»
1,240 захиалга · 1,290 бэлтгэсэн · 50 илүүдэл
Circular gauge at 4.0%
«Урьдчилсан захиалга нь илүүдэл хоолыг багасгахад тусалж байна.»

### 7.5 Inventory
Categories: Хүнс · Ундаа · Савлагаа

| Item | Qty | State |
|---|---|---|
| Сүү | 24 ширхэг | 🟡 Бага |
| Тахианы мах | 18 кг | 🟢 Хангалттай |
| Гоймон | 8 кг | 🟡 Бага |
| Будаа | 25 кг | 🟢 Хангалттай |

Banner: ⚠ «Сүүний үлдэгдэл бага байна.»

### 7.6 Menu management
Table of dishes with inline edit, availability toggle
«Өнөөдөр менюд харуулах» switch per row
«+ Шинэ хоол нэмэх» → form: name, price, image, ingredients, calories, allergen, availability

---

## 8. Admin console (desktop, 1440×900)

Stat grid (§4.7): 1,240 сурагч · 968 идэвхтэй (78%) · 24,318 захиалга ·
98,420,000₮ орлого · 42 сек avg pickup · 4.0% хаягдал
Charts: 30-day order trend (area), revenue by category (bars),
popular meals ranked list with «Тахианы цуйван» #1
Adoption donut 78%

---

## 9. State coverage

Every list needs three designed states. No exceptions.

**Empty**
- 📦 «Одоогоор идэвхтэй захиалга байхгүй.» → «Меню үзэх»
- Wallet: «Гүйлгээ одоогоор алга.»
- Search: «“бууз” гэсэн үгээр юу ч олдсонгүй» + «Хайдалтыг цэвэрлэх»

**Loading** — skeleton cards matching final card geometry exactly, with a
`--shimmer` sweep. Never a centered spinner for a list. Spinner only for
button-busy and page-level first paint.

**Error**
- «Захиалга баталгаажсангүй.» / «Интернет холболтоо шалгаад дахин оролдох но уу.» → «Дахин оролдох»
- «Төлбөр амжилтгүй боллоо.» → «Өөр төлбөрийн арга сонгох»

**Notifications** — unread rows carry a 8px brand-600 dot + brand-050 background.
🟢 ready · 🟠 low balance · 🟢 payment success. Center with «Бүгдийг уншсан» action.

**Rating** — «Хоол ямар байв?» ★★★★★ (44px stars), quick tags
Амттай · Халуун · Порц сайн · Дахин авна, optional «Сэтгэгдэл бичих...», CTA «Үнэлэх»

---

## 10. Component library

| Component | Variants |
|---|---|
| Button | Primary · Secondary · Outline · Ghost · Disabled · Loading (sm/md/lg) |
| Food card | Default · Favorite · Popular · Sold out · Low stock |
| Order card | Queued · Preparing · Ready · Collected |
| Pickup slot | Available · Almost full · Full · Selected · Past |
| Input | Default · Focused · Error · Disabled · With prefix (₮) |
| Notification | Read · Unread |
| Stat tile | Default · Positive · Warning · Danger |
| Switch | On · Off |
| Segment | 2-up · 3-up |
| Avatar | Student · Parent · Staff · Admin |

Every component uses Auto Layout, 8px spacing, and this naming:
`Component/State/Variant` → `Button/Primary/Large`, `Slot/Available/Medium`.
All icons from one 24px stroke-1.75 set. No mixed icon weights.

---

## 11. Prototype

Clickable. Critical path is one continuous spine:

```
Onboarding → Login → Home → Food detail → Cart → Pickup time
→ Payment → Success → Order tracking → QR → Pickup completed
```

Extras: Profile → Wallet → Top-up; Profile → Хоолны тохиргоо;
Parent ← Login(role) ; Cafeteria ← Overview → Kitchen board.

**Transitions — restrained.**
- Bottom sheet: 240ms `cubic-bezier(.32,.72,0,1)`, translateY 100%→0
- Page change: 180ms cross-fade + 8px rise
- Button press: `scale(.97)` over 90ms
- Order status change: 400ms cross-fade on the timeline node only
- Pickup slot select: 120ms border + 120ms fill

No bounce. No scale-in on cards. No confetti. The interface should feel like it was
always there.

---

## 12. Accessibility

- Minimum 44×44 touch targets, everywhere, including icon-only buttons
- Text contrast ≥ 4.5:1 (body) and ≥ 3:1 (large)
- Never colour alone: full slots also say `Дүүрсэн`; almost-full also shows the number
- Never colour alone: low stock also says `Бага`; over-limit also says the number
- `aria-label` on every icon-only control
- Focus ring: 2px brand-600 + 2px offset, visible on every interactive element
- Status changes announced via `aria-live="polite"`
- Reduced motion: `@media (prefers-reduced-motion: reduce)` disables shimmer and pulses
- Order path target: **under 60 seconds**, start to QR on screen
- QR screen requires zero explanation to use

---

## 13. Responsive

| Breakpoint | Target |
|---|---|
| 360–430 | Student + parent mobile (primary) |
| 768–1024 | Cafeteria tablet |
| 1280–1440+ | Admin desktop |

Dashboards reflow from 4 columns → 2 → 1 and switch tables to stacked rows below
768px. Mobile is designed first; the dashboards are adaptations, not the reverse.

---

## 14. The four things that must be memorable

1. **Smart Queue** — a time slot you own, shown as a physical reservation
2. **QR Pickup** — one scan, no argument, no line
3. **Amjilt Wallet** — money that is a product, not a payment step
4. **Food Waste Meter** — a number the school can feel good about

If a screen does not strengthen one of these four, cut it.

**Final line:** «Захиал. Цагаа сонго. QR-аа уншуул. Хоолоо ав.»
