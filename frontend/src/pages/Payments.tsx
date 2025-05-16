
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { getPayments, createPayment, getMembersByGymId } from '../api/api';
import { AxiosError } from 'axios';
import { Payment, Member } from '../api/api';
import { RootState } from '../store/index';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

function Payments() {
  const navigate = useNavigate();
  const { email } = useTypedSelector((state) => state.auth);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Payment>>({
    member_id: 0,
    gym_id: '',
    total_amount: 0,
    amount_paid: 0,
    payment_date: new Date().toISOString().split('T')[0],
    package_type: 'Monthly',
    payment_method: 'Cash',
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!formData.gym_id || formData.gym_id.trim() === '') {
        setMembers([]);
        setFormData((prev) => ({ ...prev, member_id: 0 }));
        return;
      }
      try {
        const response = await getMembersByGymId(email, formData.gym_id);
        setMembers(response);
        setFormData((prev) => ({
          ...prev,
          member_id: response.length > 0 ? response[0].id : 0,
        }));
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch members');
        setMembers([]);
        setFormData((prev) => ({ ...prev, member_id: 0 }));
      }
    };
    fetchMembers();
  }, [formData.gym_id, email]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await getPayments(email);
        setPayments(response);
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'member_id' || name === 'total_amount' || name === 'amount_paid'
          ? Number(value)
          : value,
    }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'member_id' || name === 'total_amount' || name === 'amount_paid'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      'member_id',
      'gym_id',
      'total_amount',
      'amount_paid',
      'payment_date',
      'package_type',
      'payment_method',
    ];
    const missingFields = requiredFields.filter((field) => {
      const value = formData[field as keyof Partial<Payment>];
      return (
        !value ||
        (typeof value === 'string' && value.trim() === '') ||
        (typeof value === 'number' && (isNaN(value) || value === 0))
      );
    });
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    const normalizedData = {
      member_id: Number(formData.member_id),
      gym_id: formData.gym_id?.trim(),
      total_amount: Number(formData.total_amount),
      amount_paid: Number(formData.amount_paid),
      is_fully_paid: Number(formData.total_amount) === Number(formData.amount_paid),
      payment_date: formData.payment_date?.trim(),
      package_type: formData.package_type?.trim(),
      payment_method: formData.payment_method?.trim(),
    };

    try {
      setLoadingSubmit(true);
      await createPayment(email, normalizedData as Payment);
      const response = await getPayments(email);
      setPayments(response);
      setFormData({
        member_id: 0,
        gym_id: '',
        total_amount: 0,
        amount_paid: 0,
        payment_date: new Date().toISOString().split('T')[0],
        package_type: 'Monthly',
        payment_method: 'Cash',
      });
      setMembers([]);
      setOpenDialog(false);
      setError('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to add payment');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const filteredPayments = filterDate
    ? payments.filter((payment) => payment.payment_date.includes(filterDate))
    : payments;

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Payments</h1>
        <Button
          onClick={() => setOpenDialog(true)}
          className="bg-primary hover:bg-primaryDark flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Payment
        </Button>
      </div>

      {error && <p className="text-red-500 bg-red-50 p-2 rounded mb-4">{error}</p>}

      <div className="mb-6">
        <Input
          placeholder="Filter by Date (YYYY-MM)"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-primary">Add New Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gym ID</label>
              <Input
                name="gym_id"
                value={formData.gym_id || ''}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
              <Select
                value={formData.member_id?.toString() || (members.length > 0 ? members[0].id.toString() : '0')}
                onValueChange={(value) => handleSelectChange('member_id', value)}
                disabled={members.length === 0}
              >
                <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {`${member.first_name} ${member.last_name} (ID: ${member.id})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {members.length === 0 && (
                <p className="text-red-500 text-sm mt-1">No members available for this gym</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
              <Input
                name="total_amount"
                type="number"
                value={formData.total_amount || 0}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
              <Input
                name="amount_paid"
                type="number"
                value={formData.amount_paid || 0}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <Input
                name="payment_date"
                type="date"
                value={formData.payment_date || new Date().toISOString().split('T')[0]}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Package Type</label>
              <Select
                value={formData.package_type || 'Monthly'}
                onValueChange={(value) => handleSelectChange('package_type', value)}
              >
                <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Select package type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="3 Months">3 Months</SelectItem>
                  <SelectItem value="6 Months">6 Months</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <Select
                value={formData.payment_method || 'Cash'}
                onValueChange={(value) => handleSelectChange('payment_method', value)}
              >
                <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              disabled={loadingSubmit}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primaryDark"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-primary font-bold">Gym ID</TableHead>
              <TableHead className="text-primary font-bold">Amount</TableHead>
              <TableHead className="text-primary font-bold">Date</TableHead>
              <TableHead className="text-primary font-bold">Package</TableHead>
              <TableHead className="text-primary font-bold">Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow
                  key={payment.id}
                  onClick={() => navigate(`/payment-details/${payment.id}`)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>{payment.gym_id}</TableCell>
                  <TableCell>BDT {payment.amount_paid}</TableCell>
                  <TableCell>{payment.payment_date}</TableCell>
                  <TableCell>{payment.package_type}</TableCell>
                  <TableCell>{payment.payment_method}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Payments;