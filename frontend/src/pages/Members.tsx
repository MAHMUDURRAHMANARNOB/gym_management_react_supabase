// // src/pages/Members.tsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   SelectChangeEvent,
// } from '@mui/material';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useSelector, TypedUseSelectorHook } from 'react-redux';
// import { getMembers, createMember, updateMember, deleteMember } from '../api/api';
// import { AxiosError } from 'axios';
// import { Member } from '../api/api';
// import { RootState } from '../store/index';

// const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

// function Members() {
//   const navigate = useNavigate();
//   const { email } = useTypedSelector((state) => state.auth); // Use email instead of token
//   const [members, setMembers] = useState<Member[]>([]);
//   const [filterStatus, setFilterStatus] = useState(''); // Add status filter
//   const [openAddDialog, setOpenAddDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [formData, setFormData] = useState<Partial<Member>>({
//     gym_id: '',
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     package_type: 'Monthly',
//     status: 'Active',
//     height: '',
//     weight: '',
//     chest: '',
//     waist: '',
//     hips: '',
//     blood_group: '',
//     bmi: 0,
//     goal: '',
//     gender: '',
//   });
//   const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const response = await getMembers(email);
//         setMembers(response);
//         setError('');
//       } catch (err) {
//         const axiosError = err as AxiosError<{ message: string }>;
//         setError(axiosError.response?.data?.message || 'Failed to fetch members');
//       }
//     };
//     fetchMembers();
//   }, [email]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'bmi' ? Number(value) : value,
//     }));
//   };

//   const handleAddSubmit = async () => {
//     try {
//       await createMember(email, formData as Member);
//       const response = await getMembers(email);
//       setMembers(response);
//       setFormData({
//         gym_id: '',
//         first_name: '',
//         last_name: '',
//         email: '',
//         phone: '',
//         package_type: 'Monthly',
//         status: 'Active',
//         height: '',
//         weight: '',
//         chest: '',
//         waist: '',
//         hips: '',
//         blood_group: '',
//         bmi: 0,
//         goal: '',
//         gender: '',
//       });
//       setOpenAddDialog(false);
//       setError('');
//     } catch (err) {
//       const axiosError = err as AxiosError<{ message: string }>;
//       setError(axiosError.response?.data?.message || 'Failed to add member');
//     }
//   };

//   const handleEditClick = (member: Member) => {
//     setFormData(member);
//     setEditingMemberId(member.id);
//     setOpenEditDialog(true);
//   };

//   const handleEditSubmit = async () => {
//     if (editingMemberId === null) return;
//     try {
//       await updateMember(editingMemberId, formData as Member);
//       const response = await getMembers(email);
//       setMembers(response);
//       setFormData({
//         gym_id: '',
//         first_name: '',
//         last_name: '',
//         email: '',
//         phone: '',
//         package_type: 'Monthly',
//         status: 'Active',
//         height: '',
//         weight: '',
//         chest: '',
//         waist: '',
//         hips: '',
//         blood_group: '',
//         bmi: 0,
//         goal: '',
//         gender: '',
//       });
//       setEditingMemberId(null);
//       setOpenEditDialog(false);
//       setError('');
//     } catch (err) {
//       const axiosError = err as AxiosError<{ message: string }>;
//       setError(axiosError.response?.data?.message || 'Failed to update member');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteMember(id);
//       setMembers((prev) => prev.filter((member) => member.id !== id));
//       setError('');
//     } catch (err) {
//       const axiosError = err as AxiosError<{ message: string }>;
//       setError(axiosError.response?.data?.message || 'Failed to delete member');
//     }
//   };

//   const filteredMembers = filterStatus
//     ? members.filter((member) => member.status.toLowerCase() === filterStatus.toLowerCase())
//     : members;

