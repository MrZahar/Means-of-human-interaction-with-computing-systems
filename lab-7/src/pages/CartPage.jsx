import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Alert, Button, Card, CardContent, Container, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import { Add, DeleteOutline, Remove } from '@mui/icons-material';

function CartPage() {
    const { t } = useTranslation();
    const { products, cart, onChangeQuantity, onRemove } = useOutletContext();
    const rows = useMemo(() => cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.id) })).filter((item) => item.product), [cart, products]);
    const total = rows.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Stack spacing={1} mb={4}>
                <Typography variant="overline" color="primary">{t('yourOrder')}</Typography>
                <Typography variant="h3" component="h1" fontWeight={800}>{t('cartTitle')}</Typography>
                <Typography color="text.secondary">{t('cartSubtitle')}</Typography>
            </Stack>
            {!rows.length ? <Alert severity="info">{t('cartEmpty')}</Alert> : (
                <Stack spacing={2}>
                    {rows.map(({ product, quantity }) => (
                        <Card key={product.id}>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, sm: 2 }}><img src={product.image} alt={product.name} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/SuperheroLunch.png'; }} className="lab3-cart-image" /></Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}><Typography variant="h6">{product.name}</Typography><Typography color="text.secondary">${Number(product.price).toFixed(2)} per item</Typography></Grid>
                                    <Grid size={{ xs: 8, sm: 3 }}><Stack direction="row" alignItems="center" spacing={1}><IconButton onClick={() => onChangeQuantity(product.id, -1)}><Remove /></IconButton><Typography>{quantity}</Typography><IconButton onClick={() => onChangeQuantity(product.id, 1)}><Add /></IconButton></Stack></Grid>
                                    <Grid size={{ xs: 4, sm: 2 }}><Typography fontWeight={800}>${(Number(product.price) * quantity).toFixed(2)}</Typography></Grid>
                                    <Grid size={{ xs: 12, sm: 1 }}><IconButton color="error" onClick={() => onRemove(product.id)}><DeleteOutline /></IconButton></Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                    <Divider />
                    <Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h5" fontWeight={800}>Total: ${total.toFixed(2)}</Typography><Button>{t('checkout')}</Button></Stack>
                </Stack>
            )}
        </Container>
    );
}

export default CartPage;
