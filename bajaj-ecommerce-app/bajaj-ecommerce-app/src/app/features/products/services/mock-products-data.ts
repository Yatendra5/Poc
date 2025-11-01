import { ProductData } from '../models/product-data';

export const MOCK_PRODUCTS: ProductData[] = [
  // Electronics Category
  {
    _id: "prod_001",
    name: "Samsung Galaxy S24 Ultra",
    sku: "SAM-S24U-256GB",
    description: "Latest flagship smartphone with AI-powered camera and S Pen",
    price: 89999,
    discount: 10,
    categoryId: {
      _id: "68fb559922793d723db16da8",
      name: "Electronics",
      slug: "electronics"
    },
    brand: "Samsung",
    images: [
      "https://picsum.photos/seed/phone1/400/400",
      "https://picsum.photos/seed/phone2/400/400"
    ],
    stock: 25,
    rating: 4.5,
    numReviews: 128,
    attributes: {
      color: "Titanium Black",
      material: "Glass & Aluminum",
      warranty: "1 Year"
    },
    isFeatured: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    _id: "prod_002",
    name: "MacBook Pro 14-inch M3",
    sku: "APL-MBP14-M3-512GB",
    description: "Professional laptop with M3 chip and stunning Liquid Retina XDR display",
    price: 199900,
    discount: 5,
    categoryId: {
      _id: "68fb559922793d723db16da8",
      name: "Electronics",
      slug: "electronics"
    },
    brand: "Apple",
    images: [
      "https://picsum.photos/seed/laptop1/400/400",
      "https://picsum.photos/seed/laptop2/400/400"
    ],
    stock: 15,
    rating: 4.8,
    numReviews: 89,
    attributes: {
      color: "Space Gray",
      material: "Aluminum",
      warranty: "1 Year"
    },
    isFeatured: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  },
  {
    _id: "prod_003",
    name: "Sony WH-1000XM5 Headphones",
    sku: "SNY-WH1000XM5-BLK",
    description: "Industry-leading noise canceling wireless headphones",
    price: 29990,
    discount: 15,
    categoryId: {
      _id: "68fb559922793d723db16da8",
      name: "Electronics",
      slug: "electronics"
    },
    brand: "Sony",
    images: [
      "https://picsum.photos/seed/headphones1/400/400",
      "https://picsum.photos/seed/headphones2/400/400"
    ],
    stock: 40,
    rating: 4.6,
    numReviews: 234,
    attributes: {
      color: "Black",
      material: "Plastic & Metal",
      warranty: "1 Year"
    },
    isFeatured: false,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  },

  // Fashion Category
  {
    _id: "prod_004",
    name: "Levi's 501 Original Jeans",
    sku: "LEV-501-ORIG-32",
    description: "Classic straight-leg jeans with authentic fit and timeless style",
    price: 4999,
    discount: 20,
    categoryId: {
      _id: "68fb559922793d723db16da9",
      name: "Fashion",
      slug: "fashion"
    },
    brand: "Levi's",
    images: [
      "https://picsum.photos/seed/jeans1/400/400",
      "https://picsum.photos/seed/jeans2/400/400"
    ],
    stock: 60,
    rating: 4.3,
    numReviews: 156,
    attributes: {
      color: "Dark Blue",
      material: "100% Cotton",
      warranty: "6 Months"
    },
    isFeatured: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },
  {
    _id: "prod_005",
    name: "Nike Air Max 270",
    sku: "NIK-AM270-WHT-9",
    description: "Lifestyle shoes with large Max Air unit and modern design",
    price: 12995,
    discount: 12,
    categoryId: {
      _id: "68fb559922793d723db16da9",
      name: "Fashion",
      slug: "fashion"
    },
    brand: "Nike",
    images: [
      "https://picsum.photos/seed/shoes1/400/400",
      "https://picsum.photos/seed/shoes2/400/400"
    ],
    stock: 35,
    rating: 4.4,
    numReviews: 198,
    attributes: {
      color: "White/Black",
      material: "Mesh & Synthetic",
      warranty: "6 Months"
    },
    isFeatured: true,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25")
  },

  // Home & Kitchen Category
  {
    _id: "prod_006",
    name: "Instant Pot Duo 7-in-1",
    sku: "INS-DUO7-6QT",
    description: "Multi-use pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer",
    price: 8999,
    discount: 25,
    categoryId: {
      _id: "68fb559922793d723db16daa",
      name: "Home & Kitchen",
      slug: "home-kitchen"
    },
    brand: "Instant Pot",
    images: [
      "https://picsum.photos/seed/cooker1/400/400",
      "https://picsum.photos/seed/cooker2/400/400"
    ],
    stock: 28,
    rating: 4.7,
    numReviews: 312,
    attributes: {
      color: "Stainless Steel",
      material: "Stainless Steel",
      warranty: "1 Year"
    },
    isFeatured: true,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05")
  },
  {
    _id: "prod_007",
    name: "Dyson V15 Detect Vacuum",
    sku: "DYS-V15-DETECT",
    description: "Cordless vacuum with laser dust detection and powerful suction",
    price: 49999,
    discount: 8,
    categoryId: {
      _id: "68fb559922793d723db16daa",
      name: "Home & Kitchen",
      slug: "home-kitchen"
    },
    brand: "Dyson",
    images: [
      "https://picsum.photos/seed/vacuum1/400/400",
      "https://picsum.photos/seed/vacuum2/400/400"
    ],
    stock: 12,
    rating: 4.6,
    numReviews: 87,
    attributes: {
      color: "Yellow/Purple",
      material: "ABS Plastic",
      warranty: "2 Years"
    },
    isFeatured: false,
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-01-30")
  },

  // Sports & Fitness Category
  {
    _id: "prod_008",
    name: "Peloton Bike+",
    sku: "PEL-BIKEPLUS-2024",
    description: "Premium indoor cycling bike with rotating HD touchscreen",
    price: 249500,
    discount: 0,
    categoryId: {
      _id: "68fb559922793d723db16dab",
      name: "Sports & Fitness",
      slug: "sports-fitness"
    },
    brand: "Peloton",
    images: [
      "https://picsum.photos/seed/bike1/400/400",
      "https://picsum.photos/seed/bike2/400/400"
    ],
    stock: 8,
    rating: 4.5,
    numReviews: 45,
    attributes: {
      color: "Black",
      material: "Steel & Aluminum",
      warranty: "1 Year"
    },
    isFeatured: true,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10")
  },
  {
    _id: "prod_009",
    name: "Fitbit Charge 6",
    sku: "FIT-CHARGE6-BLK",
    description: "Advanced fitness tracker with built-in GPS and heart rate monitoring",
    price: 15999,
    discount: 18,
    categoryId: {
      _id: "68fb559922793d723db16dab",
      name: "Sports & Fitness",
      slug: "sports-fitness"
    },
    brand: "Fitbit",
    images: [
      "https://picsum.photos/seed/fitbit1/400/400",
      "https://picsum.photos/seed/fitbit2/400/400"
    ],
    stock: 50,
    rating: 4.2,
    numReviews: 167,
    attributes: {
      color: "Black",
      material: "Silicone & Aluminum",
      warranty: "1 Year"
    },
    isFeatured: false,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18")
  },

  // Beauty & Health Category
  {
    _id: "prod_010",
    name: "Olay Regenerist Micro-Sculpting Cream",
    sku: "OLY-REGEN-CREAM-50ML",
    description: "Anti-aging moisturizer with amino-peptides and hyaluronic acid",
    price: 2499,
    discount: 15,
    categoryId: {
      _id: "68fb559922793d723db16dac",
      name: "Beauty & Health",
      slug: "beauty-health"
    },
    brand: "Olay",
    images: [
      "https://picsum.photos/seed/cream1/400/400",
      "https://picsum.photos/seed/cream2/400/400"
    ],
    stock: 75,
    rating: 4.3,
    numReviews: 289,
    attributes: {
      color: "White",
      material: "Cream",
      warranty: "N/A"
    },
    isFeatured: false,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12")
  },
  {
    _id: "prod_011",
    name: "Philips Sonicare DiamondClean",
    sku: "PHI-SONIC-DC-WHT",
    description: "Electric toothbrush with 5 cleaning modes and premium travel case",
    price: 19999,
    discount: 22,
    categoryId: {
      _id: "68fb559922793d723db16dac",
      name: "Beauty & Health",
      slug: "beauty-health"
    },
    brand: "Philips",
    images: [
      "https://picsum.photos/seed/toothbrush1/400/400",
      "https://picsum.photos/seed/toothbrush2/400/400"
    ],
    stock: 32,
    rating: 4.6,
    numReviews: 143,
    attributes: {
      color: "White",
      material: "Plastic & Metal",
      warranty: "2 Years"
    },
    isFeatured: true,
    createdAt: new Date("2024-02-03"),
    updatedAt: new Date("2024-02-03")
  },

  // Books & Stationery Category
  {
    _id: "prod_012",
    name: "Moleskine Classic Hard Cover Notebook",
    sku: "MOL-CLASSIC-A5-BLK",
    description: "Premium quality notebook with dotted pages and elastic closure",
    price: 1899,
    discount: 10,
    categoryId: {
      _id: "68fb559922793d723db16dad",
      name: "Books & Stationery",
      slug: "books-stationery"
    },
    brand: "Moleskine",
    images: [
      "https://picsum.photos/seed/notebook1/400/400",
      "https://picsum.photos/seed/notebook2/400/400"
    ],
    stock: 95,
    rating: 4.4,
    numReviews: 76,
    attributes: {
      color: "Black",
      material: "Paper & Cardboard",
      warranty: "N/A"
    },
    isFeatured: false,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08")
  },
  {
    _id: "prod_013",
    name: "The Psychology of Money",
    sku: "BOOK-POM-2024",
    description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel",
    price: 599,
    discount: 25,
    categoryId: {
      _id: "68fb559922793d723db16dad",
      name: "Books & Stationery",
      slug: "books-stationery"
    },
    brand: "Jaico Publishing",
    images: [
      "https://picsum.photos/seed/book1/400/400",
      "https://picsum.photos/seed/book2/400/400"
    ],
    stock: 120,
    rating: 4.7,
    numReviews: 234,
    attributes: {
      color: "Multi-color",
      material: "Paper",
      warranty: "N/A"
    },
    isFeatured: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  },

  // Toys & Baby Category
  {
    _id: "prod_014",
    name: "LEGO Creator Expert Taj Mahal",
    sku: "LEGO-TAJ-10256",
    description: "Detailed LEGO architectural model of the iconic Taj Mahal",
    price: 29999,
    discount: 12,
    categoryId: {
      _id: "68fb559922793d723db16dae",
      name: "Toys & Baby",
      slug: "toys-baby"
    },
    brand: "LEGO",
    images: [
      "https://picsum.photos/seed/lego1/400/400",
      "https://picsum.photos/seed/lego2/400/400"
    ],
    stock: 18,
    rating: 4.8,
    numReviews: 67,
    attributes: {
      color: "Multi-color",
      material: "ABS Plastic",
      warranty: "N/A"
    },
    isFeatured: true,
    createdAt: new Date("2024-02-08"),
    updatedAt: new Date("2024-02-08")
  },
  {
    _id: "prod_015",
    name: "Fisher-Price Rock 'n Play Sleeper",
    sku: "FP-RNP-SLEEPER",
    description: "Portable baby sleeper with soothing vibrations and music",
    price: 8999,
    discount: 20,
    categoryId: {
      _id: "68fb559922793d723db16dae",
      name: "Toys & Baby",
      slug: "toys-baby"
    },
    brand: "Fisher-Price",
    images: [
      "https://picsum.photos/seed/baby1/400/400",
      "https://picsum.photos/seed/baby2/400/400"
    ],
    stock: 25,
    rating: 4.3,
    numReviews: 112,
    attributes: {
      color: "Gray/White",
      material: "Fabric & Plastic",
      warranty: "1 Year"
    },
    isFeatured: false,
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22")
  },

  // Groceries Category
  {
    _id: "prod_016",
    name: "Organic Basmati Rice - 5kg",
    sku: "ORG-BASMATI-5KG",
    description: "Premium quality organic basmati rice, aged for superior aroma and taste",
    price: 899,
    discount: 8,
    categoryId: {
      _id: "68fb559922793d723db16daf",
      name: "Groceries",
      slug: "groceries"
    },
    brand: "Organic India",
    images: [
      "https://picsum.photos/seed/rice1/400/400",
      "https://picsum.photos/seed/rice2/400/400"
    ],
    stock: 150,
    rating: 4.2,
    numReviews: 189,
    attributes: {
      color: "White",
      material: "Rice",
      warranty: "N/A"
    },
    isFeatured: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    _id: "prod_017",
    name: "Himalayan Pink Salt - 1kg",
    sku: "HIM-PINK-SALT-1KG",
    description: "Pure Himalayan pink rock salt, unrefined and mineral-rich",
    price: 299,
    discount: 15,
    categoryId: {
      _id: "68fb559922793d723db16daf",
      name: "Groceries",
      slug: "groceries"
    },
    brand: "Tata Salt",
    images: [
      "https://picsum.photos/seed/salt1/400/400",
      "https://picsum.photos/seed/salt2/400/400"
    ],
    stock: 200,
    rating: 4.1,
    numReviews: 245,
    attributes: {
      color: "Pink",
      material: "Salt",
      warranty: "N/A"
    },
    isFeatured: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },

  // Automotive Category
  {
    _id: "prod_018",
    name: "Bosch Car Battery 12V 65Ah",
    sku: "BSH-BAT-12V-65AH",
    description: "Maintenance-free car battery with advanced lead-acid technology",
    price: 8999,
    discount: 10,
    categoryId: {
      _id: "68fb559922793d723db16db0",
      name: "Automotive",
      slug: "automotive"
    },
    brand: "Bosch",
    images: [
      "https://picsum.photos/seed/battery1/400/400",
      "https://picsum.photos/seed/battery2/400/400"
    ],
    stock: 45,
    rating: 4.4,
    numReviews: 98,
    attributes: {
      color: "Black",
      material: "Lead-Acid",
      warranty: "2 Years"
    },
    isFeatured: false,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  },
  {
    _id: "prod_019",
    name: "Michelin Pilot Sport 4 Tyre",
    sku: "MCH-PS4-225-45-R17",
    description: "High-performance summer tyre with excellent wet and dry grip",
    price: 12999,
    discount: 5,
    categoryId: {
      _id: "68fb559922793d723db16db0",
      name: "Automotive",
      slug: "automotive"
    },
    brand: "Michelin",
    images: [
      "https://picsum.photos/seed/tyre1/400/400",
      "https://picsum.photos/seed/tyre2/400/400"
    ],
    stock: 30,
    rating: 4.6,
    numReviews: 73,
    attributes: {
      color: "Black",
      material: "Rubber",
      warranty: "5 Years"
    },
    isFeatured: true,
    createdAt: new Date("2024-01-28"),
    updatedAt: new Date("2024-01-28")
  },

  // Jewellery Category
  {
    _id: "prod_020",
    name: "Tanishq Diamond Necklace Set",
    sku: "TAN-DIA-NECK-18K",
    description: "Elegant 18K gold diamond necklace set with matching earrings",
    price: 149999,
    discount: 3,
    categoryId: {
      _id: "68fb559922793d723db16db1",
      name: "Jewellery",
      slug: "jewellery"
    },
    brand: "Tanishq",
    images: [
      "https://picsum.photos/seed/jewelry1/400/400",
      "https://picsum.photos/seed/jewelry2/400/400"
    ],
    stock: 5,
    rating: 4.9,
    numReviews: 23,
    attributes: {
      color: "Gold",
      material: "18K Gold & Diamond",
      warranty: "1 Year"
    },
    isFeatured: true,
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-02-12")
  },
  {
    _id: "prod_021",
    name: "Titan Raga Women's Watch",
    sku: "TIT-RAGA-9710SM01",
    description: "Elegant women's analog watch with mother-of-pearl dial",
    price: 7995,
    discount: 12,
    categoryId: {
      _id: "68fb559922793d723db16db1",
      name: "Jewellery",
      slug: "jewellery"
    },
    brand: "Titan",
    images: [
      "https://picsum.photos/seed/watch1/400/400",
      "https://picsum.photos/seed/watch2/400/400"
    ],
    stock: 22,
    rating: 4.3,
    numReviews: 134,
    attributes: {
      color: "Silver",
      material: "Stainless Steel",
      warranty: "2 Years"
    },
    isFeatured: false,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  }
];