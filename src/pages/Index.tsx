import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const CITY_BG = "https://cdn.poehali.dev/projects/ced8c987-a177-43ce-b6ad-264704bf2b5f/files/d0fb0233-7cd3-4681-b607-a6776152cf2f.jpg";

const CATEGORIES = [
  { emoji: "📱", name: "Электроника" },
  { emoji: "👟", name: "Обувь" },
  { emoji: "👗", name: "Одежда" },
  { emoji: "🏠", name: "Дом и сад" },
  { emoji: "🎮", name: "Игры" },
  { emoji: "💄", name: "Красота" },
  { emoji: "🔧", name: "Инструменты" },
  { emoji: "🍕", name: "Еда" },
];

const PRODUCTS = [
  { id: 1,  name: "Смартфон X-Vision 12",   price: 24900, oldPrice: 31000, rating: 4.6, reviews: 89,  badge: "−20%",    badgeType: "blue",   emoji: "📱", seller: "ТехноГород" },
  { id: 2,  name: "Кроссовки Urban Pro",    price: 4990,  oldPrice: 7200,  rating: 4.8, reviews: 312, badge: "ХИТ",     badgeType: "orange", emoji: "👟", seller: "СпортМаркет" },
  { id: 3,  name: "Платье Summer Glow",     price: 2490,  oldPrice: null,  rating: 4.9, reviews: 204, badge: "НОВИНКА", badgeType: "blue",   emoji: "👗", seller: "МодаРФ" },
  { id: 4,  name: "Контроллер Pro X",       price: 6200,  oldPrice: 8500,  rating: 4.7, reviews: 147, badge: "−27%",    badgeType: "orange", emoji: "🎮", seller: "ГеймЗон" },
  { id: 5,  name: "Сыворотка Glow+",        price: 1890,  oldPrice: 2600,  rating: 4.5, reviews: 521, badge: "ТОП",     badgeType: "blue",   emoji: "💄", seller: "БьютиМир" },
  { id: 6,  name: "Наушники SoundWave X3",  price: 8990,  oldPrice: 12000, rating: 4.8, reviews: 376, badge: "−25%",    badgeType: "orange", emoji: "🎧", seller: "АудиоПлюс" },
  { id: 7,  name: "Умные часы FitPro 5",    price: 5490,  oldPrice: 7800,  rating: 4.7, reviews: 201, badge: "−30%",    badgeType: "orange", emoji: "⌚", seller: "ТехноГород" },
  { id: 8,  name: "Рюкзак TravelMax",       price: 3290,  oldPrice: null,  rating: 4.6, reviews: 88,  badge: "НОВИНКА", badgeType: "blue",   emoji: "🎒", seller: "АктивСтиль" },
];

const CHAT_TIPS = ["Где мои заказы?", "Как вернуть товар?", "Стать продавцом", "Рассрочка"];
const BOT_REPLIES: Record<string, string> = {
  "Где мои заказы?":  "Ваши заказы — в Личном кабинете, раздел «Мои заказы» 🛒",
  "Как вернуть товар?": "Возврат оформляется в течение 14 дней прямо в карточке заказа ✅",
  "Стать продавцом":  "Регистрация бесплатна, комиссия только с продаж 🚀",
  "Рассрочка":        "Рассрочка 0% от 5 000 ₽. Оформляется при оформлении заказа 💳",
};

interface ChatMsg { from: "user" | "bot"; text: string; }

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-xs">
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#FF6600" : "#444" }}>★</span>
      ))}
    </span>
  );
}

