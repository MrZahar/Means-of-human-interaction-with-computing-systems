import { useTranslation } from 'react-i18next';
import { Box, Container, Divider, Grid, Link, Paper, Stack, Typography } from '@mui/material';

function Footer({ organizationName, links }) {
    const { t } = useTranslation();
    return (
        <Paper component="footer" square elevation={0} sx={{ mt: 8, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="h5" fontWeight={800} gutterBottom>{t('footerTitle')}</Typography>
                        <Typography color="text.secondary" sx={{ maxWidth: 460 }}>{t('footerDescription')}</Typography>
                        <Box component="img" src="/images/footer-logo.svg" alt={`${organizationName} logo`} sx={{ width: 120, mt: 2 }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h6" gutterBottom>{t('information')}</Typography>
                        <Stack spacing={0.5}>{links.map((link) => <Link key={link} href="#" underline="hover" color="text.secondary">{link}</Link>)}</Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" gutterBottom>{t('stayTuned')}</Typography>
                        <Typography color="text.secondary">{t('signupUpdates')}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 4 }} />
                <Typography variant="body2" color="text.secondary">© 2026 {organizationName}</Typography>
            </Container>
        </Paper>
    );
}

export default Footer;
