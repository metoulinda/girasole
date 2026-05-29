import React, { useContext, useEffect, useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setpaymentMethod] = useState(
    paymentMethod || 'PayPal',
  );

  useEffect(() => {
    if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  if (!shippingAddress || !shippingAddress.address) {
    return null;
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>

      {/* OTTIMIZZAZIONE STILE: Aggiunte le classi per racchiudere il form in una scheda azzurra coerente */}
      <div className="small-container bg-info-subtle text-dark ms-auto me-auto p-4 rounded shadow-sm my-4">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <form onSubmit={submitHandler}>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="PayPal"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setpaymentMethod(e.target.value)}
            />
            <label className="form-check-label ps-2" htmlFor="PayPal">
              PayPal
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setpaymentMethod(e.target.value)}
            />
            <label className="form-check-label ps-2" htmlFor="Stripe">
              Stripe
            </label>
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary text-white fw-bold"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
