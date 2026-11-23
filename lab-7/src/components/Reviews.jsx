import { useTranslation } from 'react-i18next';
function Stars() {
    return (
        <div className="mark">
            {[1, 2, 3, 4, 5].map((number) => (
                <img
                    key={number}
                    src="/images/star.svg"
                    alt=""
                />
            ))}
        </div>
    );
}

function Reviews({ reviewsData }) {
    const { t } = useTranslation();
    return (
        <section
            className="reviews-section"
            id="reviews"
        >
            <h2 className="reviews-title">{t('customerReviews')}</h2>

            <div className="reviews-container">
                {reviewsData.map((review) => (
                    <article
                        className="review-card"
                        key={review.id}
                    >
                        <Stars />

                        <h2>
                            {review.title}
                        </h2>

                        <p>
                            {review.text}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default Reviews;