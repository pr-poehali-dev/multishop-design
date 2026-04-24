import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

/* ── Данные ── */
const CITIES = [
  "Москва", "Санкт-Петербург", "Казань", "Новосибирск", "Екатеринбург",
  "Нижний Новгород", "Краснодар", "Самара", "Ростов-на-Дону", "Уфа",
  "Пермь", "Воронеж", "Омск", "Челябинск", "Владивосток",
];

const CATS = [
  "Все", "Дом и сад", "Красота", "Электроника", "Одежда", "Детям", "Спорт", "Еда",
];

const SELLERS = [
  { id: "s1", name: "АромаДом",    emoji: "🕯",  city: "Москва",          rating: 4.9, sales: 1240, desc: "Натуральные аромасвечи и диффузоры ручной работы" },
  { id: "s2", name: "Beautylab",   emoji: "✨",  city: "Санкт-Петербург", rating: 4.8, sales: 890,  desc: "Профессиональный уход за кожей" },
  { id: "s3", name: "ДомДекор",    emoji: "🏺",  city: "Казань",          rating: 4.7, sales: 654,  desc: "Декор и интерьерные аксессуары" },
  { id: "s4", name: "КухняПро",    emoji: "☕",  city: "Москва",          rating: 4.6, sales: 2100, desc: "Посуда и товары для кухни" },
  { id: "s5", name: "СпортМаркет", emoji: "👟",  city: "Екатеринбург",    rating: 4.9, sales: 3200, desc: "Спортивная одежда и инвентарь" },
  { id: "s6", name: "ДетскийМир",  emoji: "🧩",  city: "Новосибирск",     rating: 4.8, sales: 760,  desc: "Игрушки и товары для детей" },
];

const PRODUCTS = [
  { id: 1,  name: "Диффузор «Лаванда»",  price: 1490, oldPrice: 2100, rating: 4.8, reviews: 312, sellerId: "s1", badge: "−29%", cat: "Дом и сад",    emoji: "🕯" },
  { id: 2,  name: "Крем-флюид Glow",     price: 2290, oldPrice: 3200, rating: 4.9, reviews: 521, sellerId: "s2", badge: "ТОП",  cat: "Красота",      emoji: "💆" },
  { id: 3,  name: "Ваза Marble Grey",    price: 3490, oldPrice: 4800, rating: 4.6, reviews: 147, sellerId: "s3", badge: "−27%", cat: "Дом и сад",    emoji: "🏺" },
  { id: 4,  name: "Термокружка Pastel",  price: 1190, oldPrice: null, rating: 4.5, reviews: 376, sellerId: "s4", badge: null,   cat: "Еда",          emoji: "☕" },
  { id: 5,  name: "Кроссовки Urban Pro", price: 4990, oldPrice: 7200, rating: 4.8, reviews: 891, sellerId: "s5", badge: "ХИТ",  cat: "Спорт",        emoji: "👟" },
  { id: 6,  name: "Конструктор Blocks+", price: 1890, oldPrice: null, rating: 4.7, reviews: 89,  sellerId: "s6", badge: "NEW",  cat: "Детям",        emoji: "🧩" },
  { id: 7,  name: "Свеча «Ваниль»",      price: 890,  oldPrice: 1200, rating: 4.7, reviews: 204, sellerId: "s1", badge: "−26%", cat: "Дом и сад",    emoji: "🕯" },
  { id: 8,  name: "Сыворотка Retinol",   price: 2990, oldPrice: 3900, rating: 4.8, reviews: 203, sellerId: "s2", badge: "−23%", cat: "Красота",      emoji: "✨" },
  { id: 9,  name: "Органайзер Desk",     price: 1590, oldPrice: null, rating: 4.5, reviews: 67,  sellerId: "s3", badge: null,   cat: "Дом и сад",    emoji: "📦" },
  { id: 10, name: "Смартфон X-Vision",   price: 24900,oldPrice:31000, rating: 4.6, reviews: 89,  sellerId: "s5", badge: "−20%", cat: "Электроника",  emoji: "📱" },
  { id: 11, name: "Набор LEGO City",     price: 3290, oldPrice: null, rating: 4.9, reviews: 412, sellerId: "s6", badge: "NEW",  cat: "Детям",        emoji: "🏗" },
  { id: 12, name: "Платье Summer Glow",  price: 2490, oldPrice: null, rating: 4.9, reviews: 204, sellerId: "s2", badge: null,   cat: "Одежда",       emoji: "👗" },
];

