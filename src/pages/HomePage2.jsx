import React, { useState, useEffect } from 'react';
import CobeGlobe from '../components/CobeGlobe';
import BrochureEmailModal from '../components/BrochureEmailModal';
import { 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  Download, 
  CheckCircle2, 
  Menu, 
  X,
  Send,
  Globe2,
  Anchor,
  ShieldCheck,
  Container,
  ArrowUpRight,
  Handshake,
  FileText
} from 'lucide-react';

export default function HomePage2({ navigate }) {
  // FAQ Accordion State (Item 0 open by default as in design)
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  // Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState('Bagasse Tableware');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Dynamic FAQ Mode ('enquiry' vs 'distributor')
  const [faqMode, setFaqMode] = useState('enquiry'); // 'enquiry' | 'distributor'
  const [isFaqPaused, setIsFaqPaused] = useState(false);

  // Separate Popups for the two forms
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const [isDistributorModalOpen, setIsDistributorModalOpen] = useState(false);
  const [distributorSubmitted, setDistributorSubmitted] = useState(false);

  // Who We Supply Fast 1-Second Image Slideshow State
  const supplySlides = [
    {
      src: '/assets/who_we_supply/airlines.jpg',
      alt: 'Airlines & In-Flight Compartment Catering'
    },
    {
      src: '/assets/who_we_supply/qsr_takeout.jpg',
      alt: 'Quick Service Restaurants (QSRs) & Fast Casual Takeout'
    },
    {
      src: '/assets/who_we_supply/restaurants.png',
      alt: 'Fine Dining & Cafe Presentation'
    },
    {
      src: '/assets/who_we_supply/catering.png',
      alt: 'Commercial Events & Large Scale Catering'
    },
    {
      src: '/assets/who_we_supply/hospitality.png',
      alt: 'Hotels & Resort In-Room Hospitality'
    },
    {
      src: '/assets/who_we_supply/distribution.png',
      alt: 'Wholesale Mill & Global Container Distribution'
    }
  ];
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  // 1-second auto slideshow interval
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % supplySlides.length);
    }, 1000);
    return () => clearInterval(slideTimer);
  }, [supplySlides.length]);

  // Hero Mosaic: 10 Individual Cards Rotating at Independent Random Times
  const heroCardPools = [
    // Card 1
    [
      '/assets/homepage2/hero_mosaic_1.png',
      '/assets/homepage2/bestseller_plates.png',
      '/assets/Assets/Products/Product1.png',
      '/assets/who_we_supply/restaurants.png'
    ],
    // Card 2
    [
      '/assets/homepage2/hero_mosaic_2.png',
      '/assets/homepage2/bestseller_bowls.png',
      '/assets/homepage2/works_card_1_food_safe.png',
      '/assets/Assets/Products/Plates.png'
    ],
    // Card 3
    [
      '/assets/homepage2/hero_mosaic_3.png',
      '/assets/homepage2/glance_plates_bowls.png',
      '/assets/homepage2/works_card_2_plastic_free.png',
      '/assets/who_we_supply/qsr_takeout.jpg'
    ],
    // Card 4
    [
      '/assets/homepage2/hero_mosaic_4.png',
      '/assets/homepage2/bestseller_trays.png',
      '/assets/Assets/Products/Product2.png',
      '/assets/who_we_supply/hospitality.png'
    ],
    // Card 5
    [
      '/assets/homepage2/hero_mosaic_5.png',
      '/assets/who_we_supply/airlines.jpg',
      '/assets/Assets/Products/Clampshell.png',
      '/assets/homepage2/works_card_4_microwave.png'
    ],
    // Card 6
    [
      '/assets/homepage2/hero_mosaic_6.png',
      '/assets/homepage2/glance_compartment_plates.png',
      '/assets/Assets/Products/Product3.png',
      '/assets/homepage2/works_card_3_compostable.png'
    ],
    // Card 7
    [
      '/assets/homepage2/hero_mosaic_7.png',
      '/assets/homepage2/bestseller_compartment.png',
      '/assets/who_we_supply/catering.png',
      '/assets/homepage2/works_card_5_reused.png'
    ],
    // Card 8
    [
      '/assets/homepage2/hero_mosaic_8.png',
      '/assets/homepage2/glance_meal_trays.png',
      '/assets/Assets/SlideShow/HeroSlide2.png',
      '/assets/Assets/Products/Plates.png'
    ],
    // Card 9
    [
      '/assets/homepage2/hero_mosaic_9.png',
      '/assets/homepage2/glance_compartment_plates.png',
      '/assets/Assets/SlideShow/HeroSlide4.png',
      '/assets/who_we_supply/distribution.png'
    ],
    // Card 10
    [
      '/assets/homepage2/hero_mosaic_10.png',
      '/assets/who_we_supply/qsr_takeout.jpg',
      '/assets/homepage2/bestseller_plates.png',
      '/assets/homepage2/who_hands_team.png'
    ]
  ];

  const [heroCardIndices, setHeroCardIndices] = useState(
    Array(10).fill(0)
  );

  useEffect(() => {
    // Stagger each card's rotation at independent, random intervals (e.g. 2.2s to 4.8s)
    const timers = heroCardPools.map((pool, cardIdx) => {
      let timeoutId;
      const scheduleNext = () => {
        // Random interval between 2200ms and 4500ms
        const delay = 2200 + Math.random() * 2300 + (cardIdx % 4) * 400;
        timeoutId = setTimeout(() => {
          setHeroCardIndices((prev) => {
            const next = [...prev];
            next[cardIdx] = (next[cardIdx] + 1) % pool.length;
            return next;
          });
          scheduleNext();
        }, delay);
      };
      // Stagger first trigger so cards don't change at the same instant
      const initialDelay = 1200 + cardIdx * 450;
      timeoutId = setTimeout(scheduleNext, initialDelay);

      return () => clearTimeout(timeoutId);
    });

    return () => timers.forEach((cancel) => cancel());
  }, []);

  // Auto-switch mode every 5 seconds with smooth animation
  useEffect(() => {
    if (isFaqPaused || isEnquiryModalOpen || isDistributorModalOpen) return;
    const interval = setInterval(() => {
      setFaqMode((prev) => (prev === 'enquiry' ? 'distributor' : 'enquiry'));
      setOpenFaqIdx(0); // reset open to top item
    }, 5000);
    return () => clearInterval(interval);
  }, [isFaqPaused, isEnquiryModalOpen, isDistributorModalOpen]);

  // Brochure Download State
  const [brochureDownloaded, setBrochureDownloaded] = useState(false);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll detection for Smart Sticky / Slide-Down Header on Scroll Up
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when close to top
      if (currentScrollY < 60) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 120) {
        // Scrolling DOWN -> slide up / hide header
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP detected -> slide down / show header!
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const buyerFaqs = [
    {
      question: "What products does PulpCraft manufacture?",
      answer: "We engineer molded sugarcane bagasse and bamboo fiber tableware including round plates, clamshell meal boxes, deep soup & salad bowls, multi-compartment bento trays, and custom bespoke packaging formats."
    },
    {
      question: "What are your minimum order quantities (MOQ)?",
      answer: "Our standard minimum order is direct export FCL ocean containers (1x 20ft or 40ft HQ), with pallet quantities (1–5 pallets) available for select domestic buffered warehouse SKUs."
    },
    {
      question: "Are all products certified compostable and PFAS-free?",
      answer: "Yes. All catalog items are 100% plant-based, certified BPI Compostable, EN 13432 compliant, US-FDA food-contact approved, and manufactured completely 100% PFAS-free."
    },
    {
      question: "How fast can you dispatch samples?",
      answer: "Free physical evaluation sample boxes are packed and dispatched within 24 hours directly to your test kitchen or procurement office via international air express."
    },
    {
      question: "Can PulpCraft tableware handle hot oil and microwave use?",
      answer: "Absolutely. Our thermoformed bagasse tableware withstands temperatures from -20°C in deep freezers up to 120°C in conventional microwaves and boiling hot soup serving without leaking."
    },
    {
      question: "How do you handle ocean freight and international delivery?",
      answer: "We provide comprehensive CIF and FOB direct container dispatches originating from premier deepwater ports at Mundra and JNPT (Mumbai) to North America, UK/Europe, GCC, and Australia."
    }
  ];

  const distributorFaqs = [
    {
      question: "What are the minimum requirements to become a distributor?",
      answer: "We require distribution partners to have an established regional logistics network, warehouse capacity for palletized goods, and an active sales network in food service or supermarket packaging."
    },
    {
      question: "Do you offer exclusive territory distribution rights?",
      answer: "Yes. Based on committed quarterly volume and regional market penetration, we offer exclusive master-distributor rights to secure and protect your geographical territory."
    },
    {
      question: "How are wholesale prices and tiered discounts structured?",
      answer: "Pricing is tiered according to annual volume commitments. Partners achieving scheduled container thresholds automatically unlock preferred factory-direct wholesale pricing tiers."
    },
    {
      question: "What marketing and sales collateral do you provide?",
      answer: "Approved distributors receive our comprehensive digital asset library, white-label product spec sheets, full lab certification dossiers, and physical sample presentation kits for your sales reps."
    },
    {
      question: "How do you handle customs, tariffs, and shipping documentation?",
      answer: "Our dedicated export desk manages complete customs documentation, Bill of Lading, Certificate of Origin, and container routing directly into your regional port terminal."
    },
    {
      question: "What is the onboarding timeline for new distribution partners?",
      answer: "Following initial compliance verification and territory agreement, distributor accounts are activated within 5 business days, with priority production scheduling assigned."
    }
  ];

  const currentFaqs = faqMode === 'enquiry' ? buyerFaqs : distributorFaqs;

  const openQuote = (prod = 'Bagasse Tableware') => {
    setQuoteProduct(prod);
    setQuoteSubmitted(false);
    setIsQuoteModalOpen(true);
  };

  const handleBrochureDownload = () => {
    setIsBrochureModalOpen(true);
  };

  const handleBrochureSuccess = () => {
    setBrochureDownloaded(true);
    setTimeout(() => setBrochureDownloaded(false), 4000);
  };

  return (
    <div className="relative min-h-screen bg-[#F4EFE6] text-[#1B251D] font-['Plus_Jakarta_Sans'] overflow-x-hidden selection:bg-[#28543E] selection:text-white">
      
      {/* ── CONCENTRIC RIPPLE BACKGROUND SVG (1-for-1 match to reference) ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden flex justify-center">
        <svg 
          className="w-[3200px] h-[16000px] shrink-0 opacity-45 -translate-y-24"
          viewBox="0 0 3200 16000" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 45 }).map((_, i) => {
            const r = 220 + i * 160;
            return (
              <circle 
                key={i} 
                cx="1600" 
                cy="600" 
                r={r} 
                stroke="#D6CEBF" 
                strokeWidth="1.25" 
              />
            );
          })}
        </svg>
      </div>

      {/* ── BROCHURE NOTIFICATION TOAST ── */}
      {brochureDownloaded && (
        <div className="fixed top-6 right-6 z-50 bg-[#28543E] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={20} className="text-[#A5D0B9]" />
          <span className="text-sm font-semibold">PulpCraft Product Catalogue downloaded successfully!</span>
        </div>
      )}

      {/* ── 1. INITIAL TOP HEADER (Logo, Middle Pill Nav, Download Brochure) ── */}
      <header className="relative z-30 max-w-[1380px] mx-auto px-6 lg:px-10 pt-6 pb-4 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img 
            src="/assets/homepage2/notch_logo.png" 
            alt="NOTCH" 
            className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
          />
        </div>

        {/* Center Pill Nav (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/20 backdrop-blur-2xl px-2 py-1.5 rounded-full border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] ring-1 ring-black/[0.03]">
          <button 
            className="bg-[#cd9922] text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Home
          </button>
          <a 
            href="#who-are-we" 
            className="text-[#3B473E] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            About Us
          </a>
          <a 
            href="/hygiene" 
            onClick={(e) => { e.preventDefault(); navigate ? navigate('/hygiene') : (window.location.href = '/hygiene'); }}
            className="text-[#3B473E] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Hygiene
          </a>
          <a 
            href="/products-2" 
            onClick={(e) => { e.preventDefault(); navigate ? navigate('/products-2') : (window.location.href = '/products-2'); }}
            className="text-[#3B473E] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Products
          </a>
          <a 
            href="#faq-section" 
            className="text-[#3B473E] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Contact Us
          </a>
        </nav>

        {/* Trailing Download Brochure Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBrochureDownload}
            className="hidden sm:inline-flex items-center gap-2.5 bg-[#cd9922] hover:bg-[#b5851b] text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-sm transition-all group active:scale-95"
          >
            <span>Download Brochure</span>
            <span className="w-5 h-5 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[10px] transition-transform group-hover:translate-x-0.5">
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

      {/* ── FLOATING PILL NAV (SLIDES DOWN ONLY ON SCROLL UP) ── */}
      <div 
        className={`fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none transition-all duration-300 ease-in-out ${
          lastScrollY > 120 && showHeader 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-16 opacity-0'
        }`}
      >
        <nav className="pointer-events-auto flex items-center gap-1 bg-white/20 backdrop-blur-2xl px-3 py-1.5 rounded-full border border-white/45 shadow-[0_8px_32px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.6)] ring-1 ring-black/[0.04]">
          <button 
            className="bg-[#cd9922] text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm active:scale-95"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Home
          </button>
          <a 
            href="#who-are-we" 
            className="text-[#3B473E] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            About Us
          </a>
          <a 
            href="/hygiene" 
            onClick={(e) => { e.preventDefault(); navigate ? navigate('/hygiene') : (window.location.href = '/hygiene'); }}
            className="text-[#3B473E] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Hygiene
          </a>
          <a 
            href="/products-2" 
            onClick={(e) => { e.preventDefault(); navigate ? navigate('/products-2') : (window.location.href = '/products-2'); }}
            className="text-[#3B473E] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Products
          </a>
          <a 
            href="#faq-section" 
            className="text-[#3B473E] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Contact Us
          </a>
        </nav>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-4 top-20 z-40 bg-[#FAF7F2] p-6 rounded-3xl border border-[#D9D1C2] shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          <button 
            onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left text-[#cd9922] font-bold text-lg py-2 border-b border-[#E8E2D6]"
          >
            Home
          </button>
          <a 
            href="#who-are-we" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#1B251D] font-semibold text-lg py-2 border-b border-[#E8E2D6]"
          >
            About Us
          </a>
          <a 
            href="/hygiene" 
            onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate ? navigate('/hygiene') : (window.location.href = '/hygiene'); }}
            className="text-[#1B251D] font-semibold text-lg py-2 border-b border-[#E8E2D6]"
          >
            Hygiene
          </a>
          <a 
            href="/products-2" 
            onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate ? navigate('/products-2') : (window.location.href = '/products-2'); }}
            className="text-[#1B251D] font-semibold text-lg py-2 border-b border-[#E8E2D6]"
          >
            Products
          </a>
          <a 
            href="#faq-section" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#1B251D] font-semibold text-lg py-2 border-b border-[#E8E2D6]"
          >
            Contact Us
          </a>
          <button 
            onClick={() => { setMobileMenuOpen(false); handleBrochureDownload(); }}
            className="bg-[#cd9922] hover:bg-[#b5851b] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 mt-2"
          >
            Download Brochure ▶
          </button>
        </div>
      )}

      {/* ── 2. HERO SECTION (Headline, Social Proof, CTAs & 10-Image Wave Collage) ── */}
      <section className="relative z-10 pt-10 md:pt-14 pb-16 md:pb-24 px-6 lg:px-10 max-w-[1380px] mx-auto text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#19241C] tracking-tight leading-[1.18] font-['Outfit'] max-w-4xl mx-auto">
          Leading <span className="text-[#32674F]">Bagasse Tableware</span><br />
          Manufacturers &amp; Suppliers in India
        </h1>

        {/* Subtitle */}
        <p className="text-[#556359] text-sm md:text-base max-w-2xl mx-auto mt-4 font-normal leading-relaxed">
          Beautifully crafted, environmentally conscious tableware designed to inspire mindful dining and a greener planet.
        </p>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <img 
            src="/assets/homepage2/hero_avatars.png" 
            alt="Clients" 
            className="h-6 w-auto object-contain"
          />
          <span className="text-xs font-semibold text-[#1C271F] tracking-wide">
            Trusted by 2.5k Clients
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <a 
            href="#products-glance"
            className="border border-[#A39B8D] text-[#222E25] hover:bg-black/5 px-6 py-2.5 rounded-full font-medium text-sm transition-all"
          >
            Discover our Products
          </a>
          <button 
            onClick={() => openQuote('General Inquiry')}
            className="bg-[#cd9922] hover:bg-[#b5851b] text-white px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 shadow-md transition-all group active:scale-95"
          >
            <span>Request A Quote</span>
            <span className="w-5 h-5 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[10px] transition-transform group-hover:translate-x-0.5">
              ▶
            </span>
          </button>
        </div>

        {/* ── 10-Image Wave Concave Mosaic (Exact Reference Layout with Independent Random Rotations) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-4 lg:gap-5 mt-14 sm:mt-16 items-start text-left">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-3.5 md:gap-4">
            {/* Card 1 */}
            <div className="relative overflow-hidden rounded-[26px] shadow-sm bg-white/50 transition-transform duration-300 hover:scale-[1.02] aspect-[180/179]">
              {heroCardPools[0].map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="Hero card 1" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    heroCardIndices[0] === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>
            {/* Card 2 */}
            <div className="relative overflow-hidden rounded-[26px] shadow-sm bg-white/50 transition-transform duration-300 hover:scale-[1.02] aspect-[180/165]">
              {heroCardPools[1].map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="Hero card 2" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    heroCardIndices[1] === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Column 2 (Offset lower for wave) */}
          <div className="flex flex-col gap-3.5 md:gap-4 mt-6 lg:mt-10">
            {/* Card 3 */}
            <div className="relative overflow-hidden rounded-[26px] shadow-sm bg-white/50 transition-transform duration-300 hover:scale-[1.02] aspect-[180/180]">
              {heroCardPools[2].map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="Hero card 3" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    heroCardIndices[2] === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>
            {/* Card 4 */}
            <div className="relative overflow-hidden rounded-[26px] shadow-sm bg-white/50 transition-transform duration-300 hover:scale-[1.02] aspect-[180/119]">
              {heroCardPools[3].map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="Hero card 4" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    heroCardIndices[3] === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Column 3 (Center, Offset deepest for concave wave) */}
          <div className="flex flex-col gap-3.5 md:gap-4 mt-12 lg:mt-20 col-span-2 sm:col-span-1">
            {/* Card 5 */}
            <div className="relative overflow-hidden rounded-[26px] shadow-sm bg-white/50 transition-transform duration-300 hover:scale-[1.02] aspect-[178/179]">
              {heroCardPools[4].map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="Hero card 5" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    heroCardIndices[4] === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>
            {/* Card 6 */}
            <div className="relative overflow-hidden rounded-[26px] shadow-sm bg-white/50 transition-transform duration-300 hover:scale-[1.02] aspect-[178/80]">
              {heroCardPools[5].map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="Hero card 6" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    heroCardIndices[5] === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Column 4 (Offset lower matching Col 2) */}
          <div className="flex flex-col gap-3.5 md:gap-4 mt-6 lg:mt-10">
            {/* Card 7 */}
            <div className="relative overflow-hidden rounded-[26px] shadow-sm bg-white/50 transition-transform duration-300 hover:scale-[1.02] aspect-[180/179]">
              {heroCardPools[6].map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="Hero card 7" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    heroCardIndices[6] === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>
            {/* Card 8 */}
            <div className="relative overflow-hidden rounded-[26px] shadow-sm bg-white/50 transition-transform duration-300 hover:scale-[1.02] aspect-[180/120]">
              {heroCardPools[7].map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="Hero card 8" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    heroCardIndices[7] === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Column 5 (Matching Col 1 height) */}
          <div className="flex flex-col gap-3.5 md:gap-4">
            {/* Card 9 */}
            <div className="relative overflow-hidden rounded-[26px] shadow-sm bg-white/50 transition-transform duration-300 hover:scale-[1.02] aspect-[178/179]">
              {heroCardPools[8].map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="Hero card 9" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    heroCardIndices[8] === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>
            {/* Card 10 */}
            <div className="relative overflow-hidden rounded-[26px] shadow-sm bg-white/50 transition-transform duration-300 hover:scale-[1.02] aspect-[178/165]">
              {heroCardPools[9].map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="Hero card 10" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    heroCardIndices[9] === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. MOST EXPORTED PRODUCTS (3x2 Grid) ── */}
      <section id="products-glance" className="relative z-10 py-16 px-6 lg:px-10 max-w-[1380px] mx-auto">
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#19241C] font-['Outfit'] tracking-tight">
            Most Exported Products
          </h2>
          <p className="text-[#65736A] text-sm md:text-base mt-1">
            Durable, stylish, and planet-friendly
          </p>
        </div>

        {/* 3x2 Grid: 6 Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
          
          {/* Card 1: Plates & bowls */}
          <div className="flex flex-col group">
            <div className="overflow-hidden rounded-[28px] shadow-sm bg-white/40">
              <img 
                src="/assets/homepage2/glance_plates_bowls.png" 
                alt="Plates & bowls" 
                className="w-full h-[260px] sm:h-[300px] object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-[#19241C] font-['Outfit'] mt-5">
              Plates &amp; bowls
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#4E5C53] mt-2.5">
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Available in various sizes and styles to suit every meal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Made from plant-based materials that decompose naturally.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Perfect for casual dining or formal presentations.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Meal Trays */}
          <div className="flex flex-col group">
            <div className="overflow-hidden rounded-[28px] shadow-sm bg-white/40">
              <img 
                src="/assets/homepage2/glance_meal_trays.png" 
                alt="Meal Trays" 
                className="w-full h-[260px] sm:h-[300px] object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-[#19241C] font-['Outfit'] mt-5">
              Meal Trays
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#4E5C53] mt-2.5">
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Sustainable, customizable meal trays for eco-conscious hospitality.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Designed to preserve freshness and reduce waste.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Compartment Plates */}
          <div className="flex flex-col group">
            <div className="overflow-hidden rounded-[28px] shadow-sm bg-white/40">
              <img 
                src="/assets/homepage2/glance_compartment_plates.png" 
                alt="Compartment Plates" 
                className="w-full h-[260px] sm:h-[300px] object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-[#19241C] font-['Outfit'] mt-5">
              Compartment Plates
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#4E5C53] mt-2.5">
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Lightweight and easy to handle.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Designed for durability without plastic.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Available in individual sets or bulk packs.</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Antileak Takeaway Containers */}
          <div className="flex flex-col group">
            <div className="overflow-hidden rounded-[28px] shadow-sm bg-white/40">
              <img 
                src="/assets/products/antileak-containers/rectangular/Antileak_Container_Rectangle_Product.png" 
                alt="Antileak Containers" 
                className="w-full h-[260px] sm:h-[300px] object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-[#19241C] font-['Outfit'] mt-5">
              Antileak Containers
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#4E5C53] mt-2.5">
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>100% leak-proof snap-fit lid design for gravies and soups.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Heavy-duty bagasse pulp resists oils, heat and liquid absorption.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Ideal for commercial cloud kitchens and fast food delivery.</span>
              </li>
            </ul>
          </div>

          {/* Card 5: Heavy-Duty Clamshells */}
          <div className="flex flex-col group">
            <div className="overflow-hidden rounded-[28px] shadow-sm bg-white/40">
              <img 
                src="/assets/products/clampshell/clampshell.png" 
                alt="Hinged Clamshells" 
                className="w-full h-[260px] sm:h-[300px] object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-[#19241C] font-['Outfit'] mt-5">
              Hinged Clamshells
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#4E5C53] mt-2.5">
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Interlocking tab closure keeps food warm and securely locked.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Microwave and freezer safe without chemical leaching.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Available in single and multi-compartment formats.</span>
              </li>
            </ul>
          </div>

          {/* Card 6: Round Bowls & Bowls With Lids */}
          <div className="flex flex-col group">
            <div className="overflow-hidden rounded-[28px] shadow-sm bg-white/40">
              <img 
                src="/assets/homepage2/bestseller_bowls.png" 
                alt="Round Bowls & Lids" 
                className="w-full h-[260px] sm:h-[300px] object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-[#19241C] font-['Outfit'] mt-5">
              Round Bowls &amp; Lids
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#4E5C53] mt-2.5">
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Ergonomic deep-dish profile from 180ml up to 1000ml capacities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Matching tight seal lids for spill-free on-the-go consumption.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#28543E] text-base leading-none">•</span>
                <span>Certified 100% biodegradable and industrially compostable.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* View All Products Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate ? navigate('/products-2') : window.location.href = '/products-2'}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#cd9922] hover:bg-[#b5851b] text-white font-semibold text-sm transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group"
          >
            <span>View All Products</span>
            <span className="w-5 h-5 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[10px] transition-transform group-hover:translate-x-0.5">
              ▶
            </span>
          </button>
        </div>
      </section>

      {/* ── 4. FULLY AUTOMATED FACILITY SHOWCASE ── */}
      <section id="facility-section" className="relative z-10 py-10 px-6 lg:px-10 max-w-[1380px] mx-auto">
        <div className="relative rounded-[36px] overflow-hidden shadow-xl border border-black/5 bg-[#2A483B]">
          <img 
            src="/assets/homepage2/facility_full.png" 
            alt="PulpCraft Automated Factory Yash Laxmi Eco Pack Pvt Ltd" 
            className="w-full h-auto min-h-[420px] object-cover"
          />
        </div>
      </section>

      {/* ── 5. GIANT GREEN CONTAINER: WHO ARE WE? + WHY OUR TABLEWARE WORKS ── */}
      <section className="relative z-10 py-12 px-6 lg:px-10 max-w-[1380px] mx-auto">
        <div className="bg-[#28543E] rounded-[40px] text-white p-8 sm:p-12 md:p-16 lg:p-20 shadow-2xl">
          
          {/* Part A: Who are we? */}
          <div id="who-are-we" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col justify-center text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
                Who are we?
              </h2>
              <p className="text-white/85 text-sm sm:text-[15px] leading-relaxed mt-6">
                At PulpCraft, we are one of the leading bagasse tableware manufacturers &amp; suppliers in India. We envision a sustainable future where eco-conscious solutions replace harmful materials across industries. Our goal is to lead the global transition towards biodegradable and renewable alternatives, not just in tableware but across diverse sectors such as industrial packaging, healthcare, and beyond. Through innovation and environmental stewardship, we aspire to inspire individuals, businesses, and industries to adopt sustainable practices, creating a cleaner, greener planet for generations to come.
              </p>
              
              <div className="mt-8">
                <button 
                  onClick={handleBrochureDownload}
                  className="bg-[#cd9922] hover:bg-[#b5851b] text-white font-bold px-6 py-3 rounded-full text-sm inline-flex items-center gap-2.5 transition-all shadow-md active:scale-95 group"
                >
                  <span>Download Brochure</span>
                  <span className="w-5 h-5 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[10px] transition-transform group-hover:translate-x-0.5">
                    ▶
                  </span>
                </button>
              </div>
            </div>

            {/* Right Photo Mosaic */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 md:gap-5 items-stretch">
              <div className="flex flex-col gap-4 md:gap-5 justify-between">
                <div className="overflow-hidden rounded-2xl shadow-md h-[180px] sm:h-[210px]">
                  <img 
                    src="/assets/homepage2/who_hands_team.png" 
                    alt="Team unity hands" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="overflow-hidden rounded-2xl shadow-md h-[180px] sm:h-[210px]">
                  <img 
                    src="/assets/homepage2/who_sugarcane.png" 
                    alt="Sugarcane bamboo plant" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl shadow-md h-full min-h-[380px] sm:min-h-[440px]">
                <img 
                  src="/assets/homepage2/who_moss_hands.png" 
                  alt="Holding seedling in earth" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 6. OUR BESTSELLERS (2x2 Grid) ── */}
      <section id="bestsellers" className="relative z-10 py-16 px-6 lg:px-10 max-w-[1380px] mx-auto">
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#19241C] font-['Outfit'] tracking-tight">
            Our Bestsellers
          </h2>
          <p className="text-[#65736A] text-sm md:text-base mt-1">
            The plates, bowls and trays customers reorder most
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mt-10">
          
          {/* Card 1: Bagasse Plates */}
          <div className="flex flex-col group">
            <div className="overflow-hidden rounded-[28px] shadow-sm bg-white/40">
              <img 
                src="/assets/homepage2/bestseller_plates.png" 
                alt="Bagasse Plates" 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-[#19241C] font-['Outfit'] mt-4">
              Bagasse Plates
            </h3>
            <div>
              <button 
                onClick={() => openQuote('Bagasse Plates')}
                className="mt-3 bg-[#cd9922] hover:bg-[#b5851b] text-white px-5 py-2 rounded-full font-medium text-xs inline-flex items-center gap-2 shadow-sm transition-all group active:scale-95"
              >
                <span>Get Quote</span>
                <span className="w-4 h-4 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[8px] transition-transform group-hover:translate-x-0.5">
                  ▶
                </span>
              </button>
            </div>
          </div>

          {/* Card 2: Bagasse Bowls */}
          <div className="flex flex-col group">
            <div className="overflow-hidden rounded-[28px] shadow-sm bg-white/40">
              <img 
                src="/assets/homepage2/bestseller_bowls.png" 
                alt="Bagasse Bowls" 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-[#19241C] font-['Outfit'] mt-4">
              Bagasse Bowls
            </h3>
            <div>
              <button 
                onClick={() => openQuote('Bagasse Bowls')}
                className="mt-3 bg-[#cd9922] hover:bg-[#b5851b] text-white px-5 py-2 rounded-full font-medium text-xs inline-flex items-center gap-2 shadow-sm transition-all group active:scale-95"
              >
                <span>Get Quote</span>
                <span className="w-4 h-4 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[8px] transition-transform group-hover:translate-x-0.5">
                  ▶
                </span>
              </button>
            </div>
          </div>

          {/* Card 3: Serving Trays */}
          <div className="flex flex-col group">
            <div className="overflow-hidden rounded-[28px] shadow-sm bg-white/40">
              <img 
                src="/assets/homepage2/bestseller_trays.png" 
                alt="Serving Trays" 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-[#19241C] font-['Outfit'] mt-4">
              Serving Trays
            </h3>
            <div>
              <button 
                onClick={() => openQuote('Serving Trays')}
                className="mt-3 bg-[#cd9922] hover:bg-[#b5851b] text-white px-5 py-2 rounded-full font-medium text-xs inline-flex items-center gap-2 shadow-sm transition-all group active:scale-95"
              >
                <span>Get Quote</span>
                <span className="w-4 h-4 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[8px] transition-transform group-hover:translate-x-0.5">
                  ▶
                </span>
              </button>
            </div>
          </div>

          {/* Card 4: Compartment Plates */}
          <div className="flex flex-col group">
            <div className="overflow-hidden rounded-[28px] shadow-sm bg-white/40">
              <img 
                src="/assets/homepage2/bestseller_compartment.png" 
                alt="Compartment Plates" 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-[#19241C] font-['Outfit'] mt-4">
              Compartment Plates
            </h3>
            <div>
              <button 
                onClick={() => openQuote('Compartment Plates')}
                className="mt-3 bg-[#cd9922] hover:bg-[#b5851b] text-white px-5 py-2 rounded-full font-medium text-xs inline-flex items-center gap-2 shadow-sm transition-all group active:scale-95"
              >
                <span>Get Quote</span>
                <span className="w-4 h-4 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[8px] transition-transform group-hover:translate-x-0.5">
                  ▶
                </span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. WHO WE SUPPLY (RAPID 1-SECOND IMAGE SLIDESHOW) ── */}
      <section id="who-we-supply" className="relative z-10 py-12 px-6 lg:px-10 max-w-[1380px] mx-auto">
        <div className="relative rounded-[36px] overflow-hidden shadow-2xl border border-[#D5CAB9] bg-[#16221A] aspect-[16/9] max-h-[640px] w-full group">
          {/* Stacked Images for 1s transition */}
          {supplySlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                activeSlideIdx === idx ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Minimal Glass Progress Bar Indicators at the bottom */}
          <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center items-center gap-2 pointer-events-none">
            {supplySlides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlideIdx === idx 
                    ? 'w-10 bg-white shadow-lg' 
                    : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. GLOBAL EXPORT NETWORK (SPINNING GLOBE) ── */}
      <section id="global-export" className="relative z-10 py-16 lg:py-24 px-6 lg:px-10 max-w-[1380px] mx-auto">
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#19241C] font-['Outfit'] tracking-tight leading-[1.15]">
                Global Export Network <br className="hidden sm:block" />
                <span className="text-[#28543E]">Direct from India</span>
              </h2>

              {/* Key destination tags */}
              <div className="mt-7 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#6D7B72] uppercase tracking-wider mr-1">Active Corridors:</span>
                {['USA & Canada', 'United Kingdom', 'European Union', 'UAE & GCC', 'Australia'].map((dest, i) => (
                  <span 
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-[#E4DACD] text-[#1E2B22] font-semibold border border-[#D2C5B4]/50"
                  >
                    {dest}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => openQuote('Global Export Order Inquiry')}
                  className="bg-[#cd9922] hover:bg-[#b5851b] text-white px-7 py-3 rounded-full font-medium text-sm inline-flex items-center gap-2.5 shadow-sm transition-all group active:scale-95"
                >
                  <span>Request Export Rates & Tariffs</span>
                  <span className="w-5 h-5 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[10px] transition-transform group-hover:translate-x-0.5">
                    ▶
                  </span>
                </button>

                <button 
                  onClick={handleBrochureDownload}
                  className="px-6 py-3 rounded-full border border-[#cd9922]/50 text-[#cd9922] hover:bg-[#cd9922]/10 font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                >
                  <Download size={16} />
                  <span>Export Catalogue</span>
                </button>
              </div>
            </div>

            {/* Right Globe Column */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
              {/* Outer decorative ring container matching beige/olive theme */}
              <div className="relative w-full max-w-[480px] lg:max-w-[520px] aspect-square rounded-full flex items-center justify-center p-3">
                <div className="absolute inset-0 rounded-full border border-dashed border-[#28543E]/30 animate-spin" style={{ animationDuration: '60s' }}></div>
                <div className="absolute inset-4 rounded-full border border-[#28543E]/15"></div>
                
                {/* Globe Canvas Container */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full shadow-[0_20px_50px_rgba(40,84,62,0.12)]">
                  <CobeGlobe 
                    baseColor={[0.96, 0.94, 0.90]}
                    markerColor={[0.157, 0.329, 0.243]}
                    glowColor={[0.88, 0.84, 0.77]}
                    arcColor={[0.157, 0.329, 0.243]}
                  />
                </div>

                {/* Floating pill badges matching theme */}
                <div className="absolute -bottom-2 sm:bottom-4 left-4 bg-white/95 backdrop-blur-md border border-[#D5CAB9] px-4 py-2 rounded-2xl shadow-md flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28543E] animate-ping"></span>
                  <div>
                    <div className="text-[11px] font-bold text-[#19241C]">Origin Port: Mumbai (JNPT)</div>
                    <div className="text-[10px] text-[#65736A]">Weekly container departures</div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-[#D5CAB9] px-4 py-2 rounded-2xl shadow-md hidden sm:flex items-center gap-2">
                  <span className="text-xs font-bold text-[#28543E]">12+</span>
                  <span className="text-[11px] text-[#556358] font-medium">Export Destinations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. OUR CERTIFICATIONS ── */}
      <section className="relative z-10 py-16 px-6 lg:px-10 max-w-[1380px] mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#19241C] font-['Outfit'] tracking-tight">
          Our Certifications
        </h2>

        {/* 3 Certifications Centered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-3xl mx-auto mt-12 items-center justify-items-center">
          
          {/* 1. BRCGS */}
          <div className="flex flex-col items-center">
            <div className="h-24 flex items-center justify-center p-2">
              <img src="/assets/homepage2/cert_brcgs.png" alt="BRCGS Certified" className="h-20 w-auto object-contain" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#19241C] mt-2">BRCGS Certified</span>
          </div>

          {/* 2. Sedex */}
          <div className="flex flex-col items-center">
            <div className="h-24 flex items-center justify-center p-2">
              <img src="/assets/homepage2/cert_sedex.png" alt="Sedex Certified" className="h-16 w-auto object-contain" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#19241C] mt-2">Sedex Certified</span>
          </div>

          {/* 3. SGS */}
          <div className="flex flex-col items-center">
            <div className="h-24 flex items-center justify-center p-2">
              <img src="/assets/homepage2/cert_sgs.png" alt="SGS Food Safety" className="h-20 w-auto object-contain" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#19241C] mt-2">SGS Food Safety</span>
          </div>

        </div>

        {/* View Certifications Button */}
        <div className="mt-12">
          <button 
            onClick={() => openQuote('Certifications Inspection')}
            className="bg-[#cd9922] hover:bg-[#b5851b] text-white px-7 py-3 rounded-full font-medium text-sm inline-flex items-center gap-2.5 shadow-sm transition-all group active:scale-95"
          >
            <span>View Our Certifications</span>
            <span className="w-5 h-5 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[10px] transition-transform group-hover:translate-x-0.5">
              ▶
            </span>
          </button>
        </div>
      </section>

      {/* ── 10. OUR CLIENTS & PARTNERS (HORIZONTAL SCROLLING ROW) ── */}
      <section id="our-partners" className="relative z-10 py-16 px-6 lg:px-10 max-w-[1380px] mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#19241C] font-['Outfit'] tracking-tight">
          Our Partners
        </h2>
        <p className="text-[#65736A] text-sm md:text-base mt-2">
          Trusted by premier food brands, hospitality groups and packaging networks
        </p>

        {/* 1 Horizontal Scrolling Row with Transparent Background */}
        <div className="mt-10 relative overflow-hidden py-4">
          {/* Subtle gradient edges for smooth fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#F4EFE6] to-transparent z-10"></div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#F4EFE6] to-transparent z-10"></div>

          {/* Marquee / Scroll container */}
          <div className="flex items-center gap-12 sm:gap-16 overflow-x-auto no-scrollbar scroll-smooth px-8 py-2">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div 
                key={idx} 
                className="shrink-0 flex items-center justify-center p-3 transition-transform duration-300 hover:scale-110"
              >
                <img 
                  src="/assets/partners/haldirams_transparent.png" 
                  alt={`Partner ${idx + 1} Haldirams`} 
                  className="h-16 sm:h-20 w-auto object-contain drop-shadow-sm filter contrast-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Partner with us CTA */}
        <div className="mt-8">
          <button 
            onClick={() => setIsDistributorModalOpen(true)}
            className="bg-[#cd9922] hover:bg-[#b5851b] text-white px-7 py-3 rounded-full font-medium text-sm inline-flex items-center gap-2.5 shadow-sm transition-all group active:scale-95"
          >
            <span>Partner With Us</span>
            <span className="w-5 h-5 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[10px] transition-transform group-hover:translate-x-0.5">
              ▶
            </span>
          </button>
        </div>
      </section>

      {/* ── 11. FREQUENTLY ASKED QUESTIONS (DYNAMIC WITH POPUP FORMS) ── */}
      <section 
        id="faq-section" 
        className="relative z-10 py-16 px-6 lg:px-10 max-w-[1380px] mx-auto"
        onMouseEnter={() => setIsFaqPaused(true)}
        onMouseLeave={() => setIsFaqPaused(false)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Heading, dynamic description, Mode Switcher Pill & Dynamic Action Button */}
          <div className="lg:col-span-5 text-left flex flex-col justify-between">
            <div>
              {/* Category pill indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5DAD0] border border-[#D5CAB9] mb-4 text-xs font-bold text-[#28543E]">
                <span className="w-2 h-2 rounded-full bg-[#28543E] animate-pulse"></span>
                <span className="uppercase tracking-wider">
                  {faqMode === 'enquiry' ? 'Buyer Procurement FAQ' : 'Distributor Partnership FAQ'}
                </span>
              </div>

              {/* Dynamic Animated Heading */}
              <div className="transition-all duration-500 ease-in-out">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#19241C] font-['Outfit'] tracking-tight leading-tight">
                  Frequently Asked<br />Questions
                </h2>
                
                <p className="text-[#556358] text-sm sm:text-base leading-relaxed mt-5 min-h-[72px] transition-opacity duration-300">
                  {faqMode === 'enquiry' ? (
                    <span>
                      Essential answers on container MOQ, sample dispatch, FDA food-contact safety, and custom thermoformed bagasse tableware ordering.
                    </span>
                  ) : (
                    <span>
                      Discover our criteria for regional master distribution, volume-tier wholesale pricing, marketing support kits, and export container routing.
                    </span>
                  )}
                </p>
              </div>

              {/* Mode switch tabs & timer indicator */}
              <div className="mt-4 flex items-center gap-2">
                <div className="inline-flex p-1 rounded-full bg-[#E7E0D3] border border-[#D6CDBD]">
                  <button 
                    onClick={() => { setFaqMode('enquiry'); setOpenFaqIdx(0); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      faqMode === 'enquiry' ? 'bg-[#cd9922] text-white shadow-sm' : 'text-[#3B473E] hover:text-[#cd9922]'
                    }`}
                  >
                    Buyer Enquiry
                  </button>
                  <button 
                    onClick={() => { setFaqMode('distributor'); setOpenFaqIdx(0); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      faqMode === 'distributor' ? 'bg-[#cd9922] text-white shadow-sm' : 'text-[#3B473E] hover:text-[#cd9922]'
                    }`}
                  >
                    Become a Distributor
                  </button>
                </div>

                <span className="text-[11px] text-[#718076] font-medium hidden sm:inline">
                  {isFaqPaused ? '(Paused on hover)' : 'Auto-toggles every 5s'}
                </span>
              </div>

              {/* DYNAMIC ACTION BUTTON (Enquire / Become a Distributor with animated label) */}
              <div className="mt-8">
                {faqMode === 'enquiry' ? (
                  <button 
                    onClick={() => setIsEnquiryModalOpen(true)}
                    className="bg-[#cd9922] hover:bg-[#b5851b] text-white px-7 py-3 rounded-full font-medium text-sm inline-flex items-center gap-2.5 shadow-md transition-all duration-300 group active:scale-95 animate-in fade-in"
                  >
                    <FileText size={16} />
                    <span>Make an Enquiry</span>
                    <span className="w-5 h-5 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[10px] transition-transform group-hover:translate-x-0.5">
                      ▶
                    </span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsDistributorModalOpen(true)}
                    className="bg-[#cd9922] hover:bg-[#b5851b] text-white px-7 py-3 rounded-full font-medium text-sm inline-flex items-center gap-2.5 shadow-md transition-all duration-300 group active:scale-95 animate-in fade-in"
                  >
                    <Handshake size={16} />
                    <span>Become a Distributor</span>
                    <span className="w-5 h-5 rounded-full bg-white text-[#cd9922] flex items-center justify-center text-[10px] transition-transform group-hover:translate-x-0.5">
                      ▶
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick helper tip */}
            <div className="mt-10 pt-6 border-t border-[#D5CAB9]/80 hidden lg:block">
              <div className="text-xs text-[#627167]">
                Looking for both? You can also <button onClick={() => openQuote('Direct Custom Spec')} className="text-[#28543E] font-bold underline underline-offset-2">request a custom spec quote</button> anytime.
              </div>
            </div>
          </div>

          {/* Right Column: Accordion Container (Refreshes with smooth animation on switch) */}
          <div className="lg:col-span-7 bg-[#E5DAD0] rounded-[32px] p-6 sm:p-9 shadow-sm transition-all duration-500">
            <div key={faqMode} className="divide-y divide-[#D2C5B8] animate-in fade-in duration-300">
              {currentFaqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0">
                    <button 
                      onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                      className="w-full text-left flex items-center justify-between gap-4 group cursor-pointer"
                    >
                      <span className="font-bold text-[#19241C] text-sm sm:text-base group-hover:text-[#28543E] transition-colors">
                        {faq.question}
                      </span>
                      <span className="shrink-0 text-[#28543E] transition-transform duration-200">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mt-3 text-xs sm:text-sm text-[#4E5C53] leading-relaxed pr-6 animate-in fade-in slide-in-from-top-1">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ── 10. FOOTER ── */}
      <footer className="relative z-10 bg-[#0C1B14] rounded-t-[36px] text-white pt-14 pb-10 px-6 sm:px-10 lg:px-14 mt-16 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Col 1: Logo & Company Summary */}
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
            <div className="flex items-center gap-4 mt-8">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
                aria-label="Facebook"
              >
                <span className="font-bold text-xs">f</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
                aria-label="LinkedIn"
              >
                <span className="font-bold text-xs">in</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
                aria-label="Instagram"
              >
                <span className="text-xs">📷</span>
              </a>
            </div>
          </div>

          {/* Col 2: Links */}
          <div className="lg:col-span-2 text-left">
            <h4 className="font-bold text-sm tracking-wider uppercase text-white font-['Outfit']">
              Links
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-white/70 mt-5">
              <li>
                <a href="#who-are-we" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#products-glance" className="hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#facility-section" className="hover:text-white transition-colors">
                  Industries Served
                </a>
              </li>
              <li>
                <a 
                  href="/export" 
                  onClick={(e) => { e.preventDefault(); navigate('/export'); }} 
                  className="hover:text-white transition-colors"
                >
                  Export
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Get In Touch */}
          <div className="lg:col-span-3 text-left">
            <h4 className="font-bold text-sm tracking-wider uppercase text-white font-['Outfit']">
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
                  T: +919236086262
                </a>
              </li>
              <li className="pt-2">
                <button 
                  onClick={() => openQuote('Footer Contact')}
                  className="hover:text-white transition-colors text-white/80 underline underline-offset-4"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Policies */}
          <div className="lg:col-span-2 text-left">
            <h4 className="font-bold text-sm tracking-wider uppercase text-white font-['Outfit']">
              Policies
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-white/70 mt-5">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/10 mt-14 pt-6 text-center text-xs text-white/50">
          ©pulpcraft private limited, 2026
        </div>
      </footer>

      {/* ── 1. BUYER ENQUIRY MODAL (POPUP) ── */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-[#FAF7F2] text-[#1B251D] w-full max-w-2xl rounded-3xl p-6 sm:p-9 border border-[#D9D1C2] shadow-2xl relative my-8">
            <button 
              onClick={() => setIsEnquiryModalOpen(false)}
              className="absolute top-5 right-5 text-[#65736A] hover:text-[#19241C] p-1.5 rounded-full hover:bg-[#EAE2D5] transition-colors"
            >
              <X size={22} />
            </button>

            {enquirySubmitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 size={54} className="text-[#28543E] mx-auto" />
                <h3 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-[#19241C]">Buyer Enquiry Received!</h3>
                <p className="text-sm text-[#556358] max-w-md mx-auto leading-relaxed">
                  Thank you! Our international packaging desk will review your specifications and dispatch full FOB/CIF pricing along with complimentary evaluation samples within 24 hours.
                </p>
                <button 
                  onClick={() => { setIsEnquiryModalOpen(false); setEnquirySubmitted(false); }}
                  className="mt-6 bg-[#cd9922] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#b5851b] transition-all shadow-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6 text-left">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#28543E] bg-[#E7DFD2] px-3.5 py-1.5 rounded-full">
                    Buyer Procurement Desk
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] mt-3 text-[#19241C] tracking-tight">
                    Request Volume Pricing &amp; Samples
                  </h3>
                  <p className="text-xs sm:text-sm text-[#556358] mt-1.5 leading-relaxed">
                    Specify your destination port, required SKUs, or custom volume requirements. Our supply team provides consolidated FOB/CIF rates.
                  </p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEnquirySubmitted(true);
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Full Name *
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Company Name *
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Global Foods Logistics Inc"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Work Email *
                    </label>
                    <input 
                      required 
                      type="email" 
                      placeholder="sarah@globalfoods.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Delivery Hub / Country *
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. US (Los Angeles / Rotterdam)"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Target Volume Tier *
                    </label>
                    <select required className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]">
                      <option value="">Select Target Tier</option>
                      <option value="samples">Free Evaluation Samples First</option>
                      <option value="pallets">Domestic Pallets (1 - 5 Pallets)</option>
                      <option value="20ft">1x 20ft FCL Container</option>
                      <option value="40ft">1x 40ft HQ Container</option>
                      <option value="multi-40ft">Multiple 40ft HQ Monthly Contract</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Custom Specifications or Products of Interest
                    </label>
                    <textarea 
                      rows="3" 
                      placeholder="Mention specific items (e.g. 9-inch plates, 3-compartment containers, unbleached brown vs white) or barrier performance..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]"
                    ></textarea>
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-[#cd9922] hover:bg-[#b5851b] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
                    >
                      <span>Submit Buyer Enquiry</span>
                      <Send size={16} />
                    </button>
                    <p className="text-[11px] text-[#78857C] text-center mt-2.5">
                      🔒 Strict B2B Confidentiality • Free international sample packs available
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 2. DISTRIBUTOR APPLICATION MODAL (POPUP) ── */}
      {isDistributorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-[#FAF7F2] text-[#1B251D] w-full max-w-2xl rounded-3xl p-6 sm:p-9 border border-[#D9D1C2] shadow-2xl relative my-8">
            <button 
              onClick={() => setIsDistributorModalOpen(false)}
              className="absolute top-5 right-5 text-[#65736A] hover:text-[#19241C] p-1.5 rounded-full hover:bg-[#EAE2D5] transition-colors"
            >
              <X size={22} />
            </button>

            {distributorSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 size={54} className="text-[#28543E] mx-auto" />
                <h3 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-[#19241C]">Application Submitted!</h3>
                <p className="text-sm text-[#556358] max-w-md mx-auto leading-relaxed">
                  Thank you for your interest in becoming a PulpCraft distribution partner. Our channel development team will review your regional coverage and schedule a partnership onboarding call within 48 hours.
                </p>
                <button 
                  onClick={() => { setIsDistributorModalOpen(false); setDistributorSubmitted(false); }}
                  className="mt-6 bg-[#cd9922] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#b5851b] transition-all shadow-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6 text-left">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#28543E] bg-[#E7DFD2] px-3.5 py-1.5 rounded-full">
                    Global Distribution Partner Network
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] mt-3 text-[#19241C] tracking-tight">
                    Apply to Become a Distributor
                  </h3>
                  <p className="text-xs sm:text-sm text-[#556358] mt-1.5 leading-relaxed">
                    Gain exclusive territorial distribution rights, tiered factory-direct volume discounts, and complete sales and marketing enablement kits.
                  </p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDistributorSubmitted(true);
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Company Name *
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. EcoDistributors Europe Ltd"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Contact Name *
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. David Chen"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Business Email *
                    </label>
                    <input 
                      required 
                      type="email" 
                      placeholder="david@ecodistributors.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="+44 20 7946 0912"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Territory / Target Region *
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. United Kingdom & Ireland / Benelux"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Warehouse &amp; Logistics Capacity *
                    </label>
                    <select required className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]">
                      <option value="">Select Capacity</option>
                      <option value="regional-wh">Regional Warehouse (100 - 500 pallets)</option>
                      <option value="national-hub">National Logistics Hub (500+ pallets)</option>
                      <option value="cross-border">Multi-country Distribution Center</option>
                      <option value="expanding">Expanding Packaging Broker / Wholesaler</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Company Website or Portfolio Link
                    </label>
                    <input 
                      type="url" 
                      placeholder="https://www.yourdistributorbrand.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Current Client Channels &amp; Business Overview
                    </label>
                    <textarea 
                      rows="3" 
                      placeholder="Describe your current distribution network (e.g. food delivery aggregators, hotel chains, supermarket private label)..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]"
                    ></textarea>
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-[#cd9922] hover:bg-[#b5851b] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
                    >
                      <span>Submit Distributor Application</span>
                      <Handshake size={18} />
                    </button>
                    <p className="text-[11px] text-[#78857C] text-center mt-2.5">
                      🤝 Protected territorial rights subject to qualification &amp; volume commitment
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] text-[#1B251D] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-[#D9D1C2] shadow-2xl relative">
            
            <button 
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-5 right-5 text-[#65736A] hover:text-[#19241C]"
            >
              <X size={20} />
            </button>

            {quoteSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 size={48} className="text-[#28543E] mx-auto" />
                <h3 className="text-2xl font-bold font-['Outfit']">Quote Request Received!</h3>
                <p className="text-sm text-[#556358] max-w-sm mx-auto">
                  Thank you! Our export desk will review your inquiry for <strong>{quoteProduct}</strong> and dispatch CIF/FOB pricing within 4 business hours.
                </p>
                <button 
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="mt-4 bg-[#cd9922] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#b5851b] transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#28543E] bg-[#E7DFD2] px-3 py-1 rounded-full">
                    Direct Factory Pricing
                  </span>
                  <h3 className="text-2xl font-bold font-['Outfit'] mt-3 text-[#19241C]">
                    Request a Quote
                  </h3>
                  <p className="text-xs text-[#556358] mt-1">
                    Selected category: <span className="font-semibold text-[#28543E]">{quoteProduct}</span>
                  </p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setQuoteSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Full Name *
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                        Business Email *
                      </label>
                      <input 
                        required 
                        type="email" 
                        placeholder="john@company.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                        Phone / WhatsApp
                      </label>
                      <input 
                        type="tel" 
                        placeholder="+1 555-019-2834"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Estimated Volume / MoQ
                    </label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]">
                      <option>Sample Pack (Evaluation)</option>
                      <option>10,000 - 50,000 units</option>
                      <option>50,000 - 200,000 units</option>
                      <option>Full Container Load (FCL 20ft / 40ft)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B473E] uppercase mb-1">
                      Custom Specs or Notes
                    </label>
                    <textarea 
                      rows="3" 
                      placeholder="Specify sizes, unbleached / bleached preferences, or destination port..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0C7B8] bg-white text-sm focus:outline-none focus:border-[#28543E]"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#cd9922] hover:bg-[#b5851b] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>Submit Quote Request</span>
                    <Send size={16} />
                  </button>
                </form>
              </div>
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
