import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: {},
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

    // OTTIMIZZAZIONE 1: Generazione sicura del payload per mantenere aggiornato il localStorage nel browser
    const updatedCartItems = existItem
      ? cart.cartItems.map((item) =>
          item._id === existItem._id ? { ...product, quantity } : item,
        )
      : [...cart.cartItems, { ...product, quantity }];

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
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

    // Assicura la persistenza immediata anche da questa vista
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    navigate('/cart');
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <div className="row align-items-start mt-4">
        {/* Colonna Immagine */}
        <div className="col-md-6 mb-3">
          <img
            className="img-fluid rounded shadow-sm"
            src={product.image}
            alt={product.name}
          />
        </div>

        {/* Colonna Dettagli */}
        <div className="col-md-3 mb-3">
          <div className="card border-0">
            <ul className="list-group list-group-flush">
              <li className="list-group-item ps-0">
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <h1 className="fs-2 fw-bold">{product.name}</h1>
              </li>
              <li className="list-group-item ps-0">
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                />
              </li>
              <li className="list-group-item ps-0 fw-bold fs-5 text-dark">
                {/* OTTIMIZZAZIONE 2: Gestione dei decimali per i prezzi */}
                Price: €{Number(product.price).toFixed(2)}
              </li>
              <li className="list-group-item ps-0">
                <span className="fw-bold">Description:</span>
                <p className="text-muted mt-1">{product.description}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Colonna Azioni / Carrello */}
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0">
                  <div className="row">
                    <div className="col">Price:</div>
                    {/* OTTIMIZZAZIONE 3: Gestione dei decimali per il riepilogo del blocco laterale */}
                    <div className="col fw-bold text-primary">
                      €{Number(product.price).toFixed(2)}
                    </div>
                  </div>
                </li>
                <li className="list-group-item px-0">
                  <div className="row align-items-center">
                    <div className="col">Status:</div>
                    <div className="col">
                      {product.countInStock > 0 ? (
                        <span className="badge bg-success">In Stock</span>
                      ) : (
                        <span className="badge bg-danger">Unavailable</span>
                      )}
                    </div>
                  </div>
                </li>
                {product.countInStock > 0 && (
                  <li className="list-group-item px-0 border-0">
                    <div className="d-grid mt-2">
                      <button
                        onClick={addToCartHandler}
                        className="btn btn-primary text-white py-2 fw-bold"
                        type="button"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
