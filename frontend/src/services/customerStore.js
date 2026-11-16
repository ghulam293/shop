// customerStore.js - Reactive, persistent customer store

const STORAGE_KEY = 'shop_customers';

export const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: 'Salim Al-Shanfari',
    email: 'salim.shanfari@gmail.com',
    phone: '+968 9123 4567',
    status: 'Active',
    joinedDate: '10 Nov 2026'
  },
  {
    id: 2,
    name: 'Fatima Al-Kathiri',
    email: 'fatima.kathiri@hotmail.com',
    phone: '+968 9234 5678',
    status: 'Active',
    joinedDate: '11 Nov 2026'
  },
  {
    id: 3,
    name: 'Mohammed Al-Rawas',
    email: 'm.rawas@omantel.net.om',
    phone: '+968 9345 6789',
    status: 'Active',
    joinedDate: '08 Nov 2026'
  },
  {
    id: 4,
    name: 'Aisha Al-Balushi',
    email: 'aisha.balushi@outlook.com',
    phone: '+968 9456 7890',
    status: 'Active',
    joinedDate: '12 Nov 2026'
  },
  {
    id: 5,
    name: 'Khalid Al-Marhoon',
    email: 'khalid.marhoon@yahoo.com',
    phone: '+968 9567 8901',
    status: 'Active',
    joinedDate: '13 Nov 2026'
  },
  {
    id: 6,
    name: 'Hussain',
    email: 'itshussain302@gmail.com',
    phone: '+968 91 000000',
    status: 'Active',
    joinedDate: 'Today'
  }
];

export function getRegisteredCustomers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return [...INITIAL_CUSTOMERS];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return [...INITIAL_CUSTOMERS];
    }

    // Ensure Hussain exists in the list if already registered
    const hasHussain = parsed.some(c => (c.email || '').toLowerCase() === 'itshussain302@gmail.com');
    if (!hasHussain) {
      const hussain = INITIAL_CUSTOMERS.find(c => c.email === 'itshussain302@gmail.com');
      if (hussain) {
        parsed.unshift(hussain);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    }

    return parsed;
  } catch (err) {
    console.warn('Failed reading customers from storage:', err);
    return [...INITIAL_CUSTOMERS];
  }
}

export function addRegisteredCustomer(newCustomer) {
  try {
    const list = getRegisteredCustomers();
    const cleanEmail = (newCustomer.email || '').toLowerCase().trim();

    // Check if customer already exists by email
    const existingIndex = list.findIndex(c => (c.email || '').toLowerCase().trim() === cleanEmail);
    if (existingIndex >= 0) {
      list[existingIndex] = {
        ...list[existingIndex],
        ...newCustomer,
        name: newCustomer.name || list[existingIndex].name,
        phone: newCustomer.phone || list[existingIndex].phone,
        status: list[existingIndex].status || 'Active'
      };
    } else {
      const created = {
        id: newCustomer.id || Date.now(),
        name: newCustomer.name || newCustomer.fullName || 'New Customer',
        email: cleanEmail,
        phone: newCustomer.phone || newCustomer.phoneNumber || '+968 90 000000',
        status: newCustomer.status || 'Active',
        joinedDate: newCustomer.joinedDate || 'Today'
      };
      list.unshift(created);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('shop-customers-updated', { detail: list }));
    return list;
  } catch (err) {
    console.error('Error adding customer to store:', err);
    return getRegisteredCustomers();
  }
}

export function updateCustomerStatus(customerId, newStatus) {
  try {
    const list = getRegisteredCustomers();
    const updated = list.map(c => c.id === customerId ? { ...c, status: newStatus } : c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('shop-customers-updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Error updating customer status:', err);
    return getRegisteredCustomers();
  }
}

export function deleteCustomer(customerId) {
  try {
    const list = getRegisteredCustomers();
    const filtered = list.filter(c => c.id !== customerId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('shop-customers-updated', { detail: filtered }));
    return filtered;
  } catch (err) {
    console.error('Error deleting customer:', err);
    return getRegisteredCustomers();
  }
}
