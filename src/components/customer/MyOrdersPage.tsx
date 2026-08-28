import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Order, OrderStatus } from '../../types';
import { formatUGX } from '../../lib/formatters';
import { EmptyState } from '../common/EmptyState';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Search,
  ExternalLink
} from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const {
    orders,
    setCurrentView,
    setActiveTrackingOrder,
    cancelOrder,
    requestReturn,
    showToast
  } = useMarketplace();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(ord => {
    if (filterStatus !== 'ALL' && ord.orderStatus !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchTrk = ord.trackingNumber.toLowerCase().includes(q);
      const matchItem = ord.items.some(i => i.productTitle.toLowerCase().includes(q));
      if (!matchNum && !matchTrk && !matchItem) return false;
    }
    return true;
  });

  const handleTrack = (order: Order) => {
    setActiveTrackingOrder(order);
    setCurrentView('ORDER_TRACKING');
  };

  const handleCancel = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order? Remote payment refund will be initiated.')) {
      cancelOrder(orderId, 'Customer requested cancellation from portal.');
    }
  };

  const handleReturn = (orderId: string) => {
    const reason = prompt('Please enter the reason for return/refund:');
    if (reason) {
      requestReturn(orderId, reason);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const map: Record<OrderStatus, { bg: string; text: string; label: string }> = {
      PENDING_PAYMENT: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', label: 'Pending MoMo' },
      PAID: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', label: 'Paid & Confirmed' },
      PROCESSING: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800', label: 'Packing at Hub' },
      READY_FOR_PICKUP: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', label: 'Ready for Dispatch' },
      SHIPPED: { bg: 'bg-cyan-50 border-cyan-200', text: 'text-cyan-800', label: 'Assigned to Courier' },
      OUT_FOR_DELIVERY: { bg: 'bg-emerald-50 border-emerald-300', text: 'text-emerald-800', label: 'Out with Boda Rider' },
      DELIVERED: { bg: 'bg-green-50 border-green-200', text: 'text-green-800', label: 'Delivered' },
      CANCELLED: { bg: 'bg-red-50 border-red-200', text: 'text-red-800', label: 'Cancelled' },
      RETURN_REQUESTED: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', label: 'Return Review' },
      RETURNED: { bg: 'bg-slate-100 border-slate-300', text: 'text-slate-700', label: 'Returned' },
      REFUNDED: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', label: 'Refunded to MoMo' }
    };
    const s = map[status] || { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-800', label: status };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black border ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
              Customer Orders Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              My Orders ({orders.length})
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track live packages, download tax invoices, or request easy returns across Uganda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search order number or item..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 overflow-x-auto text-xs pb-1">
          {['ALL', 'OUT_FOR_DELIVERY', 'PROCESSING', 'DELIVERED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
                filterStatus === status
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description="You don't have any orders matching the selected filter. Place a new order on CIZ Market today."
          actionLabel="Browse Products"
          onAction={() => setCurrentView('PRODUCT_LISTING')}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4"
            >
              {/* Top Row: Number, Date, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">{order.orderNumber}</h3>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} • Tracking:{' '}
                    <span className="font-mono text-emerald-800 font-bold">{order.trackingNumber}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Amount</span>
                  <span className="text-sm sm:text-base font-black text-emerald-950">
                    {formatUGX(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Items in Order */}
              <div className="space-y-2.5">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-10 h-10 rounded-md object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-800 line-clamp-1">{item.productTitle}</p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity} × {formatUGX(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">{formatUGX(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              {/* Courier info (if assigned) */}
              {order.assignedAgent && (
                <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200/60 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>
                      Rider: <strong>{order.assignedAgent.name}</strong> ({order.assignedAgent.vehiclePlate})
                    </span>
                  </div>
                  <span className="font-bold text-emerald-800">{order.assignedAgent.phone}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTrack(order)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-2xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Live Delivery</span>
                  </button>

                  {order.orderStatus === 'DELIVERED' && (
                    <button
                      onClick={() => handleReturn(order.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Return Item</span>
                    </button>
                  )}

                  {['PENDING_PAYMENT', 'PAID', 'PROCESSING'].includes(order.orderStatus) && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold border border-red-200"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleTrack(order)}
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <span>Order Audit Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
