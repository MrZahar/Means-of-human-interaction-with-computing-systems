import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Checkbox, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Pagination, Chip } from '@mui/material';
import { fetchEntities, fetchEntity, saveEntity, deleteEntity } from '../http/entityAPI';
import { messageFromError } from '../http';

const columns = {
    users: ['full_name', 'email', 'phone', 'role', 'avatar_url'],
    products: ['name', 'description', 'category', 'price', 'is_available', 'image_url'],
    orders: ['user_id', 'product_id', 'quantity', 'unit_price', 'status', 'delivery_date', 'delivery_address', 'note']
};
const defaults = {
    users: { full_name: '', email: '', phone: '', role: 'customer', avatar_url: '' },
    products: { name: '', description: '', category: 'lunch_box', price: '', is_available: true, image_url: '/images/SuperheroLunch.png' },
    orders: { user_id: '', product_id: '', quantity: 1, unit_price: '', status: 'new', delivery_date: '2026-12-15', delivery_address: '', note: '' }
};
const choices = { role: ['customer', 'manager'], category: ['lunch_box', 'weekly_plan', 'vegetarian'], status: ['new', 'processing', 'completed', 'cancelled'] };
const filtersByType = { users: ['role'], products: ['category', 'is_available'], orders: ['status', 'user_id', 'product_id'] };
const sortsByType = { users: ['id', 'full_name', 'email', 'role'], products: ['id', 'name', 'price', 'category'], orders: ['id', 'delivery_date', 'status', 'unit_price', 'quantity'] };
const texts = {
    ru: { users: 'Пользователи PostgreSQL', products: 'Товары PostgreSQL', orders: 'Заказы PostgreSQL', add: 'Добавить', edit: 'Редактировать', remove: 'Удалить', detail: 'Подробнее', save: 'Сохранить', cancel: 'Отмена', search: 'Поиск по нескольким полям', reset: 'Очистить фильтры', sort: 'Сортировать по', asc: 'Возрастанию', desc: 'Убыванию', filter: 'Фильтр', all: 'Все', actions: 'Действия', empty: 'Записей нет', confirm: 'Вы уверены, что хотите удалить запись?', success: 'Изменения сохранены в PostgreSQL', deleted: 'Запись удалена', photo: 'Фото записи', current: 'Список загружен из PostgreSQL через Express и Axios', validation: 'Заполните обязательные поля и проверьте значения', name: 'Имя', full_name: 'ФИО', email: 'Email', phone: 'Телефон', role: 'Роль', avatar_url: 'Фото (URL)', description: 'Описание', category: 'Категория', price: 'Цена', is_available: 'В продаже', image_url: 'Фото (URL)', user_id: 'Пользователь', product_id: 'Товар', quantity: 'Количество', unit_price: 'Цена заказа', status: 'Статус', delivery_date: 'Дата доставки', delivery_address: 'Адрес доставки', note: 'Примечание', customer: 'Клиент', manager: 'Менеджер', lunch_box: 'Набор обедов', weekly_plan: 'Недельный план', vegetarian: 'Вегетарианский', new: 'Новый', processing: 'В обработке', completed: 'Завершён', cancelled: 'Отменён' },
    en: { users: 'PostgreSQL users', products: 'PostgreSQL products', orders: 'PostgreSQL orders', add: 'Add', edit: 'Edit', remove: 'Delete', detail: 'Details', save: 'Save', cancel: 'Cancel', search: 'Search multiple fields', reset: 'Clear filters', sort: 'Sort by', asc: 'Ascending', desc: 'Descending', filter: 'Filter', all: 'All', actions: 'Actions', empty: 'No records', confirm: 'Delete this record?', success: 'Saved in PostgreSQL', deleted: 'Record deleted', photo: 'Record image', current: 'Records loaded from PostgreSQL via Express and Axios', validation: 'Complete required fields and verify values', full_name: 'Full name', email: 'Email', phone: 'Phone', role: 'Role', avatar_url: 'Photo URL', name: 'Name', description: 'Description', category: 'Category', price: 'Price', is_available: 'Available', image_url: 'Photo URL', user_id: 'Customer', product_id: 'Product', quantity: 'Quantity', unit_price: 'Order price', status: 'Status', delivery_date: 'Delivery date', delivery_address: 'Delivery address', note: 'Note', customer: 'Customer', manager: 'Manager', lunch_box: 'Lunch box', weekly_plan: 'Weekly plan', vegetarian: 'Vegetarian', new: 'New', processing: 'Processing', completed: 'Completed', cancelled: 'Cancelled' }
};

