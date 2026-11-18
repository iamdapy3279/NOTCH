import React, { createContext, useContext, useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'notch_catalog_data_v4';

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

  const [selectedProducts, setSelectedProducts] = useState([]);
  
  const toggleProductSelection = (product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };


  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  useEffect(() => {
    async function loadCatalog() {
      try {
        // Clean up legacy keys from previous project and older catalog versions
        try {
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('mcrc_') || (key.startsWith('notch_catalog_data_') && key !== LOCAL_STORAGE_KEY)) {
              localStorage.removeItem(key);
            }
          });
        } catch (_) {}

        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.categories && parsed.categories.some(c => c.id === 'clampshell')) {
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

  const addProduct = (categoryId, product, categoryNameStr) => {
    if (!catalog) return;
    let categories = [...catalog.categories];
    let cat = categories.find(c => c.id === categoryId);
    
    if (!cat) {
      cat = { id: categoryId, name: categoryNameStr || categoryId, description: '', products: [] };
      categories.push(cat);
    }
    
    const safeModel = (product.modelNumber || product.modelCode || 'ITEM').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const finalImages = product.images && product.images.length > 0 ? product.images : (product.thumbnail ? [product.thumbnail] : []);
    const newProd = {
      ...product,
      id: product.id || `${categoryId}-${safeModel.toLowerCase()}-${Date.now()}`,
      categoryId,
      categoryName: cat.name,
      images: finalImages,
      thumbnail: finalImages.length > 0 ? finalImages[0] : product.thumbnail
    };
    
    categories = categories.map(c => 
      c.id === categoryId ? { ...c, products: [newProd, ...(c.products || [])] } : c
    );
    
    saveCatalog({ ...catalog, categories });
    showNotification(`Product "${product.name}" added successfully.`);
  };

  const updateProduct = (oldCategoryId, newCategoryId, product, categoryNameStr) => {
    if (!catalog) return;
    let categories = [...catalog.categories];
    
    // Create new category if it doesn't exist
    if (!categories.find(c => c.id === newCategoryId)) {
      categories.push({ id: newCategoryId, name: categoryNameStr || newCategoryId, description: '', products: [] });
    }

    // Remove from old category (and anywhere else just in case)
    categories = categories.map(c => ({
      ...c,
      products: (c.products || []).filter(p => p.id !== product.id)
    }));

    // Add to new category
    categories = categories.map(c => {
      if (c.id === newCategoryId) {
        const finalImages = product.images && product.images.length > 0 ? product.images : (product.thumbnail ? [product.thumbnail] : []);
        return {
          ...c,
          products: [{ 
            ...product, 
            categoryId: newCategoryId, 
            categoryName: c.name,
            images: finalImages,
            thumbnail: finalImages.length > 0 ? finalImages[0] : product.thumbnail
          }, ...c.products]
        };
      }
      return c;
    });

    saveCatalog({ ...catalog, categories });
    showNotification(`Product "${product.name}" updated successfully.`);
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
        closeProductModal,
        selectedProducts,
        toggleProductSelection
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
