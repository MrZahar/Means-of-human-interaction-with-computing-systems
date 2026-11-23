import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Alert, Container, Grid, Stack, Typography } from '@mui/material';
import ProductCard from '../components/ProductCard';

function FavoritesPage() {
    const { t } = useTranslation();
    const { products, favorites, actions } = useOutletContext();
    const favoriteProducts = useMemo(() => products.filter((product) => favorites.includes(product.id)), [products, favorites]);

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Stack spacing={1} mb={4}>
                <Typography variant="overline" color="primary">{t('savedForLater')}</Typography>
                <Typography variant="h3" component="h1" fontWeight={800}>{t('favoritesTitle')}</Typography>
                <Typography color="text.secondary">{t('favoritesSubtitle')}</Typography>
            </Stack>
            {favoriteProducts.length ? (
                <Grid container spacing={3}>
                    {favoriteProducts.map((product) => <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}><ProductCard product={product} isFavorite {...actions} /></Grid>)}
                </Grid>
            ) : <Alert severity="info">{t('favoritesEmpty')}</Alert>}
        </Container>
    );
}

export default FavoritesPage;
