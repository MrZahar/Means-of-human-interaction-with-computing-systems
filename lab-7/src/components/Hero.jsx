import { useTranslation } from 'react-i18next';
function Hero() {
    const { t } = useTranslation();
    const scrollToOffer = () => {
        document
            .getElementById("offer")
            ?.scrollIntoView({
                behavior: "smooth"
            });
    };

    return (
        <header
            className="header"
            id="home"
        >
            <div className="header-container">
                <p className="action">{t('heroLabel')}</p>

                <h1>
                    {t('heroTitle')}
                </h1>

                <p className="info-about">
                    {t('heroSubtitle')}
                </p>

                <button
                    className="start-now"
                    type="button"
                    onClick={scrollToOffer}
                >{t('startNow')}</button>
            </div>
        </header>
    );
}

export default Hero;