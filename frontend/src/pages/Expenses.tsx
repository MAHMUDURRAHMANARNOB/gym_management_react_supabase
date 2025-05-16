import { useState, useEffect } from 'react';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { getExpenses, createExpense } from '../api/api';
import { AxiosError } from 'axios';
import { Expense } from '../api/api';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

function Expenses() {
  const { email } = useTypedSelector((state) => state.auth);
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
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await getExpenses(email);
        setExpenses(response);
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch expenses');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true);
      await createExpense(email, {
        category: formData.category,
        amount: parseFloat(formData.amount),
        expense_date: formData.expense_date,
        description: formData.description,
      });
      const response = await getExpenses(email);
      setExpenses(response);
      setFormData({ category: '', amount: '', expense_date: '', description: '' });
      setOpenDialog(false);
      setError('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const filteredExpenses = filterCategory
    ? expenses.filter((expense) =>
        expense.category.toLowerCase().includes(filterCategory.toLowerCase())
      )
    : expenses;

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Expenses</h1>
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
          Add Expense
        </Button>
      </div>

      {error && <p className="text-red-500 bg-red-50 p-2 rounded mb-4">{error}</p>}

      <div className="mb-6">
        <Input
          placeholder="Filter by Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-primary">Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <Input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <Input
                name="expense_date"
                type="date"
                value={formData.expense_date}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-primary focus:ring-primary"
                // multiline
                // rows={4}
              />
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
              <TableHead className="text-primary font-bold">Category</TableHead>
              <TableHead className="text-primary font-bold">Amount</TableHead>
              <TableHead className="text-primary font-bold">Date</TableHead>
              <TableHead className="text-primary font-bold">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.category}</TableCell>
                <TableCell>BDT {expense.amount}</TableCell>
                <TableCell>{expense.expense_date}</TableCell>
                <TableCell>{expense.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Expenses;