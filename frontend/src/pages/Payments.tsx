// src/pages/Payments.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { SelectChangeEvent } from '@mui/material/Select';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { getPayments, createPayment } from '../api/api';
import { AxiosError } from 'axios';
import { Payment } from '../api/api';
import { RootState } from '../store/index'; // Updated import

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
    payment_date: '',
    package_type: 'Monthly',
    payment_method: 'Cash',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true); // Start loading
        const response = await getPayments(email);
        setPayments(response);
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch payments');
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchPayments();
  }, [email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'total_amount' || name === 'amount_paid' || name === 'member_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createPayment(email, formData as Payment);
      const response = await getPayments(email);
      setPayments(response);
      setFormData({
        member_id: 0,
        gym_id: '',
        total_amount: 0,
        amount_paid: 0,
        payment_date: '',
        package_type: 'Monthly',
        payment_method: 'Cash',
      });
      setOpenDialog(false);
      setError('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to add payment');
    }
  };

  const filteredPayments = filterDate
    ? payments.filter((payment) => payment.payment_date.includes(filterDate))
    : payments;

  const columns: GridColDef[] = [
    { field: 'gym_id', headerName: 'Gym ID', flex: 1 },
    { field: 'member_id', headerName: 'Member ID', flex: 1 },
    { field: 'amount_paid', headerName: 'Amount', flex: 1, valueFormatter: (params) => `$${params.value}` },
    { field: 'payment_date', headerName: 'Date', flex: 1 },
    { field: 'package_type', headerName: 'Package', flex: 1 },
    { field: 'payment_method', headerName: 'Method', flex: 1 },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Payments</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Payment
        </Button>
      </Box>

      {error && <Typography color="error" mb={2}>{error}</Typography>}

      <Box mb={3}>
        <TextField
          label="Filter by Date (YYYY-MM)"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          placeholder="YYYY-MM"
          fullWidth
          InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Member ID"
              name="member_id"
              type="number"
              value={formData.member_id || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
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
              label="Total Amount"
              name="total_amount"
              type="number"
              value={formData.total_amount || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Amount Paid"
              name="amount_paid"
              type="number"
              value={formData.amount_paid || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
            />
            <TextField
              label="Date"
              name="payment_date"
              type="date"
              value={formData.payment_date || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
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
                Payment Method
              </InputLabel>
              <Select
                name="payment_method"
                value={formData.payment_method || 'Cash'}
                onChange={handleInputChange}
                label="Payment Method"
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
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
            rows={filteredPayments}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            onRowClick={(params) => navigate(`/payment-details/${params.id}`)}
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

export default Payments;