import {Router} from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController,
    paymentController,
    webhookStripe,
    getOrderDetailsController,
    generateOrderInvoice,
    getOrderBySessionId

}from '../controllers/order.controller.js'
const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post("/checkout",auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.get("/generate-invoice/:orderId",auth,generateOrderInvoice )
orderRouter.get("/session/:sessionId", auth, getOrderBySessionId)

export default orderRouter
             