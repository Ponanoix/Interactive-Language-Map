import './GroupButton.css';

const GroupButton = ({ toggleGroupLayer }) => {
    return (
        <button className="group-button" onClick={toggleGroupLayer}></button>
    );
};

export default GroupButton;
