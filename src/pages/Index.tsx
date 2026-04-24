import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/ced8c987-a177-43ce-b6ad-264704bf2b5f/files/901cbab9-f745-4b27-9890-dc807d0631bb.jpg";
const PRODUCTS_IMG = "https://cdn.poehali.dev/projects/ced8c987-a177-43ce-b6ad-264704bf2b5f/files/c26c5f52-bead-4a63-bc73-6221bb1c7f4b.jpg";

const NAV_LINKS = [
  { label: "Главная", id: "home" },
  { label: "Категории", id: "categories" },
  { label: "Популярное", id: "popular" },
  { label: "Акции", id: "sales" },
  { label: "О платформе", id: "about" },
  { label: "Контакты", id: "contacts" },
];

const CATEGORIES = [
  { emoji: "👟", name: "Обувь", count: "1 240 товаров" },
  { emoji: "👗", name: "Одежда", count: "3 870 товаров" },
  { emoji: "📱", name: "Электроника", count: "980 товаров" },
  { emoji: "🏠", name: "Дом и сад", count: "2 100 товаров" },
  { emoji: "🎮", name: "Игры", count: "560 товаров" },
  { emoji: "💄", name: "Красота", count: "1 650 товаров" },
  { emoji: "🍕", name: "Еда", count: "430 товаров" },
  { emoji: "🔧", name: "Инструменты", count: "720 товаров" },
];

const PRODUCTS = [
  { id: 1, name: "Кроссовки Urban Pro", price: 4990, oldPrice: 7200, rating: 4.8, reviews: 312, seller: "СпортМаркет", sellerRating: 4.9, badge: "ХИТ", emoji: "👟" },
  { id: 2, name: "Смартфон X-Vision 12", price: 24900, oldPrice: 31000, rating: 4.6, reviews: 89, seller: "ТехноГород", sellerRating: 4.7, badge: "−20%", emoji: "📱" },
  { id: 3, name: "Платье Summer Glow", price: 2490, oldPrice: null, rating: 4.9, reviews: 204, seller: "МодаРФ", sellerRating: 5.0, badge: "НОВИНКА", emoji: "👗" },
  { id: 4, name: "Игровой контроллер Pro", price: 6200, oldPrice: 8500, rating: 4.7, reviews: 147, seller: "ГеймЗон", sellerRating: 4.8, badge: "−27%", emoji: "🎮" },
  { id: 5, name: "Крем-сыворотка Glow+", price: 1890, oldPrice: 2600, rating: 4.5, reviews: 521, seller: "БьютиМир", sellerRating: 4.6, badge: "ТОП", emoji: "💄" },
  { id: 6, name: "Наушники SoundWave X3", price: 8990, oldPrice: 12000, rating: 4.8, reviews: 376, seller: "АудиоПлюс", sellerRating: 4.9, badge: "−25%", emoji: "🎧" },
];

const SALES = [
  { title: "Электроника", discount: "до 40%", ends: "2 дня", emoji: "⚡" },
  { title: "Одежда и обувь", discount: "до 60%", ends: "5 дней", emoji: "🔥" },
  { title: "Дом и сад", discount: "до 35%", ends: "3 дня", emoji: "🌿" },
];

const REVIEWS = [
  { author: "Анна К.", rating: 5, text: "Заказала кроссовки — пришли быстро, качество огонь! Продавец молодец.", date: "3 дня назад", avatar: "АК" },
  { author: "Максим В.", rating: 4, text: "Смартфон отличный, всё как на картинке. Доставка 2 дня.", date: "1 неделю назад", avatar: "МВ" },
  { author: "Светлана Р.", rating: 5, text: "Платформа удобная, легко найти нужное. Рекомендую!", date: "2 недели назад", avatar: "СР" },
];

