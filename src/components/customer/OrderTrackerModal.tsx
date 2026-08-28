import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { OrderStatus } from '../../types';
import { formatUGX, formatDate } from '../../lib/formatters';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Play
} from 'lucide-react';

const STATUS_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'PENDING_PAYMENT', label: 'Payment Pending', description: 'Awaiting remote payment confirmation' },
  { status: 'PAID', label: 'Payment Confirmed', description: 'Verified via Mobile Money / Card' },
  { status: 'PROCESSING', label: 'Processing', description: 'Vendor is packing and preparing items' },
  { status: 'READY_FOR_PICKUP', label: 'Ready for Pickup', description: 'Package at Kampala Sorting Hub' },
  { status: 'SHIPPED', label: 'Shipped', description: 'Handed over to dispatch logistics' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'Rider is en-route to your location' },
  { status: 'DELIVERED', label: 'Delivered', description: 'Order handed to recipient & signed' }
];

export const OrderTrackerModal: React.FC = () => {
  const {
    activeTrackingOrder: order,
    setActiveTrackingOrder,
    updateOrderStatus,
    cancelOrder,
    requestReturn
  } = useMarketplace();

  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of delivery address / mind');
  const [showReturnPrompt, setShowReturnPrompt] = useState(false);
  const [returnReason, setReturnReason] = useState('Defective item / size mismatch');

  if (!order) return null;

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.status === order.orderStatus);

  const handleNextStatus = () => {
    if (currentStepIndex >= 0 && currentStepIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentStepIndex + 1].status;
      updateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-yellow-400" />
            <div>
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                <span>Order Tracking:</span>
                <span className="font-mono text-yellow-300">{order.orderNumber}</span>
              </h2>
              <span className="text-[10px] text-emerald-200">
                Tracking No: {order.trackingNumber} • Placed {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="p-1 rounded-md text-emerald-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Current Order Status</div>
              <div className="text-xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
                <span className="capitalize">{order.orderStatus.replace(/_/g, ' ').toLowerCase()}</span>
                {order.orderStatus === 'DELIVERED' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                {order.orderStatus === 'OUT_FOR_DELIVERY' && (
                  <Truck className="w-5 h-5 text-yellow-600 animate-bounce" />
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Estimated arrival to <strong>{order.deliveryAddress.district}</strong> today via Express Dispatch.
              </p>
            </div>

            {/* Simulation Next-Step Button */}
            {currentStepIndex >= 0 && currentStepIndex < STATUS_STEPS.length - 1 && (
              <button
                type="button"
                onClick={handleNextStatus}
                className="bg-emerald-800 hover:bg-emerald-700 text-yellow-300 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-yellow-300" />
                <span>Simulate Next Stage &rarr;</span>
              </button>
            )}
          </div>

          {/* Stepper Visualizer (11 States mapped into standard flow) */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {STATUS_STEPS.map((step, idx) => {
              const isPast = currentStepIndex > idx || order.orderStatus === 'DELIVERED';
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={step.status} className="relative flex items-start gap-4">
                  {/* Dot Icon */}
                  <div
                    className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isPast
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : isCurrent
                        ? 'bg-yellow-500 text-emerald-950 ring-4 ring-yellow-100 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-emerald-900 font-black text-sm' : isPast ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-900 font-bold px-2 py-0.5 rounded">
                          Active Stage
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 ${isCurrent ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Assigned Delivery Personnel Card (if assigned) */}
          {order.assignedAgent && (
            <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-11 h-11 rounded-full bg-emerald-700 flex items-center justify-center text-yellow-300 font-black text-base shrink-0">
                  🛵
                </div>
                <div>
                  <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Assigned Delivery Rider</div>
                  <div className="text-sm font-black text-white">{order.assignedAgent.name}</div>
                  <div className="text-[11px] text-slate-400">
                    Plate: <strong className="text-white">{order.assignedAgent.vehiclePlate}</strong> ({order.assignedAgent.vehicleType})
                  </div>
                </div>
              </div>

              <a
                href={`tel:${order.assignedAgent.phone}`}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Rider: {order.assignedAgent.phone}</span>
              </a>
            </div>
          )}

          {/* Delivery Address & Landmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Delivery Destination</span>
              </div>
              <p className="text-slate-700 font-medium">{order.deliveryAddress.recipientName} ({order.deliveryAddress.phoneNumber})</p>
              <p className="text-slate-600">{order.deliveryAddress.streetAddress}, {order.deliveryAddress.district}</p>
              <p className="text-emerald-800 font-semibold text-[11px]">
                📍 Landmark: {order.deliveryAddress.landmark}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Payment Summary</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Method:</span>
                <span className="font-bold text-slate-800">{order.paymentMethod.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status:</span>
                <span className="font-bold text-emerald-700">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black border-t pt-1">
                <span>Total Paid:</span>
                <span className="text-emerald-800">{formatUGX(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Items in this Order */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Items Ordered ({order.items.length})
            </h4>
            <div className="divide-y divide-slate-200 border rounded-lg bg-white overflow-hidden">
              {order.items.map(item => (
                <div key={item.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.productImage} alt="" className="w-12 h-12 object-cover rounded bg-slate-100" />
                    <div>
                      <div className="font-bold text-slate-800 line-clamp-1">{item.productTitle}</div>
                      {item.variantName && (
                        <div className="text-[10px] text-slate-500">Variant: {item.variantName}</div>
                      )}
                      <div className="text-[10px] text-emerald-700">Vendor: {item.vendorName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900">{formatUGX(item.totalPrice)}</div>
                    <div className="text-[10px] text-slate-400">Qty: {item.quantity} × {formatUGX(item.unitPrice)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Self-Service Actions (Cancel / Returns) */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2 justify-end text-xs">
            {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'RETURNED' && (
              <button
                type="button"
                onClick={() => setShowCancelPrompt(!showCancelPrompt)}
                className="text-red-600 hover:text-red-800 font-bold px-3 py-1.5 border border-red-200 rounded hover:bg-red-50 transition-colors"
              >
                Cancel Order
              </button>
            )}

            {order.orderStatus === 'DELIVERED' && (
              <button
                type="button"
                onClick={() => setShowReturnPrompt(!showReturnPrompt)}
                className="text-emerald-700 hover:text-emerald-900 font-bold px-3 py-1.5 border border-emerald-200 rounded hover:bg-emerald-50 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Request Return / Refund</span>
              </button>
            )}
          </div>

          {/* Cancel Confirmation Prompt */}
          {showCancelPrompt && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-xs space-y-2 animate-in fade-in">
              <div className="font-bold text-red-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Confirm Order Cancellation</span>
              </div>
              <input
                type="text"
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="State your reason for cancellation"
                className="w-full p-2 border rounded bg-white"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCancelPrompt(false)}
                  className="px-3 py-1 border rounded text-slate-600"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={() => {
                    cancelOrder(order.id, cancelReason);
                    setShowCancelPrompt(false);
                  }}
                  className="px-3 py-1 bg-red-600 text-white font-bold rounded"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          )}

          {/* Return Confirmation Prompt */}
          {showReturnPrompt && (
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-xs space-y-2 animate-in fade-in">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-emerald-700" />
                <span>Submit 7-Day Hassle-Free Return Request</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Under CIZ Buyer Protection, a dispatch agent will pick up the item from your Bukoto/Kampala address for quality inspection and refund.
              </p>
              <input
                type="text"
                value={returnReason}
                onChange={e => setReturnReason(e.target.value)}
                placeholder="Reason for return (e.g. wrong size, damaged packaging)"
                className="w-full p-2 border rounded bg-white"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReturnPrompt(false)}
                  className="px-3 py-1 border rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    requestReturn(order.id, returnReason);
                    setShowReturnPrompt(false);
                  }}
                  className="px-3 py-1 bg-emerald-800 text-white font-bold rounded"
                >
                  Submit Return Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
