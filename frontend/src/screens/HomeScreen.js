//import data from '../data';
import { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Girasole</title>
      </Helmet>
      <h1 className="my-3">Featured Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="row">
            {/* CORREZIONE DI SICUREZZA: Aggiunto il controllo && e Array.isArray per evitare crash se products non è definito */}
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <div
                  className="col-sm-6 col-md-4 col-lg-3 mb-4"
                  key={product.slug}
                >
                  <Product product={product}></Product>
                </div>
              ))
            ) : (
              <MessageBox variant="info">No products found.</MessageBox>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
