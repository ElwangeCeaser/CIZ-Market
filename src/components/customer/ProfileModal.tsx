import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { RoleType } from '../../types';
import {
  X,
  User,
  MapPin,
  Package,
  Shield,
  Smartphone,
  LogOut,
  CheckCircle2,
  Store,
  Truck
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    updateUserProfile,
    activeRole,
    setActiveRole,
    addresses,
    orders,
    setActiveTrackingOrder
  } = useMarketplace();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phoneNumber);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phoneNumber: phone });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-yellow-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Account & Portals</h2>
              <span className="text-[10px] text-emerald-200">CIZ Market Uganda Profile</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-emerald-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Quick Role Switcher */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Switch Marketplace Experience
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setActiveRole('CUSTOMER'); onClose(); }}
                className={`p-2 rounded border text-left flex items-center gap-2 ${activeRole === 'CUSTOMER' ? 'bg-emerald-800 text-white border-emerald-800 font-bold' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                <span>🛍️</span>
                <span>Shopper Storefront</span>
              </button>
              <button
                onClick={() => { setActiveRole('VENDOR'); onClose(); }}
                className={`p-2 rounded border text-left flex items-center gap-2 ${activeRole === 'VENDOR' ? 'bg-emerald-800 text-white border-emerald-800 font-bold' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                <span>🏪</span>
                <span>Seller Dashboard</span>
              </button>
              <button
                onClick={() => { setActiveRole('ADMIN'); onClose(); }}
                className={`p-2 rounded border text-left flex items-center gap-2 ${activeRole === 'ADMIN' ? 'bg-emerald-800 text-white border-emerald-800 font-bold' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                <span>⚙️</span>
                <span>Admin Console</span>
              </button>
              <button
                onClick={() => { setActiveRole('DELIVERY_AGENT'); onClose(); }}
                className={`p-2 rounded border text-left flex items-center gap-2 ${activeRole === 'DELIVERY_AGENT' ? 'bg-emerald-800 text-white border-emerald-800 font-bold' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                <span>🛵</span>
                <span>Delivery Agent</span>
              </button>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Personal Information</div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2 border rounded bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Mobile Money Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2 border rounded bg-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded uppercase tracking-wider"
              >
                Update Profile
              </button>
            </div>
          </form>

          {/* Saved Addresses Summary */}
          <div className="border-t pt-3 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Saved Delivery Addresses ({addresses.length})</span>
            </div>
            {addresses.map(a => (
              <div key={a.id} className="p-2 bg-slate-50 rounded border text-[11px]">
                <strong>{a.recipientName}</strong>: {a.streetAddress}, {a.district} (Landmark: {a.landmark})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
