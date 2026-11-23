import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { normalizeCatalogProduct } from './utils/catalog';
import { fetchEntities, saveEntity, deleteEntity } from './http/entityAPI';
import { messageFromError } from './http';
import { Alert, CssBaseline, Snackbar, ThemeProvider, createTheme } from '@mui/material';
import './App.css';
import './lab2.css';
import './lab3.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';

const steps = [
    { id: 1, titleKey: 'step1Title', image: '/images/Card1.png', textKey: 'step1Text' },
    { id: 2, titleKey: 'step2Title', image: '/images/Card2.png', textKey: 'step2Text' },
    { id: 3, titleKey: 'step3Title', image: '/images/Card1.png', textKey: 'step3Text', extraKey: 'step3Extra' }
];
const reviews = [
    { id: 1, titleKey: 'review1Title', textKey: 'review1Text' },
    { id: 2, titleKey: 'review2Title', textKey: 'review2Text' },
    { id: 3, titleKey: 'review3Title', textKey: 'review3Text' }
];
const sliderImages = ['/images/Lunch2.png', '/images/vegetarian-lunch.png', '/images/fruit-lunch.png', '/images/sandwich.png', '/images/pasta.png'];
const features = ['feature1', 'feature2', 'feature3', 'feature4'];
const footerLinks = ['aboutUs', 'orderLunch', 'support', 'faq', 'terms', 'refund', 'privacy'];
const organizationName = 'The Superhero Box';
const mainTitle = 'Super Healthy Lunches for Picky Eaters.';

const theme = createTheme({
    palette: {
        primary: { main: '#f15b40' },
        secondary: { main: '#f4b942' },
        background: { default: '#fffaf5' }
    },
    shape: { borderRadius: 14 },
    typography: { fontFamily: 'Arial, Helvetica, sans-serif' },
    components: {
        MuiButton: { defaultProps: { variant: 'contained' } },
        MuiCard: { styleOverrides: { root: { height: '100%' } } }
    }
});

