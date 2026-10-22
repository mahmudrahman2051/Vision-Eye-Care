import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiShoppingBag, FiTruck, FiMapPin, FiArrowRight } from 'react-icons/fi';
import orderService from '../services/orderService';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      orderService.getOrderById(id)
        .then((res) => {
          if (res.status === 'success') {
            setOrder(res.data);
          }
        })
        .catch((err) => {
          console.warn('Could not fetch remote order:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-2xl mx-auto bg-white border border-[#E8DFD0] rounded-3xl p-6 sm:p-10 shadow-sm text-center">
        {/* Celebration Icon */}
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 border border-green-200">
          <FiCheckCircle />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355]">
          Order Confirmed
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mt-1 mb-2">
          Thank You for Choosing Drishti!
        </h1>
        <p className="text-xs text-[#666] max-w-md mx-auto mb-6">
          Your eyewear order has been confirmed. We are carefully preparing your frames for dispatch.
        </p>

        {/* Order Details Banner */}
        <div className="bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-2xl p-5 mb-8 text-left space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8DFD0] pb-3 text-xs">
            <div>
              <span className="text-[#777] block text-[10px] uppercase font-bold">Order Number</span>
              <span className="font-extrabold text-[#1A1A1A] text-sm">
                {order ? order.order_number : id}
              </span>
            </div>
            <div>
              <span className="text-[#777] block text-[10px] uppercase font-bold">Estimated Delivery</span>
              <span className="font-extrabold text-[#8B7355]">24-48 Hours (Inside BD)</span>
            </div>
            <div>
              <span className="text-[#777] block text-[10px] uppercase font-bold">Payment Method</span>
              <span className="font-extrabold text-[#1A1A1A] uppercase">
                {order ? order.payment_method : 'COD'}
              </span>
            </div>
          </div>

          {order && (
            <>
              {/* Delivery Address */}
              <div className="flex items-start gap-2.5 text-xs text-[#555] pt-1">
                <FiMapPin className="text-[#8B7355] w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1A1A1A]">{order.shipping_name}</span> ({order.shipping_phone})
                  <p className="text-[11px] text-[#777]">{order.shipping_address}, {order.shipping_city}</p>
                </div>
              </div>

              {/* Items summary */}
              {order.items && order.items.length > 0 && (
                <div className="pt-2 border-t border-[#E8DFD0] space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#888]">Items Ordered:</span>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-[#1A1A1A] font-semibold">{item.quantity}x {item.product_name}</span>
                      <span className="font-bold">৳{parseFloat(item.subtotal || item.price).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#E8DFD0] flex justify-between text-sm font-extrabold text-[#1A1A1A]">
                    <span>Total Paid / Payable</span>
                    <span className="text-[#8B7355]">৳{parseFloat(order.total).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/account/orders"
            className="w-full sm:w-auto px-6 py-3 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <FiPackage className="w-4 h-4" /> View My Orders
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#F5EFE3] text-[#1A1A1A] border border-[#E8DFD0] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
