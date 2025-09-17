import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import emailRouter from './route/email.route.js';
import categoryRouter from './route/category.router.js';
import uploadRouter from './route/upload.route.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';

const app = express();

// ✅ CORS setup
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": [
          "'self'",
          "https://js.stripe.com",
          "https://m.stripe.network",
          "'sha256-e357n1PxCJ8d03/QCSKaHFmHF1JADyvSHdSfshxM494='",
          "'sha256-5DA+a07wxWmEka9IdoWjSPVHb17Cp5284/lJzfbl8KA='",
          "'sha256-/5Guo2nzv5n/w6ukZpOBZOtTJBJPSkJ6mhHpnBgm3Ls='",
          "blob:" // allow Stripe blob scripts
        ],
        "script-src-elem": [
          "'self'",
          "https://js.stripe.com",
          "https://m.stripe.network",
          "blob:"
        ]
      }
    }
  })
);


const PORT = process.env.PORT || 7878;

app.get("/", (req, res) => {
  res.json({ message: "Server is running on port " + PORT });
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/file', uploadRouter);
app.use('/api/subcategory', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/email', emailRouter);

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});
