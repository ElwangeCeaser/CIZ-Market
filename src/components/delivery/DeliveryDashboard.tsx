import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatUGX } from '../../lib/formatters';
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const DeliveryDashboard: React.FC = () => {
  const { orders, updateOrderStatus, setActiveRole, currentUser, showToast } = useMarketplace();

  const [confirmationCode, setConfirmationCode] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const activeDeliveries = orders.filter(
    o => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'RETURNED'
  );

  const handleDeliver = (orderId: string) => {
    updateOrderStatus(orderId, 'DELIVERED', 'Package delivered and signed by customer with confirmation code.');
    setActiveOrderId(null);
    setConfirmationCode('');
    showToast('Delivery completed successfully! Rider earnings credited.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white rounded-xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-700 border border-emerald-500/40 flex items-center justify-center text-yellow-400 font-bold text-2xl">
            🛵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">Express Dispatch & Courier Hub</h1>
              <span className="bg-yellow-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded">
                LIVE DISPATCH
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Rider: Brian Kigozi • Plate: UFA 489X (Bajaj Boxer 150cc) • Zone: Kampala & Bukoto
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveRole('CUSTOMER')}
          className="bg-emerald-800 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
        >
          Back to Storefront
        </button>
      </div>

      {/* Dispatch Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
            Assigned Doorstep Deliveries ({activeDeliveries.length})
          </h3>
          <span className="text-xs text-slate-500">Tap to advance rider workflow</span>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <span>All packages have been safely delivered to recipients!</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeDeliveries.map(ord => (
              <div key={ord.id} className="p-5 text-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{ord.orderNumber}</span>
                    <span className="ml-2 text-slate-400 font-mono">({ord.trackingNumber})</span>
                  </div>
                  <span className="bg-yellow-100 text-yellow-900 font-bold px-2.5 py-1 rounded text-[11px]">
                    Status: {ord.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Recipient & Ugandan Landmark details */}
                <div className="bg-slate-50 p-3 rounded-lg border space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Recipient: {ord.deliveryAddress.recipientName}</span>
                  </div>
                  <div className="text-slate-600 font-medium">{ord.deliveryAddress.streetAddress}, {ord.deliveryAddress.district}</div>
                  <div className="text-emerald-800 font-semibold text-[11px]">
                    📍 Landmark: {ord.deliveryAddress.landmark}
                  </div>
                  <div className="pt-1 flex items-center gap-4 text-slate-700">
                    <a
                      href={`tel:${ord.deliveryAddress.phoneNumber}`}
                      className="text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Customer: {ord.deliveryAddress.phoneNumber}</span>
                    </a>
                  </div>
                </div>

                {/* Items & Payment Check */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-slate-500">Payment: </span>
                    <strong className="text-slate-900">{ord.paymentMethod.replace(/_/g, ' ')}</strong>
                    <span className="ml-2 text-emerald-700 font-bold">({ord.paymentStatus})</span>
                  </div>
                  <div className="font-black text-slate-900">
                    Payable: {formatUGX(ord.totalAmount)}
                  </div>
                </div>

                {/* Rider Action Controls */}
                <div className="pt-2 flex flex-wrap items-center gap-2 border-t">
                  {ord.orderStatus === 'PROCESSING' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'READY_FOR_PICKUP', 'Picked up package from vendor warehouse.')}
                      className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded hover:bg-emerald-800"
                    >
                      Pick Up From Merchant
                    </button>
                  )}

                  {ord.orderStatus === 'READY_FOR_PICKUP' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'SHIPPED', 'In transit to local district dispatch.')}
                      className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded hover:bg-emerald-800"
                    >
                      Receive at Kampala Dispatch
                    </button>
                  )}

                  {ord.orderStatus === 'SHIPPED' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'OUT_FOR_DELIVERY', 'Rider is en-route on Boda-boda.')}
                      className="px-3 py-1.5 bg-yellow-500 text-emerald-950 font-black rounded hover:bg-yellow-400 uppercase tracking-wider"
                    >
                      Start Doorstep Journey (Out for Delivery)
                    </button>
                  )}

                  {ord.orderStatus === 'OUT_FOR_DELIVERY' && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleDeliver(ord.id)}
                        className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black rounded uppercase tracking-wider flex items-center gap-1.5 shadow"
                      >
                        <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                        <span>Confirm Doorstep Delivery & Sign Off</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
