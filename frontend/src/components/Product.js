import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    // CORREZIONE 1: Estraiamo anche userInfo per poter dialogare con il backend
    cart: { cartItems },
    userInfo,
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

    // Generiamo l'array aggiornato per il localStorage e per il database
    const updatedCartItems = existItem
      ? cartItems.map((x) => (x._id === item._id ? { ...item, quantity } : x))
      : [...cartItems, { ...item, quantity }];

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });

    // Salva localmente sul browser
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    // CORREZIONE CRITICA: Se l'utente è loggato, salviamo le modifiche direttamente sul database remoto
    if (userInfo) {
      try {
        await axios.put(
          '/api/users/checkout-data',
          { cartItems: updatedCartItems },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
      } catch (err) {
        console.error('Errore nel salvataggio del carrello dalla Home:', err);
      }
    }
  };

  return (
    <div className="card h-100 shadow-sm">
      <Link to={`/product/${product.slug}`}>
        <img className="card-img-top" src={product.image} alt={product.name} />
      </Link>
      <div className="card-body d-flex flex-column">
        <Link
          to={`/product/${product.slug}`}
          className="text-decoration-none text-dark"
        >
          <h5 className="card-title text-truncate">{product.name}</h5>
        </Link>

        <div className="mb-2">
          <Rating rating={product.rating} numReviews={product.numReviews} />
        </div>

        <p className="card-text fw-bold fs-5 mb-3">
          €{Number(product.price).toFixed(2)}
        </p>

        <div className="mt-auto d-grid">
          {product.countInStock === 0 ? (
            <button
              className="btn btn-secondary text-white"
              type="button"
              disabled
            >
              Out of stock
            </button>
          ) : (
            <button
              onClick={() => addToCartHandler(product)}
              className="btn btn-primary text-white"
              type="button"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
