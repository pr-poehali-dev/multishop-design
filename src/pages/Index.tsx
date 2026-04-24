import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/ced8c987-a177-43ce-b6ad-264704bf2b5f/files/901cbab9-f745-4b27-9890-dc807d0631bb.jpg";
const PRODUCTS_IMG = "https://cdn.poehali.dev/projects/ced8c987-a177-43ce-b6ad-264704bf2b5f/files/c26c5f52-bead-4a63-bc73-6221bb1c7f4b.jpg";

const NAV_LINKS = [
  { label: "Главная", icon: "Home", id: "home" },
  { label: "Категории", icon: "LayoutGrid", id: "categories" },
  { label: "Популярное", icon: "TrendingUp", id: "popular" },
  { label: "Акции", icon: "Tag", id: "sales" },
  { label: "О платформе", icon: "Info", id: "about" },
  { label: "Контакты", icon: "Phone", id: "contacts" },
];

const CATEGORIES = [
  { emoji: "👟", name: "Обувь", count: "1 240 товаров", color: "from-orange-400 to-pink-500" },
  { emoji: "👗", name: "Одежда", count: "3 870 товаров", color: "from-pink-400 to-purple-500" },
  { emoji: "📱", name: "Электроника", count: "980 товаров", color: "from-blue-400 to-cyan-500" },
  { emoji: "🏠", name: "Дом и сад", count: "2 100 товаров", color: "from-green-400 to-teal-500" },
  { emoji: "🎮", name: "Игры", count: "560 товаров", color: "from-purple-400 to-blue-500" },
  { emoji: "💄", name: "Красота", count: "1 650 товаров", color: "from-red-400 to-pink-500" },
  { emoji: "🍕", name: "Еда", count: "430 товаров", color: "from-yellow-400 to-orange-500" },
  { emoji: "🔧", name: "Инструменты", count: "720 товаров", color: "from-gray-400 to-slate-500" },
];

const PRODUCTS = [
  { id: 1, name: "Кроссовки Urban Pro", price: 4990, oldPrice: 7200, rating: 4.8, reviews: 312, seller: "СпортМаркет", sellerRating: 4.9, badge: "ХИТ", emoji: "👟" },
  { id: 2, name: "Смартфон X-Vision 12", price: 24900, oldPrice: 31000, rating: 4.6, reviews: 89, seller: "ТехноГород", sellerRating: 4.7, badge: "-20%", emoji: "📱" },
  { id: 3, name: "Платье Summer Glow", price: 2490, oldPrice: null, rating: 4.9, reviews: 204, seller: "МодаРФ", sellerRating: 5.0, badge: "НОВИНКА", emoji: "👗" },
  { id: 4, name: "Игровой контроллер Pro", price: 6200, oldPrice: 8500, rating: 4.7, reviews: 147, seller: "ГеймЗон", sellerRating: 4.8, badge: "-27%", emoji: "🎮" },
  { id: 5, name: "Крем-сыворотка Glow+", price: 1890, oldPrice: 2600, rating: 4.5, reviews: 521, seller: "БьютиМир", sellerRating: 4.6, badge: "ТОП", emoji: "💄" },
  { id: 6, name: "Наушники SoundWave X3", price: 8990, oldPrice: 12000, rating: 4.8, reviews: 376, seller: "АудиоПлюс", sellerRating: 4.9, badge: "-25%", emoji: "🎧" },
];

const SALES = [
  { title: "Электроника", discount: "до 40%", ends: "2 дня", color: "from-blue-500 to-cyan-400", emoji: "⚡" },
  { title: "Одежда и обувь", discount: "до 60%", ends: "5 дней", color: "from-pink-500 to-rose-400", emoji: "🔥" },
  { title: "Дом и сад", discount: "до 35%", ends: "3 дня", color: "from-green-500 to-emerald-400", emoji: "🌿" },
];

const REVIEWS = [
  { author: "Анна К.", rating: 5, text: "Заказала кроссовки — пришли быстро, качество огонь! Продавец молодец.", date: "3 дня назад", avatar: "АК" },
  { author: "Максим В.", rating: 4, text: "Смартфон отличный, всё как на картинке. Доставка 2 дня.", date: "1 неделю назад", avatar: "МВ" },
  { author: "Светлана Р.", rating: 5, text: "Платформа удобная, легко найти нужное. Рекомендую!", date: "2 недели назад", avatar: "СР" },
];

