// src/pages/MemberDetails.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { SelectChangeEvent } from '@mui/material/Select';
import { getMember, getPaymentsByMember, updateMember } from '../api/api'; // Assume these endpoints
import { AxiosError } from 'axios';
import { Member, Payment } from '../api/api';

function MemberDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [memberPayments, setMemberPayments] = useState<Payment[]>([]);
  const [formData, setFormData] = useState<Member | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberResponse = await getMember(parseInt(id || '0'));
        setMember(memberResponse);
        const paymentsResponse = await getPaymentsByMember(parseInt(id || '0'));
        setMemberPayments(paymentsResponse);
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch data');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name as string]: value } : null);
  };

  const handleEditSubmit = async () => {
    if (!formData) return;
    try {
      await updateMember(formData.id, formData);
      setMember(formData);
      setFormData(null);
      setOpenEditDialog(false);
      setError('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to update member');
    }
  };

  if (!member) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Member not found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/members')}
          sx={{ mt: 2 }}
        >
          Back to Members
        </Button>
      </Box>
    );
  }

  const paymentColumns: GridColDef[] = [
    { field: 'amount_paid', headerName: 'Amount', flex: 1, valueFormatter: (params) => `$${params.value}` },
    { field: 'payment_date', headerName: 'Date', flex: 1 },
    { field: 'package_type', headerName: 'Package', flex: 1 },
    { field: 'payment_method', headerName: 'Method', flex: 1 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/members')}
        >
          Back to Members
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleEditClick}
        >
          Edit Member Details
        </Button>
      </Box>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Member Details</DialogTitle>
        <DialogContent>
          {formData && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Typography variant="h6">Personal Information</Typography>
              <TextField
                label="Gym ID"
                name="gym_id"
                value={formData.gym_id}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Package Type</InputLabel>
                <Select
                  name="package_type"
                  value={formData.package_type}
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
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="h6" mt={2}>Fitness Information</Typography>
              <TextField
                label="Height"
                name="height"
                value={formData.height || ''}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
              <TextField
                label="Weight"
                name="weight"
                value={formData.weight || ''}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
              <TextField
                label="Chest"
                name="chest"
                value={formData.chest || ''}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
              <TextField
                label="Waist"
                name="waist"
                value={formData.waist || ''}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
              <TextField
                label="Hips"
                name="hips"
                value={formData.hips || ''}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
              <TextField
                label="Blood Group"
                name="blood_group"
                value={formData.blood_group || ''}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
              <TextField
                label="BMI"
                name="bmi"
                value={formData.bmi || 0}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  sx: {
                    color: '#800000',
                    '&.Mui-focused': {
                      color: '#800000'
                    }
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Member Details
        </Typography>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          <Typography variant="body1">
            <strong>Gym ID:</strong> {member.gym_id}
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {member.first_name} {member.last_name}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {member.email}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {member.phone}
          </Typography>
          <Typography variant="body1">
            <strong>Package Type:</strong> {member.package_type}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong> {member.status}
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Fitness Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          <Typography variant="body1">
            <strong>Height:</strong> {member.height}
          </Typography>
          <Typography variant="body1">
            <strong>Weight:</strong> {member.weight}
          </Typography>
          <Typography variant="body1">
            <strong>Chest:</strong> {member.chest}
          </Typography>
          <Typography variant="body1">
            <strong>Waist:</strong> {member.waist}
          </Typography>
          <Typography variant="body1">
            <strong>Hips:</strong> {member.hips}
          </Typography>
          <Typography variant="body1">
            <strong>Blood Group:</strong> {member.blood_group}
          </Typography>
          <Typography variant="body1">
            <strong>BMI:</strong> {member.bmi}
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Payment History
        </Typography>
        {memberPayments.length > 0 ? (
          <Box sx={{ height: 300, width: '100%' }}>
            <DataGrid
              rows={memberPayments}
              columns={paymentColumns}
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#1A1A1A',
                  color: '#FFFFFF',
                },
                '& .MuiDataGrid-row': {
                  '&:hover': { backgroundColor: '#f5f5f5' },
                },
              }}
            />
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No payment history available.
          </Typography>
        )}
      </Paper>
      {error && <Typography color="error" mt={2}>{error}</Typography>}
    </Box>
  );
}

export default MemberDetails;