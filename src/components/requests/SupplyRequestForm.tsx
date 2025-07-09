'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Truck, Package, CheckCircle, Plus, Trash2, Edit2 } from 'lucide-react';
import { SupplyItem } from '@/types';

interface ExtendedSupplyItem extends SupplyItem {
  id: string;
}

export function SupplyRequestForm() {
  const { user } = useAuth();
  const { suppliers, createSupplyRequest } = useApp();
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [supplyItems, setSupplyItems] = useState<ExtendedSupplyItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    itemName: '',
    quantity: '',
    unitPrice: '',
    specifications: ''
  });
  const [deliveryDate, setDeliveryDate] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const addItem = () => {
    if (!currentItem.itemName || !currentItem.quantity) return;

    const unitPrice = parseFloat(currentItem.unitPrice) || 0;
    const quantity = parseInt(currentItem.quantity);
    
    const newItem: ExtendedSupplyItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemName: currentItem.itemName,
      quantity,
      unitPrice: unitPrice > 0 ? unitPrice : undefined,
      totalPrice: unitPrice > 0 ? unitPrice * quantity : undefined,
      specifications: currentItem.specifications || undefined
    };

    setSupplyItems(prev => [...prev, newItem]);
    
    // Clear form
    setCurrentItem({
      itemName: '',
      quantity: '',
      unitPrice: '',
      specifications: ''
    });
  };

  const removeItem = (itemId: string) => {
    setSupplyItems(prev => prev.filter(item => item.id !== itemId));
    if (editingItemId === itemId) {
      setEditingItemId(null);
    }
  };

  const editItem = (item: ExtendedSupplyItem) => {
    setEditingItemId(item.id);
    setCurrentItem({
      itemName: item.itemName,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice?.toString() || '',
      specifications: item.specifications || ''
    });
  };

  const updateItem = () => {
    if (!editingItemId || !currentItem.itemName || !currentItem.quantity) return;

    const unitPrice = parseFloat(currentItem.unitPrice) || 0;
    const quantity = parseInt(currentItem.quantity);

    setSupplyItems(prev => prev.map(item => 
      item.id === editingItemId 
        ? {
            ...item,
            itemName: currentItem.itemName,
            quantity,
            unitPrice: unitPrice > 0 ? unitPrice : undefined,
            totalPrice: unitPrice > 0 ? unitPrice * quantity : undefined,
            specifications: currentItem.specifications || undefined
          }
        : item
    ));

    // Clear form and exit edit mode
    setCurrentItem({
      itemName: '',
      quantity: '',
      unitPrice: '',
      specifications: ''
    });
    setEditingItemId(null);
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setCurrentItem({
      itemName: '',
      quantity: '',
      unitPrice: '',
      specifications: ''
    });
  };

  const calculateTotalCost = () => {
    return supplyItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  const handleSubmit = async () => {
    if (!user || !selectedSupplier || supplyItems.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const itemsWithoutId = supplyItems.map(({ id, ...item }) => item);

    createSupplyRequest({
      supplierId: selectedSupplier,
      items: itemsWithoutId,
      totalEstimatedCost: calculateTotalCost(),
      deliveryDate: deliveryDate || undefined,
      priority,
      requestedBy: user.id,
      status: 'pending',
      currentApprover: 'supplier_manager',
      notes: notes || undefined
    });

    // Reset form
    setSelectedSupplier('');
    setSupplyItems([]);
    setDeliveryDate('');
    setPriority('normal');
    setNotes('');
    setIsSubmitting(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (user?.role !== 'inventory_manager') {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Truck className="h-16 w-16 mx-auto mb-4 text-amber-300" />
          <h3 className="text-lg font-medium text-amber-900 mb-2">Access Restricted</h3>
          <p className="text-amber-600">Only inventory managers can create supply requests</p>
        </CardContent>
      </Card>
    );
  };

  const selectedSupplierData = suppliers.find(s => s.id === selectedSupplier);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Supply Request Submitted!</h3>
                <p className="text-sm text-green-700">
                  Request sent to supplier manager for approval.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-amber-900">Supply Request</h2>
        <p className="text-amber-700">Request supplies from external suppliers</p>
      </div>

      {/* Supplier Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Choose Supplier *
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              >
                <option value="">Select a supplier...</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name} - {supplier.categories.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Supplier Details */}
            {selectedSupplierData && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-amber-900">{selectedSupplierData.name}</h4>
                    <p className="text-sm text-amber-700">
                      Contact: {selectedSupplierData.contactPerson} • {selectedSupplierData.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-amber-600">Categories:</span>
                      {selectedSupplierData.categories.map(cat => (
                        <Badge key={cat} variant="default">{cat}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={selectedSupplierData.reliability === 'excellent' ? 'approved' : 'default'}>
                      {selectedSupplierData.reliability}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Items */}
      {supplyItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Supply Items ({supplyItems.length})</span>
              </div>
              <div className="text-lg font-bold text-amber-900">
                Total: ${calculateTotalCost().toFixed(2)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supplyItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex-1">
                    <div className="font-medium text-amber-900">{item.itemName}</div>
                    <div className="text-sm text-amber-700">
                      Qty: {item.quantity}
                      {item.unitPrice && ` • $${item.unitPrice.toFixed(2)} each`}
                      {item.totalPrice && ` • Total: $${item.totalPrice.toFixed(2)}`}
                    </div>
                    {item.specifications && (
                      <div className="text-sm text-amber-600 mt-1">Specs: {item.specifications}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => editItem(item)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Item Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>{editingItemId ? 'Edit Item' : 'Add Supply Item'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Item Name and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={currentItem.itemName}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, itemName: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Premium Coffee Beans"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Amount needed"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Unit Price and Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Unit Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentItem.unitPrice}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, unitPrice: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Price per unit"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Specifications
                </label>
                <input
                  type="text"
                  value={currentItem.specifications}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, specifications: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Special requirements..."
                />
              </div>
            </div>

            {/* Add/Update Button */}
            <div className="flex justify-end space-x-4">
              {editingItemId && (
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel Edit
                </Button>
              )}
              <Button
                onClick={editingItemId ? updateItem : addItem}
                disabled={!currentItem.itemName || !currentItem.quantity}
              >
                <Plus className="h-4 w-4 mr-2" />
                {editingItemId ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Details */}
      {supplyItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Preferred Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent')}
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                  placeholder="Special instructions for the supplier..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Request */}
      {supplyItems.length > 0 && selectedSupplier && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-amber-900">Ready to Submit</h3>
                <p className="text-sm text-amber-700">
                  {supplyItems.length} item(s) • Total: ${calculateTotalCost().toFixed(2)}
                </p>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('Clear all items?')) {
                      setSupplyItems([]);
                      setEditingItemId(null);
                    }
                  }}
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Supply Request'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Approval Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-amber-700 text-sm mb-4">
              Supply requests go through the following approval:
            </p>
            <div className="flex items-center space-x-2">
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                Inventory Manager (You)
              </div>
              <div className="mx-2 text-amber-400">→</div>
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                Supplier Manager
              </div>
              <div className="mx-2 text-amber-400">→</div>
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                Inventory Manager (Final)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}