import React from 'react';

export default function CheckoutSteps(props) {
  return (
    /* CORREZIONE 1: Sostituito 'class' con 'className' e aggiunta spaziatura */
    <div className="checkout-steps row g-0 mb-4 text-center fw-bold border-bottom pb-2">
      {/* Step 1: Sign-In */}
      <div
        className={`col-3 pb-2 ${
          props.step1
            ? 'text-primary border-bottom border-3 border-primary'
            : 'text-muted'
        }`}
      >
        <span className="d-none d-sm-inline">1. </span>Sign-In
      </div>

      {/* Step 2: Shipping */}
      <div
        className={`col-3 pb-2 ${
          props.step2
            ? 'text-primary border-bottom border-3 border-primary'
            : 'text-muted'
        }`}
      >
        <span className="d-none d-sm-inline">2. </span>Shipping
      </div>

      {/* Step 3: Payment */}
      <div
        className={`col-3 pb-2 ${
          props.step3
            ? 'text-primary border-bottom border-3 border-primary'
            : 'text-muted'
        }`}
      >
        <span className="d-none d-sm-inline">3. </span>Payment
      </div>

      {/* Step 4: Place Order */}
      <div
        className={`col-3 pb-2 ${
          props.step4
            ? 'text-primary border-bottom border-3 border-primary'
            : 'text-muted'
        }`}
      >
        <span className="d-none d-sm-inline">4. </span>Place Order
      </div>
    </div>
  );
}
