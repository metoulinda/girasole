import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import AlertBox from '../components/AlertBox';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  // OTTIMIZZAZIONE: Estraiamo anche cartItems dallo stato globale
  const {
    userInfo,
    cart: { cartItems },
  } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      AlertBox('Passwords do not match');
      return;
    }

    try {
      // Modificato l'endpoint per passare anche il carrello locale al momento della creazione account
      const { data } = await axios.post('/api/users/signup', {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        cartItems, // Invia i prodotti accumulati da anonimo per salvarli subito nel DB
      });

      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect);
    } catch (err) {
      AlertBox(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="small-container bg-info-subtle text-dark ms-auto me-auto p-4 rounded shadow-sm my-4">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>

      <h1 className="my-3">Sign Up</h1>

      <form onSubmit={submitHandler}>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="firstName" className="form-label mt-2">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              className="form-control"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label mt-2">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              className="form-control"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="name@example.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="phoneNumber" className="form-label">
            Phone number
          </label>
          <input
            type="tel"
            className="form-control"
            id="phoneNumber"
            placeholder="+39 333 1234567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <button
            className="mt-4 btn btn-primary text-white fw-bold"
            type="submit"
          >
            Sign Up
          </button>
          <div className="mb-3 mt-4">
            Already have an account?{' '}
            <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
