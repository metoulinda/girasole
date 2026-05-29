import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    brand: { type: String, required: true },
    // OTTIMIZZAZIONE 1: Aggiunto un valore predefinito a 0 per evitare valori undefined o null nel catalogo
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
  },
  {
    timestamps: true, // Aggiunge automaticamente i campi createdAt e updatedAt nel database
  },
);

// CORREZIONE CRITICA: Verifica se il modello esiste già per prevenire l'OverwriteModelError nei riavvii del server
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
