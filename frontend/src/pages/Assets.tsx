// src/pages/Assets.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toast as toast } from '@/components/ui/toast';
import { getAssets, createAsset, updateAsset, deleteAsset, getTotalAssetWorth, Asset } from '../api/api';
import { format } from 'date-fns';

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalWorth, setTotalWorth] = useState<string>('0.00');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<Partial<Asset>>({
    name: '',
    category: 'Cardio Equipment',
    purchase_date: '',
    purchase_value: 0,
    current_value: 0,
    condition: 'New',
    location: '',
    quantity: 1,
  });

  const email = localStorage.getItem('email');

  const fetchAssets = async () => {
    try {
      const data = await getAssets(email);
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: 'Error: Failed to fetch assets.',
        variant: 'destructive',
      });
    }
  };

  const fetchTotalWorth = async () => {
    try {
      const { totalWorth } = await getTotalAssetWorth(email);
      setTotalWorth(totalWorth);
    } catch (error) {
      console.error('Error fetching total worth:', error);
      toast({
        title: 'Error: Failed to fetch total asset worth.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchTotalWorth();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'purchase_value' || name === 'current_value' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!email) {
      toast({
        title: 'Error: User email not found. Please log in again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const assetData = {
        name: formData.name || '',
        category: formData.category || 'Cardio Equipment',
        purchase_date: formData.purchase_date || new Date().toISOString().split('T')[0],
        purchase_value: Number(formData.purchase_value) || 0,
        current_value: Number(formData.current_value) || 0,
        condition: formData.condition || 'New',
        location: formData.location || '',
        quantity: Number(formData.quantity) || 1,
      };

      if (editingAsset) {
        await updateAsset(editingAsset.id, email, assetData);
        toast({
          title: 'Success: Asset updated successfully.',
        });
      } else {
        await createAsset(email, assetData);
        toast({
          title: 'Success: Asset created successfully.',
        });
      }
      fetchAssets();
      fetchTotalWorth();
      setIsDialogOpen(false);
      setEditingAsset(null);
      setFormData({
        name: '',
        category: 'Cardio Equipment',
        purchase_date: '',
        purchase_value: 0,
        current_value: 0,
        condition: 'New',
        location: '',
        quantity: 1,
      });
    } catch (error: any) {
      console.error('Error saving asset:', error);
      toast({
        title: `Error: ${error.response?.data?.error || error.message || 'Failed to save asset.'}`,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      category: asset.category,
      purchase_date: asset.purchase_date,
      purchase_value: asset.purchase_value,
      current_value: asset.current_value,
      condition: asset.condition,
      location: asset.location,
      quantity: asset.quantity,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAsset(id, email);
      fetchAssets();
      fetchTotalWorth();
      toast({
        title: 'Success: Asset deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: 'Error: Failed to delete asset.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Assets</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>Add Asset</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh]">
                <DialogHeader>
                <DialogTitle>{editingAsset ? 'Edit Asset' : 'Add Asset'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 overflow-y-auto max-h-[calc(80vh-120px)]">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                    <Input
                    name="name"
                    placeholder="Asset Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Cardio Equipment">Cardio Equipment</SelectItem>
                        <SelectItem value="Strength Equipment">Strength Equipment</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                    <Input
                    name="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Value</label>
                    <Input
                    name="purchase_value"
                    type="number"
                    placeholder="Purchase Value"
                    value={formData.purchase_value}
                    onChange={handleInputChange}
                    min="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
                    <Input
                    name="current_value"
                    type="number"
                    placeholder="Current Value"
                    value={formData.current_value}
                    onChange={handleInputChange}
                    min="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange('condition', value)}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Worn">Worn</SelectItem>
                        <SelectItem value="Damaged">Damaged</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <Input
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <Input
                    name="quantity"
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    />
                </div>
                <Button onClick={handleSubmit}>
                    {editingAsset ? 'Update' : 'Create'}
                </Button>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Asset Worth</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">${totalWorth}</p>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Purchase Value</TableHead>
            <TableHead>Current Value</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.category}</TableCell>
              <TableCell>{format(new Date(asset.purchase_date), 'PPP')}</TableCell>
              <TableCell>${asset.purchase_value.toFixed(2)}</TableCell>
              <TableCell>${asset.current_value.toFixed(2)}</TableCell>
              <TableCell>{asset.condition}</TableCell>
              <TableCell>{asset.location}</TableCell>
              <TableCell>{asset.quantity}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(asset)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(asset.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Assets;