//   const columns: GridColDef[] = [
//     { field: 'gym_id', headerName: 'Gym ID', flex: 1 },
//     {
//       field: 'name',
//       headerName: 'Name',
//       flex: 1,
//       valueGetter: (params) => `${params.row.first_name} ${params.row.last_name}`,
//     },
//     { field: 'email', headerName: 'Email', flex: 1 },
//     { field: 'phone', headerName: 'Phone', flex: 1 },
//     { field: 'package_type', headerName: 'Package', flex: 1 },
//     { field: 'status', headerName: 'Status', flex: 1 },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       flex: 1,
//       renderCell: (params) => (
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Button
//             startIcon={<EditIcon />}
//             color="primary"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleEditClick(params.row as Member);
//             }}
//           >
//             Edit
//           </Button>
//           <Button
//             startIcon={<DeleteIcon />}
//             color="error"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleDelete(params.row.id);
//             }}
//           >
//             Delete
//           </Button>
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h4" color="#800000">
//           Members
//         </Typography>
//         <Box>
//           <TextField
//             label="Filter by Status"
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             placeholder="Enter status"
//             sx={{ mr: 2 }}
//             InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             onClick={() => setOpenAddDialog(true)}
//           >
//             Add Member
//           </Button>
//         </Box>
//       </Box>

//       {error && (
//         <Typography color="error" mb={2}>
//           {error}
//         </Typography>
//       )}

//       <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
//         <DialogTitle>Add New Member</DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
//             <TextField
//               label="Gym ID"
//               name="gym_id"
//               value={formData.gym_id || ''}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="First Name"
//               name="first_name"
//               value={formData.first_name || ''}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Last Name"
//               name="last_name"
//               value={formData.last_name || ''}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email || ''}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Phone"
//               name="phone"
//               value={formData.phone || ''}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <FormControl fullWidth>
//               <InputLabel sx={{ color: '#800000', '&.Mui-focused': { color: '#800000' } }}>
//                 Package Type
//               </InputLabel>
//               <Select
//                 name="package_type"
//                 value={formData.package_type || 'Monthly'}
//                 onChange={handleInputChange}
//                 label="Package Type"
//               >
//                 <MenuItem value="Monthly">Monthly</MenuItem>
//                 <MenuItem value="3 Months">3 Months</MenuItem>
//                 <MenuItem value="6 Months">6 Months</MenuItem>
//                 <MenuItem value="Yearly">Yearly</MenuItem>
//               </Select>
//             </FormControl>
//             <FormControl fullWidth>
//               <InputLabel sx={{ color: '#800000', '&.Mui-focused': { color: '#800000' } }}>
//                 Status
//               </InputLabel>
//               <Select
//                 name="status"
//                 value={formData.status || 'Active'}
//                 onChange={handleInputChange}
//                 label="Status"
//               >
//                 <MenuItem value="Active">Active</MenuItem>
//                 <MenuItem value="Inactive">Inactive</MenuItem>
//               </Select>
//             </FormControl>
//             <TextField
//               label="Height"
//               name="height"
//               value={formData.height || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Weight"
//               name="weight"
//               value={formData.weight || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Chest"
//               name="chest"
//               value={formData.chest || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Waist"
//               name="waist"
//               value={formData.waist || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Hips"
//               name="hips"
//               value={formData.hips || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Blood Group"
//               name="blood_group"
//               value={formData.blood_group || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="BMI"
//               name="bmi"
//               type="number"
//               value={formData.bmi || 0}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Goal"
//               name="goal"
//               value={formData.goal || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Gender"
//               name="gender"
//               value={formData.gender || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenAddDialog(false)} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleAddSubmit} color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
//         <DialogTitle>Edit Member</DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
//             <TextField
//               label="Gym ID"
//               name="gym_id"
//               value={formData.gym_id || ''}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="First Name"
//               name="first_name"
//               value={formData.first_name || ''}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Last Name"
//               name="last_name"
//               value={formData.last_name || ''}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email || ''}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Phone"
//               name="phone"
//               value={formData.phone || ''}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <FormControl fullWidth>
//               <InputLabel sx={{ color: '#800000', '&.Mui-focused': { color: '#800000' } }}>
//                 Package Type
//               </InputLabel>
//               <Select
//                 name="package_type"
//                 value={formData.package_type || 'Monthly'}
//                 onChange={handleInputChange}
//                 label="Package Type"
//               >
//                 <MenuItem value="Monthly">Monthly</MenuItem>
//                 <MenuItem value="3 Months">3 Months</MenuItem>
//                 <MenuItem value="6 Months">6 Months</MenuItem>
//                 <MenuItem value="Yearly">Yearly</MenuItem>
//               </Select>
//             </FormControl>
//             <FormControl fullWidth>
//               <InputLabel sx={{ color: '#800000', '&.Mui-focused': { color: '#800000' } }}>
//                 Status
//               </InputLabel>
//               <Select
//                 name="status"
//                 value={formData.status || 'Active'}
//                 onChange={handleInputChange}
//                 label="Status"
//               >
//                 <MenuItem value="Active">Active</MenuItem>
//                 <MenuItem value="Inactive">Inactive</MenuItem>
//               </Select>
//             </FormControl>
//             <TextField
//               label="Height"
//               name="height"
//               value={formData.height || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Weight"
//               name="weight"
//               value={formData.weight || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Chest"
//               name="chest"
//               value={formData.chest || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Waist"
//               name="waist"
//               value={formData.waist || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Hips"
//               name="hips"
//               value={formData.hips || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Blood Group"
//               name="blood_group"
//               value={formData.blood_group || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="BMI"
//               name="bmi"
//               type="number"
//               value={formData.bmi || 0}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Goal"
//               name="goal"
//               value={formData.goal || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//             <TextField
//               label="Gender"
//               name="gender"
//               value={formData.gender || ''}
//               onChange={handleInputChange}
//               fullWidth
//               InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenEditDialog(false)} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleEditSubmit} color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Box sx={{ height: 400, width: '100%' }}>
//         <DataGrid
//           rows={filteredMembers}
//           columns={columns}
//           pageSizeOptions={[5, 10, 20]}
//           onRowClick={(params) => navigate(`/member-details/${params.id}`)}
//           sx={{
//             '& .MuiDataGrid-columnHeaders': { backgroundColor: '#1A1A1A', color: '#FFFFFF' },
//             '& .MuiDataGrid-row': { '&:hover': { backgroundColor: '#f5f5f5' }, cursor: 'pointer' },
//           }}
//         />
//       </Box>
//     </Box>
//   );
// }

