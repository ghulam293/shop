// orderStore.js - Centralized, reactive order store connecting customer checkouts to Admin Panel in real time

const STORAGE_KEY = 'shop_admin_orders';
const CUSTOMER_ORDERS_KEY = 'ips_orders';

export const INITIAL_ORDERS = [
  {
    id: 1,
    orderNumber: 'ORD-2026-92810',
    customerName: 'Salim Al-Shanfari',
    customerPhone: '+968 9123 4567',
    customerEmail: 'salim.shanfari@gmail.com',
    itemsCount: 3,
    itemsSummary: 'Polo Shirt (M), Boys Trousers (30), Belt',
    totalAmount: '16.500',
    paymentMethod: 'Debit Card',
    paymentStatus: 'PAID',
    status: 'PENDING',
    fulfillment: 'Store Pickup',
    createdAt: 'Today, 11:40 AM'
  },
  {
    id: 2,
    orderNumber: 'ORD-2026-84192',
    customerName: 'Fatima Al-Kathiri',
    customerPhone: '+968 9234 5678',
    customerEmail: 'fatima.kathiri@hotmail.com',
    itemsCount: 2,
    itemsSummary: 'Girls Skirt (28), White Socks (M)',
    totalAmount: '9.000',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'PENDING_CASH',
    status: 'PROCESSING',
    fulfillment: 'Home Delivery',
    createdAt: 'Today, 09:15 AM'
  },
  {
    id: 3,
    orderNumber: 'ORD-2026-71049',
    customerName: 'Mohammed Al-Rawas',
    customerPhone: '+968 9345 6789',
    customerEmail: 'm.rawas@omantel.net.om',
    itemsCount: 4,
    itemsSummary: 'School Backpack, Scientific Calculator, Geometry Set',
    totalAmount: '25.500',
    paymentMethod: 'Debit Card',
    paymentStatus: 'PAID',
    status: 'READY_FOR_PICKUP',
    fulfillment: 'Store Pickup',
    createdAt: 'Yesterday, 04:20 PM'
  },
  {
    id: 4,
    orderNumber: 'ORD-2026-65412',
    customerName: 'Aisha Al-Balushi',
    customerPhone: '+968 9456 7890',
    customerEmail: 'aisha.balushi@outlook.com',
    itemsCount: 2,
    itemsSummary: 'Insulated Lunch Box Set, Water Bottle',
    totalAmount: '5.500',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'PENDING_CASH',
    status: 'COMPLETED',
    fulfillment: 'Home Delivery',
    createdAt: 'Yesterday, 01:10 PM'
  },
  {
    id: 5,
    orderNumber: 'ORD-2026-54321',
    customerName: 'Khalid Al-Marhoon',
    customerPhone: '+968 9567 8901',
    customerEmail: 'khalid.marhoon@yahoo.com',
    itemsCount: 3,
    itemsSummary: 'Athletics Training Shoes (38), Gym Bag, Socks',
    totalAmount: '12.500',
    paymentMethod: 'Debit Card',
    paymentStatus: 'PAID',
    status: 'COMPLETED',
    fulfillment: 'Store Pickup',
    createdAt: '11 Nov 2026'
  },
  {
    id: 6,
    orderNumber: 'ORD-2026-43219',
    customerName: 'Salim Al-Shanfari',
    customerPhone: '+968 9123 4567',
    customerEmail: 'salim.shanfari@gmail.com',
    itemsCount: 2,
    itemsSummary: 'School Blazer Jacket (36), Tie',
    totalAmount: '28.000',
    paymentMethod: 'Debit Card',
    paymentStatus: 'PAID',
    status: 'COMPLETED',
    fulfillment: 'Store Pickup',
    createdAt: '09 Nov 2026'
  }
];

