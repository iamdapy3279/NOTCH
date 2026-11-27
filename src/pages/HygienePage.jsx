import React, { useState, useEffect } from 'react';
import BrochureEmailModal from '../components/BrochureEmailModal';
import { getPreloadedVideoSrc } from '../utils/assetPreloader';
import { 
  Home,
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  ArrowRight, 
  Smile, 
  Sparkles, 
  Droplet, 
  ShieldCheck, 
  CheckCircle2, 
  Image as ImageIcon,
  Send
} from 'lucide-react';

export default function HygienePage({ navigate }) {
  const [showHeader, setShowHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [brochureToast, setBrochureToast] = useState(false);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [activeFaceSlide, setActiveFaceSlide] = useState(0);
  const [activeBathSlide, setActiveBathSlide] = useState(0);

  // Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState('Disposable Hygiene Towels');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [inlineFormSubmitted, setInlineFormSubmitted] = useState(false);

  const faceTowelSlides = [
    '/assets/hygiene/disposable_hand_towel.jpg?v=3',
    '/assets/hygiene/disposable_hand_towel_2.jpg?v=3'
  ];

  const bathTowelSlides = [
    '/assets/hygiene/disposable_bath_towel_1.jpg?v=3',
    '/assets/hygiene/disposable_bath_towel_2.jpg?v=3'
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-slideshow for product images (every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFaceSlide((prev) => (prev + 1) % faceTowelSlides.length);
      setActiveBathSlide((prev) => (prev + 1) % bathTowelSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [faceTowelSlides.length, bathTowelSlides.length]);

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

  const openQuote = (productName) => {
    setQuoteProduct(productName);
    setQuoteSubmitted(false);
    setIsQuoteModalOpen(true);
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      setIsQuoteModalOpen(false);
      setQuoteSubmitted(false);
    }, 2500);
  };

  const handleInlineSubmit = (e) => {
    e.preventDefault();
    setInlineFormSubmitted(true);
    setTimeout(() => setInlineFormSubmitted(false), 4000);
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
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#1B251D] font-['Plus_Jakarta_Sans'] overflow-x-hidden selection:bg-[#91593A] selection:text-white">
      
      {/* ── BROCHURE TOAST NOTIFICATION ── */}
      {brochureToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#28543E] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={20} className="text-[#86ea9a]" />
          <span className="text-sm font-semibold">NOTCH Hygiene Catalogue downloaded successfully!</span>
        </div>
      )}

      {/* ── 1. TRANSPARENT OVERLAY HEADER (ONLY FOR HYGIENE PAGE) ── */}
      <div className="absolute top-0 inset-x-0 z-30 bg-transparent">
        <header className="max-w-[1380px] mx-auto px-6 lg:px-10 pt-6 pb-4 flex items-center justify-between bg-transparent">
          {/* Brand Logo (Hygiene logo only on /hygiene) */}
          <div 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => goHome2()}
          >
            <img 
              src={
                typeof window !== 'undefined' && window.location.pathname === '/hygiene'
                  ? '/assets/hygiene/hygiene_logo.png'
                  : '/assets/homepage2/notch_logo.png'
              }
              alt="NOTCH Hygiene" 
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
            />
          </div>

          {/* Center Pill Nav (Desktop - Transparent over video) */}
          <nav className="hidden lg:flex items-center gap-1 bg-transparent backdrop-blur-xs px-2 py-1.5 rounded-full border border-white/25">
            <button 
              onClick={() => goHome2()}
              className="text-white/90 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => goHome2('who-are-we')}
              className="text-white/90 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-[#cd9922] text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm"
            >
              Hygiene
            </button>
            <button 
              onClick={() => navigate ? navigate('/products-2') : (window.location.href = '/products-2')}
              className="text-white/90 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Products
            </button>
            <button 
              onClick={() => document.getElementById('hygiene-inquiry')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-white/90 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Contact Us
            </button>
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

            {/* Mobile Home button */}
            <button 
              onClick={() => goHome2()} 
              className="lg:hidden p-2.5 text-[#28543E] bg-white/40 backdrop-blur-md rounded-full active:scale-95 transition-transform"
              aria-label="Go to Homepage"
            >
              <Home size={20} />
            </button>
          </div>
        </header>
      </div>

      {/* ── FLOATING PILL NAV (SLIDES DOWN ONLY ON SCROLL UP — DESKTOP/TABLET ONLY) ── */}
      <div 
        className={`hidden md:flex fixed top-4 inset-x-0 z-50 justify-center pointer-events-none transition-all duration-300 ease-in-out ${
          lastScrollY > 120 && showHeader 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-16 opacity-0'
        }`}
      >
        <nav className="pointer-events-auto flex items-center gap-1 bg-white/25 backdrop-blur-2xl px-3 py-1.5 rounded-full border border-white/45 shadow-[0_8px_32px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.6)] ring-1 ring-black/[0.04]">
          <button 
            onClick={() => goHome2()}
            className="text-[#1D2820] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-semibold transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
          >
            Home
          </button>
          <button 
            onClick={() => goHome2('who-are-we')}
            className="text-[#1D2820] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-semibold transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
          >
            About Us
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#cd9922] text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm active:scale-95"
          >
            Hygiene
          </button>
          <button 
            onClick={() => navigate ? navigate('/products-2') : (window.location.href = '/products-2')}
            className="text-[#1D2820] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-semibold transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
          >
            Products
          </button>
          <button 
            onClick={() => document.getElementById('hygiene-inquiry')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[#1D2820] hover:text-[#28543E] px-4 py-2 rounded-full text-sm font-semibold transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
          >
            Contact Us
          </button>
        </nav>
      </div>

      {/* ── SECTION 0: FULL-VIEWPORT (100vw × 100vh) HERO VIDEO (DESKTOP + MOBILE) ── */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#CBD3D8] flex items-center justify-center">
        {/* Desktop Autoplay Muted Full-Viewport Video */}
        {typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(max-width: 767px)').matches ? (
          <video
            key="hygiene-hero-desktop-v5"
            data-hero-video="true"
            src={getPreloadedVideoSrc('/assets/hygiene/hero_desktop.mp4?v=5')}
            poster="/assets/hygiene/hero_desktop_poster.jpg"
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onLoadedMetadata={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.volume = 0;
              e.currentTarget.play().catch(() => {});
            }}
            onCanPlay={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            }}
          />
        ) : (
          /* Mobile Autoplay Muted Full-Viewport Video */
          <video
            key="hygiene-hero-mobile-v5"
            data-hero-video="true"
            src={getPreloadedVideoSrc('/assets/hygiene/hero_mobile.mp4?v=5')}
            poster="/assets/hygiene/hero_mobile_poster.jpg"
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onLoadedMetadata={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.volume = 0;
              e.currentTarget.play().catch(() => {});
            }}
            onCanPlay={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            }}
          />
        )}

        {/* Bottom-Anchored Text Overlay & Explore CTA */}
        <div className="absolute bottom-14 sm:bottom-20 inset-x-0 z-20 flex flex-col items-center text-center px-6">
          <h2 className="max-w-xl md:max-w-none md:whitespace-nowrap text-2xl sm:text-3xl lg:text-[34px] font-medium text-[#3A1C0F] font-['Cormorant_Garamond',Georgia,serif] leading-snug tracking-[0.01em]">
            Ultra-Soft, Thick, Absorbent, Single-Use Virgin Towels
          </h2>
          <button
            type="button"
            onClick={() => document.getElementById('hygiene-products')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 bg-[#cd9922] hover:bg-[#b5851b] text-white px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold inline-flex items-center gap-2.5 shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Explore</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── MAIN HYGIENE PAGE CONTENT (1:1 CLONE OF REFERENCE) ── */}
      <main className="relative z-10 max-w-[1140px] mx-auto px-6 sm:px-10 pt-12 sm:pt-16 pb-20 space-y-12 sm:space-y-16">

        {/* ── SECTION 1: A CLEANER WAY TO DRY YOUR FACE ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Benefits List */}
          <div className="lg:col-span-6 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#91593A] font-['Outfit'] leading-[1.15] tracking-tight">
              A Cleaner Way to <br />
              Dry Your Face
            </h1>
            <p className="text-[#4A4E4B] text-xs sm:text-[13.5px] leading-relaxed mt-3.5 max-w-md">
              Replace bacteria-harboring cloth towels with ultra-soft, 100% plant-based single-use towels engineered for healthier skin.
            </p>

            {/* 5 Stacked Benefit Rows */}
            <div className="mt-8 divide-y divide-[#E6DFD5]">
              <div className="py-3.5 first:pt-0">
                <h3 className="text-sm sm:text-[15px] font-medium text-[#91593A] font-['Outfit']">
                  Single-Use Hygiene
                </h3>
                <p className="text-xs text-[#5A5E5B] mt-0.5">
                  Fresh, sterile towel every time — zero bacteria or mildew buildup.
                </p>
              </div>

              <div className="py-3.5">
                <h3 className="text-sm sm:text-[15px] font-medium text-[#91593A] font-['Outfit']">
                  Ultra-Soft &amp; Absorbent Plant-Based
                </h3>
                <p className="text-xs text-[#5A5E5B] mt-0.5">
                  Luxuriously thick, dual-textured weave for wet or dry facial care.
                </p>
              </div>

              <div className="py-3.5">
                <h3 className="text-sm sm:text-[15px] font-medium text-[#91593A] font-['Outfit']">
                  Ideal for Sensitive Skin
                </h3>
                <p className="text-xs text-[#5A5E5B] mt-0.5">
                  Dermatologist-tested, hypoallergenic &amp; free from harsh chemicals.
                </p>
              </div>

              <div className="py-3.5">
                <h3 className="text-sm sm:text-[15px] font-medium text-[#91593A] font-['Outfit']">
                  100% Biodegradable
                </h3>
                <p className="text-xs text-[#5A5E5B] mt-0.5">
                  Made from sustainably sourced renewable plant fibers.
                </p>
              </div>

              <div className="py-3.5 last:pb-0">
                <h3 className="text-sm sm:text-[15px] font-medium text-[#91593A] font-['Outfit']">
                  Multi-Use Versatility
                </h3>
                <p className="text-xs text-[#5A5E5B] mt-0.5">
                  Perfect for daily cleansing, makeup removal, travel &amp; spa treatments.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Autoplay Portrait Video */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[28px] overflow-hidden shadow-sm aspect-[414/534] bg-[#E8E0D5]">
              <video
                key="cleaner-way-face-v5"
                src={getPreloadedVideoSrc('/assets/hygiene/cleaner_way_face.mp4?v=5')}
                preload="auto"
                className="w-full h-full object-cover block"
                autoPlay
                muted
                loop
                playsInline
                onLoadedMetadata={(e) => {
                  e.currentTarget.muted = true;
                  e.currentTarget.volume = 0;
                  e.currentTarget.play().catch(() => {});
                }}
                onCanPlay={(e) => {
                  e.currentTarget.muted = true;
                  e.currentTarget.play().catch(() => {});
                }}
              />
            </div>
          </div>
        </section>

        {/* ── SECTION 2: DISPOSABLE HAND TOWEL ── */}
        <section id="hygiene-products" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Product Auto-Slideshow Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[28px] overflow-hidden shadow-sm aspect-square bg-[#E6DED3] group">
              {faceTowelSlides.map((slideSrc, idx) => (
                <img 
                  key={slideSrc}
                  src={slideSrc} 
                  alt="Disposable Hand Towel (30 × 60 cm)" 
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
                    activeFaceSlide === idx ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Product Specifications & Actions */}
          <div className="lg:col-span-6 text-left">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C7B6E] font-semibold block">
              SKINCARE &amp; DAILY RITUAL • 30 × 60 CM • 60 GSM
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#91593A] font-['Outfit'] mt-1 pb-4 border-b border-[#E6DFD5]">
              Disposable Hand Towel
            </h2>

            <div className="mt-5 space-y-3.5 text-xs sm:text-[13px] text-[#3B3F3C] leading-relaxed">
              <p>
                <strong className="font-semibold text-[#1E2420]">Generous 30 × 60 cm Dimensions:</strong> Perfectly sized at 30 × 60 cm for thorough hand, facial, and hair-wrap drying across luxury washrooms, salons, spas, and daily routines.
              </p>
              <p>
                <strong className="font-semibold text-[#1E2420]">100% Plant-Derived Cellulose:</strong> Sustainably crafted from renewable bamboo and eucalyptus viscose fibers for an ultra-pure, lint-free finish.
              </p>
              <p>
                <strong className="font-semibold text-[#1E2420]">Dual-Texture Performance:</strong> Features a pearl-embossed side for gentle cleansing and a smooth side for sensitive pat-drying.
              </p>
              <p>
                <strong className="font-semibold text-[#1E2420]">Superior 60 GSM Wet &amp; Dry Strength:</strong> Thick 60 GSM hydro-entangled weave absorbs up to 9× its weight in moisture without tearing or leaving residue.
              </p>
              <p>
                <strong className="font-semibold text-[#1E2420]">Zero Harsh Additives:</strong> Completely free from synthetic fragrances, optical brighteners, chemical binders, and microplastics.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button 
                onClick={() => openQuote('Disposable Hand Towel (30 × 60 cm, 60 GSM)')}
                className="px-5 py-2.5 rounded-full border border-[#D4CEC3] hover:border-[#91593A] text-[#2B2E2C] text-xs font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <span>Request Bulk Quote</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: DISPOSABLE BATH TOWELS ── */}
        <section className="pt-8 border-t border-[#ECE6DD] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Product Specifications & Actions */}
          <div className="lg:col-span-6 text-left">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C7B6E] font-semibold block">
              FULL-BODY HOSPITALITY &amp; WELLNESS • 70 × 140 CM • 60 GSM
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#91593A] font-['Outfit'] mt-1 pb-4 border-b border-[#E6DFD5]">
              Disposable Bath Towels
            </h2>

            <div className="mt-5 space-y-3.5 text-xs sm:text-[13px] text-[#3B3F3C] leading-relaxed">
              <p>
                <strong className="font-semibold text-[#1E2420]">Generous Full-Body Coverage:</strong> Sized at 70 × 140 cm to deliver a plush, enveloping post-shower experience for guests and members.
              </p>
              <p>
                <strong className="font-semibold text-[#1E2420]">Plush 60 GSM Weave:</strong> Thick 60 GSM waffle and pearl-weave plant fiber construction mimics luxury cotton softness with rapid moisture wicking.
              </p>
              <p>
                <strong className="font-semibold text-[#1E2420]">Zero Laundry &amp; Water Overhead:</strong> Eliminates commercial laundering costs, chemical detergents, and energy consumption for hotels, spas, and gyms.
              </p>
              <p>
                <strong className="font-semibold text-[#1E2420]">Individually Hygienic-Sealed:</strong> Every bath sheet is hermetically packed for guaranteed clinical sterility in suites, wellness clubs, and travel kits.
              </p>
              <p>
                <strong className="font-semibold text-[#1E2420]">Certified 90-Day Compostable:</strong> Naturally biodegrades after disposal with zero synthetic fibers or environmental persistence.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button 
                onClick={() => openQuote('Disposable Bath Towels (70 × 140 cm, 60 GSM)')}
                className="px-5 py-2.5 rounded-full border border-[#D4CEC3] hover:border-[#91593A] text-[#2B2E2C] text-xs font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <span>Request Bulk Quote</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Right Column: Auto-Slideshow Card (No Manual Arrow Buttons) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[28px] overflow-hidden bg-[#E6DED3] aspect-square shadow-sm group">
              {bathTowelSlides.map((slideSrc, idx) => (
                <img
                  key={slideSrc}
                  src={slideSrc}
                  alt="Disposable Bath Towels"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
                    activeBathSlide === idx ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4B: FULL-CARD GIF SHOWCASE (ZOOMED OUT 16:9, FULL CARD BLEED) ── */}
        <section className="w-full max-w-[1060px] mx-auto">
          <div className="rounded-[28px] overflow-hidden shadow-xs bg-[#e5d4be] aspect-[16/9]">
            <img
              src="/assets/hygiene/towel_strength.gif"
              alt="NOTCH Disposable Towel Tear-Resistant Tensile Strength"
              className="w-full h-full object-cover object-top block"
            />
          </div>
        </section>

        {/* ── SECTION 5: 4-COLUMN SAGE GREEN METRICS & CERTIFICATIONS BANNER ── */}
        <section>
          {/* MOBILE-ONLY: Horizontal Swipe Cards with Larger Text, Top-Right Icon & Subtle Swipe Hint */}
          <div className="sm:hidden">
            {/* Subtle Swipe Hint */}
            <div className="flex items-center justify-end gap-1.5 mb-2.5 px-1 text-[11px] font-medium tracking-wider uppercase text-[#8C7B6E]">
              <span>Swipe to explore</span>
              <ArrowRight size={13} className="animate-pulse text-[#91593A]" />
            </div>

            {/* 4 Horizontally Stacked Swipeable Cards */}
            <div className="-mx-6 px-6 flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
              {[
                {
                  stat: '5★',
                  label: 'RATED BY CUSTOMERS',
                  title: 'Pure Care Inside & Out',
                  bullets: [
                    '100% plant-derived viscose fibers',
                    'Zero lint, tearing, or pilling when wet',
                    'Trusted by estheticians & spas',
                  ],
                  desc: 'Consistently rated 5 stars for plush softness and clinical cleanliness.',
                  Icon: Smile,
                },
                {
                  stat: '-35%',
                  label: 'FEWER SKIN IRRITATIONS',
                  title: 'Gentle on Sensitive Skin',
                  bullets: [
                    'Eliminates bacterial cross-contamination',
                    'Supports clearer skin barrier health',
                    'Hypoallergenic & pH-neutral',
                  ],
                  desc: 'Switching from cloth towels significantly reduces pore-clogging bacteria.',
                  Icon: Sparkles,
                },
                {
                  stat: '100%',
                  label: 'PLANT-BASED FIBERS',
                  title: 'Plant-Based Materials',
                  bullets: [
                    'Sustainably harvested bamboo & eucalyptus',
                    'Zero polyester, nylon, or microplastics',
                    'Unbleached & chlorine-free processing',
                  ],
                  desc: 'Pure botanical cellulose engineered for ultra-high absorbency and strength.',
                  Icon: Droplet,
                },
                {
                  stat: '90 d',
                  label: 'BIODEGRADATION CYCLE',
                  title: 'Certified Eco-Safe Composition',
                  bullets: [
                    'Fully decomposes within 90 days',
                    'EN 13432 & OK Compost certified',
                    'OEKO-TEX® Standard 100 verified',
                  ],
                  desc: 'Returns cleanly to nature without polluting waterways or landfills.',
                  Icon: ShieldCheck,
                },
              ].map(({ stat, label, title, bullets, desc, Icon }, i) => (
                <div
                  key={i}
                  className="relative w-[84vw] max-w-[330px] shrink-0 snap-center bg-[#95A896] rounded-[26px] p-6 text-white shadow-xs flex flex-col justify-between text-left"
                >
                  {/* Top-Right Larger Icon */}
                  <div className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/18 border border-white/30 flex items-center justify-center text-white">
                    <Icon size={26} strokeWidth={1.75} />
                  </div>

                  <div>
                    <div className="pr-14">
                      <div className="text-4xl font-bold font-['Outfit'] tracking-tight">
                        {stat}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/85 font-semibold mt-1">
                        {label}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mt-5 leading-snug font-['Outfit']">
                      {title}
                    </h3>

                    <ul className="mt-4 space-y-2.5 text-[13.5px] text-white/95 leading-snug">
                      {bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="font-bold shrink-0">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-5 pt-4 border-t border-white/25 text-xs text-white/85 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TABLET & DESKTOP: Original 4-Column Sage Green Banner (Untouched) */}
          <div className="hidden sm:block bg-[#95A896] rounded-[28px] p-8 sm:p-12 lg:p-14 text-white shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-white/25 gap-8 lg:gap-0">
            
            {/* Column 1: 5★ */}
            <div className="lg:px-6 first:lg:pl-2 flex flex-col items-center text-center justify-between">
              <div className="w-full">
                <div className="text-3xl sm:text-4xl font-bold font-['Outfit'] tracking-tight">
                  5★
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/80 mt-1">
                  RATED BY CUSTOMERS
                </div>

                <h3 className="text-sm font-semibold text-white mt-5 leading-snug">
                  Pure Care Inside &amp; <br /> Out
                </h3>

                <ul className="mt-4 space-y-2 text-[11px] text-white/90 leading-relaxed">
                  <li>✓ 100% plant-derived viscose fibers</li>
                  <li>✓ Zero lint, tearing, or pilling when wet</li>
                  <li>✓ Trusted by estheticians &amp; spas</li>
                </ul>

                <p className="mt-4 text-[10.5px] text-white/75 leading-relaxed">
                  Consistently rated 5 stars for plush softness and clinical cleanliness.
                </p>
              </div>

              <div className="mt-6 pt-2 text-white/90">
                <Smile size={20} strokeWidth={1.75} />
              </div>
            </div>

            {/* Column 2: -35% */}
            <div className="pt-8 sm:pt-0 lg:px-6 flex flex-col items-center text-center justify-between">
              <div className="w-full">
                <div className="text-3xl sm:text-4xl font-bold font-['Outfit'] tracking-tight">
                  -35%
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/80 mt-1">
                  FEWER SKIN IRRITATIONS
                </div>

                <h3 className="text-sm font-semibold text-white mt-5 leading-snug">
                  Gentle on Sensitive <br /> Skin
                </h3>

                <ul className="mt-4 space-y-2 text-[11px] text-white/90 leading-relaxed">
                  <li>✓ Eliminates bacterial cross-contamination</li>
                  <li>✓ Supports clearer skin barrier health</li>
                  <li>✓ Hypoallergenic &amp; pH-neutral</li>
                </ul>

                <p className="mt-4 text-[10.5px] text-white/75 leading-relaxed">
                  Switching from cloth towels significantly reduces pore-clogging bacteria.
                </p>
              </div>

              <div className="mt-6 pt-2 text-white/90">
                <Sparkles size={20} strokeWidth={1.75} />
              </div>
            </div>

            {/* Column 3: 100% */}
            <div className="pt-8 lg:pt-0 lg:px-6 flex flex-col items-center text-center justify-between">
              <div className="w-full">
                <div className="text-3xl sm:text-4xl font-bold font-['Outfit'] tracking-tight">
                  100%
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/80 mt-1">
                  PLANT-BASED FIBERS
                </div>

                <h3 className="text-sm font-semibold text-white mt-5 leading-snug">
                  Plant-Based <br /> Materials
                </h3>

                <ul className="mt-4 space-y-2 text-[11px] text-white/90 leading-relaxed">
                  <li>✓ Sustainably harvested bamboo &amp; eucalyptus</li>
                  <li>✓ Zero polyester, nylon, or microplastics</li>
                  <li>✓ Unbleached &amp; chlorine-free processing</li>
                </ul>

                <p className="mt-4 text-[10.5px] text-white/75 leading-relaxed">
                  Pure botanical cellulose engineered for ultra-high absorbency and strength.
                </p>
              </div>

              <div className="mt-6 pt-2 text-white/90">
                <Droplet size={20} strokeWidth={1.75} />
              </div>
            </div>

            {/* Column 4: 90 d */}
            <div className="pt-8 lg:pt-0 lg:px-6 last:lg:pr-2 flex flex-col items-center text-center justify-between">
              <div className="w-full">
                <div className="text-3xl sm:text-4xl font-bold font-['Outfit'] tracking-tight">
                  90 d
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/80 mt-1">
                  BIODEGRADATION CYCLE
                </div>

                <h3 className="text-sm font-semibold text-white mt-5 leading-snug">
                  Certified Eco-Safe <br /> Composition
                </h3>

                <ul className="mt-4 space-y-2 text-[11px] text-white/90 leading-relaxed">
                  <li>✓ Fully decomposes within 90 days</li>
                  <li>✓ EN 13432 &amp; OK Compost certified</li>
                  <li>✓ OEKO-TEX® Standard 100 verified</li>
                </ul>

                <p className="mt-4 text-[10.5px] text-white/75 leading-relaxed">
                  Returns cleanly to nature without polluting waterways or landfills.
                </p>
              </div>

              <div className="mt-6 pt-2 text-white/90">
                <ShieldCheck size={20} strokeWidth={1.75} />
              </div>
            </div>

            </div>
          </div>
        </section>

        {/* ── SECTION 6: ENVIRONMENTS OF QUIET LUXURY (2x2 GRID) ── */}
        <section>
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="text-left">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#91593A] font-semibold block mb-2">
                DESIGNED FOR HOSPITALITY, WELLNESS &amp; MODERN LIVING
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] leading-[1.12] tracking-tight">
                <span className="font-bold text-[#19241C] font-['Outfit'] block">
                  Environments of
                </span>
                <span className="italic font-serif text-[#91593A] font-normal block mt-0.5">
                  Quiet Luxury
                </span>
              </h2>
            </div>

            <div className="text-left md:text-right max-w-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#19241C]">
                BUILT FOR ELEVATED SPACES
              </div>
              <p className="text-xs text-[#556358] leading-relaxed mt-1">
                From five-star hotel suites and clinical dermatology practices to luxury spas and mindful daily rituals.
              </p>
            </div>
          </div>

          {/* 2x2 Grid of 4 Environment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                title: 'Luxury Spas & Wellness',
                tag: 'TREATMENT & FACIAL RITUALS',
                image: '/assets/hygiene/env_spa.jpg?v=3'
              },
              {
                title: 'Boutique Hotels & Resorts',
                tag: 'FIVE-STAR GUEST AMENITIES',
                image: '/assets/hygiene/env_hotel.jpg?v=3'
              },
              {
                title: 'Salons & Aesthetics Studios',
                tag: 'CLINICAL SINGLE-USE GRADE',
                image: '/assets/hygiene/env_salon.jpg?v=3'
              },
              {
                title: 'Fitness & Recovery Clubs',
                tag: 'HYGIENIC REFRESH TOWELS',
                image: '/assets/hygiene/env_fitness.jpg?v=3'
              }
            ].map((item, idx) => (
              <div key={idx} className="group flex flex-col">
                <div className="rounded-[24px] overflow-hidden bg-[#E6DED3] shadow-xs">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto object-contain block"
                  />
                </div>
                <div className="flex items-center justify-between mt-3 px-1">
                  <span className="text-xs font-bold text-[#19241C]">
                    {item.title}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[#7A7E7B] font-medium">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 7: TECHNICAL SPECIFICATIONS TABLE ── */}
        <section className="pt-8 border-t border-[#ECE6DD] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Engineering Summary & Checkmarks */}
          <div className="lg:col-span-5 text-left">
            <h2 className="text-lg sm:text-xl font-bold text-[#19241C] font-['Outfit'] leading-snug">
              Engineered to Perform. <br />
              Certified to Decompose.
            </h2>
            <p className="text-xs sm:text-[13px] text-[#556358] leading-relaxed mt-3">
              Every towel is hydro-entangled using high-purity plant cellulose fibers — delivering commercial wet-strength without synthetic binders, optical brighteners, or microplastics.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-[#2C362F]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-[#28543E] shrink-0 mt-0.5" />
                <span>OEKO-TEX® Standard 100 Certified Safe for Direct Skin Contact</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-[#28543E] shrink-0 mt-0.5" />
                <span>Dermatologically Tested for Sensitive &amp; Post-Procedure Skin</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-[#28543E] shrink-0 mt-0.5" />
                <span>100% Biodegradable &amp; Compostable within 90 Days (EN 13432)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-[#28543E] shrink-0 mt-0.5" />
                <span>Custom OEM Private Label Boxes, Pouches &amp; GSM Weights</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Specification Table */}
          <div className="lg:col-span-7 w-full">
            <div className="divide-y divide-[#E5DFD5] text-xs">
              <div className="pb-3.5 flex items-center justify-between font-bold text-[#19241C] uppercase tracking-wider text-[11px]">
                <span>Product Specification</span>
                <span>Standard Metric / Value</span>
              </div>

              {[
                ['Material Source', '100% Plant-Based Viscose (Bamboo & Eucalyptus)'],
                ['Fabric Weight (GSM)', '60 GSM'],
                ['Weave Patterns', 'Pearl Embossed, Waffle Weave & Smooth Plain'],
                ['Hand Towel Dimensions', '30 × 60 cm (60 GSM)'],
                ['Bath Towel Dimensions', '70 × 140 cm (60 GSM, Individually Sealed)'],
                ['Absorption Capacity', 'Up to 9× dry weight in < 2.0 seconds'],
                ['Sterilization & Purity', 'ECF Purified, Fragrance-Free & Lint-Free'],
                ['End-of-Life Disposal', '100% Biodegradable in 90 Days (Home & Industrial)']
              ].map(([label, value], i) => (
                <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-left sm:text-right">
                  <span className="font-semibold text-[#3B473E]">{label}</span>
                  <span className="text-[#19241C] font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 7B: MAIN BENEFITS & INDUSTRY COMPARISON MATRIX ── */}
        <section className="pt-8 border-t border-[#ECE6DD]">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="text-left">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#91593A] font-semibold block">
                COMPARATIVE PERFORMANCE &amp; SECTOR IMPACT
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-normal text-[#19241C] font-['Outfit'] leading-tight mt-1">
                Our Towels vs. Regular{" "}
                <span className="italic font-serif text-[#91593A]">Laundered Towels</span>
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-[#556358] max-w-md text-left md:text-right leading-relaxed">
              A side-by-side comparison of hygiene assurance, operational savings, and sustainability impact across gyms, spas, and hotels.
            </p>
          </div>

          {/* Subtle Mobile Swipe Hint Above Comparison Table */}
          <div className="md:hidden flex items-center justify-end gap-1.5 mb-2.5 px-1 text-[11px] font-medium tracking-wider uppercase text-[#8C7B6E]">
            <span>Swipe to explore</span>
            <ArrowRight size={13} className="animate-pulse text-[#91593A]" />
          </div>

          {/* Comparison Table Card */}
          <div className="rounded-[28px] border border-[#E5DFD5] bg-[#F5F1E9]/75 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E2DBD0] bg-[#EFEADE]/80 text-[11px] uppercase tracking-[0.16em] font-bold text-[#3B473E] font-['Outfit']">
                    <th className="py-4 pl-6 pr-4 w-[34%]">Main Benefits</th>
                    <th className="py-4 px-4 text-center bg-[#95A896]/20 text-[#1E3528] w-[13%]">
                      Our Towels
                    </th>
                    <th className="py-4 px-4 text-center text-[#7A6A63] w-[14%]">
                      Regular Towels
                    </th>
                    <th className="py-4 px-4 text-center w-[13%]">Gym</th>
                    <th className="py-4 px-4 text-center w-[13%]">Spa</th>
                    <th className="py-4 pl-4 pr-6 text-center w-[13%]">Hotel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFD5] text-xs sm:text-[13.5px]">
                  {[
                    {
                      benefit: 'Fresh Towel for Every Customer',
                      detail: 'Individually unsealed per guest with zero prior usage history',
                      gym: 3,
                      spa: 3,
                      hotel: 3,
                    },
                    {
                      benefit: 'Reduced Cross-Contamination Risk',
                      detail: 'Eliminates bacterial, fungal, and skin-to-skin pathogen transfer',
                      gym: 3,
                      spa: 3,
                      hotel: 3,
                    },
                    {
                      benefit: 'No Laundry or Washing Required',
                      detail: 'Zero commercial washing machines, dryers, or chemical detergents',
                      gym: 3,
                      spa: 3,
                      hotel: 3,
                    },
                    {
                      benefit: 'Lower Laundry & Maintenance Costs',
                      detail: 'Cuts utility bills, staff handling hours, and linen replacement loss',
                      gym: 3,
                      spa: 2,
                      hotel: 3,
                    },
                    {
                      benefit: 'Consistent Hygiene Standards',
                      detail: 'Uniform 60 GSM softness and clinical cleanliness in every sheet',
                      gym: 3,
                      spa: 3,
                      hotel: 3,
                    },
                    {
                      benefit: 'Suitable for Wet & Dry Applications',
                      detail: 'High tensile hydro-entangled strength when soaked or dry',
                      gym: 3,
                      spa: 3,
                      hotel: 2,
                    },
                    {
                      benefit: 'Reduced Water Consumption',
                      detail: 'Saves thousands of liters of heated wash water every week',
                      gym: 2,
                      spa: 3,
                      hotel: 3,
                    },
                    {
                      benefit: 'Biodegradable & Eco-Conscious',
                      detail: '100% plant-derived viscose fibers that decompose naturally',
                      gym: 2,
                      spa: 3,
                      hotel: 3,
                    },
                    {
                      benefit: 'Convenient Storage & Handling',
                      detail: 'Compact stackable footprint vs. bulky linen carts and hampers',
                      gym: 3,
                      spa: 2,
                      hotel: 3,
                    },
                    {
                      benefit: 'Premium Guest Experience',
                      detail: 'Plush, lint-free, odor-free luxury feel on face, hands, and body',
                      gym: 2,
                      spa: 3,
                      hotel: 3,
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-white/60"
                    >
                      {/* Main Benefit + Informational Subtitle */}
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="font-semibold text-[#19241C] font-['Outfit'] text-sm">
                          {row.benefit}
                        </div>
                        <div className="text-[11.5px] text-[#657068] mt-0.5 leading-snug">
                          {row.detail}
                        </div>
                      </td>

                      {/* OUR TOWELS: ✓ */}
                      <td className="py-3.5 px-4 text-center bg-[#95A896]/15">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#28543E] text-white font-bold text-xs shadow-2xs">
                          ✓
                        </span>
                      </td>

                      {/* REGULAR TOWELS: ✕ */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#91593A]/12 text-[#91593A] font-bold text-xs">
                          ✕
                        </span>
                      </td>

                      {/* GYM Stars */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className="text-sm sm:text-base tracking-widest text-[#cd9922] font-semibold"
                          aria-label={`${row.gym} stars`}
                        >
                          {'★'.repeat(row.gym)}
                        </span>
                      </td>

                      {/* SPA Stars */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className="text-sm sm:text-base tracking-widest text-[#cd9922] font-semibold"
                          aria-label={`${row.spa} stars`}
                        >
                          {'★'.repeat(row.spa)}
                        </span>
                      </td>

                      {/* HOTEL Stars */}
                      <td className="py-3.5 pl-4 pr-6 text-center">
                        <span
                          className="text-sm sm:text-base tracking-widest text-[#cd9922] font-semibold"
                          aria-label={`${row.hotel} stars`}
                        >
                          {'★'.repeat(row.hotel)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Legend Bar */}
            <div className="px-6 py-3.5 bg-[#EFEADE]/70 border-t border-[#E2DBD0] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#556358]">
              <div className="flex flex-wrap items-center gap-5">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#28543E] text-white inline-flex items-center justify-center text-[9px] font-bold">✓</span>
                  <strong className="text-[#19241C]">Standard with NOTCH Towels</strong>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#91593A]/15 text-[#91593A] inline-flex items-center justify-center text-[9px] font-bold">✕</span>
                  <span>Not Guaranteed with Reusable Linen</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span><strong className="text-[#cd9922]">★★★</strong> Maximum Sector Impact</span>
                <span><strong className="text-[#cd9922]">★★</strong> High Sector Relevance</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 7C: FULL-WIDTH MARQUEE + 2-COLUMN HORIZONTAL SHOWCASE CARDS ── */}
        <section className="relative space-y-8 sm:space-y-10">
          {/* Full-Viewport Width Continuous Horizontal Marquee (Above Cards) */}
          <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden bg-[#EFE9DC] border-y border-[#E2D9C8] py-4 sm:py-5 select-none">
            <div className="notch-marquee-track items-center">
              {[0, 1].map((halfIdx) => (
                <div key={halfIdx} className="flex items-center shrink-0">
                  {Array.from({ length: 5 }).map((_, repeatIdx) => (
                    <div key={repeatIdx} className="flex items-center shrink-0">
                      {['MADE IN INDIA', 'WOMEN EMPOWERMENT', 'HAND PACKAGED'].map((phrase, pIdx) => (
                        <React.Fragment key={pIdx}>
                          <span className="text-sm sm:text-base lg:text-lg font-semibold tracking-[0.2em] uppercase text-[#91593A] font-['Outfit'] px-6 sm:px-9 whitespace-nowrap">
                            {phrase}
                          </span>
                          <span className="text-[#cd9922] text-xs sm:text-sm shrink-0" aria-hidden="true">
                            ✦
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 2-Column Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="rounded-[28px] overflow-hidden shadow-xs border border-[#E5DFD5] bg-[#E6DED3] h-[360px] sm:h-[440px] lg:h-[500px]">
              <img
                src="/assets/hygiene/wholesale_kraft_pouch.jpg"
                alt="NOTCH Single Use Ultra Clean Disposable Bath Towel Kraft Packaging"
                className="w-full h-full object-cover object-center block"
              />
            </div>

            <div className="rounded-[28px] overflow-hidden shadow-xs border border-[#E5DFD5] bg-[#E6DED3] h-[360px] sm:h-[440px] lg:h-[500px]">
              <img
                src="/assets/hygiene/women_packaging_team.jpg?v=2"
                alt="NOTCH Hygiene — Made in India, Women Empowerment, Hand Packaged"
                className="w-full h-full object-cover object-top block"
              />
            </div>
          </div>
        </section>

        {/* ── SECTION 8: B2B WHOLESALE & PRIVATE LABEL INQUIRY FORM (CENTERED CARD) ── */}
        <section id="hygiene-inquiry" className="w-full max-w-[1060px] mx-auto">
          <div className="bg-[#95A896] rounded-[28px] p-8 sm:p-10 lg:p-12 xl:p-14 text-white shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: B2B Partnership Pitch */}
            <div className="lg:col-span-5 text-left space-y-4">
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/80 font-semibold block">
                PRIVATE LABEL &amp; HOSPITALITY SUPPLY
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal font-['Outfit'] text-white leading-tight">
                Partner With Us for <br />
                Wholesale &amp; Custom OEM
              </h2>
              <p className="text-xs sm:text-[13.5px] text-white/90 leading-relaxed">
                Whether you are outfitting luxury hotel suites, clinical spas, or launching a custom private-label facial towel line, our production desk delivers tailored GSM weights, custom embossing, and retail-ready packaging.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-4 border-t border-white/25">
                <div>
                  <div className="text-[11px] font-bold text-white uppercase tracking-wider">Direct Dispatch</div>
                  <div className="text-xs text-white/85 mt-0.5">24-Hour Sample Kits</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white uppercase tracking-wider">Custom OEM</div>
                  <div className="text-xs text-white/85 mt-0.5">Private Label Boxes</div>
                </div>
              </div>
            </div>

            {/* Right Column: 2x2 Form + Textarea */}
            <div className="lg:col-span-7">
              {inlineFormSubmitted ? (
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 text-center space-y-3 border border-white/30">
                  <CheckCircle2 size={36} className="text-white mx-auto" />
                  <h3 className="text-xl font-bold font-['Outfit'] text-white">
                    Wholesale Inquiry Received
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 max-w-md mx-auto">
                    Thank you! Our hygiene division desk will dispatch your custom quotation and complimentary evaluation samples within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInlineSubmit} className="space-y-4 text-left">
                  <div className="text-sm font-semibold text-white mb-2 font-['Outfit']">
                    Request Wholesale Pricing &amp; Sample Kit
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-white/90 mb-1">
                        Full Name *
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Jane Doe"
                        className="w-full px-4 py-2.5 rounded-lg bg-white text-[#19241C] text-xs sm:text-sm border border-black/10 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-white/90 mb-1">
                        Corporate Email *
                      </label>
                      <input 
                        type="email" 
                        required 
                        placeholder="jane@brand.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-white text-[#19241C] text-xs sm:text-sm border border-black/10 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/90 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-lg bg-white text-[#19241C] text-xs sm:text-sm border border-black/10 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-white/90 mb-1">
                        Product Line
                      </label>
                      <select className="w-full px-4 py-2.5 rounded-lg bg-white text-[#19241C] text-xs sm:text-sm border border-black/10 focus:outline-none focus:ring-2 focus:ring-white">
                        <option>Disposable Hand Towel (30 × 60 cm)</option>
                        <option>Disposable Bath Towels</option>
                        <option>Both Hand &amp; Bath Towels</option>
                        <option>Custom Private Label OEM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-white/90 mb-1">
                        Estimated Volume
                      </label>
                      <select className="w-full px-4 py-2.5 rounded-lg bg-white text-[#19241C] text-xs sm:text-sm border border-black/10 focus:outline-none focus:ring-2 focus:ring-white">
                        <option>Sample Kit / Pilot Order</option>
                        <option>5,000 – 25,000 Units</option>
                        <option>25,000 – 100,000 Units</option>
                        <option>Full Container Load (FCL)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/90 mb-1">
                      Message / Custom Specifications
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Tell us about your preferred GSM, towel dimensions, or custom box packaging requirements..."
                      className="w-full px-4 py-2.5 rounded-lg bg-white text-[#19241C] text-xs sm:text-sm border border-black/10 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-white/85 hover:bg-white text-[#3A4A3B] py-3 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                    >
                      <span>Request Quote &amp; Sample Kit</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              )}
            </div>

            </div>
          </div>
        </section>

      </main>

      {/* ── 10. FOOTER (EXACT SAME DESIGN AS HOMEPAGE 2) ── */}
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
                <a href="/homepage-2#who-are-we" onClick={(e) => { e.preventDefault(); goHome2('who-are-we'); }} className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/products-2" onClick={(e) => { e.preventDefault(); navigate ? navigate('/products-2') : (window.location.href = '/products-2'); }} className="hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="/homepage-2#facility-section" onClick={(e) => { e.preventDefault(); goHome2('facility-section'); }} className="hover:text-white transition-colors">
                  Industries Served
                </a>
              </li>
              <li>
                <a 
                  href="/export" 
                  onClick={(e) => { e.preventDefault(); navigate ? navigate('/export') : (window.location.href = '/export'); }} 
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
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
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

      {/* ── QUOTE / SAMPLE MODAL ── */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] text-[#1B251D] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-[#D9D1C2] shadow-2xl relative">
            <button 
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-5 right-5 text-[#65736A] hover:text-[#19241C]"
            >
              <X size={20} />
            </button>

            {quoteSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#28543E]/15 text-[#28543E] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="text-2xl font-extrabold font-['Outfit'] text-[#19241C]">
                  Request Received
                </h3>
                <p className="text-sm text-[#5A685E] max-w-sm mx-auto">
                  Thank you! Our team will review your inquiry for <strong>{quoteProduct}</strong> and dispatch pricing &amp; sample details shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#91593A]/15 text-[#91593A] mb-2">
                  Hygiene Division Inquiry
                </div>
                <h3 className="text-2xl font-extrabold font-['Outfit'] text-[#19241C]">
                  {quoteProduct}
                </h3>
                <p className="text-xs text-[#65736A] mt-1">
                  Complete the form below for bulk pricing, private-label MOQ options, and complimentary sample kits.
                </p>

                <form onSubmit={handleQuoteSubmit} className="mt-5 space-y-3.5 text-left">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3B473E] mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="John Carter"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5CCC0] text-sm focus:outline-none focus:border-[#91593A]"
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
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5CCC0] text-sm focus:outline-none focus:border-[#91593A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#3B473E] mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5CCC0] text-sm focus:outline-none focus:border-[#91593A]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3B473E] mb-1">
                      Estimated Order Quantity / Notes
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="e.g. 10,000 pop-up boxes or custom embossed bath towels..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5CCC0] text-sm focus:outline-none focus:border-[#91593A]"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#cd9922] hover:bg-[#b5851b] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Send size={15} />
                    <span>Submit Hygiene Inquiry</span>
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
