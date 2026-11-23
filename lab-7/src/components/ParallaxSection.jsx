import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";

function ParallaxSection() {
    const { t } = useTranslation();
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, []);

    return (
        <section className="parallax-section">
            <div
                className="parallax-bg"
                style={{
                    transform:
                        `translateY(${offset * 0.05}px)`
                }}
            ></div>

            <img
                src="/images/peas.png"
                className="parallax-middle"
                alt=""
                style={{
                    transform:
                        `translateY(${-offset * 0.02}px)`
                }}
            />

            <div className="parallax-front">
                <h2>{t('freshFood')}</h2>

                <p>
                    {t('freshFoodSubtitle')}
                </p>
            </div>
        </section>
    );
}

export default ParallaxSection;