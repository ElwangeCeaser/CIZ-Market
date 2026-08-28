import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { DELIVERY_ZONES } from '../../data/mockData';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Shield,
  Trash2,
  CheckCircle2,
  Edit2,
  LogOut,
  Sparkles,
  Store,
  Truck,
  Settings
} from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    addresses,
    addAddress,
    orders,
    activeRole,
    setActiveRole,
    setCurrentView,
    showToast
  } = useMarketplace();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phoneNumber);
  const [isEditing, setIsEditing] = useState(false);

  // Add address modal/toggle state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [newPhone, setNewPhone] = useState('+256 ');
  const [newDistrict, setNewDistrict] = useState('Kampala');
  const [newZoneId, setNewZoneId] = useState(DELIVERY_ZONES[0].id);
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phoneNumber: phone });
    setIsEditing(false);
    showToast('Customer profile updated successfully.');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !newPhone || !newStreet || !newLandmark) {
      alert('Please fill out all address fields.');
      return;
    }
    const zone = DELIVERY_ZONES.find(z => z.id === newZoneId) || DELIVERY_ZONES[0];
    addAddress({
      recipientName: newRecipient,
      phoneNumber: newPhone,
      district: newDistrict,
      zoneId: zone.id,
      zoneName: zone.name,
      streetAddress: newStreet,
      landmark: newLandmark,
      isDefault: false
    });
    setShowAddressForm(false);
    showToast('New delivery address added.');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-emerald-700 text-yellow-300 flex items-center justify-center font-black text-xl shadow-inner border-2 border-emerald-500">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                Verified Shopper Account
              </span>
              <h1 className="text-xl sm:text-2xl font-black">{currentUser.name}</h1>
              <p className="text-xs text-emerald-100">{currentUser.email} • {currentUser.phoneNumber}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-bold text-white transition-colors border border-white/20"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Details & Role Switcher + Address Book */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Edit Profile Form */}
          {isEditing ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 text-xs">
              <h3 className="font-black text-slate-900 uppercase tracking-wider">
                Edit Personal Details
              </h3>
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Money Phone:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-800 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider"
                >
                  Save Changes
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
              <h3 className="font-black text-slate-900 uppercase tracking-wider">
                Personal Information
              </h3>
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-bold text-slate-900">{currentUser.name}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-bold text-slate-900">{currentUser.email}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Mobile Money Phone:</span>
                  <span className="font-bold text-slate-900">{currentUser.phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500">Orders Completed:</span>
                  <span className="font-bold text-emerald-800">{orders.length} Orders</span>
                </div>
              </div>
            </div>
          )}

          {/* Experience Switcher */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Marketplace Portals
            </h3>
            <p className="text-xs text-slate-500">
              Test vendor listing, logistics dispatch, or admin review tools anytime.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setActiveRole('VENDOR')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left font-bold text-slate-800 flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-emerald-800" />
                <span>Seller Hub</span>
              </button>
              <button
                onClick={() => setActiveRole('DELIVERY_AGENT')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left font-bold text-slate-800 flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-emerald-800" />
                <span>Rider Dispatch</span>
              </button>
              <button
                onClick={() => setActiveRole('ADMIN')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left font-bold text-slate-800 flex items-center gap-2 col-span-2"
              >
                <Settings className="w-4 h-4 text-emerald-800" />
                <span>Administrative Console</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Address Book (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Delivery Address Book ({addresses.length})
              </h2>
              <p className="text-xs text-slate-500">Saved destinations across Uganda for fast 1-click checkout</p>
            </div>

            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-2xs hover:bg-emerald-900"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Address</span>
            </button>
          </div>

          {/* New Address inline form */}
          {showAddressForm && (
            <form
              onSubmit={handleSaveAddress}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs"
            >
              <h4 className="font-bold text-slate-900 uppercase">Add New Destination</h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Recipient Name"
                  value={newRecipient}
                  onChange={e => setNewRecipient(e.target.value)}
                  className="p-2 bg-white border border-slate-300 rounded-lg outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Phone (e.g. +256 772...)"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="p-2 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newDistrict}
                  onChange={e => setNewDistrict(e.target.value)}
                  className="p-2 bg-white border border-slate-300 rounded-lg outline-none"
                >
                  <option value="Kampala">Kampala</option>
                  <option value="Wakiso">Wakiso / Entebbe</option>
                  <option value="Mukono">Mukono</option>
                  <option value="Jinja">Jinja</option>
                </select>
                <select
                  value={newZoneId}
                  onChange={e => setNewZoneId(e.target.value)}
                  className="p-2 bg-white border border-slate-300 rounded-lg outline-none"
                >
                  {DELIVERY_ZONES.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                required
                placeholder="Street / Area (e.g. Bukoto, Kira Road)"
                value={newStreet}
                onChange={e => setNewStreet(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none"
              />
              <input
                type="text"
                required
                placeholder="Prominent Landmark (e.g. Near Kabira Club)"
                value={newLandmark}
                onChange={e => setNewLandmark(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* List of saved addresses */}
          <div className="space-y-3">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 text-xs relative"
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900">{addr.recipientName}</span>
                  <span className="text-slate-500">({addr.phoneNumber})</span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.2 rounded">
                      Default Destination
                    </span>
                  )}
                </div>
                <p className="text-slate-600">
                  {addr.streetAddress}, {addr.district} ({addr.zoneName})
                </p>
                <p className="text-emerald-800 font-medium">
                  <strong>Landmark:</strong> {addr.landmark}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
