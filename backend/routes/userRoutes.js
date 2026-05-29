import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken, isAuth } from '../utils.js';

const userRouter = express.Router();

// LOGIN (SIGN IN) - Invia al frontend anche il carrello e l'indirizzo salvati sul DB
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isAdmin: user.isAdmin,
          // Inviamo i dati storici salvati (se non esistono, restituisce un oggetto/array vuoto)
          cartItems: user.cartItems || [],
          shippingAddress: user.shippingAddress || {},
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  }),
);

// REGISTRAZIONE (SIGN UP)
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      res.status(400).send({ message: 'Email already exists' });
      return;
    }

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: bcrypt.hashSync(req.body.password, 10),
      cartItems: req.body.cartItems || [],
      shippingAddress: {}, // Vuoto all'inizio
    });

    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      cartItems: [],
      shippingAddress: {},
      token: generateToken(user),
    });
  }),
);

// NUOVA ROTTA CENTRALIZZATA: Salva lo stato del Checkout nel Database (Protetto da isAuth)
userRouter.put(
  '/checkout-data',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      // Sovrascrive sul database solo i campi che il frontend sta effettivamente inviando
      if (req.body.cartItems) user.cartItems = req.body.cartItems;
      if (req.body.shippingAddress)
        user.shippingAddress = req.body.shippingAddress;

      await user.save();
      res.send({
        message: 'Dati di checkout sincronizzati nel database con successo!',
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }),
);

export default userRouter;
