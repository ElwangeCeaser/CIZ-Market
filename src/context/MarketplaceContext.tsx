import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  DeliveryAddress,
  Order,
  OrderStatus,
  PaymentMethodType,
  RoleType,
  UserProfile,
  Coupon,
  NotificationItem,
  ProductVariant,
  Review,
  SupportTicketItem,
  CustomerPageView
} from '../types';
import {
  PRODUCTS as INITIAL_PRODUCTS,
  DELIVERY_ZONES,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  COUPONS,
  INITIAL_USER
} from '../data/mockData';
import { INITIAL_REVIEWS, INITIAL_TICKETS } from '../data/customerData';


interface MarketplaceContextType {
  // Products & Filtering
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (categorySlug: string) => void;
  priceFilter: [number, number];
  setPriceFilter: (range: [number, number]) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  setSortBy: (sort: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest') => void;
  filteredProducts: Product[];
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Addresses
  addresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress | null;
  setSelectedAddress: (addr: DeliveryAddress) => void;
  addAddress: (addr: Omit<DeliveryAddress, 'id'>) => void;
  
  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  
  // Delivery calculation
  selectedDeliveryFee: number;
  orderTotal: number;
  
  // Orders
  orders: Order[];
  createOrder: (paymentMethod: PaymentMethodType, paymentPhoneOrAccount?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  requestReturn: (orderId: string, reason: string) => void;
  
  // Multi-Role & Auth
  currentUser: UserProfile;
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Vendor Actions
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  
  // UI & Modals
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  
  // Notifications & Toast
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  markNotificationAsRead: (id: string) => void;
  // Reviews & Tickets
  reviews: Review[];
  addReview: (productId: string, rating: number, comment: string, title?: string) => void;
  supportTickets: SupportTicketItem[];
  createSupportTicket: (ticket: Omit<SupportTicketItem, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>, initialMessage: string) => void;
  addTicketMessage: (ticketId: string, text: string) => void;

  // View Navigation
  currentView: CustomerPageView;
  setCurrentView: (view: CustomerPageView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
}


const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ciz_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 2000000]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ciz_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('ciz_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
  });

  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    const saved = localStorage.getItem('ciz_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(
    addresses.find(a => a.isDefault) || addresses[0] || null
  );

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ciz_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [activeRole, setActiveRole] = useState<RoleType>('CUSTOMER');

  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Order En Route!',
      message: 'Your order CIZ-2026-89421 is out for delivery to Bukoto.',
      type: 'ORDER',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: 'notif-2',
      title: '5% MoMo Cashback Live',
      message: 'Pay with MTN or Airtel Money today and earn instant reward points.',
      type: 'PROMO',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // View Navigation
  const [currentView, setCurrentView] = useState<CustomerPageView>('HOME');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Reviews & Tickets
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('ciz_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicketItem[]>(() => {
    const saved = localStorage.getItem('ciz_support_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('ciz_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('ciz_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  const addReview = (productId: string, rating: number, comment: string, title?: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      author: currentUser.name,
      location: addresses[0]?.district || 'Kampala',
      rating,
      date: new Date().toISOString().split('T')[0],
      comment: title ? `${title}: ${comment}` : comment,
      verifiedPurchase: true
    };
    setReviews(prev => [newRev, ...prev]);

    // Update product rating and review count in products state
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const productRevs = [...reviews.filter(r => r.productId === productId), newRev];
          const newAvg =
            productRevs.reduce((sum, r) => sum + r.rating, 0) / productRevs.length;
          return {
            ...p,
            rating: Number(newAvg.toFixed(1)),
            reviewCount: p.reviewCount + 1
          };
        }
        return p;
      })
    );

    showToast('Review submitted successfully! Thank you for rating.');
    addNotification('Review Published', `Your rating for product has been recorded.`, 'SYSTEM');
  };

  const createSupportTicket = (
    ticket: Omit<SupportTicketItem, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>,
    initialMessage: string
  ) => {
    const newTicket: SupportTicketItem = {
      ...ticket,
      id: `tck-${Date.now()}`,
      ticketNumber: `TCK-UG-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'CUSTOMER',
          senderName: currentUser.name,
          text: initialMessage,
          timestamp: new Date().toISOString()
        }
      ]
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    showToast(`Support Ticket ${newTicket.ticketNumber} created.`);
    addNotification(
      'Support Ticket Received',
      `Our Ugandan support agent is reviewing ticket ${newTicket.ticketNumber}.`,
      'SYSTEM'
    );
  };

  const addTicketMessage = (ticketId: string, text: string) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'CUSTOMER' as const,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toISOString()
    };

    setSupportTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: new Date().toISOString(),
            status: 'OPEN' as const,
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      })
    );

    // Auto simulated response from support agent after 1.5s
    setTimeout(() => {
      const replyMsg = {
        id: `msg-reply-${Date.now()}`,
        sender: 'SUPPORT_AGENT' as const,
        senderName: 'CIZ Care Helpdesk',
        text: 'Thank you for the update. Our Kampala dispatch and accounting team has logged this note.',
        timestamp: new Date().toISOString()
      };
      setSupportTickets(prev =>
        prev.map(t => {
          if (t.id === ticketId) {
            return {
              ...t,
              updatedAt: new Date().toISOString(),
              messages: [...t.messages, replyMsg]
            };
          }
          return t;
        })
      );
      addNotification('Support Reply', 'CIZ Care agent responded to your ticket.', 'SYSTEM');
    }, 1500);
  };


  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('ciz_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ciz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ciz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('ciz_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('ciz_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'SYSTEM') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const selectedZone = selectedAddress
    ? DELIVERY_ZONES.find(z => z.id === selectedAddress.zoneId)
    : DELIVERY_ZONES[0];
  const selectedDeliveryFee = selectedZone ? selectedZone.baseFee : 4500;

  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minSpend) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = cartSubtotal * appliedCoupon.value;
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const orderTotal = Math.max(0, cartSubtotal + selectedDeliveryFee - discountAmount);

  // Cart actions
  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const unitPrice = (product.discountPrice || product.basePrice) + (variant?.additionalPrice || 0);
    const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * unitPrice
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedVariant: variant,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity
        }
      ];
    });

    showToast(`Added "${product.title.slice(0, 24)}..." to cart`);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Address Actions
  const addAddress = (newAddrData: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...newAddrData,
      id: `addr-${Date.now()}`
    };
    setAddresses(prev => [newAddr, ...prev]);
    setSelectedAddress(newAddr);
    showToast('New delivery address saved');
  };

  // Coupon Actions
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = COUPONS.find(c => c.code === cleanCode);
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    if (cartSubtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Order must be at least UGX ${coupon.minSpend.toLocaleString()} to use this coupon.`
      };
    }
    setAppliedCoupon(coupon);
    showToast(`Coupon "${cleanCode}" applied!`);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Create Order with Sandbox/Demo Payment Flow
  const createOrder = async (
    paymentMethod: PaymentMethodType,
    paymentPhoneOrAccount?: string
  ): Promise<Order> => {
    if (!selectedAddress) {
      throw new Error('Please specify a delivery address.');
    }

    const orderNumber = `CIZ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `CIZ-TRK-${Math.floor(10000 + Math.random() * 90000)}-UG`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser.id,
      customerName: selectedAddress.recipientName || currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: selectedAddress.phoneNumber || currentUser.phoneNumber,
      items: cart.map(item => ({
        id: `oi-${Date.now()}-${item.id}`,
        productId: item.product.id,
        productTitle: item.product.title,
        productImage: item.product.images[0],
        variantName: item.selectedVariant?.variantName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        vendorId: item.product.vendorId,
        vendorName: item.product.vendorName
      })),
      subtotal: cartSubtotal,
      deliveryFee: selectedDeliveryFee,
      discountAmount,
      totalAmount: orderTotal,
      deliveryAddress: selectedAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'SUCCESSFUL',
      orderStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PROCESSING' : 'PAID',
      trackingNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'PENDING_PAYMENT',
          timestamp: new Date().toISOString(),
          note: `Order placed online via ${paymentMethod.replace('_', ' ')} (${paymentPhoneOrAccount || 'Account'}).`
        },
        {
          status: paymentMethod === 'CASH_ON_DELIVERY' ? 'PROCESSING' : 'PAID',
          timestamp: new Date().toISOString(),
          note:
            paymentMethod === 'CASH_ON_DELIVERY'
              ? 'Cash on Delivery confirmed by dispatcher.'
              : `[DEMO PAYMENT SANDBOX] Payment verified instantly. Webhook payload received.`
        }
      ],
      assignedAgent: {
        name: 'Alex K. (Boda Express)',
        phone: '+256 779 555 123',
        vehiclePlate: 'UFB 312Z',
        vehicleType: 'Motorcycle Express'
      }
    };

    // Update order list
    setOrders(prev => [newOrder, ...prev]);
    // Clear cart & coupon
    clearCart();
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);

    // Notification
    addNotification(
      `Order ${orderNumber} Confirmed!`,
      `Your payment was processed. Track delivery with ${trackingNumber}.`,
      'ORDER'
    );
    showToast(`Order ${orderNumber} placed successfully!`);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updatedHistory = [
            ...ord.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: note || `Status updated to ${newStatus.replace('_', ' ')}.`
            }
          ];
          return {
            ...ord,
            orderStatus: newStatus,
            updatedAt: new Date().toISOString(),
            statusHistory: updatedHistory
          };
        }
        return ord;
      })
    );
    showToast(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
  };

  const cancelOrder = (orderId: string, reason: string) => {
    updateOrderStatus(orderId, 'CANCELLED', `Cancelled by user. Reason: ${reason}`);
    showToast('Order cancelled');
  };

  const requestReturn = (orderId: string, reason: string) => {
    updateOrderStatus(orderId, 'RETURN_REQUESTED', `Return requested. Reason: ${reason}`);
    showToast('Return request submitted');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    showToast('Profile updated');
  };

  // Vendor actions
  const addProduct = (prodData: Omit<Product, 'id' | 'slug' | 'rating' | 'reviewCount'>) => {
    const slug = prodData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      slug,
      rating: 5.0,
      reviewCount: 0
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast('New product published successfully!');
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updates } : p))
    );
    showToast('Product updated');
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product deactivated');
  };

  // Filtering Logic
  const filteredProducts = products.filter(p => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchCat && !matchDesc) return false;
    }

    // Category
    if (selectedCategory !== 'all') {
      const matchSlug = p.categoryId === selectedCategory || p.category.toLowerCase().replace(/[^a-z0-9]/g, '-') === selectedCategory;
      if (!matchSlug) return false;
    }

    // Price range
    const currentPrice = p.discountPrice || p.basePrice;
    if (currentPrice < priceFilter[0] || currentPrice > priceFilter[1]) {
      return false;
    }

    // Brand
    if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    const priceA = a.discountPrice || a.basePrice;
    const priceB = b.discountPrice || b.basePrice;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return 0;
  });

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceFilter,
        setPriceFilter,
        selectedBrand,
        setSelectedBrand,
        sortBy,
        setSortBy,
        filteredProducts,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartItemCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        selectedDeliveryFee,
        orderTotal,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        requestReturn,
        currentUser,
        activeRole,
        setActiveRole,
        updateUserProfile,
        addProduct,
        updateProduct,
        deleteProduct,
        activeProductModal,
        setActiveProductModal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeTrackingOrder,
        setActiveTrackingOrder,
        notifications,
        addNotification,
        markNotificationAsRead,
        toastMessage,
        showToast,
        reviews,
        addReview,
        supportTickets,
        createSupportTicket,
        addTicketMessage,
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        lastPlacedOrder,
        setLastPlacedOrder
      }}
    >

      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
