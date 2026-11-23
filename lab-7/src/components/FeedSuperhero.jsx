import { useTranslation } from 'react-i18next';
function FeedSuperhero({ featuresData }) {
    const { t } = useTranslation();
    return (
        <section className="feed-superhero">
            <div className="feed-superhero-container">
                <div className="feed-superhero-info">
                    <h2 className="feed-superhero-title1">{t('feedSuperheroes')}</h2>

                    <h2 className="feed-superhero-title2">
                        {t('feedFreshTitle')}
                    </h2>

                    <p className="collaborating">
                        {t('feedText1')}
                    </p>

                    <p className="offering">
                        {t('feedText2')}
                    </p>

                    <ul className="features">
                        {featuresData.map(
                            (feature) => (
                                <li key={feature}>
                                    • {feature}
                                </li>
                            )
                        )}
                    </ul>
                </div>

                <img
                    src="/images/peas.png"
                    alt="Fresh food"
                />
            </div>
        </section>
    );
}

export default FeedSuperhero;