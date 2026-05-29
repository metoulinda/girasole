import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // CORREZIONE 1: Il numero di telefono deve essere una Stringa, non un Numero
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },

    cartItems: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    // UTILITY 2: Oggetto per salvare l'indirizzo di spedizione dell'utente
    shippingAddress: {
      fullName: { type: String },
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  {
    timestamps: true, // Crea automaticamente i campi createdAt e updatedAt nel database
  },
);

// CORREZIONE 2: Previene l'errore OverwriteModelError durante i riavvii del server in sviluppo
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
