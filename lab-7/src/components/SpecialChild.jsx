import { useTranslation } from 'react-i18next';
function SpecialChild() {
    const { t } = useTranslation();
    return (
        <section className="special-child">
            <div className="special-child-container">
                <img
                    src="/images/special_child_image.png"
                    alt="Child"
                />

                <div className="special-child-info">
                    <h2 className="special-child-title1">{t('eachChildSpecial')}</h2>

                    <h2 className="special-child-title2">
                        {t('formTitle')}
                    </h2>

                    <p className="customizing">
                        We make customized and
                        feedback-driven lunches based
                        on your child's dietary
                        restrictions and food
                        preferences. We also constantly
                        improve the lunch experience
                        based on weekly feedback from
                        you and your child.
                    </p>

                    <button
                        className="fill-out"
                        type="button"
                    >
                        {t('fillForm')}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default SpecialChild;