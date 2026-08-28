import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { EmptyState } from '../common/EmptyState';
import {
  Bell,
  CheckCircle2,
  Package,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  ExternalLink
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    setCurrentView,
    orders,
    setActiveTrackingOrder
  } = useMarketplace();

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.type === 'ORDER' && orders.length > 0) {
      setActiveTrackingOrder(orders[0]);
      setCurrentView('ORDER_TRACKING');
    } else if (notif.type === 'PROMO') {
      setCurrentView('PRODUCT_LISTING');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER':
        return <Package className="w-5 h-5 text-emerald-700" />;
      case 'PROMO':
        return <Sparkles className="w-5 h-5 text-yellow-600" />;
      case 'PAYMENT':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
            Inbox Alerts & Tracking
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Notifications ({notifications.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status updates on Boda dispatch, MoMo receipts, and weekend promotions.
          </p>
        </div>

        <button
          onClick={() => notifications.forEach(n => markNotificationAsRead(n.id))}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="We'll notify you here whenever your order dispatches or an escrow transaction completes."
          actionLabel="Browse Products"
          onAction={() => setCurrentView('PRODUCT_LISTING')}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>{n.title}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