function CartBadge({ count }: { count: number }) {
  return (
    <div className="relative flex items-center gap-2">
      <Icon name="ShoppingCart" size={20} className="text-white" />
      {count > 0 && (
        <span className="absolute -top-2 -right-6 bg-white text-orange-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {count}
        </span>
      )}
      <span className="hidden sm:inline text-white font-semibold text-sm">Корзина</span>
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);

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
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const badgeColor = (badge: string) => {
    if (badge === "ХИТ" || badge === "ТОП") return "bg-gradient-to-r from-orange-500 to-pink-500";
    if (badge === "НОВИНКА") return "bg-gradient-to-r from-green-500 to-emerald-400";
    return "bg-gradient-to-r from-blue-500 to-cyan-400";
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg" style={{ background: "linear-gradient(135deg, #FF6B1A, #FF2D78)" }}>В</div>
            <div>
              <div className="font-black text-base leading-none gradient-text">Всети-города</div>
              <div className="text-xs text-gray-400 leading-none">маркетплейс</div>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Найти товар, продавца..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white text-sm transition-all"
            />
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all text-sm font-medium">
              <Icon name="User" size={20} />
              <span className="hidden sm:inline">Войти</span>
            </button>
            <button className="relative btn-neon px-4 py-2.5 rounded-xl flex items-center gap-2">
              <CartBadge count={cartCount} />
            </button>
          </div>
        </div>

        <nav className="max-w-7xl mx-auto px-4 pb-2 flex gap-1 overflow-x-auto">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeSection === link.id ? "nav-active" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
            >
              <Icon name={link.icon} size={14} />
              {link.label}
            </button>
          ))}
        </nav>
      </header>

      {/* HERO */}
      <section id="home" className="hero-bg text-white py-20 px-4 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="sale-badge text-orange-400 font-bold">●</span> Более 50 000 товаров
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4">
              Всё лучшее —<br />
              <span style={{ background: "linear-gradient(90deg, #FF6B1A, #FF2D78, #1A7BFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                в одном месте
              </span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-md">
              Товары от проверенных продавцов со всей страны. Честные отзывы, быстрая доставка, выгодные акции каждый день.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-neon px-7 py-3.5 rounded-xl font-bold text-base text-white">
                Начать покупки
              </button>
              <button className="px-7 py-3.5 rounded-xl font-bold text-base border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all text-white">
                Стать продавцом
              </button>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-blue-200">
              <div className="flex items-center gap-1.5"><Icon name="Shield" size={16} className="text-green-400" /> Гарантия</div>
              <div className="flex items-center gap-1.5"><Icon name="Truck" size={16} className="text-blue-300" /> Доставка</div>
              <div className="flex items-center gap-1.5"><Icon name="Star" size={16} className="text-yellow-400" /> 4.8 рейтинг</div>
            </div>
          </div>
          <div className="hidden md:block animate-fade-up animate-delay-200">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(255,107,26,0.3), rgba(26,123,255,0.3))", filter: "blur(30px)", transform: "scale(1.1)" }} />
              <img src={HERO_IMG} alt="Маркетплейс" className="relative rounded-3xl w-full object-cover shadow-2xl" style={{ maxHeight: 360 }} />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "50 000+", label: "товаров" },
            { value: "2 400+", label: "продавцов" },
            { value: "4.8 ⭐", label: "рейтинг" },
            { value: "1 день", label: "доставка" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4 text-center">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Категории</h2>
              <p className="text-gray-500 mt-1">Найди то, что ищешь</p>
            </div>
            <button className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              Все <Icon name="ChevronRight" size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="category-card rounded-2xl overflow-hidden cursor-pointer group">
                <div className={`bg-gradient-to-br ${cat.color} p-6 flex flex-col items-center text-center`}>
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{cat.emoji}</div>
                  <div className="font-bold text-white text-lg">{cat.name}</div>
                  <div className="text-white/80 text-xs mt-1">{cat.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section id="popular" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Популярное</h2>
              <p className="text-gray-500 mt-1">Товары, которые выбирают чаще всего</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium hover:border-orange-400 transition-colors text-gray-700">По рейтингу</button>
              <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium hover:border-orange-400 transition-colors text-gray-700">По отзывам</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="product-card bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 h-44 flex items-center justify-center">
                  <span className="text-7xl">{product.emoji}</span>
                  {product.badge && (
                    <span className={`absolute top-3 left-3 ${badgeColor(product.badge)} text-white text-xs font-bold px-3 py-1 rounded-full sale-badge`}>
                      {product.badge}
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <span className="text-base">{wishlist.includes(product.id) ? "❤️" : "🤍"}</span>
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className="text-sm">{s <= Math.round(product.rating) ? "⭐" : "☆"}</span>
                      ))}
                    </div>
                    <span className="font-semibold text-sm text-gray-800">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3 bg-blue-50 rounded-lg px-3 py-1.5">
                    <Icon name="ShoppingBag" size={13} className="text-blue-500" />
                    <span className="text-xs text-blue-700 font-medium">{product.seller}</span>
                    <div className="flex items-center gap-0.5 ml-auto">
                      <span className="text-xs">⭐</span>
                      <span className="text-xs font-bold text-blue-800">{product.sellerRating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-black text-gray-900">{product.price.toLocaleString("ru-RU")} ₽</div>
                      {product.oldPrice && (
                        <div className="text-sm text-gray-400 line-through">{product.oldPrice.toLocaleString("ru-RU")} ₽</div>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${cartItems.includes(product.id) ? "bg-green-100 text-green-700" : "btn-neon text-white"}`}
                    >
                      {cartItems.includes(product.id) ? "✓ В корзине" : "В корзину"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SALES */}
      <section id="sales" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900">Акции</h2>
            <p className="text-gray-500 mt-1">Успей купить по выгодной цене</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SALES.map((sale, i) => (
              <div key={i} className={`bg-gradient-to-br ${sale.color} rounded-3xl p-7 text-white category-card relative overflow-hidden`}>
                <div className="absolute right-4 top-4 text-5xl opacity-20">{sale.emoji}</div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2">{sale.emoji}</div>
                  <div className="font-black text-3xl mb-1">{sale.discount}</div>
                  <div className="font-bold text-lg mb-1">{sale.title}</div>
                  <div className="text-white/80 text-sm mb-4">Осталось {sale.ends}</div>
                  <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all text-sm">
                    Смотреть товары
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl overflow-hidden relative h-52">
            <img src={PRODUCTS_IMG} alt="Акции" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-transparent flex items-center p-8">
              <div className="text-white">
                <div className="text-sm font-semibold text-orange-400 mb-1">МЕГАРАСПРОДАЖА</div>
                <div className="text-3xl font-black">до 70% на всё</div>
                <button className="mt-3 btn-neon px-5 py-2.5 rounded-xl font-bold text-sm text-white">Перейти</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900">Отзывы покупателей</h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className="text-xl">⭐</span>)}</div>
              <span className="font-black text-2xl text-gray-900">4.8</span>
              <span className="text-gray-500 text-sm">на основе 1 200+ отзывов</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 product-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #FF6B1A, #FF2D78)" }}>
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{review.author}</div>
                    <div className="text-xs text-gray-400">{review.date}</div>
                  </div>
                  <div className="ml-auto flex">
                    {[1,2,3,4,5].map(s => <span key={s} className="text-sm">{s <= review.rating ? "⭐" : "☆"}</span>)}
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="btn-blue px-8 py-3.5 rounded-xl font-bold text-white">Все отзывы</button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                О платформе
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                Маркетплейс, которому<br />
                <span className="gradient-text">доверяют тысячи</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                «Всети-города» — современная торговая платформа, объединяющая проверенных продавцов из разных городов России. Гарантируем качество, честные отзывы и быструю доставку.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "Shield", title: "Защита покупателя", desc: "Гарантия возврата средств" },
                  { icon: "Star", title: "Честные отзывы", desc: "Только реальные покупки" },
                  { icon: "Truck", title: "Быстрая доставка", desc: "От 1 до 3 дней" },
                  { icon: "Headphones", title: "Поддержка 24/7", desc: "Всегда на связи" },
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(255,107,26,0.15), rgba(255,45,120,0.15))" }}>
                      <Icon name={feat.icon} size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{feat.title}</div>
                      <div className="text-xs text-gray-500">{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-8 text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Стань продавцом</h3>
              <p className="text-gray-600 mb-6 text-sm">Размести свои товары и начни продавать миллионам покупателей уже сегодня</p>
              <button className="btn-neon w-full px-6 py-3.5 rounded-xl font-bold text-white text-base">
                Зарегистрироваться
              </button>
              <div className="mt-4 text-xs text-gray-400">Без абонентской платы · Комиссия с продаж</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-16 px-4 hero-bg text-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">Контакты</h2>
            <p className="text-blue-200">Мы всегда рядом</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "Phone", title: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатно по России" },
              { icon: "Mail", title: "Email", value: "hello@vseti.ru", sub: "Ответим за 2 часа" },
              { icon: "MapPin", title: "Офис", value: "Москва, Тверская, 1", sub: "Пн-Пт 9:00–18:00" },
            ].map((contact, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(255,107,26,0.4), rgba(255,45,120,0.4))" }}>
                  <Icon name={contact.icon} size={22} className="text-white" />
                </div>
                <div className="font-bold text-base mb-1">{contact.title}</div>
                <div className="font-black text-lg">{contact.value}</div>
                <div className="text-blue-200 text-sm mt-1">{contact.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: "linear-gradient(135deg, #FF6B1A, #FF2D78)" }}>В</div>
            <span className="font-black text-white">Всети-города</span>
          </div>
          <div className="text-sm text-center">© 2024 Всети-города. Маркетплейс проверенных товаров.</div>
          <div className="flex gap-4 text-sm">
            <button className="hover:text-white transition-colors">Условия</button>
            <button className="hover:text-white transition-colors">Конфиденциальность</button>
            <button className="hover:text-white transition-colors">Помощь</button>
          </div>
        </div>
      </footer>
    </div>
  );
}