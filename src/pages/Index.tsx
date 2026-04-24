import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/ced8c987-a177-43ce-b6ad-264704bf2b5f/files/b0b73554-a6ae-43a2-ba33-a0129089ae22.jpg";

const NAV_LINKS = [
  { label: "Главная",    id: "home" },
  { label: "Категории",  id: "categories" },
  { label: "Акции",      id: "sales" },
  { label: "Популярное", id: "popular" },
  { label: "О нас",      id: "about" },
  { label: "Контакты",   id: "contacts" },
];

const CATEGORIES = [
  { emoji: "🏠", name: "Дом",         count: "2 100", grad: "from-[#A8E6CF] to-[#74C0FC]" },
  { emoji: "💄", name: "Красота",     count: "1 650", grad: "from-[#FFB347] to-[#FF7EB3]" },
  { emoji: "👶", name: "Детям",       count: "980",   grad: "from-[#C084FC] to-[#74C0FC]" },
  { emoji: "👗", name: "Одежда",      count: "3 870", grad: "from-[#FF7EB3] to-[#FFB347]" },
  { emoji: "📱", name: "Гаджеты",    count: "760",   grad: "from-[#74C0FC] to-[#C084FC]" },
  { emoji: "🌿", name: "Растения",   count: "430",   grad: "from-[#A8E6CF] to-[#C084FC]" },
  { emoji: "🍽", name: "Кухня",      count: "1 200", grad: "from-[#FFB347] to-[#A8E6CF]" },
  { emoji: "🛁", name: "Ванная",     count: "640",   grad: "from-[#74C0FC] to-[#FF7EB3]" },
];

const PRODUCTS = [
  { id: 1, name: "Диффузор «Лаванда»",  price: 1490, oldPrice: 2100, rating: 4.8, reviews: 312, badge: "ХИТ",     badgeType: "mint",  emoji: "🕯",  seller: "АромаДом" },
  { id: 2, name: "Крем-флюид Glow",     price: 2290, oldPrice: 3200, rating: 4.9, reviews: 521, badge: "−28%",   badgeType: "rose",  emoji: "💆",  seller: "БьютиМир" },
  { id: 3, name: "Конструктор Blocks+", price: 1890, oldPrice: null, rating: 4.7, reviews: 89,  badge: "НОВИНКА", badgeType: "lav",   emoji: "🧩",  seller: "ДетскийМир" },
  { id: 4, name: "Ваза Marble Grey",    price: 3490, oldPrice: 4800, rating: 4.6, reviews: 147, badge: "−27%",   badgeType: "mint",  emoji: "🏺",  seller: "ДомДекор" },
  { id: 5, name: "Сыворотка Retinol",   price: 2990, oldPrice: 3900, rating: 4.8, reviews: 203, badge: "ТОП",    badgeType: "rose",  emoji: "✨",  seller: "Beautylab" },
  { id: 6, name: "Термокружка Pastel",  price: 1190, oldPrice: 1600, rating: 4.5, reviews: 376, badge: "−25%",   badgeType: "lav",   emoji: "☕",  seller: "КухняПро" },
];

const CHAT_TIPS = ["Где мои заказы?", "Как вернуть товар?", "Стать продавцом", "Есть рассрочка?"];
const BOT_REPLIES: Record<string, string> = {
  "Где мои заказы?":   "Ваши заказы — в Личном кабинете → «Мои заказы» 🛍",
  "Как вернуть товар?":"Возврат в течение 14 дней прямо в карточке заказа ✅",
  "Стать продавцом":   "Регистрация бесплатна, комиссия только с продаж 🌟",
  "Есть рассрочка?":   "Рассрочка 0% от 5 000 ₽ при оформлении заказа 💳",
};

interface ChatMsg { from: "user" | "bot"; text: string; }

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-xs">
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#FFB347" : "#ddd" }}>★</span>
      ))}
    </span>
  );
}

