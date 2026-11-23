import { useTranslation } from 'react-i18next';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Offer({ organizationName, onAddToCart, products = [] }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [plan, setPlan] = useState("full");
    const [added, setAdded] = useState(false);

    const decreaseQuantity = () => {
        setQuantity((current) =>
            current > 1
                ? current - 1
                : 1
        );
    };

    const increaseQuantity = () => {
        setQuantity((current) => current + 1);
    };

    const candidatePlans = products.filter(item => item.is_available !== false);
    const fullPlan = candidatePlans.find(item => /five|full|5/i.test(item.name)) || candidatePlans.find(item => item.category === 'weekly_plan');
    const halfPlan = candidatePlans.find(item => /three|half|3/i.test(item.name)) || candidatePlans.filter(item => item.category === 'weekly_plan')[1] || fullPlan;
    const chosen = plan === 'full' ? fullPlan : halfPlan;
    const addToCart = () => {
        if (!chosen) { navigate('/catalog'); return; }
        for (let i = 0; i < quantity; i += 1) onAddToCart(chosen.id);
        setAdded(true);
    };

    return (
        <section
            className="offer"
            id="offer"
        >
            <div className="container">
                <div className="lunch-description">

                    <div className="lunch-photo">
                        <img
                            src={chosen?.image || "/images/SuperheroLunch.png"}
                            alt="Lunch"
                        />

                        <div className="rectangle"></div>
                    </div>

                    <div className="text-description">
                        <p className="lunch-name">
                            {organizationName}
                        </p>

                        <h2 className="name">
                            {t('offerTitle')}
                        </h2>

                        <p className="cost">
                            {chosen ? `$${Number(chosen.price).toFixed(2)}` : '—'}
                        </p>

                        <div className="marks">
                            <div className="average-mark">
                                {[1, 2, 3, 4, 5].map(
                                    (number) => (
                                        <img
                                            key={number}
                                            src="/images/star.svg"
                                            alt=""
                                        />
                                    )
                                )}
                            </div>

                            <p className="number-of-reviews">
                                8 reviews
                            </p>
                        </div>

                        <p className="choosing">{t('chooseQuantity')}</p>

                        <div className="number-of-lunches">
                            <button
                                type="button"
                                className={
                                    plan === "full"
                                        ? "plan-button selected"
                                        : "plan-button"
                                }
                                onClick={() =>
                                    setPlan("full")
                                }
                            >{t('planFull')}</button>

                            <button
                                type="button"
                                className={
                                    plan === "half"
                                        ? "plan-button selected"
                                        : "plan-button"
                                }
                                onClick={() =>
                                    setPlan("half")
                                }
                            >{t('planHalf')}</button>
                        </div>

                        <div className="buttons">
                            <div className="amount">
                                <button
                                    type="button"
                                    onClick={decreaseQuantity}
                                >
                                    −
                                </button>

                                <span>
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={increaseQuantity}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className="add-to-cart"
                                type="button"
                                onClick={addToCart}
                            >{t('addToCart')}</button>
                        </div>

                        <p className="cart-info">
                            {added ? "Added to cart!" : "Choose your lunch plan"}
                        </p>

                        <div className="social-media">
                            <div className="facebook">
                                <img
                                    src="/images/facebook_icon.svg"
                                    alt="Facebook"
                                />

                                <p>
                                    Share on
                                    <br />
                                    Facebook
                                </p>
                            </div>

                            <div className="facebook">
                                <img
                                    src="/images/twitter_icon.svg"
                                    alt="Twitter"
                                />

                                <p>
                                    Share on
                                    <br />
                                    Twitter
                                </p>
                            </div>

                            <div className="facebook">
                                <img
                                    src="/images/pin_icon.svg"
                                    alt="Pinterest"
                                />

                                <p>{t('pinIt')}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        className="all-offers"
                        type="button"
                        onClick={() => navigate("/catalog")}
                    >{t('allOffers')}</button>
                </div>
            </div>
        </section>
    );
}

export default Offer;