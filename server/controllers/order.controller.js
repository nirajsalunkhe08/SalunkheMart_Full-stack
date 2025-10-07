import mongoose from "mongoose"
import Stripe from "stripe";
import OrderModel from "../models/order.model.js"
import UserModel from "../models/user.model.js"
import CartProductModel from "../models/cartProduct.model.js"
import asyncHandler from 'express-async-handler';
import pdf from 'pdf-creator-node';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

// This is the modern way to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function CashOnDeliveryOrderController(request, response) {
    try {
        const userId = request.userId;
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

        // 1. Map the cart items to the format needed for the order's 'items' array
        const orderItems = list_items.map(item => {
            return {
                productId: item.productId._id,
                name: item.productId.name,
                priceAtPurchase: item.productId.price, // Or discounted price if you have it
                quantity: item.quantity,
                image: item.productId.image
            };
        });

        // 2. Create ONE single new order object
        const newOrder = new OrderModel({
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            product_details: orderItems, // Add the array of items here
            payment_id: "",
            payment_status: "CASH ON DELIVERY",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
        });

        // 3. Save the single order
        const savedOrder = await newOrder.save();
        const populatedOrder = await OrderModel.findById(savedOrder._id)
                                    .populate('delivery_address'); 

// This log shows us exactly what is being sent
console.log("--- FINAL ORDER OBJECT BEING SENT TO FRONTEND ---");
console.log(JSON.stringify(populatedOrder, null, 2));
        // 4. Clear the user's cart
        await CartProductModel.deleteMany({ userId: userId });
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

        // 5. Return the single saved order object
        return response.json({
            message: "Order placed successfully",
            error: false,
            success: true,
            data: populatedOrder 
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
export async function paymentController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const user = await UserModel.findById(userId)

        const line_items  = list_items.map(item =>{
            return{
               price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100   
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    payment_id,
    payment_status,
 })=>{
    const productList = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await stripe.products.retrieve(item.price.product)

            const paylod = {
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : product.metadata.productId, 
                product_details : {
                    name : product.name,
                    image : product.images
                } ,
                payment_id: payment_id,
                payment_status : payment_status,
                delivery_address : addressId,
                subTotalAmt  : Number(item.amount_total / 100),
                totalAmt  :  Number(item.amount_total / 100),
            }

            productList.push(paylod)
        }
    }

    return productList
}
// Add this entire function to your order.controller.js file

export async function getOrderBySessionId(request, response) {
  try {
    const { sessionId } = request.params;
    
    // Get the session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Find the order in your database using the payment_intent ID from the session
    const order = await OrderModel.findOne({ payment_id: session.payment_intent })
                                .populate('delivery_address');

    if (order) {
      return response.json({
        success: true,
        data: order
      });
    } else {
      return response.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
}
//http://localhost:7878/api/order/webhook
// In controllers/order.controller.js

// In controllers/order.controller.js

// In controllers/order.controller.js

export async function webhookStripe(request, response) {
  try {
    const event = request.body;
    
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        const userId = session.metadata?.userId;
        const addressId = session.metadata?.addressId;

        if (!userId || !addressId) {
          throw new Error("Webhook Error: Missing userId or addressId in session metadata");
        }

        const orderItems = await Promise.all(lineItems.data.map(async (item) => {
            const product = await stripe.products.retrieve(item.price.product);
            if (!product.metadata.productId) {
                throw new Error(`Webhook Error: Product in Stripe (ID: ${product.id}) is missing the 'productId' in its metadata.`);
            }
            return {
                productId: product.metadata.productId,
                name: product.name,
                priceAtPurchase: item.price.unit_amount / 100,
                quantity: item.quantity,
                image: product.images
            };
        }));
        
        const newOrder = new OrderModel({
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            product_details: orderItems,
            payment_id: session.payment_intent,
            payment_status: "PAID",
            delivery_address: addressId,
            totalAmt: session.amount_total / 100,
            subTotalAmt: session.amount_subtotal / 100,
        });

        await newOrder.save();

        await CartProductModel.deleteMany({ userId: userId });
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
        
        break;
      }
      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }

    response.json({ received: true });
  } catch (err) {
    console.error("--- ❌ WEBHOOK FAILED ---", err);
    response.status(500).send(`Webhook Error: ${err.message}`);
  }
}
export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId // order id

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}



// Paste this entire function into your controllers/order.controller.js file

const generateOrderInvoice = asyncHandler(async (req, res) => {
  // We are adding logs to every step to find the problem
  console.log("✅ 1. API endpoint /generate-invoice/:orderId was hit.");
  console.log("✅    - Order ID from URL:", req.params.orderId);

  try {
    const order = await OrderModel.findById(req.params.orderId)
      .populate('userId', 'name email')
      .populate('delivery_address');

    console.log("✅ 2. Fetched order from database.");

    if (order) {
      console.log("✅ 3. Order was found. Checking for required data...");
      
      // Check if the populated data exists
      if (!order.user || !order.delivery_address || !order.product_details) {
          console.error("❌ CRITICAL ERROR: Populated data is missing from the order object!");
          console.error({ 
              user: order.user ? 'OK' : 'MISSING', 
              address: order.delivery_address ? 'OK' : 'MISSING', 
              product: order.product_details ? 'OK' : 'MISSING'
          });
          throw new Error("Missing critical data to generate the invoice. User, address, or product details are null.");
      }
      
      console.log("✅ 4. All data is present. Reading HTML template...");
      const templatePath = path.join(__dirname, '../templates/invoice.html');
      const html = fs.readFileSync(templatePath, 'utf8');

      console.log("✅ 5. Preparing data for PDF template...");
      const documentData = {
        invoiceNumber: `INV-${order.orderId.slice(-6).toUpperCase()}`,
        orderId: order.orderId,
        orderDate: order.createdAt.toLocaleDateString(),
        customerName: order.user.name,
        shippingAddress: order.delivery_address,
        items: [{
          name: order.product_details.name,
          quantity: 1,
          priceAtPurchase: order.totalAmt,
          total: order.totalAmt,
        }],
        totalAmount: order.totalAmt,
      };
      
      const document = { html, data: documentData, path: './output.pdf', type: 'buffer' };
      
      console.log("✅ 6. Creating PDF buffer...");
      const pdfBuffer = await pdf.create(document, { format: 'A4', orientation: 'portrait', border: '10mm' });
      
      console.log("✅ 7. PDF created successfully! Sending file to client...");
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderId}.pdf`);
      res.send(pdfBuffer);

    } else {
      console.error("❌ ERROR: Order not found in database for ID:", req.params.orderId);
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
      console.error("--- ❌ INVOICE GENERATION FAILED ---");
      console.error(error); // This will print the exact, detailed error to your terminal
      res.status(500).send("Error generating invoice. Check server logs for details.");
  }
});

// Make sure this export exists at the end of your file
export { generateOrderInvoice };