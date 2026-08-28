import { Review, SupportTicketItem } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    author: 'Ivan Kasule',
    location: 'Kampala CBD',
    rating: 5,
    date: '2026-08-20',
    comment: 'Sound quality and Active Noise Cancellation are super clear even in loud matatu traffic. Battery easily lasts 2 days!',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    author: 'Doreen Namubiru',
    location: 'Entebbe',
    rating: 4,
    date: '2026-08-15',
    comment: 'Fast delivery to Entebbe airport area in less than 4 hours. Good build quality with original warranty card.',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    author: 'Peter Opolot',
    location: 'Jinja',
    rating: 5,
    date: '2026-08-22',
    comment: 'The 4K resolution is astonishing. Tested with DSTV Stream and YouTube 4K, vivid colors and great soundbar pairing.',
    verifiedPurchase: true
  },
  {
    id: 'rev-4',
    productId: 'prod-4',
    author: 'Sarah Nalwanga',
    location: 'Kisaasi, Kampala',
    rating: 5,
    date: '2026-08-25',
    comment: 'Authentic 6-yard wax cotton with rich pigments. Tailored a wedding dress and got endless compliments.',
    verifiedPurchase: true
  },
  {
    id: 'rev-5',
    productId: 'prod-6',
    author: 'Grace Akello',
    location: 'Gulu / Kampala',
    rating: 5,
    date: '2026-08-26',
    comment: '100% pure raw Nilotica shea butter from Northern Uganda. Best natural moisturizer for dry weather.',
    verifiedPurchase: true
  },
  {
    id: 'rev-6',
    productId: 'prod-8',
    author: 'Moses Byaruhanga',
    location: 'Mbarara',
    rating: 5,
    date: '2026-08-21',
    comment: 'Very solid solar pump. Powers drip irrigation on 3 acres of horticulture without any grid power.',
    verifiedPurchase: true
  }
];

export const INITIAL_TICKETS: SupportTicketItem[] = [
  {
    id: 'tck-1',
    ticketNumber: 'TCK-UG-1094',
    userId: 'usr-customer-1',
    subject: 'Express Boda delivery time update for Bukoto',
    orderNumber: 'CIZ-2026-89421',
    category: 'DELIVERY',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '2026-08-28T08:30:00Z',
    updatedAt: '2026-08-28T09:20:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'CUSTOMER',
        senderName: 'Celestine Mugerwa',
        text: 'Hello, could you confirm if the rider can call my alternative line before arrival at Kabira Country Club?',
        timestamp: '2026-08-28T08:30:00Z'
      },
      {
        id: 'msg-2',
        sender: 'SUPPORT_AGENT',
        senderName: 'CIZ Care (Agnes)',
        text: 'Hello Celestine! Yes, we have added your instruction directly to Rider Brian Kigozi (UFA 489X). He is 15 minutes away.',
        timestamp: '2026-08-28T09:20:00Z'
      }
    ]
  },
  {
    id: 'tck-2',
    ticketNumber: 'TCK-UG-0892',
    userId: 'usr-customer-1',
    subject: 'MTN MoMo instant receipt query',
    category: 'PAYMENT_MOMO',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: '2026-08-20T14:10:00Z',
    updatedAt: '2026-08-20T14:45:00Z',
    messages: [
      {
        id: 'msg-3',
        sender: 'CUSTOMER',
        senderName: 'Celestine Mugerwa',
        text: 'Where can I download the VAT receipt with URA e-tax QR code for my company purchase?',
        timestamp: '2026-08-20T14:10:00Z'
      },
      {
        id: 'msg-4',
        sender: 'SUPPORT_AGENT',
        senderName: 'CIZ Care (Patrick)',
        text: 'Hello Celestine! Official e-FRIS tax invoices are generated automatically under My Orders > Order Details > Download Tax Invoice.',
        timestamp: '2026-08-20T14:45:00Z'
      }
    ]
  }
];
