import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { SupportTicketItem } from '../../types';
import {
  Headphones,
  MessageSquare,
  Phone,
  Mail,
  Send,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export const CustomerSupportPage: React.FC = () => {
  const {
    supportTickets,
    createSupportTicket,
    addTicketMessage,
    currentUser,
    orders
  } = useMarketplace();

  const [activeTicketId, setActiveTicketId] = useState<string>(
    supportTickets[0]?.id || ''
  );
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  // New ticket state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicketItem['category']>('DELIVERY');
  const [orderNumber, setOrderNumber] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  // Chat message response state
  const [replyText, setReplyText] = useState('');

  const activeTicket = supportTickets.find(t => t.id === activeTicketId) || supportTickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMessage.trim()) return;

    createSupportTicket(
      {
        userId: currentUser.id,
        subject,
        category,
        priority: 'MEDIUM',
        status: 'OPEN',
        orderNumber: orderNumber || undefined
      },
      initialMessage
    );

    setSubject('');
    setInitialMessage('');
    setOrderNumber('');
    setShowNewTicketForm(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    addTicketMessage(activeTicket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">
              24/7 Dedicated Ugandan Helpdesk
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              CIZ Customer Care & Support
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Assisting you with remote Mobile Money confirmation, express Boda delivery instructions, order modifications, and warranty claims.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-emerald-300 uppercase font-bold block">Helpline</span>
                <span className="font-bold">+256 700 112 233</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500 text-yellow-950 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-yellow-300 uppercase font-bold block">Email Care</span>
                <span className="font-bold">support@cizmarket.ug</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Tickets Sidebar + Live Ticket Chat Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Tickets List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider">
              My Support Inquiries ({supportTickets.length})
            </h3>
            <button
              onClick={() => setShowNewTicketForm(!showNewTicketForm)}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Open Ticket</span>
            </button>
          </div>

          {/* New Ticket Inline Modal / Form */}
          {showNewTicketForm && (
            <form
              onSubmit={handleCreateTicket}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs"
            >
              <h4 className="font-black text-slate-900 uppercase">Create Support Inquiry</h4>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rider landmark clarification"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Inquiry Category:</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none"
                  >
                    <option value="DELIVERY">Delivery & Courier</option>
                    <option value="PAYMENT_MOMO">MTN/Airtel MoMo</option>
                    <option value="PRODUCT_QUALITY">Product Condition</option>
                    <option value="RETURN_REFUND">Return & Refund</option>
                    <option value="GENERAL">General Help</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Order # (Optional):</label>
                  <input
                    type="text"
                    placeholder="e.g. CIZ-2026-89421"
                    value={orderNumber}
                    onChange={e => setOrderNumber(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Message:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what you need help with..."
                  value={initialMessage}
                  onChange={e => setInitialMessage(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketForm(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          )}

          {/* Tickets list */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {supportTickets.map(t => {
              const isSelected = activeTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTicketId(t.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-emerald-800">{t.ticketNumber}</span>
                    <span
                      className={`px-2 py-0.2 rounded-full font-bold uppercase text-[9px] ${
                        t.status === 'RESOLVED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{t.subject}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {t.messages[t.messages.length - 1]?.text}
                  </p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Ticket Conversation Room (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 flex flex-col h-[580px] shadow-2xs overflow-hidden">
          {activeTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-emerald-800">
                      {activeTicket.ticketNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-slate-700">{activeTicket.category}</span>
                  </div>
                  <h3 className="font-black text-sm text-slate-900 mt-0.5">{activeTicket.subject}</h3>
                </div>

                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Status: {activeTicket.status}
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
                {activeTicket.messages.map(msg => {
                  const isMe = msg.sender === 'CUSTOMER';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                        <span className="font-bold text-slate-700">{msg.senderName}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-emerald-800 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendReply}
                className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your message to CIZ Care agent..."
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-600"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-slate-400 text-xs">
              Select or open a support ticket to start chatting with customer care.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
