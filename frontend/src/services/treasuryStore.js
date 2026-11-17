// treasuryStore.js - Admin Financial & Store Money Hold Management
// Manages store revenue, escrow, holding sales money, release controls, and payout settlements.

const TREASURY_STORAGE_KEY = 'shop_treasury_control';

const DEFAULT_TREASURY = {
  masterHold: false,
  masterHoldReason: '',
  masterHoldUpdatedAt: null,
  orderHolds: {
    'ORD-2026-84192': {
      status: 'ON_HOLD',
      reason: 'Awaiting customer delivery confirmation & size inspection',
      updatedAt: 'Today, 10:15 AM',
      heldBy: 'admin@shop.com'
    }
  },
  bankAccount: {
    bankName: 'Bank Muscat (S.A.O.G)',
    accountName: 'Shop Executive Merchant Account',
    accountNumber: '0423-8891-4412-001',
    iban: 'OM92BMSO000000000042388914412001',
    swift: 'BMSOOMRX',
    branch: 'Salalah Central Branch, Dhofar'
  },
  payouts: [
    {
      id: 'PAY-2026-001',
      date: '10 Nov 2026, 02:30 PM',
      amount: '35.000',
      status: 'COMPLETED',
      destination: 'Bank Muscat (...001)',
      reference: 'TXN-BM-918231',
      initiatedBy: 'admin@shop.com'
    }
  ],
  auditLogs: [
    {
      id: 1,
      timestamp: 'Today, 10:15 AM',
      action: 'ORDER_FUNDS_HELD',
      orderNumber: 'ORD-2026-84192',
      amount: '9.000',
      note: 'Placed order funds on temporary security hold pending delivery.',
      admin: 'admin@shop.com'
    },
    {
      id: 2,
      timestamp: '10 Nov 2026, 02:30 PM',
      action: 'PAYOUT_SETTLED',
      amount: '35.000',
      note: 'Settled cleared store sales earnings to Bank Muscat account.',
      admin: 'admin@shop.com'
    }
  ]
};

export function getTreasuryState() {
  try {
    const raw = localStorage.getItem(TREASURY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_TREASURY,
        ...parsed,
        orderHolds: { ...DEFAULT_TREASURY.orderHolds, ...(parsed.orderHolds || {}) }
      };
    }
  } catch (e) {
    console.warn('Failed to load treasury state from localStorage:', e);
  }
  return { ...DEFAULT_TREASURY };
}

function saveTreasuryState(state) {
  try {
    localStorage.setItem(TREASURY_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('shop-treasury-updated', { detail: state }));
  } catch (e) {
    console.warn('Failed to save treasury state:', e);
  }
}

/**
 * Master Toggle: Put entire store account on hold (Freeze all store payouts) or Release hold
 */
export function setMasterAccountHold(isHeld, reason = '') {
  const current = getTreasuryState();
  const updated = {
    ...current,
    masterHold: Boolean(isHeld),
    masterHoldReason: isHeld ? (reason || 'Manual Admin security hold placed on store sales funds.') : '',
    masterHoldUpdatedAt: new Date().toLocaleString(),
    auditLogs: [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
        action: isHeld ? 'MASTER_ACCOUNT_HOLD_ENABLED' : 'MASTER_ACCOUNT_HOLD_RELEASED',
        amount: 'ALL_STORE_FUNDS',
        note: isHeld
          ? `Store sales earnings frozen. Reason: ${reason || 'Admin Security Hold'}`
          : 'Store sales earnings released. Account restored to Active Payouts.',
        admin: 'admin@shop.com'
      },
      ...current.auditLogs
    ]
  };

  saveTreasuryState(updated);
  return updated;
}

/**
 * Hold or Release funds for a specific customer order / sale
 */
