/* ============================================================
   Amjilt Canteen — Canonical Data
   Every number here is quoted in AMJILT-CANTEEN-SPEC.md §4.
   Screens read from this file only. Do not hardcode values.
   ============================================================ */

const IMG = (id, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

/* ---------- 4.1 Cast ---------- */
const CAST = {
  student: { name: 'Бат-Эрдэнэ', short: 'Бат', klass: '9А анги', code: 'A1024', phone: '88129944' },
  parent:  { name: 'Саруул', child: 'Бат-Эрдэнэ', childKlass: '9А анги', phone: '88129944' },
  peers: [
    { name: 'Бүнхдорж', klass: '9А' },
    { name: 'Азbat',    klass: '10Б' },
    { name: 'Тэнгэр',   klass: '9А' },
    { name: 'Хөхүү',    klass: '11А' },
  ],
};

/* ---------- 4.2 Menu (today, 2026-11-24) ---------- */
const MENU = [
  { id: 'buuz',   name: 'Бууз',              price: 4500, kcal: 480, rating: 4.6,
    allergens: ['Глютен', 'Сүү'], cat: 'Үндсэн', popular: true,  fresh: false,
    ing: ['Тахианы мах', 'Сүү', 'Гоймон', 'Сонгино', 'Чинжүү'],
    desc: 'Усранмал бууз. 4 агуулах, бууз бууруу 12 ш.',
    img: 'photo-1563245372-f21724e3856d', tag: '🔥 Эрэлт ихтэй' },

  { id: 'tsuvan', name: 'Тахианы цуйван',    price: 5500, kcal: 620, rating: 4.8,
    allergens: ['Глютен', 'Өндөг'], cat: 'Үндсэн', popular: true, fresh: true,
    ing: ['Тахианы мах', 'Гоймон', 'Лууван', 'Сонгино', 'Чинжүү'],
    desc: 'Зөөлөн тахиа, ногоо болон гар хийцийн гоймонтой.',
    img: 'photo-1569718212165-3a8278d5f624', tag: '🔥 Эрэлт ихтэй' },

  { id: 'huurga', name: 'Ногоотой хуурга',   price: 4800, kcal: 540, rating: 4.4,
    allergens: ['Глютен', 'Далайн бүтээгдэхүүн'], cat: 'Үндсэн', popular: false, fresh: false,
    ing: ['Ногоо', 'Тохиогийн гоймон', 'Сүү', 'Өндөг'],
    desc: 'Ногоотой махан хуурга, гар хийцтэй.',
    img: 'photo-1546069901-ba9599a7e63c', tag: null },

  { id: 'shol',   name: 'Гурилтай шөл',      price: 4000, kcal: 310, rating: 4.2,
    allergens: ['Глютен'], cat: 'Үндсэн', popular: false, fresh: false,
    ing: ['Гурил', 'Мах', 'Ногоо', 'Чинжүү'],
    desc: 'Өдөр тутмын халуун шөл, гурилтай.',
    img: 'photo-1547592166-23ac45744acd', tag: null },

  { id: 'salat',  name: 'Жимсний салат',      price: 2500, kcal: 120, rating: 4.5,
    allergens: [], cat: 'Хөнгөн', popular: false, fresh: true,
    ing: ['Тохиогийн салат', 'Томат', 'Хулуу', 'Цитрим'],
    desc: 'Шинэ жимсний салат, өдрийн гэрэлтэй хоол.',
    img: 'photo-1512621776951-a57141f2eefd', tag: 'Шинэ' },

  { id: 'suu',    name: 'Сүү',                price: 1500, kcal: 180, rating: 4.3,
    allergens: ['Сүү'], cat: 'Ундаа', popular: false, fresh: false,
    ing: ['Сүү'],
    desc: '1.5% сүү, 250мл.',
    img: 'photo-1550583724-b2692b85b150', tag: null },
];

const CATEGORIES = [
  { id: 'all',     label: 'Бүгд' },
  { id: 'Үндсэн',   label: 'Үндсэн хоол' },
  { id: 'Хөнгөн',    label: 'Хөнгөн' },
  { id: 'Ундаа',    label: 'Ундаа' },
  { id: 'Амттан',   label: 'Амттан' },
];

/* ---------- 4.3 Smart Queue: capacity 16/slot ---------- */
const SLOT_CAPACITY = 16;
const SLOTS = [
  { time: '11:30–11:40', from: 690, to: 700, orders: 8  },  // 8 free
  { time: '11:40–11:50', from: 700, to: 710, orders: 10 },  // 6 free
  { time: '11:50–12:00', from: 710, to: 720, orders: 12 },  // 4 free  -> almost full
  { time: '12:00–12:10', from: 720, to: 730, orders: 8  },  // 8 free  -> SELECTED
  { time: '12:10–12:20', from: 730, to: 740, orders: 10 },  // 6 free
];
const CURRENT_MIN = 698;                 // 11:38
const SELECTED_SLOT = 3;                 // index of 12:00–12:10

const free = (s) => SLOT_CAPACITY - s.orders;
const slotState = (s) => {
  const f = free(s);
  if (f <= 0) return 'full';
  if (f <= 7) return 'almost';
  return 'available';
};

/* ---------- 4.4 Today's operations @ 11:38 ---------- */
const OPS = {
  nowLabel: '11:38',
  total: 124, done: 87, preparing: 37,
  revenue: 502000,          // [FIX] was 4,850,000 (= 39,113₮/meal, impossible)
  avgOrder: 4049,
  load: 'Дунд',
};

/* ---------- 4.5 Forecast: sums to 124 ---------- */
const FORECAST = [
  { name: 'Бууз',            orders: 45, prepare: 48, img: 'photo-1563245372-f21724e3856d' },
  { name: 'Тахианы цуйван',  orders: 40, prepare: 42, img: 'photo-1569718212165-3a8278d5f624' },
  { name: 'Ногоотой хуурга', orders: 39, prepare: 41, img: 'photo-1546069901-ba9599a7e63c' },
];

/* ---------- 4.6 Waste meter: 7 days ---------- */
const WASTE = {
  orders: 1240, prepared: 1290, surplus: 50,
  prevPrepared: 1301, prevSurplus: 61,
  rate: 4.0, prevRate: 4.9, drop: 18,   // 50/61 = 0.820
  days: ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням'],
  daily: [4.9, 5.2, 4.7, 4.4, 4.1, 3.9, 4.0],
};

/* ---------- 4.7 Admin, term aggregates ---------- */
const ADMIN = {
  students: 1240, active: 968, adoption: 78,
  orders: 24318, revenue: 98420000,     // 24,318 x 4,049 = 98,463,520
  avgPickup: 42, wasteRate: 4.0,
  trend: [148,162,155,171,163,178,169,182,175,188,181,193,186,198,190,204,197,209,201,214,208,220,212,226,219,232,225,238,231,242],
  topDishes: [
    { name: 'Тахианы цуйван',  n: 4821, pct: 100 },
    { name: 'Бууз',            n: 4117, pct: 85 },
    { name: 'Ногоотой хуурга', n: 3904, pct: 81 },
    { name: 'Гурилтай шөл',    n: 3202, pct: 66 },
    { name: 'Жимсний салат',   n: 2688, pct: 56 },
    { name: 'Сүү',             n: 2411, pct: 50 },
  ],
};

/* ---------- 4.8 Wallet ---------- */
const WALLET = {
  balance: 25500,
  card: '•••• 4421',
  tx: [
    { amt: -1500, label: 'Сүү',                 when: 'Өнөөдөр · 12:20', kind: 'order',   id: 'A1024' },
    { amt: -2500, label: 'Жимсний салат',       when: 'Өнөөдөр · 12:15', kind: 'order',   id: 'A1024' },
    { amt: -5500, label: 'Тахианы цуйван',      when: 'Өнөөдөр · 12:00', kind: 'order',   id: 'A1024' },
    { amt:  20000,label: 'Ээжийн цэнэглэлт',    when: '2 дарын өдөр',    kind: 'topup'   },
    { amt: -1500, label: 'Сүү',                 when: 'Өчигдөр',        kind: 'order',   id: 'A1020' },
    { amt: -4500, label: 'Бууз',                when: 'Өчигдөр',        kind: 'order',   id: 'A1018' },
  ],
};
const TOPUP_PRESETS = [5000, 10000, 20000, 50000];

/* ---------- 4.9 Parent ---------- */
const PARENT = {
  todaySpend: 8500, limit: 10000, weekSpend: 32500,
  week: [4200, 5100, 3800, 5600, 4500, 5200, 4000],
  weekDays: ['Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба','Ням'],
  meals: [
    { name: 'Тахианы цуйван', price: 5500, when: '12:00–12:10', id: 'A1024' },
    { name: 'Жимсний салат',   price: 2500, when: '12:00–12:10', id: 'A1024' },
    { name: 'Сүү',             price: 1500, when: '12:00–12:10', id: 'A1024' },
  ],
  notifications: [
    { kind: 'ok',   t: 'Бат-Эрдэнэ өнөөдөр 8,500₮ зарцууллаа.',            when: 'Үүгээр',     unread: true },
    { kind: 'ok',   t: 'Таны хүүхдийн захиалга бэлэн боллоо.',            when: '12 мин',    unread: true },
    { kind: 'warn', t: 'Wallet-ийн үлдэгдэл 5,000₮-өөс бага байна.',       when: 'Өчигдөр',   unread: false },
  ],
};

/* ---------- 4.10 Orders ---------- */
const ORDERS = {
  live: { id: 'A1024', slot: 3, status: 'preparing', eta: 6, from: '12:00–12:10' },
  ready: { id: 'A1025', slot: 3, status: 'ready',    eta: 0, from: '12:00–12:10' },
  queued:{ id: 'A1026', slot: 2, status: 'queued',   eta: 14, from: '11:50–12:00' },
  past: [
    { id: 'A1027', name: 'Бууз',           price: 4500, slot: 3, when: 'Өчигдөр', status: 'collected' },
    { id: 'A1020', name: 'Гурилтай шөл',   price: 4000, slot: 2, when: 'Өчигдөр', status: 'collected' },
    { id: 'A1019', name: 'Тахианы цуйван', price: 5500, slot: 3, when: '2 өдрийн өдөр', status: 'collected' },
    { id: 'A1018', name: 'Бууз',           price: 4500, slot: 3, when: '3 өдрийн өдөр', status: 'collected' },
  ],
};

/* ---------- Cart (11.7) ---------- */
const CART = {
  items: [
    { id: 'tsuvan', qty: 1 },
    { id: 'salat',  qty: 1 },
  ],
  slot: 3,
};
const cartSubtotal = () =>
  CART.items.reduce((s, i) => s + (MENU.find(m => m.id === i.id)?.price || 0) * i.qty, 0);
const cartCount = () => CART.items.reduce((s, i) => s + i.qty, 0);

/* ---------- Allergies (5.15) ---------- */
const ALLERGENS = ['Самар', 'Сүү', 'Өндөг', 'Глютен', 'Далайн бүтээгдэхүүн'];
const STATE = { allergies: ['Глютен'], favorites: ['buuz', 'tsuvan'], seenOnboarding: false, role: 'student' };

/* ---------- Kitchen board (7.2) ---------- */
const KITCHEN = {
  waiting: [
    { id: 'A1026', name: 'Ногоотой хуурга', qty: 1, slot: '11:50–12:00', t: '2:14' },
    { id: 'A1028', name: 'Бууз',            qty: 2, slot: '11:50–12:00', t: '1:52' },
    { id: 'A1029', name: 'Жимсний салат',   qty: 1, slot: '12:00–12:10', t: '1:30' },
  ],
  cooking: [
    { id: 'A1024', name: 'Тахианы цуйван', qty: 1, slot: '12:00–12:10', t: '5:40' },
    { id: 'A1030', name: 'Гурилтай шөл',   qty: 2, slot: '12:00–12:10', t: '4:12' },
    { id: 'A1031', name: 'Бууз',            qty: 3, slot: '12:00–12:10', t: '3:05' },
  ],
  ready: [
    { id: 'A1025', name: 'Бууз',            qty: 2, slot: '12:00–12:10', t: '0:22' },
    { id: 'A1032', name: 'Сүү',             qty: 1, slot: '12:00–12:10', t: '0:08' },
  ],
  done: [
    { id: 'A1027', name: 'Бууз',            qty: 1, slot: '11:40–11:50', t: '—' },
    { id: 'A1023', name: 'Тахианы цуйван', qty: 1, slot: '11:30–11:40', t: '—' },
  ],
};

/* ---------- Inventory (7.5) ---------- */
const INVENTORY = [
  { cat: 'Хүнс',    name: 'Сүү',          qty: '24 ширхэг', n: 24, max: 48, state: 'low'  },
  { cat: 'Хүнс',    name: 'Тахианы мах',  qty: '18 кг',      n: 18, max: 30, state: 'ok'   },
  { cat: 'Хүнс',    name: 'Гоймон',       qty: '8 кг',       n: 8,  max: 25, state: 'low'  },
  { cat: 'Хүнс',    name: 'Будаа',        qty: '25 кг',      n: 25, max: 30, state: 'ok'   },
  { cat: 'Ундаа',   name: 'Ногоотой чай', qty: '120 ултвар', n: 30, max: 60, state: 'ok'   },
  { cat: 'Ундаа',   name: 'Ус',           qty: '18 ширхэг', n: 18, max: 48, state: 'low'  },
  { cat: 'Савлагаа', name: 'Бокал',        qty: '340 ширхэг', n: 34, max: 40, state: 'ok'   },
  { cat: 'Савлагаа', name: 'Халдах сум',   qty: '90 ширхэг',  n: 9,  max: 60, state: 'low'  },
];

/* ---------- Notifications (9) ---------- */
const NOTIFICATIONS = [
  { kind: 'ok',   t: 'Таны захиалга бэлэн боллоо.', d: 'A1024 · 12:00–12:10', when: 'Үүгээр',   unread: true },
  { kind: 'ok',   t: 'Төлбөр амжилттай.',         d: '10,000₮ · Amjilt Wallet', when: 'Үүгээр', unread: true },
  { kind: 'warn', t: 'Wallet-ийн үлдэгдэл бага байна.', d: '15,500₮ үлдсэн', when: '1 цаг',  unread: false },
  { kind: 'ok',   t: 'Захиалга дууссан.',          d: 'A1027 · Бууз',        when: 'Өчигдөр', unread: false },
];

/* ---------- Rating tags (9) ---------- */
const RATING_TAGS = ['Амттай', 'Халуун', 'Порц сайн', 'Дахин авна'];

/* ---------- 4.9 spend-limit thresholds ---------- */
const limitState = (spend, limit) => {
  const r = spend / limit;
  if (r > 1)    return { key: 'over',  label: 'Лимит дагажсан',   color: 'red'   };
  if (r >= .7)  return { key: 'near',  label: 'Ойролцоо',        color: 'orange'};
  return { key: 'ok', label: 'Хэвээр', color: 'green' };
};
