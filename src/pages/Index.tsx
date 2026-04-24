import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/ced8c987-a177-43ce-b6ad-264704bf2b5f/files/901cbab9-f745-4b27-9890-dc807d0631bb.jpg";
const PRODUCTS_IMG = "https://cdn.poehali.dev/projects/ced8c987-a177-43ce-b6ad-264704bf2b5f/files/c26c5f52-bead-4a63-bc73-6221bb1c7f4b.jpg";

const NAV_LINKS = [
  { label: "Главная", id: "home" },
  { label: "Категории", id: "categories" },
  { label: "Акции", id: "sales" },
  { label: "Популярное", id: "popular" },
  { label: "О платформе", id: "about" },
  { label: "Контакты", id: "contacts" },
];

const CATEGORIES = [
  { emoji: "👟", name: "Обувь", count: 1240 },
  { emoji: "👗", name: "Одежда", count: 3870 },
  { emoji: "📱", name: "Электроника", count: 980 },
  { emoji: "🏠", name: "Дом и сад", count: 2100 },
  { emoji: "🎮", name: "Игры", count: 560 },
  { emoji: "💄", name: "Красота", count: 1650 },
  { emoji: "🍕", name: "Еда", count: 430 },
  { emoji: "🔧", name: "Инструменты", count: 720 },
];

const PRODUCTS = [
  { id: 1, name: "Кроссовки Urban Pro", price: 4990, oldPrice: 7200, rating: 4.8, reviews: 312, seller: "СпортМаркет", badge: "ХИТ", emoji: "👟", discount: 31 },
  { id: 2, name: "Смартфон X-Vision 12", price: 24900, oldPrice: 31000, rating: 4.6, reviews: 89, seller: "ТехноГород", badge: "−20%", emoji: "📱", discount: 20 },
  { id: 3, name: "Платье Summer Glow", price: 2490, oldPrice: null, rating: 4.9, reviews: 204, seller: "МодаРФ", badge: "НОВИНКА", emoji: "👗", discount: 0 },
  { id: 4, name: "Игровой контроллер Pro", price: 6200, oldPrice: 8500, rating: 4.7, reviews: 147, seller: "ГеймЗон", badge: "−27%", emoji: "🎮", discount: 27 },
  { id: 5, name: "Крем-сыворотка Glow+", price: 1890, oldPrice: 2600, rating: 4.5, reviews: 521, seller: "БьютиМир", badge: "ТОП", emoji: "💄", discount: 27 },
  { id: 6, name: "Наушники SoundWave X3", price: 8990, oldPrice: 12000, rating: 4.8, reviews: 376, seller: "АудиоПлюс", badge: "−25%", emoji: "🎧", discount: 25 },
];

const TICKER_ITEMS = [
  "⚡ Электроника — до 40%", "🔥 Одежда — до 60%", "🟢 Доставка за 1 день",
  "★ Рейтинг 4.8 из 5", "📦 50 000+ товаров", "🛡 Защита покупателя",
  "⚡ Электроника — до 40%", "🔥 Одежда — до 60%", "🟢 Доставка за 1 день",
  "★ Рейтинг 4.8 из 5", "📦 50 000+ товаров", "🛡 Защита покупателя",
];

const CHAT_TIPS = [
  "Где мои заказы?",
  "Как вернуть товар?",
  "Как стать продавцом?",
  "Есть ли рассрочка?",
];

const BOT_REPLIES: Record<string, string> = {
  "Где мои заказы?": "Ваши заказы доступны в Личном кабинете → раздел «Мои заказы». Если нужна помощь — напишите нам.",
  "Как вернуть товар?": "Возврат оформляется в течение 14 дней. Перейдите в заказ и нажмите «Вернуть товар».",
  "Как стать продавцом?": "Зарегистрируйтесь как продавец — это бесплатно. Комиссия только с продаж.",
  "Есть ли рассрочка?": "Да! Рассрочка 0% доступна для заказов от 5 000 ₽. Подробнее при оформлении.",
};

