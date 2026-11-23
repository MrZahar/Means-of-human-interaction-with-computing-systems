import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button, Checkbox, FormControlLabel, MenuItem, Stack, TextField } from '@mui/material';

const initial = { name: '', category: 'lunch_box', price: '9.99', image_url: '/images/SuperheroLunch.png', description: '', is_available: true };

export default function ProductForm({ product, onSave, onCancel }) {
    const { t } = useTranslation();
    const [form, setForm] = useState(() => product ? {
        name: product.name || '', category: product.category || 'lunch_box',
        price: String(product.price), image_url: product.image_url || '',
        description: product.description || '', is_available: product.is_available !== false
    } : initial);
    const [saving, setSaving] = useState(false);
    const edit = event => setForm(old => ({ ...old, [event.target.name]: event.target.value }));
    const submit = async event => {
        event.preventDefault();
        const price = Number(form.price);
        if (!form.name.trim() || !Number.isFinite(price) || price <= 0) return;
        setSaving(true);
        try {
            const saved = await onSave({ ...form, id: product?.id, price });
            if (saved) onCancel();
        } finally { setSaving(false); }
    };
    return <Stack component="form" onSubmit={submit} spacing={2}>
        <TextField name="name" label={t('name')} value={form.name} onChange={edit} required inputProps={{ maxLength: 160 }} />
        <TextField select name="category" label={t('category')} value={form.category} onChange={edit}>
            <MenuItem value="lunch_box">{t('lunchBoxes')}</MenuItem>
            <MenuItem value="weekly_plan">{t('weeklyPlans')}</MenuItem>
            <MenuItem value="vegetarian">{t('vegetarian')}</MenuItem>
        </TextField>
        <TextField name="price" label={t('price')} type="number" inputProps={{ min: 0.01, step: 0.01 }} value={form.price} onChange={edit} required />
        <TextField name="image_url" label={t('image') + ' (URL)'} helperText="Например: /images/Lunch2.png" value={form.image_url} onChange={edit} />
        <FormControlLabel control={<Checkbox checked={form.is_available} onChange={event => setForm(old => ({ ...old, is_available: event.target.checked }))} />} label={t('available')}/>
        <TextField name="description" label={t('description')} value={form.description} onChange={edit} multiline minRows={3} />
        <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button type="button" variant="text" onClick={onCancel}>{t('cancel')}</Button>
            <Button type="submit" disabled={saving}>{saving ? '...' : t('save')}</Button>
        </Stack>
    </Stack>;
}