// export default Members;

// src/pages/Members.tsx
// src/pages/Members.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { getMembers, createMember, updateMember, deleteMember } from '../api/api';
import { AxiosError } from 'axios';
import { Member } from '../api/api';
import { RootState } from '../store/index';

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
    goal: '',
    gender: '',
  });
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state for initial fetch
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Add loading state for Add Member
  const [loadingEdit, setLoadingEdit] = useState(false); // Add loading state for Edit Member

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'bmi' ? Number(value) : value,
    }));
  };

  // const handleAddSubmit = async () => {
  //   try {
  //     setLoadingSubmit(true); // Start loading
  //     await createMember(email, formData as Member);
  //     const response = await getMembers(email);
  //     setMembers(response);
  //     setFormData({
  //       gym_id: '',
  //       first_name: '',
  //       last_name: '',
  //       email: '',
  //       phone: '',
  //       package_type: 'Monthly',
  //       status: 'Active',
  //       height: '',
  //       weight: '',
  //       chest: '',
  //       waist: '',
  //       hips: '',
  //       blood_group: '',
  //       bmi: 0,
  //       goal: '',
  //       gender: '',
  //     });
  //     setOpenAddDialog(false);
  //     setError('');
  //   } catch (err) {
  //     const axiosError = err as AxiosError<{ message: string }>;
  //     setError(axiosError.response?.data?.message || 'Failed to add member');
  //   } finally {
  //     setLoadingSubmit(false); // Stop loading
  //   }
  // };

  const handleAddSubmit = async () => {
    const requiredFields = ['gym_id', 'first_name', 'last_name', 'email', 'phone', 'package_type', 'status'] as const;
    const missingFields = requiredFields.filter((field): boolean => {
      const value = formData[field as keyof Partial<Member>];
      return !value || (typeof value === 'string' && value.trim() === '');
    });
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }
  
    // Normalize optional fields: convert empty strings to null
    const normalizedData = {
      gym_id: formData.gym_id?.trim(),
      first_name: formData.first_name?.trim(),
      last_name: formData.last_name?.trim(),
      email: formData.email?.trim(),
      phone: formData.phone?.trim(),
      package_type: formData.package_type?.trim(),
      status: formData.status?.trim() || 'Active', // Default to 'Active' if empty
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
      setLoadingEdit(true); // Start loading
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
      setLoadingEdit(false); // Stop loading
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

  const filteredMembers = filterStatus
    ? members.filter((member) => member.status.toLowerCase() === filterStatus.toLowerCase())
    : members;

  const columns: GridColDef[] = [
    { field: 'gym_id', headerName: 'Gym ID', flex: 1 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params) => `${params.row.first_name} ${params.row.last_name}`,
    },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'package_type', headerName: 'Package', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<EditIcon />}
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(params.row as Member);
            }}
          >
            Edit
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.id);
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" color="#800000">
          Members
        </Typography>
        <Box>
          <TextField
            label="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            placeholder="Enter status"
            sx={{ mr: 2 }}
            InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
          >
            Add Member
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Gym ID"
              name="gym_id"
              value={formData.gym_id || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="First Name"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#800000', '&.Mui-focused': { color: '#800000' } }}>
                Package Type
              </InputLabel>
              <Select
                name="package_type"
                value={formData.package_type || 'Monthly'}
                onChange={handleInputChange}
                label="Package Type"
              >
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="3 Months">3 Months</MenuItem>
                <MenuItem value="6 Months">6 Months</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#800000', '&.Mui-focused': { color: '#800000' } }}>
                Status
              </InputLabel>
              <Select
                name="status"
                value={formData.status || 'Active'}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Height"
              name="height"
              value={formData.height || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Weight"
              name="weight"
              value={formData.weight || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Chest"
              name="chest"
              value={formData.chest || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Waist"
              name="waist"
              value={formData.waist || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Hips"
              name="hips"
              value={formData.hips || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Blood Group"
              name="blood_group"
              value={formData.blood_group || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="BMI"
              name="bmi"
              type="number"
              value={formData.bmi || 0}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#800000', '&.Mui-focused': { color: '#800000' } }}>
                Goal
              </InputLabel>
                <Select
                  name="goal"
                  value={formData.goal || 'General Fitness'} // Default to 'General Fitness'
                  onChange={handleInputChange}
                  label="Goal"
                >
                  <MenuItem value="General Fitness">General Fitness</MenuItem>
                  <MenuItem value="Muscle Gain">Muscle Gain</MenuItem>
                  <MenuItem value="Weight loss">Weight Loss</MenuItem>
                  <MenuItem value="Weight Gain">Weight Gain</MenuItem>
                  <MenuItem value="Strength Training">Strength Training</MenuItem>
                </Select>
          </FormControl>
            <TextField
              label="Gender"
              name="gender"
              value={formData.gender || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary" disabled={loadingSubmit}>
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary" disabled={loadingSubmit}>
            {loadingSubmit ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Gym ID"
              name="gym_id"
              value={formData.gym_id || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="First Name"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#800000', '&.Mui-focused': { color: '#800000' } }}>
                Package Type
              </InputLabel>
              <Select
                name="package_type"
                value={formData.package_type || 'Monthly'}
                onChange={handleInputChange}
                label="Package Type"
              >
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="3 Months">3 Months</MenuItem>
                <MenuItem value="6 Months">6 Months</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#800000', '&.Mui-focused': { color: '#800000' } }}>
                Status
              </InputLabel>
              <Select
                name="status"
                value={formData.status || 'Active'}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Height"
              name="height"
              value={formData.height || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Weight"
              name="weight"
              value={formData.weight || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Chest"
              name="chest"
              value={formData.chest || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Waist"
              name="waist"
              value={formData.waist || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Hips"
              name="hips"
              value={formData.hips || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Blood Group"
              name="blood_group"
              value={formData.blood_group || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="BMI"
              name="bmi"
              type="number"
              value={formData.bmi || 0}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Goal"
              name="goal"
              value={formData.goal || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Gender"
              name="gender"
              value={formData.gender || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary" disabled={loadingEdit}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary" disabled={loadingEdit}>
            {loadingEdit ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredMembers}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            onRowClick={(params) => navigate(`/member-details/${params.id}`)}
            sx={{
              '& .MuiDataGrid-columnHeaders': { backgroundColor: '#1A1A1A', color: '#FFFFFF' },
              '& .MuiDataGrid-row': { '&:hover': { backgroundColor: '#f5f5f5' }, cursor: 'pointer' },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default Members;