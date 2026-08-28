import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { PaymentMethodType, DeliveryAddress } from '../../types';
import { DELIVERY_ZONES } from '../../data/mockData';
import { CheckoutSummary } from './CheckoutSummary';
import { formatUGX } from '../../lib/formatters';
import {
  MapPin,
  Plus,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building2,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Lock,
  Truck,
  Check
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    createOrder,
    setCurrentView,
    setLastPlacedOrder,
    setActiveTrackingOrder
  } = useMarketplace();

  // Checkout sub-step
  const [currentStep, setCurrentStep] = useState<'ADDRESS' | 'PAYMENT' | 'PROCESSING'>('ADDRESS');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('MTN_MOMO');
  const [phoneOrAccount, setPhoneOrAccount] = useState('0772 123 456');

  // Address creation state
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [newPhone, setNewPhone] = useState('+256 7');
  const [newDistrict, setNewDistrict] = useState('Kampala');
  const [newZoneId, setNewZoneId] = useState(DELIVERY_ZONES[0].id);
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  // Sandbox backend payment execution state
  const [paymentPhase, setPaymentPhase] = useState<
    'INITIATING' | 'AWAITING_USSD' | 'WEBHOOK_VERIFYING' | 'CONFIRMED' | 'FAILED'
  >('INITIATING');
  const [paymentLog, setPaymentLog] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0 && currentStep !== 'PROCESSING') {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-slate-200 p-8">
        <p className="text-slate-500 text-sm">Your cart is empty. Add items to proceed with checkout.</p>
        <button
          onClick={() => setCurrentView('PRODUCT_LISTING')}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse Products</span>
        </button>
      </div>
    );
  }

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !newPhone || !newStreet || !newLandmark) {
      alert('Please fill in all address fields including a landmark (e.g. Opposite Total Station).');
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
      isDefault: true
    });
    setIsAddingNewAddress(false);
  };

  const handleExecutePayment = async () => {
    setCurrentStep('PROCESSING');
    setIsProcessing(true);
    setPaymentLog([]);

    // 1. Initiating order
    setPaymentPhase('INITIATING');
    setPaymentLog(prev => [
      ...prev,
      `[1/4] Connecting to CIZ backend payment gateway...`,
      `[1/4] Preparing charge request for ${selectedPaymentMethod} (${phoneOrAccount})...`
    ]);

    await new Promise(r => setTimeout(r, 1200));

    // 2. USSD prompt or card 3DS
    setPaymentPhase('AWAITING_USSD');
    setPaymentLog(prev => [
      ...prev,
      selectedPaymentMethod === 'MTN_MOMO' || selectedPaymentMethod === 'AIRTEL_MONEY'
        ? `[2/4] USSD Push PIN prompt dispatched to ${phoneOrAccount}... Enter PIN on phone.`
        : `[2/4] 3D-Secure One-Time PIN verified with issuing bank...`
    ]);

    await new Promise(r => setTimeout(r, 1600));

    // 3. Webhook listener simulation
    setPaymentPhase('WEBHOOK_VERIFYING');
    setPaymentLog(prev => [
      ...prev,
      `[3/4] Webhook callback received from Telecommunications Aggregator.`,
      `[3/4] Cryptographic signature valid. Escrow balance credited.`
    ]);

    await new Promise(r => setTimeout(r, 1200));

    // 4. Create real order entity in context
    try {
      const order = await createOrder(selectedPaymentMethod, phoneOrAccount);
      setPaymentPhase('CONFIRMED');
      setPaymentLog(prev => [
        ...prev,
        `[4/4] Order ${order.orderNumber} successfully created & tracking token generated: ${order.trackingNumber}`
      ]);
      setIsProcessing(false);
      setLastPlacedOrder(order);
      setActiveTrackingOrder(order);

      setTimeout(() => {
        setCurrentView('ORDER_CONFIRMATION');
      }, 1500);
    } catch (err) {
      setPaymentPhase('FAILED');
      setPaymentLog(prev => [...prev, `[ERROR] Failed to finalize transaction. Please try again.`]);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Checkout Steps Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
              Secure Checkout
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Order Details & Payment
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span
              className={`px-3 py-1 rounded-full ${
                currentStep === 'ADDRESS'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              1. Delivery Address
            </span>
            <span className="text-slate-300">→</span>
            <span
              className={`px-3 py-1 rounded-full ${
                currentStep === 'PAYMENT'
                  ? 'bg-emerald-800 text-white'
                  : currentStep === 'PROCESSING'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              2. Payment Method
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Forms vs Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: DELIVERY ADDRESS SELECTION */}
          {currentStep === 'ADDRESS' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-800" />
                  <h2 className="text-base font-black text-slate-900">
                    Step 1: Select Delivery Destination in Uganda
                  </h2>
                </div>
                {!isAddingNewAddress && (
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {/* Add New Address Inline Form */}
              {isAddingNewAddress && (
                <form
                  onSubmit={handleSaveNewAddress}
                  className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 text-xs"
                >
                  <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs">
                    New Destination Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Recipient Full Name:
                      </label>
                      <input
                        type="text"
                        required
                        value={newRecipient}
                        onChange={e => setNewRecipient(e.target.value)}
                        placeholder="e.g. Celestine Mugerwa"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Contact Phone Number (For Rider):
                      </label>
                      <input
                        type="text"
                        required
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        placeholder="+256 772 123 456"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        District / City:
                      </label>
                      <select
                        value={newDistrict}
                        onChange={e => setNewDistrict(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-emerald-600 font-medium"
                      >
                        <option value="Kampala">Kampala</option>
                        <option value="Wakiso">Wakiso / Entebbe</option>
                        <option value="Mukono">Mukono</option>
                        <option value="Jinja">Jinja</option>
                        <option value="Mbarara">Mbarara</option>
                        <option value="Gulu">Gulu</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Delivery Zone & Rate:
                      </label>
                      <select
                        value={newZoneId}
                        onChange={e => setNewZoneId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-emerald-600 font-medium"
                      >
                        {DELIVERY_ZONES.map(z => (
                          <option key={z.id} value={z.id}>
                            {z.name} - {formatUGX(z.baseFee)} ({z.estimatedTime})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Street Address / Area:
                      </label>
                      <input
                        type="text"
                        required
                        value={newStreet}
                        onChange={e => setNewStreet(e.target.value)}
                        placeholder="e.g. Kira Road, Bukoto"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Prominent Landmark (Crucial for Boda Riders):
                      </label>
                      <input
                        type="text"
                        required
                        value={newLandmark}
                        onChange={e => setNewLandmark(e.target.value)}
                        placeholder="e.g. Opposite Total Energies, next to Kabira Country Club"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-emerald-800 text-white font-bold hover:bg-emerald-900"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses List */}
              <div className="space-y-3">
                {addresses.map(addr => {
                  const isSelected = selectedAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-xs sm:text-sm">
                            {addr.recipientName}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            ({addr.phoneNumber})
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">
                          {addr.streetAddress}, {addr.district} ({addr.zoneName})
                        </p>
                        <p className="text-[11px] text-emerald-800 font-medium">
                          <strong>Landmark:</strong> {addr.landmark}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-700 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => setCurrentView('CART')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Cart</span>
                </button>

                <button
                  onClick={() => setCurrentStep('PAYMENT')}
                  disabled={!selectedAddress}
                  className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  Continue to Payment Selection →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {currentStep === 'PAYMENT' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-800" />
                  <h2 className="text-base font-black text-slate-900">
                    Step 2: Remote Payment Selection (Uganda Channels)
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentStep('ADDRESS')}
                  className="text-xs font-bold text-emerald-800 hover:underline"
                >
                  Change Address
                </button>
              </div>

              {/* Payment Methods Accordion */}
              <div className="space-y-3">
                {/* 1. MTN MoMo */}
                <div
                  onClick={() => setSelectedPaymentMethod('MTN_MOMO')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-3 ${
                    selectedPaymentMethod === 'MTN_MOMO'
                      ? 'border-yellow-500 bg-yellow-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-yellow-400 text-yellow-950 flex items-center justify-center font-black text-xs shrink-0">
                        MTN
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">
                          MTN Mobile Money (MoMo)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Instant USSD PIN prompt (*165#). Fast & automated webhook confirmation.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedPaymentMethod === 'MTN_MOMO'
                          ? 'border-yellow-600 bg-yellow-500 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedPaymentMethod === 'MTN_MOMO' && <Check className="w-3 h-3 text-yellow-950" />}
                    </div>
                  </div>

                  {selectedPaymentMethod === 'MTN_MOMO' && (
                    <div className="pt-3 border-t border-yellow-200/60">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        MTN MoMo Registered Phone Number:
                      </label>
                      <input
                        type="text"
                        value={phoneOrAccount}
                        onChange={e => setPhoneOrAccount(e.target.value)}
                        placeholder="077x xxx xxx or 078x xxx xxx"
                        className="w-full px-3 py-2 text-xs bg-white border border-yellow-400 rounded-lg outline-none font-bold text-slate-900"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Airtel Money */}
                <div
                  onClick={() => setSelectedPaymentMethod('AIRTEL_MONEY')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-3 ${
                    selectedPaymentMethod === 'AIRTEL_MONEY'
                      ? 'border-red-500 bg-red-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                        Airtel
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">
                          Airtel Money
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Direct USSD Push (*185#) to your Airtel Uganda handset.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedPaymentMethod === 'AIRTEL_MONEY'
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedPaymentMethod === 'AIRTEL_MONEY' && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  {selectedPaymentMethod === 'AIRTEL_MONEY' && (
                    <div className="pt-3 border-t border-red-200/60">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Airtel Money Phone Number:
                      </label>
                      <input
                        type="text"
                        value={phoneOrAccount}
                        onChange={e => setPhoneOrAccount(e.target.value)}
                        placeholder="070x xxx xxx or 075x xxx xxx"
                        className="w-full px-3 py-2 text-xs bg-white border border-red-400 rounded-lg outline-none font-bold text-slate-900"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Visa / Mastercard */}
                <div
                  onClick={() => setSelectedPaymentMethod('VISA_MASTERCARD')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-3 ${
                    selectedPaymentMethod === 'VISA_MASTERCARD'
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">
                          Visa / Mastercard Debit & Credit Card
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Processed via Stanbic Bank / Absa 3D-Secure gateway.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedPaymentMethod === 'VISA_MASTERCARD'
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedPaymentMethod === 'VISA_MASTERCARD' && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>

                {/* 4. Cash on Delivery */}
                <div
                  onClick={() => setSelectedPaymentMethod('CASH_ON_DELIVERY')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-3 ${
                    selectedPaymentMethod === 'CASH_ON_DELIVERY'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">
                          Cash on Delivery (COD)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Pay cash or mobile money directly to the rider upon parcel inspection.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedPaymentMethod === 'CASH_ON_DELIVERY'
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedPaymentMethod === 'CASH_ON_DELIVERY' && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay Now Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => setCurrentStep('ADDRESS')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address</span>
                </button>

                <button
                  onClick={handleExecutePayment}
                  className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay Remotely</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REAL-TIME PAYMENT PROCESSING & WEBHOOK CONSOLE */}
          {currentStep === 'PROCESSING' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                {paymentPhase === 'CONFIRMED' ? (
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
                ) : paymentPhase === 'FAILED' ? (
                  <AlertCircle className="w-10 h-10 text-red-600" />
                ) : (
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-700" />
                )}
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {paymentPhase === 'CONFIRMED'
                    ? 'Payment Confirmed & Order Created!'
                    : paymentPhase === 'FAILED'
                    ? 'Payment Verification Failed'
                    : 'Processing Secure Mobile Transaction...'}
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {paymentPhase === 'AWAITING_USSD'
                    ? `Please check your phone (${phoneOrAccount}) and input your Mobile Money secret PIN.`
                    : 'Interfacing with Uganda telecom switches & recording encrypted escrow ledger transaction.'}
                </p>
              </div>

              {/* Terminal Logs */}
              <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] text-left max-h-48 overflow-y-auto space-y-1.5 shadow-inner">
                {paymentLog.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-slate-500">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Area (4 cols) */}
        <div className="lg:col-span-4">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  );
};
