const PLATFORM_FEE_RATE = 0.02;

export function calculatePayment(total: number) {
  const platformFee = Math.round(total * PLATFORM_FEE_RATE * 100) / 100;
  const workerPayout = Math.round((total - platformFee) * 100) / 100;
  return { total, platformFee, workerPayout };
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function generatePaymentId(): string {
  return `pay_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
}

export function getPaymentMethodIcon(type: string): string {
  switch (type) {
    case 'visa': return 'card-outline';
    case 'mastercard': return 'card-outline';
    case 'bank': return 'business-outline';
    default: return 'wallet-outline';
  }
}

export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    pending: 'Authorizing',
    processing: 'Processing',
    held: 'Funds Secured',
    pending_release: 'Releasing',
    completed: 'Released',
    failed: 'Failed',
  };
  return labels[status] || status;
}

export function getPayoutStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    not_started: 'Not Started',
    on_hold: 'Held Pending',
    scheduled: 'Payout Scheduled',
    paid: 'Paid Out',
  };
  return labels[status] || status;
}
