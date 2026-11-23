import { useTranslation } from 'react-i18next';
function HowItWorks({ stepsData }) {
    const { t } = useTranslation();
    return (
        <section
            className="how-it-works"
            id="how-it-works"
        >
            <div className="container">
                <h2 className="section-main-title">{t('howItWorks')}</h2>

                <div className="cards">
                    {stepsData.map((step) => (
                        <article
                            className="step-card"
                            key={step.id}
                        >
                            <img
                                src={step.image}
                                alt={step.title}
                            />

                            <h2>
                                {step.title}
                            </h2>

                            <p>
                                {step.text}
                            </p>

                            {step.extra && (
                                <p className="extra-info">
                                    {step.extra}
                                </p>
                            )}

                            {step.id === 3 && (
                                <button type="button">
                                    Start Now • $9.99 per
                                    Lunch
                                </button>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;