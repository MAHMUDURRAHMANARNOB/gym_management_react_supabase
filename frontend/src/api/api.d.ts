import { AxiosResponse } from 'axios';

// Define the shape of the data returned by the API
interface User {
  id: number;
  email: string;
  role: string;
}

interface Member {
  id: number;
  gym_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  package_type: string;
  status: string;
  height: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  blood_group: string;
  bmi: number;
  goal: string;
  gender: string;
  created_at: string;
  updated_at: string;
}

interface Payment {
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

interface Expense {
  id: number;
  category: string;
  amount: number;
  expense_date: string;
  description: string;
  created_at: string;
}

// Define the API module
declare module '../api/api.js' {
  // Auth API
  export function register(
    email: string,
    password: string,
    role: string
  ): Promise<AxiosResponse<{ message: string }>>;

  export function login(
    email: string,
    password: string
  ): Promise<AxiosResponse<{ token: string }>>;

  // Members API
  export function getMembers(): Promise<AxiosResponse<Member[]>>;
  export function getMemberById(id: number): Promise<AxiosResponse<Member>>;
  export function createMember(
    memberData: Omit<Member, 'id' | 'created_at' | 'updated_at'>
  ): Promise<AxiosResponse<{ message: string }>>;
  export function updateMember(
    id: number,
    memberData: Partial<Member>
  ): Promise<AxiosResponse<{ message: string }>>;
  export function deleteMember(id: number): Promise<AxiosResponse<{ message: string }>>;

  // Payments API
  export function getPayments(): Promise<AxiosResponse<Payment[]>>;
  export function getPaymentsByMemberId(memberId: number): Promise<AxiosResponse<Payment[]>>;
  export function createPayment(
    paymentData: Omit<Payment, 'id' | 'created_at'>
  ): Promise<AxiosResponse<{ message: string }>>;
  export function updatePayment(
    id: number,
    paymentData: Partial<Payment>
  ): Promise<AxiosResponse<{ message: string }>>;
  export function deletePayment(id: number): Promise<AxiosResponse<{ message: string }>>;

  // Expenses API
  export function getExpenses(): Promise<AxiosResponse<Expense[]>>;
  export function createExpense(
    expenseData: Omit<Expense, 'id' | 'created_at'>
  ): Promise<AxiosResponse<{ message: string }>>;
  export function updateExpense(
    id: number,
    expenseData: Partial<Expense>
  ): Promise<AxiosResponse<{ message: string }>>;
  export function deleteExpense(id: number): Promise<AxiosResponse<{ message: string }>>;
}