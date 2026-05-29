import express from 'express';
import bcrypt from 'bcryptjs'; // Importato per crittografare le password degli utenti seed
import expressAsyncHandler from 'express-async-handler'; // Importato per prevenire crash asincroni
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import data from '../data.js';

const seedRouter = express.Router();

// Avvolto l'endpoint con expressAsyncHandler per intercettare errori di connessione al database
seedRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    // 1. Gestione Prodotti
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(data.products);

    // 2. Gestione Utenti
    await User.deleteMany({});

    // CORREZIONE CRITICA: Cifriamo le password degli utenti di test prima di inserirli nel database
    const secureUsers = data.users.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    }));

    const createdUsers = await User.insertMany(secureUsers);

    // 3. Risposta al client
    res.send({ createdProducts, createdUsers });
  }),
);

export default seedRouter;
