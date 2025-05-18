import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { getAssets, createAsset, updateAsset, deleteAsset, Asset } from '@/api/api';

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    gym_id: '',
    name: '',
    value: '',
    quantity: '',
    condition: 'New',
    description: '',
  });

  const email = localStorage.getItem('email');

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await getAssets(email);
      setAssets(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch assets',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const resetForm = () => {
    setFormData({
      gym_id: '',
      name: '',
      value: '',
      quantity: '',
      condition: 'New',
      description: '',
    });
  };

  const handleAddAsset = async () => {
    if (!formData.gym_id || !formData.name || !formData.value || !formData.quantity) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all required fields',
      });
      return;
    }

    try {
      const assetData = {
        gym_id: formData.gym_id,
        name: formData.name,
        value: parseFloat(formData.value),
        quantity: parseInt(formData.quantity),
        condition: formData.condition,
        description: formData.description || undefined,
      };
      await createAsset(email, assetData);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Asset added successfully',
      });
      setOpenAddDialog(false);
      resetForm();
      fetchAssets();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add asset',
      });
    }
  };

  const handleEditAsset = async () => {
    if (!currentAsset || !formData.gym_id || !formData.name || !formData.value || !formData.quantity) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all required fields',
      });
      return;
    }

    try {
      const assetData = {
        gym_id: formData.gym_id,
        name: formData.name,
        value: parseFloat(formData.value),
        quantity: parseInt(formData.quantity),
        condition: formData.condition,
        description: formData.description || undefined,
      };
      await updateAsset(currentAsset.id, assetData);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Asset updated successfully',
      });
      setOpenEditDialog(false);
      setCurrentAsset(null);
      resetForm();
      fetchAssets();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update asset',
      });
    }
  };

  const handleDeleteAsset = async (id: number) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      try {
        await deleteAsset(id);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Asset deleted successfully',
        });
        fetchAssets();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete asset',
        });
      }
    }
  };

  const openEdit = (asset: Asset) => {
    setCurrentAsset(asset);
    setFormData({
      gym_id: asset.gym_id,
      name: asset.name,
      value: asset.value.toString(),
      quantity: asset.quantity.toString(),
      condition: asset.condition,
      description: asset.description || '',
    });
    setOpenEditDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate total valuation
  const totalValuation = assets.reduce((sum, asset) => sum + asset.total_valuation, 0).toFixed(2);

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg mb-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Total Valuation: ${totalValuation}</CardTitle>
        </CardHeader>
        
      </Card>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Assets</CardTitle>
          <div className="flex gap-2">
            {/* <Button className="bg-black hover:bg-gray-800 text-white" disabled>
              Filter by Status
            </Button> */}
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-gray-800 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Asset</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gym_id" className="text-right">
                      Equipment ID
                    </Label>
                    <Input
                      id="gym_id"
                      name="gym_id"
                      value={formData.gym_id}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">
                      Value ($)
                    </Label>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="condition" className="text-right">
                      Condition
                    </Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) =>
                        setFormData({ ...formData, condition: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Used">Used</SelectItem>
                        <SelectItem value="Damaged">Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpenAddDialog(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button className="bg-black hover:bg-gray-800 text-white" onClick={handleAddAsset}>
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : assets.length === 0 ? (
            <p className="text-center text-gray-500">No assets found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Value ($)</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Total Valuation ($)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.gym_id}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.quantity}</TableCell>
                    <TableCell>{asset.value.toFixed(2)}</TableCell>
                    <TableCell>{asset.condition}</TableCell>
                    <TableCell>{asset.total_valuation.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEdit(asset)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Asset</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="gym_id" className="text-right">
                                  Equipment ID
                                </Label>
                                <Input
                                  id="gym_id"
                                  name="gym_id"
                                  value={formData.gym_id}
                                  onChange={handleInputChange}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="value" className="text-right">
                                  Value ($)
                                </Label>
                                <Input
                                  id="value"
                                  name="value"
                                  type="number"
                                  value={formData.value}
                                  onChange={handleInputChange}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="quantity" className="text-right">
                                  Quantity
                                </Label>
                                <Input
                                  id="quantity"
                                  name="quantity"
                                  type="number"
                                  value={formData.quantity}
                                  onChange={handleInputChange}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="condition" className="text-right">
                                  Condition
                                </Label>
                                <Select
                                  value={formData.condition}
                                  onValueChange={(value) =>
                                    setFormData({ ...formData, condition: value })
                                  }
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select condition" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Used">Used</SelectItem>
                                    <SelectItem value="Damaged">Damaged</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                  Description
                                </Label>
                                <Input
                                  id="description"
                                  name="description"
                                  value={formData.description}
                                  onChange={handleInputChange}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setOpenEditDialog(false);
                                  setCurrentAsset(null);
                                  resetForm();
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-black hover:bg-gray-800 text-white"
                                onClick={handleEditAsset}
                              >
                                Save
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteAsset(asset.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Assets;