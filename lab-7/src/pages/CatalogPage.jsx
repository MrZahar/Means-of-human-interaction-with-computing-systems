import { localizeProduct, localizeCategory } from '../i18n/productText';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Alert, Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { GridView, ViewList, Add } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';

function CatalogPage() {
    const { t, i18n } = useTranslation();
    const { products, catalogLoading, catalogError, selectedIds, onToggleSelected, onDeleteSelected, onSave, onDelete, actions } = useOutletContext();
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('name');
    const [editing, setEditing] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [view, setView] = useState('grid');

    const categories = useMemo(() => ['All', ...new Set(products.map((product) => product.category))], [products]);

    const visible = useMemo(() => {
        const filtered = products.filter((product) => {
            const matchesCategory = category === 'All' || product.category === category;
            const localized = localizeProduct(product, i18n.language);
            const matchesQuery = localized.name.toLowerCase().includes(query.toLowerCase()) || localized.description.toLowerCase().includes(query.toLowerCase());
            return matchesCategory && matchesQuery;
        });

        return [...filtered].sort((a, b) => {
            if (sort === 'priceAsc') return Number(a.price) - Number(b.price);
            if (sort === 'priceDesc') return Number(b.price) - Number(a.price);
            return localizeProduct(a, i18n.language).name.localeCompare(localizeProduct(b, i18n.language).name);
        });
    }, [products, category, query, sort, i18n.language]);

    const resetFilters = () => {
        setQuery('');
        setCategory('All');
        setSort('name');
    };

    const save = (product) => onSave(product);

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Stack spacing={1} mb={4}>
                <Typography variant="overline" color="primary">The Superhero Box</Typography>
                <Typography variant="h3" component="h1" fontWeight={800}>{t('catalogTitle')}</Typography>
                <Typography color="text.secondary">{t('catalogSubtitle')} · PostgreSQL</Typography>
            </Stack>

            <Paper sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label={t('searchLunches')} value={query} onChange={(event) => setQuery(event.target.value)} /></Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <FormControl fullWidth><InputLabel id="catalog-category">{t('category')}</InputLabel><Select labelId="catalog-category" label={t('category')} value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <MenuItem key={item} value={item}>{item === 'All' ? t('all') : localizeCategory(item, t)}</MenuItem>)}</Select></FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <FormControl fullWidth><InputLabel id="catalog-sort">{t('sort')}</InputLabel><Select labelId="catalog-sort" label={t('sort')} value={sort} onChange={(event) => setSort(event.target.value)}><MenuItem value="name">{t('sortName')}</MenuItem><MenuItem value="priceAsc">{t('priceAsc')}</MenuItem><MenuItem value="priceDesc">{t('priceDesc')}</MenuItem></Select></FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                            <Button variant="outlined" onClick={resetFilters}>{t('clearFilters')}</Button>
                            <Button startIcon={<Add />} onClick={() => { setEditing(null); setFormOpen(true); }}>{t('addLunch')}</Button>
                            <Button disabled={!selectedIds.length} color="error" variant="outlined" onClick={onDeleteSelected}>{t('deleteSelected')} ({selectedIds.length})</Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            {formOpen && (
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" fontWeight={700} mb={2}>{editing ? t('editLunch') : t('addNewLunch')}</Typography>
                    <ProductForm product={editing} onSave={save} onCancel={() => { setFormOpen(false); setEditing(null); }} />
                </Paper>
            )}

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography color="text.secondary">{t('found')}: {visible.length}</Typography>
                <ToggleButtonGroup exclusive value={view} onChange={(_, value) => value && setView(value)} size="small">
                    <ToggleButton value="grid" aria-label={t('gridView')}><GridView /></ToggleButton>
                    <ToggleButton value="list" aria-label={t('listView')}><ViewList /></ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            {catalogLoading && <Alert severity="info">{t('loadingCatalog')}</Alert>}
            {catalogError && <Alert severity="error">{catalogError}</Alert>}
            {visible.length ? (
                <Grid container spacing={3}>
                    {visible.map((product) => (
                        <Grid key={product.id} size={view === 'grid' ? { xs: 12, sm: 6, md: 4 } : { xs: 12 }}>
                            <Box>
                                <ProductCard product={product} selected={selectedIds.includes(product.id)} onToggleSelected={onToggleSelected} isFavorite={actions.favorites.includes(product.id)} {...actions} />
                                <Stack direction="row" spacing={1} mt={1}>
                                    <Button size="small" variant="outlined" fullWidth onClick={() => { setEditing(product); setFormOpen(true); }}>{t('edit')}</Button>
                                    <Button size="small" variant="outlined" color="error" fullWidth onClick={() => onDelete(product.id)}>{t('delete')}</Button>
                                </Stack>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            ) : !catalogLoading && !catalogError ? (
                <Alert severity="info">{t('noLunches')}</Alert>
            ) : null}
        </Container>
    );
}

export default CatalogPage;