/* ── Helpers ── */
function Stars({ r, size = 12 }: { r: number; size?: number }) {
  return (
    <span style={{ fontSize: size, lineHeight: 1 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(r) ? "#F59E0B" : "#D1D5DB" }}>★</span>
      ))}
    </span>
  );
}

/* ── City Modal ── */
function CityModal({ onSelect }: { onSelect: (c: string) => void }) {
  const [q, setQ] = useState("");
  const filtered = CITIES.filter(c => c.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="modal-overlay">
      <div className="modal-box p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--em-light)", border: "1.5px solid var(--em-border)" }}>
            <Icon name="MapPin" size={18} style={{ color: "var(--em)" }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--ink)" }}>Выберите ваш город</h2>
            <p className="text-sm" style={{ color: "var(--sub)" }}>Это поможет показать актуальные предложения</p>
          </div>
        </div>

        <div className="relative mt-5 mb-4">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Найти город..."
            className="search-em w-full pl-9 pr-4 py-2.5"
            autoFocus
          />
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--sub)" }} />
        </div>

        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
          {filtered.map(city => (
            <button key={city} className="city-btn" onClick={() => onSelect(city)}>
              {city}
            </button>
          ))}
        </div>

        <p className="text-xs mt-4 text-center" style={{ color: "var(--sub)" }}>
          Можно изменить в любой момент в шапке сайта
        </p>
      </div>
    </div>
  );
}

