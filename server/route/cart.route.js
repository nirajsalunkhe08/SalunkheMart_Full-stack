import {Router} from "express"
import auth from "../middleware/auth.js"
import {addToCartItemController,
    getCartItemController,
    updateCartItemQtyController,
    deleteCartItemQtyController,
    clearCartController
}
 from "../controllers/cart.controller.js"
const cartRouter = Router()
cartRouter.post('/create',auth,addToCartItemController)
cartRouter.get('/get-item',auth,getCartItemController)
cartRouter.put('/update-qty',auth,updateCartItemQtyController)
cartRouter.delete("/delete-cart-item",auth,deleteCartItemQtyController)
cartRouter.delete("/clear-cart",auth,clearCartController)
export default cartRouter