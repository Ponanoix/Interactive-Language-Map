import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageMap from '../components/LanguageMap';
import { useMapbox } from '../hooks/useMapbox';


Object.assign(global, { TextDecoder, TextEncoder });


jest.mock('../hooks/useMapbox');

describe('LanguageMap', () => {
    beforeEach(() => {

        useMapbox.mockReturnValue({
            isWebGLSupported: true,
        });
    });

    test('renderuje mapę i przyciski', () => {
        render(<LanguageMap />);

        expect(screen.getByTestId('map')).toBeInTheDocument();
        expect(screen.getByText(/Language/i)).toBeInTheDocument();
        expect(screen.getByText(/Group/i)).toBeInTheDocument();
        expect(screen.getByText(/Branch/i)).toBeInTheDocument();
    });

    test('zmienia widoczność warstw po kliknięciu przycisków', () => {
        render(<LanguageMap />);

        expect(screen.getByText(/Language/i)).toHaveClass('active');
        expect(screen.queryByText(/Group/i)).not.toHaveClass('active');
        expect(screen.queryByText(/Branch/i)).not.toHaveClass('active');

        fireEvent.click(screen.getByText(/Language/i));
        expect(screen.getByText(/Language/i)).toHaveClass('active');
        expect(screen.queryByText(/Group/i)).not.toHaveClass('active');
        expect(screen.queryByText(/Branch/i)).not.toHaveClass('active');

        fireEvent.click(screen.getByText(/Group/i));
        expect(screen.getByText(/Language/i)).not.toHaveClass('active');
        expect(screen.getByText(/Group/i)).toHaveClass('active');
        expect(screen.queryByText(/Branch/i)).not.toHaveClass('active');

        fireEvent.click(screen.getByText(/Branch/i));
        expect(screen.getByText(/Language/i)).not.toHaveClass('active');
        expect(screen.queryByText(/Group/i)).not.toHaveClass('active');
        expect(screen.getByText(/Branch/i)).toHaveClass('active');
    });

    test('jeśli WebGL nie jest wspierany, wyświetla komunikat', () => {
        useMapbox.mockReturnValue({
            isWebGLSupported: false,
        });

        render(<LanguageMap />);

        expect(screen.getByText(/Your browser does not support WebGL/i)).toBeInTheDocument();
    });
});
