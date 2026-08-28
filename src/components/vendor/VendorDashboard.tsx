import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CATEGORIES } from '../../data/mockData';
import { formatUGX } from '../../lib/formatters';
import {
  Store,
  Package,
  DollarSign,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  ShieldCheck,
  X
} from 'lucide-react';

export const VendorDashboard: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, orders, currentUser, setActiveRole } = useMarketplace();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'payouts'>('products');

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].name);
  const [newBrand, setNewBrand] = useState('');
  const [newBasePrice, setNewBasePrice] = useState('100000');
  const [newDiscountPrice, setNewDiscountPrice] = useState('85000');
  const [newStock, setNewStock] = useState('20');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80');
  const [newDesc, setNewDesc] = useState('');

  const vendorProducts = products.filter(p => p.vendorId === 'ven-1' || p.vendorName.includes('Kampala') || p.vendorName === currentUser.vendorInfo?.businessName);
  
  // Calculate total vendor metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.subtotal, 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newBasePrice) return;

    const catObj = CATEGORIES.find(c => c.name === newCategory) || CATEGORIES[0];

    addProduct({
      title: newTitle,
      category: newCategory,
      categoryId: catObj.id,
      brand: newBrand || 'Original Ugandan Craft',
      description: newDesc || 'High quality marketplace product inspected for Ugandan standards.',
      shortDescription: newTitle.slice(0, 80),
      basePrice: parseFloat(newBasePrice),
      discountPrice: newDiscountPrice ? parseFloat(newDiscountPrice) : undefined,
      images: [newImage],
      stockQuantity: parseInt(newStock) || 10,
      vendorId: 'ven-1',
      vendorName: currentUser.vendorInfo?.businessName || 'Kampala Gadgets Hub Ltd',
      vendorLocation: 'Kampala City Hub',
      specifications: {
        'Origin': 'Verified Uganda Supply',
        'Condition': 'Brand New Factory Sealed'
      },
      deliveryEstimatedHours: 'Same Day Dispatch'
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white rounded-xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-700 border border-emerald-500/40 flex items-center justify-center text-yellow-400 font-bold text-xl">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">{currentUser.vendorInfo?.businessName || 'Kampala Gadgets Hub'}</h1>
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                Verified Ugandan Merchant
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              TIN: {currentUser.vendorInfo?.tinNumber} • Commission Rate: {currentUser.vendorInfo?.commissionRate}% • Rating: ★ 4.8
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-emerald-950 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => setActiveRole('CUSTOMER')}
            className="bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            Back to Storefront
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Volume</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{formatUGX(totalRevenue)}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +14.8% this week</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Catalog Products</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{vendorProducts.length} Items</div>
            <div className="text-[11px] text-slate-500 mt-1">All UNBS compliant</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">MoMo Payout Line</div>
            <div className="text-lg font-black text-slate-900 mt-1">{currentUser.vendorInfo?.payoutPhone}</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">Auto-settles every Friday</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 uppercase tracking-wider ${activeTab === 'products' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          My Inventory ({vendorProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 uppercase tracking-wider ${activeTab === 'orders' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-3 border-b-2 uppercase tracking-wider ${activeTab === 'payouts' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Settlements & MoMo Payouts
        </button>
      </div>

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (UGX)</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vendorProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={prod.images[0]} alt="" className="w-12 h-12 object-cover rounded border" />
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{prod.title}</div>
                        <div className="text-[10px] text-slate-400">{prod.brand}</div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{prod.category}</td>
                    <td className="p-4">
                      <div className="font-black text-slate-900">{formatUGX(prod.discountPrice || prod.basePrice)}</div>
                      {prod.discountPrice && (
                        <div className="text-[10px] text-slate-400 line-through">{formatUGX(prod.basePrice)}</div>
                      )}
                    </td>
                    <td className="p-4 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${prod.stockQuantity > 5 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
                        {prod.stockQuantity} units
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Active & Listed
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => updateProduct(prod.id, { stockQuantity: prod.stockQuantity + 10 })}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                        title="Add 10 stock"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Deactivate item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="divide-y divide-slate-200">
            {orders.map(ord => (
              <div key={ord.id} className="p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {ord.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-slate-600">
                  Customer: <strong>{ord.customerName}</strong> ({ord.customerPhone}) • Destination: {ord.deliveryAddress.district}
                </div>
                <div className="flex justify-between font-black text-slate-900">
                  <span>Order Total:</span>
                  <span className="text-emerald-800">{formatUGX(ord.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 text-xs">
          <h3 className="font-black text-slate-900 text-sm">Automated Ugandan Mobile Money Settlements</h3>
          <p className="text-slate-600">
            All customer payments collected via MTN MoMo, Airtel Money, or Card are aggregated in escrow. Vendor payouts are automatically disbursed directly to your registered phone number every Friday after a 7-day buyer return holding period.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Registered Line: {currentUser.vendorInfo?.payoutPhone} (MTN Uganda)</div>
              <div className="text-[11px] text-slate-500">Next Scheduled Payout: This Friday 4:00 PM EAT</div>
            </div>
            <span className="text-emerald-700 font-bold text-xs">● Active Escrow Channel</span>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-sm font-black text-slate-900">Publish New Item to CIZ Market</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Tecno Spark 10 Pro 256GB Dual SIM"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={e => setNewBrand(e.target.value)}
                    placeholder="e.g. Tecno / Nytil"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Price (UGX) *</label>
                  <input
                    type="number"
                    required
                    value={newBasePrice}
                    onChange={e => setNewBasePrice(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Price (UGX)</label>
                  <input
                    type="number"
                    value={newDiscountPrice}
                    onChange={e => setNewDiscountPrice(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={e => setNewStock(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newImage}
                  onChange={e => setNewImage(e.target.value)}
                  className="w-full p-2 border rounded text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Key features for Ugandan shoppers..."
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 font-bold text-emerald-950 rounded uppercase tracking-wider"
                >
                  Publish Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
