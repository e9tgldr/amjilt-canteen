# Amjilt Canteen — Figma build prompt

Paste everything below into Figma's AI (Make or First Draft).

---

## PROMPT START

Build a complete, production-quality mobile + web product called **Amjilt Canteen** — a
digital school cafeteria system for a Mongolian secondary school. It must look like a
funded startup product, not a school project.

**Language: Mongolian Cyrillic everywhere in the interface.** Currency uses **₮**
with thousands separators, no decimals. Only the brand names "Amjilt Canteen" and
"Amjilt Wallet" stay in English.

### Users
Students (grades 6–12), parents, cafeteria staff, school administrators.
Surfaces: mobile app (student + parent), tablet console (cafeteria), desktop console (admin).

### Brand
Tagline: «Захиал. Цагаа сонго. QR-аа уншуул. Хоолоо ав.»
Feeling: modern, smart, fast, friendly, trustworthy, fresh, premium, professional.
Never childish, no cartoons, no emoji-heavy illustration, no purple, no excessive
gradients, no generic food-delivery-app look.

### Color tokens — use exactly these
- Primary emerald `#0E6B4F` · dark `#0A5540` / `#07422F` / `#052E22`
- Secondary mint `#6BD4AE` · `#A9E9D0` · `#D6F5E8` · wash `#EEFBF5`
- Accent orange `#FF7A29` · `#E86A16` · wash `#FFEDE1` · border `#FFB781`
- Background warm white `#FAF9F6` · surface `#FFFFFF` · sunken `#F3F1EC` · border `#E6E3DC`
- Text `#1A1D1C` · secondary `#5C6563` · tertiary `#8E9795`
- Success `#12855F` · warning `#E8A317` · danger `#D0342C`

**Color law:** green = system state (primary CTA, success, available, confirmed, positive
stats). Orange = food and attention (popular, bestseller, almost-full, low balance).
Red = blocked only (full slot, failed payment, over limit) — never decorative.
The wallet card is the only gradient in the product. Everything else stays light.

### Typography
Rounded geometric sans with full Cyrillic support (Nunito or similar).
Display 32/38 800 · Title 24/30 800 · Section 17/23 700 · Body 15/22 500 ·
Small 13/19 500 · Label 12/16 700 · Money 26/30 800 · Money large 34/38 800.
All money uses tabular figures. Slight negative letter-spacing on headings.

### Shape and spacing
8px spacing scale (4 half-step). Card radius 20, large card 24, input/button 14, pill full.
Soft two-layer shadows, never gray-on-gray. **Minimum touch target 44×44 with no
exceptions**, including icon-only buttons. Generous whitespace — never overcrowd.

### Bottom navigation (5 tabs)
Нүүр · Меню · Захиалга · Wallet · Профайл. Selected tab: filled 24px icon, emerald,
800 label, mint pill above the icon. Use bottom sheets instead of new pages when content
fits in under 70% of screen height.

### The four signature features — make these memorable
1. **SMART QUEUE** — the student reserves a 10-minute pickup slot and it is shown as an
   owned reservation, not a queue position.
2. **QR PICKUP** — one scan to collect, no argument, no line.
3. **AMJILT WALLET** — money treated as a product, not a payment step.
4. **FOOD WASTE METER** — a number the school feels good about.

### Canonical data — use these exact numbers everywhere, do not invent others
Student **Бат-Эрдэнэ, 9А анги**. Parent **Саруул**. Wallet **25,500₮**.
Today is Tuesday, 11:38.

Menu: Бууз 4,500₮ 480kcal · Тахианы цуйван 5,500₮ 620kcal · Ногоотой хуурга 4,800₮ 540kcal ·
Гурилтай шөл 4,000₮ 310kcal · Жимсний салат 2,500₮ 120kcal · Сүү 1,500₮ 180kcal.

Pickup slots — **capacity 16 per slot**, and these must agree across the student view and
the staff view:
| Slot | Orders | Free | Student state |
|---|---|---|---|
| 11:30–11:40 | 8 | 8 сул | available |
| 11:40–11:50 | 10 | 6 сул | almost full |
| 11:50–12:00 | 12 | 4 сул | almost full |
| 12:00–12:10 | 8 | 8 сул | **selected** |
| 12:10–12:20 | 10 | 6 сул | almost full |

Slot rules: ≥8 free = available (green); 1–7 = almost full (orange, show
«⚠ N сул үлдлээ»); 0 = full (red, «Дүүрсэн», not selectable, time struck through).
Never rely on colour alone — always show the number and the word.

