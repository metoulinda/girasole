import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod') // Rimosso il ternario ridondante
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id,
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item,
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id,
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'USER_SIGNIN': {
      // Recupera il carrello e l'indirizzo salvati nel database dell'utente
      const dbCartItems = action.payload.cartItems || [];
      const dbShippingAddress = action.payload.shippingAddress || {};

      // Salva entrambi i dati nel localStorage del browser per questa sessione
      localStorage.setItem('cartItems', JSON.stringify(dbCartItems));
      localStorage.setItem(
        'shippingAddress',
        JSON.stringify(dbShippingAddress),
      );

      return {
        ...state,
        userInfo: action.payload,
        cart: {
          ...state.cart,
          cartItems: dbCartItems, // Ripristina il carrello dal DB
          shippingAddress: dbShippingAddress, // RIPRISTINA L'INDIRIZZO DAL DB
        },
      };
    }

    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {}, // Azzera l'indirizzo nello stato globale al logout
          paymentMethod: '',
        },
      };

    case 'SAVE_SHIPPING_ADDRESS':
      // CORREZIONE 1: Aggiunto ...state.cart per evitare di sovrascrivere/perdere i cartItems
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };

    case 'SAVE_PAYMENT_METHOD':
      // CORREZIONE 2: Aggiunto ...state.cart per evitare di sovrascrivere/perdere i cartItems e lo shippingAddress
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };

    // Aggiungi questo caso per svuotare il carrello dopo che l'ordine è stato inviato con successo al database
    case 'CART_CLEAR':
      localStorage.removeItem('cartItems');
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
