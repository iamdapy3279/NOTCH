import React, { useMemo, useState, useEffect } from "react";
import CobeGlobe from '../components/CobeGlobe';
import { useCatalog } from '../context/CatalogContext';

export default function HomePage({ navigate }) {
  const [activeFormTab, setActiveFormTab] = useState('buyer');
  const { catalog, openProductModal, selectedProducts, toggleProductSelection } = useCatalog();
  const categories = catalog?.categories || [];

  const [isBannerHidden, setIsBannerHidden] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 });
  const [touchStartPos, setTouchStartPos] = useState(null);

  useEffect(() => {
    setIsBannerHidden(false);
  }, [selectedProducts.length]);

  const handleTouchStart = (e) => {
    setTouchStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e) => {
    if (!touchStartPos) return;
    const dx = Math.max(0, e.touches[0].clientX - touchStartPos.x); // only right
    const dy = Math.max(0, e.touches[0].clientY - touchStartPos.y); // only down
    
    if (dx > dy) {
      setSwipeOffset({ x: dx, y: 0 });
    } else {
      setSwipeOffset({ x: 0, y: dy });
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset.x > 75 || swipeOffset.y > 75) {
      setIsBannerHidden(true);
    }
    setSwipeOffset({ x: 0, y: 0 });
    setTouchStartPos(null);
  };
  const heroImages = ['/Assets/SlideShow/HeroSlide1.png', '/Assets/SlideShow/HeroSlide2.png', '/Assets/SlideShow/HeroSlide4.png'];
  const [heroIndex, setHeroIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const allProducts = useMemo(() => {
    let prods = [];
    categories.forEach((cat) => {
      if (cat.products) prods.push(...cat.products);
    });
    return prods;
  }, [categories]);



  return (
    <>
      {/* Inject Main Content */}
      
<main>
{/*  HERO SECTION: Centered full-viewport showcase with floating dock bar  */}
<section className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-between items-center px-6 md:px-12 pt-20 pb-12 overflow-hidden border-b border-outline-variant/30">
<div className="absolute inset-0 w-full h-full z-0">

{heroImages.map((img, idx) => (
  <img 
    key={img} 
    alt="Sustainable fiber packaging" 
    className={`w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-1000 ${idx === heroIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`} 
    src={img} 
  />
))}

<div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/80 z-10"></div>
<div className="absolute inset-0 backdrop-blur-[1px] z-10"></div>
</div>
<div className="relative z-20 max-w-4xl mx-auto w-full text-center flex-1 flex flex-col justify-center items-center my-auto">
<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1811]/90 border border-outline-variant/40 mb-6 shadow-lg">
<span className="material-symbols-outlined text-secondary-fixed text-base" data-icon="verified">verified</span>
<span className="text-label-md font-label-md text-secondary-fixed">Verified Global Fiber Supply Network</span>
</div>
<h1 className="text-headline-xl-mobile md:text-display-lg font-headline-xl-mobile md:font-display-lg text-on-primary tracking-tight mb-6 font-bold max-w-3xl">Sustainable Food Packaging, Supplied for Business</h1>
<p className="text-body-lg font-body-lg text-surface-bright/90 mb-10 leading-relaxed max-w-2xl mx-auto">Connecting enterprise buyers with audited, high-precision molded sugarcane bagasse and bamboo fiber packaging manufacturers worldwide. Built for scale, compliance, and guaranteed circular metrics.</p>

</div>
{/*  Horizontal Floating Dock Bar  */}
<div className="relative z-20 w-full max-w-4xl mx-auto mt-8">
<div className="bg-black/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
<div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-container-lowest/10">
<div className="w-10 h-10 rounded-full bg-surface-container-lowest/90 flex items-center justify-center text-primary shrink-0">
<span className="material-symbols-outlined text-xl" data-icon="forest">forest</span>
</div>
<div className="text-left">
<div className="text-label-md font-label-md text-on-primary font-semibold">100% Tree-Free</div>
<div className="text-label-sm font-label-sm text-outline-variant">Bagasse &amp; Sugarcane</div>
</div>
</div>
<div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-container-lowest/10">
<div className="w-10 h-10 rounded-full bg-surface-container-lowest/90 flex items-center justify-center text-primary shrink-0">
<span className="material-symbols-outlined text-xl" data-icon="health_and_safety">health_and_safety</span>
</div>
<div className="text-left">
<div className="text-label-md font-label-md text-on-primary font-semibold">Certified Grade</div>
<div className="text-label-sm font-label-sm text-outline-variant">100% PFAS-Free</div>
</div>
</div>
<div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-container-lowest/10">
<div className="w-10 h-10 rounded-full bg-surface-container-lowest/90 flex items-center justify-center text-primary shrink-0">
<span className="material-symbols-outlined text-xl" data-icon="inventory_2">inventory_2</span>
</div>
<div className="text-left">
<div className="text-label-md font-label-md text-on-primary font-semibold">FCL &amp; Boxes</div>
<div className="text-label-sm font-label-sm text-outline-variant">Direct Contracts</div>
</div>
</div>
</div>
</div>
</section>
{/*  MANUFACTURING SECTION: Large facility preview full-width on top with 3 metrics directly underneath  */}
<section className="py-16 md:py-24 bg-surface border-b border-outline-variant/30" id="manufacturing">
<div className="max-w-7xl mx-auto px-6 md:px-12">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
<div>
<div className="inline-flex items-center gap-1.5 text-secondary text-label-md font-label-md uppercase tracking-widest mb-2 font-mono">
<span className="material-symbols-outlined text-sm">factory</span> Industrial Precision Operations
        </div>
<h2 className="text-headline-lg md:text-headline-xl font-headline-lg md:font-headline-xl text-primary tracking-tight">Direct In-House Precision Manufacturing</h2>
<p className="text-body-md font-body-md text-on-surface-variant mt-2 max-w-3xl">Take an inside look at our state-of-the-art thermoformed fiber pulp production lines, ISO-certified cleanroom environments, and automated robotic edge-trimming facilities.</p>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container/40 border border-secondary/30 text-label-sm font-label-sm text-secondary font-mono">
<span className="w-2 h-2 rounded-full bg-secondary inline-block"></span> Live Inspection Ready
        </span>
</div>
</div>
{/*  Prominent Full-Width Video Preview  */}
<div className="relative rounded-2xl overflow-hidden border border-outline-variant/60 shadow-xl mb-6 group">
<img alt="High-tech sustainable packaging automated factory production floor" className="w-full h-[400px] md:h-[540px] object-cover object-center group-hover:scale-105 transition-transform duration-700" src="/Assets/SlideShow/HeroSlide2.png" />
<div className="absolute inset-0 bg-black/25 flex items-center justify-center">
<button aria-label="Play facility tour" className="w-20 h-20 rounded-full bg-surface-container-lowest/90 text-primary flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-surface-container-lowest transition-all" type="button">
<span className="material-symbols-outlined text-4xl">play_arrow</span>
</button>
</div>
</div>
{/*  3 Metric Indicators directly underneath in a clean horizontal strip  */}
</div>
</section>
{/*  PRODUCT CATALOGUE WITH B2B ENQUIRY BASKET  */}
<section className="py-16 md:py-24 bg-surface-container-low border-b border-outline-variant/30" id="products">
<div className="max-w-7xl mx-auto px-6 md:px-12">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
<div>
<div className="inline-flex items-center gap-1.5 text-secondary text-label-md font-label-md uppercase tracking-widest mb-2">
<span className="material-symbols-outlined text-sm" data-icon="category">category</span>
              B2B Standard &amp; Custom Inventory
            </div>
<h2 className="text-headline-lg font-headline-lg text-primary tracking-tight">Our Product Range</h2>
<p className="text-body-md font-body-md text-on-surface-variant mt-2 max-w-2xl">
              Select multiple products to build your custom B2B enquiry and receive consolidated volume pricing.
            </p>
</div>
<div className="flex items-center gap-3">
<span className="text-label-sm font-label-sm text-outline uppercase font-mono">MOQ: 1x 20ft Palletized</span>
<div className="h-4 w-px bg-outline-variant"></div>
<span className="text-label-sm font-label-sm text-secondary font-mono flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-secondary inline-block"></span> EN 13432 Compostable
            </span>
</div>
</div>
{/*  8 Product Grid Cards  */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
  {allProducts.slice(0, 8).map(prod => (
<div key={prod.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 hover:border-primary transition-all duration-200 overflow-hidden flex flex-col group p-3 sm:p-4 shadow-sm hover:shadow-md cursor-pointer" onClick={() => openProductModal(prod)}>
<div className="relative bg-surface rounded-lg overflow-hidden h-36 sm:h-52 mb-4">
<img alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={prod.thumbnail || 'https://via.placeholder.com/300'} />
<span className="absolute top-3 left-3 bg-surface-container-lowest/90 px-2.5 py-0.5 rounded text-label-sm font-label-sm text-primary border border-outline-variant/40">{prod.modelNumber}</span>
</div>
<div className="flex-1 flex flex-col">
<h3 className="text-headline-sm font-headline-sm text-primary mb-3">{prod.name}</h3>
<div className="mt-auto pt-3 border-t border-outline-variant/30 flex flex-col gap-2.5"><span className="text-label-sm font-label-sm text-outline font-mono">View Details</span>
<button className={`product-toggle-btn w-full justify-center inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-label-sm font-label-sm transition-colors ${selectedProducts.some(p => p.id === prod.id) ? 'bg-[#0a1811] text-[#86ea9a] border-[#0a1811]' : 'border-primary text-primary hover:bg-primary hover:text-on-primary'}`} onClick={(e) => { e.stopPropagation(); toggleProductSelection(prod); }} type="button">
  <span className="material-symbols-outlined text-sm">{selectedProducts.some(p => p.id === prod.id) ? 'check' : 'add'}</span>
  <span className="">{selectedProducts.some(p => p.id === prod.id) ? 'Selected' : 'Enquire'}</span>
</button>
</div>
</div>
</div>
  ))}
</div>
</div>
</section>
{/*  STICKY / FLOATING BOTTOM ENQUIRY BASKET COUNTER BAR  */}
<div 
  className={`fixed bottom-6 inset-x-0 z-40 px-6 transition-all duration-300 ${(selectedProducts.length === 0 || isBannerHidden) ? 'translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`} 
  id="enquiryBar"
>
<div 
  className="max-w-4xl mx-auto bg-primary text-on-primary p-4 rounded-xl shadow-2xl border border-primary-container/80 flex flex-col sm:flex-row items-center justify-between gap-4"
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  style={{
    transform: touchStartPos ? `translate(${swipeOffset.x}px, ${swipeOffset.y}px)` : 'none',
    transition: touchStartPos ? 'none' : 'all 0.3s ease-out',
    opacity: touchStartPos ? Math.max(0, 1 - Math.max(swipeOffset.x, swipeOffset.y) / 150) : 1
  }}
>
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-on-secondary shrink-0">
<span className="material-symbols-outlined text-xl" data-icon="shopping_basket">shopping_basket</span>
</div>
<div>
<div className="text-label-lg font-label-lg text-primary-fixed" id="selectedCountText">{selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected</div>
<div className="text-label-sm font-label-sm text-outline-variant truncate max-w-md" id="selectedNamesText">{selectedProducts.map(p => p.name).join(', ')}</div>
</div>
</div>
<a className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-label-lg text-label-lg font-bold hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center gap-2 shrink-0" href="#enquiry-section" onClick={() => setActiveFormTab('buyer')}>
<span className="">Send Enquiry</span>
<span className="material-symbols-outlined text-base" data-icon="arrow_forward">arrow_forward</span>
</a>
</div>
</div>
{/*  WHAT YOU'LL GET: Bento-box layout with prominent lead card on top and four symmetrical quadrant cards underneath  */}
<section className="py-16 md:py-24 bg-surface border-b border-outline-variant/30" id="what-you-get">
<div className="max-w-7xl mx-auto px-6 md:px-12">
<div className="text-center max-w-3xl mx-auto mb-16">
<span className="text-secondary text-label-md font-label-md uppercase tracking-widest block mb-2 font-mono">The Sourcing Advantage</span>
<h2 className="text-headline-lg md:text-headline-xl font-headline-lg md:font-headline-xl text-primary tracking-tight">WHAT YOU'LL GET</h2>
<p className="text-body-md font-body-md text-on-surface-variant mt-3">
            Engineered packaging infrastructure providing tier-1 procurement reliability without intermediary markups.
          </p>
</div>
<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
{/*  Lead Card: Bulk Supply (spans 2 columns on mobile, spans 2 columns on lg)  */}
<div className="col-span-2 bg-surface-container-lowest p-4 md:p-8 rounded-xl md:rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
<div className="max-w-3xl">
<div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-surface-container-low flex items-center justify-center text-primary mb-3 md:mb-6">
<span className="material-symbols-outlined text-2xl md:text-3xl" data-icon="conveyor_belt">conveyor_belt</span>
</div>
<h3 className="text-headline-sm md:text-headline-md font-headline-sm md:font-headline-md font-bold text-primary mb-2 md:mb-3">BULK SUPPLY &amp; INVENTORY BUFFER</h3>
<p className="text-body-sm md:text-body-md font-body-sm md:font-body-md text-on-surface-variant leading-relaxed line-clamp-2 md:line-clamp-none">
        Reliable 20ft &amp; 40ft High Cube container shipment cycles direct from certified manufacturing floors. Domestic bonded warehousing buffers are maintained to protect enterprise supply continuity against port bottlenecks.
      </p>
</div>
<div className="md:text-right shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-outline-variant/30 md:pl-8 flex flex-col justify-between">
<div className="text-label-sm font-label-sm text-secondary font-mono mb-1 md:mb-2">05 / FCL &amp; PALLETIZED NETWORK</div>
<span className="text-xs md:text-label-md font-label-md font-semibold text-primary block">FOB / CIF / DDP Available</span>
</div>
</div>
{/*  Card 1: Free Samples  */}
<div className="bg-surface-container-lowest p-4 md:p-8 rounded-xl md:rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
<div>
<div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-3 md:mb-6">
<span className="material-symbols-outlined text-xl md:text-2xl" data-icon="mark_email_read">mark_email_read</span>
</div>
<h3 className="text-sm sm:text-base md:text-headline-sm font-bold text-primary mb-1 md:mb-2">FREE SAMPLES</h3>
<p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2 md:line-clamp-none">
          Physical product sample boxes dispatched within 24 hours directly to your test kitchen or office. Complimentary international freight included.
        </p>
</div>
<div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-outline-variant/30 text-label-sm font-label-sm text-secondary font-mono truncate">01 / TACTILE EVALUATION</div>
</div>
{/*  Card 2: Custom Quotes  */}
<div className="bg-surface-container-lowest p-4 md:p-8 rounded-xl md:rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
<div>
<div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-3 md:mb-6">
<span className="material-symbols-outlined text-xl md:text-2xl" data-icon="architecture">architecture</span>
</div>
<h3 className="text-sm sm:text-base md:text-headline-sm font-bold text-primary mb-1 md:mb-2">CUSTOM QUOTES</h3>
<p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2 md:line-clamp-none">
          Submit your 3D CAD files or custom mould specifications. We deliver precision CNC tooling schedules and low-amortization production quotes.
        </p>
</div>
<div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-outline-variant/30 text-label-sm font-label-sm text-secondary font-mono truncate">02 / BESPOKE ENGINEERING</div>
</div>
{/*  Card 3: Audit Ready  */}
<div className="bg-surface-container-lowest p-4 md:p-8 rounded-xl md:rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
<div>
<div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-3 md:mb-6">
<span className="material-symbols-outlined text-xl md:text-2xl" data-icon="verified_user">verified_user</span>
</div>
<h3 className="text-sm sm:text-base md:text-headline-sm font-bold text-primary mb-1 md:mb-2">AUDIT READY</h3>
<p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2 md:line-clamp-none">
          Comprehensive batch-level certification dossiers supplied: BPI Compostable, FDA Food Contact, EN 13432, and ISO 9001/14001 compliance sheets.
        </p>
</div>
<div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-outline-variant/30 text-label-sm font-label-sm text-secondary font-mono truncate">03 / INSTITUTIONAL COMPLIANCE</div>
</div>
{/*  Card 4: 24-Hour Quotes  */}
<div className="bg-surface-container-lowest p-4 md:p-8 rounded-xl md:rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
<div>
<div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-3 md:mb-6">
<span className="material-symbols-outlined text-xl md:text-2xl" data-icon="timer">timer</span>
</div>
<h3 className="text-sm sm:text-base md:text-headline-sm font-bold text-primary mb-1 md:mb-2">24-HOUR QUOTES</h3>
<p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2 md:line-clamp-none">
          Transparent containerized matrix models, landed freight breakdown per port of entry, and graduated volume discount tiers provided within 24 hours.
        </p>
</div>
<div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-outline-variant/30 text-label-sm font-label-sm text-secondary font-mono truncate">04 / RAPID COST AUDIT</div>
</div>
</div>
</div>
</section>
{/*  WHO WE SUPPLY: Editorial staggered bento grid (2 large featured cards on top row, 4 compact cards on bottom row)  */}
<section className="py-16 md:py-24 bg-surface-container-low border-b border-outline-variant/30" id="industries">
<div className="max-w-7xl mx-auto px-6 md:px-12">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
<div>
<span className="text-secondary text-label-md font-label-md uppercase tracking-widest block mb-2 font-mono">Target Deployments</span>
<h2 className="text-headline-lg md:text-headline-xl font-headline-lg md:font-headline-xl text-primary tracking-tight">WHO WE SUPPLY</h2>
</div>
</div>
<div className="space-y-6"><div className="flex overflow-x-auto snap-x snap-mandatory pb-4 gap-4 -mx-6 px-6 sm:-mx-12 sm:px-12 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible"><div className="relative group rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm h-80 sm:h-96 md:h-80 flex flex-col justify-end p-6 w-[82%] sm:w-[320px] md:w-auto shrink-0 snap-center"><img alt="Restaurants &amp; Fine Dining" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/Assets/IndustriesWeSupply/Cafe.png" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div><div className="relative z-10 text-on-primary"><span className="text-label-sm font-label-sm text-secondary-fixed uppercase tracking-wider font-mono">Aesthetic &amp; Presentation</span><h3 className="text-headline-sm font-headline-sm font-bold text-on-primary mt-1">Restaurants &amp; Fine Dining</h3></div></div><div className="relative group rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm h-80 sm:h-96 md:h-80 flex flex-col justify-end p-6 w-[82%] sm:w-[320px] md:w-auto shrink-0 snap-center"><img alt="Quick Service Restaurants (QSRs)" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/Assets/IndustriesWeSupply/Cafe.png" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div><div className="relative z-10 text-on-primary"><span className="text-label-sm font-label-sm text-secondary-fixed uppercase tracking-wider font-mono">High Velocity Takeout</span><h3 className="text-headline-sm font-headline-sm font-bold text-on-primary mt-1">Quick Service Restaurants (QSRs)</h3></div></div><div className="relative group rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm h-80 sm:h-96 md:h-80 flex flex-col justify-end p-6 w-[82%] sm:w-[320px] md:w-auto shrink-0 snap-center"><img alt="Airlines &amp; Rail Catering" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/Assets/IndustriesWeSupply/AirLine.png" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div><div className="relative z-10 text-on-primary"><span className="text-label-sm font-label-sm text-secondary-fixed uppercase tracking-wider font-mono">Weight &amp; Compartment Spec</span><h3 className="text-headline-sm font-headline-sm font-bold text-on-primary mt-1">Airlines &amp; Rail Catering</h3></div></div><div className="relative group rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm h-80 sm:h-96 md:h-80 flex flex-col justify-end p-6 w-[82%] sm:w-[320px] md:w-auto shrink-0 snap-center"><img alt="Commercial Catering &amp; Events" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/Assets/SlideShow/HeroSlide1.png" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div><div className="relative z-10 text-on-primary"><span className="text-label-sm font-label-sm text-secondary-fixed uppercase tracking-wider font-mono">High Load Sturdiness</span><h3 className="text-headline-sm font-headline-sm font-bold text-on-primary mt-1">Commercial Catering &amp; Events</h3></div></div><div className="relative group rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm h-80 sm:h-96 md:h-80 flex flex-col justify-end p-6 w-[82%] sm:w-[320px] md:w-auto shrink-0 snap-center"><img alt="Hotels &amp; Hospitality" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A clean luxury hotel room service tray set on a crisp linen tablecloth with molded bamboo fiber room service breakfast covers, cups, and plates next to an espresso cup. Soft sunlight streams through floor-to-ceiling windows. The aesthetic is warm beige, clean industrial simplicity, and premium hospitality luxury without plastics." src="/Assets/IndustriesWeSupply/Cafe.png" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div><div className="relative z-10 text-on-primary"><span className="text-label-sm font-label-sm text-secondary-fixed uppercase tracking-wider font-mono">Turnkey Sustainability</span><h3 className="text-headline-sm font-headline-sm font-bold text-on-primary mt-1">Hotels &amp; Hospitality</h3></div></div><div className="relative group rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm h-80 sm:h-96 md:h-80 flex flex-col justify-end p-6 w-[82%] sm:w-[320px] md:w-auto shrink-0 snap-center"><img alt="Wholesale Food Distributors" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/Assets/IndustriesWeSupply/Cafe.png" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div><div className="relative z-10 text-on-primary"><span className="text-label-sm font-label-sm text-secondary-fixed uppercase tracking-wider font-mono">Consolidated Distribution</span><h3 className="text-headline-sm font-headline-sm font-bold text-on-primary mt-1">Wholesale Food Distributors</h3></div></div></div></div>
</div>
</section>
{/*  TESTIMONIALS  */}
<section className="py-16 md:py-24 bg-surface border-b border-outline-variant/30" id="testimonials"><div className="max-w-7xl mx-auto px-6 md:px-12"><div className="text-center max-w-3xl mx-auto mb-16"><span className="text-secondary text-label-md font-label-md uppercase tracking-widest block mb-2 font-mono">Enterprise Validation</span><h2 className="text-headline-lg md:text-headline-xl font-headline-lg md:font-headline-xl text-primary tracking-tight">TRUSTED BY GLOBAL FOODSERVICE LEADERS</h2><p className="text-body-md font-body-md text-on-surface-variant mt-3">See how multi-unit operators and international catering groups transitioned from single-use plastics to certified compostable fiber tableware.</p></div><div className="flex overflow-x-auto snap-x snap-mandatory pb-4 gap-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible"><div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between shrink-0 w-[85%] sm:w-[70%] md:w-auto snap-center"><div className="mb-6"><div className="flex items-center gap-1 text-secondary mb-4"><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span></div><p className="text-body-md font-body-md text-on-surface-variant italic leading-relaxed mb-6">“Migrating 140+ quick service outlets away from plastic was frictionless. The snap-locking clamshells and oil barriers met our strictest peak-rush drive-thru tests without a single leak.”</p></div><div className="pt-4 border-t border-outline-variant/30"><div className="text-label-lg font-label-lg font-bold text-primary">Henrik Lindqvist</div><div className="text-label-sm font-label-sm text-outline">VP of Procurement, Nordic QSR Holdings</div><div className="inline-flex items-center gap-1 text-secondary text-label-sm font-label-sm mt-2 font-mono"><span className="material-symbols-outlined text-sm">verified</span> Verified Enterprise Client</div></div></div><div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between shrink-0 w-[85%] sm:w-[70%] md:w-auto snap-center"><div className="mb-6"><div className="flex items-center gap-1 text-secondary mb-4"><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span></div><p className="text-body-md font-body-md text-on-surface-variant italic leading-relaxed mb-6">“Direct container shipments from JNPT directly into Sydney and Auckland saved our operations over 22% in landed packaging costs with consistent BPI &amp; EN 13432 batch dossiers.”</p></div><div className="pt-4 border-t border-outline-variant/30"><div className="text-label-lg font-label-lg font-bold text-primary">Eleanor Vance</div><div className="text-label-sm font-label-sm text-outline">Logistics Director, Pacific Foodservice Alliance</div><div className="inline-flex items-center gap-1 text-secondary text-label-sm font-label-sm mt-2 font-mono"><span className="material-symbols-outlined text-sm">verified</span> Verified Enterprise Client</div></div></div><div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between shrink-0 w-[85%] sm:w-[70%] md:w-auto snap-center"><div className="mb-6"><div className="flex items-center gap-1 text-secondary mb-4"><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span><span className="material-symbols-outlined text-xl">star</span></div><p className="text-body-md font-body-md text-on-surface-variant italic leading-relaxed mb-6">“Their multi-compartment bento trays fit our galley service carts precisely. Zero odor transfer under high-altitude re-heating and complete compliance with Gulf regional eco standards.”</p></div><div className="pt-4 border-t border-outline-variant/30"><div className="text-label-lg font-label-lg font-bold text-primary">Tariq Al-Mansoor</div><div className="text-label-sm font-label-sm text-outline">Operations Lead, Gulf In-Flight Catering</div><div className="inline-flex items-center gap-1 text-secondary text-label-sm font-label-sm mt-2 font-mono"><span className="material-symbols-outlined text-sm">verified</span> Verified Enterprise Client</div></div></div></div></div></section>
{/*  EXPORT NETWORK SECTION  */}
<section className="py-16 md:py-24 bg-surface-container-low border-b border-outline-variant/30" id="export-network"><div className="max-w-7xl mx-auto px-6 md:px-12"><div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"><div className="lg:col-span-5 flex flex-col items-start"><div className="inline-flex items-center gap-1.5 text-secondary text-label-md font-label-md uppercase tracking-widest mb-2 font-mono"><span className="material-symbols-outlined text-sm">public</span> Worldwide Freight Corridors</div><h2 className="text-headline-lg md:text-headline-xl font-headline-lg md:font-headline-xl text-primary tracking-tight mb-4">Global Export Network — Direct from India</h2><p className="text-body-md font-body-md text-on-surface-variant mb-6 leading-relaxed">FOB and CIF ocean container delivery originating directly from premier deepwater ports at Mundra and JNPT (Mumbai) to North America, UK/Europe, Middle East, and Australia/APAC hubs.</p><div className="space-y-3 w-full mb-8"><div className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-between"><div className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary">sailing</span><span className="text-label-md font-label-md text-primary font-semibold">Port Gateways</span></div><span className="text-label-sm font-label-sm text-outline font-mono">Mundra &amp; JNPT (India)</span></div><div className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-between"><div className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary">verified_user</span><span className="text-label-md font-label-md text-primary font-semibold">Compliance Certs</span></div><span className="text-label-sm font-label-sm text-secondary font-mono">Vegan, BPI, FDA, EN 13432</span></div><div className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-between"><div className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary">local_shipping</span><span className="text-label-md font-label-md text-primary font-semibold">Shipment Modes</span></div><span className="text-label-sm font-label-sm text-outline font-mono">20ft / 40ft HQ FCL &amp; Bonded Buffer</span></div></div><a className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-all shadow hover:shadow-md" href="#enquiry-section"><span className="material-symbols-outlined text-lg">travel_explore</span><span className="">View Export Standards &amp; Tariffs</span></a></div><div className="lg:col-span-7 relative"><div className="rounded-2xl relative w-full flex justify-center items-center"><CobeGlobe /></div></div></div></div></section>
{/*  SOURCING TO DELIVERY WORKFLOW: Clean vertical zigzag progression with alternating text and circular step badges  */}
<section className="py-16 md:py-24 bg-surface border-b border-outline-variant/30 relative overflow-hidden" id="process">
  <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
    <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/30 text-secondary text-label-sm font-label-sm uppercase tracking-widest border border-secondary/20 mb-6 font-mono">
        <span className="material-symbols-outlined text-sm">verified_user</span> ENTERPRISE B2B COMMITMENT
      </span>
      <h2 className="text-headline-lg md:text-display-sm font-headline-lg md:font-display-sm font-bold text-primary tracking-tight mb-4 leading-tight">
        Why Choose Our Eco-Friendly Disposable Products
      </h2>
      <p className="text-body-md md:text-body-lg font-body-md md:font-body-lg text-on-surface-variant leading-relaxed">
        Choose factory-direct compostable food packaging manufactured from renewable sugarcane bagasse and bamboo fiber. Designed for restaurants, hotels, airlines, retailers, distributors and food service brands seeking reliable bulk supply and OEM manufacturing.
      </p>
    </div>

    {/* Responsive Layout Container */}
    <div className="relative">
      
      {/* --- DESKTOP/TABLET (HORIZONTAL) --- */}
      <div className="hidden md:flex justify-between items-start relative w-full pt-8">
        {/* Background Squiggle/Line SVG */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 -z-10 text-secondary opacity-50 px-12">
           <svg width="100%" height="60" preserveAspectRatio="none" viewBox="0 0 1000 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,30 Q 125,0 250,30 T 500,30 T 750,30 T 1000,30" stroke="currentColor" strokeWidth="2" fill="none" />
           </svg>
        </div>

        {/* The 4 steps */}
        {[
          { icon: 'inventory_2', title: 'Free physical samples', desc: 'Shipped to your office.' },
          { icon: 'verified', title: 'Audit-ready paperwork', desc: 'BRCGS Grade A, FDA, SGS, Intertek, Sedex documents shipped with every order.' },
          { icon: 'schedule', title: '24-hour quote SLA', desc: 'Specifications and volume returned with pricing within one working day.' },
          { icon: 'pallet', title: 'Container-load supply', desc: 'FCL minimums for export buyers. Pallet quantities for select SKUs domestically.' }
        ].map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center w-1/4 px-2 relative group">
            <div className="w-24 h-24 mb-6 rounded-full bg-surface-container-lowest border-2 border-outline-variant/50 shadow-md flex items-center justify-center group-hover:scale-105 group-hover:border-secondary transition-all">
              <div className="w-16 h-16 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary group-hover:bg-secondary/10 transition-colors">
                <span className="material-symbols-outlined text-3xl">{step.icon === 'pallet' ? 'view_module' : step.icon}</span>
              </div>
            </div>
            <h4 className="text-label-lg font-label-lg font-bold text-primary mb-2">{step.title}</h4>
            <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed px-2">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* --- MOBILE (VERTICAL) --- */}
      <div className="md:hidden relative py-6">
        <div className="absolute left-1/2 top-4 bottom-4 w-[1px] -translate-x-1/2 bg-outline-variant/40 border-l border-dashed border-secondary/50"></div>
        <div className="space-y-12 relative">
          {[
            { icon: 'inventory_2', title: 'Free physical samples', desc: 'Shipped to your office.' },
            { icon: 'verified', title: 'Audit-ready paperwork', desc: 'BRCGS Grade A, FDA, SGS, Intertek, Sedex documents shipped with every order.' },
            { icon: 'schedule', title: '24-hour quote SLA', desc: 'Specifications and volume returned with pricing within one working day.' },
            { icon: 'view_module', title: 'Container-load supply', desc: 'FCL minimums for export buyers. Pallet quantities for select SKUs domestically.' }
          ].map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={idx} className="flex flex-row items-center w-full">
                {isEven ? (
                  <>
                    <div className="w-1/2 pr-5 text-right">
                      <span className="text-label-sm font-label-sm text-secondary font-mono block mb-1">0{idx + 1}</span>
                      <h4 className="text-headline-sm font-headline-sm font-bold text-primary uppercase leading-tight mb-1">{step.title}</h4>
                      <p className="text-body-sm font-body-sm text-on-surface-variant leading-snug">{step.desc}</p>
                    </div>
                    <div className="relative z-10 w-14 h-14 rounded-full bg-surface-container-lowest border-2 border-outline-variant/50 flex items-center justify-center shadow-md shrink-0">
                      <div className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-xl">{step.icon}</span>
                      </div>
                    </div>
                    <div className="w-1/2 pl-5"></div>
                  </>
                ) : (
                  <>
                    <div className="w-1/2 pr-5"></div>
                    <div className="relative z-10 w-14 h-14 rounded-full bg-surface-container-lowest border-2 border-outline-variant/50 flex items-center justify-center shadow-md shrink-0">
                      <div className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-xl">{step.icon}</span>
                      </div>
                    </div>
                    <div className="w-1/2 pl-5 text-left">
                      <span className="text-label-sm font-label-sm text-secondary font-mono block mb-1">0{idx + 1}</span>
                      <h4 className="text-headline-sm font-headline-sm font-bold text-primary uppercase leading-tight mb-1">{step.title}</h4>
                      <p className="text-body-sm font-body-sm text-on-surface-variant leading-snug">{step.desc}</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
</section>
{/*  FINAL DUAL CTA & CONTACT SECTION: Centered card presentation with clean product summary row  */}
<section className="py-16 md:py-24 bg-surface-container-low" id="enquiry-section">
<div className="max-w-7xl mx-auto px-6 md:px-12"><div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">{/*  Left Column: FAQ Section (5 cols on lg)  */}<div className="lg:col-span-5 flex flex-col"><div className="inline-flex items-center gap-1.5 text-secondary text-label-md font-label-md uppercase tracking-widest mb-2 font-mono"><span className="material-symbols-outlined text-sm">quiz</span> Frequently Asked Questions</div><h2 className="text-headline-lg md:text-headline-xl font-headline-lg md:font-headline-xl text-primary tracking-tight mb-4">Procurement &amp; Partnership FAQ</h2><p className="text-body-md font-body-md text-on-surface-variant mb-8 leading-relaxed">Essential guidelines on factory capabilities, certification dossiers, minimum orders, and customized thermoformed fiber tooling.</p>{activeFormTab === 'buyer' ? (
<div className="space-y-4"><details className="group bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 open:shadow-sm transition-all" open=""><summary className="flex justify-between items-center font-headline-sm font-headline-sm text-primary font-bold cursor-pointer list-none gap-4"><span className="text-body-md md:text-headline-sm font-semibold">What products does notch manufacture?</span><span className="material-symbols-outlined text-secondary transition-transform duration-200 group-open:rotate-180 shrink-0">expand_more</span></summary><p className="text-body-sm font-body-sm text-on-surface-variant mt-3 leading-relaxed">We engineer molded sugarcane bagasse and bamboo fiber tableware including round plates, clamshells, deep soup &amp; salad bowls, multi-compartment bento trays, and custom bespoke packaging formats.</p></details><details className="group bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 open:shadow-sm transition-all"><summary className="flex justify-between items-center font-headline-sm font-headline-sm text-primary font-bold cursor-pointer list-none gap-4"><span className="text-body-md md:text-headline-sm font-semibold">What are your minimum order quantities (MOQ)?</span><span className="material-symbols-outlined text-secondary transition-transform duration-200 group-open:rotate-180 shrink-0">expand_more</span></summary><p className="text-body-sm font-body-sm text-on-surface-variant mt-3 leading-relaxed">Our standard minimum order is direct export FCL ocean containers (1x 20ft or 40ft HQ), with pallet quantities (1–5 pallets) available for select domestic buffered warehouse SKUs.</p></details><details className="group bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 open:shadow-sm transition-all"><summary className="flex justify-between items-center font-headline-sm font-headline-sm text-primary font-bold cursor-pointer list-none gap-4"><span className="text-body-md md:text-headline-sm font-semibold">Are all products certified compostable and PFAS-free?</span><span className="material-symbols-outlined text-secondary transition-transform duration-200 group-open:rotate-180 shrink-0">expand_more</span></summary><p className="text-body-sm font-body-sm text-on-surface-variant mt-3 leading-relaxed">Yes. All catalog items are 100% plant-based, certified BPI Compostable, EN 13432 compliant, FDA food-contact approved, and manufactured completely 100% PFAS-free.</p></details><details className="group bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 open:shadow-sm transition-all"><summary className="flex justify-between items-center font-headline-sm font-headline-sm text-primary font-bold cursor-pointer list-none gap-4"><span className="text-body-md md:text-headline-sm font-semibold">How fast can you dispatch samples?</span><span className="material-symbols-outlined text-secondary transition-transform duration-200 group-open:rotate-180 shrink-0">expand_more</span></summary><p className="text-body-sm font-body-sm text-on-surface-variant mt-3 leading-relaxed">Free physical evaluation sample boxes are packed and dispatched within 24 hours directly to your test kitchen or office via international air express.</p></details></div>
) : (
<div className="space-y-4">
<details className="group bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 open:shadow-sm transition-all" open>
<summary className="flex justify-between items-center font-headline-sm font-headline-sm text-primary font-bold cursor-pointer list-none gap-4">
<span className="text-body-md md:text-headline-sm font-semibold">What are the minimum requirements to become a distributor?</span>
<span className="material-symbols-outlined text-secondary transition-transform duration-200 group-open:rotate-180 shrink-0">expand_more</span>
</summary>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-3 leading-relaxed">We require our distribution partners to have an established regional logistics network, warehouse capacity for palletized goods, and a commitment to sustainable packaging solutions.</p>
</details>
<details className="group bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 open:shadow-sm transition-all">
<summary className="flex justify-between items-center font-headline-sm font-headline-sm text-primary font-bold cursor-pointer list-none gap-4">
<span className="text-body-md md:text-headline-sm font-semibold">Do you offer exclusive territory distribution rights?</span>
<span className="material-symbols-outlined text-secondary transition-transform duration-200 group-open:rotate-180 shrink-0">expand_more</span>
</summary>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-3 leading-relaxed">Yes. Based on committed quarterly volume and regional market penetration, we offer exclusive master-distributor rights to secure your territory.</p>
</details>
<details className="group bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 open:shadow-sm transition-all">
<summary className="flex justify-between items-center font-headline-sm font-headline-sm text-primary font-bold cursor-pointer list-none gap-4">
<span className="text-body-md md:text-headline-sm font-semibold">How are wholesale prices and tiered discounts structured?</span>
<span className="material-symbols-outlined text-secondary transition-transform duration-200 group-open:rotate-180 shrink-0">expand_more</span>
</summary>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-3 leading-relaxed">Pricing is structured into tiers based on annual volume commitments. Partners achieving higher volume thresholds automatically unlock deep factory-direct wholesale discounts.</p>
</details>
<details className="group bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 open:shadow-sm transition-all">
<summary className="flex justify-between items-center font-headline-sm font-headline-sm text-primary font-bold cursor-pointer list-none gap-4">
<span className="text-body-md md:text-headline-sm font-semibold">What marketing and sales collateral do you provide?</span>
<span className="material-symbols-outlined text-secondary transition-transform duration-200 group-open:rotate-180 shrink-0">expand_more</span>
</summary>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-3 leading-relaxed">All approved distributors receive a comprehensive digital asset library, white-label product spec sheets, certification dossiers, and physical presentation kits for your sales teams.</p>
</details>
<details className="group bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 open:shadow-sm transition-all">
<summary className="flex justify-between items-center font-headline-sm font-headline-sm text-primary font-bold cursor-pointer list-none gap-4">
<span className="text-body-md md:text-headline-sm font-semibold">How do you handle regional shipping and container routing?</span>
<span className="material-symbols-outlined text-secondary transition-transform duration-200 group-open:rotate-180 shrink-0">expand_more</span>
</summary>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-3 leading-relaxed">We offer full turnkey logistics support, including CIF delivery directly to your regional port hubs. We manage all export documentation, customs clearance coordination, and final delivery logistics.</p>
</details>
</div>
)}</div>{/*  Right Column: Tab Switcher & Forms (7 cols on lg)  */}<div className="lg:col-span-7">{/*  Tab Selector Header  */}<div className="text-left mb-6"><div className="inline-flex p-1.5 rounded-xl bg-surface-container border border-outline-variant/40 shadow-sm"><button className={`px-6 py-2.5 rounded-lg text-label-lg font-label-lg transition-all ${activeFormTab === 'buyer' ? 'bg-surface-container-lowest text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-primary'}`} id="tabBtnBuyer" onClick={() => setActiveFormTab('buyer')} type="button">Buyer Product Enquiry</button>
<button className={`px-6 py-2.5 rounded-lg text-label-lg font-label-lg transition-all ${activeFormTab === 'supplier' ? 'bg-surface-container-lowest text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-primary'}`} id="tabBtnSupplier" onClick={() => setActiveFormTab('supplier')} type="button">Become a Distributor</button></div></div>{/*  FORM CONTAINER 1: BUYER ENQUIRY  */}<div className={`bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-xl p-6 md:p-10 ${activeFormTab === 'buyer' ? 'block' : 'hidden'}`} id="formBuyer"><div className="mb-6 text-left"><span className="text-label-sm font-label-sm text-secondary font-bold uppercase tracking-widest block font-mono">LOOKING FOR SUSTAINABLE FOOD PACKAGING?</span><h3 className="text-headline-lg font-headline-lg text-primary mt-1 tracking-tight">Request Volume Pricing &amp; Free Samples</h3><p className="text-body-md font-body-md text-on-surface-variant mt-2">Select products above or specify custom volume requirements. Our supply team responds with consolidated FOB/CIF rates within 24 hours.</p></div>{/*  Pre-populated Selected Products Tag Cloud  */}<div className="mb-6 p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div className="text-label-sm font-label-sm text-outline uppercase font-mono shrink-0">Selected Products:</div><div className="flex flex-wrap gap-2 justify-start sm:justify-end" id="enquiryTagCloud">
  {selectedProducts.length === 0 ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30 text-label-sm font-label-sm">No specific products selected</span>
  ) : (
    selectedProducts.map(sp => (
      <span key={sp.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/60 text-secondary border border-secondary/30 text-label-sm font-label-sm">
        <span className="material-symbols-outlined text-sm">check</span> {sp.name}
      </span>
    ))
  )}
</div></div><form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); alert('Enquiry submitted successfully. A representative will contact you within 24 hours with specifications and pricing.'); }}><div><label className="block text-label-md font-label-md text-primary mb-2">Full Name *</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="e.g. Sarah Jenkins" required type="text" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Company Name *</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="e.g. Global Foods Logistics Inc" required="" type="text" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Work Email *</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="sarah@globalfoods.com" required="" type="email" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Phone / WhatsApp *</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="+1 (555) 019-2834" required="" type="tel" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Country / Delivery Hub *</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="e.g. United States (Rotterdam / Los Angeles Port)" required="" type="text" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Quantity Required *</label><select className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" required=""><option value="">Select Target Volume Tier</option><option value="samples">Evaluation Samples First (Free)</option><option value="pallets">Domestic Pallets (1 - 5 Pallets)</option><option value="20ft">1x 20ft FCL Container</option><option value="40ft">1x 40ft HQ Container</option><option value="multi-40ft">Multiple 40ft HQ Monthly Contract</option></select></div><div className="md:col-span-2"><label className="block text-label-md font-label-md text-primary mb-2">Message &amp; Custom Specifications</label><textarea className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="Provide any barrier performance requirements (PFAS-Free, oil resistant), custom tooling CAD notes, or delivery timeline constraints..." rows="3"></textarea></div><div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/30"><div className="flex items-center gap-2 text-label-sm font-label-sm text-outline"><span className="material-symbols-outlined text-base" data-icon="lock">lock</span> Strict Enterprise Confidentiality Guaranteed</div><button className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary transition-all shadow hover:shadow-md flex items-center justify-center gap-2" type="submit"><span className="">Send Product Enquiry</span><span className="material-symbols-outlined text-lg" data-icon="send">send</span></button></div></form></div>{/*  FORM CONTAINER 2: SUPPLY PARTNER  */}<div className={`bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-xl p-6 md:p-10 ${activeFormTab === 'supplier' ? 'block' : 'hidden'}`} id="formSupplier"><div className="mb-6 text-left"><span className="text-label-sm font-label-sm text-secondary font-bold uppercase tracking-widest block font-mono">JOIN OUR GLOBAL LOGISTICS NETWORK</span><h3 className="text-headline-lg font-headline-lg text-primary mt-1 tracking-tight">Enterprise Regional Distribution Network</h3><p className="text-body-md font-body-md text-on-surface-variant mt-2">Apply for wholesale regional territory distribution rights, pallet consignment agreements, and factory-direct volume allocations.</p></div><form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); alert('Supply partner application received. Our procurement compliance officers will review your manufacturing credentials.'); }}><div><label className="block text-label-md font-label-md text-primary mb-2">Company / Mill Name *</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="e.g. GreenFiber Pulp Mill Co." required type="text" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Contact Name *</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="e.g. David Chen" required="" type="text" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Work Email *</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="david@greenfiber.com" required="" type="email" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Phone / WhatsApp *</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="+86 571 8888 9999" required="" type="tel" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Manufacturing Location &amp; Country *</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="e.g. Zhejiang, China / Rayong, Thailand" required="" type="text" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Products You Manufacture *</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="e.g. Sugarcane Clamshells, Bamboo Bento Plates" required="" type="text" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Monthly Production Capacity</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="e.g. 150 Metric Tons / 20x 40HQ Monthly" type="text" /></div><div><label className="block text-label-md font-label-md text-primary mb-2">Active Certifications (ISO/BPI/FDA)</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="e.g. BPI, FDA, EN 13432, ISO 9001" type="text" /></div><div className="md:col-span-2"><label className="block text-label-md font-label-md text-primary mb-2">Website URL / Product Catalog Link</label><input className="w-full px-4 py-3 rounded-lg border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md font-body-md bg-surface-container-lowest" placeholder="https://www.yourfactorydomain.com" type="url" /></div><div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/30"><div className="flex items-center gap-2 text-label-sm font-label-sm text-outline"><span className="material-symbols-outlined text-base" data-icon="policy">policy</span> Vendor Onboarding subject to Factory Audit</div><button className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary-container transition-all shadow hover:shadow-md flex items-center justify-center gap-2" type="submit"><span className="">Submit Distributor Application</span><span className="material-symbols-outlined text-lg" data-icon="handshake">handshake</span></button></div></form></div></div></div></div>
</section>
</main>
{/*  WEB FOOTER (JSON Root Anchor Spec)  */}

    </>
  );
}