interface ChatMsg { from: "user" | "bot"; text: string; }

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-xs" style={{ color: "#00DC82", letterSpacing: 1 }}>
      {"★".repeat(full)}
      <span className="text-gray-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="tooltip-wrap relative inline-flex">
      {children}
      <div className="tooltip-box absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap">
        <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { from: "bot", text: "Привет! Чем могу помочь? Выберите вопрос или напишите сам." },
  ]);
  const [chatInput, setChatInput] = useState("");
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
    const userMsg: ChatMsg = { from: "user", text };
    const botText = BOT_REPLIES[text] ?? "Уточните вопрос — скоро свяжемся с вами или позвоните: 8 800 555-35-35.";
    setChatMsgs(prev => [...prev, userMsg]);
    setTimeout(() => {
      setChatMsgs(prev => [...prev, { from: "bot", text: botText }]);
    }, 500);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* TICKER */}
      <div className="bg-gray-950 text-gray-400 text-xs py-1.5 overflow-hidden select-none">
        <div className="ticker-inner gap-10">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="mx-8 shrink-0">{item}</span>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center gap-5">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-7 h-7 rounded" style={{ background: "var(--neon)" }} />
            <div>
              <div className="font-black text-sm tracking-tight leading-none">ВСЕТИ-ГОРОДА</div>
              <div className="text-[10px] text-gray-400 leading-none font-medium tracking-widest">МАРКЕТПЛЕЙС</div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Найти товар..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 bg-white transition-colors font-medium"
            />
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <Icon name="X" size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Tooltip text="Личный кабинет">
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Icon name="User" size={18} />
              </button>
            </Tooltip>
            <Tooltip text="Избранное">
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Icon name="Heart" size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background: "var(--neon)", color: "#000" }}>
                    {wishlist.length}
                  </span>
                )}
              </button>
            </Tooltip>
            <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold">
              <Icon name="ShoppingCart" size={15} className="text-white" />
              <span className="hidden sm:inline">Корзина</span>
              {cartCount > 0 && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: "var(--neon)", color: "#000" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="max-w-6xl mx-auto px-6 flex gap-0 overflow-x-auto">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`px-4 py-2.5 text-sm whitespace-nowrap font-medium transition-colors border-b-2 -mb-px ${
                activeSection === link.id
                  ? "border-[#00DC82] text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </header>

      {/* HERO */}
      <section id="home" className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3 animate-fade-up">
            <div className="tag-neon mb-5">50 000+ ТОВАРОВ · ДОСТАВКА ЗА 1 ДЕНЬ</div>
            <h1 className="text-5xl md:text-[64px] font-black leading-[1.0] tracking-tight text-gray-950 mb-5">
              Находи.<br />Покупай.<br />
              <span style={{ color: "var(--neon)" }}>Выгодно.</span>
            </h1>
            <p className="text-gray-500 text-base mb-8 max-w-sm leading-relaxed">
              Маркетплейс от проверенных продавцов. Честные отзывы, реальные цены, быстрая доставка.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary px-6 py-3 rounded-lg font-semibold text-sm">
                Смотреть каталог
              </button>
              <button className="btn-neon-outline px-6 py-3 rounded-lg font-semibold text-sm">
                Стать продавцом →
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-gray-100">
              {[
                { v: "50K+", l: "товаров" },
                { v: "2.4K", l: "продавцов" },
                { v: "4.8★", l: "рейтинг" },
                { v: "1 день", l: "доставка" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-black text-xl text-gray-900">{s.v}</div>
                  <div className="text-xs text-gray-400 font-medium">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 hidden md:block animate-fade-up animate-delay-2">
            <div className="relative">
              <img src={HERO_IMG} alt="" className="w-full rounded-2xl object-cover" style={{ maxHeight: 400 }} />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-lg">
                <div className="text-xs text-gray-400 mb-0.5">Заказов сегодня</div>
                <div className="font-black text-xl text-gray-900">1 247 <span style={{ color: "var(--neon)" }}>↑</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-14 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight">Категории</h2>
            <button className="text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1">
              ВСЕ <Icon name="ChevronRight" size={12} />
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                className="card-hover border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 text-center bg-white"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <div className="text-xs font-semibold text-gray-800 leading-tight">{cat.name}</div>
                <div className="text-[10px] text-gray-400">{cat.count.toLocaleString("ru-RU")}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SALES */}
      <section id="sales" className="py-14 px-6 bg-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">Акции</h2>
              <p className="text-gray-500 text-sm mt-0.5">Ограниченное время</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { title: "Электроника", discount: "до 40%", ends: "02:14:37", emoji: "📱" },
              { title: "Одежда и обувь", discount: "до 60%", ends: "05:22:10", emoji: "👗" },
              { title: "Дом и сад", discount: "до 35%", ends: "03:08:55", emoji: "🏠" },
            ].map((sale, i) => (
              <div key={i} className="border border-gray-800 rounded-xl p-6 hover:border-[#00DC82] transition-colors group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{sale.emoji}</span>
                  <div className="tag-neon">{sale.ends}</div>
                </div>
                <div className="text-3xl font-black text-white mb-1">{sale.discount}</div>
                <div className="text-gray-400 text-sm mb-4">{sale.title}</div>
                <div className="text-xs font-semibold" style={{ color: "var(--neon)" }}>
                  Смотреть товары →
                </div>
              </div>
            ))}
          </div>

          {/* Banner */}
          <div className="relative rounded-xl overflow-hidden h-44">
            <img src={PRODUCTS_IMG} alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 flex items-center px-10 justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Мегараспродажа</div>
                <div className="text-4xl font-black text-white">до 70% на всё</div>
              </div>
              <button className="btn-primary px-6 py-3 rounded-lg font-semibold text-sm shrink-0">
                Перейти
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section id="popular" className="py-14 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight">Популярное</h2>
            <div className="flex gap-1.5">
              {["Рейтинг", "Отзывы", "Цена↑", "Цена↓"].map(f => (
                <button key={f} className="px-3 py-1.5 text-xs border border-gray-200 rounded-md hover:border-gray-400 transition-colors text-gray-600 font-medium">
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map(p => (
              <div key={p.id} className="card-hover border border-gray-100 rounded-xl overflow-hidden bg-white">

                {/* Image */}
                <div className="relative h-52 bg-gray-50 flex items-center justify-center">
                  <span className="text-7xl">{p.emoji}</span>

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded">
                      {p.badge}
                    </span>
                    {p.discount > 0 && (
                      <Tooltip text={`Скидка ${p.discount}%`}>
                        <span className="tag-neon cursor-default">−{p.discount}%</span>
                      </Tooltip>
                    )}
                  </div>

                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:border-gray-300 transition-colors"
                    style={wishlist.includes(p.id) ? { borderColor: "var(--neon)" } : {}}
                  >
                    <span className="text-sm" style={wishlist.includes(p.id) ? { color: "var(--neon)" } : { color: "#aaa" }}>
                      ♥
                    </span>
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 leading-tight">{p.name}</h3>

                  <div className="flex items-center gap-2 mb-1">
                    <Stars rating={p.rating} />
                    <span className="text-xs font-bold text-gray-800">{p.rating}</span>
                    <span className="text-xs text-gray-400">({p.reviews} отз.)</span>
                  </div>

                  <div className="text-xs text-gray-400 mb-4">{p.seller}</div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xl font-black text-gray-900">{p.price.toLocaleString("ru-RU")} ₽</div>
                      {p.oldPrice && (
                        <div className="text-xs text-gray-400 line-through">{p.oldPrice.toLocaleString("ru-RU")} ₽</div>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(p.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                        cartItems.includes(p.id)
                          ? "text-[#00DC82] border border-[#00DC82] bg-transparent"
                          : "btn-primary"
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

      {/* ABOUT */}
      <section id="about" className="py-14 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-start">
          <div>
            <div className="tag-neon mb-5">О ПЛАТФОРМЕ</div>
            <h2 className="text-3xl font-black tracking-tight mb-4">
              Быстро. Честно.<br />Выгодно.
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              «Всети-города» — технологичная торговая платформа. Только проверенные продавцы, реальные отзывы и прозрачные цены.
            </p>
            <div className="space-y-3">
              {[
                { icon: "Shield", title: "Защита покупателя", desc: "Гарантия возврата средств в любой ситуации" },
                { icon: "Zap", title: "Мгновенный поиск", desc: "Находим нужный товар за секунды" },
                { icon: "Truck", title: "Доставка за 1 день", desc: "По всей России" },
                { icon: "Star", title: "Честные отзывы", desc: "Только от реальных покупателей" },
              ].map((f, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-white border border-gray-100 rounded-xl card-hover">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: "var(--neon-dim)", border: "1px solid var(--neon-border)" }}>
                    <Icon name={f.icon} size={15} style={{ color: "var(--neon)" }} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{f.title}</div>
                    <div className="text-xs text-gray-400">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {/* Reviews */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-xl font-black text-gray-900">4.8</span>
              <span style={{ color: "var(--neon)" }} className="text-lg">★★★★★</span>
              <span className="text-xs text-gray-400">· 1 200+ отзывов</span>
            </div>
            <div className="space-y-3">
              {[
                { author: "Анна К.", rating: 5, text: "Заказала кроссовки — пришли быстро, качество огонь!", date: "3 дня назад", av: "АК" },
                { author: "Максим В.", rating: 4, text: "Смартфон отличный, всё как на картинке. Доставка 2 дня.", date: "1 нед. назад", av: "МВ" },
                { author: "Светлана Р.", rating: 5, text: "Платформа удобная, легко найти нужное.", date: "2 нед. назад", av: "СР" },
              ].map((r, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 card-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {r.av}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">{r.author}</div>
                      <div className="text-[10px] text-gray-400">{r.date}</div>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-14 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black tracking-tight mb-8">Контакты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "Phone", title: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатно по России" },
              { icon: "Mail", title: "Email", value: "hello@vseti.ru", sub: "Ответим за 2 часа" },
              { icon: "MapPin", title: "Офис", value: "Москва, Тверская, 1", sub: "Пн–Пт 9:00–18:00" },
            ].map((c, i) => (
              <div key={i} className="card-hover border border-gray-100 rounded-xl p-6 bg-white">
                <div className="w-9 h-9 rounded-lg mb-4 flex items-center justify-center" style={{ background: "var(--neon-dim)", border: "1px solid var(--neon-border)" }}>
                  <Icon name={c.icon} size={16} style={{ color: "var(--neon)" }} />
                </div>
                <div className="text-xs text-gray-400 mb-1">{c.title}</div>
                <div className="font-black text-gray-900 mb-0.5">{c.value}</div>
                <div className="text-xs text-gray-400">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-7 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded" style={{ background: "var(--neon)" }} />
            <span className="font-black text-white text-sm tracking-tight">ВСЕТИ-ГОРОДА</span>
          </div>
          <div className="text-xs text-gray-600">© 2024 Всети-города. Все права защищены.</div>
          <div className="flex gap-5 text-xs text-gray-600">
            {["Условия", "Конфиденциальность", "Помощь"].map(l => (
              <button key={l} className="hover:text-white transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </footer>

      {/* CHATBOT */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="chat-bubble w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-950">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--neon)" }}>
                <Icon name="Bot" size={14} className="text-black" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Бот-помощник</div>
                <div className="text-[10px]" style={{ color: "var(--neon)" }}>● онлайн</div>
              </div>
              <button onClick={() => setChatOpen(false)} className="ml-auto text-gray-500 hover:text-white transition-colors">
                <Icon name="X" size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-52 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50">
              {chatMsgs.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="text-xs px-3 py-2 rounded-xl max-w-[80%] leading-relaxed"
                    style={
                      msg.from === "user"
                        ? { background: "#111", color: "#fff" }
                        : { background: "#fff", border: "1px solid #eee", color: "#333" }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick tips */}
            <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-gray-100 bg-white">
              {CHAT_TIPS.map(tip => (
                <button
                  key={tip}
                  onClick={() => sendMsg(tip)}
                  className="text-[10px] px-2 py-1 rounded-md border border-gray-200 hover:border-gray-400 text-gray-600 transition-colors font-medium"
                >
                  {tip}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 border-t border-gray-100 bg-white">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && chatInput.trim() && sendMsg(chatInput.trim())}
                placeholder="Напишите вопрос..."
                className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              />
              <button
                onClick={() => chatInput.trim() && sendMsg(chatInput.trim())}
                className="btn-primary px-3 py-2 rounded-lg"
              >
                <Icon name="Send" size={13} className="text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setChatOpen(o => !o)}
          className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105"
          style={{ background: chatOpen ? "#111" : "var(--neon)" }}
        >
          <Icon name={chatOpen ? "X" : "MessageCircle"} size={22} className={chatOpen ? "text-white" : "text-black"} />
        </button>
      </div>
    </div>
  );
}
