import { useTranslation } from 'react-i18next';
import { Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    const { t } = useTranslation();
    return <Container maxWidth="md" sx={{ py: 10 }}><Stack spacing={2} alignItems="center" textAlign="center"><Typography variant="h2" fontWeight={800}>404</Typography><Typography variant="h4">{t('pageNotFound')}</Typography><Typography color="text.secondary">{t('pageNotFoundText')}</Typography><Button component={Link} to="/">{t('backHome')}</Button></Stack></Container>;
}

export default NotFoundPage;