export default function Index() {
  const [activeCat, setActiveCat]   = useState("Электроника");
  const [cartCount, setCartCount]   = useState(0);
  const [cartItems, setCartItems]   = useState<number[]>([]);
  const [wishlist, setWishlist]     = useState<number[]>([]);
  const [search, setSearch]         = useState("");
  const [chatOpen, setChatOpen]     = useState(false);
  const [chatMsgs, setChatMsgs]     = useState<ChatMsg[]>([
    { from: "bot", text: "Привет! 👋 Чем могу помочь? Выбери вопрос или напиши сам." },
  ]);
  const [chatInput, setChatInput]   = useState("");
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
  const sendMsg = (text: string) => {
    setChatMsgs(prev => [...prev, { from: "user", text }]);
    const reply = BOT_REPLIES[text] ?? "Уточни вопрос — скоро ответим! Или звони: 8 800 555-35-35 ☎️";
    setTimeout(() => setChatMsgs(prev => [...prev, { from: "bot", text: reply }]), 500);
    setChatInput("");
  };

  return (
    <div className="min-h-screen" style={{ background: "#090d14", fontFamily: "'Golos Text', sans-serif" }}>

      {/* ── HERO SECTION с фоном ночного города ── */}
      <div
        className="relative min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${CITY_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,8,20,0.72) 0%, rgba(5,8,20,0.55) 40%, rgba(5,8,20,0.85) 100%)" }} />

        {/* ── HEADER ── */}
        <header className="relative z-20 glass border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-5">

            {/* Logo */}
            <div className="flex-shrink-0 mr-2">
              <div className="font-black text-xl tracking-tight neon-orange flicker">ВСЕТИ-ГОРОДА</div>
              <div className="text-[9px] tracking-[0.2em] text-white/40 uppercase">маркетплейс</div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg relative">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ищи товары, продавцов..."
                className="search-glow w-full pl-11 pr-5 py-3 rounded-xl text-sm text-white placeholder-white/40 transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1.5px solid rgba(255,102,0,0.4)",
                  outline: "none",
                }}
              />
              <Icon name="Search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--orange)" }} />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <Icon name="X" size={14} />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white transition-colors glass">
                <Icon name="User" size={17} />
                <span className="hidden sm:inline">Войти</span>
              </button>
              <button className="btn-orange relative flex items-center gap-2 px-5 py-2.5 text-sm">
                <Icon name="ShoppingCart" size={17} className="text-white" />
                <span className="hidden sm:inline">Корзина</span>
                {cartCount > 0 && (
                  <span className="font-black text-[11px] bg-white text-orange-600 rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ── NEON CATEGORIES NAV ── */}
          <nav className="max-w-7xl mx-auto px-6 pb-3 flex gap-2 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCat(cat.name)}
                className={`cat-pill flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white/70 ${activeCat === cat.name ? "cat-pill-active" : ""}`}
              >
                <span>{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </nav>
        </header>

        {/* ── HERO BANNER ── */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-20 px-6">
          <div className="text-center animate-fade-up max-w-3xl">
            <div className="text-sm font-semibold tracking-[0.2em] uppercase mb-5 neon-blue">
              ● Маркетплейс · 50 000+ товаров
            </div>
            <h1 className="font-black leading-[1.0] mb-6" style={{ fontSize: "clamp(38px, 6vw, 80px)" }}>
              <span className="neon-white">Ищете выгодно?</span><br />
              <span className="neon-orange flicker">Ищите Всети-города</span>
            </h1>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Тысячи товаров от проверенных продавцов со всей страны. Честные цены, быстрая доставка, реальные отзывы.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="btn-orange px-9 py-4 text-base font-bold">
                Начать покупки →
              </button>
              <button className="btn-ghost px-9 py-4 text-base font-bold text-white">
                Стать продавцом
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 justify-center mt-14">
              {[
                { v: "50K+", l: "товаров" },
                { v: "2400+", l: "продавцов" },
                { v: "4.8★", l: "рейтинг" },
                { v: "1 день", l: "доставка" },
              ].map((s, i) => (
                <div key={i} className="text-center animate-fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
                  <div className="font-black text-2xl neon-orange">{s.v}</div>
                  <div className="text-white/40 text-xs font-medium">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRODUCT CARDS (над городом, по бокам) ── */}
        <div className="relative z-10 pb-0">
          <div className="max-w-7xl mx-auto px-6 pb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">
                Популярные товары
                <span className="ml-3 text-sm font-normal text-white/40">{activeCat}</span>
              </h2>
              <button className="text-sm font-semibold flex items-center gap-1" style={{ color: "var(--neon-blue)" }}>
                Все товары <Icon name="ChevronRight" size={15} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {PRODUCTS.map((p, i) => (
                <div
                  key={p.id}
                  className="product-card animate-fade-up"
                  style={{ animationDelay: `${0.07 * i}s` }}
                >
                  {/* Image zone */}
                  <div className="relative h-40 flex items-center justify-center" style={{ background: "#f5f5f5" }}>
                    <span className="text-6xl">{p.emoji}</span>

                    <div className="absolute top-2.5 left-2.5">
                      <span className={p.badgeType === "orange" ? "badge-orange" : "badge-blue"}>
                        {p.badge}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                      style={{ color: wishlist.includes(p.id) ? "var(--orange)" : "#bbb" }}
                    >
                      <span className="text-sm">{wishlist.includes(p.id) ? "♥" : "♡"}</span>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="text-[11px] text-gray-400 mb-1">{p.seller}</div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2">{p.name}</h3>

                    <div className="flex items-center gap-1.5 mb-3">
                      <Stars rating={p.rating} />
                      <span className="text-xs text-gray-500">({p.reviews})</span>
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <div className="font-black text-xl text-gray-900 leading-none">
                          {p.price.toLocaleString("ru-RU")} ₽
                        </div>
                        {p.oldPrice && (
                          <div className="text-xs text-gray-400 line-through mt-0.5">
                            {p.oldPrice.toLocaleString("ru-RU")} ₽
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(p.id)}
                        className="shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-all"
                        style={
                          cartItems.includes(p.id)
                            ? { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" }
                            : { background: "var(--orange)", color: "#fff" }
                        }
                      >
                        {cartItems.includes(p.id) ? "✓ В корзине" : "В корзину"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── АКЦИИ (тёмная секция) ── */}
      <section className="py-16 px-6" style={{ background: "#090d14" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white">Акции <span style={{ color: "var(--orange)" }}>🔥</span></h2>
            <button className="text-sm font-semibold" style={{ color: "var(--neon-blue)" }}>Все акции →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Электроника",    discount: "до 40%", ends: "2 дня",  emoji: "📱", col: "var(--neon-blue)" },
              { title: "Одежда и обувь", discount: "до 60%", ends: "5 дней", emoji: "👗", col: "var(--orange)" },
              { title: "Дом и сад",      discount: "до 35%", ends: "3 дня",  emoji: "🌿", col: "#00DC82" },
            ].map((sale, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-7 cursor-pointer group transition-all hover:border-white/20"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-3xl">{sale.emoji}</span>
                  <span className="text-xs text-white/40">Осталось {sale.ends}</span>
                </div>
                <div className="font-black text-4xl mb-1" style={{ color: sale.col, textShadow: `0 0 20px ${sale.col}55` }}>
                  {sale.discount}
                </div>
                <div className="text-white/80 font-semibold mb-5">{sale.title}</div>
                <button className="text-sm font-bold" style={{ color: sale.col }}>
                  Смотреть товары →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── О ПЛАТФОРМЕ ── */}
      <section style={{ background: "#0d1117" }} className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-8">Почему <span className="neon-orange">Всети-города</span>?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: "Shield",     title: "Защита покупателя", desc: "Гарантия возврата" },
              { icon: "Zap",        title: "Быстрый поиск",     desc: "Результат за секунду" },
              { icon: "Truck",      title: "Доставка 1 день",   desc: "По всей России" },
              { icon: "Star",       title: "Честные отзывы",    desc: "Только реальные" },
            ].map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center hover:border-orange-500/30 transition-all" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,102,0,0.12)", border: "1px solid rgba(255,102,0,0.25)" }}>
                  <Icon name={f.icon} size={20} style={{ color: "var(--orange)" }} />
                </div>
                <div className="font-bold text-white text-sm mb-1">{f.title}</div>
                <div className="text-white/40 text-xs">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── КОНТАКТЫ ── */}
      <section style={{ background: "#090d14" }} className="py-14 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-8">Контакты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "Phone",  title: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатно по России" },
              { icon: "Mail",   title: "Email",   value: "hello@vseti.ru",      sub: "Ответим за 2 часа" },
              { icon: "MapPin", title: "Офис",    value: "Москва, Тверская, 1", sub: "Пн–Пт 9:00–18:00" },
            ].map((c, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:border-orange-500/30 transition-all" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(255,102,0,0.12)", border: "1px solid rgba(255,102,0,0.25)" }}>
                  <Icon name={c.icon} size={18} style={{ color: "var(--orange)" }} />
                </div>
                <div className="text-white/40 text-xs mb-1">{c.title}</div>
                <div className="font-bold text-white">{c.value}</div>
                <div className="text-white/40 text-xs mt-1">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-7 px-6 border-t border-white/5" style={{ background: "#060910" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-black text-lg neon-orange flicker">ВСЕТИ-ГОРОДА</div>
          <div className="text-xs text-white/30">© 2024 Всети-города. Все права защищены.</div>
          <div className="flex gap-5 text-xs text-white/30">
            {["Условия", "Конфиденциальность", "Помощь"].map(l => (
              <button key={l} className="hover:text-white transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </footer>

      {/* ── CHATBOT ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="chat-bubble w-80 rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#0d1117", border: "1px solid rgba(255,102,0,0.25)" }}>
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10" style={{ background: "#111820" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: "var(--orange)" }}>
                <Icon name="Bot" size={15} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Помощник</div>
                <div className="text-[10px]" style={{ color: "var(--neon-blue)" }}>● онлайн</div>
              </div>
              <button onClick={() => setChatOpen(false)} className="ml-auto text-white/40 hover:text-white">
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="h-52 overflow-y-auto p-4 flex flex-col gap-2" style={{ background: "#090d14" }}>
              {chatMsgs.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="text-xs px-3.5 py-2.5 rounded-2xl max-w-[80%] leading-relaxed"
                    style={
                      msg.from === "user"
                        ? { background: "var(--orange)", color: "#fff" }
                        : { background: "#1a2030", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.08)" }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-white/10" style={{ background: "#0d1117" }}>
              {CHAT_TIPS.map(tip => (
                <button
                  key={tip}
                  onClick={() => sendMsg(tip)}
                  className="text-[10px] px-2.5 py-1 rounded-full border font-medium transition-colors hover:border-orange-500 hover:text-orange-400"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
                >
                  {tip}
                </button>
              ))}
            </div>

            <div className="flex gap-2 p-3 border-t border-white/10" style={{ background: "#0d1117" }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && chatInput.trim() && sendMsg(chatInput.trim())}
                placeholder="Написать сообщение..."
                className="flex-1 text-xs px-3 py-2 rounded-full bg-white/5 text-white/80 placeholder-white/30 focus:outline-none border border-white/10 focus:border-orange-500/50"
              />
              <button
                onClick={() => chatInput.trim() && sendMsg(chatInput.trim())}
                className="btn-orange w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              >
                <Icon name="Send" size={13} className="text-white" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen(o => !o)}
          className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105"
          style={{
            background: "var(--orange)",
            boxShadow: "0 0 24px var(--orange-glow)",
          }}
        >
          <Icon name={chatOpen ? "X" : "MessageCircle"} size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}
