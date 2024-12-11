import { render } from '@testing-library/react';
import { AddExportButton } from "../components/buttons/ExportMapButton";

const mockMap = {
    getCanvas: () => ({
        toDataURL: () => 'data:image/png;base64,test',
    }),
};

test('renders export button', () => {
    render(<div>{AddExportButton(mockMap)}</div>);

    const buttonElement = document.querySelector('.export-map-button');

    expect(buttonElement).toBeInTheDocument();
});
