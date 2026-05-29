import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress?.fullName || '');
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || '',
  );
  const [country, setCountry] = useState(shippingAddress?.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const addressPayload = {
      fullName,
      address,
      city,
      postalCode,
      country,
    };

    // 1. Aggiorna lo stato globale di React
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: addressPayload,
    });

    // 2. Aggiorna il localStorage del browser
    localStorage.setItem('shippingAddress', JSON.stringify(addressPayload));

    // 3. AGGIUNTA CRITICA: Salva l'indirizzo nel database dell'account utente
    try {
      await axios.put(
        '/api/users/checkout-data',
        { shippingAddress: addressPayload }, // Inviamo solo l'indirizzo
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
    } catch (err) {
      console.error("Errore nel salvataggio dell'indirizzo sul server:", err);
    }

    navigate('/payment');
  };

  if (!userInfo) {
    return null;
  }

  return (
    <div>
      {/* Visualizza gli step di checkout evidenziando Sign-In e Shipping */}
      <CheckoutSteps step1 step2></CheckoutSteps>

      {/* OTTIMIZZAZIONE: Allineato lo stile del contenitore a SigninScreen e SignupScreen */}
      <div className="small-container bg-info-subtle text-dark ms-auto me-auto p-4 rounded shadow-sm my-4">
        <Helmet>
          <title>Shipping Address</title>
        </Helmet>
        <h1 className="my-3">Shipping Address</h1>
        <form onSubmit={submitHandler}>
          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              placeholder="Enter your shipping name here"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Address */}
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              placeholder="Enter your address here"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* City */}
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="city"
              placeholder="Enter your city here"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          {/* Postal Code */}
          <div className="mb-3">
            <label htmlFor="postalCode" className="form-label">
              Postal Code
            </label>
            <input
              type="text"
              className="form-control"
              id="postalCode"
              placeholder="Enter your postal code here"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>

          {/* Country */}
          <div className="mb-3">
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <input
              type="text"
              className="form-control"
              id="country"
              placeholder="Enter your country here"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="mb-3">
            {/* CORREZIONE STILE: Aggiunto text-white per contrasto ottimale con il colore primario arancione */}
            <button className="btn btn-primary text-white" type="submit">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
