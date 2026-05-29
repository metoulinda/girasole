import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import AlertBox from '../components/AlertBox';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/signin', {
        email,
        password,
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
        <title>Sign In Page</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <form className="mb-3" onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label mt-2">
            Email address
          </label>
          <input
            type="email"
            className="form-control bg-warning-subtle"
            id="email"
            placeholder="name@example.com"
            value={
              email
            } /* CORREZIONE: Agganciato il valore allo stato email */
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>

        <div className="mb-3 mt-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control bg-warning-subtle"
            placeholder="Password"
            value={
              password
            } /* CORREZIONE: Agganciato il valore allo stato password */
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <button className="mt-4 btn btn-primary text-white" type="submit">
            Sign In
          </button>
          <div className="mb-3 mt-4">
            New customer?{' '}
            <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
