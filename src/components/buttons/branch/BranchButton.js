import './BranchButton.css';

const BranchButton = ({ toggleBranchLayer }) => {
    return (
        <button className="branch-button" onClick={toggleBranchLayer}></button>
    );
};

export default BranchButton;
