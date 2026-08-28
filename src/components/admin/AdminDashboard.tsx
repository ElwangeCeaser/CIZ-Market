import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatUGX } from '../../lib/formatters';
import {
  ShieldAlert,
  Users,
  CheckCircle,
  XCircle,
  Activity,
  Tag,
  DollarSign,
  TrendingUp,
  MapPin,
  FileText,
  Sliders,
  Settings
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { orders, products, setActiveRole, showToast } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'orders' | 'logs'>('overview');

  const [pendingVendors, setPendingVendors] = useState([
    {
      id: 'ven-req-1',
      businessName: 'Nile Electronics Ltd',
      ownerName: 'Emmanuel Otim',
      phone: '+256 782 990 114',
      tinNumber: '1008472911',
      category: 'Electronics',
      location: 'William Street, Kampala',
      status: 'PENDING'
    },
    {
      id: 'ven-req-2',
      businessName: 'Buganda Crafts & Heritage',
      ownerName: 'Sarah Namubiru',
      phone: '+256 701 443 890',
      tinNumber: '1009182334',
      category: 'Textiles & Gifts',
      location: 'National Theatre Village, Kampala',
      status: 'PENDING'
    }
  ]);

  const totalGMV = orders.reduce((sum, ord) => sum + ord.totalAmount, 0) + 14850000;

  const handleApproveVendor = (id: string) => {
    setPendingVendors(prev => prev.filter(v => v.id !== id));
    showToast('Vendor approved and granted merchant dashboard access!');
  };

  const handleRejectVendor = (id: string) => {
    setPendingVendors(prev => prev.filter(v => v.id !== id));
    showToast('Vendor application declined.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black">CIZ Market • Super Admin Console</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Uganda Marketplace Operations, Gateway Verification & Merchant Moderation
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveRole('CUSTOMER')}
          className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
        >
          Back to Storefront
        </button>
      </div>

      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Merchandise Value</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatUGX(totalGMV)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +22.4% MoM in Kampala</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Vendors</div>
          <div className="text-2xl font-black text-slate-900 mt-1">48 Merchants</div>
          <div className="text-[11px] text-yellow-600 font-semibold mt-1">{pendingVendors.length} Pending Review</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Take Rate</div>
          <div className="text-2xl font-black text-slate-900 mt-1">8.0% Base</div>
          <div className="text-[11px] text-slate-500 mt-1">Escrow holding active</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">MoMo Success Rate</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">99.4%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">MTN & Airtel live channels</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 uppercase tracking-wider ${activeTab === 'overview' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`pb-3 border-b-2 uppercase tracking-wider ${activeTab === 'vendors' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Vendor Approvals ({pendingVendors.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 uppercase tracking-wider ${activeTab === 'orders' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 border-b-2 uppercase tracking-wider ${activeTab === 'logs' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Audit & Security Logs
        </button>
      </div>

      {/* TAB CONTENT: VENDORS */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs text-slate-700">
            Pending Merchant KYC & Tax Registration Approvals
          </div>
          {pendingVendors.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">All vendor registrations have been reviewed.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingVendors.map(v => (
                <div key={v.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{v.businessName}</div>
                    <div className="text-slate-600 mt-0.5">
                      Owner: <strong>{v.ownerName}</strong> ({v.phone}) • URA TIN: <span className="font-mono">{v.tinNumber}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Category: {v.category} • Location: {v.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRejectVendor(v.id)}
                      className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleApproveVendor(v.id)}
                      className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded"
                    >
                      Approve Merchant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 text-xs space-y-3">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Payment Provider Gateway Status</h3>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded border flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">MTN Mobile Money Uganda API</div>
                  <div className="text-[10px] text-slate-500">Open API collections & disbursements v2.0</div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">● OPERATIONAL</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Airtel Money Uganda Gateway</div>
                  <div className="text-[10px] text-slate-500">Merchant API webhooks with HMAC-SHA256 signature</div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">● OPERATIONAL</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Stanbic / Visa 3DS Gateway</div>
                  <div className="text-[10px] text-slate-500">Card tokenization & EMV 3D-Secure 2.2</div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">● OPERATIONAL</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-xs space-y-3">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Regional Delivery Zones</h3>
            <div className="space-y-1.5">
              <div className="flex justify-between py-1.5 border-b">
                <span>Kampala Central & CBD</span>
                <span className="font-bold text-slate-800">{formatUGX(4500)} (2-4 hrs)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>Kampala Suburbs (Bukoto, Ntinda, Kololo)</span>
                <span className="font-bold text-slate-800">{formatUGX(6500)} (Same Day)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>Wakiso (Entebbe, Kira, Nansana)</span>
                <span className="font-bold text-slate-800">{formatUGX(9500)} (12 hrs)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>Upcountry Hubs (Jinja, Mbarara, Gulu)</span>
                <span className="font-bold text-slate-800">{formatUGX(18000)} (24-48 hrs)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden text-xs">
          <div className="divide-y divide-slate-100">
            {orders.map(o => (
              <div key={o.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold font-mono text-slate-900">{o.orderNumber} ({o.trackingNumber})</div>
                  <div className="text-slate-600">{o.customerName} • {o.deliveryAddress.district} • {o.paymentMethod}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">{formatUGX(o.totalAmount)}</div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {o.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-slate-950 text-emerald-400 p-5 rounded-xl font-mono text-[11px] space-y-2 border border-slate-800 shadow-inner">
          <div className="text-slate-500 uppercase pb-2 border-b border-slate-800">Real-Time Security & Audit Trail:</div>
          <div>[{new Date().toISOString()}] AUTH_LOGIN: Admin celwange@gmail.com authenticated via secure token.</div>
          <div>[{new Date().toISOString()}] PAYMENT_WEBHOOK: MTN MoMo Callback verified (Ref: MTN-UG-984129, Amount: UGX 481,500).</div>
          <div>[{new Date().toISOString()}] ORDER_DISPATCH: Order CIZ-2026-89421 assigned to Rider Brian Kigozi (Plate UFA 489X).</div>
          <div>[{new Date().toISOString()}] INVENTORY_SYNC: 19 Ugandan category taxonomies indexed successfully.</div>
        </div>
      )}
    </div>
  );
};
