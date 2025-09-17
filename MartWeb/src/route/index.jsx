import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import SearchPage from "../pages/SearchPage.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import OtpVerification from "../pages/OtpVerification.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import UserMenuMobile from "../pages/UserMenuMobile.jsx";
import Dashboard from "../layout/Dashboard.jsx";
import Profile from "../pages/Profile.jsx";
import MyOrders from "../pages/MyOrders.jsx";
import Address from "../pages/Address.jsx";
import CategoryPage from '../pages/CategoryPage.jsx'
import SubCategoryPage from '../pages/SubCategoryPage.jsx'
import ProductAdmin from '../pages/ProductAdmin.jsx'
import UploadProduct from '../pages/UploadProduct.jsx'
import AdminPermission from "../layout/AdminPermission.jsx";
import ProductListPage from "../pages/ProductListPage.jsx";
import ProductDisplayPage from "../pages/ProductDisplayPage.jsx";
import CartMobile from "../pages/CartMobile.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import OrderSuccess from "../pages/OrderSuccess.jsx";
import Cancel from "../pages/Cancel.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verification-otp",
        element: <OtpVerification />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "user-menu-mobile",
        element: <UserMenuMobile />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "myorders",
            element: <MyOrders />,
          },
          {
            path: "address",
            element: <Address />,
          },
          {
            path:'category',
            element:<AdminPermission><CategoryPage/></AdminPermission>
          },
          {
            path:'sub-category',
            element:<AdminPermission><SubCategoryPage/></AdminPermission>
          },
          {
            path:'product-admin',
            element:<AdminPermission><ProductAdmin/></AdminPermission>
          },
          {
            path:'upload-products',
            element:<AdminPermission><UploadProduct/></AdminPermission>
          },

        ],
      },
      {
        path:":category",
        children:[
          {
            path:":subCategory",
            element:<ProductListPage/>
          }
        ]
      },
      {
        path:"product/:product",
        element:<ProductDisplayPage/>
      },
      {
        path:"cart",
        element:<CartMobile/>

      },
      {
        path:"checkout",
        element:<CheckoutPage/>
      },
      {
        path:"order-success",
        element:<OrderSuccess/>
      },
      {
        path:"cancel",
        element:<Cancel/>
      }
    ],
  },
]);
export default router;
