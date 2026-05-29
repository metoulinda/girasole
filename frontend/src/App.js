import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { useContext } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';

import 'bootstrap/dist/css/bootstrap.min.css';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const singnoutHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container min-vh-100">
        <header>
          <nav className="navbar navbar-expand-lg bg-primary navbar-dark shadow-sm">
            <div className="container-fluid px-5">
              <Link className="navbar-brand fw-bold" to="/">
                Girasole
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ms-auto me-auto mb-2 mb-lg-0 align-items-center">
                  <li className="nav-item dropdown me-2">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      All categories
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="/">
                          Action
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/">
                          Another action
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/">
                          Something else here
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <form className="d-flex" role="search">
                      <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                      />
                      <button className="btn btn-outline-light" type="submit">
                        Search
                      </button>
                    </form>
                  </li>
                </ul>

                {/* Blocco Utente Autenticato / Login */}
                <div className="me-3 mb-2 mb-lg-0">
                  {userInfo ? (
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Hi! {userInfo.name}
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <Link className="dropdown-item" to="/profile">
                            User Profile
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/orderhistory">
                            Order History
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#signout"
                            onClick={singnoutHandler}
                          >
                            Sign Out
                          </a>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <Link className="btn btn-outline-light" to="/signin">
                      Sign In
                    </Link>
                  )}
                </div>

                {/* Carrello */}
                <Link to="/cart" className="btn btn-dark position-relative">
                  Cart{' '}
                  <i className="fas fa-shopping-cart text-white-50 ms-1"></i>
                  {cart.cartItems.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* CONTENUTO PRINCIPALE */}
        <main className="flex-grow-1 container">
          <div className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              {/* AGGIUNTA: Nuova rotta per la schermata finale di inoltro ordine */}
            </Routes>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="bg-dark text-white py-3 mt-auto">
          <div className="text-center">All rights reserved</div>
        </footer>

        {/* MODALE DI ALERT GLOBALE COMPLETATA */}
        <div
          className="modal fade"
          id="mioAlertModal"
          tabIndex="-1"
          aria-labelledby="modalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                {/* CORREZIONE: Sistemata la sintassi corretta dell'id su h5 */}
                <h5 className="modal-title" id="modalLabel">
                  Attenzione
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Chiudi"
                ></button>
              </div>
              {/* CORREZIONE: Tag richiusi correttamente con l'id per la manipolazione di AlertBox */}
              <div className="modal-body" id="modalTesto">
                Testo del tuo messaggio personalizzato qui.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary text-white"
                  data-bs-dismiss="modal"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
