import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductViewerModal from './components/ProductViewerModal';
import SplitLandingPage from './pages/SplitLandingPage';
import DivisionTransitionLayer from './components/DivisionTransitionLayer';
import { getDivisionForPath } from './config/divisions';
import { isDivisionPreloaded } from './utils/assetPreloader';
import { useCatalog } from './context/CatalogContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const HomePage = lazy(() => import('./pages/HomePage'));
const HomePage2 = lazy(() => import('./pages/HomePage2'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const CatalogPage2 = lazy(() => import('./pages/CatalogPage2'));
const HygienePage = lazy(() => import('./pages/HygienePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const { notification, selectedProducts } = useCatalog();

  // Direct URL navigation or browser refresh on /homepage-2 or /hygiene
  // boots straight into the shared branded preloading overlay before revealing the page.
  const [transition, setTransition] = useState(() => {
    const initialPath = window.location.pathname || '/';
    const initialDivision = getDivisionForPath(initialPath);
    if (!initialDivision) return null;
    return {
      divisionId: initialDivision,
      fromRect: null,
      mountDestination: false,
      key: `init-${initialDivision}`,
    };
  });

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const nextPath = window.location.pathname || '/';
      setCurrentPath(nextPath);
      const nextDiv = getDivisionForPath(nextPath);
      if (!nextDiv) {
        setTransition(null);
      } else if (!isDivisionPreloaded(nextDiv)) {
        setTransition({
          divisionId: nextDiv,
          fromRect: null,
          mountDestination: false,
          key: `pop-${nextDiv}-${Date.now()}`,
        });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback(
    (path) => {
      const targetDivision = getDivisionForPath(path);
      const currentDivision = getDivisionForPath(currentPath);

      // Cross-division transition when target division hasn't been preloaded yet
      if (
        targetDivision &&
        targetDivision !== currentDivision &&
        !isDivisionPreloaded(targetDivision)
      ) {
        setTransition({
          divisionId: targetDivision,
          fromRect: null,
          mountDestination: false,
          key: `nav-${targetDivision}-${Date.now()}`,
        });
        return;
      }

      window.history.pushState({}, '', path);
      setCurrentPath(path);
      if (path === '/') {
        setTransition(null);
      }
    },
    [currentPath]
  );

  // Triggered when user clicks one of the two split cards on /
  const handleSelectDivision = useCallback((divisionId, rect) => {
    setTransition({
      divisionId,
      fromRect: rect,
      mountDestination: false,
      key: `card-${divisionId}-${Date.now()}`,
    });
  }, []);

  // Called by DivisionTransitionLayer when assets reach 100% and we are ready
  // to mount the destination page behind the still-opaque loading overlay
  const handleNavigateReady = useCallback((targetRoute) => {
    window.scrollTo(0, 0);
    if (window.location.pathname !== targetRoute) {
      window.history.pushState({}, '', targetRoute);
    }
    setCurrentPath(targetRoute);
    setTransition((prev) => (prev ? { ...prev, mountDestination: true } : null));
  }, []);

  // Called after the overlay fade-out finishes
  const handleTransitionComplete = useCallback(() => {
    setTransition(null);
  }, []);

  // Route matching
  const isRootLanding = currentPath === '/' || currentPath === '';
  const isLegacyHome = currentPath === '/legacy-home' || currentPath === '/homepage-1';
  const isAdmin = currentPath.startsWith('/admin');
  const isHomePage2 =
    currentPath === '/homepage-2' ||
    currentPath === '/homepage2' ||
    currentPath === '/home2' ||
    currentPath === '/home-2';
  const isProducts2 =
    currentPath === '/products-2' ||
    currentPath === '/products2' ||
    currentPath === '/catalog-2' ||
    currentPath === '/catalog2';
  const isHygiene = currentPath === '/hygiene' || currentPath === '/hygiene-products';
  const isExport = currentPath === '/export';
  const isProducts =
    !isProducts2 && (currentPath.startsWith('/products') || currentPath === '/catalog');

  const showLegacyChrome =
    !isRootLanding && !isAdmin && !isHomePage2 && !isProducts2 && !isHygiene;

  // Hide destination page mount on direct-load preload until assets finish 100%
  const blockDestinationRender = Boolean(transition && !transition.mountDestination && !transition.fromRect);

  // Extract category param if on /products/:categoryId
  let categoryFilter = null;
  if (isProducts) {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[1] !== '') {
      categoryFilter = parts[1];
    }
  }

  return (
    <div className="app-container">
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`toast-banner ${notification.type}`}>
          {notification.type === 'error' ? (
            <AlertCircle size={20} color="#FF8A80" />
          ) : (
            <CheckCircle2 size={20} color="var(--color-gold)" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Shared Spatial Expansion + Branded Asset-Preloading Layer */}
      {transition && (
        <DivisionTransitionLayer
          key={transition.key}
          divisionId={transition.divisionId}
          fromRect={transition.fromRect}
          onNavigateReady={handleNavigateReady}
          onComplete={handleTransitionComplete}
        />
      )}

      {/* Legacy Public Header (only for legacy pages) */}
      {showLegacyChrome && <Header currentPath={currentPath} navigate={navigate} />}

      {/* Main Page Content */}
      {!blockDestinationRender && (
        <Suspense fallback={null}>
          {isRootLanding ? (
            <SplitLandingPage onSelectDivision={handleSelectDivision} />
          ) : isAdmin ? (
            <AdminPage navigate={navigate} />
          ) : isHomePage2 ? (
            <HomePage2 navigate={navigate} />
          ) : isProducts2 ? (
            <CatalogPage2 navigate={navigate} />
          ) : isHygiene ? (
            <HygienePage navigate={navigate} />
          ) : isExport ? (
            <AboutPage navigate={navigate} />
          ) : isProducts ? (
            <CatalogPage categoryFilter={categoryFilter} navigate={navigate} />
          ) : isLegacyHome ? (
            <HomePage navigate={navigate} />
          ) : (
            <SplitLandingPage onSelectDivision={handleSelectDivision} />
          )}
        </Suspense>
      )}

      {/* Legacy Public Footer */}
      {showLegacyChrome && <Footer navigate={navigate} />}

      {/* Sticky Selection Bar */}
      {selectedProducts.length > 0 && !isAdmin && !isRootLanding && (
        <div className="fixed bottom-4 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center">
          <div className="bg-[#0a1811] text-white px-5 py-3 md:px-6 md:py-4 rounded-xl shadow-2xl pointer-events-auto flex items-center justify-between gap-4 md:gap-6 max-w-4xl w-full border border-white/10">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-[#01412a] text-[#86ea9a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-sm md:text-base">{selectedProducts.length} products selected</div>
                <div className="text-xs text-[#a8efb4]/70 truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                  {selectedProducts.map((p) => p.name).join('. ')}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                navigate('/homepage-2');
                setTimeout(() => document.getElementById('enquiry-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              className="shrink-0 bg-[#86ea9a] text-[#012d1d] px-4 md:px-6 py-2.5 rounded-lg font-bold text-sm md:text-base flex items-center gap-1.5 md:gap-2 hover:bg-[#5cdc77] transition-colors shadow-md"
            >
              Send Enquiry <span className="material-symbols-outlined text-[18px] md:text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Global Product Viewer Modal / Lightbox */}
      <ProductViewerModal />
    </div>
  );
}
