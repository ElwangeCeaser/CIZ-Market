import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { OrderStatus } from '../../types';
import { formatUGX } from '../../lib/formatters';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  User,
  ShieldCheck,
  ArrowLeft,
  Download,
  AlertCircle,
  FileText
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const {
    activeTrackingOrder,
    orders,
    setCurrentView,
    showToast
  } = useMarketplace();

  const order = activeTrackingOrder || orders[0];

  if (!order) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-slate-200 p-8">
        <p className="text-slate-500 text-sm">No order selected for tracking.</p>
        <button
          onClick={() => setCurrentView('MY_ORDERS')}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go to My Orders</span>
        </button>
      </div>
    );
  }

  const stepsOrder: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'PAID', label: 'Payment Verified', desc: 'MoMo / Card payment securely confirmed into escrow' },
    { status: 'PROCESSING', label: 'Vendor Packing', desc: 'Item inspected and packaged at merchant location' },
    { status: 'READY_FOR_PICKUP', label: 'Dispatched to Hub', desc: 'Arrived at CIZ Kampala Sorting Facility' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out with Express Rider', desc: 'Assigned to Boda courier on route to your landmark' },
    { status: 'DELIVERED', label: 'Package Delivered', desc: 'Delivered & inspected by customer' }
  ];

  const getStepState = (targetStatus: OrderStatus) => {
    const currentIdx = stepsOrder.findIndex(s => s.status === order.orderStatus);
    const targetIdx = stepsOrder.findIndex(s => s.status === targetStatus);

    if (order.orderStatus === 'DELIVERED') return 'completed';
    if (order.orderStatus === 'CANCELLED') return 'cancelled';

    if (currentIdx === -1) {
      if (targetIdx === 0 && order.orderStatus === 'PENDING_PAYMENT') return 'current';
      return 'pending';
    }

    if (targetIdx < currentIdx) return 'completed';
    if (targetIdx === currentIdx) return 'current';
    return 'pending';
  };

  const handleDownloadReceipt = () => {
    showToast(`Generating official receipt with URA e-tax QR stamp for ${order.orderNumber}...`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('MY_ORDERS')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </button>

        <button
          onClick={handleDownloadReceipt}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-emerald-800" />
          <span>Download e-Invoice</span>
        </button>
      </div>

      {/* Main Tracking Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Live Uganda Fulfillment Status
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Order {order.orderNumber}
            </h1>
            <p className="text-xs text-slate-300 font-mono">
              Tracking Reference: <strong className="text-yellow-300">{order.trackingNumber}</strong>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">
              Estimated Delivery
            </span>
            <p className="text-sm font-black text-white">Today by 5:00 PM</p>
            <p className="text-[11px] text-slate-300">Destination: {order.deliveryAddress.district}</p>
          </div>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Delivery Milestone Progress
        </h2>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {stepsOrder.map((step, idx) => {
            const state = getStepState(step.status);
            return (
              <div key={step.status} className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 sm:-left-8 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                    state === 'completed'
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : state === 'current'
                      ? 'bg-yellow-400 border-yellow-500 text-yellow-950 ring-4 ring-yellow-400/20 animate-pulse'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {state === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-black ${
                        state === 'current'
                          ? 'text-emerald-900'
                          : state === 'completed'
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {state === 'current' && (
                      <span className="bg-yellow-100 text-yellow-900 text-[10px] font-black px-2 py-0.2 rounded-full uppercase">
                        Current Step
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Courier & Address Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Courier Rider card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-800" />
            <span>Assigned Delivery Agent</span>
          </h3>

          {order.assignedAgent ? (
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">{order.assignedAgent.name}</h4>
                  <p className="text-slate-500">Express Boda Courier (Verified)</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Motorcycle Plate:</span>
                  <span className="font-bold text-slate-900">{order.assignedAgent.vehiclePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Line:</span>
                  <span className="font-bold text-emerald-800">{order.assignedAgent.phone}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Agent will be assigned as soon as the item reaches the central hub.
            </p>
          )}
        </div>

        {/* Destination card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
          <h3 className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-800" />
            <span>Delivery Destination Landmark</span>
          </h3>

          <div className="space-y-1 text-slate-700">
            <p className="font-bold text-slate-900">{order.deliveryAddress.recipientName}</p>
            <p>{order.deliveryAddress.phoneNumber}</p>
            <p>
              {order.deliveryAddress.streetAddress}, {order.deliveryAddress.district} (
              {order.deliveryAddress.zoneName})
            </p>
            <p className="p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 font-medium">
              <strong>Landmark for Rider:</strong> {order.deliveryAddress.landmark}
            </p>
          </div>
        </div>
      </div>

      {/* Audit History Log */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-800" />
          <span>Real-Time Audit Timeline</span>
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {order.statusHistory.map((item, idx) => (
            <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="font-bold text-slate-900">{item.status.replace(/_/g, ' ')}: </span>
                <span className="text-slate-600">{item.note}</span>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
