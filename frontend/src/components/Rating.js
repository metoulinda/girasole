import React from 'react';

export default function Rating(props) {
  const { rating, numReviews, caption } = props;

  return (
    <div className="rating d-flex align-items-center">
      {/* Generazione dinamica delle 5 stelle per evitare codice ripetitivo */}
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index} className="text-warning me-1">
          <i
            className={
              rating >= index
                ? 'fas fa-star'
                : rating >= index - 0.5
                  ? 'fas fa-star-half-alt'
                  : 'far fa-star'
            }
          />
        </span>
      ))}

      {/* Spaziatura corretta per il testo delle recensioni */}
      <span className="ms-2 text-muted">
        {caption ? caption : `${numReviews || 0} reviews`}
      </span>
    </div>
  );
}
