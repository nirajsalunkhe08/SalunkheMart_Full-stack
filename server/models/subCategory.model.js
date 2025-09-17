import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    
    trim: true,
  },

  image: {
    type: String,
    default: "",
  },

  categoryId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
    },
  ],
}, { timestamps: true });

const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema); // 🔥 Capital 'S'
export default SubCategoryModel;
