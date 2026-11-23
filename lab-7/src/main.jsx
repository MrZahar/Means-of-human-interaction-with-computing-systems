import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import FavoritesPage from './pages/FavoritesPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';
import DatabasePage from './pages/DatabasePage';
import './i18n';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'catalog',
                element: <CatalogPage />
            },
            {
                path: 'favorites',
                element: <FavoritesPage />
            },
            {
                path: 'cart',
                element: <CartPage />
            },
            { path: 'users', element: <DatabasePage type="users" /> },
            { path: 'orders', element: <DatabasePage type="orders" /> },
            { path: 'products', element: <DatabasePage type="products" /> },
            { path: 'server', element: <DatabasePage type="users" /> },
            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
