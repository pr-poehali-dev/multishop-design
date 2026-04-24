import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

/* ─── Данные ─── */
const CITIES = [
  "Москва", "Санкт-Петербург", "Казань", "Новосибирск", "Екатеринбург",
  "Краснодар", "Нижний Новгород", "Самара", "Ростов-на-Дону", "Уфа",
  "Пермь", "Воронеж", "Омск", "Челябинск", "Владивосток",
];

const STORES = [
  {
    id: "s1",
    name: "АромаДом",
    tagline: "Свечи и ароматы ручной работы",
    emoji: "🕯",
    city: "Москва",
    rating: 4.9,
    sales: 1240,
    since: "2019",
    bg: "#FAE8EE",       // пудрово-розовый
    accent: "#7B2D42",
    products: [
      { id: 1,  name: "Диффузор «Лаванда»",     price: 1490, oldPrice: 2100, emoji: "🌿" },
      { id: 2,  name: "Свеча «Ваниль»",          price: 890,  oldPrice: 1200, emoji: "🕯" },
      { id: 3,  name: "Набор аромасвечей",        price: 2490, oldPrice: null, emoji: "🎁" },
    ],
  },
  {
    id: "s2",
    name: "Beautylab",
    tagline: "Профессиональный уход за кожей",
    emoji: "✨",
    city: "Санкт-Петербург",
    rating: 4.8,
    sales: 890,
    since: "2021",
    bg: "#E8F5F0",       // мятный
    accent: "#2D5A4A",
    products: [
      { id: 4,  name: "Крем-флюид Glow",         price: 2290, oldPrice: 3200, emoji: "💆" },
      { id: 5,  name: "Сыворотка Retinol",        price: 2990, oldPrice: 3900, emoji: "✨" },
      { id: 6,  name: "Маска ночная Rose",        price: 1690, oldPrice: null, emoji: "🌹" },
    ],
  },
  {
    id: "s3",
    name: "ДомДекор",
    tagline: "Интерьер с характером",
    emoji: "🏺",
    city: "Казань",
    rating: 4.7,
    sales: 654,
    since: "2020",
    bg: "#F5EFE6",       // бежевый
    accent: "#7B5E3A",
    products: [
      { id: 7,  name: "Ваза Marble Grey",         price: 3490, oldPrice: 4800, emoji: "🏺" },
      { id: 8,  name: "Органайзер Desk",          price: 1590, oldPrice: null, emoji: "📦" },
      { id: 9,  name: "Подсвечник Brass",         price: 2100, oldPrice: 2800, emoji: "🪔" },
    ],
  },
  {
    id: "s4",
    name: "КухняПро",
    tagline: "Посуда для уютного дома",
    emoji: "☕",
    city: "Москва",
    rating: 4.6,
    sales: 2100,
    since: "2018",
    bg: "#FFF3E0",       // персиковый
    accent: "#8B4513",
    products: [
      { id: 10, name: "Термокружка Pastel",       price: 1190, oldPrice: null, emoji: "☕" },
      { id: 11, name: "Сервиз чайный «Утро»",     price: 4200, oldPrice: 5600, emoji: "🍵" },
      { id: 12, name: "Доска деревянная",          price: 890,  oldPrice: null, emoji: "🪵" },
    ],
  },
  {
    id: "s5",
    name: "СпортМаркет",
    tagline: "Спорт и активный образ жизни",
    emoji: "👟",
    city: "Екатеринбург",
    rating: 4.9,
    sales: 3200,
    since: "2017",
    bg: "#E8EEF5",       // голубоватый
    accent: "#2D4A7B",
    products: [
      { id: 13, name: "Кроссовки Urban Pro",      price: 4990, oldPrice: 7200, emoji: "👟" },
      { id: 14, name: "Смартфон X-Vision",        price: 24900,oldPrice:31000, emoji: "📱" },
      { id: 15, name: "Бутылка для воды 750мл",   price: 990,  oldPrice: null, emoji: "💧" },
    ],
  },
  {
    id: "s6",
    name: "ДетскийМир",
    tagline: "Игрушки и радость для детей",
    emoji: "🧩",
    city: "Новосибирск",
    rating: 4.8,
    sales: 760,
    since: "2022",
    bg: "#F0E8F5",       // лавандовый
    accent: "#5B2D7B",
    products: [
      { id: 16, name: "Конструктор Blocks+",      price: 1890, oldPrice: null, emoji: "🧩" },
      { id: 17, name: "Набор LEGO City",           price: 3290, oldPrice: null, emoji: "🏗" },
      { id: 18, name: "Мягкая игрушка Мишка",     price: 1290, oldPrice: 1800, emoji: "🧸" },
    ],
  },
];

