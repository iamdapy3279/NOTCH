import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Mail, Phone, Maximize2, Shield } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export default function ProductViewerModal() {
  const { activeProductModal, closeProductModal } = useCatalog();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    setCurrentIdx(0);
  }, [activeProductModal]);

  // Keyboard navigation
  useEffect(() => {
    if (!activeProductModal) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeProductModal();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeProductModal, currentIdx]);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Touch swipe support for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const composeInquiryUrl = () => {
    const subject = encodeURIComponent(`B2B Inquiry: Model ${product.modelNumber} (${product.categoryName || 'Leather Product'})`);
    const body = encodeURIComponent(
      `Hello Notch,\n\nI am interested in sourcing and requesting specifications/samples for:\nProduct: ${product.name}\nModel Number: ${product.modelNumber}\nCategory: ${product.categoryName}\n\nPlease share catalog pricing, minimum order quantities (MOQ), and production lead times.\n\nThank you.`
    );
    return `mailto:mcrcpltd@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProductModal();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-full flex items-center justify-center shadow-sm border border-outline-variant/20"
          onClick={closeProductModal}
          aria-label="Close Product Viewer"
        >
          <X size={22} />
        </button>

        {/* Gallery Side */}
        <div
          className="w-full md:w-1/2 bg-white flex flex-col relative border-b md:border-b-0 md:border-r border-outline-variant/20"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[300px] bg-white p-6">
            <img
              src={images[currentIdx]}
              alt={`${product.name} - View ${currentIdx + 1}`}
              className="w-full h-full object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 text-primary hover:bg-surface-container-high transition-colors rounded-full flex items-center justify-center shadow-md border border-outline-variant/20"
                  onClick={handlePrev}
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 text-primary hover:bg-surface-container-high transition-colors rounded-full flex items-center justify-center shadow-md border border-outline-variant/20"
                  onClick={handleNext}
                  aria-label="Next Image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 p-4 bg-white border-t border-outline-variant/20 overflow-x-auto">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 bg-white p-1 flex items-center justify-center ${index === currentIdx ? 'border-primary ring-2 ring-primary/20 shadow-xs' : 'border-outline-variant/30 hover:border-outline-variant opacity-70 hover:opacity-100'}`}
                  onClick={() => setCurrentIdx(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={img} alt={`Thumb ${index + 1}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Side */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col bg-white">
          <div className="text-label-sm font-label-sm font-bold uppercase tracking-widest text-secondary mb-2">
            {product.categoryName || 'Handcrafted Collection'}
          </div>

          <h2 className="text-headline-md font-headline-md font-bold text-primary mb-2" id="modal-product-title">
            {product.name}
          </h2>

          <div className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-surface-container-highest text-on-surface-variant mb-6 w-fit">
            Model: {product.modelNumber}
          </div>

          <div className="mb-6">
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {product.description ||
                `Precision engineered for international commercial durability and distinctive quality. Model ${product.modelNumber} is built for international commercial durability and distinctive artisanal luxury.`}
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-8 border-t border-outline-variant/30 pt-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-outline font-medium">Artisan Technique:</span>
              <span className="text-on-surface font-semibold text-right max-w-[60%]">Commercial Export Quality</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-outline font-medium">Material:</span>
              <span className="text-on-surface font-semibold text-right max-w-[60%]">Premium Sustainable Materials</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-outline font-medium">Manufacturing Origin:</span>
              <span className="text-on-surface font-semibold text-right max-w-[60%]">Export Hub: Mundra & JNPT (India)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-outline font-medium">B2B Customization:</span>
              <span className="text-on-surface font-semibold text-right max-w-[60%]">Custom Colors, Logos & Dimensions</span>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <a
              href={composeInquiryUrl()}
              className="flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-container px-6 py-3 rounded-xl font-label-lg transition-colors"
              style={{ width: '100%', textDecoration: 'none' }}
            >
              <Mail size={16} />
              <span>Inquire for B2B Order / Sample</span>
            </a>

            <a
              href="tel:+919830920676"
              className="flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors px-6 py-3 rounded-xl font-label-lg"
              style={{ width: '100%', textDecoration: 'none' }}
            >
              <Phone size={16} />
              <span>Call Hotline: +91 9830920676</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