/* ── Seller Page ── */
function SellerPage({ sellerId, onClose }: { sellerId: string; onClose: () => void }) {
  const seller = SELLERS.find(s => s.id === sellerId)!;
  const goods  = PRODUCTS.filter(p => p.sellerId === sellerId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b" style={{ borderColor: "var(--line)" }}>
          <div className="seller-avatar text-3xl">{seller.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-xl font-bold">{seller.name}</h2>
              <span className="badge-em">Продавец</span>
            </div>
            <p className="text-sm mb-2" style={{ color: "var(--sub)" }}>{seller.desc}</p>
            <div className="flex items-center gap-4 text-sm" style={{ color: "var(--sub)" }}>
              <span className="flex items-center gap-1"><Icon name="MapPin" size={13} /> {seller.city}</span>
              <span className="flex items-center gap-1"><Stars r={seller.rating} /> {seller.rating}</span>
              <span>{seller.sales.toLocaleString("ru-RU")} продаж</span>
            </div>
          </div>
          <button className="btn-ghost p-2" onClick={onClose}>
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Products */}
        <div className="p-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--sub)" }}>ВИТРИНА · {goods.length} товаров</h3>
          <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
            {goods.map(p => (
              <div key={p.id} className="p-card">
                <div className="h-24 flex items-center justify-center text-4xl" style={{ background: "var(--bg-off)" }}>
                  {p.emoji}
                </div>
                <div className="p-3">
                  <div className="text-xs font-medium leading-tight mb-1" style={{ color: "var(--ink)" }}>{p.name}</div>
                  <div className="font-bold text-sm" style={{ color: "var(--em)" }}>{p.price.toLocaleString("ru-RU")} ₽</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          <button className="btn-em w-full">Подписаться на продавца</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function Index() {
  const [city,       setCity]       = useState<string | null>(null);
  const [showCity,   setShowCity]   = useState(true);
  const [activeCat,  setActiveCat]  = useState("Все");
  const [activeNav,  setActiveNav]  = useState("home");
  const [search,     setSearch]     = useState("");
  const [cartItems,  setCartItems]  = useState<number[]>([]);
  const [wishlist,   setWishlist]   = useState<number[]>([]);
  const [sellerPage, setSellerPage] = useState<string | null>(null);
  const [tab,        setTab]        = useState("popular");

  useEffect(() => {
    const saved = localStorage.getItem("vseti_city");
    if (saved) { setCity(saved); setShowCity(false); }
  }, []);

  const selectCity = (c: string) => {
    setCity(c);
    setShowCity(false);
    localStorage.setItem("vseti_city", c);
  };

  const addToCart = (id: number) => {
    if (!cartItems.includes(id)) setCartItems(p => [...p, id]);
  };

  const toggleWish = (id: number) => {
    setWishlist(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  };

  const scrollTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const displayed = PRODUCTS.filter(p => {
    const catOk  = activeCat === "Все" || p.cat === activeCat;
    const srchOk = p.name.toLowerCase().includes(search.toLowerCase());
    return catOk && srchOk;
  });

  const seller = (id: string) => SELLERS.find(s => s.id === id)!;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", fontFamily: "'Inter', sans-serif" }}>

      {/* ── City Modal ── */}
      {showCity && <CityModal onSelect={selectCity} />}

      {/* ── Seller Modal ── */}
      {sellerPage && <SellerPage sellerId={sellerPage} onClose={() => setSellerPage(null)} />}

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-4">

          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="font-bold text-base tracking-tight" style={{ color: "var(--ink)" }}>Всети-города</div>
          </div>

          {/* City chip */}
          {city && (
            <button className="city-chip flex-shrink-0" onClick={() => setShowCity(true)}>
              <Icon name="MapPin" size={14} />
              {city}
              <Icon name="ChevronDown" size={12} />
            </button>
          )}

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск товаров..."
              className="search-em w-full pl-9 pr-4 py-2"
            />
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--sub)" }} />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button className="btn-ghost flex items-center gap-1.5">
              <Icon name="User" size={16} />
              <span className="hidden sm:inline text-sm">Войти</span>
            </button>
            <button className="btn-ghost relative flex items-center gap-1.5">
              <Icon name="Heart" size={16} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: "var(--em)" }}>
                  {wishlist.length}
                </span>
              )}
            </button>
            <button className="btn-em flex items-center gap-2 ml-1">
              <Icon name="ShoppingBag" size={15} className="text-white" />
              <span className="hidden sm:inline">Корзина</span>
              {cartItems.length > 0 && (
                <span className="font-bold text-[11px] bg-white rounded-full w-5 h-5 flex items-center justify-center" style={{ color: "var(--em)" }}>
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="max-w-6xl mx-auto px-5 flex gap-6 overflow-x-auto" style={{ borderTop: "1px solid var(--line)" }}>
          {[
            { label: "Главная",    id: "home" },
            { label: "Каталог",    id: "catalog" },
            { label: "Акции",      id: "sales" },
            { label: "Продавцы",   id: "sellers" },
            { label: "О нас",      id: "about" },
          ].map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className={`nav-link ${activeNav === l.id ? "active" : ""}`}
            >
              {l.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── HERO ── */}
      <section id="home" className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-6xl mx-auto px-5 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="fade-in">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--em)" }}>
              Маркетплейс · {city ?? "Выберите город"}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4" style={{ color: "var(--ink)" }}>
              Лучшие товары<br />
              <span style={{ color: "var(--em)" }}>рядом с вами</span>
            </h1>
            <p className="text-sm leading-relaxed mb-7 max-w-md" style={{ color: "var(--sub)" }}>
              50 000+ товаров от проверенных продавцов. Честные отзывы, прозрачные цены, доставка за 1 день.
            </p>
            <div className="flex gap-3">
              <button className="btn-em" onClick={() => scrollTo("catalog")}>Смотреть каталог</button>
              <button className="btn-outline-em" onClick={() => setShowCity(true)}>
                <Icon name="MapPin" size={14} className="inline mr-1.5" />
                {city ?? "Выбрать город"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 shrink-0 fade-in">
            {[
              { v: "50 000+", l: "товаров" },
              { v: "2 400+",  l: "продавцов" },
              { v: "4.8 ★",   l: "рейтинг" },
              { v: "1 день",  l: "доставка" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl px-6 py-5 text-center" style={{ border: "1px solid var(--line)" }}>
                <div className="text-2xl font-bold mb-0.5" style={{ color: "var(--em)" }}>{s.v}</div>
                <div className="text-xs" style={{ color: "var(--sub)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATALOG ── */}
      <section id="catalog" className="py-10 px-5">
        <div className="max-w-6xl mx-auto">

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className="text-xs font-semibold px-4 py-2 rounded-full border transition-all"
                style={activeCat === c
                  ? { background: "var(--em)", color: "#fff", borderColor: "var(--em)" }
                  : { background: "#fff", color: "var(--sub)", borderColor: "var(--line)" }
                }
              >
                {c}
              </button>
            ))}
          </div>

          {/* Tabs: popular / new / sale */}
          <div className="flex gap-6 border-b mb-6" style={{ borderColor: "var(--line)" }}>
            {[
              { id: "popular", label: "Популярное" },
              { id: "new",     label: "Новинки" },
              { id: "sale",    label: "Со скидкой" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`tab-btn ${tab === t.id ? "active" : ""}`}
              >
                {t.label}
              </button>
            ))}
            <span className="ml-auto text-xs self-center" style={{ color: "var(--sub)" }}>
              {displayed.length} товаров
            </span>
          </div>

          {/* Grid */}
          {displayed.length === 0 ? (
            <div className="text-center py-20" style={{ color: "var(--sub)" }}>
              <Icon name="Search" size={32} className="mx-auto mb-3 opacity-30" />
              <div className="font-medium">Ничего не найдено</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 fade-in">
              {displayed.map(p => (
                <div key={p.id} className="p-card group">
                  {/* Photo */}
                  <div className="relative h-48 flex items-center justify-center" style={{ background: "var(--bg-off)" }}>
                    <span className="text-6xl">{p.emoji}</span>

                    {p.badge && (
                      <span className={`absolute top-2.5 left-2.5 ${p.badge === "ТОП" || p.badge === "ХИТ" ? "badge-dark" : "badge-em"}`}>
                        {p.badge}
                      </span>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); toggleWish(p.id); }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border"
                      style={{ borderColor: "var(--line)", color: wishlist.includes(p.id) ? "var(--em)" : "#ccc" }}
                    >
                      <span className="text-sm">{wishlist.includes(p.id) ? "♥" : "♡"}</span>
                    </button>

                    {/* Rating в углу */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 rounded px-1.5 py-0.5 shadow-sm">
                      <Stars r={p.rating} size={10} />
                      <span className="text-[10px] font-semibold" style={{ color: "var(--ink)" }}>{p.rating}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold leading-snug mb-1" style={{ color: "var(--ink)" }}>{p.name}</h3>

                    {/* Seller — кликабельный */}
                    <button
                      className="text-xs mb-3 hover:underline transition-colors"
                      style={{ color: "var(--em)" }}
                      onClick={() => setSellerPage(p.sellerId)}
                    >
                      {seller(p.sellerId).name}
                    </button>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="font-bold text-base" style={{ color: "var(--ink)" }}>
                          {p.price.toLocaleString("ru-RU")} ₽
                        </div>
                        {p.oldPrice && (
                          <div className="text-xs line-through" style={{ color: "var(--sub)" }}>
                            {p.oldPrice.toLocaleString("ru-RU")} ₽
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(p.id)}
                        className={`text-xs font-semibold px-3.5 py-2 rounded-md transition-all ${cartItems.includes(p.id) ? "btn-outline-em" : "btn-em-sm"}`}
                      >
                        {cartItems.includes(p.id) ? "✓" : "Купить"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SALES ── */}
      <section id="sales" className="py-10 px-5 border-t" style={{ borderColor: "var(--line)", background: "var(--bg-off)" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--ink)" }}>Акции</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Красота и уход",  discount: "до 40%", ends: "2 дня",  bg: "var(--em-light)", border: "var(--em-border)", col: "var(--em)" },
              { title: "Дом и декор",     discount: "до 55%", ends: "5 дней", bg: "#FEF9E7",         border: "#F0C040",          col: "#B8860B" },
              { title: "Детские товары",  discount: "до 35%", ends: "3 дня",  bg: "#F3F0FF",         border: "#C4B5FD",          col: "#7C3AED" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-6 border" style={{ background: s.bg, borderColor: s.border }}>
                <div className="text-2xl font-bold mb-1" style={{ color: s.col }}>{s.discount}</div>
                <div className="font-semibold text-sm mb-1" style={{ color: "var(--ink)" }}>{s.title}</div>
                <div className="text-xs mb-4" style={{ color: "var(--sub)" }}>Осталось {s.ends}</div>
                <button className="text-xs font-semibold" style={{ color: s.col }}>Смотреть товары →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELLERS ── */}
      <section id="sellers" className="py-10 px-5 border-t" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>Продавцы</h2>
            <span className="text-xs" style={{ color: "var(--sub)" }}>{SELLERS.length} продавцов</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SELLERS.map(s => (
              <button
                key={s.id}
                className="p-card p-4 flex flex-col items-center gap-2 text-center"
                onClick={() => setSellerPage(s.id)}
              >
                <div className="seller-avatar text-2xl">{s.emoji}</div>
                <div className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{s.name}</div>
                <div className="flex items-center gap-1">
                  <Stars r={s.rating} size={10} />
                  <span className="text-[10px]" style={{ color: "var(--sub)" }}>{s.rating}</span>
                </div>
                <div className="text-[10px]" style={{ color: "var(--sub)" }}>{s.sales.toLocaleString("ru-RU")} продаж</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-10 px-5 border-t" style={{ borderColor: "var(--line)", background: "var(--bg-off)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--em)" }}>О платформе</p>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--ink)" }}>Всети-города</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--sub)" }}>
              Маркетплейс для тех, кто ценит порядок и прозрачность. Только проверенные продавцы, реальные отзывы и честные цены — в строгой, выверенной сетке.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "Shield",     t: "Защита покупателя",  d: "Гарантия возврата" },
                { icon: "Star",       t: "Честные отзывы",     d: "От реальных покупок" },
                { icon: "Truck",      t: "Доставка 1 день",    d: "По всей России" },
                { icon: "Headphones", t: "Поддержка 24/7",     d: "Всегда на связи" },
              ].map((f, i) => (
                <div key={i} className="flex gap-3 items-start p-4 bg-white rounded-xl border" style={{ borderColor: "var(--line)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--em-light)", border: "1px solid var(--em-border)" }}>
                    <Icon name={f.icon} size={15} style={{ color: "var(--em)" }} />
                  </div>
                  <div>
                    <div className="font-semibold text-xs" style={{ color: "var(--ink)" }}>{f.t}</div>
                    <div className="text-xs" style={{ color: "var(--sub)" }}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-7 text-center" style={{ borderColor: "var(--line)" }}>
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: "var(--em-light)", border: "1.5px solid var(--em-border)" }}>
              <Icon name="Store" size={26} style={{ color: "var(--em)" }} fallback="ShoppingBag" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--ink)" }}>Стать продавцом</h3>
            <p className="text-sm mb-6" style={{ color: "var(--sub)" }}>
              Разместите товары и начните продавать. Регистрация бесплатна — комиссия только с продаж.
            </p>
            <button className="btn-em w-full">Зарегистрироваться</button>
            <div className="mt-3 text-xs" style={{ color: "var(--sub)" }}>Уже {SELLERS.length} продавцов на платформе</div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-7 px-5 border-t" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm" style={{ color: "var(--ink)" }}>Всети-города</div>
            {city && <div className="text-xs mt-0.5 city-chip"><Icon name="MapPin" size={11} />{city}</div>}
          </div>
          <div className="text-xs" style={{ color: "var(--sub)" }}>© 2024 Всети-города. Все права защищены.</div>
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
