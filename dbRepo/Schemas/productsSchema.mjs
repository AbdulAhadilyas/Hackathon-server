import mongoose from "mongoose";

let productSchema = new mongoose.Schema({
  name: { type: String, },
  price: Number,
  description: String,
  createdOn: { type: Date, default: Date.now },
  unit: { type: String },
  category: { type: String,  },
  url: { type: String },
});

const productModel = mongoose.model("products", productSchema);
export default productModel;