const ALL_CATS = ["Все магазины", "Красота", "Дом", "Кухня", "Спорт", "Детям"];
const CITY_CAT: Record<string, string[]> = {
  "Москва":          ["АромаДом", "КухняПро"],
  "Санкт-Петербург": ["Beautylab"],
  "Казань":          ["ДомДекор"],
  "Екатеринбург":    ["СпортМаркет"],
  "Новосибирск":     ["ДетскийМир"],
};

/* ─── Helpers ─── */
function Stars({ r }: { r: number }) {
  return (
    <span className="text-xs">
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(r) ? "#C9903A" : "#D1C5BB" }}>★</span>
      ))}
    </span>
  );
}

/* ─── City Sign Modal ─── */
function CitySignModal({ onSelect }: { onSelect: (c: string) => void }) {
  const [q, setQ] = useState("");
  const filtered = CITIES.filter(c => c.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="city-sign-overlay">
      <div className="city-sign-box">

        {/* Вывеска */}
        <div className="text-center py-8 px-8" style={{ background: "var(--wine)", position: "relative" }}>
          {/* Декоративные лампочки */}
          <div className="flex justify-center gap-3 mb-4">
            {["🟡","⚪","🟡","⚪","🟡","⚪","🟡"].map((b,i) => (
              <span key={i} className="text-sm opacity-80">{b}</span>
            ))}
          </div>
          <h2 className="text-white mb-1" style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 600, lineHeight: 1.1 }}>
            Всети-города
          </h2>
          <p className="text-white/70 text-sm font-medium tracking-wider uppercase">
            Выберите ваш город
          </p>
          <div className="flex justify-center gap-3 mt-4">
            {["⚪","🟡","⚪","🟡","⚪","🟡","⚪"].map((b,i) => (
              <span key={i} className="text-sm opacity-80">{b}</span>
            ))}
          </div>
        </div>

        <div className="p-7">
          <p className="text-sm text-center mb-5" style={{ color: "var(--sub)" }}>
            Покажем магазины и товары рядом с вами
          </p>

          <div className="relative mb-4">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Найти город..."
              className="search-field w-full pl-9 pr-4 py-2.5"
              style={{ color: "var(--ink)" }}
              autoFocus
            />
            <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--sub)" }} />
          </div>

          <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
            {filtered.map(city => (
              <button key={city} className="city-pill" onClick={() => onSelect(city)}>
                {city}
              </button>
            ))}
          </div>

          <p className="text-xs text-center mt-5" style={{ color: "var(--sub)" }}>
            Можно изменить в любое время — в шапке сайта
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Витрина магазина ─── */
interface StoreProps {
  store: typeof STORES[0];
  onAddCart: (id: number) => void;
  cartItems: number[];
  wishlist: number[];
  onWish: (id: number) => void;
  delay?: number;
}

