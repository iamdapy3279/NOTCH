import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header({ currentPath, navigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-primary text-on-primary border-b border-primary-container/80 text-label-sm font-label-sm py-2 px-6 md:px-12 relative z-50">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-4 sm:gap-6">
          <a className="flex items-center gap-1 text-surface-container-highest hover:text-secondary-fixed transition-colors" href="https://wa.me/15550192834" rel="noopener" target="_blank">
            <span className="material-symbols-outlined text-base">chat</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <a className="flex items-center gap-1 text-surface-container-highest hover:text-secondary-fixed transition-colors" href="https://instagram.com" rel="noopener" target="_blank">
            <span className="material-symbols-outlined text-base">photo_camera</span>
            <span className="hidden sm:inline">Instagram</span>
          </a>
          <a className="flex items-center gap-1 text-surface-container-highest hover:text-secondary-fixed transition-colors" href="tel:+15550192834">
            <span className="material-symbols-outlined text-base">call</span>
            <span className="hidden sm:inline">+1 (555) 019-2834</span>
          </a>
          <a className="flex items-center gap-1 text-surface-container-highest hover:text-secondary-fixed transition-colors" href="mailto:sourcing@yourcompany.com">
            <span className="material-symbols-outlined text-base">mail</span>
            <span className="hidden sm:inline">Email Us</span>
          </a>
        </div>
      </div>
      <header className="sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center h-20">
          {/*  Brand Logo  */}
          <a className="flex items-center group py-1" href="/" onClick={(e) => handleNavClick(e, "/")}>
            <img
              src="/assets/homepage2/notch_logo.png"
              alt="NOTCH — B2B Fiber Sourcing"
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </a>
          {/*  Desktop Nav Links  */}
          <nav className="hidden lg:flex items-center gap-8">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-medium font-label-lg text-label-lg" href="/homepage-2" onClick={(e) => handleNavClick(e, "/homepage-2")}>
              Home
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-medium font-label-lg text-label-lg" href="/homepage-2#who-are-we" onClick={(e) => handleNavClick(e, "/homepage-2")}>
              About Us
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-medium font-label-lg text-label-lg" href="/hygiene" onClick={(e) => handleNavClick(e, "/hygiene")}>
              Hygiene
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-medium font-label-lg text-label-lg" href="/products-2" onClick={(e) => handleNavClick(e, "/products-2")}>
              Products
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-medium font-label-lg text-label-lg" href="#enquiry-section">
              Contact Us
            </a>
          </nav>

          <button className="lg:hidden ml-auto p-2 text-on-surface-variant hover:text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          {/*  Trailing Action Buttons  */}

          <div className="flex items-center gap-3">
            <a className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-primary text-primary font-label-lg text-label-lg hover:bg-surface-container transition-all active:scale-[0.99]" href="#enquiry-section" onClick={() => { /* switchTab('supplier') */ }}>Become a Distributor</a>
            <a className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all font-label-lg text-label-lg shadow-sm hover:shadow active:scale-[0.99] gap-2" href="#enquiry-section" onClick={() => { /* switchTab('buyer') */ }}>
              <span className="">Make an Enquiry</span>
              <span className="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant/30 flex flex-col p-4 shadow-lg gap-4 z-40">
            <a className="text-on-surface-variant font-medium font-label-lg text-label-lg py-2" href="/homepage-2" onClick={(e) => handleNavClick(e, "/homepage-2")}>
              Home
            </a>
            <a className="text-on-surface-variant font-medium font-label-lg text-label-lg py-2" href="/homepage-2#who-are-we" onClick={(e) => handleNavClick(e, "/homepage-2")}>
              About Us
            </a>
            <a className="text-on-surface-variant font-medium font-label-lg text-label-lg py-2" href="/hygiene" onClick={(e) => handleNavClick(e, "/hygiene")}>
              Hygiene
            </a>
            <a className="text-on-surface-variant font-medium font-label-lg text-label-lg py-2" href="/products-2" onClick={(e) => handleNavClick(e, "/products-2")}>
              Products
            </a>
            <a className="text-on-surface-variant font-medium font-label-lg text-label-lg py-2" href="#enquiry-section" onClick={() => setIsMobileMenuOpen(false)}>
              Contact Us
            </a>
          </nav>
        )}
      </header>

    </>
  );
}
