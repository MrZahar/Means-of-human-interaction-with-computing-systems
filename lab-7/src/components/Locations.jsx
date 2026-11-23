import { useTranslation } from 'react-i18next';
function Locations() {
    const { t } = useTranslation();
    return (
        <>
            <section
                className="location"
                id="locations"
            >
                <div className="location-container">
                    <div className="location-info">
                        <h2>{t('ourLocations')}</h2>

                        <p className="address">
                            We deliver lunches at PS031,
                            PS34,
                            <br />
                            PS110, and City Kids in
                            Brooklyn.
                        </p>

                        <p className="not-your-location">
                            Not your location? Please join
                            the waitlist to get notified
                            when we start delivering
                            lunches to your child's school
                            or camp. Get 50% off the first
                            week with the promo code
                            HERO50.
                        </p>

                        <button
                            className="join-waitlist"
                            type="button"
                        >{t('joinWaitlist')}</button>
                    </div>

                    <img
                        src="/images/map.png"
                        alt="Delivery map"
                    />
                </div>
            </section>

            <section className="map-section">
                <iframe
                    src="https://yandex.com/map-widget/v1/?ll=-73.952%2C40.724&z=13"
                    width="100%"
                    height="420"
                    title="Map"
                ></iframe>
            </section>
        </>
    );
}

export default Locations;