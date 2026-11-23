import { useTranslation } from 'react-i18next';
function CareAboutKids() {
    const { t } = useTranslation();
    return (
        <section className="care-about-kids">
            <div className="care-about-kids-container">
                <div className="care-about-kids-info fb50">
                    <h2 className="care-about-kids-title1">
                        {t('careTitle')}
                    </h2>

                    <h2 className="care-about-kids-title2">{t('reusableLunchbox')}</h2>

                    <p>
                        We pack every lunch in a
                        reusable leak-proof lunchbox
                        with a thermos to keep hot meals
                        warm for 3 hours. You will get
                        the lunchbox with the first
                        order for free!
                    </p>

                    <button type="button">{t('startNow')}</button>
                </div>

                <img
                    src="/images/enjoy_lunch.png"
                    className="fb50"
                    alt="Enjoy lunch"
                />
            </div>
        </section>
    );
}

export default CareAboutKids;