import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Card, CardContent, Chip, Container, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

const emptyUser = { name: '', email: '', phone: '', role: 'customer' };
const emptyOrder = { userId: '', product: '', quantity: 1, price: '', status: 'new' };
const statuses = ['new', 'processing', 'completed', 'cancelled'];

async function request(path, options = {}) {
    const response = await fetch(path, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
    return data;
}

function ServerLabPage() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [kind, setKind] = useState('users');
    const [form, setForm] = useState(emptyUser);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const [nextUsers, nextOrders] = await Promise.all([
                request('/api/users'),
                request('/api/orders')
            ]);
            setUsers(nextUsers);
            setOrders(nextOrders);
            setError('');
        } catch (failure) {
            setError(failure.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    function changeKind(value) {
        setKind(value);
        setEditingId(null);
        setMessage('');
        setError('');
        setForm(value === 'users' ? emptyUser : { ...emptyOrder, userId: users[0]?.id || '' });
    }

    async function save(event) {
        event.preventDefault();
        const body = kind === 'orders'
            ? { ...form, userId: Number(form.userId), quantity: Number(form.quantity), price: Number(form.price) }
            : { ...form };
        const path = `/api/${kind}${editingId == null ? '' : `/${editingId}`}`;
        try {
            await request(path, { method: editingId == null ? 'POST' : 'PUT', body: JSON.stringify(body) });
            setMessage(t('serverSaved'));
            setError('');
            setEditingId(null);
            setForm(kind === 'users' ? emptyUser : { ...emptyOrder, userId: users[0]?.id || '' });
            await refresh();
        } catch (failure) { setError(failure.message); }
    }

    async function remove(id) {
        if (!window.confirm(t('confirmDelete'))) return;
        try {
            await request(`/api/${kind}/${id}`, { method: 'DELETE' });
            setMessage(t('serverDeleted'));
            await refresh();
        } catch (failure) { setError(failure.message); }
    }

    function startEdit(record) { setEditingId(record.id); setForm({ ...record }); setError(''); }
    function cancelEdit() {
        setEditingId(null);
        setForm(kind === 'users' ? emptyUser : { ...emptyOrder, userId: users[0]?.id || '' });
    }

    async function loadStatistics() {
        try {
            const result = await request('/api/statistics', {
                method: 'POST',
                body: JSON.stringify({ role: 'all', status: 'all' })
            });
            setStats(result);
            setError('');
        } catch (failure) { setError(failure.message); }
    }

    async function download(format) {
        try {
            const accept = { xml: 'application/xml', html: 'text/html', json: 'application/json' }[format];
            const response = await fetch(`/api/export/${kind}`, { headers: { Accept: accept } });
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.error || `HTTP ${response.status}`);
            }
            const url = URL.createObjectURL(await response.blob());
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `${kind}.${format}`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (failure) { setError(failure.message); }
    }

    const rows = kind === 'users' ? users : orders;
    return <Container maxWidth="lg" sx={{ py: 5, minHeight: '70vh' }}>
        <Typography variant="overline" color="primary">Node.js / Express / HTTP</Typography>
        <Typography variant="h4" sx={{ mb: 1 }} fontWeight={750}>{t('serverTitle')}</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>{t('serverIntro')}</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>{t('serverHint')}</Alert>
        {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" onClose={() => setMessage('')} sx={{ mb: 2 }}>{message}</Alert>}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 210 }}><InputLabel>{t('category')}</InputLabel>
                <Select label={t('category')} value={kind} onChange={e => changeKind(e.target.value)}>
                    <MenuItem value="users">{t('serverUsers')}</MenuItem>
                    <MenuItem value="orders">{t('serverOrders')}</MenuItem>
                </Select>
            </FormControl>
            <Button variant="outlined" disabled={loading} onClick={refresh}>{t('serverLoad')}</Button>
            <Button variant="outlined" onClick={loadStatistics}>{t('serverStats')}</Button>
            {['xml', 'html', 'json'].map(format => <Button key={format} variant="contained" onClick={() => download(format)}>{t('serverExport')} {format.toUpperCase()}</Button>)}
        </Stack>
        {stats && <Card sx={{ mb: 3 }}><CardContent><Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Typography>{t('users')}: <strong>{stats.usersCount}</strong></Typography>
            <Typography>{t('orders')}: <strong>{stats.ordersCount}</strong></Typography>
            <Typography>{t('serverRevenue')}: <strong>${stats.revenue.toFixed(2)}</strong></Typography>
        </Stack></CardContent></Card>}
        <TableContainer component={Paper} sx={{ mb: 3 }}><Table sx={{ minWidth: 650 }} size="small">
            <TableHead><TableRow>
                <TableCell>ID</TableCell>
                {kind === 'users' ? <><TableCell>{t('name')}</TableCell><TableCell>{t('email')}</TableCell><TableCell>{t('role')}</TableCell></> : <><TableCell>{t('user')}</TableCell><TableCell>{t('product')}</TableCell><TableCell>{t('quantity')}</TableCell><TableCell>{t('status')}</TableCell></>}
                <TableCell>{t('actions')}</TableCell>
            </TableRow></TableHead>
            <TableBody>{rows.map(item => <TableRow key={item.id} hover>
                <TableCell>{item.id}</TableCell>
                {kind === 'users' ? <><TableCell>{item.name}</TableCell><TableCell>{item.email}</TableCell><TableCell><Chip size="small" label={t(item.role)} /></TableCell></> : <><TableCell>{users.find(u => u.id === item.userId)?.name || item.userId}</TableCell><TableCell>{item.product}</TableCell><TableCell>{item.quantity}</TableCell><TableCell><Chip size="small" label={t(item.status)} /></TableCell></>}
                <TableCell><Button size="small" onClick={() => startEdit(item)}>{t('edit')}</Button><Button color="error" size="small" onClick={() => remove(item.id)}>{t('delete')}</Button></TableCell>
            </TableRow>)}
            {rows.length === 0 && <TableRow><TableCell colSpan={5}>{t('serverNoData')}</TableCell></TableRow>}
            </TableBody>
        </Table></TableContainer>
        <Paper sx={{ p: 3 }}><Typography variant="h6" sx={{ mb: 2 }}>{editingId === null ? t('serverCreate') : t('serverEditing')}</Typography>
            <Box component="form" onSubmit={save}>
                <Stack spacing={2}>
                    {kind === 'users' ? <>
                        <TextField required label={t('name')} value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
                        <TextField required type="email" label={t('email')} value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} />
                        <TextField label={t('phone')} value={form.phone || ''} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} />
                        <FormControl><InputLabel>{t('role')}</InputLabel><Select label={t('role')} value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}><MenuItem value="customer">{t('customer')}</MenuItem><MenuItem value="manager">{t('manager')}</MenuItem></Select></FormControl>
                    </> : <>
                        <FormControl required><InputLabel>{t('user')}</InputLabel><Select label={t('user')} value={form.userId} onChange={e => setForm(prev => ({ ...prev, userId: e.target.value }))}>{users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}</Select></FormControl>
                        <TextField required label={t('product')} value={form.product} onChange={e => setForm(prev => ({ ...prev, product: e.target.value }))} />
                        <TextField required type="number" inputProps={{ min: 1, step: 1 }} label={t('quantity')} value={form.quantity} onChange={e => setForm(prev => ({ ...prev, quantity: e.target.value }))} />
                        <TextField required type="number" inputProps={{ min: .01, step: .01 }} label={t('price')} value={form.price} onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))} />
                        <FormControl><InputLabel>{t('status')}</InputLabel><Select label={t('status')} value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}>{statuses.map(status => <MenuItem value={status} key={status}>{t(status)}</MenuItem>)}</Select></FormControl>
                    </>}
                    <Stack direction="row" spacing={2}><Button variant="contained" type="submit">{t('save')}</Button>{editingId !== null && <Button onClick={cancelEdit}>{t('serverCancel')}</Button>}</Stack>
                </Stack>
            </Box>
        </Paper>
    </Container>;
}
export default ServerLabPage;
