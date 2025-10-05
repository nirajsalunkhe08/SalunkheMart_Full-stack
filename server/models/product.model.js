import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  image: {
    type: [String],
    default: [],
  },

  categoryId: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
  ],

  sub_categoryId: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
  ],

  unit: {
    type: String,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    required: true,
  },

  discount: {
    type: Number,
    default: 0,
  },

  description: {
    type: String,
  },
  publish: {
    type: Boolean,
    default: false,
  },
},
{ timestamps: true });

productSchema.index({
  name:"text",
  description:"text"
},{
  name:10,
  description:5
})
const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;
