import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems, userInfo },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

    const updatedCartItems = cartItems.map((x) =>
      x._id === item._id ? { ...item, quantity } : x,
    );

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    if (userInfo) {
      try {
        await axios.put(
          '/api/users/checkout-data',
          { cartItems: updatedCartItems }, // Inviamo solo il carrello aggiornato
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
      } catch (err) {
        console.error('Errore nel salvataggio del carrello sul server:', err);
      }
    }
  };

  const removeItemHandler = async (item) => {
    const updatedCartItems = cartItems.filter((x) => x._id !== item._id);

    ctxDispatch({
      type: 'CART_REMOVE_ITEM',
      payload: item,
    });
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    if (userInfo) {
      try {
        await axios.put(
          '/api/users/checkout-data',
          { cartItems: updatedCartItems }, // Inviamo solo il carrello aggiornato
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
      } catch (err) {
        console.error('Errore nel salvataggio del carrello sul server:', err);
      }
    }
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="my-3">Shopping Cart</h1>
      <div className="row">
        <div className="col-md-8">
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty! <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ul className="list-group">
              {cartItems.map((item) => (
                <li className="list-group-item" key={item._id}>
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail me-2"
                        style={{ maxWidth: '80px' }}
                      />
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </div>
                    <div className="col-md-3">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </button>
                    </div>

                    <div className="col-md-3 fw-bold">€{item.price}</div>
                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-light text-danger"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-md-4 mt-3 mt-md-0">
          <div className="card shadow-sm">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <h3>
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                  items):{' '}
                  <span className="text-primary">
                    {/* OTTIMIZZAZIONE: Aggiunto .toFixed(2) per bloccare i decimali a formato valuta reale */}
                    €
                    {cartItems
                      .reduce((a, c) => a + c.price * c.quantity, 0)
                      .toFixed(2)}
                  </span>
                </h3>
              </li>
              <li className="list-group-item">
                <div className="d-grid">
                  <button
                    className="btn btn-primary p-2 text-white"
                    type="button"
                    onClick={checkoutHandler}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
