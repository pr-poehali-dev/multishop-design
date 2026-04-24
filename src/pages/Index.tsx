import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const COZY_IMG  = "https://cdn.poehali.dev/projects/ced8c987-a177-43ce-b6ad-264704bf2b5f/files/f42616d7-292e-4e65-abac-efff84ba81e5.jpg";
const BANNER_IMG = "https://cdn.poehali.dev/projects/ced8c987-a177-43ce-b6ad-264704bf2b5f/files/c26c5f52-bead-4a63-bc73-6221bb1c7f4b.jpg";

const NAV_LINKS = [
  { label: "Главная", id: "home" },
  { label: "Категории", id: "categories" },
  { label: "Акции", id: "sales" },
  { label: "Популярное", id: "popular" },
  { label: "О нас", id: "about" },
  { label: "Контакты", id: "contacts" },
];

const CATEGORIES = [
  { emoji: "👟", name: "Обувь",        count: "1 240" },
  { emoji: "👗", name: "Одежда",       count: "3 870" },
  { emoji: "📱", name: "Электроника",  count: "980"   },
  { emoji: "🏠", name: "Дом и сад",    count: "2 100" },
  { emoji: "🎮", name: "Игры",         count: "560"   },
  { emoji: "💄", name: "Красота",      count: "1 650" },
  { emoji: "🍕", name: "Еда",          count: "430"   },
  { emoji: "🔧", name: "Инструменты",  count: "720"   },
];

const PRODUCTS = [
  { id: 1, name: "Кроссовки Urban Pro",    price: 4990,  oldPrice: 7200,  rating: 4.8, reviews: 312, seller: "СпортМаркет", badge: "ХИТ",     emoji: "👟", sticker: "red"   },
  { id: 2, name: "Смартфон X-Vision 12",   price: 24900, oldPrice: 31000, rating: 4.6, reviews: 89,  seller: "ТехноГород",  badge: "−20%",    emoji: "📱", sticker: "amber" },
  { id: 3, name: "Платье Summer Glow",     price: 2490,  oldPrice: null,  rating: 4.9, reviews: 204, seller: "МодаРФ",      badge: "НОВИНКА", emoji: "👗", sticker: "green" },
  { id: 4, name: "Контроллер Pro",         price: 6200,  oldPrice: 8500,  rating: 4.7, reviews: 147, seller: "ГеймЗон",     badge: "−27%",    emoji: "🎮", sticker: "amber" },
  { id: 5, name: "Сыворотка Glow+",        price: 1890,  oldPrice: 2600,  rating: 4.5, reviews: 521, seller: "БьютиМир",    badge: "ТОП",     emoji: "💄", sticker: "red"   },
  { id: 6, name: "Наушники SoundWave X3",  price: 8990,  oldPrice: 12000, rating: 4.8, reviews: 376, seller: "АудиоПлюс",   badge: "−25%",    emoji: "🎧", sticker: "amber" },
];

const SALES = [
  { title: "Электроника",    discount: "до 40%", ends: "2 дня",  emoji: "📱" },
  { title: "Одежда и обувь", discount: "до 60%", ends: "5 дней", emoji: "👗" },
  { title: "Дом и сад",      discount: "до 35%", ends: "3 дня",  emoji: "🌿" },
];

const CHAT_TIPS = ["Где мои заказы?", "Как вернуть товар?", "Стать продавцом", "Есть ли рассрочка?"];
const BOT_REPLIES: Record<string, string> = {
  "Где мои заказы?":    "Ваши заказы — в Личном кабинете, раздел «Мои заказы» 🛍",
  "Как вернуть товар?": "Возврат оформляется в течение 14 дней прямо в карточке заказа 🤝",
  "Стать продавцом":    "Регистрация бесплатна, комиссия только с продаж. Нажмите «Стать продавцом» на главной 🌟",
  "Есть ли рассрочка?": "Да! Рассрочка 0% от 5 000 ₽. Оформляется при оформлении заказа 💳",
};

