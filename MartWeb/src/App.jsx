import { useEffect } from "react";
import "./App.css";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import fetchUserDetils from "./utils/fetchUserDetails";
import { setUserDetails, logout } from "./store/userSlice";
import { useDispatch } from "react-redux";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import SummaryApi from "./common/SummaryApi";
import Axios from "./utils/Axios";
import AxiosToastError from "./utils/AxiosToastError";
import GlobalProvider from "./provider/GlobalProvider";
import CartMobile from "./components/cartMobile";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Restore user if token exists
  const restoreUser = async () => {
    const token = localStorage.getItem("accesstoken");
    if (!token) return; // not logged in

    try {
      const userData = await fetchUserDetils();
      if (userData?.data) {
        dispatch(setUserDetails(userData.data));
      } else {
        dispatch(logout());
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
      }
    } catch (error) {
      dispatch(logout());
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");
    }
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({ ...SummaryApi.getCategory });
      if (response.data.success) {
        dispatch(setAllCategory(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getSubCategory });
      if (response.data.success) {
        dispatch(setAllSubCategory(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    restoreUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[80vh] ">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {location.pathname !== "/checkout" && <CartMobile />}
    </GlobalProvider>
  );
}

export default App;
