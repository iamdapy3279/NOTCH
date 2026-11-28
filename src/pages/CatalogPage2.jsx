import React, { useState, useEffect } from 'react';
import BrochureEmailModal from '../components/BrochureEmailModal';
import { 
  Menu, 
  X, 
  Send, 
  CheckCircle2,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const PLACEHOLDER_IMAGES = [
  '/assets/products2/placeholder_1.jpg',
  '/assets/products2/placeholder_2.jpg'
];

const CATEGORIES = [
  { id: 'all', name: 'All Products', count: 40 },
  { id: 'antilock-containers', name: 'Antilock Containers', count: 7 },
  { id: 'dip-cups-with-lids', name: 'Dip Cups With Lids', count: 3 },
  { id: 'clamshell', name: 'Clamshell', count: 4 },
  { id: 'meal-trays', name: 'Meal Trays', count: 9 },
  { id: 'trays', name: 'Trays', count: 5, subtitle: 'Without Lids' },
  { id: 'bowls', name: 'Bowls', count: 5, subtitle: 'Without Lids' },
  { id: 'plates', name: 'Plates', count: 7, subtitle: 'Without Lids' }
];

const PRODUCTS_LIST = [
  // ── 1. ANTILOCK CONTAINERS (6) ──
  {
    id: 'oval-container-500ml',
    name: 'Oval Container – 500ml',
    categoryId: 'antilock-containers',
    category: 'Antilock Containers',
    subCategory: 'Containers (Sold Separately)',
    image: '/assets/products2/catalog/antilock_oval_1.png',
    images: ['/assets/products2/catalog/antilock_oval_1.png', '/assets/products2/catalog/antilock_oval_2.png'],
    capacity: '500 ml',
    dimensions: 'Standard Oval',
    description: 'Molded sugarcane bagasse 500ml oval antilock container (sold separately from lid). Leak-resistant, microwave safe, and 100% compostable.'
  },
  {
    id: 'rectangle-container-750ml',
    name: 'Rectangle Container – 750ml',
    categoryId: 'antilock-containers',
    category: 'Antilock Containers',
    subCategory: 'Containers (Sold Separately)',
    image: '/assets/products2/catalog/antilock_rect_1.png',
    images: ['/assets/products2/catalog/antilock_rect_1.png', '/assets/products2/catalog/antilock_rect_2.png'],
    capacity: '750 ml',
    dimensions: 'Standard Rectangle',
    description: 'Sturdy 750ml rectangular bagasse antilock container (sold separately from lid). Engineered for hot and cold food delivery.'
  },
  {
    id: 'rectangle-container-1000ml',
    name: 'Rectangle Container – 1000ml',
    categoryId: 'antilock-containers',
    category: 'Antilock Containers',
    subCategory: 'Containers (Sold Separately)',
    image: '/assets/products2/catalog/antilock_rect_1.png',
    images: ['/assets/products2/catalog/antilock_rect_1.png', '/assets/products2/catalog/antilock_rect_2.png'],
    capacity: '1000 ml',
    dimensions: 'Large Rectangle',
    description: 'Generous 1000ml rectangular bagasse antilock container (sold separately from lid). Ideal for full meals, curries, and family-size portions.'
  },
  {
    id: 'antilock-oval-lid',
    name: 'Oval Lid',
    categoryId: 'antilock-containers',
    category: 'Antilock Containers',
    subCategory: 'Lids (Sold Separately)',
    image: '/assets/products2/catalog/antilock_oval_lid.jpg',
    images: ['/assets/products2/catalog/antilock_oval_lid.jpg'],
    capacity: 'Fits 500ml Oval Container',
    dimensions: 'Oval Antilock Fit',
    description: 'Precision-molded snap-fit oval lid designed for the 500ml Oval Antilock Container (sold separately).'
  },
  {
    id: 'antilock-rectangle-lid',
    name: 'Rectangle Lid',
    categoryId: 'antilock-containers',
    category: 'Antilock Containers',
    subCategory: 'Lids (Sold Separately)',
    image: '/assets/products2/catalog/antilock_rect_lid.jpg',
    images: ['/assets/products2/catalog/antilock_rect_lid.jpg'],
    capacity: 'Fits 750ml & 1000ml Rectangle Containers',
    dimensions: 'Rectangle Antilock Fit',
    description: 'Secure antilock rectangular lid engineered for leak-free food transport on 750ml and 1000ml rectangle containers (sold separately).'
  },
  {
    id: 'round-container-500ml',
    name: 'Round Container – 500ml',
    categoryId: 'antilock-containers',
    category: 'Antilock Containers',
    subCategory: 'Containers (Sold Separately)',
    image: '/assets/products2/catalog/antilock_round_1.jpg',
    images: ['/assets/products2/catalog/antilock_round_1.jpg', '/assets/products2/catalog/antilock_round_2.jpg'],
    capacity: '500 ml',
    dimensions: 'Standard Round',
    description: 'Molded sugarcane bagasse 500ml round antilock container (sold separately from lid). Leak-resistant, microwave safe, and 100% compostable.'
  },
  {
    id: 'round-container-lid',
    name: 'Round Container Lid',
    categoryId: 'antilock-containers',
    category: 'Antilock Containers',
    subCategory: 'Lids (Sold Separately)',
    image: '/assets/products2/catalog/antilock_round_container_lid.jpg',
    images: ['/assets/products2/catalog/antilock_round_container_lid.jpg'],
    capacity: 'Fits 500ml Round Container',
    dimensions: 'Round Antilock Fit',
    description: 'Precision-molded snap-fit round lid designed for the 500ml Round Antilock Container (sold separately).'
  },

  // ── 2. DIP CUPS WITH LIDS (3) ──
  {
    id: '1oz-dip-cup',
    name: '1oz Dip Cup',
    categoryId: 'dip-cups-with-lids',
    category: 'Dip Cups With Lids',
    subCategory: 'Dip Cups (Sold Separately)',
    image: '/assets/products2/catalog/dipcup_1oz_1.png',
    images: ['/assets/products2/catalog/dipcup_1oz_1.png', '/assets/products2/catalog/dipcup_1oz_2.png'],
    capacity: '1 oz',
    dimensions: '1oz Portion Cup',
    description: 'Compact 1oz biodegradable bagasse dip and condiment cup (sold separately from lid). Perfect for sauces, dressings, and chutneys.'
  },
  {
    id: '2oz-dip-cup',
    name: '2oz Dip Cup',
    categoryId: 'dip-cups-with-lids',
    category: 'Dip Cups With Lids',
    subCategory: 'Dip Cups (Sold Separately)',
    image: '/assets/products2/catalog/dipcup_2oz_1.png',
    images: ['/assets/products2/catalog/dipcup_2oz_1.png', '/assets/products2/catalog/dipcup_2oz_2.png'],
    capacity: '2 oz',
    dimensions: '2oz Portion Cup',
    description: '2oz plant-fiber dip and sauce cup (sold separately from lid). Grease-resistant and sturdy for hot or cold condiments.'
  },
  {
    id: 'universal-dip-cup-lid',
    name: 'Universal Dip Cup Lid (Fits 1oz & 2oz)',
    categoryId: 'dip-cups-with-lids',
    category: 'Dip Cups With Lids',
    subCategory: 'Lid (Sold Separately)',
    image: '/assets/products2/catalog/dipcup_lid.png',
    images: ['/assets/products2/catalog/dipcup_lid.png'],
    capacity: 'Fits 1oz & 2oz',
    dimensions: 'Universal Dip Cup Fit',
    description: 'Universal snap-on lid engineered to fit both 1oz and 2oz Dip Cups securely for spill-free takeout (sold separately).'
  },

  // ── 3. CLAMSHELL (4) ──
  {
    id: 'clamshell-regular-6x6',
    name: '6X6',
    categoryId: 'clamshell',
    category: 'Clamshell',
    subCategory: 'Regular',
    image: '/assets/products2/catalog/clamshell_reg_1.png',
    images: ['/assets/products2/catalog/clamshell_reg_1.png', '/assets/products2/catalog/clamshell_reg_2.png'],
    capacity: 'Regular (Single Compartment)',
    dimensions: '6 × 6 inch',
    description: '6×6 inch regular single-compartment hinged bagasse clamshell box. Ideal for burgers, sandwiches, snacks, and pastries.'
  },
  {
    id: 'clamshell-regular-8x8',
    name: '8X8',
    categoryId: 'clamshell',
    category: 'Clamshell',
    subCategory: 'Regular',
    image: '/assets/products2/catalog/clamshell_reg_1.png',
    images: ['/assets/products2/catalog/clamshell_reg_1.png', '/assets/products2/catalog/clamshell_reg_2.png'],
    capacity: 'Regular (Single Compartment)',
    dimensions: '8 × 8 inch',
    description: '8×8 inch regular hinged bagasse clamshell container. Heavy-duty construction for main courses and takeout meals.'
  },
  {
    id: 'clamshell-regular-9x9',
    name: '9X9',
    categoryId: 'clamshell',
    category: 'Clamshell',
    subCategory: 'Regular',
    image: '/assets/products2/catalog/clamshell_reg_1.png',
    images: ['/assets/products2/catalog/clamshell_reg_1.png', '/assets/products2/catalog/clamshell_reg_2.png'],
    capacity: 'Regular (Single Compartment)',
    dimensions: '9 × 9 inch',
    description: '9×9 inch regular single-compartment bagasse clamshell box designed for generous meal portions and catering.'
  },
  {
    id: 'clamshell-3cp-9x9',
    name: '9X9 3CP',
    categoryId: 'clamshell',
    category: 'Clamshell',
    subCategory: '3CP',
    image: '/assets/products2/catalog/clamshell_3cp_1.png',
    images: ['/assets/products2/catalog/clamshell_3cp_1.png', '/assets/products2/catalog/clamshell_3cp_2.png'],
    capacity: '3 Compartment (3CP)',
    dimensions: '9 × 9 inch',
    description: '9×9 inch 3-compartment (3CP) hinged bagasse clamshell box keeping main dishes and two sides neatly separated.'
  },

  // ── 4. MEAL TRAYS (12) ──
  {
    id: '3cp-meal-tray',
    name: '3CP Meal Tray',
    categoryId: 'meal-trays',
    category: 'Meal Trays',
    subCategory: 'Meal Trays (Sold Separately)',
    image: '/assets/products2/catalog/meal_3cp_new_1.jpg',
    images: ['/assets/products2/catalog/meal_3cp_new_1.jpg', '/assets/products2/catalog/meal_3cp_new_2.jpg'],
    capacity: '3 Compartment',
    dimensions: '3CP Standard',
    description: '3-compartment bagasse meal tray (sold separately from lid). Engineered for balanced meal delivery and portion control.'
  },
  {
    id: '5cp-square-meal-tray',
    name: '5CP Square Meal Tray',
    categoryId: 'meal-trays',
    category: 'Meal Trays',
    subCategory: 'Meal Trays (Sold Separately)',
    image: '/assets/products2/catalog/meal_5cp_1.png',
    images: ['/assets/products2/catalog/meal_5cp_1.png', '/assets/products2/catalog/meal_5cp_2.png'],
    capacity: '5 Compartment Square',
    dimensions: '5CP Square',
    description: '5-compartment square bagasse thali/meal tray (sold separately from lid) built for full-course meals and institutional dining.'
  },
  {
    id: '5cp-meal-tray-school',
    name: '5CP Meal Tray School',
    categoryId: 'meal-trays',
    category: 'Meal Trays',
    subCategory: 'Meal Trays (Sold Separately)',
    image: '/assets/products2/catalog/meal_5cp_school_1.jpg',
    images: ['/assets/products2/catalog/meal_5cp_school_1.jpg', '/assets/products2/catalog/meal_5cp_school_2.jpg'],
    capacity: '5 Compartment School',
    dimensions: '5CP School Format',
    description: '5-compartment school meal tray (sold separately from lid) sized for campus cafeterias, kids meals, and educational institutions.'
  },
  {
    id: '8cp-meal-tray',
    name: '8CP Meal Tray',
    categoryId: 'meal-trays',
    category: 'Meal Trays',
    subCategory: 'Meal Trays (Sold Separately)',
    image: '/assets/products2/catalog/meal_8cp_1.png',
    images: ['/assets/products2/catalog/meal_8cp_1.png', '/assets/products2/catalog/meal_8cp_2.png'],
    capacity: '8 Compartment',
    dimensions: '8CP Full Thali',
    description: '8-compartment multi-section bagasse meal tray (sold separately from lid) crafted for elaborate thalis and specialty platters.'
  },
  {
    id: '3cp-meal-tray-lid',
    name: '3CP Meal Tray Lid',
    categoryId: 'meal-trays',
    category: 'Meal Trays',
    subCategory: 'Lids (Sold Separately)',
    image: '/assets/products2/catalog/meal_3cp_lid.png',
    images: ['/assets/products2/catalog/meal_3cp_lid.png'],
    capacity: 'Fits 3CP Meal Tray',
    dimensions: '3CP Lid Fit',
    description: 'Matching snap-fit lid for the 3CP Meal Tray (sold separately) ensuring spill-resistant transport and stackability.'
  },
  {
    id: '4cp-square-meal-tray-lid',
    name: '4CP Square Meal Tray Lid',
    categoryId: 'meal-trays',
    category: 'Meal Trays',
    subCategory: 'Lids (Sold Separately)',
    image: '/assets/products2/catalog/meal_4cp_lid.png',
    images: ['/assets/products2/catalog/meal_4cp_lid.png'],
    capacity: 'Fits 4CP Square Meal Tray',
    dimensions: '4CP Square Lid Fit',
    description: 'Precision-fit lid for the 4CP Square Meal Tray (sold separately) designed for secure takeaway and catering transit.'
  },
  {
    id: '5cp-square-meal-tray-lid',
    name: '5CP Square Meal Tray Lid',
    categoryId: 'meal-trays',
    category: 'Meal Trays',
    subCategory: 'Lids (Sold Separately)',
    image: '/assets/products2/catalog/meal_5cp_lid.png',
    images: ['/assets/products2/catalog/meal_5cp_lid.png'],
    capacity: 'Fits 5CP Square Meal Tray',
    dimensions: '5CP Square Lid Fit',
    description: 'Dedicated lid for the 5CP Square Meal Tray (sold separately) offering tight closure and heat retention.'
  },
  {
    id: '5cp-meal-tray-school-lid',
    name: '5CP Meal Tray School Lid',
    categoryId: 'meal-trays',
    category: 'Meal Trays',
    subCategory: 'Lids (Sold Separately)',
    image: '/assets/products2/catalog/meal_5cp_lid.png',
    images: ['/assets/products2/catalog/meal_5cp_lid.png'],
    capacity: 'Fits 5CP Meal Tray School',
    dimensions: '5CP School Lid Fit',
    description: 'Matching lid for the 5CP Meal Tray School format (sold separately) for hygienic meal distribution.'
  },
  {
    id: '8cp-meal-tray-lid',
    name: '8CP Meal Tray Lid',
    categoryId: 'meal-trays',
    category: 'Meal Trays',
    subCategory: 'Lids (Sold Separately)',
    image: '/assets/products2/catalog/meal_8cp_lid.jpg',
    images: ['/assets/products2/catalog/meal_8cp_lid.jpg'],
    capacity: 'Fits 8CP Meal Tray',
    dimensions: '8CP Lid Fit',
    description: 'Full-coverage lid for the 8CP Meal Tray (sold separately) engineered to keep multi-dish thalis intact in transit.'
  },

  // ── 5. TRAYS (WITHOUT LIDS) (5) ──
  {
    id: '1d-tray',
    name: '1D Tray',
    categoryId: 'trays',
    category: 'Trays',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/tray_1d_1.png',
    images: ['/assets/products2/catalog/tray_1d_1.png', '/assets/products2/catalog/tray_1d_2.png'],
    capacity: '1D Format',
    dimensions: '1D Tray',
    description: '1D molded sugarcane bagasse serving tray (without lid). Rigid, oil-resistant, and 100% compostable.'
  },
  {
    id: '2d-tray',
    name: '2D Tray',
    categoryId: 'trays',
    category: 'Trays',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/tray_2d_1.png',
    images: ['/assets/products2/catalog/tray_2d_1.png', '/assets/products2/catalog/tray_2d_2.png'],
    capacity: '2D Format',
    dimensions: '2D Tray',
    description: '2D bagasse food service tray (without lid) suited for snacks, combos, and quick-service dining.'
  },
  {
    id: '3d-tray',
    name: '3D Tray',
    categoryId: 'trays',
    category: 'Trays',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/tray_3d_1.png',
    images: ['/assets/products2/catalog/tray_3d_1.png', '/assets/products2/catalog/tray_3d_2.png'],
    capacity: '3D Format',
    dimensions: '3D Tray',
    description: '3D compartmentalized bagasse serving tray (without lid) built for dine-in and buffet service.'
  },
  {
    id: '4d-tray',
    name: '4D Tray',
    categoryId: 'trays',
    category: 'Trays',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/tray_4d_1.png',
    images: ['/assets/products2/catalog/tray_4d_1.png', '/assets/products2/catalog/tray_4d_2.png'],
    capacity: '4D Format',
    dimensions: '4D Tray',
    description: '4D bagasse serving tray (without lid) offering durable support for hot and cold dishes.'
  },
  {
    id: 'oval-tray',
    name: 'Oval Tray',
    categoryId: 'trays',
    category: 'Trays',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/tray_oval_1.png',
    images: ['/assets/products2/catalog/tray_oval_1.png', '/assets/products2/catalog/tray_oval_2.png'],
    capacity: 'Oval Format',
    dimensions: 'Oval Tray',
    description: 'Classic oval sugarcane bagasse platter tray (without lid) ideal for appetizers, entrees, and event catering.'
  },

  // ── 6. BOWLS (WITHOUT LIDS) (5) ──
  {
    id: '150ml-square-dona',
    name: '150ml Square DONA',
    categoryId: 'bowls',
    category: 'Bowls',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/bowl_square_1.png',
    images: ['/assets/products2/catalog/bowl_square_1.png', '/assets/products2/catalog/bowl_square_2.png'],
    capacity: '150 ml',
    dimensions: 'Square DONA',
    description: '150ml square bagasse DONA bowl (without lid) designed for desserts, snacks, chaat, and side servings.'
  },
  {
    id: '6oz-bowl',
    name: '6oz Bowl',
    categoryId: 'bowls',
    category: 'Bowls',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/bowl_round_1.png',
    images: ['/assets/products2/catalog/bowl_round_1.png', '/assets/products2/catalog/bowl_round_2.png'],
    capacity: '6 oz',
    dimensions: '6oz Standard Bowl',
    description: '6oz bagasse bowl (without lid) crafted for sides, sweets, raita, and tasting portions.'
  },
  {
    id: '8oz-bowl',
    name: '8oz Bowl',
    categoryId: 'bowls',
    category: 'Bowls',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/bowl_round_1.png',
    images: ['/assets/products2/catalog/bowl_round_1.png', '/assets/products2/catalog/bowl_round_2.png'],
    capacity: '8 oz',
    dimensions: '8oz Standard Bowl',
    description: '8oz versatile bagasse bowl (without lid) suitable for hot dals, salads, soups, and desserts.'
  },
  {
    id: '12oz-bowl',
    name: '12oz Bowl',
    categoryId: 'bowls',
    category: 'Bowls',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/bowl_round_1.png',
    images: ['/assets/products2/catalog/bowl_round_1.png', '/assets/products2/catalog/bowl_round_2.png'],
    capacity: '12 oz',
    dimensions: '12oz Deep Bowl',
    description: '12oz deep sugarcane bagasse bowl (without lid) engineered for soups, noodle bowls, curries, and grain bowls.'
  },
  {
    id: '120ml-round-bowl',
    name: '120ml Round Bowl',
    categoryId: 'bowls',
    category: 'Bowls',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/bowl_round_1.png',
    images: ['/assets/products2/catalog/bowl_round_1.png', '/assets/products2/catalog/bowl_round_2.png'],
    capacity: '120 ml',
    dimensions: '120ml Round Bowl',
    description: '120ml round bagasse bowl (without lid) ideal for condiments, chutneys, desserts, and small side portions.'
  },

  // ── 7. PLATES (WITHOUT LIDS) (7) ──
  {
    id: '6-inch-round-plain-plate',
    name: '6-inch Round Plain Plate',
    categoryId: 'plates',
    category: 'Plates',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/plate_round_1.png',
    images: ['/assets/products2/catalog/plate_round_1.png', '/assets/products2/catalog/plate_round_2.png'],
    capacity: '6 Inch Plain',
    dimensions: '6 inch Round',
    description: '6-inch round plain sugarcane bagasse quarter plate (without lid) for appetizers, pastries, and snacks.'
  },
  {
    id: '7-inch-round-plain-plate',
    name: '7-inch Round Plain Plate',
    categoryId: 'plates',
    category: 'Plates',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/plate_round_1.png',
    images: ['/assets/products2/catalog/plate_round_1.png', '/assets/products2/catalog/plate_round_2.png'],
    capacity: '7 Inch Plain',
    dimensions: '7 inch Round',
    description: '7-inch round plain bagasse plate (without lid) suited for starters, salads, and dessert service.'
  },
  {
    id: '7-inch-square-plain-plate',
    name: '7-inch Square Plain Plate',
    categoryId: 'plates',
    category: 'Plates',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/plate_square_1.png',
    images: ['/assets/products2/catalog/plate_square_1.png', '/assets/products2/catalog/plate_square_2.png'],
    capacity: '7 Inch Square Plain',
    dimensions: '7 inch Square',
    description: '7-inch square plain bagasse plate (without lid) offering modern presentation for catering and events.'
  },
  {
    id: '8-inch-round-plain-plate',
    name: '8-inch Round Plain Plate',
    categoryId: 'plates',
    category: 'Plates',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/plate_round_1.png',
    images: ['/assets/products2/catalog/plate_round_1.png', '/assets/products2/catalog/plate_round_2.png'],
    capacity: '8 Inch Plain',
    dimensions: '8 inch Round',
    description: '8-inch round plain bagasse luncheon plate (without lid). Rigid, cut-resistant, and PFAS-free.'
  },
  {
    id: '11-inch-round-plain-plate',
    name: '11-inch Round Plain Plate',
    categoryId: 'plates',
    category: 'Plates',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/plate_round_1.png',
    images: ['/assets/products2/catalog/plate_round_1.png', '/assets/products2/catalog/plate_round_2.png'],
    capacity: '11 Inch Plain',
    dimensions: '11 inch Round',
    description: '11-inch round plain full-size dinner plate (without lid) crafted from 100% natural sugarcane bagasse.'
  },
  {
    id: '11-inch-round-4cp-plate',
    name: '11-inch Round 4CP Plate',
    categoryId: 'plates',
    category: 'Plates',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/plate_round_4cp.jpg',
    images: ['/assets/products2/catalog/plate_round_4cp.jpg'],
    capacity: '11 Inch (4 CP)',
    dimensions: '11 inch Round 4CP',
    description: '11-inch round 4-compartment (4CP) bagasse plate (without lid) keeping curries, breads, and sides neatly separated.'
  },
  {
    id: '12-inch-round-4cp-plate',
    name: '12-inch Round 4CP Plate',
    categoryId: 'plates',
    category: 'Plates',
    subCategory: 'Without Lids',
    image: '/assets/products2/catalog/plate_round_4cp.jpg',
    images: ['/assets/products2/catalog/plate_round_4cp.jpg'],
    capacity: '12 Inch (4 CP)',
    dimensions: '12 inch Round 4CP',
    description: '12-inch large round 4-compartment (4CP) bagasse banquet plate (without lid) for generous full-course meals.'
  }
];

export default function CatalogPage2({ navigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [brochureToast, setBrochureToast] = useState(false);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);

  // Category & Modal state
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedViewProduct, setSelectedViewProduct] = useState(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const openProductView = (product) => {
    setSelectedViewProduct(product);
    setActiveSlideIdx(0);
  };

  const visibleCategories = activeCategory === 'all'
    ? CATEGORIES.filter((c) => c.id !== 'all')
    : CATEGORIES.filter((c) => c.id === activeCategory);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-slideshow for product popup images
  useEffect(() => {
    if (!selectedViewProduct) return undefined;
    const count = selectedViewProduct.images?.length || 1;
    if (count <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % count);
    }, 2800);
    return () => clearInterval(timer);
  }, [selectedViewProduct]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 120) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY - 4) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY + 4) {
        setShowHeader(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleBrochureDownload = () => {
    setIsBrochureModalOpen(true);
  };

  const handleBrochureSuccess = () => {
    setBrochureToast(true);
    setTimeout(() => setBrochureToast(false), 3500);
  };

  const openInquiry = (productName) => {
    setInquiryProduct(productName);
    setInquirySubmitted(false);
    setSelectedViewProduct(null);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquiryProduct(null);
      setInquirySubmitted(false);
    }, 2500);
  };

  const goHome2 = (hash = '') => {
    if (navigate) {
      navigate('/homepage-2');
      if (hash) {
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    } else {
      window.location.href = `/homepage-2${hash ? '#' + hash : ''}`;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F4EFE6] text-[#1B251D] font-['Plus_Jakarta_Sans'] overflow-x-hidden selection:bg-[#28543E] selection:text-white">
      
      {/* ── BACKGROUND DECORATIVE CONCENTRIC CIRCLES (Matching Reference) ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden flex items-center justify-center">
        {[500, 680, 860, 1040, 1220, 1400, 1600].map((size, idx) => (
          <div
            key={idx}
            style={{ width: `${size}px`, height: `${size}px` }}
            className="absolute rounded-full border border-[#DFD8CA]/65"
          />
        ))}
      </div>

      {/* ── BROCHURE TOAST NOTIFICATION ── */}
      {brochureToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#28543E] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={20} className="text-[#86ea9a]" />
          <div className="text-sm font-medium">
            Preparing <strong>Product Catalogue (PDF)</strong>...
          </div>
        </div>
      )}

      {/* ── 1. TOP HEADER (Logo, Pill Navigation, Download Brochure) ── */}
      <header className="relative z-30 max-w-[1280px] mx-auto px-6 lg:px-10 pt-6 pb-4 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => goHome2()}
        >
          <img 
            src="/assets/homepage2/notch_logo.png" 
            alt="NOTCH" 
            className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
          />
        </div>

        {/* Center Pill Nav (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#E5DEC9]/65 backdrop-blur-xl px-2.5 py-1.5 rounded-full border border-[#D8D0C0] shadow-xs">
          <button 
            onClick={() => goHome2()}
            className="text-[#2B372E] hover:text-[#28543E] px-4 py-2 rounded-full font-medium text-xs xl:text-sm transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => goHome2('who-are-we')}
            className="text-[#2B372E] hover:text-[#28543E] px-4 py-2 rounded-full font-medium text-xs xl:text-sm transition-colors"
          >
            About Us
          </button>
          <button 
            onClick={() => navigate ? navigate('/hygiene') : (window.location.href = '/hygiene')}
            className="text-[#2B372E] hover:text-[#28543E] px-4 py-2 rounded-full font-medium text-xs xl:text-sm transition-colors"
          >
            Hygiene
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#28543E] text-white px-5 py-2 rounded-full font-medium text-xs xl:text-sm transition-all shadow-xs"
          >
            Products
          </button>
          <button 
            onClick={() => goHome2('faq-section')}
            className="text-[#2B372E] hover:text-[#28543E] px-4 py-2 rounded-full font-medium text-xs xl:text-sm transition-colors"
          >
            Contact Us
          </button>
        </nav>

        {/* Trailing Download Brochure Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBrochureDownload}
            className="hidden sm:inline-flex items-center gap-2.5 bg-[#28543E] hover:bg-[#1E4231] text-white px-5 py-2.5 rounded-full font-medium text-xs xl:text-sm shadow-sm transition-all group active:scale-95"
          >
            <span>Download Brochure</span>
            <span className="w-5 h-5 rounded-full bg-white text-[#28543E] flex items-center justify-center text-[10px] transition-transform group-hover:translate-x-0.5">
              ▶
            </span>
          </button>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 text-[#28543E] bg-[#E7E0D3] rounded-full"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── FLOATING PILL NAV (SLIDES DOWN ON SCROLL UP) ── */}
      <div 
        className={`fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none transition-all duration-300 ease-in-out ${
          lastScrollY > 120 && showHeader 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-16 opacity-0'
        }`}
      >
        <nav className="pointer-events-auto flex items-center gap-1 bg-white/25 backdrop-blur-2xl px-3 py-1.5 rounded-full border border-white/45 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]">
          <button 
            onClick={() => goHome2()}
            className="text-[#1D2820] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => goHome2('who-are-we')}
            className="text-[#1D2820] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            About Us
          </button>
          <button 
            onClick={() => navigate ? navigate('/hygiene') : (window.location.href = '/hygiene')}
            className="text-[#1D2820] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            Hygiene
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#28543E] text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm"
          >
            Products
          </button>
          <button 
            onClick={() => goHome2('faq-section')}
            className="text-[#1D2820] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            Contact Us
          </button>
        </nav>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden relative z-40 bg-[#EFE9DC] border-b border-[#DCD3C2] px-6 py-5 space-y-3 flex flex-col">
          <button onClick={() => { setMobileMenuOpen(false); goHome2(); }} className="text-left text-[#3B473E] py-1">
            Home
          </button>
          <button onClick={() => { setMobileMenuOpen(false); goHome2('who-are-we'); }} className="text-left text-[#3B473E] py-1">
            About Us
          </button>
          <button onClick={() => { setMobileMenuOpen(false); navigate ? navigate('/hygiene') : (window.location.href = '/hygiene'); }} className="text-left text-[#3B473E] py-1">
            Hygiene
          </button>
          <button onClick={() => setMobileMenuOpen(false)} className="text-left font-bold text-[#28543E] py-1">
            Products
          </button>
          <button onClick={() => { setMobileMenuOpen(false); goHome2('faq-section'); }} className="text-left text-[#3B473E] py-1">
            Contact Us
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); handleBrochureDownload(); }}
            className="bg-[#28543E] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 mt-2"
          >
            Download Brochure ▶
          </button>
        </div>
      )}

      {/* ── 2. MAIN PRODUCT CATALOG SECTION ── */}
      <main className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 pt-8 sm:pt-12 pb-20">
        
        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#19241C] font-['Outfit'] tracking-tight">
              Bagasse Tableware &amp; Bagasse Products
            </h1>
            <p className="text-xs sm:text-sm text-[#4A584E] mt-1.5">
              42 individual catalog items across 7 product categories, including separately sold containers and lids.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all inline-flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#28543E] text-white border-[#28543E] shadow-sm'
                    : 'bg-[#FAF7F2] text-[#2B372E] border-[#DFD7C8] hover:border-[#28543E] hover:text-[#28543E]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#EAE3D5] text-[#4A584E]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Categorized Product Sections */}
        <div className="space-y-14">
          {visibleCategories.map((cat) => {
            const categoryProducts = PRODUCTS_LIST.filter((p) => p.categoryId === cat.id);
            return (
              <section key={cat.id} className="space-y-6">
                {/* Category Header */}
                <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-[#DED6C6]">
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#19241C] font-['Outfit'] tracking-tight">
                      {cat.name}
                    </h2>
                    {cat.subtitle && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#6A786D]">
                        ({cat.subtitle})
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#28543E] bg-[#E7E0D3] px-3 py-1 rounded-full">
                    {categoryProducts.length} {categoryProducts.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>

                {/* 4-Column Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
                  {categoryProducts.map((product) => (
                    <div 
                      key={product.id}
                      className="bg-[#FAF7F2] rounded-[22px] p-3.5 sm:p-4 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#EAE3D5] flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
                    >
                      <div>
                        {/* Product Thumbnail Container */}
                        <div 
                          onClick={() => openProductView(product)}
                          className="relative overflow-hidden rounded-[16px] aspect-[112/90] bg-[#5E1A1F] cursor-pointer"
                        >
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {product.subCategory && (
                            <span className="absolute top-2.5 left-2.5 bg-black/55 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/15">
                              {product.subCategory}
                            </span>
                          )}
                        </div>

                        {/* Product Title */}
                        <h3 className="text-[15px] sm:text-base font-bold text-[#19241C] font-['Outfit'] mt-3.5 mb-3 tracking-tight line-clamp-2 min-h-[2.75rem]">
                          {product.name}
                        </h3>
                      </div>

                      {/* Dual Action Pill Buttons: View Product & Inquiry */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <button
                          onClick={() => openProductView(product)}
                          className="flex-1 bg-[#28543E] hover:bg-[#1E4231] text-white pl-3.5 pr-2.5 py-2 rounded-full font-medium text-[11px] sm:text-xs inline-flex items-center justify-between gap-1.5 transition-all active:scale-95 group/btn"
                        >
                          <span className="truncate">View Product</span>
                          <span className="w-4 h-4 rounded-full bg-white text-[#28543E] flex items-center justify-center text-[8px] shrink-0 transition-transform group-hover/btn:translate-x-0.5">
                            ▶
                          </span>
                        </button>

                        <button
                          onClick={() => openInquiry(product.name)}
                          className="bg-[#28543E] hover:bg-[#1E4231] text-white pl-3.5 pr-2.5 py-2 rounded-full font-medium text-[11px] sm:text-xs inline-flex items-center justify-between gap-1.5 transition-all active:scale-95 group/inq shrink-0"
                        >
                          <span>Inquiry</span>
                          <span className="w-4 h-4 rounded-full bg-white text-[#28543E] flex items-center justify-center text-[8px] shrink-0 transition-transform group-hover/inq:translate-x-0.5">
                            ▶
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom Description Paragraph matching reference */}
        <div className="mt-12 sm:mt-14 max-w-3xl">
          <p className="text-xs sm:text-[13px] text-[#3B473E] leading-relaxed font-normal">
            Bagasse tableware is an eco-friendly alternative to plastic, made from sugarcane pulp left after juice extraction. These biodegradable bagasse products include plates, bowls, and trays that decompose naturally. Ideal for catering, food delivery, and sustainable packaging, bagasse tableware offers a sturdy, compostable solution for businesses embracing green practices.
          </p>
        </div>

      </main>

      {/* ── 3. ROUNDED DARK FOREST GREEN FOOTER (Matching Reference) ── */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 pb-10">
        <footer className="bg-[#0D1F14] text-white pt-14 pb-8 px-8 sm:px-12 lg:px-16 rounded-[32px] shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            
            {/* Col 1: Brand & Bio */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <img 
                  src="/assets/homepage2/logo_footer.png" 
                  alt="NOTCH" 
                  className="h-9 sm:h-10 w-auto object-contain cursor-pointer"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                />
                <p className="text-white/75 text-xs sm:text-sm leading-relaxed mt-6 max-w-md">
                  At PulpCraft, as one of the leading bagasse tableware manufacturers &amp; suppliers in India, we envision a sustainable future where eco-conscious solutions replace harmful materials across industries.
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-8">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
                  aria-label="LinkedIn"
                >
                  in
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors"
                  aria-label="Instagram"
                >
                  📷
                </a>
              </div>
            </div>

            {/* Col 2: Links */}
            <div className="lg:col-span-2 text-left">
              <h4 className="font-bold text-xs sm:text-sm tracking-wider text-white font-['Outfit']">
                Links
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-white/70 mt-5">
                <li>
                  <button onClick={() => goHome2('who-are-we')} className="hover:text-white transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
                    Products
                  </button>
                </li>
                <li>
                  <button onClick={() => goHome2('who-we-supply')} className="hover:text-white transition-colors">
                    Industries Served
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate ? navigate('/export') : (window.location.href = '/export')} className="hover:text-white transition-colors">
                    Export
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Get In Touch */}
            <div className="lg:col-span-3 text-left">
              <h4 className="font-bold text-xs sm:text-sm tracking-wider text-white font-['Outfit']">
                Get In Touch
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-white/70 mt-5">
                <li>
                  <a href="mailto:info@pulp-craft.com" className="hover:text-white transition-colors">
                    E: info@pulp-craft.com
                  </a>
                </li>
                <li>
                  <a href="tel:+919236086262" className="hover:text-white transition-colors">
                    T: +91 9236086262
                  </a>
                </li>
                <li className="pt-2">
                  <button 
                    onClick={() => openInquiry('General Bulk Inquiry')}
                    className="hover:text-white transition-colors text-white/80"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Policies */}
            <div className="lg:col-span-2 text-left">
              <h4 className="font-bold text-xs sm:text-sm tracking-wider text-white font-['Outfit']">
                Policies
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-white/70 mt-5">
                <li>
                  <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                    Terms &amp; Conditions
                  </a>
                </li>
                <li>
                  <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Divider & Copyright */}
          <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-white/60">
            ©pulpcraft private limited, 2026
          </div>
        </footer>
      </div>

      {/* ── PRODUCT QUICK VIEW MODAL WITH SLIDESHOW (LARGE FORMAT) ── */}
      {selectedViewProduct && (
        <div
          onClick={() => setSelectedViewProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/70 backdrop-blur-md animate-in fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7F2] text-[#1B251D] w-full max-w-5xl xl:max-w-6xl rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#D9D1C2] shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto"
          >
            <button 
              onClick={() => setSelectedViewProduct(null)}
              aria-label="Close product popup"
              className="absolute top-5 right-5 sm:top-7 sm:right-7 text-[#65736A] hover:text-[#19241C] p-2.5 rounded-full bg-[#EFE9DC] hover:bg-[#E2DACB] transition-colors z-10 cursor-pointer"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Slideshow Column (7 cols on desktop) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative overflow-hidden rounded-3xl aspect-[4/3] sm:aspect-[16/13] bg-[#5E1A1F] shadow-lg group">
                  {(selectedViewProduct.images || [selectedViewProduct.image]).map((imgSrc, idx) => (
                    <img 
                      key={imgSrc}
                      src={imgSrc} 
                      alt={`${selectedViewProduct.name} view ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                        activeSlideIdx === idx ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Product Details Column (5 cols on desktop) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                    <span className="inline-block text-xs sm:text-[13px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full bg-[#28543E]/10 text-[#28543E]">
                      {selectedViewProduct.category}
                    </span>
                    {selectedViewProduct.subCategory && (
                      <span className="inline-block text-xs sm:text-[13px] font-semibold px-3.5 py-1.5 rounded-full bg-[#EAE3D5] text-[#3B473E]">
                        {selectedViewProduct.subCategory}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-[#19241C] font-['Outfit'] leading-tight tracking-tight">
                    {selectedViewProduct.name}
                  </h3>

                  <p className="text-sm sm:text-base text-[#4E5C53] mt-4 leading-relaxed">
                    {selectedViewProduct.description}
                  </p>

                  <div className="mt-7 pt-6 border-t border-[#DFD7C8] space-y-3.5 text-sm sm:text-[15px]">
                    <div className="flex justify-between items-center py-1 border-b border-[#ECE5D8]">
                      <span className="text-[#65736A]">Format / Size:</span>
                      <span className="font-bold text-[#19241C]">{selectedViewProduct.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#ECE5D8]">
                      <span className="text-[#65736A]">Dimensions:</span>
                      <span className="font-bold text-[#19241C]">{selectedViewProduct.dimensions}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#ECE5D8]">
                      <span className="text-[#65736A]">Material:</span>
                      <span className="font-bold text-[#28543E]">100% Sugarcane Bagasse</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#65736A]">Compliance:</span>
                      <span className="font-semibold text-[#19241C]">Food-Grade • PFAS-Free • Compostable</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-2 flex items-center gap-3">
                  <button
                    onClick={() => openInquiry(selectedViewProduct.name)}
                    className="w-full bg-[#28543E] hover:bg-[#1E4231] text-white py-4 px-7 rounded-full font-bold text-sm sm:text-base inline-flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>Send Bulk Inquiry</span>
                    <span className="w-5 h-5 rounded-full bg-white text-[#28543E] flex items-center justify-center text-[10px]">
                      ▶
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCT INQUIRY MODAL ── */}
      {inquiryProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] text-[#1B251D] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-[#D9D1C2] shadow-2xl relative">
            <button 
              onClick={() => setInquiryProduct(null)}
              className="absolute top-5 right-5 text-[#65736A] hover:text-[#19241C]"
            >
              <X size={20} />
            </button>

            {inquirySubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#28543E]/15 text-[#28543E] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="text-2xl font-extrabold font-['Outfit'] text-[#19241C]">
                  Inquiry Received
                </h3>
                <p className="text-sm text-[#5A685E] max-w-sm mx-auto">
                  Thank you! Our team will send specifications and bulk pricing for <strong>{inquiryProduct}</strong> shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#28543E]/10 text-[#28543E] mb-2">
                  Product Inquiry
                </div>
                <h3 className="text-2xl font-extrabold font-['Outfit'] text-[#19241C]">
                  {inquiryProduct}
                </h3>
                <p className="text-xs text-[#65736A] mt-1">
                  Enter your details below to receive FOB/CIF export rates, MOQ details, and sample availability.
                </p>

                <form onSubmit={handleInquirySubmit} className="mt-5 space-y-3.5 text-left">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3B473E] mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="John Carter"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5CCC0] text-sm focus:outline-none focus:border-[#28543E]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#3B473E] mb-1">
                        Work Email *
                      </label>
                      <input 
                        type="email" 
                        required 
                        placeholder="john@company.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5CCC0] text-sm focus:outline-none focus:border-[#28543E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#3B473E] mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+1 555 234 5678"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5CCC0] text-sm focus:outline-none focus:border-[#28543E]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3B473E] mb-1">
                      Estimated Order Quantity / Notes
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="e.g. 1x 20ft FCL or 50,000 pcs per month..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5CCC0] text-sm focus:outline-none focus:border-[#28543E]"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#28543E] hover:bg-[#1E4231] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Send size={15} />
                    <span>Submit Product Inquiry</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── SIMPLE EMAIL POPUP BEFORE BROCHURE DOWNLOAD ── */}
      <BrochureEmailModal
        isOpen={isBrochureModalOpen}
        onClose={() => setIsBrochureModalOpen(false)}
        onSuccess={handleBrochureSuccess}
      />

    </div>
  );
}

