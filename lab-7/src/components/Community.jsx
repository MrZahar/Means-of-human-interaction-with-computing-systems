import { useTranslation } from 'react-i18next';
function Community() {
    const { t } = useTranslation();
    return (
        <>
            <section className="super-community">
                <h2>{t('superCommunity')}</h2>

                <p>{t('staySuperTuned')}</p>
            </section>

            <section className="help">
                <h2>{t('weLoveToHelp')}</h2>

                <p className="p1">
                    Any questions? Please reach
                    <br />
                    out via the chat, email, or text:
                </p>

                <a
                    className="post"
                    href="mailto:hey@thesuperherobox.com"
                >
                    hey@thesuperherobox.com
                </a>

                <br />

                <a
                    className="p2"
                    href="tel:9292479457"
                >
                    929.247.9457
                </a>
            </section>

            <section className="empower">
                <h2>{t('empower')}</h2>

                <p>
                    {t('empowerSubtitle')}
                </p>

                <button type="button">{t('startNow')}</button>
            </section>
        </>
    );
}

export default Community;