function Storefront({ store, onAddCart, cartItems, wishlist, onWish, delay = 0 }: StoreProps) {
  return (
    <div className={`storefront fade-up`} style={{ animationDelay: `${delay}s`, opacity: 0 }}>

      {/* Вывеска магазина */}
      <div className="store-sign" style={{ background: store.bg }}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
            style={{ background: "#fff", border: `2px solid ${store.accent}22` }}>
            {store.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 600, color: "var(--ink)", lineHeight: 1.1 }}>
                {store.name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: `${store.accent}15`, color: store.accent }}>
                с {store.since}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--sub)" }}>{store.tagline}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1">
                <Stars r={store.rating} />
                <span className="text-xs font-semibold" style={{ color: "var(--ink)" }}>{store.rating}</span>
              </div>
              <span className="text-xs" style={{ color: "var(--sub)" }}>{store.sales.toLocaleString("ru-RU")} продаж</span>
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--sub)" }}>
                <Icon name="MapPin" size={11} />{store.city}
              </span>
            </div>
          </div>
          <button className="btn-ghost-sm shrink-0 text-xs" style={{ color: store.accent, border: `1.5px solid ${store.accent}30` }}>
            В магазин →
          </button>
        </div>
      </div>

      {/* Витрина — 3 товара */}
      <div className="p-5">
        <div className="grid grid-cols-3 gap-3">
          {store.products.map(p => (
            <div key={p.id} className="showcase-item">
              <div className="h-28 flex items-center justify-center text-5xl" style={{ background: store.bg }}>
                {p.emoji}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium leading-tight mb-0.5 line-clamp-2" style={{ color: "var(--ink)" }}>
                  {p.name}
                </p>
                <p className="text-[10px] mb-2" style={{ color: "var(--sub)" }}>
                  От {store.name}
                </p>
                <div className="flex items-end justify-between gap-1">
                  <div>
                    <div className="font-bold text-sm" style={{ color: "var(--ink)" }}>
                      {p.price.toLocaleString("ru-RU")} ₽
                    </div>
                    {p.oldPrice && (
                      <div className="text-[10px] line-through" style={{ color: "var(--sub)" }}>
                        {p.oldPrice.toLocaleString("ru-RU")} ₽
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onWish(p.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm border transition-all"
                      style={{
                        borderColor: wishlist.includes(p.id) ? store.accent : "var(--line)",
                        color: wishlist.includes(p.id) ? store.accent : "var(--sub)",
                        background: wishlist.includes(p.id) ? `${store.accent}10` : "#fff",
                      }}
                    >
                      {wishlist.includes(p.id) ? "♥" : "♡"}
                    </button>
                    <button
                      onClick={() => onAddCart(p.id)}
                      className="h-7 px-2.5 rounded-lg text-[10px] font-bold transition-all"
                      style={
                        cartItems.includes(p.id)
                          ? { background: `${store.accent}15`, color: store.accent, border: `1px solid ${store.accent}30` }
                          : { background: store.accent, color: "#fff" }
                      }
                    >
                      {cartItems.includes(p.id) ? "✓" : "Купить"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function Index() {
  const [city,      setCity]      = useState<string | null>(null);
  const [showCity,  setShowCity]  = useState(true);
  const [activeCat, setActiveCat] = useState("Все магазины");
  const [activeNav, setActiveNav] = useState("home");
  const [search,    setSearch]    = useState("");
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [wishlist,  setWishlist]  = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("vseti_city");
    if (saved) { setCity(saved); setShowCity(false); }
  }, []);

  const selectCity = (c: string) => {
    setCity(c); setShowCity(false);
    localStorage.setItem("vseti_city", c);
  };

  const addToCart = (id: number) => {
    if (!cartItems.includes(id)) setCartItems(p => [...p, id]);
  };
  const toggleWish = (id: number) => {
    setWishlist(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  };
  const goTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Фильтрация магазинов
  const filtered = STORES.filter(s => {
    const catOk = activeCat === "Все магазины" ||
      (activeCat === "Красота"  && ["Beautylab"].includes(s.name)) ||
      (activeCat === "Дом"      && ["АромаДом","ДомДекор"].includes(s.name)) ||
      (activeCat === "Кухня"    && ["КухняПро"].includes(s.name)) ||
      (activeCat === "Спорт"    && ["СпортМаркет"].includes(s.name)) ||
      (activeCat === "Детям"    && ["ДетскийМир"].includes(s.name));
    const srchOk = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline.toLowerCase().includes(search.toLowerCase());
    const cityOk = !city || !(city in CITY_CAT) || CITY_CAT[city].includes(s.name);
    return catOk && srchOk;
  });

  // "Местные" магазины (если выбран город с привязкой)
  const localStores = city && CITY_CAT[city] ? STORES.filter(s => CITY_CAT[city].includes(s.name)) : [];

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)", fontFamily: "'Golos Text', sans-serif" }}>

      {showCity && <CitySignModal onSelect={selectCity} />}

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-4">

          {/* Logo */}
          <div className="flex-shrink-0">
            <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 600, color: "var(--wine)", lineHeight: 1 }}>
              Всети-города
            </div>
            <div className="text-[9px] tracking-widest font-semibold uppercase" style={{ color: "var(--sub)" }}>маркетплейс</div>
          </div>

          {/* City */}
          {city && (
            <button className="city-chip flex-shrink-0" onClick={() => setShowCity(true)}>
              <Icon name="MapPin" size={13} />
              {city}
              <Icon name="ChevronDown" size={11} />
            </button>
          )}

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Найти магазин или товар..."
              className="search-field w-full pl-9 pr-4 py-2"
              style={{ color: "var(--ink)" }}
            />
            <Icon name="Search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--sub)" }} />
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <button className="btn-ghost-sm flex items-center gap-1.5">
              <Icon name="User" size={16} />
              <span className="hidden sm:inline">Войти</span>
            </button>
            <button className="btn-ghost-sm relative">
              <Icon name="Heart" size={16} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                  style={{ background: "var(--wine)" }}>
                  {wishlist.length}
                </span>
              )}
            </button>
            <button className="btn-wine flex items-center gap-2">
              <Icon name="ShoppingBag" size={15} className="text-white" />
              <span className="hidden sm:inline">Корзина</span>
              {cartItems.length > 0 && (
                <span className="font-bold text-[11px] bg-white rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ color: "var(--wine)" }}>
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="max-w-6xl mx-auto px-5 flex gap-6 overflow-x-auto" style={{ borderTop: "1px solid var(--line)" }}>
          {[
            { label: "Витрины",    id: "home" },
            { label: "Акции",      id: "sales" },
            { label: "О проекте",  id: "about" },
            { label: "Контакты",   id: "contacts" },
          ].map(l => (
            <button key={l.id} onClick={() => goTo(l.id)}
              className={`nav-tab ${activeNav === l.id ? "active" : ""}`}>
              {l.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── HERO ── */}
      <section id="home" className="py-10 px-5" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto">

          {/* Заголовок */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 fade-up">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--wine)" }}>
                {city ? `Витрины · ${city}` : "Местный маркетплейс"}
              </p>
              <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 600, color: "var(--ink)", lineHeight: 1.1 }}>
                Магазины вашего города
              </h1>
              <p className="mt-2 text-sm max-w-md" style={{ color: "var(--sub)" }}>
                Покупайте у реальных предпринимателей. Каждый магазин — это живой человек за прилавком.
              </p>
            </div>

            {/* Категории */}
            <div className="flex flex-wrap gap-2">
              {ALL_CATS.map(c => (
                <button key={c} className={`cat-chip ${activeCat === c ? "active" : ""}`}
                  onClick={() => setActiveCat(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Локальные магазины (если выбран город) */}
          {localStores.length > 0 && activeCat === "Все магазины" && !search && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--wine-light)" }}>
                  <Icon name="MapPin" size={12} style={{ color: "var(--wine)" }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--wine)" }}>
                  Рядом с вами — {city}
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--wine-border)" }} />
              </div>
              <div className="grid grid-cols-1 gap-5">
                {localStores.map((s, i) => (
                  <Storefront key={s.id} store={s} onAddCart={addToCart} cartItems={cartItems}
                    wishlist={wishlist} onWish={toggleWish} delay={i * 0.08} />
                ))}
              </div>
              {STORES.filter(s => !localStores.includes(s)).length > 0 && (
                <div className="flex items-center gap-3 mt-8 mb-4">
                  <span className="text-sm font-semibold" style={{ color: "var(--sub)" }}>Другие магазины платформы</span>
                  <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
                </div>
              )}
            </div>
          )}

          {/* Все витрины */}
          {filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: "var(--sub)" }}>
              <span className="text-4xl block mb-3">🏪</span>
              <div className="font-medium">Магазины не найдены</div>
              <button className="btn-outline-wine mt-4 text-sm" onClick={() => { setSearch(""); setActiveCat("Все магазины"); }}>
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {(localStores.length > 0 && activeCat === "Все магазины" && !search
                ? STORES.filter(s => !localStores.includes(s)).filter(s => filtered.includes(s))
                : filtered
              ).map((s, i) => (
                <Storefront key={s.id} store={s} onAddCart={addToCart} cartItems={cartItems}
                  wishlist={wishlist} onWish={toggleWish} delay={i * 0.07} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── АКЦИИ ── */}
      <section id="sales" className="py-10 px-5" style={{ background: "#fff", borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-6" style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 600, color: "var(--ink)" }}>
            Акции магазинов
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { store: "АромаДом",   discount: "−30%", text: "На все диффузоры", emoji: "🌿", bg: "#FAE8EE", col: "#7B2D42" },
              { store: "Beautylab",  discount: "−25%", text: "Уход за кожей",    emoji: "✨", bg: "#E8F5F0", col: "#2D5A4A" },
              { store: "ДомДекор",   discount: "−20%", text: "Декор и интерьер", emoji: "🏺", bg: "#F5EFE6", col: "#7B5E3A" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-6 border" style={{ background: s.bg, borderColor: `${s.col}22` }}>
                <div className="text-3xl mb-3">{s.emoji}</div>
                <div className="font-bold text-3xl mb-0.5" style={{ fontFamily: "Cormorant, serif", color: s.col }}>{s.discount}</div>
                <div className="font-semibold text-sm mb-1" style={{ color: "var(--ink)" }}>{s.text}</div>
                <div className="text-xs mb-4" style={{ color: "var(--sub)" }}>Магазин «{s.store}»</div>
                <button className="text-xs font-semibold" style={{ color: s.col }}>Смотреть товары →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── О ПРОЕКТЕ ── */}
      <section id="about" className="py-10 px-5" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="mb-4" style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 600, color: "var(--ink)", lineHeight: 1.1 }}>
              Поддержи местный<br /><span style={{ color: "var(--wine)" }}>бизнес</span>
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--sub)" }}>
              «Всети-города» — маркетплейс, где каждый магазин — это реальный человек из вашего города. Покупая здесь, вы поддерживаете местных предпринимателей.
            </p>
            <div className="space-y-3">
              {[
                { icon: "Heart",      t: "Личность продавца",  d: "Каждый магазин — живой бренд" },
                { icon: "MapPin",     t: "Ваш город",          d: "Товары рядом — доставка быстрее" },
                { icon: "Shield",     t: "Гарантия возврата",  d: "Защита каждой покупки" },
                { icon: "Star",       t: "Честные отзывы",     d: "Только от реальных покупателей" },
              ].map((f, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl border bg-white" style={{ borderColor: "var(--line)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--wine-light)", border: "1px solid var(--wine-border)" }}>
                    <Icon name={f.icon} size={16} style={{ color: "var(--wine)" }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{f.t}</div>
                    <div className="text-xs" style={{ color: "var(--sub)" }}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--line)" }}>
            <div className="p-6 text-center" style={{ background: "var(--wine)" }}>
              <div className="text-4xl mb-2">🏪</div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 600, color: "#fff" }}>
                Откройте витрину
              </h3>
              <p className="text-white/70 text-sm mt-1">Расскажите о своём магазине всему городу</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-sm mb-5">
                {[
                  { v: STORES.length, l: "магазинов" },
                  { v: "4.8★",        l: "рейтинг" },
                  { v: "50K+",        l: "товаров" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="font-bold text-lg" style={{ color: "var(--wine)" }}>{s.v}</div>
                    <div className="text-xs" style={{ color: "var(--sub)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <button className="btn-wine w-full mb-3">Стать продавцом</button>
              <button className="btn-outline-wine w-full">Узнать подробнее</button>
              <p className="text-xs text-center mt-3" style={{ color: "var(--sub)" }}>Без абонентской платы · Комиссия с продаж</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── КОНТАКТЫ ── */}
      <section id="contacts" className="py-10 px-5 bg-white" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-6" style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 600, color: "var(--ink)" }}>Контакты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "Phone",  t: "Телефон", v: "+7 (800) 555-35-35", s: "Бесплатно по России" },
              { icon: "Mail",   t: "Email",   v: "hello@vseti.ru",      s: "Ответим за 2 часа" },
              { icon: "MapPin", t: "Офис",    v: "Москва, Тверская, 1", s: "Пн–Пт 9:00–18:00" },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl p-6 border" style={{ borderColor: "var(--line)", background: "var(--cream)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "var(--wine-light)", border: "1px solid var(--wine-border)" }}>
                  <Icon name={c.icon} size={17} style={{ color: "var(--wine)" }} />
                </div>
                <div className="text-xs mb-1" style={{ color: "var(--sub)" }}>{c.t}</div>
                <div className="font-bold" style={{ color: "var(--ink)" }}>{c.v}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--sub)" }}>{c.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-7 px-5" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: 20, fontWeight: 600, color: "var(--wine)" }}>
              Всети-города
            </div>
            {city && (
              <div className="city-chip mt-0.5" style={{ fontSize: 11 }}>
                <Icon name="MapPin" size={10} />{city}
              </div>
            )}
          </div>
          <div className="text-xs" style={{ color: "var(--sub)" }}>© 2024 Всети-города. Сделано с любовью к местному бизнесу.</div>
          <div className="flex gap-5 text-xs" style={{ color: "var(--sub)" }}>
            {["Условия", "Конфиденциальность", "Помощь"].map(l => (
              <button key={l} className="hover:underline">{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
