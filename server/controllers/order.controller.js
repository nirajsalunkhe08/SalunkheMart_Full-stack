import mongoose from "mongoose"
import Stripe from "stripe";
import OrderModel from "../models/order.model.js"
import UserModel from "../models/user.model.js"
import CartProductModel from "../models/cartProduct.model.js"
export async function CashOnDeliveryOrderController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 
const payload = list_items.map(el => {
    return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id, 
        product_details: {
            name: el.productId.name,    
            image: el.productId.image   
        },
        payment_id: "",                 
        payment_status: "CASH ON DELIVERY", 
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
    };
});


        const generatedOrder = await OrderModel.insertMany(payload)

        ///remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId : userId })
        const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

        return response.json({
            message : "Order successfully",
            error : false,
            success : true,
            data : generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
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
            success_url : `${process.env.FRONTED_URL}/order-success`,
            cancel_url : `${process.env.FRONTED_URL}/cancel`
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

//http://localhost:7878/api/order/webhook
export async function webhookStripe(request, response) {
  try {
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRETE_KEY;

    console.log("🔔 Webhook received:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("✅ Checkout session:", session);

        // Fetch purchased items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        console.log("🛒 Line items:", lineItems);

        const userId = session.metadata?.userId;
        const addressId = session.metadata?.addressId;

        if (!userId || !addressId) {
          throw new Error("❌ Missing userId or addressId in session.metadata");
        }

        // Prepare order data
        const orderProduct = await getOrderProductItems({
          lineItems,
          userId,
          addressId,
            payment_id: session.payment_intent,
          payment_status: session.payment_status,
        });

        console.log("📦 Order product data:", orderProduct);

        // Save order
        const order = await OrderModel.insertMany(orderProduct);
        console.log("✅ Order saved:", order);

        if (order.length > 0) {
          await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
          await CartProductModel.deleteMany({ userId });
          console.log("🧹 Cart cleared for user:", userId);
        }
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    response.json({ received: true });
  } catch (err) {
    console.error("🔥 Webhook error:", err);
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



