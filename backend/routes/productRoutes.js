import express from 'express';
import expressAsyncHandler from 'express-async-handler'; // Importato per proteggere le rotte
import Product from '../models/productModel.js';

const productRouter = express.Router();

// 1. Endpoint per recuperare tutti i prodotti (usato in HomeScreen)
productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  }),
);

// 2. Endpoint per recuperare il prodotto tramite lo slug (usato in ProductScreen)
productRouter.get(
  '/slug/:slug',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  }),
);

// 3. Endpoint per recuperare il prodotto tramite ID (usato nei controlli del Carrello)
productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    // Il try-catch interno gestisce l'errore specifico se viene passato un ID MongoDB malformato
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.send(product);
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    } catch (error) {
      // Se l'ID non rispetta il formato a 24 caratteri, restituisce un 404 pulito anziché mandare in crash Express
      res.status(404).send({ message: 'Invalid Product ID Format' });
    }
  }),
);

export default productRouter;
