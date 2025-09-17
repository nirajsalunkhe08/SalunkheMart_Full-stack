import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide Name"],
    trim: true
  },

  email: {
    type: String,
    required: [true, "Provide Email"],
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: [true, "Provide Password"],
  },

  avatar: {
    type: String,
    default: ""
  },

  mobile: {
    type: String
  },

  refresh_token: {
    type: String
  },

  verify_email: {
    type: Boolean,
    default: false
  },

  last_login_date: {
    type: Date
  },

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE", "BANNED"],
    default: "ACTIVE"
  },

  address_details: [{
    type: mongoose.Schema.ObjectId,
    ref: "Address"
  }],

  shopping_cart: [{
    type: mongoose.Schema.ObjectId,
    ref: "CartProduct"
  }],

  orderHistory: [{
    type: mongoose.Schema.ObjectId,
    ref: "Order"
  }],

  forgot_password_otp: {
    type: String
  },

  forgot_password_expiry: {
    type: Date
  },

  role: {
    type: String,
    enum: ["USER", "ADMIN", "SELLER"],
    default: "USER"
  }

}, { timestamps: true }); 

const UserModel =mongoose.model("user", userSchema);
export default UserModel
