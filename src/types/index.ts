export type CustomerPageView =
  | 'HOME'
  | 'CATEGORIES'
  | 'PRODUCT_LISTING'
  | 'PRODUCT_SEARCH'
  | 'PRODUCT_DETAILS'
  | 'WISHLIST'
  | 'CART'
  | 'CHECKOUT'
  | 'ORDER_CONFIRMATION'
  | 'MY_ORDERS'
  | 'ORDER_TRACKING'
  | 'PROFILE'
  | 'NOTIFICATIONS'
  | 'REVIEWS'
  | 'SUPPORT';

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  orderNumber?: string;
  category: 'DELIVERY' | 'PAYMENT_MOMO' | 'PRODUCT_QUALITY' | 'RETURN_REFUND' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'CUSTOMER' | 'SUPPORT_AGENT';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}


export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'READY_FOR_PICKUP'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'REFUNDED';

export type PaymentMethodType =
  | 'MTN_MOMO'
  | 'AIRTEL_MONEY'
  | 'VISA_MASTERCARD'
  | 'BANK_TRANSFER'
  | 'CASH_ON_DELIVERY';

export type PaymentStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  itemCount: number;
  featuredImage: string;
  description?: string;
}

export interface ProductVariant {
  id: string;
  variantName: string;
  sku: string;
  additionalPrice: number;
  stockQuantity: number;
  colorHex?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryId: string;
  brand: string;
  description: string;
  shortDescription: string;
  basePrice: number; // in UGX
  discountPrice?: number; // in UGX
  images: string[];
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  flashDealEnd?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  vendorId: string;
  vendorName: string;
  vendorLocation: string;
  variants?: ProductVariant[];
  specifications: Record<string, string>;
  warrantyInfo?: string;
  deliveryEstimatedHours?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  district: string;
  baseFee: number; // in UGX
  estimatedTime: string;
}

export interface DeliveryAddress {
  id: string;
  recipientName: string;
  phoneNumber: string;
  alternativePhone?: string;
  district: string;
  zoneId: string;
  zoneName: string;
  streetAddress: string;
  landmark: string; // e.g. "Opposite Total Station, Bukoto"
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  vendorId: string;
  vendorName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  assignedAgent?: {
    name: string;
    phone: string;
    vehiclePlate: string;
    vehicleType: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: RoleType;
  avatarUrl?: string;
  vendorInfo?: {
    businessName: string;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
    tinNumber: string;
    payoutPhone: string;
    commissionRate: number;
    rating: number;
  };
  deliveryInfo?: {
    vehicleType: string;
    licensePlate: string;
    activeZone: string;
    completedTrips: number;
  };
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
  minSpend: number;
  maxDiscount?: number;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'PROMO' | 'SYSTEM';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
