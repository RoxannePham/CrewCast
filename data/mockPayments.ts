export type PaymentStatus = 'draft' | 'pending' | 'processing' | 'held' | 'pending_release' | 'completed' | 'failed';
export type PayoutStatus = 'not_started' | 'on_hold' | 'scheduled' | 'paid';

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'bank';
  label: string;
  last4: string;
}

export interface Payment {
  id: string;
  eventId: string;
  applicationId: string;
  hostId: string;
  workerId: string;
  workerName: string;
  eventTitle: string;
  roleType: string;
  amountTotal: number;
  platformFee: number;
  workerPayout: number;
  currency: string;
  paymentStatus: PaymentStatus;
  payoutStatus: PayoutStatus;
  paymentMethod: PaymentMethod;
  createdAt: number;
  heldAt: number | null;
  completedAt: number | null;
  notes: string;
}

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm1', type: 'visa', label: 'Visa ending in 4242', last4: '4242' },
  { id: 'pm2', type: 'mastercard', label: 'Mastercard ending in 1881', last4: '1881' },
  { id: 'pm3', type: 'bank', label: 'Bank Account ending in 2045', last4: '2045' },
];

export const mockPayments: Payment[] = [
  {
    id: 'pay1',
    eventId: 'e1',
    applicationId: 'a2',
    hostId: 'h1',
    workerId: 'w2',
    workerName: 'Maya Chen',
    eventTitle: 'NYU Spring Formal',
    roleType: 'Photographer',
    amountTotal: 200,
    platformFee: 4,
    workerPayout: 196,
    currency: 'USD',
    paymentStatus: 'completed',
    payoutStatus: 'paid',
    paymentMethod: MOCK_PAYMENT_METHODS[0],
    createdAt: Date.now() - 172800000,
    heldAt: Date.now() - 172400000,
    completedAt: Date.now() - 172000000,
    notes: '',
  },
  {
    id: 'pay2',
    eventId: 'e2',
    applicationId: 'a10',
    hostId: 'h2',
    workerId: 'w12',
    workerName: 'David Okafor',
    eventTitle: 'Columbia Business Mixer',
    roleType: 'Bartender',
    amountTotal: 150,
    platformFee: 3,
    workerPayout: 147,
    currency: 'USD',
    paymentStatus: 'held',
    payoutStatus: 'on_hold',
    paymentMethod: MOCK_PAYMENT_METHODS[1],
    createdAt: Date.now() - 86400000,
    heldAt: Date.now() - 85000000,
    completedAt: null,
    notes: '',
  },
];
