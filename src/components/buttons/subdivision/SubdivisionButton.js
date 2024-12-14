import './SubdivisionButton.css';

const SubdivisionButton = ({ toggleSubdivisionLayer }) => {
    return (
        <button className="subdivision-button" onClick={toggleSubdivisionLayer}></button>
    );
};

export default SubdivisionButton;