import { Category, Product, DeliveryZone, DeliveryAddress, Order, Coupon, UserProfile } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    iconName: 'Tv',
    itemCount: 420,
    featuredImage: 'https://images.unsplash.com/photo-1593344484962-796055d4a3a4?auto=format&fit=crop&w=600&q=80',
    description: 'Smart TVs, soundbars, home theatres & gadgets'
  },
  {
    id: 'cat-phones',
    name: 'Phones and Accessories',
    slug: 'phones-and-accessories',
    iconName: 'Smartphone',
    itemCount: 650,
    featuredImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    description: 'Smartphones, earbuds, power banks, chargers & cases'
  },
  {
    id: 'cat-computers',
    name: 'Computers and Accessories',
    slug: 'computers-and-accessories',
    iconName: 'Laptop',
    itemCount: 310,
    featuredImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
    description: 'Laptops, desktops, SSDs, printers & monitors'
  },
  {
    id: 'cat-fashion',
    name: 'Fashion',
    slug: 'fashion',
    iconName: 'Shirt',
    itemCount: 890,
    featuredImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
    description: 'Kitenge wear, African print styles, casual & formal outfits'
  },
  {
    id: 'cat-shoes',
    name: 'Shoes',
    slug: 'shoes',
    iconName: 'Footprints',
    itemCount: 450,
    featuredImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    description: 'Men & women sneakers, loafers, heels & sandals'
  },
  {
    id: 'cat-textiles',
    name: 'Textiles',
    slug: 'textiles',
    iconName: 'Layers',
    itemCount: 220,
    featuredImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    description: 'Wax prints, curtains, bedding & authentic fabrics'
  },
  {
    id: 'cat-beauty',
    name: 'Beauty and Personal Care',
    slug: 'beauty-and-personal-care',
    iconName: 'Sparkles',
    itemCount: 520,
    featuredImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    description: 'Shea butter, skincare, organic oils & cosmetics'
  },
  {
    id: 'cat-home',
    name: 'Home and Kitchen',
    slug: 'home-and-kitchen',
    iconName: 'Utensils',
    itemCount: 680,
    featuredImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    description: 'Air fryers, blenders, cookware & organizers'
  },
  {
    id: 'cat-furniture',
    name: 'Furniture',
    slug: 'furniture',
    iconName: 'Armchair',
    itemCount: 190,
    featuredImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    description: 'Living room sets, office chairs, dining tables & beds'
  },
  {
    id: 'cat-foodstuff',
    name: 'Foodstuff and Groceries',
    slug: 'foodstuff-and-groceries',
    iconName: 'ShoppingBasket',
    itemCount: 940,
    featuredImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Fresh Matooke, rice, cooking oil, spices & dairy'
  },
  {
    id: 'cat-agric',
    name: 'Agricultural Products',
    slug: 'agricultural-products',
    iconName: 'Wheat',
    itemCount: 280,
    featuredImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
    description: 'High-yield seeds, fertilizers, organic feeds & solar pumps'
  },
  {
    id: 'cat-baby',
    name: 'Baby Products',
    slug: 'baby-products',
    iconName: 'Baby',
    itemCount: 340,
    featuredImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    description: 'Diapers, baby formula, strollers, clothing & toys'
  },
  {
    id: 'cat-sports',
    name: 'Sports and Fitness',
    slug: 'sports-and-fitness',
    iconName: 'Dumbbell',
    itemCount: 230,
    featuredImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    description: 'Gym gear, soccer balls, resistance bands & activewear'
  },
  {
    id: 'cat-automotive',
    name: 'Automotive Accessories',
    slug: 'automotive-accessories',
    iconName: 'Car',
    itemCount: 210,
    featuredImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    description: 'Car mats, dash cams, batteries & Boda-Boda spare parts'
  },
  {
    id: 'cat-stationery',
    name: 'Stationery',
    slug: 'stationery',
    iconName: 'BookOpen',
    itemCount: 380,
    featuredImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    description: 'Books, office paper, pens, filing cabinets & school supplies'
  },
  {
    id: 'cat-hardware',
    name: 'Hardware',
    slug: 'hardware',
    iconName: 'Wrench',
    itemCount: 290,
    featuredImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80',
    description: 'Power tools, paint, plumbing fittings, drills & locks'
  },
  {
    id: 'cat-health',
    name: 'Health and Lifestyle Products',
    slug: 'health-and-lifestyle-products',
    iconName: 'HeartPulse',
    itemCount: 310,
    featuredImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
    description: 'Vitamins, supplements, herbal teas & BP monitors'
  },
  {
    id: 'cat-gifts',
    name: 'Gifts',
    slug: 'gifts',
    iconName: 'Gift',
    itemCount: 180,
    featuredImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    description: 'Gift hampers, wristwatches, perfumes & personalized crafts'
  },
  {
    id: 'cat-general',
    name: 'Other General Merchandise',
    slug: 'other-general-merchandise',
    iconName: 'Package',
    itemCount: 410,
    featuredImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    description: 'Storage boxes, umbrellas, travel luggage & novelties'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Infinix Hot 30i - 6.6" HD+ - 4GB RAM + 128GB Storage - 5000mAh - Mirror Black',
    slug: 'infinix-hot-30i-4gb-128gb-black',
    category: 'Phones and Accessories',
    categoryId: 'cat-phones',
    brand: 'Infinix',
    description: 'The Infinix Hot 30i delivers exceptional battery endurance with its massive 5000mAh battery, crisp 90Hz 6.6" display, and ample 128GB internal storage expandable via microSD. Ideal for Ugandan mobile internet, social media, and dual-SIM versatility.',
    shortDescription: '6.6" 90Hz Display, 13MP Dual Camera, 128GB ROM, 5000mAh Fast Charge',
    basePrice: 560000,
    discountPrice: 450000,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    stockQuantity: 34,
    rating: 4.6,
    reviewCount: 122,
    isFeatured: true,
    isFlashDeal: true,
    flashDealEnd: '2026-08-30T23:59:59Z',
    isBestSeller: true,
    vendorId: 'ven-1',
    vendorName: 'Kampala Gadgets Hub',
    vendorLocation: 'Kampala Road, City Centre',
    variants: [
      { id: 'var-1a', variantName: 'Mirror Black (128GB)', sku: 'INF-H30I-BLK', additionalPrice: 0, stockQuantity: 20, colorHex: '#1e293b' },
      { id: 'var-1b', variantName: 'Glacier Blue (128GB)', sku: 'INF-H30I-BLU', additionalPrice: 10000, stockQuantity: 14, colorHex: '#0284c7' }
    ],
    specifications: {
      'Screen Size': '6.6 inches 90Hz HD+',
      'RAM': '4GB (+4GB Extended)',
      'Internal Storage': '128GB',
      'Battery': '5000 mAh with 18W Fast Charging',
      'Operating System': 'Android 12 (XOS)',
      'SIM': 'Dual Nano SIM 4G LTE'
    },
    warrantyInfo: '12 Months Carlcare Uganda Warranty',
    deliveryEstimatedHours: 'Same Day in Kampala / 24hrs Upcountry'
  },
  {
    id: 'prod-2',
    title: 'HP EliteBook 840 G5 - Intel Core i5 8th Gen - 16GB RAM - 512GB NVMe SSD - Backlit Keyboard',
    slug: 'hp-elitebook-840-g5-core-i5-16gb-512gb',
    category: 'Computers and Accessories',
    categoryId: 'cat-computers',
    brand: 'HP',
    description: 'Military-grade aluminium enterprise laptop perfect for university, office work, software development, and remote jobs. Features lightning-fast NVMe SSD and crisp 14-inch Full HD anti-glare screen with Bang & Olufsen audio.',
    shortDescription: 'Intel Core i5-8250U, 16GB DDR4, 512GB SSD, 14" FHD Display, Fingerprint Reader',
    basePrice: 1550000,
    discountPrice: 1250000,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    stockQuantity: 12,
    rating: 4.9,
    reviewCount: 45,
    isFeatured: true,
    isBestSeller: true,
    vendorId: 'ven-2',
    vendorName: 'Prime Computech Uganda',
    vendorLocation: 'Nkrumah Road, Kampala',
    specifications: {
      'Processor': 'Intel Core i5-8250U (Quad Core up to 3.4GHz)',
      'Memory': '16GB DDR4 High-Speed RAM',
      'Storage': '512GB M.2 NVMe Solid State Drive',
      'Display': '14-inch Full HD (1920 x 1080) IPS',
      'Ports': 'USB-C Thunderbolt, HDMI, USB 3.1, LAN',
      'Battery Life': 'Up to 6 hours continuous use'
    },
    warrantyInfo: '6 Months Replacement Warranty',
    deliveryEstimatedHours: 'Express Delivery Available'
  },
  {
    id: 'prod-3',
    title: 'Fresh Organic Matooke Bunch (Large Farm Size) - Direct From Mbarara Agro-Farms',
    slug: 'fresh-organic-matooke-bunch-large-mbarara',
    category: 'Foodstuff and Groceries',
    categoryId: 'cat-foodstuff',
    brand: 'Nakasero Fresh Direct',
    description: 'Harvested fresh at dawn from fertile volcanic soils of Western Uganda (Mbarara/Bushenyi). Plump, green, and rich in natural taste. Delivered safely in eco-friendly banana leaf wraps straight to your kitchen in Kampala and surrounding areas.',
    shortDescription: 'Heavyweight Grade-A Matooke bunch, naturally grown, fresh kitchen delivery',
    basePrice: 45000,
    discountPrice: 32000,
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80'
    ],
    stockQuantity: 80,
    rating: 4.8,
    reviewCount: 310,
    isFeatured: true,
    isBestSeller: true,
    vendorId: 'ven-3',
    vendorName: 'Nakasero Green Grocers',
    vendorLocation: 'Nakasero Market, Kampala',
    specifications: {
      'Weight': 'Approx 22 - 28 kg',
      'Origin': 'Mbarara & Ankole Highlands',
      'Organic Status': '100% Pesticide-Free Traditional Cultivation',
      'Shelf Life': '5-8 Days when kept in cool shade'
    },
    warrantyInfo: 'Guaranteed fresh on delivery or instant replacement',
    deliveryEstimatedHours: 'Morning 2-Hour Express Window'
  },
  {
    id: 'prod-4',
    title: 'Handcrafted Mens Genuine Leather Loafers - Rich Mahogany Brown - Standard Ugandan Fit',
    slug: 'handcrafted-mens-genuine-leather-loafers-brown',
    category: 'Shoes',
    categoryId: 'cat-shoes',
    brand: 'Kigozi Leather Craft',
    description: 'Premium Ugandan full-grain bovine leather with cushioned orthopedic insoles and durable vulcanized rubber soles. Hand-stitched by master cobblers in Jinja. Fits business casual, church wear, wedding events, and daily executive commute.',
    shortDescription: 'Genuine Ugandan Cowhide Leather, Soft Memory Foam Insole, Non-slip Sole',
    basePrice: 110000,
    discountPrice: 85000,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'
    ],
    stockQuantity: 28,
    rating: 4.7,
    reviewCount: 89,
    isFlashDeal: true,
    flashDealEnd: '2026-08-31T18:00:00Z',
    vendorId: 'ven-4',
    vendorName: 'Heritage Leatherworks Uganda',
    vendorLocation: 'Industrial Area, Jinja',
    variants: [
      { id: 'var-4a', variantName: 'Size 41 (UK 7.5)', sku: 'LOAFER-41-BRN', additionalPrice: 0, stockQuantity: 6 },
      { id: 'var-4b', variantName: 'Size 42 (UK 8.0)', sku: 'LOAFER-42-BRN', additionalPrice: 0, stockQuantity: 10 },
      { id: 'var-4c', variantName: 'Size 43 (UK 9.0)', sku: 'LOAFER-43-BRN', additionalPrice: 0, stockQuantity: 8 },
      { id: 'var-4d', variantName: 'Size 44 (UK 9.5)', sku: 'LOAFER-44-BRN', additionalPrice: 0, stockQuantity: 4 }
    ],
    specifications: {
      'Upper Material': '100% Genuine Full-grain Bovine Leather',
      'Lining': 'Breathable pigskin and moisture-wicking textile',
      'Outsole': 'Reinforced anti-skid rubber',
      'Closure': 'Slip-on ease'
    },
    warrantyInfo: '60-day sole stitch guarantee',
    deliveryEstimatedHours: 'Same Day in Kampala'
  },
  {
    id: 'prod-5',
    title: 'Digital Multifunctional 4.5L Air Fryer - Low Oil Healthy Cooker with Touch LED Presets',
    slug: 'digital-multifunctional-4-5l-air-fryer-led',
    category: 'Home and Kitchen',
    categoryId: 'cat-home',
    brand: 'MasterChef Pro',
    description: 'Cut cooking oil by up to 85% without sacrificing crispiness! Ideal for crispy chicken, tilapia fish, roasted sweet potatoes, samosas, and Irish potato chips. Equipped with rapid 360-degree hot air convection and non-stick basket.',
    shortDescription: '4.5 Litre Basket, 1400W Rapid Heat, 8 One-Touch Digital Presets, Dishwasher Safe',
    basePrice: 320000,
    discountPrice: 245000,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'
    ],
    stockQuantity: 18,
    rating: 4.8,
    reviewCount: 64,
    isFeatured: true,
    vendorId: 'ven-1',
    vendorName: 'Kampala Gadgets Hub',
    vendorLocation: 'Kampala Road, City Centre',
    specifications: {
      'Capacity': '4.5 Litres',
      'Power Rating': '1400 Watts / 220-240V Ugandan Grid',
      'Temperature Range': '80°C - 200°C',
      'Timer': '0 - 60 Minutes auto shut-off',
      'Preset Modes': 'Chips, Chicken, Fish, Steak, Bake, Pizza, Roast'
    },
    warrantyInfo: '1 Year Manufacturer Warranty',
    deliveryEstimatedHours: '2-4 Hours in Kampala'
  },
  {
    id: 'prod-6',
    title: 'Pure Northern Uganda Shea Butter (Nilotica Organics) - 500g Jar for Skin & Hair',
    slug: 'pure-northern-uganda-shea-butter-500g',
    category: 'Beauty and Personal Care',
    categoryId: 'cat-beauty',
    brand: 'Nilotica Botanics',
    description: 'Cold-pressed from wild Vitellaria Nilotica shea trees in Gulu and Lira. Unlike West African shea, Nilotica is exceptionally silky, melts effortlessly on skin contact, and is naturally rich in Vitamin A, E, and essential oleic acids.',
    shortDescription: '100% Unrefined Grade-A Shea Butter, Soft buttery texture, Deep hydration',
    basePrice: 35000,
    discountPrice: 25000,
    images: [
      'https://images.unsplash.com/photo-1608248597359-71531d0ebf0f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    stockQuantity: 120,
    rating: 4.9,
    reviewCount: 412,
    isBestSeller: true,
    vendorId: 'ven-5',
    vendorName: 'Amani Natural Organics',
    vendorLocation: 'Bugolobi Village Mall, Kampala',
    specifications: {
      'Net Weight': '500 grams',
      'Ingredient': '100% Pure Unrefined Vitellaria Nilotica Butter',
      'Extraction Method': 'Traditional Water extraction & Cold settling',
      'Country of Origin': 'Uganda (Acholi Sub-Region)'
    },
    warrantyInfo: 'Quality guaranteed, UNBS certified batch',
    deliveryEstimatedHours: 'Available for immediate dispatch'
  },
  {
    id: 'prod-7',
    title: 'Super Glue 50g Industrial Strength Multipurpose Fast Adhesive (Pack of 3)',
    slug: 'super-glue-50g-industrial-strength-adhesive-3pack',
    category: 'Hardware',
    categoryId: 'cat-hardware',
    brand: 'GripLock Fix',
    description: 'Bonds wood, metal, ceramics, leather, shoe soles, rubber, and plastics in under 10 seconds. Essential for workshop repairs, household maintenance, and automotive fixes.',
    shortDescription: 'Cyanoacrylate formula, 10-second rapid cure, precision needle nozzle',
    basePrice: 9000,
    discountPrice: 6500,
    images: [
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80'
    ],
    stockQuantity: 250,
    rating: 4.4,
    reviewCount: 2400,
    isBestSeller: true,
    vendorId: 'ven-6',
    vendorName: 'Kisenyi Hardware & Tools Depot',
    vendorLocation: 'Kisenyi, Kampala',
    specifications: {
      'Volume': '3 x 50g bottles',
      'Bonding Speed': '5-15 seconds',
      'Tensile Strength': 'High shear load capacity'
    },
    deliveryEstimatedHours: 'Same day dispatch'
  },
  {
    id: 'prod-8',
    title: 'Authentic 6-Yard African Kitenge Wax Fabric - Royal Green & Sunflower Gold Print',
    slug: 'authentic-6-yard-african-kitenge-wax-fabric-green-gold',
    category: 'Textiles',
    categoryId: 'cat-textiles',
    brand: 'Nytil Heritage',
    description: '100% premium combed cotton African wax print with double-sided vibrant coloring that never fades. Perfect for bespoke gomesi, modern bridal wear, tailored blazers, and luxury interior upholstery.',
    shortDescription: 'Full 6 Yards length, 100% Combed Cotton, Colorfast double-sided wax print',
    basePrice: 85000,
    discountPrice: 68000,
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
    ],
    stockQuantity: 45,
    rating: 4.9,
    reviewCount: 180,
    isFeatured: true,
    vendorId: 'ven-7',
    vendorName: 'Kiyembe Fabric Masters',
    vendorLocation: 'Kiyembe Lane, Kampala',
    specifications: {
      'Length': '6 Yards (Approx 5.48 meters)',
      'Width': '46-48 inches (Approx 120 cm)',
      'Material': '100% Combed Cotton Wax',
      'Care': 'Machine wash cold or dry clean'
    },
    deliveryEstimatedHours: 'Express delivery in Kampala'
  }
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-kla-central',
    name: 'Kampala Central & CBD',
    district: 'Kampala',
    baseFee: 4500,
    estimatedTime: '2 - 4 Hours (Express Boda-Boda)'
  },
  {
    id: 'zone-kla-suburbs',
    name: 'Kampala Suburbs (Bukoto, Ntinda, Kololo, Muyenga, Rubaga)',
    district: 'Kampala',
    baseFee: 6500,
    estimatedTime: '3 - 6 Hours (Same Day Delivery)'
  },
  {
    id: 'zone-wakiso',
    name: 'Wakiso District (Entebbe, Kira, Nansana, Gayaza, Kyengera)',
    district: 'Wakiso',
    baseFee: 9500,
    estimatedTime: 'Same Day / Within 12 Hours'
  },
  {
    id: 'zone-mukono',
    name: 'Mukono & Seeta Municipal',
    district: 'Mukono',
    baseFee: 12000,
    estimatedTime: 'Within 24 Hours'
  },
  {
    id: 'zone-upcountry-major',
    name: 'Upcountry Major Hubs (Jinja, Mbarara, Gulu, Masaka, Mbale)',
    district: 'Regional Uganda',
    baseFee: 18000,
    estimatedTime: '24 - 48 Hours via Courier Bus Service'
  }
];

