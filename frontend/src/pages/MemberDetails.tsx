import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { AxiosError } from 'axios';
import { getMember, getPaymentsByMember, updateMember } from '../api/api';
import { Member, Payment } from '../api/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RootState } from '../store/index';
import Swal from 'sweetalert2';


const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

function MemberDetails() {
  const { id } = useParams<{ id: string }>();
  const { email } = useTypedSelector((state) => state.auth);
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [memberPayments, setMemberPayments] = useState<Payment[]>([]);
  const [formData, setFormData] = useState<Member | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || isNaN(parseInt(id))) {
        setError('Invalid member ID');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const memberResponse = await getMember(parseInt(id));
        setMember(memberResponse);
        const paymentsResponse = await getPaymentsByMember(parseInt(id));
        setMemberPayments(paymentsResponse);
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(
          axiosError.response?.data?.message ||
            'Failed to fetch member details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEditClick = () => {
    if (member) {
      setFormData({ ...member });
      setOpenEditDialog(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === 'bmi' ? parseFloat(value) || 0 : value,
          }
        : null
    );
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const handleEditSubmit = async () => {
    if (!formData) return;
    if (!email) {
    setError('User email is required. Please log in.');
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'User email is required. Please log in.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }
    try {
      const userEmail = email; // Example; adjust based on your auth setup
    await updateMember(formData.id, formData, userEmail);
      setMember(formData);
      setFormData(null);
      setOpenEditDialog(false);
      setError('');
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Member updated successfully!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        'Failed to update member. Please try again.';
      setError(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  if (loading) {
    return (
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
    );
  }

  if (!member) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <p className="text-red-500 bg-red-50 p-2 rounded mb-4">Member not found</p>
        <Button
          onClick={() => navigate('/members')}
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Members
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => navigate('/members')}
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Members
        </Button>
        <Button
          onClick={handleEditClick}
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Member Details
        </Button>
      </div>

      {error && <p className="text-red-500 bg-red-50 p-2 rounded mb-4">{error}</p>}

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="bg-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">Edit Member Details</DialogTitle>
            <DialogDescription>Update the member's personal and fitness information below.</DialogDescription>
          </DialogHeader>
          {formData && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gym ID</label>
                <Input
                  name="gym_id"
                  value={formData.gym_id}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Type</label>
                <Select
                  value={formData.package_type}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <Input
                  name="height"
                  value={formData.height || ''}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <Input
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chest</label>
                <Input
                  name="chest"
                  value={formData.chest || ''}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waist</label>
                <Input
                  name="waist"
                  value={formData.waist || ''}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hips</label>
                <Input
                  name="hips"
                  value={formData.hips || ''}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <Input
                  name="blood_group"
                  value={formData.blood_group || ''}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
                <Input
                  name="bmi"
                  type="number"
                  value={formData.bmi || 0}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setOpenEditDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="bg-primary hover:bg-primaryDark"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Member Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">Gym ID:</span> {member.gym_id}
              </div>
              <div>
                <span className="font-medium text-gray-600">Name:</span> {member.first_name} {member.last_name}
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span> {member.email}
              </div>
              <div>
                <span className="font-medium text-gray-600">Phone:</span> {member.phone}
              </div>
              <div>
                <span className="font-medium text-gray-600">Package Type:</span> {member.package_type}
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span> {member.status}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Fitness Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">Height:</span> {member.height || 'N/A'}
              </div>
              <div>
                <span className="font-medium text-gray-600">Weight:</span> {member.weight || 'N/A'}
              </div>
              <div>
                <span className="font-medium text-gray-600">Chest:</span> {member.chest || 'N/A'}
              </div>
              <div>
                <span className="font-medium text-gray-600">Waist:</span> {member.waist || 'N/A'}
              </div>
              <div>
                <span className="font-medium text-gray-600">Hips:</span> {member.hips || 'N/A'}
              </div>
              <div>
                <span className="font-medium text-gray-600">Blood Group:</span> {member.blood_group || 'N/A'}
              </div>
              <div>
                <span className="font-medium text-gray-600">BMI:</span> {member.bmi || 'N/A'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {memberPayments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-primary">Amount</TableHead>
                  <TableHead className="text-primary">Date</TableHead>
                  <TableHead className="text-primary">Package</TableHead>
                  <TableHead className="text-primary">Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberPayments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-gray-100">
                    <TableCell>${payment.amount_paid}</TableCell>
                    <TableCell>{payment.payment_date}</TableCell>
                    <TableCell>{payment.package_type}</TableCell>
                    <TableCell>{payment.payment_method}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No payment history available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MemberDetails;