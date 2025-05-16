// import { useState, useEffect } from 'react';
// import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';
// import PrintIcon from '@mui/icons-material/Print';
// import { useSelector, TypedUseSelectorHook } from 'react-redux';
// import { getIncome } from '../api/api';
// import { AxiosError } from 'axios';
// import { IncomeInterface } from '../api/api';
// import { RootState } from '../store/index';
// import { jsPDF } from 'jspdf';

// const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

// function Income() {
//   const { email } = useTypedSelector((state) => state.auth);
//   const [income, setIncome] = useState<IncomeInterface[]>([]);
//   const [filterMonth, setFilterMonth] = useState<string>('');
//   const [error, setError] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchIncome = async () => {
//       try {
//         setLoading(true);
//         const response = await getIncome(email);
//         setIncome(response);
//         setError('');
//       } catch (err) {
//         const axiosError = err as AxiosError<{ message: string }>;
//         setError(axiosError.response?.data?.message || 'Failed to fetch income');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchIncome();
//   }, [email]);

//   const filteredIncome = filterMonth
//     ? income.filter((item) => item.income_date.startsWith(filterMonth))
//     : income;

//   const handlePrint = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text('Income Report', 105, 20, { align: 'center' });
//     doc.setFontSize(12);
//     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
//     if (filterMonth) {
//       doc.text(`Month: ${filterMonth}`, 20, 40);
//     } else {
//       doc.text('Month: All', 20, 40);
//     }

//     let yPosition = 60;
//     doc.setFontSize(10);
//     const headers = ['Source Type', 'Source ID', 'Amount', 'Date', 'Description'];
//     const colWidths = [40, 30, 30, 30, 60]; // Widths for each column

//     // Draw headers
//     let xPosition = 20;
//     headers.forEach((header, index) => {
//       doc.text(header, xPosition, yPosition);
//       xPosition += colWidths[index];
//     });

//     // Draw table rows
//     yPosition += 10;
//     filteredIncome.forEach((item) => {
//       xPosition = 20;
//       doc.text(item.source_type, xPosition, yPosition);
//       xPosition += colWidths[0];
//       doc.text(item.source_id.toString(), xPosition, yPosition);
//       xPosition += colWidths[1];
//       doc.text(`BDT ${item.amount}`, xPosition, yPosition);
//       xPosition += colWidths[2];
//       doc.text(item.income_date, xPosition, yPosition);
//       xPosition += colWidths[3];
//       doc.text(item.description || 'N/A', xPosition, yPosition, { maxWidth: colWidths[4] });
//       yPosition += 10;

//       // Add a new page if needed
//       if (yPosition > 270) {
//         doc.addPage();
//         yPosition = 20;
//       }
//     });

//     // Add total amount at the end
//     const totalAmount = filteredIncome.reduce((sum, item) => sum + item.amount, 0);
//     yPosition += 10;
//     doc.setFontSize(12);
//     doc.text(`Total Income: BDT ${totalAmount.toFixed(2)}`, 20, yPosition);

//     doc.save(`income-report-${filterMonth || 'all'}.pdf`);
//   };

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Typography variant="h4" mb={3}>
//         Income
//       </Typography>

//       {error && <Typography color="error" mb={2}>{error}</Typography>}

//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <TextField
//           label="Filter by Month (YYYY-MM)"
//           value={filterMonth}
//           onChange={(e) => setFilterMonth(e.target.value)}
//           placeholder="YYYY-MM"
//           InputLabelProps={{ sx: { color: '#800000', '&.Mui-focused': { color: '#800000' } } }}
//           sx={{ width: '200px' }}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           startIcon={<PrintIcon />}
//           onClick={handlePrint}
//           disabled={filteredIncome.length === 0}
//         >
//           Print Report
//         </Button>
//       </Box>

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>Source Type</TableCell>
//               <TableCell>Source ID</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Description</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredIncome.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No income records found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredIncome.map((item) => (
//                 <TableRow key={item.id}>
//                   <TableCell>{item.source_type}</TableCell>
//                   <TableCell>{item.source_id}</TableCell>
//                   <TableCell>৳ {item.amount}</TableCell>
//                   <TableCell>{item.income_date}</TableCell>
//                   <TableCell>{item.description || 'N/A'}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       )}
//     </Box>
//   );
// }

// export default Income;

import { useState, useEffect } from 'react';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { getIncome } from '../api/api';
import { AxiosError } from 'axios';
import { IncomeInterface } from '../api/api';
import { RootState } from '../store/index';
import { jsPDF } from 'jspdf';
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

function Income() {
  const { email } = useTypedSelector((state) => state.auth);
  const [income, setIncome] = useState<IncomeInterface[]>([]);
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        setLoading(true);
        const response = await getIncome(email);
        setIncome(response);
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch income');
      } finally {
        setLoading(false);
      }
    };
    fetchIncome();
  }, [email]);

  const filteredIncome = filterMonth
    ? income.filter((item) => item.income_date.startsWith(filterMonth))
    : income;

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Income Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    if (filterMonth) {
      doc.text(`Month: ${filterMonth}`, 20, 40);
    } else {
      doc.text('Month: All', 20, 40);
    }

    let yPosition = 60;
    doc.setFontSize(10);
    const headers = ['Source Type', 'Source ID', 'Amount', 'Date', 'Description'];
    const colWidths = [40, 30, 30, 30, 60];

    let xPosition = 20;
    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition);
      xPosition += colWidths[index];
    });

    yPosition += 10;
    filteredIncome.forEach((item) => {
      xPosition = 20;
      doc.text(item.source_type, xPosition, yPosition);
      xPosition += colWidths[0];
      doc.text(item.source_id.toString(), xPosition, yPosition);
      xPosition += colWidths[1];
      doc.text(`BDT ${item.amount}`, xPosition, yPosition);
      xPosition += colWidths[2];
      doc.text(item.income_date, xPosition, yPosition);
      xPosition += colWidths[3];
      doc.text(item.description || 'N/A', xPosition, yPosition, { maxWidth: colWidths[4] });
      yPosition += 10;

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    const totalAmount = filteredIncome.reduce((sum, item) => sum + item.amount, 0);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(`Total Income: BDT ${totalAmount.toFixed(2)}`, 20, yPosition);

    doc.save(`income-report-${filterMonth || 'all'}.pdf`);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Income</h1>

      {error && <p className="text-red-500 bg-red-50 p-2 rounded mb-4">{error}</p>}

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Filter by Month (YYYY-MM)"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="w-48 border-gray-300 focus:border-primary focus:ring-primary"
        />
        <Button
          onClick={handlePrint}
          className="bg-primary hover:bg-primaryDark flex items-center"
          disabled={filteredIncome.length === 0}
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2h10z"
            />
          </svg>
          Print Report
        </Button>
      </div>

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
              <TableHead className="text-primary">Source Type</TableHead>
              <TableHead className="text-primary">Source ID</TableHead>
              <TableHead className="text-primary">Amount</TableHead>
              <TableHead className="text-primary">Date</TableHead>
              <TableHead className="text-primary">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIncome.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No income records found
                </TableCell>
              </TableRow>
            ) : (
              filteredIncome.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.source_type}</TableCell>
                  <TableCell>{item.source_id}</TableCell>
                  <TableCell>৳ {item.amount}</TableCell>
                  <TableCell>{item.income_date}</TableCell>
                  <TableCell>{item.description || 'N/A'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Income;