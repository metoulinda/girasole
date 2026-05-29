import { render, screen } from '@testing-library/react';
import App from './App';
import { StoreProvider } from './Store';
import { HelmetProvider } from 'react-helmet-async';

test('renders navbar brand name Girasole', () => {
  // CORREZIONE 1: Avvolgiamo App nei Provider necessari, esattamente come in index.js
  render(
    <StoreProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StoreProvider>,
  );

  // CORREZIONE 2: Cerchiamo il nome del tuo negozio anziché il vecchio link di React
  const brandElement = screen.getByText(/Girasole/i);
  expect(brandElement).toBeInTheDocument();
});