Cafeteria today: 124 orders · 87 ready · 37 preparing · 502,000₮ revenue.
Preparation forecast (must total 124): Бууз 45→48 · Тахианы цуйван 40→42 ·
Ногоотой хуурга 39→41.
Waste meter, last 7 days: 1,240 ordered · 1,290 prepared · 50 surplus · **↓18%** vs the
prior week's 61 surplus.
Admin, term totals: 1,240 students · 968 active (78%) · 24,318 orders · 98,420,000₮ ·
average pickup 42 sec · waste 4.0%.

### Build these pages
**01 Design System** — color swatches, type scale, spacing scale, radius scale, and
reusable components with variants: Button (Primary/Secondary/Outline/Ghost × S/M/L),
Food card (Default/Favorite/Popular/Sold out), Pickup slot (5 states), Order card
(Queued/Preparing/Ready/Collected), Input (Default/Focused/Error/Disabled),
Notification (Read/Unread), Stat tile (Default/Positive/Warning/Danger).
Use auto layout and consistent `Component/State/Size` naming throughout.

**02 Student App** — onboarding (4 screens) · login (Сурагч / Эцэг эх) · home ·
menu + search/filter sheet · food detail · smart queue · cart · payment · order success ·
live order tracking timeline · QR pickup · order history · wallet + top-up · profile ·
allergy settings · rating. Home is the most important screen: wallet card, Smart Queue
banner, best-seller strip, category chips, and a horizontal rail of food cards with real
food photography, price, rating, favourite heart and a 44px quick-add button.

**03 Parent App** — child switcher, wallet balance, today's spend, 7-day bar chart,
recent meals, daily limit with progress meter (orange at 70%, red over 100%), and the
three notifications only: «Бат-Эрдэнэ өнөөдөр 8,500₮ зарцууллаа.» ·
«Таны хүүхдийн захиалга бэлэн боллоо.» · «Wallet-ийн үлдэгдэл 5,000₮-өөс бага байна.»

**04 Cafeteria Dashboard** (tablet) — overview with the 4 stat tiles and live slot monitor ·
kitchen order board with 4 columns (Хүлээгдэж байна / Бэлтгэж байна / Бэлэн / Олгосон)
where each card's button advances it to the next column · preparation forecast table ·
inventory with category tabs and low-stock warnings · menu management with availability toggles.

**05 Admin Dashboard** (desktop) — 6 stat tiles · 30-day order trend area chart ·
adoption donut at 78% · ranked popular meals with Тахианы цуйван first · Smart Queue impact.

**06 Prototype** — connect the spine: Home → Food detail → Cart → Pickup time → Payment →
Success → Tracking → QR. Restrained motion only: bottom sheet 240ms ease-out, page
transition 180ms cross-fade, button press scale(.97) 90ms. No bounce, no confetti.

### States — design all of them, not just the happy path
Empty (no active orders, no wallet transactions, no search results) · loading skeletons
matching final card geometry (never a spinner for a list) · error (network failure with
retry, payment failure with alternative method) · unread notifications · sold-out dish ·
insufficient wallet balance.

### Hard constraints
44px minimum touch targets · strong text contrast · no hidden navigation · no lorem
ipsum, all copy real Mongolian · a student must complete an order in under 60 seconds ·
the QR screen must need zero explanation · never communicate state by colour alone.

## PROMPT END

---

## If the tool only builds one screen at a time

Run these in order after the Design System:

1. **Student home** — wallet card, Smart Queue banner «Өнөөдөр дараалал хүлээхгүй», best-seller
   strip, category chips (Бүгд/Үндсэн хоол/Хөнгөн/Ундаа/Амттан), horizontal food rail.
2. **Smart Queue** — title «Хоолоо авах цаг», subtitle «Хүмүүсийг нэг дор цуглуулахгүйгээр
   өөрийн цагаа сонгоорой», 5 slot cards using the table above, selected-slot panel
   showing «22 минутын дараа» with a progress bar, and the line
   «Цайны газар одоогоор ачаалал багатай.»
3. **QR pickup** — large QR for order № A1024, slot 12:00–12:10, «QR код хүчинтэй»,
   «Үлдсэн 08:42», and the instruction «QR кодоо цайны газрын уншигчид ойртуулна уу.»
4. **Food detail** — Тахианы цуйван 5,500₮, ★4.8, badges «🔥 Эрэлт ихтэй» and «Шинэ»,
   Орц chips, 620 kcal, allergens, quantity stepper, sticky CTA.
5. **Food waste meter** — «↓ 18%» with a circular gauge, the 1,240 / 1,290 / 50 figures,
   and «Урьдчилсан захиалга нь илүүдэл хоолыг багасгахад тусалж байна.»
6. **Parent dashboard** — «Сайн байна уу 👋», child card Бат-Эрдэнне 9А, 25,500₮,
   8,500₮ today, 7-day chart, daily limit 8,500₮ / 10,000₮ in orange warning state.