function App() {
    const { t } = useTranslation();
    const [stepsState] = useState(steps);
    const [reviewsState] = useState(reviews);
    const [sliderImagesState] = useState(sliderImages);
    const [featuresState] = useState(features);
    const [footerLinksState] = useState(footerLinks);
    const location = useLocation();
    // useState хранит копию данных клиента; PostgreSQL остаётся источником истины.
    const [catalog, setCatalog] = useState({ items: [], status: 'idle', error: null });
    const products = useMemo(() => catalog.items.map(normalizeCatalogProduct), [catalog.items]);
    const refreshCatalog = useCallback(async () => {
        setCatalog(current => ({ ...current, status: 'loading', error: null }));
        try {
            const response = await fetchEntities('products', { limit: 100 });
            setCatalog({ items: response.items, status: 'succeeded', error: null });
        } catch (error) {
            setCatalog(current => ({ ...current, status: 'failed', error: messageFromError(error) }));
            throw error;
        }
    }, []);
    const [favorites, setFavorites] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [activeProduct, setActiveProduct] = useState(null);
    const [notice, setNotice] = useState({ open: false, message: '', severity: 'success' });

    // Refresh when returning from the PostgreSQL product management page.
    useEffect(() => {
        if (['/', '/catalog', '/favorites', '/cart', '/products'].includes(location.pathname)) {
            refreshCatalog().catch(() => {});
        }
    }, [location.pathname, refreshCatalog]);

    // Drop basket/favorite IDs of records which really were deleted in the database.
    useEffect(() => {
        if (catalog.status !== 'succeeded') return;
        const existing = new Set(products.map(product => product.id));
        setFavorites(current => current.filter(id => existing.has(id)));
        setSelectedIds(current => current.filter(id => existing.has(id)));
        setCart(current => current.filter(row => existing.has(row.id)));
        setActiveProduct(current => current && !existing.has(current.id) ? null : current);
    }, [catalog.status, products]);

    const showNotice = useCallback((message, severity = 'success') => {
        setNotice({ open: true, message, severity });
    }, []);

    const onFavorite = useCallback((rawId) => {
        const id = String(rawId);
        setFavorites((current) => {
            if (current.includes(id)) return current.filter((itemId) => itemId !== id);
            return [...current, id];
        });
    }, []);

    const onAddToCart = useCallback((rawId) => {
        const id = String(rawId);
        if (!products.some(product => product.id === id && product.is_available !== false)) {
            showNotice(t('noLunches'), 'warning');
            return;
        }
        setCart((current) => {
            const productExists = current.some((item) => item.id === id);
            if (productExists) {
                return current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...current, { id, quantity: 1 }];
        });
        showNotice(t('addedToCart'));
    }, [products, showNotice, t]);

    const onChangeQuantity = useCallback((rawId, delta) => {
        const id = String(rawId);
        setCart((current) => current
            .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
            .filter((item) => item.quantity > 0));
    }, []);

    const onRemove = useCallback((rawId) => {
        const id = String(rawId);
        setCart((current) => current.filter((item) => item.id !== id));
        showNotice(t('removedFromCart'), 'info');
    }, [showNotice, t]);

    const onToggleSelected = useCallback((rawId) => {
        const id = String(rawId);
        setSelectedIds((current) => current.includes(id)
            ? current.filter((itemId) => itemId !== id)
            : [...current, id]);
    }, []);

    const onDelete = useCallback(async (rawId) => {
        const id = String(rawId);
        if (!window.confirm(t('confirmDelete'))) return;
        try {
            await deleteEntity('products', id);
            await refreshCatalog();
            showNotice(t('lunchDeleted'), 'info');
        } catch (error) { showNotice(messageFromError(error), 'error'); }
    }, [refreshCatalog, showNotice, t]);

    const onDeleteSelected = useCallback(async () => {
        if (!selectedIds.length || !window.confirm(t('confirmDelete'))) return;
        let failures = [];
        for (const id of selectedIds) {
            try { await deleteEntity('products', id); }
            catch (error) { failures.push(messageFromError(error)); }
        }
        await refreshCatalog();
        if (failures.length) showNotice([...new Set(failures)].join('; '), 'error');
        else showNotice(t('selectedLunchesDeleted'), 'info');
    }, [refreshCatalog, selectedIds, showNotice, t]);

    const onSave = useCallback(async (product) => {
        const id = product.id || null;
        const body = {
            name: product.name.trim(),
            description: product.description.trim(),
            category: product.category,
            price: Number(product.price),
            image_url: product.image_url || '/images/SuperheroLunch.png',
            is_available: product.is_available !== false
        };
        try {
            await saveEntity('products', body, id);
            await refreshCatalog();
            showNotice(id ? t('lunchUpdated') : t('newLunchAdded'));
            return true;
        } catch (error) {
            showNotice(messageFromError(error), 'error');
            return false;
        }
    }, [refreshCatalog, showNotice, t]);

    const closeModal = useCallback(() => setActiveProduct(null), []);

    const actions = useMemo(() => ({
        onDetails: setActiveProduct,
        onFavorite,
        favorites,
        onAddToCart
    }), [onFavorite, favorites, onAddToCart]);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const routeContext = {
        organizationName,
        mainTitle: t('heroTitle'),
        steps: stepsState.map(step => ({ ...step, title: t(step.titleKey), text: t(step.textKey), ...(step.extraKey ? { extra: t(step.extraKey) } : {}) })),
        reviews: reviewsState.map(review => ({ ...review, title: t(review.titleKey), text: t(review.textKey) })),
        features: featuresState.map(key => t(key)),
        sliderImages: sliderImagesState,
        products,
        catalogLoading: catalog.status === 'loading',
        catalogError: catalog.error,
        favorites,
        cart,
        selectedIds,
        actions,
        onToggleSelected,
        onDeleteSelected,
        onSave,
        onDelete,
        onChangeQuantity,
        onRemove,
        showNotice
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar organizationName={organizationName} cartCount={cartCount} favoritesCount={favorites.length} />
            {catalog.error && <Alert severity="error" sx={{ m: 2 }}>{catalog.error}</Alert>}
            <Outlet context={routeContext} />
            <Footer organizationName={organizationName} links={footerLinksState.map(key => t(key))} />
            <ProductModal product={activeProduct} onClose={closeModal} onAddToCart={onAddToCart} />
            <Snackbar open={notice.open} autoHideDuration={2500} onClose={() => setNotice((current) => ({ ...current, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={notice.severity} variant="filled" onClose={() => setNotice((current) => ({ ...current, open: false }))}>{notice.message}</Alert>
            </Snackbar>
        </ThemeProvider>
    );
}

export default App;
