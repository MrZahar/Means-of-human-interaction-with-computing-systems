import { useEffect, useState } from 'react';
import { AppBar, Badge, Box, Button, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar, Tooltip, Typography } from '@mui/material';
import { FavoriteBorder, Menu, ShoppingCart, Close, DarkMode, LightMode } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Navbar({ organizationName, cartCount = 0, favoritesCount = 0 }) {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkTheme, setDarkTheme] = useState(false);

    useEffect(() => setMenuOpen(false), [location.pathname]);

    useEffect(() => {
        document.body.classList.toggle('dark-theme', darkTheme);
        return () => document.body.classList.remove('dark-theme');
    }, [darkTheme]);

    const links = [
        { label: t('home'), to: '/' },
        { label: t('catalog'), to: '/catalog' },
        { label: t('users'), to: '/users' },
        { label: t('orders'), to: '/orders' },
        { label: t('productsDb'), to: '/products' }
    ];

    return (
        <>
            <AppBar position="sticky" elevation={2} color="inherit">
                <Toolbar sx={{ maxWidth: 1400, width: '100%', mx: 'auto', justifyContent: 'space-between' }}>
                    <Typography component={Link} to="/" color="primary" variant="h6" sx={{ textDecoration: 'none', fontWeight: 800 }}>
                        {organizationName}
                    </Typography>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                        {links.map((item) => <Button key={item.to} component={Link} to={item.to}>{item.label}</Button>)}
                        <Box role="group" aria-label="Language" sx={{ display: 'flex', gap: 0.5 }}>
                            <Button size="small" variant={i18n.resolvedLanguage === 'ru' ? 'contained' : 'outlined'} onClick={() => i18n.changeLanguage('ru')}>RU</Button>
                            <Button size="small" variant={i18n.resolvedLanguage === 'en' ? 'contained' : 'outlined'} onClick={() => i18n.changeLanguage('en')}>EN</Button>
                        </Box>
                        <Tooltip title={t('favorites')}>
                            <IconButton component={Link} to="/favorites" color="primary">
                                <Badge badgeContent={favoritesCount} color="secondary"><FavoriteBorder /></Badge>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('cartTitle')}>
                            <IconButton component={Link} to="/cart" color="primary">
                                <Badge badgeContent={cartCount} color="secondary"><ShoppingCart /></Badge>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={darkTheme ? t('lightTheme') : t('darkTheme')}>
                            <IconButton onClick={() => setDarkTheme((value) => !value)} color="primary">
                                {darkTheme ? <LightMode /> : <DarkMode />}
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <IconButton sx={{ display: { xs: 'inline-flex', md: 'none' } }} onClick={() => setMenuOpen(true)} color="primary" aria-label={t('openMenu')}>
                        <Menu />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
                <Box sx={{ width: 280 }} role="presentation">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}><IconButton onClick={() => setMenuOpen(false)}><Close /></IconButton></Box>
                    <List>
                        <ListItemButton component={Link} to="/"><ListItemText primary={t('home')} /></ListItemButton>
                        <ListItemButton component={Link} to="/catalog"><ListItemText primary={t('catalog')} /></ListItemButton>
                        <ListItemButton component={Link} to="/users"><ListItemText primary={t('users')} /></ListItemButton>
                        <ListItemButton component={Link} to="/orders"><ListItemText primary={t('orders')} /></ListItemButton>
                        <ListItemButton component={Link} to="/products"><ListItemText primary={t('productsDb')} /></ListItemButton>
                        <ListItemButton selected={i18n.resolvedLanguage === 'ru'} onClick={() => i18n.changeLanguage('ru')}><ListItemText primary="Русский (RU)" /></ListItemButton>
                        <ListItemButton selected={i18n.resolvedLanguage === 'en'} onClick={() => i18n.changeLanguage('en')}><ListItemText primary="English (EN)" /></ListItemButton>
                        <ListItemButton component={Link} to="/favorites"><ListItemText primary={`${t('favorites')} (${favoritesCount})`} /></ListItemButton>
                        <ListItemButton component={Link} to="/cart"><ListItemText primary={`${t('cart')} (${cartCount})`} /></ListItemButton>
                        {location.pathname === '/' && [['Offer', t('offer')], ['How It Works', t('howItWorks')], ['Locations', t('locations')], ['Gallery', t('gallery')]].map(([anchor, label]) => (
                            <ListItemButton key={label} component="a" href={`#${anchor.toLowerCase().replaceAll(' ', '-')}`}>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        ))}
                        <ListItemButton onClick={() => setDarkTheme((value) => !value)}>
                            <ListItemText primary={darkTheme ? t('lightTheme') : t('darkTheme')} />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
        </>
    );
}

export default Navbar;