interface ChatMsg { from: "user" | "bot"; text: string; }

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm" style={{ color: "#B07D3A" }}>
      {"★".repeat(Math.round(rating))}
      <span className="text-gray-300">{"★".repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

function StickerBadge({ type, text }: { type: string; text: string }) {
  const cls = type === "green" ? "sticker sticker-green" : type === "amber" ? "sticker sticker-amber" : "sticker";
  return <span className={cls}>{text}</span>;
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [cartCount, setCartCount]         = useState(0);
  const [search, setSearch]               = useState("");
  const [wishlist, setWishlist]           = useState<number[]>([]);
  const [cartItems, setCartItems]         = useState<number[]>([]);
  const [chatOpen, setChatOpen]           = useState(false);
  const [chatMsgs, setChatMsgs]           = useState<ChatMsg[]>([
    { from: "bot", text: "Привет! 👋 Чем могу помочь? Выбери вопрос или напиши сам." },
  ]);
  const [chatInput, setChatInput]         = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  const addToCart = (id: number) => {
    if (!cartItems.includes(id)) {
      setCartItems(prev => [...prev, id]);
      setCartCount(c => c + 1);
    }
  };
  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const sendMsg = (text: string) => {
    setChatMsgs(prev => [...prev, { from: "user", text }]);
    const reply = BOT_REPLIES[text] ?? "Уточни вопрос — скоро ответим! Или позвони: 8 800 555-35-35 ☎️";
    setTimeout(() => setChatMsgs(prev => [...prev, { from: "bot", text: reply }]), 500);
    setChatInput("");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)", fontFamily: "'Golos Text', sans-serif" }}>

      {/* TOP BAR */}
      <div className="text-center py-2 text-xs font-medium" style={{ background: "var(--terra)", color: "#fff" }}>
        🌟 Бесплатная доставка при заказе от 2 000 ₽ &nbsp;·&nbsp; Возврат 14 дней &nbsp;·&nbsp; Поддержка 24/7
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "var(--cream)", borderColor: "var(--terra-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-5">

          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="font-handwritten text-2xl leading-none" style={{ color: "var(--terra)" }}>Всети-города</div>
            <div className="text-[10px] tracking-widest font-medium uppercase" style={{ color: "var(--muted-text)" }}>маркетплейс</div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Найти что-нибудь уютное..."
              className="w-full pl-9 pr-4 py-2.5 text-sm focus:outline-none transition-all"
              style={{
                background: "#fff",
                border: "1.5px solid var(--terra-border)",
                borderRadius: 50,
                color: "var(--text)",
              }}
            />
            <Icon name="Search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-text)" }} />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2 rounded-full hover:bg-amber-50 transition-colors" style={{ color: "var(--muted-text)" }}>
              <Icon name="User" size={19} />
            </button>
            <button className="p-2 rounded-full hover:bg-amber-50 transition-colors relative" style={{ color: "var(--muted-text)" }}>
              <Icon name="Heart" size={19} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: "var(--terra)" }}>
                  {wishlist.length}
                </span>
              )}
            </button>
            <button className="btn-warm flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
              <Icon name="ShoppingBag" size={15} className="text-white" />
              <span className="hidden sm:inline">Корзина</span>
              {cartCount > 0 && (
                <span className="font-black text-xs bg-white rounded-full w-5 h-5 flex items-center justify-center" style={{ color: "var(--terra)" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="max-w-6xl mx-auto px-6 pb-2 flex gap-1 overflow-x-auto">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-all font-medium ${
                activeSection === link.id
                  ? "text-white"
                  : "hover:bg-amber-50"
              }`}
              style={activeSection === link.id
                ? { background: "var(--terra)", color: "#fff" }
                : { color: "var(--muted-text)" }
              }
            >
              {link.label}
            </button>
          ))}
        </nav>
      </header>

      {/* HERO */}
      <section id="home" className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="tag-warm mb-5">✨ 50 000+ товаров от живых людей</div>
            <h1 className="font-handwritten leading-tight mb-5" style={{ fontSize: 68, color: "var(--text)" }}>
              Покупай с<br />
              <span style={{ color: "var(--terra)" }}>душой</span>
            </h1>
            <p className="text-base mb-8 leading-relaxed max-w-sm" style={{ color: "var(--muted-text)" }}>
              Уютный маркетплейс, где каждый товар — от реального продавца. Тепло, честно и с заботой о тебе.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-warm px-7 py-3.5 font-semibold text-sm">
                Начать шопинг 🛍
              </button>
              <button className="btn-outline-warm px-7 py-3.5 font-semibold text-sm">
                Стать продавцом
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-10 pt-8 border-t" style={{ borderColor: "var(--terra-border)" }}>
              {[
                { icon: "Shield", text: "Защита покупателя" },
                { icon: "Truck", text: "Доставка за 1 день" },
                { icon: "RotateCcw", text: "Возврат 14 дней" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon name={b.icon} size={15} style={{ color: "var(--terra)" }} />
                  <span className="text-xs font-medium" style={{ color: "var(--muted-text)" }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block animate-fade-up animate-delay-2 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 20px 60px rgba(160,82,45,0.18)" }}>
              <img src={COZY_IMG} alt="" className="w-full object-cover" style={{ maxHeight: 420 }} />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-5 -left-5 rounded-2xl px-5 py-4 shadow-xl border" style={{ background: "#fff", borderColor: "var(--terra-border)" }}>
              <div className="text-xs mb-1" style={{ color: "var(--muted-text)" }}>Счастливых покупателей</div>
              <div className="font-handwritten text-3xl" style={{ color: "var(--terra)" }}>24 500+ ❤️</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-handwritten text-4xl" style={{ color: "var(--text)" }}>Категории</h2>
              <p className="text-sm mt-1" style={{ color: "var(--muted-text)" }}>Найди то, что ищёшь</p>
            </div>
            <button className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--terra)" }}>
              Все <Icon name="ChevronRight" size={14} />
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                className="pill-hover border rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
                style={{ background: "#fff", borderColor: "rgba(160,82,45,0.12)" }}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <div className="text-xs font-semibold leading-tight" style={{ color: "var(--text)" }}>{cat.name}</div>
                <div className="text-[10px]" style={{ color: "var(--muted-text)" }}>{cat.count}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SALES */}
      <section id="sales" className="py-14 px-6" style={{ background: "var(--warm)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="font-handwritten text-4xl" style={{ color: "var(--text)" }}>Акции 🔥</h2>
            <p className="text-sm mt-1" style={{ color: "var(--muted-text)" }}>Успей купить по выгодной цене</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {SALES.map((sale, i) => (
              <div key={i} className="cozy-card p-7 cursor-pointer group">
                <div className="text-3xl mb-4">{sale.emoji}</div>
                <div className="font-handwritten text-5xl mb-1" style={{ color: "var(--terra)" }}>{sale.discount}</div>
                <div className="font-semibold text-base mb-1" style={{ color: "var(--text)" }}>{sale.title}</div>
                <div className="text-xs mb-5" style={{ color: "var(--muted-text)" }}>Осталось {sale.ends}</div>
                <button className="btn-outline-warm text-xs font-semibold px-5 py-2">
                  Смотреть →
                </button>
              </div>
            ))}
          </div>

          {/* Banner */}
          <div className="relative rounded-3xl overflow-hidden h-48 shadow-lg">
            <img src={BANNER_IMG} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center px-10" style={{ background: "rgba(46,34,24,0.6)" }}>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Мегараспродажа</div>
                <div className="font-handwritten text-5xl text-white">до 70% на всё</div>
                <button className="mt-4 btn-warm px-6 py-2.5 text-sm font-semibold">Перейти</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section id="popular" className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-handwritten text-4xl" style={{ color: "var(--text)" }}>Популярное</h2>
              <p className="text-sm mt-1" style={{ color: "var(--muted-text)" }}>Что выбирают чаще всего</p>
            </div>
            <div className="flex gap-2">
              {["По рейтингу", "По отзывам"].map(f => (
                <button key={f} className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
                  style={{ borderColor: "var(--terra-border)", color: "var(--muted-text)" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map(p => (
              <div key={p.id} className="cozy-card overflow-hidden">
                {/* Image */}
                <div className="relative h-52 flex items-center justify-center" style={{ background: "var(--warm)" }}>
                  <span className="text-7xl">{p.emoji}</span>
                  <div className="absolute top-3 left-3">
                    <StickerBadge type={p.sticker} text={p.badge} />
                  </div>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border transition-all"
                    style={{
                      background: "#fff",
                      borderColor: wishlist.includes(p.id) ? "var(--terra)" : "rgba(160,82,45,0.15)",
                      color: wishlist.includes(p.id) ? "var(--terra)" : "var(--muted-text)",
                    }}
                  >
                    <span className="text-base">{wishlist.includes(p.id) ? "♥" : "♡"}</span>
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold mb-1.5 text-base leading-tight" style={{ color: "var(--text)" }}>{p.name}</h3>

                  <div className="flex items-center gap-2 mb-1">
                    <Stars rating={p.rating} />
                    <span className="text-xs font-bold" style={{ color: "var(--text)" }}>{p.rating}</span>
                    <span className="text-xs" style={{ color: "var(--muted-text)" }}>({p.reviews})</span>
                  </div>

                  <div className="flex items-center gap-1 mb-4 text-xs" style={{ color: "var(--muted-text)" }}>
                    <Icon name="ShoppingBag" size={11} />
                    {p.seller}
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t" style={{ borderColor: "rgba(160,82,45,0.1)" }}>
                    <div>
                      <div className="font-black text-xl" style={{ color: "var(--text)" }}>{p.price.toLocaleString("ru-RU")} ₽</div>
                      {p.oldPrice && (
                        <div className="text-xs line-through" style={{ color: "var(--muted-text)" }}>{p.oldPrice.toLocaleString("ru-RU")} ₽</div>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(p.id)}
                      className={`text-xs font-semibold px-4 py-2 transition-all ${
                        cartItems.includes(p.id) ? "btn-outline-warm" : "btn-warm"
                      }`}
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

      {/* REVIEWS + ABOUT */}
      <section id="about" className="py-14 px-6" style={{ background: "var(--warm)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14">
          {/* About */}
          <div>
            <h2 className="font-handwritten text-4xl mb-4" style={{ color: "var(--text)" }}>О нас 🌻</h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--muted-text)" }}>
              «Всети-города» — маркетплейс, где за каждым товаром стоит живой человек. Мы объединяем продавцов из разных городов, чтобы ты мог найти что-то особенное.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "Shield",     title: "Защита",          desc: "Гарантия возврата" },
                { icon: "Star",       title: "Честно",          desc: "Только реальные отзывы" },
                { icon: "Truck",      title: "Быстро",          desc: "Доставка от 1 дня" },
                { icon: "Headphones", title: "С заботой",       desc: "Поддержка 24/7" },
              ].map((f, i) => (
                <div key={i} className="cozy-card p-4 flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--terra-light)", border: "1px solid var(--terra-border)" }}>
                    <Icon name={f.icon} size={16} style={{ color: "var(--terra)" }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{f.title}</div>
                    <div className="text-xs" style={{ color: "var(--muted-text)" }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Seller CTA */}
            <div className="cozy-card p-6 mt-5 text-center">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-handwritten text-2xl mb-1" style={{ color: "var(--text)" }}>Стань продавцом</div>
              <p className="text-xs mb-4" style={{ color: "var(--muted-text)" }}>Без абонентской платы — только комиссия с продаж</p>
              <button className="btn-warm w-full py-3 font-semibold text-sm">Зарегистрироваться</button>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-handwritten text-4xl" style={{ color: "var(--text)" }}>Отзывы</span>
              <span className="font-black text-2xl" style={{ color: "var(--terra)" }}>4.8 ★</span>
              <span className="text-xs" style={{ color: "var(--muted-text)" }}>· 1 200+</span>
            </div>
            <div className="space-y-4">
              {[
                { author: "Анна К.",      rating: 5, text: "Заказала кроссовки — пришли быстро, качество огонь! Продавец молодец.", date: "3 дня назад",    av: "АК" },
                { author: "Максим В.",    rating: 4, text: "Смартфон отличный, всё как на картинке. Доставка 2 дня.",              date: "1 нед. назад",   av: "МВ" },
                { author: "Светлана Р.", rating: 5, text: "Платформа удобная, легко найти нужное. Рекомендую всем друзьям!",       date: "2 нед. назад",   av: "СР" },
              ].map((r, i) => (
                <div key={i} className="cozy-card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "var(--terra)" }}>
                      {r.av}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{r.author}</div>
                      <div className="text-[10px]" style={{ color: "var(--muted-text)" }}>{r.date}</div>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted-text)" }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-handwritten text-4xl mb-8" style={{ color: "var(--text)" }}>Свяжись с нами ✉️</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "Phone",  title: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатно по России" },
              { icon: "Mail",   title: "Email",   value: "hello@vseti.ru",     sub: "Ответим за 2 часа" },
              { icon: "MapPin", title: "Офис",    value: "Москва, Тверская, 1", sub: "Пн–Пт 9:00–18:00" },
            ].map((c, i) => (
              <div key={i} className="cozy-card p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--terra-light)", border: "1px solid var(--terra-border)" }}>
                  <Icon name={c.icon} size={18} style={{ color: "var(--terra)" }} />
                </div>
                <div className="text-xs mb-1" style={{ color: "var(--muted-text)" }}>{c.title}</div>
                <div className="font-black" style={{ color: "var(--text)" }}>{c.value}</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted-text)" }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t" style={{ background: "var(--warm)", borderColor: "var(--terra-border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-handwritten text-2xl" style={{ color: "var(--terra)" }}>Всети-города</div>
          <div className="text-xs" style={{ color: "var(--muted-text)" }}>© 2024 Всети-города. Сделано с ❤️</div>
          <div className="flex gap-5 text-xs" style={{ color: "var(--muted-text)" }}>
            {["Условия", "Конфиденциальность", "Помощь"].map(l => (
              <button key={l} className="hover:underline transition-all">{l}</button>
            ))}
          </div>
        </div>
      </footer>

      {/* CHATBOT */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="chat-bubble w-80 rounded-3xl overflow-hidden shadow-2xl border" style={{ background: "#fff", borderColor: "var(--terra-border)" }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ background: "var(--warm)", borderColor: "var(--terra-border)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-base" style={{ background: "var(--terra)" }}>
                🌻
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>Помощник</div>
                <div className="text-[10px]" style={{ color: "var(--terra)" }}>● онлайн</div>
              </div>
              <button onClick={() => setChatOpen(false)} className="ml-auto" style={{ color: "var(--muted-text)" }}>
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-52 overflow-y-auto p-4 flex flex-col gap-2" style={{ background: "var(--cream)" }}>
              {chatMsgs.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="text-xs px-3.5 py-2.5 rounded-2xl max-w-[80%] leading-relaxed"
                    style={
                      msg.from === "user"
                        ? { background: "var(--terra)", color: "#fff" }
                        : { background: "#fff", border: "1px solid var(--terra-border)", color: "var(--text)" }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Tips */}
            <div className="px-3 py-2.5 flex flex-wrap gap-1.5 border-t" style={{ background: "#fff", borderColor: "var(--terra-border)" }}>
              {CHAT_TIPS.map(tip => (
                <button
                  key={tip}
                  onClick={() => sendMsg(tip)}
                  className="text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all hover:bg-amber-50"
                  style={{ borderColor: "var(--terra-border)", color: "var(--terra)" }}
                >
                  {tip}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 border-t" style={{ background: "#fff", borderColor: "var(--terra-border)" }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && chatInput.trim() && sendMsg(chatInput.trim())}
                placeholder="Написать сообщение..."
                className="flex-1 text-xs px-3 py-2 rounded-full focus:outline-none"
                style={{ background: "var(--cream)", border: "1.5px solid var(--terra-border)", color: "var(--text)" }}
              />
              <button
                onClick={() => chatInput.trim() && sendMsg(chatInput.trim())}
                className="btn-warm w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              >
                <Icon name="Send" size={14} className="text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={() => setChatOpen(o => !o)}
          className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: "var(--terra)" }}
        >
          <span className="text-2xl">{chatOpen ? "✕" : "💬"}</span>
        </button>
      </div>
    </div>
  );
}