const FEATURES = [
  { icon: "Shield", title: "Защита покупателя", desc: "Гарантия возврата средств" },
  { icon: "Star", title: "Честные отзывы", desc: "Только реальные покупки" },
  { icon: "Truck", title: "Быстрая доставка", desc: "От 1 до 3 дней" },
  { icon: "Headphones", title: "Поддержка 24/7", desc: "Всегда на связи" },
];

const CONTACTS = [
  { icon: "Phone", title: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатно по России" },
  { icon: "Mail", title: "Email", value: "hello@vseti.ru", sub: "Ответим за 2 часа" },
  { icon: "MapPin", title: "Офис", value: "Москва, Тверская, 1", sub: "Пн–Пт 9:00–18:00" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm tracking-tight">
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
    </span>
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
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">

          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-lg font-black tracking-tight text-gray-900">Всети-города</div>
            <div className="text-xs text-gray-400 leading-none -mt-0.5">маркетплейс</div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск товаров и продавцов..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 bg-white transition-colors"
            />
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Icon name="User" size={16} />
              <span className="hidden sm:inline">Войти</span>
            </button>
            <button className="relative flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
              <Icon name="ShoppingCart" size={16} className="text-white" />
              <span className="hidden sm:inline">Корзина</span>
              {cartCount > 0 && (
                <span className="ml-0.5 bg-white text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="max-w-6xl mx-auto px-6 flex gap-0 border-t border-gray-50 overflow-x-auto">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`px-4 py-2.5 text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeSection === link.id
                  ? "border-gray-900 text-gray-900 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </header>

      {/* HERO */}
      <section id="home" className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <p className="text-sm text-gray-400 mb-4 tracking-wide uppercase font-medium">Маркетплейс · 50 000+ товаров</p>
            <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight text-gray-900 mb-6">
              Всё лучшее —<br />в одном месте
            </h1>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-sm">
              Товары от проверенных продавцов со всей страны. Честные отзывы и быстрая доставка.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-7 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                Начать покупки
              </button>
              <button className="px-7 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                Стать продавцом
              </button>
            </div>
            <div className="flex gap-8 mt-10 pt-8 border-t border-gray-100">
              {[
                { value: "50 000+", label: "товаров" },
                { value: "2 400+", label: "продавцов" },
                { value: "4.8", label: "рейтинг" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-gray-900">{s.value}</div>
                  <div className="text-sm text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block animate-fade-up animate-delay-200">
            <img
              src={HERO_IMG}
              alt="Маркетплейс"
              className="w-full rounded-2xl object-cover grayscale"
              style={{ maxHeight: 380 }}
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Категории</h2>
              <p className="text-gray-400 mt-1 text-sm">Найди то, что ищешь</p>
            </div>
            <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
              Все <Icon name="ChevronRight" size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="category-card bg-white p-6 flex flex-col gap-2">
                <span className="text-3xl">{cat.emoji}</span>
                <div className="font-semibold text-gray-900 text-sm">{cat.name}</div>
                <div className="text-xs text-gray-400">{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section id="popular" className="py-16 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Популярное</h2>
              <p className="text-gray-400 mt-1 text-sm">Товары, которые выбирают чаще всего</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-md hover:border-gray-400 transition-colors text-gray-600">По рейтингу</button>
              <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-md hover:border-gray-400 transition-colors text-gray-600">По отзывам</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCTS.map(product => (
              <div key={product.id} className="product-card bg-white border border-gray-100 rounded-xl overflow-hidden">
                {/* Image */}
                <div className="relative h-44 bg-gray-50 flex items-center justify-center">
                  <span className="text-6xl">{product.emoji}</span>
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                      {product.badge}
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:border-gray-300 transition-colors"
                  >
                    <span className="text-sm">{wishlist.includes(product.id) ? "♥" : "♡"}</span>
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{product.name}</h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <Stars rating={product.rating} />
                    <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  {/* Seller */}
                  <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-400">
                    <Icon name="ShoppingBag" size={11} />
                    <span>{product.seller}</span>
                    <span className="ml-auto">★ {product.sellerRating}</span>
                  </div>

                  {/* Price + action */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div>
                      <div className="font-black text-gray-900">{product.price.toLocaleString("ru-RU")} ₽</div>
                      {product.oldPrice && (
                        <div className="text-xs text-gray-400 line-through">{product.oldPrice.toLocaleString("ru-RU")} ₽</div>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        cartItems.includes(product.id)
                          ? "bg-gray-100 text-gray-600"
                          : "bg-gray-900 text-white hover:bg-gray-700"
                      }`}
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
      <section id="sales" className="py-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Акции</h2>
            <p className="text-gray-400 mt-1 text-sm">Успей купить по выгодной цене</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {SALES.map((sale, i) => (
              <div key={i} className="category-card border border-gray-100 rounded-xl p-6 bg-white">
                <div className="text-2xl mb-3">{sale.emoji}</div>
                <div className="text-3xl font-black text-gray-900 mb-1">{sale.discount}</div>
                <div className="font-semibold text-gray-700 mb-1">{sale.title}</div>
                <div className="text-xs text-gray-400 mb-4">Осталось {sale.ends}</div>
                <button className="text-sm font-medium text-gray-900 underline underline-offset-4 hover:no-underline transition-all">
                  Смотреть товары →
                </button>
              </div>
            ))}
          </div>

          <div className="relative rounded-xl overflow-hidden h-48">
            <img src={PRODUCTS_IMG} alt="Акции" className="w-full h-full object-cover grayscale" />
            <div className="absolute inset-0 bg-black/50 flex items-center px-10">
              <div className="text-white">
                <div className="text-xs uppercase tracking-widest mb-1 text-gray-300">Мегараспродажа</div>
                <div className="text-3xl font-black">до 70% на всё</div>
                <button className="mt-4 px-5 py-2.5 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                  Перейти
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Отзывы</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">★★★★★</span>
                <span className="font-black text-gray-900">4.8</span>
                <span className="text-sm text-gray-400">· 1 200+ отзывов</span>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors text-gray-700">
              Все отзывы
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REVIEWS.map((review, i) => (
              <div key={i} className="product-card bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{review.author}</div>
                    <div className="text-xs text-gray-400">{review.date}</div>
                  </div>
                  <div className="ml-auto text-sm">{"★".repeat(review.rating)}</div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">О платформе</p>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">
              Маркетплейс, которому доверяют тысячи
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8 text-sm">
              «Всети-города» объединяет проверенных продавцов из разных городов России. Гарантируем качество, честные отзывы и быструю доставку.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map((feat, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={feat.icon} size={15} className="text-gray-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{feat.title}</div>
                    <div className="text-xs text-gray-400">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-gray-100 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Стань продавцом</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Размести товары и начни продавать уже сегодня. Без абонентской платы.
            </p>
            <button className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors">
              Зарегистрироваться
            </button>
            <div className="mt-3 text-xs text-gray-400">Комиссия только с продаж</div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-16 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Контакты</h2>
            <p className="text-gray-400 mt-1 text-sm">Мы всегда рядом</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CONTACTS.map((c, i) => (
              <div key={i} className="category-card bg-white border border-gray-100 rounded-xl p-6">
                <div className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <Icon name={c.icon} size={16} className="text-gray-700" />
                </div>
                <div className="text-xs text-gray-400 mb-1">{c.title}</div>
                <div className="font-black text-gray-900">{c.value}</div>
                <div className="text-xs text-gray-400 mt-1">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-black text-gray-900">Всети-города</div>
          <div className="text-sm text-gray-400">© 2024 Всети-города. Маркетплейс проверенных товаров.</div>
          <div className="flex gap-5 text-sm text-gray-400">
            <button className="hover:text-gray-900 transition-colors">Условия</button>
            <button className="hover:text-gray-900 transition-colors">Конфиденциальность</button>
            <button className="hover:text-gray-900 transition-colors">Помощь</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
