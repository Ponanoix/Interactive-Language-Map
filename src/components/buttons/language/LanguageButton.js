import './LanguageButton.css';

const LanguageButton = ({ toggleLanguageLayer }) => {
    return (
        <button className="language-button" onClick={toggleLanguageLayer}></button>
    );
};

export default LanguageButton;
