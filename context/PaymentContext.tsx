import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import {
  Payment, PaymentStatus, PayoutStatus, PaymentMethod,
  MOCK_PAYMENT_METHODS, mockPayments,
} from '@/data/mockPayments';
import { calculatePayment, generatePaymentId } from '@/lib/paymentHelpers';

interface CreatePaymentParams {
  eventId: string;
  applicationId: string;
  hostId: string;
  workerId: string;
  workerName: string;
  eventTitle: string;
  roleType: string;
  amountTotal: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

interface PaymentContextValue {
  payments: Payment[];
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  createPayment: (params: CreatePaymentParams) => Payment;
  authorizeAndHoldPayment: (paymentId: string) => Promise<Payment | null>;
  releasePayment: (paymentId: string) => Promise<Payment | null>;
  getPaymentsByEvent: (eventId: string) => Payment[];
  getPaymentsByWorker: (workerId: string) => Payment[];
  getPaymentsByHost: (hostId: string) => Payment[];
  getPaymentForApplication: (applicationId: string) => Payment | undefined;
}

const PaymentContext = createContext<PaymentContextValue | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(MOCK_PAYMENT_METHODS[0]);

  const createPayment = useCallback((params: CreatePaymentParams): Payment => {
    const { platformFee, workerPayout } = calculatePayment(params.amountTotal);
    const payment: Payment = {
      id: generatePaymentId(),
      eventId: params.eventId,
      applicationId: params.applicationId,
      hostId: params.hostId,
      workerId: params.workerId,
      workerName: params.workerName,
      eventTitle: params.eventTitle,
      roleType: params.roleType,
      amountTotal: params.amountTotal,
      platformFee,
      workerPayout,
      currency: 'USD',
      paymentStatus: 'draft',
      payoutStatus: 'not_started',
      paymentMethod: params.paymentMethod,
      createdAt: Date.now(),
      heldAt: null,
      completedAt: null,
      notes: params.notes || '',
    };
    setPayments(prev => [...prev, payment]);
    return payment;
  }, []);

  const authorizeAndHoldPayment = useCallback(async (paymentId: string): Promise<Payment | null> => {
    setPayments(prev =>
      prev.map(p => p.id === paymentId ? { ...p, paymentStatus: 'pending' as PaymentStatus } : p)
    );

    await new Promise(resolve => setTimeout(resolve, 800));

    setPayments(prev =>
      prev.map(p => p.id === paymentId ? { ...p, paymentStatus: 'processing' as PaymentStatus } : p)
    );

    await new Promise(resolve => setTimeout(resolve, 1200));

    let heldPayment: Payment | null = null;
    setPayments(prev =>
      prev.map(p => {
        if (p.id === paymentId) {
          const updated: Payment = {
            ...p,
            paymentStatus: 'held',
            payoutStatus: 'on_hold',
            heldAt: Date.now(),
          };
          heldPayment = updated;
          return updated;
        }
        return p;
      })
    );

    return heldPayment;
  }, []);

  const releasePayment = useCallback(async (paymentId: string): Promise<Payment | null> => {
    setPayments(prev =>
      prev.map(p => p.id === paymentId ? { ...p, paymentStatus: 'pending_release' as PaymentStatus } : p)
    );

    await new Promise(resolve => setTimeout(resolve, 600));

    let releasedPayment: Payment | null = null;
    setPayments(prev =>
      prev.map(p => {
        if (p.id === paymentId) {
          const updated: Payment = {
            ...p,
            paymentStatus: 'completed',
            payoutStatus: 'scheduled',
            completedAt: Date.now(),
          };
          releasedPayment = updated;
          return updated;
        }
        return p;
      })
    );

    return releasedPayment;
  }, []);

  const getPaymentsByEvent = useCallback((eventId: string) =>
    payments.filter(p => p.eventId === eventId), [payments]);

  const getPaymentsByWorker = useCallback((workerId: string) =>
    payments.filter(p => p.workerId === workerId), [payments]);

  const getPaymentsByHost = useCallback((hostId: string) =>
    payments.filter(p => p.hostId === hostId), [payments]);

  const getPaymentForApplication = useCallback((applicationId: string) =>
    payments.find(p => p.applicationId === applicationId), [payments]);

  const value = useMemo(() => ({
    payments,
    paymentMethods: MOCK_PAYMENT_METHODS,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    createPayment,
    authorizeAndHoldPayment,
    releasePayment,
    getPaymentsByEvent,
    getPaymentsByWorker,
    getPaymentsByHost,
    getPaymentForApplication,
  }), [payments, selectedPaymentMethod, createPayment, authorizeAndHoldPayment, releasePayment, getPaymentsByEvent, getPaymentsByWorker, getPaymentsByHost, getPaymentForApplication]);

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export function usePayments() {
  const context = useContext(PaymentContext);
  if (!context) throw new Error('usePayments must be used within PaymentProvider');
  return context;
}
