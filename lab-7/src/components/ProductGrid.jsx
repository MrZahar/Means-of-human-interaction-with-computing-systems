import { useTranslation } from 'react-i18next';
import { Alert, Grid } from '@mui/material';
import ProductCard from './ProductCard';

function ProductGrid({ products, onDetails, onFavorite, favorites, onAddToCart, selectedIds = [], onToggleSelected }) {
    const { t } = useTranslation();
    if (!products.length) return <Alert severity="info">{t('noGridLunches')}</Alert>;

    return (
        <Grid container spacing={3}>
            {products.map((product) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ProductCard
                        product={product}
                        onDetails={onDetails}
                        onFavorite={onFavorite}
                        isFavorite={favorites.includes(product.id)}
                        onAddToCart={onAddToCart}
                        selected={selectedIds.includes(product.id)}
                        onToggleSelected={onToggleSelected}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default ProductGrid;
