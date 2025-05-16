import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { getMembers, createMember, updateMember, deleteMember } from '../api/api';
import { AxiosError } from 'axios';
import { Member } from '../api/api';
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

function Members() {
  const navigate = useNavigate();
  const { email } = useTypedSelector((state) => state.auth);
  const [members, setMembers] = useState<Member[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Member>>({
    gym_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    package_type: 'Monthly',
    status: 'Active',
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    blood_group: '',
    bmi: 0,
    goal: 'General Fitness',
    gender: '',
  });
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await getMembers(email);
        setMembers(response);
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch members');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'bmi' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async () => {
    const requiredFields = ['gym_id', 'first_name', 'last_name', 'email', 'phone', 'package_type', 'status'] as const;
    const missingFields = requiredFields.filter((field) => {
      const value = formData[field as keyof Partial<Member>];
      return !value || (typeof value === 'string' && value.trim() === '');
    });
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    const normalizedData = {
      gym_id: formData.gym_id?.trim(),
      first_name: formData.first_name?.trim(),
      last_name: formData.last_name?.trim(),
      email: formData.email?.trim(),
      phone: formData.phone?.trim(),
      package_type: formData.package_type?.trim(),
      status: formData.status?.trim() || 'Active',
      height: formData.height?.trim() || null,
      weight: formData.weight?.trim() || null,
      chest: formData.chest?.trim() || null,
      waist: formData.waist?.trim() || null,
      hips: formData.hips?.trim() || null,
      blood_group: formData.blood_group?.trim() || null,
      bmi: formData.bmi ? Number(formData.bmi) : null,
      goal: formData.goal?.trim() || null,
      gender: formData.gender?.trim() || null,
    };

    try {
      setLoadingSubmit(true);
      await createMember(email, normalizedData as Member);
      const response = await getMembers(email);
      setMembers(response);
      setFormData({
        gym_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        package_type: 'Monthly',
        status: 'Active',
        height: '',
        weight: '',
        chest: '',
        waist: '',
        hips: '',
        blood_group: '',
        bmi: 0,
        goal: 'General Fitness',
        gender: '',
      });
      setOpenAddDialog(false);
      setError('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to add member');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleEditClick = (member: Member) => {
    setFormData(member);
    setEditingMemberId(member.id);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    if (editingMemberId === null) return;
    try {
      setLoadingEdit(true);
      await updateMember(editingMemberId, formData as Member);
      const response = await getMembers(email);
      setMembers(response);
      setFormData({
        gym_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        package_type: 'Monthly',
        status: 'Active',
        height: '',
        weight: '',
        chest: '',
        waist: '',
        hips: '',
        blood_group: '',
        bmi: 0,
        goal: 'General Fitness',
        gender: '',
      });
      setEditingMemberId(null);
      setOpenEditDialog(false);
      setError('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to update member');
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((member) => member.id !== id));
      setError('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to delete member');
    }
  };

  const handleEditCancel = () => {
    setOpenEditDialog(false);
    setEditingMemberId(null);
    // Reset formData when canceling the Edit dialog
    setFormData({
      gym_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      package_type: 'Monthly',
      status: 'Active',
      height: '',
      weight: '',
      chest: '',
      waist: '',
      hips: '',
      blood_group: '',
      bmi: 0,
      goal: 'General Fitness',
      gender: '',
    });
  };

  const filteredMembers = filterStatus
    ? members.filter((member) => member.status.toLowerCase() === filterStatus.toLowerCase())
    : members;

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Members</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border-gray-300 focus:border-primary focus:ring-primary"
          />
          <Button
            onClick={() => setOpenAddDialog(true)}
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
            Add Member
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 bg-red-50 p-2 rounded mb-4">{error}</p>}

      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="bg-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">Add New Member</DialogTitle>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <Input
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <Input
                name="last_name"
                value={formData.last_name || ''}
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
                value={formData.email || ''}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                name="phone"
                value={formData.phone || ''}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={formData.status || 'Active'}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <Select
                value={formData.goal || 'General Fitness'}
                onValueChange={(value) => handleSelectChange('goal', value)}
              >
                <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Fitness">General Fitness</SelectItem>
                  <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                  <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                  <SelectItem value="Weight Gain">Weight Gain</SelectItem>
                  <SelectItem value="Strength Training">Strength Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <Input
                name="gender"
                value={formData.gender || ''}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setOpenAddDialog(false)}
              disabled={loadingSubmit}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSubmit}
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

      {/* <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="bg-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">Edit Member</DialogTitle>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <Input
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <Input
                name="last_name"
                value={formData.last_name || ''}
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
                value={formData.email || ''}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                name="phone"
                value={formData.phone || ''}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={formData.status || 'Active'}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <Input
                name="goal"
                value={formData.goal || ''}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <Input
                name="gender"
                value={formData.gender || ''}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={handleEditCancel}
              disabled={loadingEdit}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="bg-primary hover:bg-primaryDark"
              disabled={loadingEdit}
            >
              {loadingEdit ? (
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
      </Dialog> */}

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
              <TableHead className="text-primary font-bold">Name</TableHead>
              <TableHead className="text-primary font-bold">Email</TableHead>
              <TableHead className="text-primary font-bold">Phone</TableHead>
              <TableHead className="text-primary font-bold">Package</TableHead>
              <TableHead className="text-primary font-bold">Status</TableHead>
              {/* <TableHead className="text-primary">Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow
                  key={member.id}
                  onClick={() => navigate(`/member-details/${member.id}`)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>{member.gym_id}</TableCell>
                  <TableCell>{`${member.first_name} ${member.last_name}`}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.package_type}</TableCell>
                  <TableCell>{member.status}</TableCell>
                  {/* <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(member);
                        }}
                        className="bg-primary hover:bg-primaryDark flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
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
                        Edit
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(member.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1zm-6 4h12"
                          />
                        </svg>
                        Delete
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Members;