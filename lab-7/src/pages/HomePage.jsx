import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import Hero from '../components/Hero';
import Offer from '../components/Offer';
import Locations from '../components/Locations';
import HowItWorks from '../components/HowItWorks';
import FeedSuperhero from '../components/FeedSuperhero';
import SpecialChild from '../components/SpecialChild';
import CareAboutKids from '../components/CareAboutKids';
import Reviews from '../components/Reviews';
import Community from '../components/Community';
import LunchSlider from '../components/LunchSlider';
import MediaGallery from '../components/MediaGallery';
import ParallaxSection from '../components/ParallaxSection';
import ProductGrid from '../components/ProductGrid';

function HomePage() {
    const { t } = useTranslation();
    const { organizationName, mainTitle, steps, features, reviews, sliderImages, products, actions } = useOutletContext();

    return (
        <main>
            <Hero mainTitle={mainTitle} />
            <Offer organizationName={organizationName} products={products} onAddToCart={actions.onAddToCart} />
            <Locations />
            <HowItWorks stepsData={steps} />
            <FeedSuperhero featuresData={features} />
            <SpecialChild />
            <CareAboutKids />
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Paper sx={{ p: { xs: 2, md: 4 } }}>
                    <Stack spacing={1} mb={3}>
                        <Typography variant="overline" color="primary">{t('freshLunches')}</Typography>
                        <Typography variant="h3" fontWeight={800}>{t('exploreLunches')}</Typography>
                        <Typography color="text.secondary">{t('reusableCards')}</Typography>
                    </Stack>
                    <ProductGrid products={products.slice(0, 3)} {...actions} />
                </Paper>
            </Container>
            <Reviews reviewsData={reviews} />
            <Community />
            <LunchSlider images={sliderImages} />
            <MediaGallery images={sliderImages} />
            <ParallaxSection />
        </main>
    );
}

export default HomePage;