export default function DatabasePage({ type }) {
    const { i18n } = useTranslation();
    const ui = texts[i18n.resolvedLanguage === 'en' ? 'en' : 'ru'];
    const [data, setData] = useState({ items: [], total: 0, pages: 1, loading: false, error: null });
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortDir, setSortDir] = useState('asc');
    const [filters, setFilters] = useState({});
    const [form, setForm] = useState(null);
    const [editId, setEditId] = useState(null);
    const [preview, setPreview] = useState(null);
    const [lookups, setLookups] = useState({ users: [], products: [] });
    const [notice, setNotice] = useState('');
    const [saving, setSaving] = useState(false);
    const params = useMemo(() => ({ page, limit, sortBy, sortDir, search: search.trim(), ...filters }), [page, limit, sortBy, sortDir, search, filters]);
    const refresh = useCallback(async () => {
        setData(current => ({ ...current, loading: true, error: null }));
        try {
            const result = await fetchEntities(type, params);
            setData({ ...result, loading: false, error: null });
        } catch (error) {
            setData(current => ({ ...current, loading: false, error: messageFromError(error) }));
        }
    }, [type, params]);
    useEffect(() => { refresh(); }, [refresh]);
    useEffect(() => {
        if (type !== 'orders') return;
        Promise.all([fetchEntities('users', { limit: 100 }), fetchEntities('products', { limit: 100 })])
            .then(([users, products]) => setLookups({ users: users.items, products: products.items }))
            .catch(() => setLookups({ users: [], products: [] }));
    }, [type]);
    useEffect(() => { setPage(1); setSearch(''); setFilters({}); setSortBy('id'); setSortDir('asc'); setForm(null); }, [type]);
    function setFilter(key, value) { setFilters(prev => ({ ...prev, [key]: value })); setPage(1); }
    function startCreate() { setEditId(null); setForm({ ...defaults[type] }); }
    function startEdit(item) { setEditId(item.id); setForm(Object.fromEntries(columns[type].map(key => [key, item[key] ?? '']))); }
    function labelFor(key, value) {
        if (key === 'user_id') return lookups.users.find(row => String(row.id) === String(value))?.full_name || `#${value}`;
        if (key === 'product_id') return lookups.products.find(row => String(row.id) === String(value))?.name || `#${value}`;
        if (key === 'is_available') return value ? '✓' : '—';
        return ui[value] || String(value ?? '');
    }
    function validate() {
        if (type === 'users') return !!form.full_name.trim() && /.+@.+\..+/.test(form.email);
        if (type === 'products') return !!form.name.trim() && Number(form.price) > 0;
        return !!form.user_id && !!form.product_id && Number.isInteger(Number(form.quantity)) && Number(form.quantity) > 0 && Number(form.unit_price) > 0 && !!form.delivery_date && !!form.delivery_address.trim();
    }
    async function save(event) {
        event.preventDefault();
        if (!validate()) { setNotice(ui.validation); return; }
        const body = { ...form };
        if (type === 'products') body.price = Number(body.price);
        if (type === 'orders') { body.quantity = Number(body.quantity); body.unit_price = Number(body.unit_price); }
        setSaving(true);
        try {
            await saveEntity(type, body, editId);
            setForm(null); setNotice(ui.success); await refresh();
        } catch (error) { setData(current => ({ ...current, error: messageFromError(error) })); }
        finally { setSaving(false); }
    }
    async function remove(id) {
        if (!window.confirm(ui.confirm)) return;
        try { await deleteEntity(type, id); setNotice(ui.deleted); await refresh(); }
        catch (error) { setData(current => ({ ...current, error: messageFromError(error) })); }
    }
    async function details(id) {
        try { setPreview(await fetchEntity(type, id)); }
        catch (error) { setData(current => ({ ...current, error: messageFromError(error) })); }
    }
    function renderField(key) {
        if (key === 'is_available') return <FormControlLabel key={key} control={<Checkbox checked={Boolean(form[key])} onChange={event => setForm({ ...form, [key]: event.target.checked })} />} label={ui[key]} />;
        const options = choices[key] || (key === 'user_id' ? lookups.users.map(x => ({ value: x.id, label: x.full_name })) : key === 'product_id' ? lookups.products.map(x => ({ value: x.id, label: x.name })) : null);
        if (options) return <TextField key={key} fullWidth select label={ui[key]} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}>
            {options.map(option => typeof option === 'string' ? <MenuItem key={option} value={option}>{ui[option] || option}</MenuItem> : <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
        </TextField>;
        return <TextField key={key} fullWidth label={ui[key] || key} value={form[key]} helperText={key === 'image_url' ? '/images/Lunch2.png' : undefined} type={['price','unit_price','quantity'].includes(key) ? 'number' : key === 'delivery_date' ? 'date' : key === 'email' ? 'email' : 'text'} slotProps={{ inputLabel: { shrink: true }, htmlInput: ['price','unit_price'].includes(key) ? { step: '0.01', min: '0.01' } : key === 'quantity' ? { step: '1', min: '1' } : {} }} onChange={e => setForm({ ...form, [key]: e.target.value })} />;
    }
    return <Container maxWidth="xl" sx={{ py: 5 }}>
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight="bold">{ui[type]}</Typography>
            <Typography color="text.secondary">{ui.current}</Typography>
            {notice && <Alert severity="info" onClose={() => setNotice('')}>{notice}</Alert>}
            {data.error && <Alert severity="error">{data.error}</Alert>}
            <Paper sx={{ p: 2 }}><Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label={ui.search} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></Grid>
                {filtersByType[type].map(key => <Grid key={key} size={{ xs: 12, sm: 6, md: 2 }}><TextField select fullWidth label={`${ui.filter}: ${ui[key]}`} value={filters[key] || ''} onChange={e => setFilter(key, e.target.value)}>
                    <MenuItem value="">{ui.all}</MenuItem>
                    {(choices[key] || (key === 'is_available' ? ['true','false'] : key === 'user_id' ? lookups.users.map(x => String(x.id)) : lookups.products.map(x => String(x.id)))).map(value => <MenuItem key={value} value={value}>{key === 'user_id' || key === 'product_id' ? labelFor(key, value) : ui[value] || value}</MenuItem>)}
                </TextField></Grid>)}
                <Grid size={{ xs: 6, md: 2 }}><TextField select fullWidth label={ui.sort} value={sortBy} onChange={e => setSortBy(e.target.value)}>{sortsByType[type].map(x => <MenuItem value={x} key={x}>{ui[x] || x}</MenuItem>)}</TextField></Grid>
                <Grid size={{ xs: 6, md: 2 }}><TextField select fullWidth label="↑↓" value={sortDir} onChange={e => setSortDir(e.target.value)}><MenuItem value="asc">{ui.asc}</MenuItem><MenuItem value="desc">{ui.desc}</MenuItem></TextField></Grid>
                <Grid size={{ xs: 12, md: 2 }}><Button fullWidth variant="outlined" onClick={() => { setSearch(''); setFilters({}); setPage(1); }}>{ui.reset}</Button></Grid>
                <Grid size={{ xs: 12, md: 2 }}><Button fullWidth onClick={startCreate}>{ui.add}</Button></Grid>
            </Grid></Paper>
            <Typography color="text.secondary">{data.total} {ui.all.toLowerCase()}</Typography>
            {data.loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell>{columns[type].filter(key => !['avatar_url','image_url','description','note'].includes(key)).map(key => <TableCell key={key}>{ui[key]}</TableCell>)}<TableCell>{ui.actions}</TableCell></TableRow></TableHead>
                <TableBody>{data.items.map(item => <TableRow key={item.id} hover><TableCell>{item.id}</TableCell>{columns[type].filter(key => !['avatar_url','image_url','description','note'].includes(key)).map(key => <TableCell key={key}>{labelFor(key, item[key])}</TableCell>)}<TableCell><Stack direction="row" spacing={1}><Button size="small" onClick={() => details(item.id)}>{ui.detail}</Button><Button size="small" onClick={() => startEdit(item)}>{ui.edit}</Button><Button color="error" size="small" onClick={() => remove(item.id)}>{ui.remove}</Button></Stack></TableCell></TableRow>)}
                    {!data.items.length && <TableRow><TableCell colSpan={columns[type].length + 2}>{ui.empty}</TableCell></TableRow>}</TableBody>
            </Table></TableContainer>
            <Stack direction="row" justifyContent="center"><Pagination page={page} count={Math.max(1, data.pages)} onChange={(_, value) => setPage(value)} color="primary" /></Stack>
        </Stack>
        <Dialog open={form !== null} onClose={() => setForm(null)} maxWidth="sm" fullWidth><DialogTitle>{editId == null ? ui.add : ui.edit} — {ui[type]}</DialogTitle><Box component="form" onSubmit={save}><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{form && columns[type].map(renderField)}</Stack></DialogContent><DialogActions><Button variant="text" onClick={() => setForm(null)}>{ui.cancel}</Button><Button type="submit" disabled={saving}>{ui.save}</Button></DialogActions></Box></Dialog>
        <Dialog open={Boolean(preview)} onClose={() => { setPreview(null); }} fullWidth maxWidth="sm"><DialogTitle>{ui.detail} #{preview?.id}</DialogTitle><DialogContent><Stack spacing={1}>{preview && <>{(preview.avatar_url || preview.image_url || preview.Product?.image_url) && <Box component="img" src={preview.avatar_url || preview.image_url || preview.Product.image_url} alt={ui.photo} sx={{ maxHeight: 250, maxWidth: '100%', objectFit: 'contain' }} />}{Object.entries(preview).filter(([key, value]) => key !== 'password' && value != null && typeof value !== 'object').map(([key,value]) => <Typography key={key}><strong>{ui[key] || key}:</strong> {labelFor(key,value)}</Typography>)}{preview.User && <Chip label={preview.User.full_name} />}{preview.Product && <Chip label={preview.Product.name} />}</>}</Stack></DialogContent><DialogActions><Button onClick={() => setPreview(null)}>{ui.cancel}</Button></DialogActions></Dialog>
    </Container>;
}
