import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const PRODUCTS = [
  { id: 1, name: "Смартфон X-Vision 12",  price: 24900, oldPrice: 31000, rating: 4.6, reviews: 89,  badge: "−20%",    bColor: "bg-[#FFD600] text-black", emoji: "📱", cat: "Электроника" },
  { id: 2, name: "Кроссовки Urban Pro",   price: 4990,  oldPrice: 7200,  rating: 4.8, reviews: 312, badge: "ХИТ",     bColor: "bg-[#FF5252] text-white", emoji: "👟", cat: "Обувь" },
  { id: 3, name: "Платье Summer Glow",    price: 2490,  oldPrice: null,  rating: 4.9, reviews: 204, badge: "НОВИНКА", bColor: "bg-[#00BFA5] text-white", emoji: "👗", cat: "Одежда" },
  { id: 4, name: "Контроллер Pro X",      price: 6200,  oldPrice: 8500,  rating: 4.7, reviews: 147, badge: "−27%",    bColor: "bg-[#FFD600] text-black", emoji: "🎮", cat: "Игры" },
  { id: 5, name: "Сыворотка Retinol",     price: 2990,  oldPrice: 3900,  rating: 4.8, reviews: 203, badge: "ТОП",     bColor: "bg-[#FF5252] text-white", emoji: "✨", cat: "Красота" },
  { id: 6, name: "Наушники SoundWave X3", price: 8990,  oldPrice: 12000, rating: 4.8, reviews: 376, badge: "−25%",    bColor: "bg-[#00BFA5] text-white", emoji: "🎧", cat: "Электроника" },
];

const CATS = [
  { name: "Электроника", emoji: "📱", count: "760",   cls: "block-yellow" },
  { name: "Одежда",      emoji: "👗", count: "3 870", cls: "block-ink" },
  { name: "Обувь",       emoji: "👟", count: "1 240", cls: "block-teal" },
  { name: "Красота",     emoji: "💄", count: "1 650", cls: "block-coral" },
  { name: "Дом",         emoji: "🏠", count: "2 100", cls: "block-white" },
  { name: "Игры",        emoji: "🎮", count: "560",   cls: "block-ink" },
  { name: "Детям",       emoji: "👶", count: "980",   cls: "block-yellow" },
  { name: "Инструменты", emoji: "🔧", count: "720",   cls: "block-teal" },
];

const NAV = [
  { label: "Главная",    id: "home" },
  { label: "Категории",  id: "categories" },
  { label: "Акции",      id: "sales" },
  { label: "Популярное", id: "popular" },
  { label: "О нас",      id: "about" },
  { label: "Контакты",   id: "contacts" },
];

const TICKER = ["⬛ Доставка за 1 день", "◆ 50 000+ товаров", "◆ Возврат 14 дней", "⬛ Продавцы со всей России", "◆ Рейтинг 4.8 / 5", "◆ Поддержка 24 / 7"];

const CHAT_TIPS = ["Где заказ?", "Возврат", "Стать продавцом", "Рассрочка"];
const BOT: Record<string, string> = {
  "Где заказ?":         "Ваши заказы — Личный кабинет → «Мои заказы».",
  "Возврат":            "Возврат в течение 14 дней через карточку заказа.",
  "Стать продавцом":    "Регистрация бесплатна. Комиссия только с продаж.",
  "Рассрочка":          "Рассрочка 0% от 5 000 ₽ при оформлении.",
};

interface Msg { from: "user" | "bot"; text: string; }

function Stars({ r }: { r: number }) {
  return (
    <span className="text-xs tracking-tight">
      {"★".repeat(Math.round(r))}<span className="text-gray-200">{"★".repeat(5 - Math.round(r))}</span>
    </span>
  );
}