export default function Index() {
  const [activeNav, setActiveNav]   = useState("home");
  const [activeCat, setActiveCat]   = useState("");
  const [cartCount, setCartCount]   = useState(0);
  const [cartItems, setCartItems]   = useState<number[]>([]);
  const [wishlist, setWishlist]     = useState<number[]>([]);
  const [search, setSearch]         = useState("");
  const [chatOpen, setChatOpen]     = useState(false);
  const [chatMsgs, setChatMsgs]     = useState<ChatMsg[]>([
    { from: "bot", text: "Привет! 🌸 Чем могу помочь? Выбери вопрос или напиши сам." },
  ]);
  const [chatInput, setChatInput]   = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  const addToCart = (id: number) => {
    if (!cartItems.includes(id)) {
      setCartItems(p => [...p, id]);
      setCartCount(c => c + 1);
    }
  };
  const toggleWishlist = (id: number) => {
    setWishlist(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  };
  const scrollTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const sendMsg = (text: string) => {
    setChatMsgs(p => [...p, { from: "user", text }]);
    const reply = BOT_REPLIES[text] ?? "Уточни вопрос, мы скоро ответим! ☎️ 8 800 555-35-35";
    setTimeout(() => setChatMsgs(p => [...p, { from: "bot", text: reply }]), 500);
    setChatInput("");
  };

  const badgeEl = (type: string, text: string) => {
    const cls = type === "mint" ? "badge-mint" : type === "rose" ? "badge-rose" : "badge-lav";
    return <span className={cls}>{text}</span>;
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="blob w-[600px] h-[600px] -top-40 -right-40" style={{ background: "#A8E6CF" }} />
        <div className="blob w-[500px] h-[500px] top-1/3 -left-60"  style={{ background: "#74C0FC" }} />
        <div className="blob w-[400px] h-[400px] bottom-20 right-10" style={{ background: "#FFB347", opacity: 0.25 }} />
        <div className="blob w-[350px] h-[350px] bottom-1/3 left-1/3" style={{ background: "#FF7EB3", opacity: 0.2 }} />
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center gap-5">

          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="font-black text-lg tracking-tight" style={{
              background: "linear-gradient(135deg, #4a9fd4 0%, #2dba8a 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Всети-города
            </div>
            <div className="text-[9px] tracking-[0.18em] font-semibold uppercase" style={{ color: "var(--muted-t)" }}>маркетплейс</div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Найти товар, категорию..."
              className="search-field w-full pl-11 pr-5 py-2.5 text-sm"
              style={{ color: "var(--text)" }}
            />
            <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#74C0FC" }} />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-t)" }}>
                <Icon name="X" size={14} />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2.5 rounded-full transition-all hover:bg-white/60" style={{ color: "var(--muted-t)" }}>
              <Icon name="User" size={19} />
            </button>
            <button className="relative p-2.5 rounded-full transition-all hover:bg-white/60" style={{ color: "var(--muted-t)" }}>
              <Icon name="Heart" size={19} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                  style={{ background: "linear-gradient(135deg,#FFB347,#FF7EB3)" }}>
                  {wishlist.length}
                </span>
              )}
            </button>
            <button className="btn-gradient flex items-center gap-2 px-5 py-2.5 text-sm">
              <Icon name="ShoppingBag" size={16} />
              <span className="hidden sm:inline">Корзина</span>
              {cartCount > 0 && (
                <span className="font-black text-[11px] bg-white/70 rounded-full w-5 h-5 flex items-center justify-center" style={{ color: "#1a3a5c" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="max-w-6xl mx-auto px-6 pb-2.5 flex gap-1.5 overflow-x-auto">
          {NAV_LINKS.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className={`nav-pill px-4 py-1.5 ${activeNav === l.id ? "nav-pill-active" : ""}`}
            >
              {l.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── HERO ── */}
      <section id="home" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div className="animate-fade-up">
            <div className="tag-mint mb-5">✦ 50 000+ товаров · Доставка за 1 день</div>
            <h1 className="font-black leading-[1.05] tracking-tight mb-6" style={{ fontSize: "clamp(40px,5.5vw,72px)", color: "var(--text)" }}>
              Покупай с<br />
              <span style={{ background: "linear-gradient(135deg, #4a9fd4 0%, #2dba8a 60%, #FF7EB3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                радостью
              </span>
            </h1>
            <p className="text-base mb-9 leading-relaxed max-w-md" style={{ color: "var(--muted-t)" }}>
              Уютный маркетплейс для дома, красоты и жизни. Тысячи товаров от проверенных продавцов — с заботой о тебе.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-gradient px-8 py-3.5 text-sm font-bold">Смотреть каталог</button>
              <button className="btn-outline-grad px-8 py-3.5 text-sm font-bold">Стать продавцом</button>
            </div>

            <div className="flex gap-8 mt-10 pt-8 border-t border-sky-100">
              {[
                { v: "50K+",  l: "товаров" },
                { v: "2400+", l: "продавцов" },
                { v: "4.8★",  l: "рейтинг" },
                { v: "1 день",l: "доставка" },
              ].map((s, i) => (
                <div key={i} className={`animate-fade-up d${i+1}`}>
                  <div className="font-black text-xl" style={{ color: "var(--text)" }}>{s.v}</div>
                  <div className="text-xs font-medium" style={{ color: "var(--muted-t)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block relative animate-fade-up d2">
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 24px 64px rgba(116,192,252,0.25)" }}>
              <img src={HERO_IMG} alt="" className="w-full object-cover" style={{ maxHeight: 420 }} />
            </div>
            {/* Floating cards */}
            <div className="absolute -bottom-5 -left-6 float-card px-5 py-4 shadow-xl">
              <div className="text-xs mb-0.5" style={{ color: "var(--muted-t)" }}>Заказов сегодня</div>
              <div className="font-black text-2xl" style={{ background: "linear-gradient(135deg,#74C0FC,#A8E6CF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                1 247 ↑
              </div>
            </div>
            <div className="absolute -top-4 -right-5 float-card px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <div>
                  <div className="font-black text-sm" style={{ color: "var(--text)" }}>4.8 / 5</div>
                  <div className="text-[10px]" style={{ color: "var(--muted-t)" }}>1200+ отзывов</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" className="relative z-10 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--text)" }}>Категории</h2>
              <p className="text-sm mt-1" style={{ color: "var(--muted-t)" }}>Что тебя интересует?</p>
            </div>
            <button className="text-sm font-semibold flex items-center gap-1" style={{ color: "#4a9fd4" }}>
              Все <Icon name="ChevronRight" size={14} />
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCat(cat.name)}
                className="float-card p-4 flex flex-col items-center gap-2.5 text-center transition-all"
                style={activeCat === cat.name ? { boxShadow: "0 8px 32px rgba(116,192,252,0.3)", borderColor: "#74C0FC" } : {}}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.grad} flex items-center justify-center text-2xl shadow-sm`}>
                  {cat.emoji}
                </div>
                <div className="text-xs font-semibold leading-tight" style={{ color: "var(--text)" }}>{cat.name}</div>
                <div className="text-[10px]" style={{ color: "var(--muted-t)" }}>{cat.count}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SALES ── */}
      <section id="sales" className="relative z-10 py-14 px-6 section-peach">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--text)" }}>Акции 🌸</h2>
            <p className="text-sm mt-1" style={{ color: "var(--muted-t)" }}>Успей поймать выгоду</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {[
              { title: "Красота и уход",  discount: "до 40%", ends: "2 дня",  emoji: "💆", grad: "from-[#FFB347] to-[#FF7EB3]" },
              { title: "Дом и декор",     discount: "до 55%", ends: "5 дней", emoji: "🏠", grad: "from-[#74C0FC] to-[#A8E6CF]" },
              { title: "Детские товары",  discount: "до 35%", ends: "3 дня",  emoji: "👶", grad: "from-[#C084FC] to-[#FF7EB3]" },
            ].map((s, i) => (
              <div key={i} className="float-card p-7 cursor-pointer group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-3xl mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                  {s.emoji}
                </div>
                <div className="font-black text-4xl mb-1" style={{
                  background: `linear-gradient(135deg, ${i===0?"#FFB347,#FF7EB3":i===1?"#74C0FC,#A8E6CF":"#C084FC,#FF7EB3"})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  {s.discount}
                </div>
                <div className="font-semibold mb-1" style={{ color: "var(--text)" }}>{s.title}</div>
                <div className="text-xs mb-5" style={{ color: "var(--muted-t)" }}>Осталось {s.ends}</div>
                <button className="btn-outline-grad text-xs px-5 py-2 font-semibold">Смотреть →</button>
              </div>
            ))}
          </div>

          {/* Wide banner */}
          <div className="float-card overflow-hidden" style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #fce4f3 100%)" }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
              <div>
                <div className="tag-mint mb-3">МЕГАРАСПРОДАЖА</div>
                <div className="font-black text-4xl mb-2" style={{ color: "var(--text)" }}>до 70% на всё</div>
                <p className="text-sm" style={{ color: "var(--muted-t)" }}>Только сегодня — лучшие предложения сезона</p>
              </div>
              <button className="btn-peach px-10 py-4 text-base font-bold shrink-0">Перейти в акции</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR ── */}
      <section id="popular" className="relative z-10 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--text)" }}>Популярное</h2>
              <p className="text-sm mt-1" style={{ color: "var(--muted-t)" }}>Что выбирают чаще всего</p>
            </div>
            <div className="flex gap-2">
              {["Рейтинг", "Отзывы", "Цена"].map(f => (
                <button key={f} className="text-xs px-3 py-1.5 rounded-full border font-semibold transition-all hover:border-sky-300"
                  style={{ borderColor: "rgba(116,192,252,0.35)", color: "var(--muted-t)" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => (
              <div key={p.id} className={`float-card overflow-hidden animate-fade-up d${(i % 3) + 1}`}>
                {/* Image */}
                <div className="relative h-52 flex items-center justify-center" style={{
                  background: i % 3 === 0
                    ? "linear-gradient(135deg,#e8f9f3,#e0f2fe)"
                    : i % 3 === 1
                    ? "linear-gradient(135deg,#fff5eb,#ffe4ef)"
                    : "linear-gradient(135deg,#f5f0ff,#ffe4ef)",
                }}>
                  <span className="text-7xl">{p.emoji}</span>
                  <div className="absolute top-3 left-3">{badgeEl(p.badgeType, p.badge)}</div>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:scale-110"
                    style={{ color: wishlist.includes(p.id) ? "#FF7EB3" : "#ccc" }}
                  >
                    <span className="text-base">{wishlist.includes(p.id) ? "♥" : "♡"}</span>
                  </button>
                </div>

                <div className="p-5">
                  <div className="text-[11px] mb-1" style={{ color: "var(--muted-t)" }}>{p.seller}</div>
                  <h3 className="font-bold text-base mb-2 leading-snug" style={{ color: "var(--text)" }}>{p.name}</h3>

                  <div className="flex items-center gap-2 mb-4">
                    <Stars rating={p.rating} />
                    <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>{p.rating}</span>
                    <span className="text-xs" style={{ color: "var(--muted-t)" }}>({p.reviews})</span>
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-sky-50">
                    <div>
                      <div className="font-black text-xl" style={{ color: "var(--text)" }}>
                        {p.price.toLocaleString("ru-RU")} ₽
                      </div>
                      {p.oldPrice && (
                        <div className="text-xs line-through" style={{ color: "var(--muted-t)" }}>
                          {p.oldPrice.toLocaleString("ru-RU")} ₽
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(p.id)}
                      className={`text-sm font-bold px-4 py-2.5 transition-all ${cartItems.includes(p.id) ? "btn-outline-grad" : "btn-gradient"}`}
                    >
                      {cartItems.includes(p.id) ? "✓ В корзине" : "В корзину"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="relative z-10 py-14 px-6 section-mint">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-start">
          <div>
            <div className="tag-mint mb-5">О ПЛАТФОРМЕ</div>
            <h2 className="text-3xl font-black tracking-tight mb-4" style={{ color: "var(--text)" }}>
              Сделано с <span style={{ background: "linear-gradient(135deg,#FF7EB3,#FFB347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>заботой</span>
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--muted-t)" }}>
              «Всети-города» — маркетплейс для тех, кто ценит уют и качество. Только проверенные продавцы, честные отзывы и прозрачные цены.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "Shield",     title: "Защита",        desc: "Гарантия возврата средств",  grad: "from-[#74C0FC] to-[#A8E6CF]" },
                { icon: "Star",       title: "Честно",        desc: "Только реальные отзывы",     grad: "from-[#FFB347] to-[#FF7EB3]" },
                { icon: "Truck",      title: "Быстро",        desc: "Доставка от 1 дня",          grad: "from-[#A8E6CF] to-[#C084FC]" },
                { icon: "Headphones", title: "С заботой",     desc: "Поддержка 24/7",             grad: "from-[#C084FC] to-[#74C0FC]" },
              ].map((f, i) => (
                <div key={i} className="float-card p-5 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.grad} flex items-center justify-center shrink-0 shadow-sm`}>
                    <Icon name={f.icon} size={17} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: "var(--text)" }}>{f.title}</div>
                    <div className="text-xs" style={{ color: "var(--muted-t)" }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-black text-4xl" style={{ color: "var(--text)" }}>4.8</span>
              <div>
                <div className="flex gap-0.5 text-xl">
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#FFB347" }}>★</span>)}
                </div>
                <div className="text-xs" style={{ color: "var(--muted-t)" }}>1 200+ отзывов</div>
              </div>
            </div>
            {[
              { author: "Анна К.",     rating: 5, text: "Заказала диффузор — просто восторг! Аромат нежный, пришёл быстро.", date: "3 дня назад",  av: "АК" },
              { author: "Максим В.",   rating: 4, text: "Кружку получил, очень качественная, цвет как на фото.", date: "1 нед. назад",  av: "МВ" },
              { author: "Светлана Р.", rating: 5, text: "Лучший маркетплейс для покупок домой. Всё с заботой!", date: "2 нед. назад", av: "СР" },
            ].map((r, i) => (
              <div key={i} className="float-card p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 bg-gradient-to-br ${["from-[#74C0FC] to-[#A8E6CF]","from-[#FFB347] to-[#FF7EB3]","from-[#C084FC] to-[#74C0FC]"][i]}`}>
                    {r.av}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{r.author}</div>
                    <div className="text-[10px]" style={{ color: "var(--muted-t)" }}>{r.date}</div>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-t)" }}>{r.text}</p>
              </div>
            ))}

            {/* CTA */}
            <div className="float-card p-6 text-center" style={{ background: "linear-gradient(135deg,#e8f9f3,#e0f2fe)" }}>
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-black text-xl mb-1" style={{ color: "var(--text)" }}>Стань продавцом</div>
              <p className="text-xs mb-4" style={{ color: "var(--muted-t)" }}>Без абонентской платы — только комиссия с продаж</p>
              <button className="btn-gradient w-full py-3 text-sm font-bold">Зарегистрироваться</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACTS ── */}
      <section id="contacts" className="relative z-10 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight mb-8" style={{ color: "var(--text)" }}>Контакты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "Phone",  title: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатно по России", grad: "from-[#74C0FC] to-[#A8E6CF]" },
              { icon: "Mail",   title: "Email",   value: "hello@vseti.ru",      sub: "Ответим за 2 часа",  grad: "from-[#FFB347] to-[#FF7EB3]" },
              { icon: "MapPin", title: "Офис",    value: "Москва, Тверская, 1", sub: "Пн–Пт 9:00–18:00",  grad: "from-[#C084FC] to-[#74C0FC]" },
            ].map((c, i) => (
              <div key={i} className="float-card p-6">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${c.grad} flex items-center justify-center mb-4 shadow-md`}>
                  <Icon name={c.icon} size={19} className="text-white" />
                </div>
                <div className="text-xs mb-1" style={{ color: "var(--muted-t)" }}>{c.title}</div>
                <div className="font-black" style={{ color: "var(--text)" }}>{c.value}</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted-t)" }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-8 px-6" style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(116,192,252,0.15)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-black text-lg" style={{ background: "linear-gradient(135deg,#4a9fd4,#2dba8a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Всети-города
          </div>
          <div className="text-xs" style={{ color: "var(--muted-t)" }}>© 2024 Всети-города. Сделано с ♡</div>
          <div className="flex gap-5 text-xs" style={{ color: "var(--muted-t)" }}>
            {["Условия", "Конфиденциальность", "Помощь"].map(l => (
              <button key={l} className="hover:underline transition-all">{l}</button>
            ))}
          </div>
        </div>
      </footer>

      {/* ── CHATBOT ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="chat-bubble w-80 rounded-3xl overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(116,192,252,0.25)", background: "#fff", border: "1px solid rgba(116,192,252,0.2)" }}>
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ background: "linear-gradient(135deg,#e8f9f3,#e0f2fe)", borderBottom: "1px solid rgba(116,192,252,0.15)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg,#74C0FC,#A8E6CF)" }}>
                <Icon name="Bot" size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: "var(--text)" }}>Помощник</div>
                <div className="text-[10px]" style={{ color: "#2dba8a" }}>● онлайн</div>
              </div>
              <button onClick={() => setChatOpen(false)} className="ml-auto" style={{ color: "var(--muted-t)" }}>
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="h-52 overflow-y-auto p-4 flex flex-col gap-2" style={{ background: "#fafcff" }}>
              {chatMsgs.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="text-xs px-3.5 py-2.5 rounded-2xl max-w-[80%] leading-relaxed"
                    style={
                      msg.from === "user"
                        ? { background: "linear-gradient(135deg,#74C0FC,#A8E6CF)", color: "#1a3a5c" }
                        : { background: "#fff", border: "1px solid rgba(116,192,252,0.2)", color: "var(--text)" }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="px-3 py-2 flex flex-wrap gap-1.5" style={{ borderTop: "1px solid rgba(116,192,252,0.12)", background: "#fff" }}>
              {CHAT_TIPS.map(tip => (
                <button
                  key={tip}
                  onClick={() => sendMsg(tip)}
                  className="text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all"
                  style={{ borderColor: "rgba(116,192,252,0.3)", color: "#4a9fd4" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(116,192,252,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {tip}
                </button>
              ))}
            </div>

            <div className="flex gap-2 p-3" style={{ borderTop: "1px solid rgba(116,192,252,0.12)", background: "#fff" }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && chatInput.trim() && sendMsg(chatInput.trim())}
                placeholder="Написать сообщение..."
                className="flex-1 text-xs px-3.5 py-2 rounded-full focus:outline-none"
                style={{ background: "#f0f8ff", border: "1.5px solid rgba(116,192,252,0.25)", color: "var(--text)" }}
              />
              <button
                onClick={() => chatInput.trim() && sendMsg(chatInput.trim())}
                className="btn-gradient w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              >
                <Icon name="Send" size={13} />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen(o => !o)}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #74C0FC, #A8E6CF)",
            boxShadow: "0 8px 28px rgba(116,192,252,0.45)",
          }}
        >
          <Icon name={chatOpen ? "X" : "MessageCircle"} size={24} style={{ color: "#1a3a5c" }} />
        </button>
      </div>
    </div>
  );
}
