import React from 'react';
import { ShieldCheck, Truck, Lock, PhoneCall, Mail, MapPin, Smartphone, CreditCard } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { useMarketplace } from '../../context/MarketplaceContext';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setActiveRole } = useMarketplace();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 shrink-0 mt-12">
      {/* 3-Pillar Trust Feature Bar */}
      <div className="bg-slate-850 border-b border-slate-800 px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-wider">Authentic Products</div>
              <div className="text-[11px] text-slate-400 mt-0.5">100% verified Ugandan & imported genuine goods</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-wider">Fast Nationwide Delivery</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Express Boda in Kampala, 24hrs to all regional hubs</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-wider">Secure Remote Payments</div>
              <div className="text-[11px] text-slate-400 mt-0.5">MTN MoMo, Airtel Money, Visa & Mastercard</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs">
        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white italic font-black text-lg">
              C
            </div>
            <span className="text-white text-lg font-black tracking-tight">
              CIZ <span className="text-emerald-400">MARKET</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            Uganda's premier multi-category digital marketplace connecting verified local vendors, farmers, and retailers with shoppers nationwide.
          </p>
          <div className="flex flex-col gap-2 text-slate-400 text-[11px]">
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Plot 45, Kampala Road, City Centre, Kampala, Uganda</span>
            </span>
            <span className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>+256 700 123 456 / +256 772 000 111</span>
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>support@cizmarket.ug</span>
            </span>
          </div>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3 border-l-2 border-emerald-500 pl-2">
            Top Categories
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            {CATEGORIES.slice(0, 7).map(cat => (
              <li key={cat.id}>
                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  className="hover:text-yellow-300 transition-colors text-left"
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support & Portals */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3 border-l-2 border-emerald-500 pl-2">
            Marketplace Portals
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button onClick={() => setActiveRole('CUSTOMER')} className="hover:text-yellow-300 transition-colors">
                Customer Shopping Portal
              </button>
            </li>
            <li>
              <button onClick={() => setActiveRole('VENDOR')} className="hover:text-yellow-300 transition-colors">
                Seller / Vendor Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setActiveRole('ADMIN')} className="hover:text-yellow-300 transition-colors">
                Super Admin Console
              </button>
            </li>
            <li>
              <button onClick={() => setActiveRole('DELIVERY_AGENT')} className="hover:text-yellow-300 transition-colors">
                Delivery Logistics Portal
              </button>
            </li>
            <li><span className="hover:text-yellow-300 cursor-pointer">Order Tracking & Returns</span></li>
            <li><span className="hover:text-yellow-300 cursor-pointer">Delivery Rates & Ugandan Zones</span></li>
            <li><span className="hover:text-yellow-300 cursor-pointer">Terms & Buyer Protection</span></li>
          </ul>
        </div>

        {/* Payment Integration Badges */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3 border-l-2 border-emerald-500 pl-2">
            Payment Methods
          </h4>
          <p className="text-[11px] text-slate-400 mb-3">
            Integrated payment abstraction layer supporting instant mobile money and cards:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800 p-2 rounded border border-slate-700 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
              <span className="text-[11px] font-bold text-white">MTN MoMo</span>
            </div>
            <div className="bg-slate-800 p-2 rounded border border-slate-700 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="text-[11px] font-bold text-white">Airtel Money</span>
            </div>
            <div className="bg-slate-800 p-2 rounded border border-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-3 h-3 text-emerald-400" />
              <span className="text-[11px] font-bold text-white">Visa / Master</span>
            </div>
            <div className="bg-slate-800 p-2 rounded border border-slate-700 flex items-center gap-1.5">
              <span className="text-xs">💵</span>
              <span className="text-[11px] font-bold text-white">Cash on Delivery</span>
            </div>
          </div>
          <div className="mt-3 bg-emerald-950/60 border border-emerald-800 p-2 rounded text-[10px] text-emerald-300 font-mono">
            🛡️ Sandbox/Demo Payment Layer Ready
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 border-t border-slate-850 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
        <div>
          &copy; {new Date().getFullYear()} CIZ Market Uganda. Designed for Uganda and Africa. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Buyer Terms</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Seller Guidelines</span>
        </div>
      </div>
    </footer>
  );
};