export const INITIAL_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    recipientName: 'Celestine Mugerwa',
    phoneNumber: '+256 772 123 456',
    alternativePhone: '+256 701 987 654',
    district: 'Kampala',
    zoneId: 'zone-kla-suburbs',
    zoneName: 'Kampala Suburbs (Bukoto, Ntinda, Kololo)',
    streetAddress: 'Plot 14, Old Kira Road, Bukoto',
    landmark: 'Opposite TotalEnergies Petrol Station, next to Kabira Country Club gate',
    isDefault: true
  },
  {
    id: 'addr-2',
    recipientName: 'Celestine Mugerwa (Office)',
    phoneNumber: '+256 772 123 456',
    district: 'Kampala',
    zoneId: 'zone-kla-central',
    zoneName: 'Kampala Central & CBD',
    streetAddress: 'Course View Towers, 5th Floor, Yusuf Lule Road',
    landmark: 'Directly opposite Uganda Golf Club course entrance',
    isDefault: false
  }
];

export const COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discountType: 'PERCENTAGE',
    value: 0.10,
    minSpend: 50000,
    maxDiscount: 25000,
    description: '10% OFF your first order on CIZ Market (Max UGX 25,000)'
  },
  {
    code: 'MOMOFEST',
    discountType: 'FIXED',
    value: 15000,
    minSpend: 100000,
    description: 'UGX 15,000 instant discount on orders paid with MTN/Airtel MoMo'
  },
  {
    code: 'FREESHIP',
    discountType: 'FIXED',
    value: 6500,
    minSpend: 80000,
    description: 'Free delivery voucher for Kampala and Wakiso zones'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'CIZ-2026-89421',
    userId: 'usr-customer-1',
    customerName: 'Celestine Mugerwa',
    customerEmail: 'celwange@gmail.com',
    customerPhone: '+256 772 123 456',
    items: [
      {
        id: 'oi-1',
        productId: 'prod-1',
        productTitle: 'Infinix Hot 30i - 4GB RAM + 128GB - Mirror Black',
        productImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80',
        variantName: 'Mirror Black (128GB)',
        quantity: 1,
        unitPrice: 450000,
        totalPrice: 450000,
        vendorId: 'ven-1',
        vendorName: 'Kampala Gadgets Hub'
      },
      {
        id: 'oi-2',
        productId: 'prod-6',
        productTitle: 'Pure Northern Uganda Shea Butter - 500g Jar',
        productImage: 'https://images.unsplash.com/photo-1608248597359-71531d0ebf0f?auto=format&fit=crop&w=400&q=80',
        quantity: 2,
        unitPrice: 25000,
        totalPrice: 50000,
        vendorId: 'ven-5',
        vendorName: 'Amani Natural Organics'
      }
    ],
    subtotal: 500000,
    deliveryFee: 6500,
    discountAmount: 25000,
    totalAmount: 481500,
    deliveryAddress: INITIAL_ADDRESSES[0],
    paymentMethod: 'MTN_MOMO',
    paymentStatus: 'SUCCESSFUL',
    orderStatus: 'OUT_FOR_DELIVERY',
    trackingNumber: 'CIZ-TRK-77492-UG',
    createdAt: '2026-08-28T07:30:00Z',
    updatedAt: '2026-08-28T09:15:00Z',
    statusHistory: [
      { status: 'PENDING_PAYMENT', timestamp: '2026-08-28T07:30:00Z', note: 'Order created waiting for Mobile Money authorization.' },
      { status: 'PAID', timestamp: '2026-08-28T07:31:45Z', note: 'Payment verified from MTN MoMo (Ref: MTN-UG-984129).' },
      { status: 'PROCESSING', timestamp: '2026-08-28T07:45:00Z', note: 'Vendor packaged and verified item quality.' },
      { status: 'READY_FOR_PICKUP', timestamp: '2026-08-28T08:20:00Z', note: 'Package handed to Kampala Dispatch Hub.' },
      { status: 'SHIPPED', timestamp: '2026-08-28T08:50:00Z', note: 'Assigned to Express Delivery Agent.' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-08-28T09:15:00Z', note: 'Rider is on the way to Bukoto near Kabira Country Club.' }
    ],
    assignedAgent: {
      name: 'Brian Kigozi (Express Boda)',
      phone: '+256 702 443 112',
      vehiclePlate: 'UFA 489X (Boxer 150)',
      vehicleType: 'Express Motorcycle'
    }
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-customer-1',
  name: 'Celestine Mugerwa',
  email: 'celwange@gmail.com',
  phoneNumber: '+256 772 123 456',
  role: 'CUSTOMER',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  vendorInfo: {
    businessName: 'Kampala Gadgets Hub Ltd',
    status: 'APPROVED',
    tinNumber: '1004928192',
    payoutPhone: '+256 772 123 456',
    commissionRate: 8.0,
    rating: 4.8
  },
  deliveryInfo: {
    vehicleType: 'Bajaj Boxer 150cc',
    licensePlate: 'UFA 489X',
    activeZone: 'Kampala Central & Bukoto',
    completedTrips: 184
  }
};
