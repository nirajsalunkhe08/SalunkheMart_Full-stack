import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import emailRouter from './route/email.route.js';
import categoryRouter from './route/category.router.js';
import uploadRouter from './route/upload.route.js';
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js'; 
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';

const app = express()
const allowedOrigins = [
  "http://localhost:5173", // for local dev
  "https://salunkhe-mart-full-stack-v491.vercel.app" // deployed frontend
];
app.use(express.json())
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({ crossOriginResourcePolicy: false 
}));
const PORT = 7878 || process.env.PORT

app.get("/",(request,response)=>{
      response.json({ message:"server is running" +PORT});

})
app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use("/api/order",orderRouter)


connectDB().then(()=>{
    app.listen(PORT,()=>{
    console.log("server is running "+PORT)})
})
app.use('/api/email', emailRouter);
