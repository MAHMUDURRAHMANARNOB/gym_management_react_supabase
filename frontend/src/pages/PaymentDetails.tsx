// src/pages/PaymentDetails.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getPayment } from '../api/api'; // Assume this endpoint
import { AxiosError } from 'axios';
import { Payment } from '../api/api';

function PaymentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await getPayment(parseInt(id || '0'));
        setPayment(response);
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch payment');
      }
    };
    fetchPayment();
  }, [id]);

  if (!payment) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Payment not found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/payments')}
          sx={{ mt: 2 }}
        >
          Back to Payments
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/payments')}
        sx={{ mb: 3 }}
      >
        Back to Payments
      </Button>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Payment Details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1">
            <strong>Gym ID:</strong> {payment.gym_id}
          </Typography>
          <Typography variant="body1">
            <strong>Member ID:</strong> {payment.member_id}
          </Typography>
          <Typography variant="body1">
            <strong>Amount:</strong> ${payment.amount_paid}
          </Typography>
          <Typography variant="body1">
            <strong>Date:</strong> {payment.payment_date}
          </Typography>
          <Typography variant="body1">
            <strong>Package Type:</strong> {payment.package_type}
          </Typography>
          <Typography variant="body1">
            <strong>Payment Method:</strong> {payment.payment_method}
          </Typography>
        </Box>
      </Paper>
      {error && <Typography color="error" mt={2}>{error}</Typography>}
    </Box>
  );
}

export default PaymentDetails;