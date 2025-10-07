import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { FaRegCheckCircle } from "react-icons/fa";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

// Import your custom utils and actions
import { handleAddItemCart } from '../store/cartProduct';
import { setLatestOrder } from '../store/orderSlice';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';

const OrderSuccess = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.user);

  useEffect(() => {
    const findOrder = async () => {
      // Priority 1: Check for data passed directly from CheckoutPage (for COD)
      const orderFromNavState = location.state?.order;
      if (orderFromNavState) {
        setCurrentOrder(orderFromNavState);
        setLoading(false);
        return;
      }

      // Priority 2: Poll for the order using session_id from URL (for Stripe)
      const stripeSessionId = searchParams.get('session_id');
      if (stripeSessionId) {
        let attempts = 0;
        const maxAttempts = 5;

        const pollForOrder = async () => {
          try {
            const response = await Axios.get(`/api/order/session/${stripeSessionId}`);
            if (response.data.success) {
              setCurrentOrder(response.data.data);
              dispatch(setLatestOrder(response.data.data));
              setLoading(false);
              return; // Success! Stop polling.
            }
          } catch (error) {
            console.log(`Attempt ${attempts + 1}: Order not found yet. Retrying...`);
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(pollForOrder, 2000); // Wait 2 seconds and try again
          } else {
            toast.error("Could not retrieve your order details. Please check 'My Orders'.");
            setLoading(false);
          }
        };

        pollForOrder(); // Start polling
      } else {
          setLoading(false); // No order info available
      }
    };
    
    findOrder();
  }, [location, searchParams, dispatch]);

  // useEffect to clear the user's cart
  useEffect(() => {
    if (currentOrder) {
      const clearCartOnServer = async () => {
        try {
          await Axios({ ...SummaryApi.clearCart });
          dispatch(handleAddItemCart([]));
        } catch (error) {
          AxiosToastError(error);
          console.error('Error clearing cart:', error);
        }
      };
      clearCartOnServer();
    }
  }, [dispatch, currentOrder]);

  const generateInvoicePDF = (order, user) => {
    if (!order || !user) {
      toast.error("Order details not available to generate invoice.");
      return;
    }
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Salunkhe Mart", 14, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Mumbai, Maharashtra", 14, 28);
    
    doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("INVOICE", 196, 20, { align: "right" });
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId || 'N/A'}`, 14, 35);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 42);
    doc.text("Bill To:", 14, 55);
    doc.text(user.name || 'N/A', 14, 62);
    if (order.delivery_address) {
        doc.text(order.delivery_address.address_line || '', 14, 69);
        doc.text(`${order.delivery_address.city || ''}, ${order.delivery_address.pincode || ''}`, 14, 76);
    }
    const tableBody = order.product_details.map(item => [
        item.name,
        item.quantity,
        `Rs. ${item.priceAtPurchase}`,
        `Rs. ${item.quantity * item.priceAtPurchase}`
    ]);
    autoTable(doc, {
      startY: 85,
      head: [['Item Name', 'Quantity', 'Price', 'Total']],
      body: tableBody,
      foot: [['', '', 'Grand Total', `Rs. ${order.totalAmt}`]]
    });
     let pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150);
   // Grey color for footer text
  doc.text("Thank you for your business!", 105, pageHeight - 10, { align: "center" });
    doc.save(`invoice-${order.orderId}.pdf`);
  };

  if (loading) {
    return <p className="text-center text-lg font-semibold mt-8">Loading your order details...</p>;
  }

  return (
    <section>
      <div className='m-2 w-full max-w-md bg-gradient-to-b from-green-300 to-blue-300 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-3 '>
        <p className='text-green-800 font-bold text-lg flex gap-2 items-center justify-center'>
          {location?.state?.text || "Payment"} Successfully <FaRegCheckCircle />
        </p>
        {currentOrder && <p className='font-semibold'>Your Order ID: {currentOrder._id}</p>}
        <div className="flex gap-4 mt-2">
            <Link to={"/"} className='border border-blue-800 px-4 py-1 rounded hover:text-white hover:bg-blue-500'>Go To Home</Link>
            {currentOrder && (
                <button
                    onClick={() => generateInvoicePDF(currentOrder, userInfo)}
                    className='border border-green-800 px-4 py-1 rounded text-green-800 hover:text-white hover:bg-green-600'
                >
                    Download Invoice
                </button>
            )}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="w-[75vw] h-[30vh] bg-gradient-to-r from-emerald-600 to-blue-600 flex flex-col justify-center items-center rounded-lg shadow-lg text-white p-6">
          <h1 className="text-3xl font-bold mb-2">🙏 Thank You!</h1>
          <p className="text-lg">For Visiting <span className="font-semibold">Salunkhe Mart</span></p>
          <p className="text-md mt-1 italic">We appreciate your support — come again soon!</p>
          <p className="text-sm mt-2">✨ Great offers & fresh products are always waiting for you ✨</p>
          <Link to={"/"} className='underline px-4 py-1 hover:text-white hover:bg-blue-500'>Shop More</Link>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccess;