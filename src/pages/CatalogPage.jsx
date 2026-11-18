import React, { useMemo } from 'react';
import { useCatalog } from '../context/CatalogContext';

export default function CatalogPage({ categoryFilter, navigate }) {
  const { catalog, openProductModal, selectedProducts, toggleProductSelection } = useCatalog();
  const categories = catalog?.categories || [];
  const activeCategoryId = categoryFilter || 'all';
  
  const currentCategory = useMemo(() => {
    if (activeCategoryId === 'all') return null;
    return categories.find((c) => c.id === activeCategoryId);
  }, [categories, activeCategoryId]);

  const displayedProducts = useMemo(() => {
    let prods = [];
    if (activeCategoryId === 'all') {
      categories.forEach((cat) => {
        if (cat.products) prods.push(...cat.products);
      });
    } else if (currentCategory && currentCategory.products) {
      prods = [...currentCategory.products];
    }
    return prods;
  }, [categories, activeCategoryId, currentCategory]);

  const totalProductsCount = useMemo(() => {
    let count = 0;
    categories.forEach((cat) => {
      if (cat.products) count += cat.products.length;
    });
    return count;
  }, [categories]);

  const handleCategorySelect = (id) => {
    if (id === 'all') {
      navigate('/products');
    } else {
      navigate(`/products/${id}`);
    }
  };



  return (
    <>
      
<div className="w-full flex flex-1 justify-center py-4 px-4 sm:px-8 md:px-12 lg:px-20">
<div className="layout-content-container flex flex-col w-full max-w-[1240px] flex-1">
{/*  Shared Header Anchor (Strict Integration)  */}

{/*  Breadcrumbs  */}
<nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 px-2 py-2 mb-2 text-sm">
<a className="text-secondary font-medium hover:underline flex items-center gap-1" href="#"><span className="material-symbols-outlined text-[16px]">home</span> Home</a>
<span className="text-outline-variant">/</span>
<a className="text-secondary font-medium hover:underline" href="#">Product Catalogue</a>
<span className="text-outline-variant">/</span>
<span className="text-on-surface font-semibold">Commercial Food Packaging &amp; Tableware</span>
</nav>
{/*  Page Hero Banner  */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-6 md:p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm mb-6">
<div className="flex max-w-3xl flex-col gap-2.5">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/60 text-secondary text-xs font-bold uppercase tracking-wider w-fit">
<span className="material-symbols-outlined text-[14px]">eco</span> Certified Compostable &amp; Food-Safe
              </div>
<h1 className="text-on-surface font-headline-xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Commercial Food Packaging &amp; Tableware Range</h1>
<p className="text-on-surface-variant font-body-md text-base sm:text-lg">
                Industrial-grade biodegradable, compostable, and recyclable foodservice containers certified for global export. Engineered for restaurant chains, ghost kitchens, catering, and institutional distributors.
              </p>
</div>
<div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
<a className="flex items-center justify-center rounded-xl h-11 px-5 bg-surface-container-high text-primary hover:bg-surface-container-highest transition-all text-sm font-bold border border-outline-variant/40" href="#distributor-section">
<span className="material-symbols-outlined mr-2 text-[20px]">handshake</span>
                Become a Distributor
              </a>
<button className="items-center justify-center rounded-xl h-11 px-5 bg-primary text-on-primary hover:bg-primary-container transition-all text-sm font-bold shadow-sm hidden sm:flex"><span className="material-symbols-outlined mr-2 text-[20px]">download</span> Download Brochure</button>
</div>
</div>
{/*  Filter Toolbar with Prominent Download Brochure CTA  */}
<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 mb-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
{/*  Category Pills  */}
<div className="w-full md:w-auto"><div className="block md:hidden w-full relative"><select value={activeCategoryId} onChange={(e) => handleCategorySelect(e.target.value)} className="form-input w-full h-10 px-3.5 pr-10 text-xs font-semibold rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-0 focus:ring-0 focus-within:border-secondary cursor-pointer">
<option value="all">All Collections ({totalProductsCount})</option>
{categories.map((cat) => (
  <option key={cat.id} value={cat.id}>
    {cat.name} ({cat.products ? cat.products.length : 0})
  </option>
))}
</select><div className="absolute right-3 top-2.5 pointer-events-none text-on-surface-variant flex items-center"><span className="material-symbols-outlined text-[20px]">expand_more</span></div></div><div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
<button onClick={() => handleCategorySelect('all')} className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3.5 text-xs font-semibold shadow-xs ${activeCategoryId === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/30'}`}>
  <span>All Collections ({totalProductsCount})</span>
</button>
{categories.map((cat) => (
  <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-lg px-3 text-xs font-medium border border-outline-variant/30 ${activeCategoryId === cat.id ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface'}`}>
    <span>{cat.name} ({cat.products ? cat.products.length : 0})</span>
  </button>
))}
</div></div>
{/*  Download PDF Button & View Toggles  */}
<div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-surface-container-high">
{/*  View / Sort icons  */}
<div className="flex items-center gap-1">
<button className="p-2 rounded-lg bg-surface-container-high text-primary hover:bg-surface-variant transition-colors" title="Grid View">
<span className="material-symbols-outlined text-[20px]">grid_view</span>
</button>
<button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" title="Filter Specs">
<span className="material-symbols-outlined text-[20px]">filter_list</span>
</button>
<button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" title="Sort Order">
<span className="material-symbols-outlined text-[20px]">swap_vert</span>
</button>
</div>
{/*  Prominent Stylish Download Brochure Button (Requirement #1)  */}

</div>
</div>
{/*  3x3 Product Cards Grid with Specs, CAD, and Quote Basket  */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
              {displayedProducts.map((prod) => (
<div key={prod.id} className="flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => openProductModal(prod)}>
<div className="relative w-full h-44 sm:h-56 bg-surface-container-low overflow-hidden group">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={prod.thumbnail || 'https://via.placeholder.com/300'} alt={prod.name} />
<span className="absolute top-3 left-3 bg-secondary text-on-secondary text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase shadow-xs">{prod.modelNumber}</span>
</div>
<div className="p-4 sm:p-5 flex flex-col flex-1">
<h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface mb-3 leading-snug">{prod.name}</h3>
<div className="mt-auto pt-3 border-t border-surface-container-high flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
<button className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all w-full sm:w-auto shadow-xs ${selectedProducts.some(p => p.id === prod.id) ? 'bg-[#0a1811] text-[#86ea9a] hover:bg-[#0a1811]/90' : 'bg-primary text-on-primary hover:bg-primary-container'}`} onClick={(e) => { e.stopPropagation(); toggleProductSelection(prod); }}>
  <span className="material-symbols-outlined text-[18px]">{selectedProducts.some(p => p.id === prod.id) ? 'check' : 'add'}</span> {selectedProducts.some(p => p.id === prod.id) ? 'Selected' : 'Enquire'}
</button>
</div>
</div>
</div>
              ))}
</div>
{/*  Pagination & Distributor Quick Banner (Requirement #2)  */}
<section className="bg-primary text-on-primary rounded-2xl p-8 mb-12 relative overflow-hidden" id="distributor-section">
<div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
<div className="space-y-2 text-center md:text-left">
<span className="text-secondary-fixed text-xs font-bold uppercase tracking-wider">Global Wholesale Partnerships</span>
<h3 className="text-2xl md:text-3xl font-bold font-headline-md">Become a Distributor &amp; Supply Your Territory</h3>
<p className="text-on-primary-container text-sm md:text-base max-w-2xl">
                  Receive container-load wholesale pricing, exclusive regional distribution rights, custom branding runs, and factory audit support for municipal sustainability mandates.
                </p>
</div>
<div className="flex flex-col sm:flex-row gap-3 shrink-0">
<button className="px-6 py-3 rounded-xl bg-secondary-container text-on-secondary-fixed font-bold text-sm hover:bg-secondary-fixed transition-colors shadow-md">
                  Apply for Dealership
                </button>
<button className="px-5 py-3 rounded-xl bg-primary-container text-on-primary font-semibold text-sm border border-outline-variant/40 hover:bg-surface-container-highest/20 transition-colors">
                  Distributor FAQ
                </button>
</div>
</div>
</section>
{/*  Contact / Quick Reach Section with visible icons (Requirement #4)  */}
<section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 sm:p-8 mb-12 hidden md:block" id="contact-section">
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
{/*  Phone  */}
<div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-secondary transition-colors">
<div className="size-11 rounded-full bg-secondary-container/60 text-secondary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[24px]">call</span>
</div>
<div>
<span className="text-xs text-outline font-medium block">Phone Hotline</span>
<a className="text-on-surface font-bold text-sm hover:text-secondary" href="tel:+18005553267">+1 (800) 555-ECOP</a>
</div>
</div>
{/*  WhatsApp  */}
<div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-secondary transition-colors">
<div className="size-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[24px]">chat</span>
</div>
<div>
<span className="text-xs text-outline font-medium block">WhatsApp B2B Desk</span>
<a className="text-on-surface font-bold text-sm hover:text-secondary" href="#">+1 (555) 782-9921</a>
</div>
</div>
{/*  Email  */}
<div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-secondary transition-colors">
<div className="size-11 rounded-full bg-secondary-container/60 text-secondary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[24px]">mail</span>
</div>
<div>
<span className="text-xs text-outline font-medium block">Wholesale Inquiries</span>
<a className="text-on-surface font-bold text-sm hover:text-secondary" href="mailto:export@ecopacksolutions.com">export@ecopack.com</a>
</div>
</div>
{/*  Instagram / Community  */}
<div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-secondary transition-colors">
<div className="size-11 rounded-full bg-secondary-container/60 text-secondary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[24px]">photo_camera</span>
</div>
<div>
<span className="text-xs text-outline font-medium block">Instagram Official</span>
<a className="text-on-surface font-bold text-sm hover:text-secondary" href="#">@ecopack_solutions</a>
</div>
</div>
</div>
</section>
{/*  Footer with Policies Column & Social Icons (Requirements #2, #3, #4)  */}

</div>
</div>

    </>
  );
}
