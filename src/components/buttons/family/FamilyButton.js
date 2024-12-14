import './FamilyButton.css';

const FamilyButton = ({ toggleFamilyLayer }) => {
    return (
        <button className="family-button" onClick={toggleFamilyLayer}></button>
    );
};

export default FamilyButton;