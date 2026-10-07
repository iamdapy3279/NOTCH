import React, { createContext, useContext, useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'mcrc_catalog_data_v7';

const cleanProductName = (name) => {
  if (!name) return name;
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim();
};

const sanitizeCatalog = (data) => {
  if (!data || !data.categories) return data;
  return {
    ...data,
    categories: data.categories.map((cat) => ({
      ...cat,
      description: cat.description || '',
      mobileDescription: cat.mobileDescription || '',
      products: (cat.products || []).map((prod) => ({
        ...prod,
        name: cleanProductName(prod.name)
      }))
    }))
  };
};

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  useEffect(() => {
    async function loadCatalog() {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.categories && parsed.categories.length > 0) {
            const sanitized = sanitizeCatalog(parsed);
            setCatalog(sanitized);
            setLoading(false);
            return;
          }
        }

        const res = await fetch('/data/catalog.json');
        if (!res.ok) throw new Error('Failed to load base catalog');
        const data = await res.json();
        const sanitized = sanitizeCatalog(data);
        setCatalog(sanitized);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
      } catch (err) {
        console.error('Error initializing catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const saveCatalog = (newCatalog) => {
    setCatalog(newCatalog);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCatalog));
    } catch (e) {
      console.warn('localStorage quota exceeded for large images, state updated in memory:', e);
      showNotification('Notice: Large uploaded images may exceed browser localStorage capacity. Remember to export your catalog JSON!', 'warning');
    }
  };

  const updateCategory = (updatedCat) => {
    if (!catalog) return;
    const newCategories = catalog.categories.map((c) =>
      c.id === updatedCat.id ? { ...c, ...updatedCat } : c
    );
    saveCatalog({ ...catalog, categories: newCategories });
    showNotification(`Category "${updatedCat.name}" updated successfully.`);
  };

  const addCategory = (newCat) => {
    if (!catalog) return;
    const catWithProducts = {
      ...newCat,
      id: newCat.id || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      products: newCat.products || []
    };
    saveCatalog({ ...catalog, categories: [...catalog.categories, catWithProducts] });
    showNotification(`Category "${newCat.name}" added successfully.`);
  };

  const deleteCategory = (catId) => {
    if (!catalog) return;
    const cat = catalog.categories.find(c => c.id === catId);
    const newCategories = catalog.categories.filter((c) => c.id !== catId);
    saveCatalog({ ...catalog, categories: newCategories });
    showNotification(`Category "${cat?.name || catId}" deleted.`);
  };

  const addProduct = (categoryId, product) => {
    if (!catalog) return;
    const newCategories = catalog.categories.map((cat) => {
      if (cat.id === categoryId) {
        const safeModel = (product.modelNumber || 'ITEM').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
        const newProd = {
          ...product,
          id: product.id || `${categoryId}-${safeModel.toLowerCase()}-${Date.now()}`,
          categoryId,
          categoryName: cat.name,
          images: product.images && product.images.length > 0 ? product.images : [product.thumbnail]
        };
        return {
          ...cat,
          products: [newProd, ...cat.products]
        };
      }
      return cat;
    });
    saveCatalog({ ...catalog, categories: newCategories });
    showNotification(`Product "${product.modelNumber || product.name}" added successfully.`);
  };

  const updateProduct = (categoryId, product) => {
    if (!catalog) return;
    const newCategories = catalog.categories.map((cat) => {
      if (cat.id === categoryId) {
        const updatedProducts = cat.products.map((p) =>
          p.id === product.id ? { ...p, ...product } : p
        );
        return { ...cat, products: updatedProducts };
      }
      return cat;
    });
    saveCatalog({ ...catalog, categories: newCategories });
    showNotification(`Product "${product.modelNumber || product.name}" updated successfully.`);
  };

  const deleteProduct = (categoryId, productId) => {
    if (!catalog) return;
    const newCategories = catalog.categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          products: cat.products.filter((p) => p.id !== productId)
        };
      }
      return cat;
    });
    saveCatalog({ ...catalog, categories: newCategories });
    showNotification('Product deleted successfully.');
  };

  const exportCatalogJson = () => {
    if (!catalog) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(catalog, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mcrc-catalog-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Catalog JSON exported successfully.');
  };

  const importCatalogJson = (importedJson) => {
    try {
      const parsed = typeof importedJson === 'string' ? JSON.parse(importedJson) : importedJson;
      if (!parsed.categories || !Array.isArray(parsed.categories)) {
        throw new Error('Invalid format: Missing categories array.');
      }
      saveCatalog(parsed);
      showNotification('Catalog JSON imported successfully!');
      return true;
    } catch (err) {
      showNotification('Failed to import catalog: ' + err.message, 'error');
      return false;
    }
  };

  const resetToDefaultCatalog = async () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      const res = await fetch('/data/catalog.json');
      const data = await res.json();
      setCatalog(data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      showNotification('Reset to default catalog successfully.');
    } catch (err) {
      showNotification('Could not reset catalog: ' + err.message, 'error');
    }
  };

  const openProductModal = (product) => {
    setActiveProductModal(product);
  };

  const closeProductModal = () => {
    setActiveProductModal(null);
  };

  return (
    <CatalogContext.Provider
      value={{
        catalog,
        loading,
        notification,
        showNotification,
        updateCategory,
        addCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        exportCatalogJson,
        importCatalogJson,
        resetToDefaultCatalog,
        activeProductModal,
        openProductModal,
        closeProductModal
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
