// Rimosso l'import di bcrypt da qui per evitare conflitti e doppie cifrature
const data = {
  users: [
    {
      firstName: 'joyce',
      lastName: 'mb',
      email: 'joyce@gmail.com',
      phoneNumber: '3245697852', // CORREZIONE 1: Convertito in Stringa
      password: '123456', // CORREZIONE 2: Lasciata in chiaro (verrà cifrata dal seedRouter)
      isAdmin: true,
      cartItems: [],
      shippingAddress: {
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
      },
    },
    {
      firstName: 'gaby',
      lastName: 'th',
      email: 'gaby@gmail.com',
      phoneNumber: '3569784596', // CORREZIONE 1: Convertito in Stringa
      password: '123456', // CORREZIONE 2: Lasciata in chiaro
      isAdmin: false, // CORREZIONE 3: Esplicitato il valore false per l'utente non-admin
      cartItems: [],
      shippingAddress: {
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
      },
    },
  ],

  products: [
    {
      name: 'Product1',
      slug: 'product1-prp',
      category: 'Shirts',
      image: '/images/p1.jpg.webp',
      price: 125,
      countInStock: 10,
      brand: 'nike',
      rating: 4.2,
      numReviews: 16,
      description: 'product1 in stock',
    },
    {
      name: 'Product2',
      slug: 'product2-prp',
      category: 'Shirts',
      image: '/images/p1.jpg.webp',
      price: 125,
      countInStock: 0,
      brand: 'nike',
      rating: 4.5,
      numReviews: 10,
      description: 'product2 in stock',
    },
    {
      name: 'Product3',
      slug: 'product3-prp',
      category: 'Shirts',
      image: '/images/p1.jpg.webp',
      price: 125,
      countInStock: 40,
      brand: 'nike',
      rating: 0.2,
      numReviews: 12,
      description: 'product3 in stock',
    },
    {
      name: 'Product4',
      slug: 'product4-prp',
      category: 'Shirts',
      image: '/images/p1.jpg.webp',
      price: 125,
      countInStock: 30,
      brand: 'nike',
      rating: 3,
      numReviews: 10,
      description: 'product4 in stock',
    },
    {
      name: 'Product5',
      slug: 'product5-prp',
      category: 'Shirts',
      image: '/images/p2.jpg.webp',
      price: 125,
      countInStock: 1,
      brand: 'nike',
      rating: 1.6,
      numReviews: 3,
      description: 'product5 in stock',
    },
  ],
};

export default data;
