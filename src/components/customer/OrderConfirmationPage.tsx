import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatUGX } from '../../lib/formatters';
import {
  CheckCircle2,
  Truck,
  MapPin,
  Smartphone,
  Package,
  ArrowRight,
  Download,
  Share2,
  Calendar
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const {
    lastPlacedOrder,
    setCurrentView,
    setActiveTrackingOrder,
    showToast
  } = useMarketplace();

  if (!lastPlacedOrder) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-slate-200 p-8">
        <p className="text-slate-500 text-sm">No recent order found.</p>
        <button
          onClick={() => setCurrentView('PRODUCT_LISTING')}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold"
        >
          <span>Return to Marketplace</span>
        </button>
      </div>
    );
  }

  const order = lastPlacedOrder;

  const handleTrackLive = () => {
    setActiveTrackingOrder(order);
    setCurrentView('ORDER_TRACKING');
  };

  const handleDownloadInvoice = () => {
    showToast(`Downloading URA e-FRIS Invoice for Order ${order.orderNumber}...`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-lg">
        <div className="w-14 h-14 rounded-full bg-emerald-700 text-yellow-300 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-300">
          Payment Verified & Escrow Reserved
        </span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Thank you, {order.customerName}!
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto leading-relaxed">
          Your order <strong>{order.orderNumber}</strong> has been received by our Kampala fulfillment hub. A notification SMS has been dispatched to <strong>{order.customerPhone}</strong>.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={handleTrackLive}
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all shadow-md active:scale-95"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Delivery</span>
          </button>
          <button
            onClick={handleDownloadInvoice}
            className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all border border-emerald-600"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tracking Code</span>
            <p className="text-sm font-black text-emerald-800 font-mono">{order.trackingNumber}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Placed At</span>
            <p className="text-xs text-slate-700 font-medium">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Order Items ({order.items.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {order.items.map(item => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    className="w-12 h-12 rounded-md object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{item.productTitle}</h4>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity} × {formatUGX(item.unitPrice)}
                      {item.variantName && ` (${item.variantName})`}
                    </p>
                  </div>
                </div>
                <span className="font-black text-slate-900">{formatUGX(item.totalPrice)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Address & Payment Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Delivery Destination</span>
            </div>
            <p className="text-slate-700 font-medium">{order.deliveryAddress.recipientName}</p>
            <p className="text-slate-500">
              {order.deliveryAddress.streetAddress}, {order.deliveryAddress.district}
            </p>
            <p className="text-[11px] text-emerald-800">
              <strong>Landmark:</strong> {order.deliveryAddress.landmark}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Payment Channel</span>
            </div>
            <p className="text-slate-700 font-medium">{order.paymentMethod.replace('_', ' ')}</p>
            <p className="text-emerald-700 font-bold">Status: {order.paymentStatus}</p>
            <p className="text-slate-900 font-black text-sm pt-1">Total: {formatUGX(order.totalAmount)}</p>
          </div>
        </div>

        {/* Next actions */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <button
            onClick={() => setCurrentView('MY_ORDERS')}
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            View All My Orders
          </button>

          <button
            onClick={() => setCurrentView('PRODUCT_LISTING')}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
