import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { FaRegCheckCircle } from "react-icons/fa";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { handleAddItemCart } from '../store/cartProduct';
import { setLatestOrder } from '../store/orderSlice';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { IconBase } from 'react-icons/lib';

const OrderSuccess = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.user);

  useEffect(() => {
    const findOrder = async () => {
      
      const orderFromNavState = location.state?.order;
      if (orderFromNavState) {
        setCurrentOrder(orderFromNavState);
        setLoading(false);
        return;
      }

      
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
              return; 
            }
          } catch (error) {
            console.log(`Attempt ${attempts + 1}: Order not found yet. Retrying...`);
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(pollForOrder, 2000); 
          } else {
            toast.error("Could not retrieve your order details. Please check 'My Orders'.");
            setLoading(false);
          }
        };

        pollForOrder(); 
      } else {
          setLoading(false); 
      }
    };
    
    findOrder();
  }, [location, searchParams, dispatch]);

  
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
  const primaryColor = [22, 160, 133]; // A nice green color for branding
  const secondaryColor = [44, 62, 80]; // A dark grey for text

  // --- 1. HEADER ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 30, 'F'); // Top banner rectangle

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255); // White text
  doc.text("INVOICE", 196, 20, { align: "right" });

  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(16);
  doc.text("Salunkhe Mart", 14, 45);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Navi Mumbai, Maharashtra, India", 14, 52);

  // --- 2. ORDER & CUSTOMER DETAILS (Two-column layout) ---
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 14, 70);
  doc.setFont("helvetica", "normal");
  doc.text(user.name || 'N/A', 14, 76);
  if (order.delivery_address) {
    doc.text(order.delivery_address.address_line || '', 14, 82);
    doc.text(`${order.delivery_address.city || ''}, ${order.delivery_address.pincode || ''}`, 14, 88);
  }

doc.setFont("helvetica", "bold");
doc.text("Order ID:", 132, 70); // Was 150
doc.text("Date:", 132, 76);    // Was 150
doc.setFont("helvetica", "normal");
doc.text(order.orderId || 'N/A', 150, 70); // Was 170
doc.text(new Date(order.createdAt).toLocaleDateString(), 150, 76); // Was 170
  // --- 3. ITEMS TABLE ---
  const tableBody = order.product_details.map(item => [
    item.name,
    item.quantity,
    `Rs. ${item.priceAtPurchase.toFixed(2)}`,
    `Rs. ${(item.quantity * item.priceAtPurchase).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 100,
    head: [['Item Name', 'Quantity', 'Price', 'Total']],
    body: tableBody,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: { fontSize: 10 }
  });

  // --- 4. TOTALS SECTION ---
  let finalY = doc.lastAutoTable.finalY + 15; // Get the Y position after the table
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", 150, finalY);
  doc.text(`Rs. ${order.totalAmt.toFixed(2)}`, 196, finalY, { align: "right" });

  // --- 5. "THANK YOU" STAMP ---
  let stampX = 145;
  let stampY = doc.lastAutoTable.finalY + 25;
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(stampX, stampY, 50, 20, 3, 3, 'S'); // 'S' is for stroke (outline)
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Thank You!", stampX + 25, stampY + 9, { align: 'center'});
  doc.setFontSize(10);
  doc.text("Visit Again!", stampX + 25, stampY + 15, { align: 'center' });

  // --- 6. FOOTER ---
  let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  doc.setTextColor(150); // Light grey text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("This is a computer-generated invoice.", 105, pageHeight - 10, { align: "center" });

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
            <Link to={"/"} className='border bg-blue-500 text-white border-blue-800 px-4 py-1 rounded hover:text-white hover:bg-blue-700'>Go To Home</Link>
            {currentOrder && (
                <button
                    onClick={() => generateInvoicePDF(currentOrder, userInfo)}
                    className='border border-purple-800 px-4 py-1 rounded text-white bg-purple-500 hover:text-white hover:bg-purple-600'
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