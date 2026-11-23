import { useTranslation } from 'react-i18next';
import { useState } from "react";

function MediaGallery({ images }) {
    const { t } = useTranslation();
    const [imageIndex, setImageIndex] =
        useState(0);

    const [mode, setMode] =
        useState("image");

    const [volume, setVolume] =
        useState(0.5);

    const changeImage = () => {
        setMode("image");

        setImageIndex((current) =>
            current === images.length - 1
                ? 0
                : current + 1
        );
    };

    const playSound = () => {
        alert(
            `Sound button clicked. Volume: ${Math.round(
                volume * 100
            )}%`
        );
    };

    return (
        <section
            className="media-gallery-section"
            id="gallery"
        >
            <p className="catalog-label">{t('interactiveGallery')}</p>

            <h2>{t('superMediaGallery')}</h2>

            <div className="media-gallery">
                <button
                    type="button"
                    className="media-trigger"
                    onClick={changeImage}
                >{t('changeImage')}</button>

                <button
                    type="button"
                    className="media-trigger"
                    onClick={playSound}
                >{t('playSound')}</button>

                <button
                    type="button"
                    className="media-trigger"
                    onClick={() => setMode("video")}
                >{t('openVideo')}</button>
            </div>

            <div className="media-player">
                {mode === "image" ? (
                    <img
                        src={images[imageIndex]}
                        alt="Media gallery"
                    />
                ) : (
                    <iframe
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Lunch video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}
            </div>

            <p className="player-status">
                Player status: {mode}
            </p>

            <label className="volume-control">
                <span>
                    Volume:{" "}
                    {Math.round(volume * 100)}%
                </span>

                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(event) =>
                        setVolume(
                            Number(
                                event.target.value
                            )
                        )
                    }
                />
            </label>
        </section>
    );
}

export default MediaGallery;