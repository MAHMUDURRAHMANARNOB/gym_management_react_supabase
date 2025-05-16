import { useState, useEffect } from 'react';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { getSupplementsInventory, createSupplementInventory, getSupplementSales, createSupplementSale, getMembers } from '../api/api';
import { AxiosError } from 'axios';
import { SupplementInventory, SupplementSale, Member } from '../api/api';
import { RootState } from '../store/index';
import { jsPDF } from 'jspdf';

import logo from '../assets/images/nfg.jpg';

// Shadcn UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

function Supplements() {
  const { email } = useTypedSelector((state) => state.auth);
  const [inventory, setInventory] = useState<SupplementInventory[]>([]);
  const [sales, setSales] = useState<SupplementSale[]>([]);
  const [openInventoryDialog, setOpenInventoryDialog] = useState(false);
  const [openSaleDialog, setOpenSaleDialog] = useState(false);
  const [inventoryFormData, setInventoryFormData] = useState<Partial<SupplementInventory>>({
    name: '',
    brand: '',
    quantity: 0,
    unit_price: 0,
  });
  const [saleFormData, setSaleFormData] = useState<Partial<SupplementSale>>({
    member_id: 0,
    supplement_id: 0,
    quantity_sold: 1,
    sale_price: 0,
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [tabValue, setTabValue] = useState('inventory'); // For tabbed view

    useEffect(() => {
        const fetchData = async () => {
        try {
            setLoading(true);
            const [inventoryResponse, salesResponse, membersResponse] = await Promise.all([
            getSupplementsInventory(email),
            getSupplementSales(email),
            getMembers(email),
            ]);
            setInventory(inventoryResponse);
            setSales(salesResponse);
            setMembers(membersResponse);
            setError('');
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setError(axiosError.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, [email]);

    const handleInventoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInventoryFormData((prev) => ({
        ...prev,
        [name]: name === 'quantity' || name === 'unit_price' ? Number(value) : value,
        }));
    };

    const handleSaleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSaleFormData((prev) => ({
        ...prev,
        [name]: name === 'quantity_sold' || name === 'sale_price' ? Number(value) : value,
        }));
    };

    const handleInventorySubmit = async () => {
        const requiredFields = ['name', 'brand', 'quantity', 'unit_price'];
        const missingFields = requiredFields.filter((field) => {
        const value = inventoryFormData[field as keyof Partial<SupplementInventory>];
        return !value || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && isNaN(value));
        });
        if (missingFields.length > 0) {
        setError(`Missing required fields: ${missingFields.join(', ')}`);
        return;
        }

        try {
        setLoadingSubmit(true);
        await createSupplementInventory(email, inventoryFormData);
        const response = await getSupplementsInventory(email);
        setInventory(response);
        setInventoryFormData({ name: '', brand: '', quantity: 0, unit_price: 0 });
        setOpenInventoryDialog(false);
        setError('');
        } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to add inventory');
        } finally {
        setLoadingSubmit(false);
        }
    };    

    const handleSaleSubmit = async () => {
    const requiredFields = ['member_id', 'supplement_id', 'quantity_sold', 'sale_price'];
    const missingFields = requiredFields.filter((field) => {
        const value = saleFormData[field as keyof Partial<SupplementSale>];
        return (
        !value ||
        (typeof value === 'string' && value.trim() === '') ||
        (typeof value === 'number' && (isNaN(value) || value === 0))
        );
    });
    if (missingFields.length > 0) {
        setError(`Missing required fields: ${missingFields.join(', ')}`);
        return;
    }

    try {
        setLoadingSubmit(true);
        const saleData = {
        member_id: Number(saleFormData.member_id),
        supplement_id: Number(saleFormData.supplement_id),
        quantity_sold: Number(saleFormData.quantity_sold),
        sale_price: Number(saleFormData.sale_price),
        };
        await createSupplementSale(email, saleData);

        const saleResponse = await getSupplementSales(email);
        const latestSale = saleResponse[saleResponse.length - 1];
    //   generateSalesSlip(latestSale);
    generateSalesSlip(latestSale, members, inventory);

        const inventoryResponse = await getSupplementsInventory(email);
        setInventory(inventoryResponse);
        const salesResponse = await getSupplementSales(email);
        setSales(salesResponse);
        setSaleFormData({ member_id: 0, supplement_id: 0, quantity_sold: 1, sale_price: 0 });
        setOpenSaleDialog(false);
        setError('');
    } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Failed to process sale');
    } finally {
        setLoadingSubmit(false);
    }
    };

    const getBase64Image = (img: HTMLImageElement): Promise<string> => {
    return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/jpeg');
    resolve(dataURL);
    });
    };

    const generateSalesSlip = async (sale: SupplementSale, members: Member[], inventory: SupplementInventory[]) => {
    const doc = new jsPDF();

    // Load and add gym logo
    const img = new Image();
    img.src = logo;
    await new Promise((resolve) => { img.onload = resolve; });
    const base64Logo = await getBase64Image(img);
    doc.addImage(base64Logo, 'JPEG', 10, 10, 20, 20); // Logo 20x20 mm

    // Voucher Title (Centered)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Natural Fitness Gym', 105, 20, { align: 'center' });

    // Horizontal Line
    doc.setLineWidth(0.5);
    doc.line(10, 30, 200, 30);

    // Get member and supplement info
    const member = members.find((m) => m.id === sale.member_id);
    const supplement = inventory.find((s) => s.id === sale.supplement_id);

    // Date Section (top)
    const saleDate = new Date(sale.sale_date);
    const formattedDate = saleDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('Date:', 20, 40);
    doc.setFont('Helvetica', 'normal');
    doc.text(formattedDate, 40, 40);

    // Customer Name Section (below date)
    doc.setFont('Helvetica', 'bold');
    doc.text('Customer:', 20, 48);
    doc.setFont('Helvetica', 'normal');
    doc.text(`  ${member?.first_name || 'Unknown'} ${member?.last_name || ''}`, 40, 48);

    // Sale Details Table (Centered)
    doc.setFontSize(10);
    
    // Table Setup
    const colWidths = [10, 70, 30, 20, 30]; // NO, PRODUCT DESCRIPTION, UNIT PRICE, QTY, TOTAL
    const tableWidth = colWidths.reduce((a, b) => a + b, 0); // Total width: 160mm
    const startX = (210 - tableWidth) / 2; // Center on A4 page (210mm wide)
    const startY = 58; // 40 (date) + 8 (customer) + 10 (space) = 58
    const rowHeight = 8;

    // Draw Header Background
    doc.setFillColor(66, 66, 66); // Dark gray
    doc.rect(startX, startY, tableWidth, rowHeight, 'F');

    // Draw Header Text
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(255, 255, 255); // White text
    let x = startX;
    const headers = ['NO', 'PRODUCT DESCRIPTION', 'UNIT PRICE', 'QTY', 'TOTAL'];
    headers.forEach((header, i) => {
        doc.text(header, x + 2, startY + 6);
        x += colWidths[i];
    });

    // Draw Header Borders
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    x = startX;
    for (let i = 0; i <= headers.length; i++) {
        doc.line(x, startY, x, startY + rowHeight); // Vertical lines
        x += colWidths[i] || 0;
    }
    doc.line(startX, startY, startX + tableWidth, startY); // Top line
    doc.line(startX, startY + rowHeight, startX + tableWidth, startY + rowHeight); // Bottom line

    // Table Row
    const rowY = startY + rowHeight;
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // Black text
    const rowData = [
        '01',
        `${supplement ? supplement.name : `Supplement ID: ${sale.supplement_id}`}`,
        `BDT ${sale.sale_price.toFixed(2)}`,
        sale.quantity_sold.toString(),
        `BDT ${(sale.quantity_sold * sale.sale_price).toFixed(2)}`,
    ];

    x = startX;
    rowData.forEach((cell, i) => {
        doc.text(cell, x + 2, rowY + 6);
        x += colWidths[i];
    });

    // Draw Row Borders
    x = startX;
    for (let i = 0; i <= rowData.length; i++) {
        doc.line(x, rowY, x, rowY + rowHeight); // Vertical lines
        x += colWidths[i] || 0;
    }
    doc.line(startX, rowY, startX + tableWidth, rowY); // Top line
    doc.line(startX, rowY + rowHeight, startX + tableWidth, rowY + rowHeight); // Bottom line

    // Subtotal and Grand Total (Right-aligned relative to table)
    const finalY = rowY + rowHeight;
    doc.setFontSize(10);
    doc.text(`Sub Total: BDT ${(sale.quantity_sold * sale.sale_price).toFixed(2)}`, startX + tableWidth - 40, finalY + 10);
    doc.text(`Grand Total: BDT ${(sale.quantity_sold * sale.sale_price).toFixed(2)}`, startX + tableWidth - 40, finalY + 15);

    // Thank You Section (Bottom of Page)
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('THANK YOU FOR YOUR PURCHASE', 105, 280, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.text('Contact: +8801686-006304', 105, 290, { align: 'center' });

    // Save the PDF
    doc.save(`voucher-sale-${sale.id}.pdf`);
    };




    return (
        <div className="p-6 bg-white min-h-screen">
        {/* Header */}
        <h1 className="text-3xl font-bold text-primary mb-6">Supplements</h1>

        {error && (
            <p className="text-red-500 bg-red-50 p-2 rounded mb-4">{error}</p>
        )}

        {/* Tabs */}
        <Tabs value={tabValue} onValueChange={setTabValue} className="mb-6">
            <TabsList className="border-b border-gray-200 py-6 px-5">
            <TabsTrigger value="inventory" className="data-[state=active]:text-primary data-[state=active]:border-2 data-[state=active]:border-grey[200] px-10">
                Inventory
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:text-primary data-[state=active]:border-2 data-[state=active]:border-grey[200 px-10">
                Sales
            </TabsTrigger>
            </TabsList>

            {/* Inventory Tab */}
            <TabsContent value="inventory">

            <div className="flex justify-between mb-4 mt-2">
                <div>
                    <text className="text-xl font-bold text-primary block mb-2">Supplement Inventory</text>
                    <text className="text-lg font-regular text-primary block">Manage supplement stock and prices.</text>
                </div>
                <Button onClick={() => setOpenInventoryDialog(true)} className="bg-primary hover:bg-primaryDark">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Supplement
                </Button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-48">
                <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                </div>
            ) : inventory.length === 0 ? (
                <p className="text-center text-gray-500">No inventory items found.</p>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="text-primary font-bold">Name</TableHead>
                    <TableHead className="text-primary font-bold">Brand</TableHead>
                    <TableHead className="text-primary font-bold">Quantity</TableHead>
                    <TableHead className="text-primary font-bold">Unit Price</TableHead>
                    <TableHead className="text-primary font-bold">Total Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inventory.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.brand}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>৳ {item.unit_price}</TableCell>
                        <TableCell>৳ {item.total_value}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
            </TabsContent>

            {/* Sales Tab */}
            <TabsContent value="sales">
                <div className="flex justify-between mb-4 mt-2">
                    <div>
                        <text className="text-xl font-bold text-primary block mb-2 ">Supplement Sales</text>
                        <text className="text-lg font-regular text-primary block">Record supplement sales and generate receipts.</text>
                    </div>
                        <Button onClick={() => setOpenSaleDialog(true)} className="bg-primary hover:bg-primaryDark">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Sale
                        </Button>
                </div>
                
                {loading ? (
                <div className="flex justify-center items-center h-48">
                <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                </div>
                ) : sales.length === 0 ? (
                <p className="text-center text-gray-500">No sales records found.</p>
                ) : ( 
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-primary font-bold">Member Name</TableHead>
                        <TableHead className="text-primary font-bold">Supplement Name</TableHead>
                        <TableHead className="text-primary font-bold">Quantity Sold</TableHead>
                        <TableHead className="text-primary font-bold">Sale Price</TableHead>
                        <TableHead className="text-primary font-bold">Sale Date</TableHead>
                        <TableHead className="text-primary font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sales.map((sale) => {
                    const member = members.find((m) => m.id === sale.member_id);
                    const supplement = inventory.find((s) => s.id === sale.supplement_id);
                    return (
                    <TableRow key={sale.id}>
                    <TableCell>
                    {member
                        ? `${member.first_name} ${member.last_name}`
                        : `Unknown Member (ID: ${sale.member_id})`}
                    </TableCell>
                    <TableCell>
                    {supplement
                        ? supplement.name
                        : `Unknown Supplement (ID: ${sale.supplement_id})`}
                    </TableCell>
                    <TableCell>{sale.quantity_sold}</TableCell>
                    <TableCell>৳ {sale.sale_price}</TableCell>
                    <TableCell>{sale.sale_date}</TableCell>
                    <TableCell>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateSalesSlip(sale, members, inventory)}
                        className="flex items-center"
                    >
                        <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                        </svg>
                        Print
                    </Button>
                    </TableCell>
                    </TableRow>
                    );
                    })}
                    </TableBody>
                </Table>
                )}
            </TabsContent>
        </Tabs>

        {/* Inventory Dialog */}
        <Dialog open={openInventoryDialog} onOpenChange={setOpenInventoryDialog}>
            <DialogContent className="bg-white rounded-lg shadow-lg">
            <DialogHeader>
                <DialogTitle className="text-primary">Add New Supplement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                    name="name"
                    value={inventoryFormData.name || ''}
                    onChange={handleInventoryInputChange}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    required
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <Input
                    name="brand"
                    value={inventoryFormData.brand || ''}
                    onChange={handleInventoryInputChange}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    required
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <Input
                    name="quantity"
                    type="number"
                    value={inventoryFormData.quantity || 0}
                    onChange={handleInventoryInputChange}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    required
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                <Input
                    name="unit_price"
                    type="number"
                    value={inventoryFormData.unit_price || 0}
                    onChange={handleInventoryInputChange}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    required
                />
                </div>
            </div>
            <DialogFooter className="mt-6">
                <Button
                variant="outline"
                onClick={() => setOpenInventoryDialog(false)}
                disabled={loadingSubmit}
                >
                Cancel
                </Button>
                <Button
                onClick={handleInventorySubmit}
                className="bg-primary hover:bg-primaryDark"
                disabled={loadingSubmit}
                >
                {loadingSubmit ? (
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                ) : null}
                Save
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Sale Dialog */}
        <Dialog open={openSaleDialog} onOpenChange={setOpenSaleDialog}>
            <DialogContent className="bg-white rounded-lg shadow-lg">
            <DialogHeader>
                <DialogTitle className="text-primary">Sell Supplement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
                <Select
                    value={saleFormData.member_id?.toString() || ''}
                    onValueChange={(value) =>
                    setSaleFormData((prev) => ({ ...prev, member_id: Number(value) }))
                    }
                    disabled={members.length === 0}
                >
                    <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                    {members.map((member) => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                        {`${member.first_name} ${member.last_name} (ID: ${member.id}, Gym: ${member.gym_id})`}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                {members.length === 0 && <p className="text-red-500 text-sm mt-1">No members available</p>}
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplement</label>
                <Select
                    value={saleFormData.supplement_id?.toString() || ''}
                    onValueChange={(value) =>
                    setSaleFormData((prev) => ({ ...prev, supplement_id: Number(value) }))
                    }
                    disabled={inventory.length === 0}
                >
                    <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Select a supplement" />
                    </SelectTrigger>
                    <SelectContent>
                    {inventory.map((supplement) => (
                        <SelectItem key={supplement.id} value={supplement.id.toString()}>
                        {`${supplement.name} (${supplement.brand}) (ID: ${supplement.id})`}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                {inventory.length === 0 && <p className="text-red-500 text-sm mt-1">No supplements available</p>}
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Sold</label>
                <Input
                    name="quantity_sold"
                    type="number"
                    value={saleFormData.quantity_sold || 1}
                    onChange={handleSaleInputChange}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    required
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                <Input
                    name="sale_price"
                    type="number"
                    value={saleFormData.sale_price || 0}
                    onChange={handleSaleInputChange}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    required
                />
                </div>
            </div>
            <DialogFooter className="mt-6">
                <Button
                variant="outline"
                onClick={() => setOpenSaleDialog(false)}
                disabled={loadingSubmit}
                >
                Cancel
                </Button>
                <Button
                onClick={handleSaleSubmit}
                className="bg-primary hover:bg-primaryDark"
                disabled={loadingSubmit}
                >
                {loadingSubmit ? (
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                ) : null}
                Save
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </div>
    );
}

export default Supplements;