import { localizeProduct, localizeCategory } from '../i18n/productText';
import { useTranslation } from 'react-i18next';
import { Card, CardActions, CardContent, CardMedia, Checkbox, Chip, IconButton, Stack, Tooltip, Typography, Button } from '@mui/material';
import { Favorite, FavoriteBorder, Visibility } from '@mui/icons-material';

function ProductCard({ product, onDetails, onFavorite, isFavorite, onAddToCart, selected = false, onToggleSelected }) {
    const { t, i18n } = useTranslation();
    const shown = product ? localizeProduct(product, i18n.language) : null;
    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', border: selected ? 2 : 1, borderColor: selected ? 'primary.main' : 'divider' }}>
            <CardMedia component="img" height="190" image={product.image} alt={shown.name} loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/SuperheroLunch.png'; }} sx={{ objectFit: 'cover' }} />
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} mb={1}>
                    <Chip label={localizeCategory(product.category, t)} size="small" color="secondary" />
                    {onToggleSelected && <Checkbox checked={selected} onChange={() => onToggleSelected(product.id)} inputProps={{ 'aria-label': `Select ${shown.name}` }} />}
                </Stack>
                <Typography variant="h6" component="h3" gutterBottom>{shown.name}</Typography>
                <Typography variant="body2" color="text.secondary">{shown.description}</Typography>
                <Typography variant="h6" color="primary" fontWeight={800} sx={{ mt: 2 }}>${Number(product.price).toFixed(2)}</Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0, flexWrap: 'wrap' }}>
                <Button size="small" startIcon={<Visibility />} onClick={() => onDetails(product)}>{t('details')}</Button>
                <Tooltip title={isFavorite ? t('removeFavorite') : t('addFavorite')}>
                    <IconButton onClick={() => onFavorite(product.id)} color="primary" aria-pressed={isFavorite}>{isFavorite ? <Favorite /> : <FavoriteBorder />}</IconButton>
                </Tooltip>
                <Button size="small" variant="contained" disabled={product.is_available === false} onClick={() => onAddToCart(product.id)}>{t('addToCart')}</Button>
            </CardActions>
        </Card>
    );
}

export default ProductCard;
