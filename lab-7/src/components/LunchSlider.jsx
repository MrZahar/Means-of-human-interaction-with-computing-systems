import { useTranslation } from 'react-i18next';
import { useState } from "react";

function LunchSlider({ images }) {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] =
        useState(0);

    const previousSlide = () => {
        setCurrentIndex((current) =>
            current === 0
                ? images.length - 1
                : current - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((current) =>
            current === images.length - 1
                ? 0
                : current + 1
        );
    };

    return (
        <section className="lunch-slider-section">
            <h2>{t('freshLunchGallery')}</h2>

            <div className="lunch-slider">
                <button
                    className="slider-btn prev"
                    type="button"
                    onClick={previousSlide}
                    aria-label={t('previousSlide')}
                >
                    ‹
                </button>

                <img
                    src={images[currentIndex]}
                    alt={`Lunch ${currentIndex + 1}`}
                />

                <button
                    className="slider-btn next"
                    type="button"
                    onClick={nextSlide}
                    aria-label={t('nextSlide')}
                >
                    ›
                </button>
            </div>

            <div className="slider-dots">
                {images.map((image, index) => (
                    <button
                        key={image}
                        type="button"
                        aria-label={`Slide ${index + 1}`}
                        className={
                            currentIndex === index
                                ? "slider-dot active"
                                : "slider-dot"
                        }
                        onClick={() =>
                            setCurrentIndex(index)
                        }
                    ></button>
                ))}
            </div>
        </section>
    );
}

export default LunchSlider;