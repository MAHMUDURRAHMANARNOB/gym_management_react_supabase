
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Printer } from 'lucide-react';
import { getPayment, getMembersByGymId } from '../api/api';
import { AxiosError } from 'axios';
import axios from 'axios';
import { Payment, Member } from '../api/api';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../assets/images/nfg.jpg';

function PaymentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const voucherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const paymentResponse = await getPayment(parseInt(id || '0'));
        setPayment(paymentResponse);
        const email = localStorage.getItem('email');
        if (!email) throw new Error('Please log in to access payment details');
        const membersResponse = await getMembersByGymId(email, paymentResponse.gym_id);
        const member = membersResponse.find((m: Member) => m.id === paymentResponse.member_id);
        if (!member) throw new Error('No member found for this payment');
        setMember(member);
        setError('');
      } catch (err) {
        console.error('Fetch data error:', err);
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<{ error: string }>;
          setError(axiosError.response?.data?.error || 'Unable to fetch payment or member details');
        } else {
          setError((err as Error).message || 'An unexpected error occurred');
        }
        setPayment(null);
        setMember(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePrintPDF = async () => {
    if (!voucherRef.current) {
      setError('Failed to generate PDF: Voucher content not found');
      return;
    }
    try {
      const canvas = await html2canvas(voucherRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`payment-voucher-${member?.first_name}.pdf`);
    } catch (err) {
      setError('Failed to generate PDF');
      console.error('PDF generation error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!payment || !member) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-red-500 text-lg font-semibold">Payment or member not found</p>
        <Button
          variant="outline"
          className="mt-4 hover:bg-gray-100 transition-colors"
          onClick={() => navigate('/payments')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          className="hover:bg-gray-100 transition-colors"
          onClick={() => navigate('/payments')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>
        <Button
          variant="default"
          className="bg-[#198C8C] hover:bg-[#146b6b] transition-colors"
          onClick={handlePrintPDF}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print as PDF
        </Button>
      </div>
      <div ref={voucherRef} className="bg-white p-8 border border-gray-200 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
            <img src={logo} alt="Natural Fitness Gym Logo" className="w-20 h-20 mr-4" />
            <h1 className="text-4xl font-bold text-red-700">Natural Fitness Gym</h1>
        </div>
        <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">Payment Voucher</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-3 rounded-lg">
            <span className="text-sm font-semibold text-gray-600">Gym ID</span>
            <p className="text-lg text-gray-900">{payment.gym_id}</p>
          </div>
          <div className="p-3 rounded-lg">
            <span className="text-sm font-semibold text-gray-600">Member Name</span>
            <p className="text-lg text-gray-900">{`${member.first_name} ${member.last_name}`}</p>
          </div>
          {/* <div className="p-3 rounded-lg">
            <span className="text-sm font-semibold text-gray-600">Member ID</span>
            <p className="text-lg text-gray-900">{payment.member_id}</p>
          </div> */}
          <div className="p-3 rounded-lg">
            <span className="text-sm font-semibold text-gray-600">Amount Paid</span>
            <p className="text-lg text-gray-900">৳  {payment.amount_paid}</p>
          </div>
          <div className="p-3 rounded-lg">
            <span className="text-sm font-semibold text-gray-600">Total Amount</span>
            <p className="text-lg text-gray-900">৳  {payment.total_amount}</p>
          </div>
          <div className="p-3 rounded-lg">
            <span className="text-sm font-semibold text-gray-600">Payment Date</span>
            <p className="text-lg text-gray-900">{payment.payment_date}</p>
          </div>
          <div className="p-3 rounded-lg">
            <span className="text-sm font-semibold text-gray-600">Package Type</span>
            <p className="text-lg text-gray-900">{payment.package_type}</p>
          </div>
            <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-sm font-semibold text-gray-600">Validity Period</span>
            <p className="text-lg text-gray-900">
                {payment.package_type} (until {payment.validity_end_date ? new Date(payment.validity_end_date).toLocaleDateString() : 'N/A'})
            </p>
            </div>
          <div className="p-3 rounded-lg">
            <span className="text-sm font-semibold text-gray-600">Payment Method</span>
            <p className="text-lg text-gray-900">{payment.payment_method}</p>
          </div>
        </div>
      </div>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 mt-6">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold text-gray-600">Gym ID</span>
              <p className="text-lg text-gray-900">{payment.gym_id}</p>
            </div>
            <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold text-gray-600">Member Name</span>
              <p className="text-lg text-gray-900">{`${member.first_name} ${member.last_name}`}</p>
            </div>
            <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold text-gray-600">Member ID</span>
              <p className="text-lg text-gray-900">{payment.member_id}</p>
            </div>
            <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold text-gray-600">Amount Paid</span>
              <p className="text-lg text-gray-900">৳  {payment.amount_paid}</p>
            </div>
            <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold text-gray-600">Total Amount</span>
              <p className="text-lg text-gray-900">৳  {payment.total_amount}</p>
            </div>
            <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold text-gray-600">Payment Date</span>
              <p className="text-lg text-gray-900">{payment.payment_date}</p>
            </div>
            <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold text-gray-600">Package Type</span>
              <p className="text-lg text-gray-900">{payment.package_type}</p>
            </div>
            <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold text-gray-600">Payment Method</span>
              <p className="text-lg text-gray-900">{payment.payment_method}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}

export default PaymentDetails;