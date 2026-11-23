import { localizeProduct, localizeCategory } from '../i18n/productText';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Chip, Stack, Typography, CardMedia } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

function ProductModal({ product, onClose, onAddToCart }) {
    const { t, i18n } = useTranslation();
    const shown = product ? localizeProduct(product, i18n.language) : null;
    if (!product) return null;

    const addProduct = () => {
        onAddToCart(product.id);
        onClose();
    };

    return (
        <Dialog open={Boolean(product)} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{shown.name}</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <CardMedia component="img" image={product.image} alt={shown.name} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/SuperheroLunch.png'; }} sx={{ maxHeight: 300, objectFit: 'cover', borderRadius: 2 }} />
                    <Chip label={localizeCategory(product.category, t)} color="secondary" sx={{ alignSelf: 'flex-start' }} />
                    <Typography>{shown.description}</Typography>
                    <Typography><strong>{t('ingredients')}:</strong> {shown.ingredients}</Typography>
                    <Typography variant="h5" color="primary" fontWeight={800}>${Number(product.price).toFixed(2)}</Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="text">{t('close')}</Button>
                <Button onClick={addProduct} disabled={product.is_available === false} startIcon={<AddShoppingCart />}>{t('addToCart')}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProductModal;