export function setOrderFundsHold(orderNumber, isHeld, reason = '', orderAmount = '0.000') {
  const current = getTreasuryState();
  const orderHolds = { ...current.orderHolds };

  if (isHeld) {
    orderHolds[orderNumber] = {
      status: 'ON_HOLD',
      reason: reason || 'Admin review / delivery verification hold',
      updatedAt: 'Just now',
      heldBy: 'admin@shop.com'
    };
  } else {
    orderHolds[orderNumber] = {
      status: 'CLEARED',
      reason: reason || 'Hold released by Admin',
      updatedAt: 'Just now',
      heldBy: 'admin@shop.com'
    };
  }

  const updated = {
    ...current,
    orderHolds,
    auditLogs: [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
        action: isHeld ? 'ORDER_FUNDS_HELD' : 'ORDER_FUNDS_RELEASED',
        orderNumber,
        amount: orderAmount,
        note: isHeld
          ? `Placed sale funds for ${orderNumber} on hold. Reason: ${reason || 'Admin review'}`
          : `Released funds for ${orderNumber} to cleared store balance.`,
        admin: 'admin@shop.com'
      },
      ...current.auditLogs
    ]
  };

  saveTreasuryState(updated);
  return updated;
}

/**
 * Process a payout / transfer of cleared store money to the merchant bank account
 */
export function executeStorePayout(amount, note = '') {
  const current = getTreasuryState();
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Please enter a valid payout amount.');
  }

  const newPayout = {
    id: `PAY-2026-${Math.floor(100 + Math.random() * 900)}`,
    date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    amount: numAmount.toFixed(3),
    status: 'COMPLETED',
    destination: `${current.bankAccount.bankName} (...${current.bankAccount.accountNumber.slice(-4)})`,
    reference: `TXN-BM-${Math.floor(100000 + Math.random() * 900000)}`,
    initiatedBy: 'admin@shop.com',
    note: note || 'Store sales earnings withdrawal'
  };

  const updated = {
    ...current,
    payouts: [newPayout, ...current.payouts],
    auditLogs: [
      {
        id: Date.now(),
        timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: 'PAYOUT_TRANSFERRED',
        amount: numAmount.toFixed(3),
        note: `Transferred OMR ${numAmount.toFixed(3)} to ${current.bankAccount.bankName}. Ref: ${newPayout.reference}`,
        admin: 'admin@shop.com'
      },
      ...current.auditLogs
    ]
  };

  saveTreasuryState(updated);
  return updated;
}

/**
 * Compute real-time financial balance, hold statistics, and order money breakdowns
 */
export function calculateTreasuryMetrics(orders = [], treasuryState = null) {
  const state = treasuryState || getTreasuryState();
  
  let grossSales = 0;
  let clearedFunds = 0;
  let heldFunds = 0;
  let pendingCODFunds = 0;

  const orderBreakdowns = orders.map((o) => {
    const amt = parseFloat(o.totalAmount || 0);
    grossSales += amt;

    const specificHold = state.orderHolds[o.orderNumber];
    let moneyStatus = 'CLEARED';

    if (state.masterHold) {
      moneyStatus = 'ON_HOLD';
      heldFunds += amt;
    } else if (specificHold && specificHold.status === 'ON_HOLD') {
      moneyStatus = 'ON_HOLD';
      heldFunds += amt;
    } else if (o.paymentStatus === 'PAID') {
      moneyStatus = 'CLEARED';
      clearedFunds += amt;
    } else if (o.paymentMethod === 'Cash on Delivery' && o.paymentStatus !== 'PAID') {
      moneyStatus = 'PENDING_COD';
      pendingCODFunds += amt;
    } else {
      moneyStatus = 'CLEARED';
      clearedFunds += amt;
    }

    return {
      ...o,
      moneyStatus,
      holdReason: specificHold ? specificHold.reason : (state.masterHold ? 'Store-Wide Account Hold' : ''),
      holdDate: specificHold ? specificHold.updatedAt : null
    };
  });

  const totalWithdrawn = (state.payouts || []).reduce(
    (sum, p) => sum + parseFloat(p.amount || 0),
    0
  );

  const availableForWithdrawal = Math.max(0, clearedFunds - totalWithdrawn);

  return {
    masterHold: state.masterHold,
    masterHoldReason: state.masterHoldReason,
    grossSales: grossSales.toFixed(3),
    heldFunds: heldFunds.toFixed(3),
    clearedFunds: clearedFunds.toFixed(3),
    totalWithdrawn: totalWithdrawn.toFixed(3),
    availableForWithdrawal: availableForWithdrawal.toFixed(3),
    pendingCODFunds: pendingCODFunds.toFixed(3),
    ordersWithMoneyStatus: orderBreakdowns,
    bankAccount: state.bankAccount,
    payouts: state.payouts,
    auditLogs: state.auditLogs
  };
}
