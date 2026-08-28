import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { PaymentMethodType, DeliveryAddress } from '../../types';
import { DELIVERY_ZONES } from '../../data/mockData';
import { formatUGX } from '../../lib/formatters';
import {
  X,
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
  ArrowRight,
  Lock
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    selectedDeliveryFee,
    discountAmount,
    orderTotal,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    createOrder,
    setActiveTrackingOrder
  } = useMarketplace();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Address, 2: Payment, 3: Processing Demo Sandbox
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('MTN_MOMO');
  const [phoneOrAccount, setPhoneOrAccount] = useState('0772 123 456');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New address form state
  const [newRecipient, setNewRecipient] = useState('');
  const [newPhone, setNewPhone] = useState('+256 ');
  const [newDistrict, setNewDistrict] = useState('Kampala');
  const [newZoneId, setNewZoneId] = useState(DELIVERY_ZONES[0].id);
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  // Payment Processing Simulation state
  const [paymentStep, setPaymentStep] = useState<
    'INITIATING' | 'AWAITING_USSD' | 'WEBHOOK_VERIFYING' | 'CONFIRMED' | 'FAILED'
  >('INITIATING');
  const [paymentLog, setPaymentLog] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !newPhone || !newStreet || !newLandmark) {
      alert('Please fill in all address fields including a descriptive landmark.');
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

  const handleStartPayment = async () => {
    setStep(3);
    setIsProcessing(true);
    setPaymentLog([]);

    // Step 1: Initiating order
    setPaymentStep('INITIATING');
    setPaymentLog(prev => [
      ...prev,
      `[1/4] Backend creating pending order with ${selectedPaymentMethod}...`
    ]);

    await new Promise(r => setTimeout(r, 1000));

    // Step 2: USSD prompt simulation
    setPaymentStep('AWAITING_USSD');
    setPaymentLog(prev => [
      ...prev,
      selectedPaymentMethod === 'MTN_MOMO'
        ? `[2/4] [DEMO SANDBOX] MTN Mobile Money USSD prompt sent to ${phoneOrAccount} (*165#).`
        : selectedPaymentMethod === 'AIRTEL_MONEY'
        ? `[2/4] [DEMO SANDBOX] Airtel Money USSD prompt sent to ${phoneOrAccount} (*185#).`
        : `[2/4] [DEMO SANDBOX] Processing 3D-Secure payment token authorization...`
    ]);

    await new Promise(r => setTimeout(r, 1400));

    // Step 3: Webhook callback
    setPaymentStep('WEBHOOK_VERIFYING');
    setPaymentLog(prev => [
      ...prev,
      `[3/4] Secure webhook callback received from Ugandan payment provider.`
    ]);

    await new Promise(r => setTimeout(r, 1200));

    // Step 4: Verification & Order creation
    setPaymentStep('CONFIRMED');
    setPaymentLog(prev => [
      ...prev,
      `[4/4] Payment Verified! Order transitioned from PENDING_PAYMENT to PAID.`
    ]);

    try {
      const createdOrder = await createOrder(selectedPaymentMethod, phoneOrAccount);
      setIsProcessing(false);
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setActiveTrackingOrder(createdOrder);
      }, 1600);
    } catch (err: any) {
      setPaymentStep('FAILED');
      setPaymentLog(prev => [...prev, `Error: ${err?.message || 'Payment failed.'}`]);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-yellow-400" />
            <h2 className="text-base font-black tracking-tight">Express Checkout</h2>
          </div>
          <button
            onClick={() => !isProcessing && setIsCheckoutOpen(false)}
            disabled={isProcessing}
            className="p-1 rounded text-emerald-300 hover:text-white disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-emerald-800' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-emerald-700 text-white' : 'bg-slate-300'}`}>1</span>
            <span>Delivery Address</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-300"></div>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-emerald-800' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-emerald-700 text-white' : 'bg-slate-300'}`}>2</span>
            <span>Payment Method</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-300"></div>
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-800' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-emerald-700 text-white' : 'bg-slate-300'}`}>3</span>
            <span>Review & Pay</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: DELIVERY ADDRESS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Select Delivery Address
                </h3>
                {!isAddingNewAddress && (
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {isAddingNewAddress ? (
                <form onSubmit={handleSaveNewAddress} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 text-xs">
                  <div className="font-bold text-slate-800 border-b pb-1">New Ugandan Delivery Location</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Recipient Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newRecipient}
                        onChange={e => setNewRecipient(e.target.value)}
                        placeholder="e.g. Celestine Mugerwa"
                        className="w-full p-2 border rounded bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Phone Number (MTN/Airtel) *</label>
                      <input
                        type="text"
                        required
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        placeholder="+256 772 123 456"
                        className="w-full p-2 border rounded bg-white text-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">District / Town *</label>
                      <input
                        type="text"
                        required
                        value={newDistrict}
                        onChange={e => setNewDistrict(e.target.value)}
                        placeholder="Kampala / Wakiso / Jinja"
                        className="w-full p-2 border rounded bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Delivery Zone *</label>
                      <select
                        value={newZoneId}
                        onChange={e => setNewZoneId(e.target.value)}
                        className="w-full p-2 border rounded bg-white text-slate-800"
                      >
                        {DELIVERY_ZONES.map(z => (
                          <option key={z.id} value={z.id}>
                            {z.name} (+{formatUGX(z.baseFee)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Street / Village / Area *</label>
                    <input
                      type="text"
                      required
                      value={newStreet}
                      onChange={e => setNewStreet(e.target.value)}
                      placeholder="e.g. Plot 14, Old Kira Road, Bukoto"
                      className="w-full p-2 border rounded bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Prominent Landmark * (Crucial for Ugandan Dispatch Riders)
                    </label>
                    <input
                      type="text"
                      required
                      value={newLandmark}
                      onChange={e => setNewLandmark(e.target.value)}
                      placeholder="e.g. Opposite TotalEnergies station, near Kabira Country Club gate"
                      className="w-full p-2 border rounded bg-white text-slate-800"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-800 text-white font-bold rounded hover:bg-emerald-900"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2.5">
                  {addresses.map(addr => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="mt-0.5">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setSelectedAddress(addr)}
                            className="text-emerald-700 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{addr.recipientName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{addr.phoneNumber}</span>
                          </div>
                          <p className="text-slate-700 mt-1 font-medium">{addr.streetAddress}, {addr.district}</p>
                          <p className="text-emerald-800 text-[11px] font-semibold mt-0.5">
                            📍 Landmark: {addr.landmark}
                          </p>
                          <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded mt-1.5 font-medium">
                            {addr.zoneName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedAddress}
                  onClick={() => setStep(2)}
                  className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Select Remote Payment Option
                </h3>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Demo Sandbox Active
                </span>
              </div>

              {/* Payment Methods Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* MTN MoMo */}
                <div
                  onClick={() => setSelectedPaymentMethod('MTN_MOMO')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPaymentMethod === 'MTN_MOMO'
                      ? 'bg-yellow-50/70 border-yellow-500 ring-2 ring-yellow-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-yellow-500 inline-block"></span>
                      <span className="font-black text-slate-900">MTN Mobile Money</span>
                    </div>
                    <input
                      type="radio"
                      checked={selectedPaymentMethod === 'MTN_MOMO'}
                      onChange={() => setSelectedPaymentMethod('MTN_MOMO')}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Instant USSD push prompt on 077/078 numbers.
                  </p>
                </div>

                {/* Airtel Money */}
                <div
                  onClick={() => setSelectedPaymentMethod('AIRTEL_MONEY')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPaymentMethod === 'AIRTEL_MONEY'
                      ? 'bg-red-50/70 border-red-500 ring-2 ring-red-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-red-600 inline-block"></span>
                      <span className="font-black text-slate-900">Airtel Money</span>
                    </div>
                    <input
                      type="radio"
                      checked={selectedPaymentMethod === 'AIRTEL_MONEY'}
                      onChange={() => setSelectedPaymentMethod('AIRTEL_MONEY')}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Instant USSD PIN prompt on 070/075 numbers.
                  </p>
                </div>

                {/* Visa / Master */}
                <div
                  onClick={() => setSelectedPaymentMethod('VISA_MASTERCARD')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPaymentMethod === 'VISA_MASTERCARD'
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-700" />
                      <span className="font-black text-slate-900">Visa / Mastercard</span>
                    </div>
                    <input
                      type="radio"
                      checked={selectedPaymentMethod === 'VISA_MASTERCARD'}
                      onChange={() => setSelectedPaymentMethod('VISA_MASTERCARD')}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Ugandan & international debit/credit cards with 3D Secure.
                  </p>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setSelectedPaymentMethod('CASH_ON_DELIVERY')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPaymentMethod === 'CASH_ON_DELIVERY'
                      ? 'bg-slate-100 border-slate-500 ring-2 ring-slate-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-slate-700" />
                      <span className="font-black text-slate-900">Cash on Delivery</span>
                    </div>
                    <input
                      type="radio"
                      checked={selectedPaymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={() => setSelectedPaymentMethod('CASH_ON_DELIVERY')}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Pay in cash directly to the dispatch agent upon doorstep verification.
                  </p>
                </div>
              </div>

              {/* Phone / Account prompt for MoMo */}
              {(selectedPaymentMethod === 'MTN_MOMO' || selectedPaymentMethod === 'AIRTEL_MONEY') && (
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                  <label className="block font-bold text-slate-800 mb-1">
                    {selectedPaymentMethod === 'MTN_MOMO' ? 'MTN Phone Number' : 'Airtel Phone Number'} for Remote Push
                  </label>
                  <input
                    type="text"
                    value={phoneOrAccount}
                    onChange={e => setPhoneOrAccount(e.target.value)}
                    placeholder="e.g. 0772 123 456"
                    className="w-full p-2 border rounded bg-white text-slate-900 font-mono text-sm"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    You will receive a prompt on your phone asking you to enter your PIN to approve the transaction.
                  </span>
                </div>
              )}

              {/* Order Summary Recap */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Cart Items ({cart.length})</span>
                  <span>{formatUGX(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery to {selectedAddress?.district || 'Kampala'}</span>
                  <span>{formatUGX(selectedDeliveryFee)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Voucher Discount</span>
                    <span>-{formatUGX(discountAmount)}</span>
                  </div>
                )}
                <div className="border-t pt-1.5 flex justify-between text-sm font-black text-slate-900">
                  <span>Payable Total</span>
                  <span className="text-emerald-800">{formatUGX(orderTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartPayment}
                  className="bg-yellow-500 hover:bg-yellow-400 text-emerald-950 font-black px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Pay {formatUGX(orderTotal)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DEMO SANDBOX PAYMENT SIMULATION */}
          {step === 3 && (
            <div className="space-y-5 text-center py-4">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-yellow-300">
                <AlertCircle className="w-4 h-4 text-yellow-700" />
                <span>DEMO PAYMENT (SANDBOX MODE)</span>
              </div>

              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-emerald-700 animate-spin mb-3" />
                  <h3 className="text-base font-black text-slate-900">
                    {paymentStep === 'INITIATING' && 'Initiating Remote Gateway Request...'}
                    {paymentStep === 'AWAITING_USSD' && 'Simulating Mobile Money Push to Phone...'}
                    {paymentStep === 'WEBHOOK_VERIFYING' && 'Verifying Provider Webhook Callback...'}
                    {paymentStep === 'CONFIRMED' && 'Payment Verified & Order Generated!'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    In a production environment, this triggers a real Ugandan MoMo API webhook and dispatches riders instantly.
                  </p>
                </div>
              ) : paymentStep === 'CONFIRMED' ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Payment Successfully Verified!</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your order has been assigned to a Kampala dispatch rider. Opening live tracking...
                  </p>
                </div>
              ) : null}

              {/* Event Logs Console */}
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-[11px] text-left space-y-1.5 border border-slate-800 shadow-inner max-h-48 overflow-y-auto">
                <div className="text-slate-400 text-[10px] uppercase border-b border-slate-800 pb-1">
                  Payment Gateway Log Stream:
                </div>
                {paymentLog.map((log, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
