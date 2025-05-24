// src/api/api.ts
import axios from 'axios';
// import { loginSuccess } from '../store/authSlice';
const api = axios.create({
  // baseURL: 'http://localhost:3000',
  baseURL: 'https://nfg-y0ms.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Add JWT token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));


// Authentication
// export const login = async (email: string, password: string) => {
//     const response = await api.post('/api/auth/login', { email, password });
//     return response.data;
//   };
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const checkSession = async () => {
  const session = localStorage.getItem('session');
  if (!session) return null;
  try {
    const response = await api.post('/api/auth/check-session', { session: JSON.parse(session) });
    return response.data.user;
  } catch (error) {
    console.error('Session check error:', error);
    return null;
  }
};


export const signup = async (email: string, password: string, role?: string) => {
  const response = await api.post('/api/auth/signup', { email, password, role });
  return response.data;
};

// Get All Members
export const getMembers = async (email: string | null) => {
    if (!email) throw new Error('No email provided');
    const response = await api.get('/api/members', {
      headers: { 'User-Email': email },
    });
    return response.data;
  };

// Members
// export const getMember = async (id: number): Promise<Member> => {
//     const response = await api.get(`/api/members/${id}`, {
//       headers: { 'User-Email': localStorage.getItem('email') }, // Use stored email
//     });
//     console.log (response);
//     return response.data;
//   };
export const getMember = async (id: number): Promise<Member> => {
    try {
        const email = localStorage.getItem('email');
        if (!email) throw new Error('No email found in localStorage');
        const response = await api.get(`/api/members/${id}`, {
            headers: { 'User-Email': email },
        });
        console.log('getMember response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('getMember error:', error);
        throw error; // Let the caller handle the error
    }
};

export const createMember = async (email: string | null, memberData: any) => {
  if (!email) throw new Error('No email provided');
  console.log('Sending member data:', memberData); // Add this log
  const response = await api.post('/api/members', memberData, {
    headers: { 'User-Email': email },
  });
  return response.data;
};

// export const updateMember = async (id: number, memberData: Partial<Member>) => {
//   const response = await api.put(`/api/members/${id}`, memberData); // Note: Backend needs to support PUT by ID
//   return response.data;
// };
export const updateMember = async (id: number, memberData: Partial<Member>, email: string | null) => {
  if (!email) throw new Error('No email provided');
  console.log('Sending member data:', memberData , email); 
  const response = await api.put(`/api/members/${id}`, memberData, {
    headers: { 'User-Email': email },
  });
  return response.data;
};

export const deleteMember = async (id: number) => {
  const response = await api.delete(`/members/${id}`); // Note: Backend needs to support DELETE by ID
  return response.data;
};

// Payments
export const getPayments = async (email: string | null) => {
    if (!email) throw new Error('No email provided');
    const response = await api.get('/api/payments', {
        headers: { 'User-Email': email },
    });
    return response.data;
};

// Payments
export const getPayment = async (id: number): Promise<Payment> => {
    const response = await api.get(`/api/payments/${id}`, {
        headers: { 'User-Email': localStorage.getItem('email') },
    });
    return response.data;
};

export const getPaymentsByMember = async (memberId: number): Promise<Payment[]> => {
    const response = await api.get(`/api/payments/member/${memberId}`, {
        headers: { 'User-Email': localStorage.getItem('email') },
    });
    return response.data;
};

export const getMembersByGymId = async (email: string | null, gymId: string) => {
    if (!email) throw new Error('No email provided');
    if (!gymId) throw new Error('No gym_id provided');
    const response = await api.get(`/api/members/gym/${gymId}`, {
        headers: { 'User-Email': email },
    });
    return response.data;
};

export const createPayment = async (email: string | null, paymentData: any) => {
if (!email) throw new Error('No email provided');
console.log('Sending payment data:', paymentData);
const response = await api.post('/api/payments', paymentData, {
    headers: { 'User-Email': email },
});
return response.data;
};

// Expenses
export const getExpenses = async (email: string | null) => {
    if (!email) throw new Error('No email provided');
    const response = await api.get('/api/expenses', {
      headers: { 'User-Email': email },
    });
    return response.data;
};

export const createExpense = async (email: string | null, expenseData: any) => {
if (!email) throw new Error('No email provided');
console.log('Sending expense data:', expenseData);
const response = await api.post('/api/expenses', expenseData, {
    headers: { 'User-Email': email },
});
return response.data;
};

// Income
export const getIncome = async (email: string | null) => {
  if (!email) throw new Error('No email provided');
  const response = await api.get('/api/income', {
    headers: { 'User-Email': email },
  });
  return response.data;
};

// Supplements Inventory
export const getSupplementsInventory = async (email: string | null) => {
  if (!email) throw new Error('No email provided');
  const response = await api.get('/api/supplements_inventory', {
    headers: { 'User-Email': email },
  });
  return response.data;
};

export const createSupplementInventory = async (email: string | null, inventoryData: any) => {
  if (!email) throw new Error('No email provided');
  console.log('Sending supplement inventory data:', inventoryData);
  const response = await api.post('/api/supplements_inventory', inventoryData, {
    headers: { 'User-Email': email },
  });
  return response.data;
};

// Supplement Sales
export const getSupplementSales = async (email: string | null) => {
  if (!email) throw new Error('No email provided');
  const response = await api.get('/api/supplement_sales', {
    headers: { 'User-Email': email },
  });
  return response.data;
};

export const createSupplementSale = async (email: string | null, saleData: any) => {
  if (!email) throw new Error('No email provided');
  console.log('Sending supplement sale data:', saleData);
  const response = await api.post('/api/supplement_sales', saleData, {
    headers: { 'User-Email': email },
  });
  return response.data;
};

// Assets
export const getAssets = async (email: string | null) => {
    if (!email) throw new Error('No email provided');
    const response = await api.get('/api/assets', {
        headers: { 'User-Email': email },
    });
    return response.data;
};

export const getAsset = async (id: number): Promise<Asset> => {
    try {
        const email = localStorage.getItem('email');
        if (!email) throw new Error('No email found in localStorage');
        const response = await api.get(`/api/assets/${id}`, {
            headers: { 'User-Email': email },
        });
        console.log('getAsset response:', response.data);
        return response.data;
    } catch (error) {
        console.error('getAsset error:', error);
        throw error;
    }
};

export const createAsset = async (email: string | null, assetData: any) => {
    if (!email) throw new Error('No email provided');
    console.log('Sending asset data:', assetData);
    const response = await api.post('/api/assets', assetData, {
        headers: { 'User-Email': email },
    });
    return response.data;
};

export const updateAsset = async (id: number, assetData: Partial<Asset>) => {
    const response = await api.put(`/api/assets/${id}`, assetData, {
        headers: { 'User-Email': localStorage.getItem('email') },
    });
    return response.data;
};

export const deleteAsset = async (id: number) => {
    const response = await api.delete(`/api/assets/${id}`, {
        headers: { 'User-Email': localStorage.getItem('email') },
    });
    return response.data;
};




// Interfaces
export interface Member {
  id: number;
  gym_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  package_type: string;
  status: string;
  height?: string;
  weight?: string;
  chest?: string;
  waist?: string;
  hips?: string;
  blood_group?: string;
  bmi?: number;
  goal?: string;
  gender?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: number;
  member_id: number;
  gym_id: string;
  total_amount: number;
  amount_paid: number;
  is_fully_paid: boolean;
  payment_date: string;
  package_type: string;
  payment_method: string;
  created_at: string;
}

export interface Expense {
  id: number;
  category: string;
  amount: number;
  expense_date: string;
  description: string;
}

export interface IncomeInterface {
  id: number;
  source_type: string;
  source_id: number;
  amount: number;
  income_date: string;
  description: string;
  created_at: string;
}

export interface SupplementInventory {
  id: number;
  name: string;
  brand: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SupplementSale {
  id: number;
  member_id: number;
  supplement_id: number;
  quantity_sold: number;
  sale_price: number;
  sale_date: string;
  created_at: string;
}

export interface Asset {
    id: number;
    gym_id: string;
    name: string;
    value: number;
    quantity: number;
    condition: string;
    total_valuation: number;
    description?: string;
    created_at: string;
    updated_at: string;
}