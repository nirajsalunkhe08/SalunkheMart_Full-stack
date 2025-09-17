import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address_line: {
    type: String,
    required: true,
    trim: true
  },

  city: {
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true
  },

  pincode: {
    type: String,
    required: true
  },

  country: {
    type: String,
    required: true
  },

  mobile: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    defaultL:"",
    
  },
  status:{
    type:Boolean,
    default:true
  }

}, { timestamps: true });

const AddressModel = mongoose.model("address", addressSchema);
export default  AddressModel
