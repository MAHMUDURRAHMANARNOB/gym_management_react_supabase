// src/pages/Expenses.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { getExpenses, createExpense } from '../api/api';
import { AxiosError } from 'axios';
import { Expense } from '../api/api';

function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    expense_date: '',
    description: '',
  });
  const [error, setError] = useState('');
  const { token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getExpenses(token);
        setExpenses(response);
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch expenses');
      }
    };
    fetchExpenses();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const handleSubmit = async () => {
    try {
    //   await createExpense(token, {
    //     category: formData.category,
    //     amount: parseFloat(formData.amount),
    //     expense_date: formData.expense_date,
    //     description: formData.description,
    //   });
      const response = await getExpenses(token);
      setExpenses(response);
      setFormData({ category: '', amount: '', expense_date: '', description: '' });
      setOpenDialog(false);
      setError('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to add expense');
    }
  };

  const filteredExpenses = filterCategory
    ? expenses.filter((expense) => expense.category.toLowerCase().includes(filterCategory.toLowerCase()))
    : expenses;

  const columns: GridColDef[] = [
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'amount', headerName: 'Amount', flex: 1, valueFormatter: (params) => `$${params.value}` },
    { field: 'expense_date', headerName: 'Date', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Expenses</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Expense
        </Button>
      </Box>

      {error && <Typography color="error" mb={2}>{error}</Typography>}

      <Box mb={3}>
        <TextField
          label="Filter by Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          placeholder="Enter category"
          fullWidth
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Category"
              name="category"
              value={formData.category}
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
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
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
              label="Date"
              name="expense_date"
              type="date"
              value={formData.expense_date}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
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

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredExpenses}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
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
    </Box>
  );
}

export default Expenses;