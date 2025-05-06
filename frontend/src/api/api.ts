// src/api/api.ts
import axios from 'axios';
import { loginSuccess } from '../store/authSlice';
const api = axios.create({
  baseURL: 'http://localhost:3000',
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
export const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  };


export const signup = async (email: string, password: string, role?: string) => {
  const response = await api.post('/api/auth/signup', { email, password, role });
  return response.data;
};

// Members
export const getMembers = async (email: string | null) => {
    if (!email) throw new Error('No email provided');
    const response = await api.get('/api/members', {
      headers: { 'User-Email': email },
    });
    return response.data;
  };

// Members
export const getMember = async (id: number): Promise<Member> => {
    const response = await api.get(`/api/members/${id}`, {
      headers: { 'User-Email': localStorage.getItem('email') }, // Use stored email
    });
    return response.data;
  };

export const createMember = async (email: string | null, memberData: any) => {
    if (!email) throw new Error('No email provided');
    const response = await api.post('/api/members', memberData, {
      headers: { 'User-Email': email },
    });
    return response.data;
  };

export const updateMember = async (id: number, memberData: Partial<Member>) => {
  const response = await api.put(`/members/${id}`, memberData); // Note: Backend needs to support PUT by ID
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

export const createPayment = async (email: string | null, paymentData: any) => {
    if (!email) throw new Error('No email provided');
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
    const response = await api.post('/api/expenses', expenseData, {
      headers: { 'User-Email': email },
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
}

export interface Expense {
  id: number;
  category: string;
  amount: number;
  expense_date: string;
  description: string;
}