export function getAllStoreOrders() {
  try {
    let adminOrders = [];
    const rawAdmin = localStorage.getItem(STORAGE_KEY);
    if (rawAdmin) {
      try {
        adminOrders = JSON.parse(rawAdmin);
      } catch (_) {
        adminOrders = [];
      }
    }

    if (!Array.isArray(adminOrders) || adminOrders.length === 0) {
      adminOrders = [...INITIAL_ORDERS];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminOrders));
    }

    // Merge with any customer orders placed in ips_orders
    const rawCustomerOrders = localStorage.getItem(CUSTOMER_ORDERS_KEY);
    if (rawCustomerOrders) {
      try {
        const custOrders = JSON.parse(rawCustomerOrders);
        if (Array.isArray(custOrders)) {
          const existingNumbers = new Set(adminOrders.map(o => o.orderNumber));
          let changed = false;

          for (const co of custOrders) {
            const num = co.orderNumber || `ORD-${co.id}`;
            if (!existingNumbers.has(num)) {
              existingNumbers.add(num);
              const itemsList = Array.isArray(co.items) ? co.items : [];
              const itemsCount = itemsList.reduce((sum, item) => sum + (item.quantity || 1), 0) || (co.itemsCount || 1);
              const itemsSummary = itemsList.length > 0
                ? itemsList.map(item => `${item.nameEn || item.name || 'Product'} (${item.size || 'Standard'}) x${item.quantity || 1}`).join(', ')
                : (co.itemsSummary || 'Customer Order Items');

              const normalized = {
                id: co.id || Date.now() + Math.floor(Math.random() * 1000),
                orderNumber: num,
                customerName: co.customerName || co.customer || 'Customer',
                customerPhone: co.customerPhone || co.deliveryPhone || '+968 91 000000',
                customerEmail: co.customerEmail || 'customer@shop.com',
                itemsCount,
                itemsSummary,
                totalAmount: (parseFloat(co.total || co.totalAmount || 0)).toFixed(3),
                paymentMethod: co.paymentMethod || 'Debit Card',
                paymentStatus: co.paymentStatus || 'PAID',
                status: co.status || 'PENDING',
                fulfillment: co.customerAddress ? 'Home Delivery' : 'Store Pickup',
                createdAt: co.createdAt || co.date || 'Today, Just now'
              };

              adminOrders.unshift(normalized);
              changed = true;
            }
          }

          if (changed) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(adminOrders));
          }
        }
      } catch (_) {}
    }

    return adminOrders;
  } catch (err) {
    console.warn('Error reading store orders:', err);
    return [...INITIAL_ORDERS];
  }
}

export function addNewCustomerOrder(newOrder) {
  try {
    const list = getAllStoreOrders();
    const itemsList = Array.isArray(newOrder.items) ? newOrder.items : [];
    const itemsCount = itemsList.reduce((sum, item) => sum + (item.quantity || 1), 0) || (newOrder.itemsCount || 1);
    const itemsSummary = itemsList.length > 0
      ? itemsList.map(item => `${item.nameEn || item.name || 'Product'} (${item.size || 'Standard'}) x${item.quantity || 1}`).join(', ')
      : (newOrder.itemsSummary || 'Customer Order Items');

    const normalized = {
      id: newOrder.id || Date.now(),
      orderNumber: newOrder.orderNumber || `ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: newOrder.customerName || 'Customer',
      customerPhone: newOrder.customerPhone || '+968 91 000000',
      customerEmail: newOrder.customerEmail || 'customer@shop.com',
      itemsCount,
      itemsSummary,
      totalAmount: (parseFloat(newOrder.total || newOrder.totalAmount || 0)).toFixed(3),
      paymentMethod: newOrder.paymentMethod || 'Debit Card',
      paymentStatus: newOrder.paymentStatus || 'PAID',
      status: newOrder.status || 'PENDING',
      fulfillment: newOrder.customerAddress ? 'Home Delivery' : 'Store Pickup',
      createdAt: newOrder.createdAt || newOrder.date || 'Today, Just now'
    };

    // Prepend to top of list
    const updated = [normalized, ...list.filter(o => o.orderNumber !== normalized.orderNumber)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also sync to customer ips_orders
    try {
      const existingCust = JSON.parse(localStorage.getItem(CUSTOMER_ORDERS_KEY) || '[]');
      const updatedCust = [newOrder, ...existingCust.filter(o => o.orderNumber !== newOrder.orderNumber)];
      localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(updatedCust));
    } catch (_) {}

    // Dispatch global event so Admin Dashboard updates instantly
    window.dispatchEvent(new CustomEvent('shop-orders-updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Failed to add new order:', err);
    return getAllStoreOrders();
  }
}

export function updateOrderStatusInStore(orderId, newStatus) {
  try {
    const list = getAllStoreOrders();
    const updated = list.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('shop-orders-updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Failed updating order status in store:', err);
    return getAllStoreOrders();
  }
}

export function deleteOrderFromStore(orderId) {
  try {
    const list = getAllStoreOrders();
    const filtered = list.filter(o => o.id !== orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('shop-orders-updated', { detail: filtered }));
    return filtered;
  } catch (err) {
    console.error('Failed deleting order:', err);
    return getAllStoreOrders();
  }
}
