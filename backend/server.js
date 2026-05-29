import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Middleware per convertire il corpo delle richieste POST/PUT in oggetti JSON dentro req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrazione dei Router per gli endpoint API
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

// Gestore centralizzato degli errori di Express (intercetta gli errori di express-async-handler)
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

// Connessione a MongoDB e avvio del server controllato
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');

    // OTTIMIZZAZIONE: Il server si mette in ascolto solo se il database è effettivamente connesso
    app.listen(port, () => {
      console.log(`Server executing at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection error fatale:');
    console.error(err.message);
    process.exit(1); // Interrompe il processo Node per evitare che il server giri "a vuoto" senza DB
  });
