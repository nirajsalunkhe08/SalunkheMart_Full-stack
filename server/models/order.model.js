import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },

  orderId: {
    type: String,
    required: true,
    unique: true
  },

  product_details: [{
    productId: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    priceAtPurchase: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: [{ type: String, required: true }]
}],

  payment_id: {
    type: String,
    default: ""   // COD won’t always have payment_id
  },

  payment_status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED", "CASH ON DELIVERY","PAID","paid"],
    default: "CASH ON DELIVERY"
  },

  delivery_address: {
    type: mongoose.Schema.ObjectId,
    ref: "address", 
    required: true
  },

  delivery_status: {
    type: String,
    enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING"
  },

  subTotalAmt: {
    type: Number,
    required: true,
    default: 0
  },

  totalAmt: {
    type: Number,
    required: true,
    default: 0
  },

  invoice_receipt: {
    type: String
  }

}, { timestamps: true });

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
