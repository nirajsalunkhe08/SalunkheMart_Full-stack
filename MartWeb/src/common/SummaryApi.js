export const baseURL =import.meta.env.VITE_BACKEND_URL

const SummaryApi={
    register:{
        url:'/api/user/register',
        method:'post'
    },
    login:{
        url:'/api/user/login',
        method:'post'
    },
    forgot_password:{
        url:'/api/user/forgot-password',
        method:'put'
    },
    forgot_password_otp_verification:{
        url:'/api/user/verify-forgot-password-otp',
        method:'put'

    },
    resetPassword:{
        url:'/api/user/reset-password',
        method:'put'

    },
    userDetails:{
        url:'/api/user/user-details',
        method:"get"
    },
    refreshToken:{
        url:'/api/user/refresh-token',
        method:"post"
    },
    logout:{
        url:'/api/user/logout',
        method:"get"
        
    },
    updateUserdetails:{
        url:'/api/user/update-user',
        method:"put"
    },
    addCategory:{
        url:"/api/category/add-category",
        method:"post"
    },
    uploadImage:{
        url:'/api/file/upload',
        method:"post"

    },
    getCategory:{
        url:"/api/category/get",
        method:"get"
    },
    updateCategory:{
        url:"/api/category/update",
        method:"put"
    },
    deleteCategory:{
        url:"/api/category/delete",
        method:"delete"

    },
    createSubCategory:{
        url:"/api/subcategory/create",
        method:"post"
    },
    getSubCategory:{
        url:"/api/subcategory/get",
        method:"post"
    },
     updateSubCategory : {
        url : '/api/subcategory/update',
        method : 'put'
    },
    deleteSubCategory : {
        url : '/api/subcategory/delete',
        method : 'delete'
    },
    createProduct:{
        url:"/api/product/create",
        method:"post"
    },
    getProduct:{
        url:"/api/product/get",
        method:"post"
    },
    getProductByCategory:{
        url:"/api/product/get-product-by-category",
        method:"post"
    },
    getProductByCategoryAndSubCategory:{
        url:"/api/product/get-product-by-category-and-subcategory",
        method:"post"
    },
    getProductDetails:{
        url:"/api/product/get-product-detail",
        method:"post"
    },
    updateProductDetails:{
       url:"/api/product/update-product-details",
       method:"put" 
    },
    deleteProduct:{
        url:"/api/product/delete-product",
        method:"delete"
    },
    searchproduct:{
        url:"/api/product/search-product",
        method:"post"
    },
     addTOcart:{
        url:"/api/cart/create",
        method:"post"
     },
     getCartItem:{
        url:"/api/cart/get-item",
        method:"get"
     },
     updateCartItem:{
        url:"/api/cart/update-qty",
        method:"put"
     },
     deleteCartItem:{
        url:"/api/cart/delete-cart-item",
        method:"delete"
     },
      clearCart: {
        url: "/api/cart/clear-cart",
        method: "delete"
    },
     createAddress:{
        url:"/api/address/create",
        method:"post"
     },
     getAddress:{
        url:"/api/address/get",
        method:"get"
     },
     updateAddress:{
        url:"api/address/update",
        method:"put"
     },
     deleteAddress:{
        url:"/api/address/delete",
        method:"delete"
     },
     CashOnDeliveryOrderController:{
        url:"/api/order/cash-on-delivery",
        method:"post"

     },
     payment_url:{
        url:"/api/order/checkout",
        method:"post"
     },
     getOrderItems:{
        url:"/api/order/order-list",
        method:"get"
     },
        generateOrderInvoice:{
        url:"/api/order/generate-invoice/:orderId",
        method:"get"
     },
        getOrderBySessionId:{
        url:"/api/order/session/:sessionId",
        method:"get"
     },



}
export default SummaryApi 