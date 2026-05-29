// CORREZIONE CRITICA: Sistemato il percorso corretto per i fogli di stile di Bootstrap 5
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importato sotto Bootstrap così le tue personalizzazioni in index.css hanno la priorità
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from './Store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>,
);

// Se desideri monitorare le performance dell'app puoi passare una funzione (es: reportWebVitals(console.log))
reportWebVitals();
