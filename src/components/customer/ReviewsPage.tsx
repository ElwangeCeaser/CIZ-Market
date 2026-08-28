import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { RatingComponent } from '../common/RatingComponent';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Filter,
  Plus,
  ThumbsUp,
  MapPin
} from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { reviews, products, addReview, setCurrentView, setSelectedProductId } = useMarketplace();

  const [selectedProductIdFilter, setSelectedProductIdFilter] = useState<string>('ALL');
  const [minRating, setMinRating] = useState<number>(0);

  // New review state
  const [writeProdId, setWriteProdId] = useState(products[0]?.id || '');
  const [writeRating, setWriteRating] = useState(5);
  const [writeComment, setWriteComment] = useState('');
  const [writeTitle, setWriteTitle] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const filteredReviews = reviews.filter(r => {
    if (selectedProductIdFilter !== 'ALL' && r.productId !== selectedProductIdFilter) return false;
    if (minRating > 0 && r.rating < minRating) return false;
    return true;
  });

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeComment.trim()) return;
    addReview(writeProdId, writeRating, writeComment, writeTitle);
    setWriteComment('');
    setWriteTitle('');
    setShowReviewForm(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
            Community Feedback
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Verified Customer Ratings & Reviews
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Read transparent opinions from buyers across Kampala, Entebbe, Jinja, Mbarara, and Gulu.
          </p>
        </div>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-2xs self-start sm:self-auto uppercase tracking-wider"
        >
          <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Write a Review Modal / Expand Box */}
      {showReviewForm && (
        <form
          onSubmit={handleCreateReview}
          className="bg-white rounded-xl border-2 border-emerald-600 p-6 shadow-md space-y-4 text-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase">
              Submit Product Feedback
            </h3>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="text-slate-400 hover:text-slate-700 font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Select Product:</label>
              <select
                value={writeProdId}
                onChange={e => setWriteProdId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none font-medium"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Overall Rating:</label>
              <RatingComponent
                rating={writeRating}
                interactive={true}
                onRatingChange={r => setWriteRating(r)}
                size="lg"
                showCount={false}
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Review Title:</label>
            <input
              type="text"
              value={writeTitle}
              onChange={e => setWriteTitle(e.target.value)}
              placeholder="e.g. Excellent build quality, quick Boda dispatch"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Review Description:</label>
            <textarea
              rows={3}
              required
              value={writeComment}
              onChange={e => setWriteComment(e.target.value)}
              placeholder="Share honest details on performance, durability, packaging..."
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-black px-6 py-2.5 rounded-lg uppercase tracking-wider shadow-sm"
          >
            Post Review
          </button>
        </form>
      )}

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-700">Filter By Product:</span>
          <select
            value={selectedProductIdFilter}
            onChange={e => setSelectedProductIdFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none max-w-xs truncate"
          >
            <option value="ALL">All Marketplace Items ({reviews.length})</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Min Stars:</span>
          {[0, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setMinRating(star)}
              className={`px-2.5 py-1 rounded-md font-bold ${
                minRating === star
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {star === 0 ? 'All' : `${star}★ & Above`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map(rev => {
          const prod = products.find(p => p.id === rev.productId);
          return (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                {prod && (
                  <div
                    onClick={() => {
                      setSelectedProductId(prod.id);
                      setCurrentView('PRODUCT_DETAILS');
                    }}
                    className="flex items-center gap-2 pb-2 border-b border-slate-100 cursor-pointer group"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-8 h-8 rounded object-cover border border-slate-200"
                    />
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 line-clamp-1">
                      {prod.title}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{rev.author}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      Verified Buyer ({rev.location})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>

                <RatingComponent rating={rev.rating} size="sm" showCount={false} />

                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authenticated Purchase</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