export default function Index() {
  const [activeNav, setActiveNav] = useState("home");
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [wishlist,  setWishlist]  = useState<number[]>([]);
  const [search,    setSearch]    = useState("");
  const [chatOpen,  setChatOpen]  = useState(false);
  const [msgs, setMsgs]           = useState<Msg[]>([{ from: "bot", text: "Здравствуйте. Чем могу помочь?" }]);
  const [input, setInput]         = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const buy     = (id: number) => { if (!cartItems.includes(id)) { setCartItems(p => [...p, id]); setCartCount(c => c + 1); } };
  const heart   = (id: number) => { setWishlist(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]); };
  const goTo    = (id: string) => { setActiveNav(id); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const send    = (t: string)  => {
    setMsgs(p => [...p, { from: "user", text: t }]);
    setTimeout(() => setMsgs(p => [...p, { from: "bot", text: BOT[t] ?? "Уточните вопрос — ответим быстро." }]), 450);
    setInput("");
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F5F5", fontFamily: "'IBM Plex Sans', sans-serif" }}>

      {/* ── TICKER ── */}
      <div className="block-ink overflow-hidden py-2 text-xs select-none" style={{ borderBottom: "1px solid #222" }}>
        <div className="flex w-max ticker-track gap-16">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="whitespace-nowrap font-medium tracking-widest text-white/70">{t}</span>
          ))}
        </div>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white" style={{ borderBottom: "3px solid #0F0F0F" }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">

          {/* Logo */}
          <div className="flex-shrink-0 mr-2">
            <div className="display text-2xl tracking-tight" style={{ fontFamily: "Oswald, sans-serif" }}>ВСЕТИ-ГОРОДА</div>
            <div className="text-[9px] tracking-[0.25em] font-semibold uppercase" style={{ color: "var(--mid)" }}>МАРКЕТПЛЕЙС</div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ПОИСК ТОВАРОВ..."
              className="search-geo w-full pl-11 pr-5 py-2.5 text-sm uppercase tracking-wider"
            />
            <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <Icon name="X" size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2.5 hover:bg-gray-100 transition-colors" style={{ color: "var(--mid)" }}>
              <Icon name="User" size={20} />
            </button>
            <button className="relative p-2.5 hover:bg-gray-100 transition-colors" style={{ color: "var(--mid)" }}>
              <Icon name="Heart" size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-black" style={{ background: "var(--yellow)" }}>
                  {wishlist.length}
                </span>
              )}
            </button>
            <button className="btn-ink flex items-center gap-2">
              <Icon name="ShoppingBag" size={15} className="text-white" />
              КОРЗИНА
              {cartCount > 0 && (
                <span className="font-bold text-[10px] px-1.5 py-0.5 text-black" style={{ background: "var(--yellow)" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="max-w-7xl mx-auto px-6 pb-2.5 flex gap-6 overflow-x-auto border-t border-gray-100">
          {NAV.map(l => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              className={`nav-item py-2 ${activeNav === l.id ? "nav-active" : ""}`}
            >
              {l.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── HERO (асимметричная сетка) ── */}
      <section id="home" className="max-w-7xl mx-auto px-6 py-10">

        {/* Главный заголовок */}
        <div className="grid grid-cols-12 gap-0 mb-0" style={{ border: "3px solid var(--ink)" }}>

          {/* Left — текст */}
          <div className="col-span-12 md:col-span-7 block-white p-10 md:p-14" style={{ borderRight: "3px solid var(--ink)" }}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "var(--mid)" }}>
              Маркетплейс · 50 000+ товаров
            </p>
            <h1 className="display mb-6" style={{ fontSize: "clamp(52px, 7vw, 96px)" }}>
              ИЩИТЕ<br />
              <span style={{ color: "var(--teal)" }}>ВЫГОДНО</span><br />
              ИЩИТЕ<br />
              <span style={{ WebkitTextStroke: "3px var(--ink)", WebkitTextFillColor: "transparent" }}>
                ВСЕТИ-ГОРОДА
              </span>
            </h1>
            <p className="text-sm leading-relaxed mb-8 max-w-sm" style={{ color: "var(--mid)" }}>
              Тысячи товаров от проверенных продавцов по всей стране. Честные цены и быстрая доставка.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-yellow">КАТАЛОГ →</button>
              <button className="btn-outline">СТАТЬ ПРОДАВЦОМ</button>
            </div>
          </div>

          {/* Right — stats */}
          <div className="col-span-12 md:col-span-5 grid grid-cols-2 grid-rows-2">
            {[
              { v: "50K+",  l: "товаров",   cls: "block-yellow" },
              { v: "2400+", l: "продавцов", cls: "block-ink" },
              { v: "4.8★",  l: "рейтинг",  cls: "block-teal" },
              { v: "1 день",l: "доставка",  cls: "block-coral" },
            ].map((s, i) => (
              <div
                key={i}
                className={`${s.cls} flex flex-col items-center justify-center py-10`}
                style={{
                  borderTop: i >= 2 ? "3px solid var(--ink)" : undefined,
                  borderLeft: i % 2 !== 0 ? "3px solid var(--ink)" : undefined,
                }}
              >
                <div className="display text-4xl">{s.v}</div>
                <div className="text-xs uppercase tracking-widest mt-1 opacity-70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex items-end justify-between mb-5">
          <h2 className="display text-4xl">КАТЕГОРИИ</h2>
          <button className="nav-item flex items-center gap-1">ВСЕ <Icon name="ArrowRight" size={14} /></button>
        </div>
        <hr className="thick-rule mb-5" />

        {/* 8-col grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-0" style={{ border: "3px solid var(--ink)" }}>
          {CATS.map((cat, i) => (
            <button
              key={i}
              className={`${cat.cls} flex flex-col items-center justify-center gap-2 py-8 transition-all hover:brightness-95`}
              style={{
                borderRight: i < CATS.length - 1 ? "3px solid var(--ink)" : undefined,
                minHeight: 110,
              }}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="display text-sm uppercase tracking-wide">{cat.name}</span>
              <span className="text-[10px] opacity-60 font-medium">{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── SALES ── */}
      <section id="sales" className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex items-end justify-between mb-5">
          <h2 className="display text-4xl">АКЦИИ</h2>
          <button className="nav-item flex items-center gap-1">ВСЕ <Icon name="ArrowRight" size={14} /></button>
        </div>
        <hr className="thick-rule mb-5" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ border: "3px solid var(--ink)" }}>
          {[
            { title: "ЭЛЕКТРОНИКА", discount: "до 40%", ends: "2 дня",  cls: "block-yellow", accentCls: "text-black" },
            { title: "ОДЕЖДА",      discount: "до 60%", ends: "5 дней", cls: "block-teal",   accentCls: "text-white" },
            { title: "ДОМ И САД",   discount: "до 35%", ends: "3 дня",  cls: "block-coral",  accentCls: "text-white" },
          ].map((s, i) => (
            <div
              key={i}
              className={`${s.cls} p-8`}
              style={{ borderRight: i < 2 ? "3px solid var(--ink)" : undefined }}
            >
              <div className="display text-5xl mb-1">{s.discount}</div>
              <div className="display text-xl mb-1">{s.title}</div>
              <div className="text-xs uppercase tracking-widest mb-6 opacity-60">Осталось {s.ends}</div>
              <button
                className="border-2 font-bold uppercase tracking-widest text-xs py-2.5 px-6 transition-all hover:bg-black hover:text-white hover:border-black"
                style={{ borderColor: "currentColor" }}
              >
                Смотреть →
              </button>
            </div>
          ))}
        </div>

        {/* Wide banner */}
        <div className="block-ink mt-0 px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderLeft: "3px solid var(--ink)", borderRight: "3px solid var(--ink)", borderBottom: "3px solid var(--ink)" }}>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: "var(--mid)" }}>МЕГАРАСПРОДАЖА</div>
            <div className="display text-5xl text-white">ДО <span style={{ color: "var(--yellow)" }}>70%</span> НА ВСЁ</div>
          </div>
          <button className="btn-yellow shrink-0 text-base px-10 py-4">ПЕРЕЙТИ →</button>
        </div>
      </section>

      {/* ── POPULAR ── */}
      <section id="popular" className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex items-end justify-between mb-5">
          <h2 className="display text-4xl">ПОПУЛЯРНОЕ</h2>
          <div className="flex gap-2">
            {["РЕЙТИНГ", "ЦЕНА↑", "ЦЕНА↓"].map(f => (
              <button key={f} className="btn-outline py-1.5 px-4 text-[10px]">{f}</button>
            ))}
          </div>
        </div>
        <hr className="thick-rule mb-5" />

        {/* Cards: first 2 big, rest normal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "3px solid var(--ink)" }}>

          {/* Big featured */}
          {PRODUCTS.slice(0, 2).map((p, i) => (
            <div
              key={p.id}
              className={`geo-card ${i === 0 ? "geo-card-teal" : "geo-card-coral"} flex flex-col`}
              style={{ borderRight: i === 0 ? "3px solid var(--ink)" : undefined, minHeight: 340 }}
            >
              {/* Image */}
              <div className="relative h-52 flex items-center justify-center"
                style={{ background: i === 0 ? "#e8faf7" : "#fff0f0", borderBottom: "3px solid var(--ink)" }}>
                <span className="text-8xl">{p.emoji}</span>
                <span className={`badge-geo absolute top-4 left-4 ${p.bColor}`}>{p.badge}</span>
                <button onClick={() => heart(p.id)} className="absolute top-4 right-4 w-9 h-9 bg-white border-2 border-black flex items-center justify-center hover:bg-yellow-400 transition-colors">
                  <span className="text-sm">{wishlist.includes(p.id) ? "♥" : "♡"}</span>
                </button>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--mid)" }}>{p.cat}</div>
                  <h3 className="display text-2xl mb-2">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-0">
                    <Stars r={p.rating} />
                    <span className="text-xs font-semibold">{p.rating}</span>
                    <span className="text-xs" style={{ color: "var(--mid)" }}>({p.reviews})</span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4 pt-4" style={{ borderTop: "1px solid #eee" }}>
                  <div>
                    <div className="display text-3xl">{p.price.toLocaleString("ru-RU")} ₽</div>
                    {p.oldPrice && <div className="text-xs line-through" style={{ color: "var(--mid)" }}>{p.oldPrice.toLocaleString("ru-RU")} ₽</div>}
                  </div>
                  <button
                    onClick={() => buy(p.id)}
                    className={cartItems.includes(p.id) ? "btn-outline py-2 px-5" : "btn-yellow py-2 px-5"}
                  >
                    {cartItems.includes(p.id) ? "✓ В КОРЗИНЕ" : "В КОРЗИНУ"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4 normal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0"
          style={{ borderLeft: "3px solid var(--ink)", borderRight: "3px solid var(--ink)", borderBottom: "3px solid var(--ink)" }}>
          {PRODUCTS.slice(2).map((p, i) => (
            <div
              key={p.id}
              className="geo-card"
              style={{
                borderRight: i < 3 ? "3px solid var(--ink)" : undefined,
                borderTop: "3px solid var(--ink)",
              }}
            >
              <div className="relative h-36 flex items-center justify-center" style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}>
                <span className="text-5xl">{p.emoji}</span>
                <span className={`badge-geo absolute top-2.5 left-2.5 ${p.bColor}`}>{p.badge}</span>
                <button onClick={() => heart(p.id)} className="absolute top-2 right-2 text-sm"
                  style={{ color: wishlist.includes(p.id) ? "#FF5252" : "#ccc" }}>
                  {wishlist.includes(p.id) ? "♥" : "♡"}
                </button>
              </div>
              <div className="p-4">
                <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--mid)" }}>{p.cat}</div>
                <h3 className="display text-base mb-2 leading-tight">{p.name}</h3>
                <Stars r={p.rating} />
                <div className="flex items-end justify-between mt-3">
                  <div>
                    <div className="display text-xl">{p.price.toLocaleString("ru-RU")} ₽</div>
                    {p.oldPrice && <div className="text-[10px] line-through" style={{ color: "var(--mid)" }}>{p.oldPrice.toLocaleString("ru-RU")} ₽</div>}
                  </div>
                  <button
                    onClick={() => buy(p.id)}
                    className={`text-[10px] px-3 py-2 font-bold uppercase tracking-wide transition-all ${cartItems.includes(p.id) ? "btn-outline" : "btn-yellow"}`}
                  >
                    {cartItems.includes(p.id) ? "✓" : "+ КУПИТЬ"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="max-w-7xl mx-auto px-6 pb-10">
        <hr className="thick-rule mb-5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "3px solid var(--ink)" }}>
          <div className="block-ink p-10 md:p-12" style={{ borderRight: "3px solid var(--ink)" }}>
            <div className="text-xs uppercase tracking-[0.2em] mb-5" style={{ color: "var(--mid)" }}>О ПЛАТФОРМЕ</div>
            <h2 className="display text-5xl text-white mb-4">
              ПОРЯДОК.<br />
              <span style={{ color: "var(--yellow)" }}>СТРУКТУРА.</span><br />
              СТИЛЬ.
            </h2>
            <p className="text-sm leading-relaxed mb-8 text-white/60">
              «Всети-города» — маркетплейс для тех, кто ценит порядок. Только проверенные продавцы, прозрачные цены, реальные отзывы.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "Shield",     title: "ЗАЩИТА",       col: "var(--yellow)" },
                { icon: "Zap",        title: "СКОРОСТЬ",     col: "var(--teal)" },
                { icon: "Truck",      title: "ДОСТАВКА",     col: "var(--coral)" },
                { icon: "Star",       title: "ЧЕСТНО",       col: "var(--yellow)" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Icon name={f.icon} size={18} style={{ color: f.col }} />
                  <span className="display text-sm text-white">{f.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {/* Reviews */}
            <div className="p-8 block-white" style={{ borderBottom: "3px solid var(--ink)" }}>
              <div className="flex items-baseline gap-3 mb-5">
                <span className="display text-5xl">4.8</span>
                <span className="text-xl" style={{ color: "#FFD600" }}>★★★★★</span>
                <span className="text-sm" style={{ color: "var(--mid)" }}>1 200+ отзывов</span>
              </div>
              {[
                { author: "Анна К.",     r: 5, text: "Заказала кроссовки — пришли быстро, качество отличное!", av: "АК" },
                { author: "Максим В.",   r: 4, text: "Смартфон как на фото. Доставка 2 дня.",                 av: "МВ" },
              ].map((rv, i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <div className="w-9 h-9 block-ink flex items-center justify-center text-xs font-bold shrink-0 text-white">{rv.av}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="display text-sm">{rv.author}</span>
                      <Stars r={rv.r} />
                    </div>
                    <p className="text-xs" style={{ color: "var(--mid)" }}>{rv.text}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* CTA */}
            <div className="block-yellow p-8">
              <div className="display text-3xl mb-2">СТАНЬ ПРОДАВЦОМ</div>
              <p className="text-xs mb-5" style={{ color: "rgba(0,0,0,0.55)" }}>Без абонентской платы. Комиссия только с продаж.</p>
              <button className="btn-ink w-full py-3.5">ЗАРЕГИСТРИРОВАТЬСЯ →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACTS ── */}
      <section id="contacts" className="max-w-7xl mx-auto px-6 pb-10">
        <hr className="thick-rule mb-5" />
        <h2 className="display text-4xl mb-5">КОНТАКТЫ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ border: "3px solid var(--ink)" }}>
          {[
            { icon: "Phone",  title: "ТЕЛЕФОН", value: "+7 (800) 555-35-35", sub: "Бесплатно",   cls: "block-white" },
            { icon: "Mail",   title: "EMAIL",   value: "hello@vseti.ru",      sub: "За 2 часа",   cls: "block-teal" },
            { icon: "MapPin", title: "ОФИС",    value: "Москва, Тверская, 1", sub: "Пн–Пт 9–18", cls: "block-yellow" },
          ].map((c, i) => (
            <div key={i} className={`${c.cls} p-8`} style={{ borderRight: i < 2 ? "3px solid var(--ink)" : undefined }}>
              <Icon name={c.icon} size={22} className="mb-4" />
              <div className="display text-xs mb-1 opacity-60">{c.title}</div>
              <div className="display text-xl mb-0.5">{c.value}</div>
              <div className="text-xs opacity-60">{c.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="block-ink" style={{ borderTop: "3px solid var(--ink)" }}>
        <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="display text-xl text-white tracking-tight">ВСЕТИ-ГОРОДА</div>
          <div className="text-xs tracking-widest uppercase" style={{ color: "var(--mid)" }}>© 2024 ВСЕ ПРАВА ЗАЩИЩЕНЫ</div>
          <div className="flex gap-6 text-xs uppercase tracking-widest" style={{ color: "var(--mid)" }}>
            {["Условия", "Конфиденциальность", "Помощь"].map(l => (
              <button key={l} className="hover:text-white transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </footer>

      {/* ── CHATBOT ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="chat-in w-80 bg-white" style={{ border: "3px solid var(--ink)", boxShadow: "6px 6px 0 var(--yellow)" }}>
            <div className="flex items-center gap-3 px-4 py-3 block-ink" style={{ borderBottom: "3px solid var(--ink)" }}>
              <div className="w-8 h-8 block-yellow flex items-center justify-center">
                <Icon name="Bot" size={15} className="text-black" />
              </div>
              <div>
                <div className="display text-sm text-white">ПОМОЩНИК</div>
                <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--teal)" }}>● ОНЛАЙН</div>
              </div>
              <button onClick={() => setChatOpen(false)} className="ml-auto text-white/60 hover:text-white">
                <Icon name="X" size={15} />
              </button>
            </div>
            <div className="h-52 overflow-y-auto p-4 flex flex-col gap-2 bg-[#fafafa]">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="text-xs px-3 py-2 max-w-[80%] leading-relaxed"
                    style={
                      m.from === "user"
                        ? { background: "var(--ink)", color: "#fff" }
                        : { background: "#fff", border: "2px solid var(--ink)", color: "var(--ink)" }
                    }
                  >{m.text}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="px-3 py-2 flex flex-wrap gap-1.5 bg-white" style={{ borderTop: "2px solid #eee" }}>
              {CHAT_TIPS.map(t => (
                <button
                  key={t}
                  onClick={() => send(t)}
                  className="text-[10px] px-2.5 py-1 font-bold uppercase tracking-wider border-2 border-black hover:bg-yellow-400 transition-colors"
                >{t}</button>
              ))}
            </div>
            <div className="flex gap-2 p-3 bg-white" style={{ borderTop: "2px solid #eee" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && input.trim() && send(input.trim())}
                placeholder="НАПИСАТЬ..."
                className="flex-1 text-xs px-3 py-2 uppercase tracking-wider focus:outline-none border-2 border-black"
              />
              <button onClick={() => input.trim() && send(input.trim())} className="btn-ink px-3 py-2">
                <Icon name="Send" size={13} className="text-white" />
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setChatOpen(o => !o)}
          className="w-14 h-14 block-ink flex items-center justify-center transition-all hover:-translate-y-1"
          style={{ border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--yellow)" }}
        >
          <Icon name={chatOpen ? "X" : "MessageSquare"} size={22} className="text-white" />
        </button>
      </div>
    </div>
  );
}
