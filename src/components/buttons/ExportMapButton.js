import './ExportMapButton.css';

export const AddExportButton = (map) => {
    const buttonId = 'downloadLink';

    const button = document.createElement('button');
    button.id = buttonId;
    button.innerText = 'Export Map as Image';
    button.classList.add('export-map-button');

    document.body.appendChild(button);

    button.addEventListener('click', () => {
        const canvas = map.getCanvas();
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'map.png';
        link.click();
    });
};
