/**
 * TAZGA Jewelry — Full bilingual dictionary (Arabic / English)
 * Source of truth for every static string in the storefront.
 *
 * Usage:
 *   const { t } = useLanguage();
 *   t("nav.shop")           // → "المتجر" or "Shop"
 *   t("home.hero.title")    // → "حرفية تمتد" or "Craftsmanship Across"
 */

export type TranslationKey = keyof typeof translations;

export const translations = {
  // ─── Brand ───────────────────────────────────────────────────────────
  "brand.name": { ar: "تازجا", en: "TAZGA" },
  "brand.tagline": {
    ar: "هبة جبلي للحلي والمجوهرات",
    en: "Hiba Gebali for Jewelry",
  },

  // ─── Navigation ──────────────────────────────────────────────────────
  "nav.shop": { ar: "المتجر", en: "Shop" },
  "nav.collections": { ar: "المجموعات", en: "Collections" },
  "nav.about": { ar: "عن تازجا", en: "About" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact" },

  // ─── Language toggle ────────────────────────────────────────────────
  "lang.switch_to_en": { ar: "EN", en: "EN" },
  "lang.switch_to_ar": { ar: "عربي", en: "عربي" },
  "lang.switch_hint_en": { ar: "Switch to English", en: "Switch to English" },
  "lang.switch_hint_ar": { ar: "التحويل للعربية", en: "التحويل للعربية" },

  // ─── Theme ──────────────────────────────────────────────────────────
  "theme.dark": { ar: "غامق", en: "Dark" },
  "theme.lightDark": { ar: "غامق خفيف", en: "Light Dark" },
  "theme.toggle": { ar: "تبديل المظهر", en: "Toggle theme" },

  // ─── Home ────────────────────────────────────────────────────────────
  "home.hero.title_ar": { ar: "حرفية تمتد", en: "Craftsmanship Across" },
  "home.hero.subtitle_ar": { ar: "عبر الأجيال", en: "Generations" },
  "home.hero.title_en": {
    ar: "Craftsmanship Across Generations",
    en: "Craftsmanship Across Generations",
  },
  "home.hero.cta.shop": { ar: "تسوق الآن", en: "Shop Now" },
  "home.hero.cta.discover": { ar: "اكتشف", en: "Discover" },

  "home.trust.fast_shipping": { ar: "شحن سريع", en: "Fast Shipping" },
  "home.trust.quality_guarantee": { ar: "ضمان الجودة", en: "Quality Guarantee" },
  "home.trust.handcrafted": { ar: "صناعة يدوية", en: "Handcrafted" },
  "home.trust.easy_returns": { ar: "إرجاع سهل", en: "Easy Returns" },
  "home.trust.secure_payment": { ar: "دفع آمن", en: "Secure Payment" },

  "home.collections.title": { ar: "المجموعات", en: "THE COLLECTIONS" },
  "home.collections.subtitle": {
    ar: "تشكيلة فاخرة من المجوهرات المصرية الأصيلة",
    en: "A luxurious selection of authentic Egyptian jewelry",
  },

  "home.bestsellers.title": { ar: "الأكثر مبيعاً", en: "BESTSELLERS" },
  "home.bestsellers.subtitle": {
    ar: "اختيارات عملائنا المميزين",
    en: "Our clients' favorite picks",
  },
  "home.bestsellers.view_all": { ar: "عرض الكل", en: "View All" },

  "home.story.title": { ar: "صُنعت بالإرث", en: "CRAFTED WITH HERITAGE" },
  "home.story.body_en": {
    ar: "Since 1930, TAZGA has preserved the ancient art of Egyptian jewelry making. Each piece is hand-wrought in our Cairo workshop.",
    en: "Since 1930, TAZGA has preserved the ancient art of Egyptian jewelry making. Each piece is hand-wrought in our Cairo workshop.",
  },
  "home.story.body_ar": {
    ar: "منذ عام 1930، حافظت تازجا على فن صناعة المجوهرات المصرية الأصيلة. كل قطعة تصاغ يدوياً في ورشتنا بالقاهرة على أيدي حرفيين مهرة توارثوا هذا الفن عبر الأجيال.",
    en: "منذ عام 1930، حافظت تازجا على فن صناعة المجوهرات المصرية الأصيلة. كل قطعة تصاغ يدوياً في ورشتنا بالقاهرة على أيدي حرفيين مهرة توارثوا هذا الفن عبر الأجيال.",
  },
  "home.story.stat_years": { ar: "عاماً", en: "Years" },
  "home.story.stat_clients": { ar: "عميل", en: "Clients" },
  "home.story.stat_pieces": { ar: "قطعة", en: "Pieces" },

  "home.testimonials.title": { ar: "تجارب عملائنا", en: "CLIENT EXPERIENCES" },

  "home.newsletter.title": { ar: "انضم إلى المعرض", en: "JOIN THE GALLERY" },
  "home.newsletter.body": {
    ar: "اشترك لتلقي تحديثات عن المجموعات الجديدة والفعاليات الحصرية وقصص إبداعاتنا.",
    en: "Subscribe to receive updates on new collections, exclusive events, and the stories behind our creations.",
  },
  "home.newsletter.placeholder": {
    ar: "أدخل بريدك الإلكتروني",
    en: "Enter your email",
  },
  "home.newsletter.subscribe": { ar: "اشترك", en: "Subscribe" },
  "home.newsletter.subscribing": { ar: "جارٍ الاشتراك...", en: "Subscribing..." },
  "home.newsletter.success_title": {
    ar: "تم الاشتراك بنجاح",
    en: "Subscribed successfully",
  },
  "home.newsletter.success_body": {
    ar: "مرحباً بك في تازجا.",
    en: "Welcome to TAZGA.",
  },
  "home.newsletter.fail_title": {
    ar: "فشل الاشتراك",
    en: "Subscription Failed",
  },

  "home.product.add": { ar: "أضف", en: "Add" },
  "home.product.added_to_cart": { ar: "أضيف إلى الحقيبة", en: "Added to Bag" },
  "home.product.added_desc": {
    ar: "أضيف إلى حقيبتك.",
    en: "has been added to your shopping bag.",
  },
  "home.product.added_to_wishlist": {
    ar: "أضيف إلى المفضلة",
    en: "Added to Wishlist",
  },
  "home.product.removed_from_wishlist": {
    ar: "حُذف من المفضلة",
    en: "Removed from Wishlist",
  },

  // ─── Reviews ────────────────────────────────────────────────────────
  "review.1.title": { ar: "حرفية رائعة", en: "Incredible Craftsmanship" },
  "review.1.body": {
    ar: "التفاصيل على الخاتم الفرعوني رائعة. تحفة فنية حقيقية من الذهب.",
    en: "The detail on the pharaonic ring is exquisite. Truly a masterpiece of gold work.",
  },
  "review.2.title": { ar: "أناقة خالصة", en: "Pure Elegance" },
  "review.2.body": {
    ar: "شحن سريع، تغليف رائع، والسوار في غاية الجمال.",
    en: "Fast shipping, beautiful packaging, and the bracelet is absolutely stunning.",
  },
  "review.3.title": { ar: "جودة خالدة", en: "Timeless Quality" },
  "review.3.body": {
    ar: "مجوهرات تازجا دائماً تحكي قصة. القلادة التراثية أصبحت إمضائي اليومي.",
    en: "TAZGA jewelry always tells a story. The heritage necklace has become my daily signature piece.",
  },

  // ─── Shop page ──────────────────────────────────────────────────────
  "shop.title": { ar: "المتجر", en: "SHOP" },
  "shop.subtitle": { ar: "تسوق المجوهرات", en: "Shop the Jewelry" },
  "shop.search_placeholder": { ar: "بحث...", en: "Search..." },
  "shop.filter.all": { ar: "الكل", en: "All" },
  "shop.no_results_title": {
    ar: "لا توجد منتجات",
    en: "No products found",
  },
  "shop.no_results_body": {
    ar: "حاول تعديل البحث أو الفلاتر للعثور على ما تبحث عنه.",
    en: "Try adjusting your search or filters to find what you're looking for.",
  },
  "shop.clear_filters": { ar: "مسح الفلاتر", en: "Clear Filters" },
  "shop.featured_badge": { ar: "مميز", en: "Featured" },
  "shop.no_image": { ar: "لا توجد صورة", en: "No image" },

  // ─── Product detail ─────────────────────────────────────────────────
  "product.breadcrumb_home": { ar: "الرئيسية", en: "Home" },
  "product.breadcrumb_shop": { ar: "المتجر", en: "Shop" },
  "product.not_found": { ar: "المنتج غير موجود", en: "Product Not Found" },
  "product.return_to_shop": { ar: "العودة للمتجر", en: "Return to Shop" },
  "product.default_desc_en": {
    ar: "A beautiful piece of handcrafted jewelry.",
    en: "A beautiful piece of handcrafted jewelry.",
  },
  "product.default_desc_ar": {
    ar: "قطعة جميلة من المجوهرات المصنوعة يدوياً.",
    en: "قطعة جميلة من المجوهرات المصنوعة يدوياً.",
  },
  "product.add_to_bag": { ar: "أضف للحقيبة", en: "Add to Bag" },
  "product.out_of_stock": { ar: "غير متوفر", en: "Out of Stock" },
  "product.details": { ar: "التفاصيل", en: "Details" },
  "product.material": { ar: "الخامة", en: "Material" },
  "product.sku": { ar: "الرمز", en: "SKU" },
  "product.shipping_free": {
    ar: "شحن مجاني للطلبات فوق 500$",
    en: "Free shipping on all orders over $500",
  },
  "product.returns": {
    ar: "إرجاع مجاني خلال 14 يوم",
    en: "Complimentary returns within 14 days",
  },
  "product.warranty": {
    ar: "ضمان سنتين وشهادة أصالة",
    en: "2-year warranty & certificate of authenticity",
  },
  "product.related_title": { ar: "قد يعجبك أيضاً", en: "YOU MAY ALSO LIKE" },
  "product.added_to_cart": { ar: "أضيف إلى الحقيبة", en: "Added to Cart" },
  "product.added_to_cart_desc": {
    ar: "أضيف إلى حقيبة التسوق.",
    en: "added to your shopping bag.",
  },
  "product.added_to_wishlist": {
    ar: "أضيف إلى المفضلة",
    en: "Added to Wishlist",
  },
  "product.removed_from_wishlist": {
    ar: "حُذف من المفضلة",
    en: "Removed from Wishlist",
  },
  "product.wishlist_saved": { ar: "تم الحفظ لاحقاً.", en: "saved for later." },

  // ─── Cart ────────────────────────────────────────────────────────────
  "cart.title": { ar: "حقيبة التسوق", en: "SHOPPING BAG" },
  "cart.empty_title": { ar: "الحقيبة فارغة", en: "YOUR BAG IS EMPTY" },
  "cart.empty_body": {
    ar: "يبدو أنك لم تضف أي شيء إلى حقيبتك بعد. استكشف مجموعاتنا للعثور على القطعة المثالية.",
    en: "Looks like you haven't added anything to your bag yet. Explore our collections to find your perfect piece.",
  },
  "cart.continue_shopping": { ar: "متابعة التسوق", en: "Continue Shopping" },
  "cart.summary": { ar: "ملخص الطلب", en: "ORDER SUMMARY" },
  "cart.subtotal": { ar: "المجموع الفرعي", en: "Subtotal" },
  "cart.shipping": { ar: "الشحن", en: "Shipping" },
  "cart.shipping_free": { ar: "مجاني", en: "Complimentary" },
  "cart.total": { ar: "الإجمالي", en: "TOTAL" },
  "cart.item_total": { ar: "الإجمالي", en: "Total" },
  "cart.proceed_checkout": { ar: "إتمام الشراء", en: "Proceed to Checkout" },
  "cart.secure_checkout": { ar: "دفع آمن", en: "Secure Checkout" },
  "cart.removed_title": { ar: "تمت إزالة القطعة", en: "Item Removed" },
  "cart.removed_desc": {
    ar: "تمت إزالة القطعة من حقيبة التسوق بنجاح.",
    en: "has been removed from your shopping bag.",
  },

  // ─── Wishlist ───────────────────────────────────────────────────────
  "wishlist.title": { ar: "قائمة الرغبات", en: "MY WISHLIST" },
  "wishlist.empty_title": {
    ar: "قائمة الرغبات فارغة",
    en: "YOUR WISHLIST IS EMPTY",
  },
  "wishlist.empty_body": {
    ar: "احفظ قطعك المفضلة هنا لتجدها بسهولة لاحقاً أو تشاركها مع شخص مميز.",
    en: "Save your favorite pieces here to easily find them later or share with someone special.",
  },
  "wishlist.discover": {
    ar: "اكتشف المجموعات",
    en: "Discover Collections",
  },
  "wishlist.move_to_bag": { ar: "أضف للحقيبة", en: "MOVE TO BAG" },
  "wishlist.items_count_one": { ar: "قطعة", en: "item" },
  "wishlist.items_count_other": { ar: "قطعة", en: "items" },
  "wishlist.saved_label": { ar: "محفوظة", en: "saved" },
  "wishlist.out_of_stock": { ar: "غير متوفر", en: "Out of stock" },
  "wishlist.removed": { ar: "تمت الإزالة من قائمة الرغبات", en: "Removed from Wishlist" },
  "wishlist.moved_to_cart": {
    ar: "تمت إضافة القطعة لحقيبة التسوق",
    en: "Moved to Shopping Bag",
  },
  "wishlist.out_of_stock_title": { ar: "القطعة غير متوفرة", en: "Item Unavailable" },
  "wishlist.out_of_stock_desc": {
    ar: "عذراً، هذه القطعة غير متوفرة في المخزن حالياً.",
    en: "Sorry, this piece is currently out of stock.",
  },

  // ─── Collections ────────────────────────────────────────────────────
  "collections.title": { ar: "مجموعاتنا", en: "OUR COLLECTIONS" },
  "collections.subtitle": { ar: "المجموعات الحصرية", en: "Exclusive Collections" },
  "collections.empty": {
    ar: "لا توجد مجموعات متاحة حالياً.",
    en: "No collections available at the moment.",
  },
  "collections.no_image": { ar: "لا توجد صورة", en: "No Image" },
  "collections.explore": { ar: "استكشف المجموعة", en: "Explore Collection" },
  "collections.not_found": {
    ar: "المجموعة غير موجودة",
    en: "Collection Not Found",
  },
  "collections.return": { ar: "العودة للمجموعات", en: "Return to Collections" },
  "collections.pieces_count": { ar: "قطعة", en: "Pieces" },
  "collections.empty_products": {
    ar: "لا تتوفر أي منتجات في هذه المجموعة حالياً.",
    en: "No products available in this collection yet.",
  },

  // ─── About ──────────────────────────────────────────────────────────
  "about.title": { ar: "من نحن", en: "ABOUT US" },
  "about.tagline": {
    ar: "تازجا.. إرث من الحرفية والإبداع يمتد منذ عام ١٩٣٠",
    en: "TAZGA.. A legacy of craftsmanship and creativity since 1930",
  },

  // ─── Our Story (3-generation family narrative) ─────────────────────
  "about.story_eyebrow": { ar: "قصتنا", en: "OUR STORY" },
  "about.story_p1": {
    ar: "بدأت الرحلة في ثلاثينيات القرن الماضي مع السيد جلال، رجل آمن بأن قيمة الإنسان الحقيقية تتجلى في عمل يديه، وأن المعدن يمكن أن يتحول إلى فنٍّ خالد يبقى بعد صانعه.",
    en: "The journey began in the 1930s with Mr. Galal, a man who believed that the true value of a person is reflected in the work of their hands, and that metal can be transformed into timeless art beyond its maker's life.",
  },
  "about.story_p2": {
    ar: "بعد عقود، حملت حفيدته هبة هذا الإرث إلى الأمام، مؤسسةً تازجا للمجوهرات كعلامة تجارية تربط بين أصالة الحرفية المصرية وروح التصميم العصري.",
    en: "Decades later, his granddaughter Heba carried that legacy forward, founding TAZGA Jewelry as a brand that bridges the authenticity of Egyptian craftsmanship with the spirit of modern design.",
  },
  "about.story_p3": {
    ar: "اليوم، يواصل أبناؤها — رامز، رزان، رعد، ورغد — كتابة الفصل التالي، جاعلين من تازجا للمجوهرات إرثاً حياً من العائلة والإبداع والأناقة الخالدة.",
    en: "Today, her children — Ramez, Razan, Raed, and Raghad — continue writing the next chapter, making TAZGA Jewelry a living heritage of family, creativity, and timeless elegance.",
  },
  "about.story_signature": {
    ar: "تازجا للمجوهرات... من السيد جلال إلى هبة، إلى رامز، رزان، رعد، ورغد.",
    en: "TAZGA Jewelry... from Mr. Galal to Heba, to Ramez, Razan, Raed, and Raghad.",
  },

  // ─── Heritage intro (kept for legacy SEO) ──────────────────────────
  "about.intro_1": {
    ar: "تازجا للمجوهرات (هبة جبلي للمجوهرات) علامة مصرية فاخرة مصنوعة يدوياً، متجذرة بعمق في الحضارة المصرية القديمة والتراث الفني الشرقي.",
    en: "TAZGA Jewelry (Hiba Gebali for Jewelry) is an Egyptian luxury handmade brand deeply rooted in Ancient Egyptian civilization and Oriental artistic heritage.",
  },
  "about.intro_2": {
    ar: "منذ أكثر من تسعة عقود، نصوغ قطعاً خالدة تتجاوز صيحات الموضة، نقدم لعملائنا ليس مجرد مجوهرات، بل فناً قابلاً للارتداء يحمل هوية ثقافية عميقة.",
    en: "For over nine decades, we have been crafting timeless pieces that transcend fashion trends, offering our clients not just jewelry, but wearable art that carries a profound cultural identity.",
  },

  // ─── Workshop ──────────────────────────────────────────────────────
  "about.workshop_title": { ar: "الورشة", en: "THE WORKSHOP" },
  "about.workshop_p1": {
    ar: "كل قطعة من تازجا تبدأ رحلتها في ورشتنا بالقاهرة. هنا، يستخدم أمهر الحرفيين تقنيات متوارثة عبر الأجيال، ليعطوا الحياة لتصاميم مستوحاة من تاريخنا العريق.",
    en: "Every TAZGA creation begins its life in our Cairo workshop. Here, master artisans employ techniques passed down through generations, working with precious metals and stones to breathe life into designs inspired by our rich history.",
  },
  "about.workshop_p2": {
    ar: "نؤمن أن الفخامة الحقيقية تكمن في التفاصيل. الانحناءة اللطيفة للخاتم، الإعداد الدقيق للأحجار الكريمة، اللمعان المثالي للذهب — هذه هي سمات حرفية تازجا.",
    en: "We believe that true luxury lies in the details. The gentle curve of a ring, the precise setting of a gemstone, the perfect polish of gold—these are the hallmarks of TAZGA craftsmanship.",
  },
  "about.workshop_p3_ar": {
    ar: "كل قطعة من مجوهرات تازجا تبدأ رحلتها في ورشتنا بالقاهرة. هنا، يستخدم أمهر الحرفيين تقنيات متوارثة عبر الأجيال، ليعطوا الحياة لتصاميم مستوحاة من تاريخنا العريق.",
    en: "كل قطعة من مجوهرات تازجا تبدأ رحلتها في ورشتنا بالقاهرة. هنا، يستخدم أمهر الحرفيين تقنيات متوارثة عبر الأجيال، ليعطوا الحياة لتصاميم مستوحاة من تاريخنا العريق.",
  },

  // ─── About Our Products (new section from screenshot) ──────────────
  "about.products_eyebrow": { ar: "عن منتجاتنا", en: "OUR PRODUCTS" },
  "about.products_title": { ar: "عن منتجاتنا", en: "About Our Products" },
  "about.products_intro": {
    ar: "مجوهراتنا أكثر من مجرد زينة... إنها قصص مصاغة من الفضة، والنحاس المطلي بالذهب، والنحاس المطلي بالفضة. كل قطعة تحمل لمسة حرفيٍّ متفانٍ وتصميماً يعكس روح صاحبها، لتصبح شاهدةً على لحظات لا تُنسى.",
    en: "Our jewelry is more than adornment... It is stories crafted in silver, gold-plated copper, and silver-plated copper. Each piece carries the touch of a devoted artisan and a design that reflects the soul of its wearer, becoming a witness to unforgettable moments.",
  },
  "about.products_outro": {
    ar: "إنها إبداعات تجسّد الأناقة، وتلتقط روح مصر، ومن قلبها تلهم العالم.",
    en: "They are creations that embody elegance, capture the spirit of Egypt, and from its heart, inspire the world.",
  },

  "about.products.excellence_title": {
    ar: "مصنوعة بإتقان",
    en: "Crafted with Excellence",
  },
  "about.products.excellence_1": {
    ar: "إتقان ودقة في كل تفصيلة مصنوعة يدوياً.",
    en: "Excellence and precision in every handcrafted detail.",
  },
  "about.products.excellence_2": {
    ar: "التزام بالجودة يعكس رؤيتك الفريدة.",
    en: "A commitment to quality that reflects your unique vision.",
  },
  "about.products.moments_title": {
    ar: "مصنوعة لتخلّد أثمن لحظات الحياة",
    en: "Crafted to capture life's most cherished moments.",
  },
  "about.products.moments_1": {
    ar: "مجوهرات تحتفي بلحظات الحياة.",
    en: "Jewelry that celebrates life's moments.",
  },
  "about.products.moments_2": {
    ar: "قطع تجعل كل مناسبة لا تُنسى.",
    en: "Pieces that make every occasion unforgettable.",
  },

  // ─── Arabic-only "من نحن" content (used when lang = ar) ────────────
  "about.ar_about_p1": {
    ar: "تعتبر تازجا للمجوهرات من أرقى وأشهر المحلات التي تقدم أفضل أنواع المجوهرات والأحجار الكريمة، حيث نحرص دائماً على توفير أجود المنتجات بأعلى جودة وأفضل الأسعار.",
    en: "TAZGA Jewelry is among the finest and most renowned boutiques offering the best types of jewelry and precious stones, always keen to provide the finest products with the highest quality and best prices.",
  },
  "about.ar_about_p2": {
    ar: "نحن في تازجا للمجوهرات نؤمن بأن العميل هو محور كل ما نقدمه، لذلك نسعى جاهدين لتقديم خدمة مميزة تليق بمكانة العميل.",
    en: "At TAZGA Jewelry we believe the client is the center of everything we offer, so we strive to deliver a distinctive service worthy of our clients.",
  },
  "about.ar_about_p3": {
    ar: "تتميز منتجاتنا بجمال التصميم وروعة الجودة، مما يجعلها الخيار الأمثل لكل من يبحث عن التميز والجودة.",
    en: "Our products are distinguished by beautiful design and magnificent quality, making them the ideal choice for anyone seeking distinction and quality.",
  },
  "about.ar_about_p4": {
    ar: "تازجا للمجوهرات هي علامة تجارية رائدة في عالم المجوهرات والأحجار الكريمة، وتقدم تشكيلة واسعة من المنتجات التي تلبي جميع الأذواق والاحتياجات.",
    en: "TAZGA Jewelry is a leading brand in the world of jewelry and precious stones, offering a wide range of products that meet all tastes and needs.",
  },
  "about.ar_about_p5": {
    ar: "نحن في تازجا للمجوهرات نؤمن بأن الجودة هي أساس النجاح، لذلك نحرص على توفير منتجاتنا بأعلى معايير الجودة.",
    en: "At TAZGA Jewelry we believe quality is the foundation of success, so we ensure our products meet the highest quality standards.",
  },
  "about.ar_about_p6": {
    ar: "تازجا للمجوهرات هي وجهتك الأولى للحصول على أفضل المجوهرات والأحجار الكريمة.",
    en: "TAZGA Jewelry is your first destination for the best jewelry and precious stones.",
  },

  // ─── Features (legacy) ─────────────────────────────────────────────
  "about.feature_1_title": { ar: "الهوية الثقافية", en: "CULTURAL IDENTITY" },
  "about.feature_1_desc": {
    ar: "تصاميم تردد عظمة مصر القديمة وجمال الفن الشرقي.",
    en: "Designs that echo the grandeur of Ancient Egypt and the intricate beauty of Oriental art.",
  },
  "about.feature_2_title": { ar: "صناعة يدوية", en: "HANDCRAFTED" },
  "about.feature_2_desc": {
    ar: "100% يدوية الصنع بواسطة أمهر صاغة المجوهرات، مما يضمن عدم تشابه قطعتين تماماً.",
    en: "100% handmade by master jewelers, ensuring that no two pieces are exactly alike.",
  },
  "about.feature_3_title": { ar: "جودة متحفية", en: "MUSEUM QUALITY" },
  "about.feature_3_desc": {
    ar: "تشطيب وتقديم فاخر يرتقي بكل قطعة إلى مرتبة الفن.",
    en: "Exquisite finishing and presentation that elevates each piece to the status of art.",
  },

  // ─── Contact ────────────────────────────────────────────────────────
  "contact.title": { ar: "تواصل معنا", en: "CONTACT US" },
  "contact.subtitle": { ar: "تواصل معنا", en: "Get in Touch" },
  "contact.intro_title": { ar: "ابقَ على تواصل", en: "GET IN TOUCH" },
  "contact.intro_body": {
    ar: "سواء كان لديك سؤال عن مجموعاتنا، أو تحتاج مساعدة في طلب، أو ترغب في الاستفسار عن القطع المخصصة، فريقنا هنا للمساعدة.",
    en: "Whether you have a question about our collections, need assistance with an order, or wish to inquire about bespoke creations, our team is here to help.",
  },
  "contact.boutique_title": { ar: "البوتيك والورشة", en: "BOUTIQUE & WORKSHOP" },
  "contact.boutique_address": {
    ar: "15 شارع صلاح الدين، الزمالك، القاهرة، مصر",
    en: "15 Salah El-Din St, Zamalek, Cairo, Egypt",
  },
  "contact.phone_title": { ar: "هاتف / واتساب", en: "PHONE / WHATSAPP" },
  "contact.email_title": { ar: "البريد الإلكتروني", en: "EMAIL" },
  "contact.hours_title": { ar: "ساعات العمل", en: "HOURS" },
  "contact.hours_weekdays": {
    ar: "السبت - الخميس: 10:00 ص - 9:00 م",
    en: "Saturday - Thursday: 10:00 AM - 9:00 PM",
  },
  "contact.hours_friday": { ar: "الجمعة: مغلق", en: "Friday: Closed" },
  "contact.form_title": { ar: "أرسل رسالة", en: "SEND A MESSAGE" },
  "contact.full_name": { ar: "الاسم الكامل", en: "Full Name" },
  "contact.email_address": { ar: "البريد الإلكتروني", en: "Email Address" },
  "contact.subject": { ar: "الموضوع", en: "Subject" },
  "contact.message": { ar: "الرسالة", en: "Message" },
  "contact.send": { ar: "إرسال", en: "Send Message" },
  "contact.sending": { ar: "جارٍ الإرسال...", en: "Sending..." },
  "contact.success_title": { ar: "تم إرسال الرسالة", en: "Message Sent" },
  "contact.success_body": {
    ar: "شكراً لتواصلك معنا. سنعود إليك قريباً.",
    en: "Thank you for reaching out. We will get back to you shortly.",
  },

  // ─── Checkout ───────────────────────────────────────────────────────
  "checkout.title": { ar: "إتمام الشراء", en: "Checkout" },
  "checkout.back_to_cart": { ar: "العودة للسلة", en: "Back to Bag" },
  "checkout.step_contact": { ar: "١. بيانات التواصل", en: "1. Contact Information" },
  "checkout.step_shipping": { ar: "٢. عنوان الشحن", en: "2. Shipping Address" },
  "checkout.step_payment": { ar: "٣. طريقة الدفع", en: "3. Payment Method" },
  "checkout.full_name": { ar: "الاسم الكامل *", en: "Full Name *" },
  "checkout.phone": { ar: "رقم الهاتف *", en: "Phone Number *" },
  "checkout.email": { ar: "البريد الإلكتروني", en: "Email" },
  "checkout.address": { ar: "العنوان التفصيلي *", en: "Full Address *" },
  "checkout.city": { ar: "المدينة *", en: "City *" },
  "checkout.notes": { ar: "ملاحظات إضافية", en: "Additional Notes" },
  "checkout.cash_on_delivery": { ar: "الدفع عند الاستلام", en: "Cash on Delivery" },
  "checkout.credit_card": {
    ar: "بطاقة ائتمانية / مدى",
    en: "Credit / Debit Card",
  },
  "checkout.whatsapp_note": {
    ar: "سيتم إرسال تفاصيل طلبك تلقائياً عبر واتساب لتأكيد الطلب والتواصل معك.",
    en: "Your order details will be sent automatically via WhatsApp to confirm the order.",
  },
  "checkout.summary": { ar: "ملخص الطلب", en: "Order Summary" },
  "checkout.quantity": { ar: "الكمية", en: "Qty" },
  "checkout.subtotal": { ar: "المجموع الفرعي", en: "Subtotal" },
  "checkout.shipping": { ar: "الشحن", en: "Shipping" },
  "checkout.shipping_free": { ar: "مجاني", en: "Free" },
  "checkout.total": { ar: "الإجمالي", en: "Total" },
  "checkout.confirm_whatsapp": {
    ar: "تأكيد الطلب عبر واتساب",
    en: "Confirm Order via WhatsApp",
  },
  "checkout.confirming": { ar: "جاري التأكيد...", en: "Confirming..." },
  "checkout.success_title": { ar: "تم تأكيد طلبك!", en: "Order Confirmed!" },
  "checkout.success_body": {
    ar: "شكراً لتسوقك من تازجا. تم إرسال طلبك وسيتواصل معك فريقنا قريباً عبر واتساب.",
    en: "Thank you for shopping with TAZGA Jewelry. Your order has been placed and our team will contact you shortly via WhatsApp.",
  },
  "checkout.order_id": { ar: "رقم الطلب", en: "Order ID" },
  "checkout.contact_whatsapp": {
    ar: "تواصل عبر واتساب",
    en: "Contact via WhatsApp",
  },
  "checkout.back_to_shop": { ar: "العودة للمتجر", en: "Back to Shop" },
  "checkout.success_toast_title": {
    ar: "تم تقديم الطلب بنجاح!",
    en: "Order Placed Successfully!",
  },
  "checkout.success_toast_desc": {
    ar: "سيتواصل معك فريق تازجا قريباً.",
    en: "TAZGA team will contact you soon.",
  },
  "checkout.fail_title": { ar: "فشل تقديم الطلب", en: "Order Failed" },
  "checkout.fail_desc": {
    ar: "حدث خطأ أثناء إتمام عملية الشراء. يرجى المحاولة لاحقاً.",
    en: "An error occurred during checkout. Please try again later.",
  },

  // ─── Footer ────────────────────────────────────────────────────────
  "footer.about": {
    ar: "معرض مجوهرات مصري رقمي حيث تلتقي 90 عامًا من الحرفية اليدوية بالفخامة العصرية. كل قطعة تحكي قصة.",
    en: "A digital Egyptian jewelry gallery where 90 years of handcraft meets modern luxury. Every piece tells a story.",
  },
  "footer.links": { ar: "روابط", en: "Links" },
  "footer.client_care": { ar: "خدمة العملاء", en: "Client Care" },
  "footer.faq": { ar: "الأسئلة الشائعة", en: "FAQ" },
  "footer.shipping": { ar: "الشحن والإرجاع", en: "Shipping & Returns" },
  "footer.care": { ar: "العناية بالمجوهرات", en: "Jewelry Care" },
  "footer.rights": { ar: "جميع الحقوق محفوظة.", en: "All rights reserved." },
  "footer.privacy": { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  "footer.terms": { ar: "شروط الخدمة", en: "Terms of Service" },
  "footer.follow_us": { ar: "تابعنا", en: "Follow Us" },

  // ─── Instagram banner ──────────────────────────────────────────────
  "instagram.follow_cta": {
    ar: "تابعنا على إنستجرام",
    en: "Follow us on Instagram",
  },
  "instagram.prev": { ar: "السابق", en: "Previous" },
  "instagram.next": { ar: "التالي", en: "Next" },

  // ─── Misc ──────────────────────────────────────────────────────────
  "common.loading": { ar: "جارٍ التحميل...", en: "Loading..." },
  "common.currency": { ar: "ج.م", en: "EGP" },
  "common.close": { ar: "إغلاق", en: "Close" },
  "common.open_menu": { ar: "فتح القائمة", en: "Open menu" },
} as const;

export type TranslationDict = typeof translations;
