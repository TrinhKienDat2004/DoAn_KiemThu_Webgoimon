import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import axios from 'axios';
import { Minus, Plus, X, Flame, Beaker, Star, MessageSquare } from 'lucide-react';

const ProductModal = ({ item, onClose }) => {
  const addToCart = useStore((state) => state.addToCart);
  
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState('Vừa'); // Tùy chọn cay
  const [iceLevel, setIceLevel] = useState('Bình Thường'); // Tùy chọn đá
  const [notes, setNotes] = useState('');
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      fetchReviews();
    }
  }, [item]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${item.id}`);
      setReviews(res.data);
    } catch (error) {
      console.error("Lỗi lấy đánh giá", error);
    }
  };

  const handleAddReview = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        food_item_id: item.id,
        rating: userRating,
        comment: userComment
      });
      setUserComment('');
      setShowAddReview(false);
      fetchReviews();
    } catch (error) {
      alert("Lỗi khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  const isDrink = item.category_id === 3; // Giả định id=3 là đồ uống
  const isFood = item.category_id === 1 || item.category_id === 2;

  const handleAdd = () => {
    addToCart({
      ...item,
      quantity,
      spiceLevel: isFood ? spiceLevel : null,
      iceLevel: isDrink ? iceLevel : null,
      notes
    });
    onClose();
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-gray-900/60 backdrop-blur-sm p-4 animate-slide-up">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Image */}
        <div className="h-48 w-full bg-gray-200 relative">
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
            <p className="text-gray-500 mt-1">{item.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-xl font-bold text-orange-500">{formatPrice(item.price)}</p>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                  <span className="text-gray-400 font-normal ml-1">({reviews.length})</span>
                </div>
              )}
            </div>
          </div>

          {/* Options: Spicy Level (If Food) */}
          {isFood && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500"/> Mức Độ Cay
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {['Không Cay', 'Vừa', 'Cay', 'Rất Cay'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSpiceLevel(level)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      spiceLevel === level ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Options: Ice Level (If Drink) */}
          {isDrink && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-blue-500"/> Lượng Đá
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {['Không Đá', 'Ít', 'Bình Thường', 'Nhiều'].map(level => (
                  <button
                    key={level}
                    onClick={() => setIceLevel(level)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      iceLevel === level ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Ghi chú đặc biệt</h3>
            <textarea
              placeholder="VD: Không hành, ít đường..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none resize-none h-16"
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
            <span className="font-semibold text-gray-800">Số lượng</span>
            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 px-3 text-gray-500 hover:text-orange-500 transition-colors"
              >
                <Minus className="w-5 h-5"/>
              </button>
              <span className="font-bold w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 px-3 text-gray-500 hover:text-orange-500 transition-colors"
              >
                <Plus className="w-5 h-5"/>
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400"/> Nhận xét ({reviews.length})
              </h3>
              <button 
                onClick={() => setShowAddReview(!showAddReview)}
                className="text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                {showAddReview ? 'Hủy' : 'Viết đánh giá'}
              </button>
            </div>

            {showAddReview && (
              <div className="bg-orange-50 p-4 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">Đánh giá:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setUserRating(star)}>
                        <Star className={`w-6 h-6 ${star <= userRating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Chia sẻ cảm nhận của bạn về món này..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none h-20"
                />
                <button
                  disabled={isSubmitting}
                  onClick={handleAddReview}
                  className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            )}

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-gray-800">{review.customer_name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {new Date(review.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))}
              {reviews.length === 0 && !showAddReview && (
                <p className="text-center text-gray-400 text-sm py-4">Chưa có nhận xét nào cho món này.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Fix */}
        <div className="p-4 bg-white border-t border-gray-100 pb-8 sm:pb-4">
          <button 
            onClick={handleAdd}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:-translate-y-0.5 transition-transform flex items-center justify-between px-6"
          >
            <span>Thêm vào giỏ</span>
            <span>{formatPrice(item.price * quantity)}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;

