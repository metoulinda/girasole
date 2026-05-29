import React from 'react';

function LoadingBox() {
  return (
    /* OTTIMIZZAZIONE: Contenitore per centrare lo spinner verticalmente e orizzontalmente */
    <div className="d-flex justify-content-center align-items-center my-5 w-100">
      {/* CORREZIONE: Cambiato 'class' in 'className' */}
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: '3rem', height: '3rem' }}
      >
        {/* CORREZIONE: Cambiato 'class' in 'className' */}
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingBox;
