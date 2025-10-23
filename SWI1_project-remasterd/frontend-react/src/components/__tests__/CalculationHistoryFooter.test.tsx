import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CalculationHistoryFooter from '../CalculationHistoryFooter';

// Mock fetch
global.fetch = jest.fn();

describe('CalculationHistoryFooter', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it('zobrazí "Žádná historie k zobrazení" když není žádná historie', async () => {
        // Mock fetch response
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            })
        );

        render(<CalculationHistoryFooter refreshKey={0} />);

        await waitFor(() => {
            expect(screen.getByText('Žádná historie k zobrazení.')).toBeInTheDocument();
        });
    });

    it('zobrazí historii výpočtů když existují záznamy', async () => {
        const mockHistory = [{
            id: 1,
            timestamp: '2024-03-19T10:00:00',
            parameters: '{"mass": 10}',
            calculationType: 'Full Caliber',
            result: 150.5
        }];

        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockHistory)
            })
        );

        render(<CalculationHistoryFooter refreshKey={0} />);

        await waitFor(() => {
            expect(screen.getByText('Full Caliber')).toBeInTheDocument();
            expect(screen.getByText(/150.5/)).toBeInTheDocument();
        });
    });
});
// CalculationHistoryFooter.test.tsx
test('zobrazí prázdnou historii při chybě načítání', async () => {
  // Mock fetch aby simuloval chybu
  global.fetch = jest.fn(() =>
    Promise.reject('Chyba sítě')
  ) as jest.Mock;

  // Zachytí console.error aby neznečišťoval výstup testu
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(<CalculationHistoryFooter refreshKey={0} />);

  // Počkáme na vykreslení komponenty
  await waitFor(() => {
    expect(screen.getByText('Žádná historie k zobrazení.')).toBeInTheDocument();
  });

  // Ověříme, že byla chyba zalogována
  expect(consoleSpy).toHaveBeenCalled();
  
  // Vyčistíme spy
  consoleSpy.mockRestore();
});