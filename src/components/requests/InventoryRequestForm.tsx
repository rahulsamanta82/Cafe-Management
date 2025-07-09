'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChefHat, Package, CheckCircle, Plus, Trash2 } from 'lucide-react';

interface InventoryItem {
  id: string;
  itemName: string;
  category: 'ingredients' | 'supplies' | 'equipment';
  quantity: number;
  currentStock: number;
  urgencyLevel: 'low' | 'medium' | 'high';
  estimatedCost?: number;
  notes?: string;
}

export function InventoryRequestForm() {
  const { user } = useAuth();
  const { createInventoryRequest } = useApp();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    itemName: '',
    category: 'ingredients' as 'ingredients' | 'supplies' | 'equipment',
    quantity: '',
    currentStock: '',
    urgencyLevel: 'medium' as 'low' | 'medium' | 'high',
    estimatedCost: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const addItem = () => {
    if (!currentItem.itemName || !currentItem.quantity) return;

    const newItem: InventoryItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemName: currentItem.itemName,
      category: currentItem.category,
      quantity: parseInt(currentItem.quantity),
      currentStock: parseInt(currentItem.currentStock) || 0,
      urgencyLevel: currentItem.urgencyLevel,
      estimatedCost: parseFloat(currentItem.estimatedCost) || undefined,
      notes: currentItem.notes || undefined
    };

    setInventoryItems(prev => [...prev, newItem]);
    
    // Clear form
    setCurrentItem({
      itemName: '',
      category: 'ingredients',
      quantity: '',
      currentStock: '',
      urgencyLevel: 'medium',
      estimatedCost: '',
      notes: ''
    });
  };

  const removeItem = (itemId: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSubmit = async () => {
    if (!user || inventoryItems.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create separate requests for each item
    for (const item of inventoryItems) {
      createInventoryRequest({
        itemName: item.itemName,
        category: item.category,
        quantity: item.quantity,
        currentStock: item.currentStock,
        urgencyLevel: item.urgencyLevel,
        estimatedCost: item.estimatedCost,
        requestedBy: user.id,
        status: 'pending',
        currentApprover: 'inventory_manager',
        notes: item.notes
      });
    }

    // Reset form
    setInventoryItems([]);
    setIsSubmitting(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (user?.role !== 'central_kitchen_manager') {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ChefHat className="h-16 w-16 mx-auto mb-4 text-amber-300" />
          <h3 className="text-lg font-medium text-amber-900 mb-2">Access Restricted</h3>
          <p className="text-amber-600">Only kitchen managers can create inventory requests</p>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Inventory Requests Submitted!</h3>
                <p className="text-sm text-green-700">
                  {inventoryItems.length} inventory request(s) sent to inventory manager.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-amber-900">Kitchen Inventory Request</h2>
        <p className="text-amber-700">Request inventory items from the central kitchen</p>
      </div>

      {/* Current Items */}
      {inventoryItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Inventory Items ({inventoryItems.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium text-amber-900">{item.itemName}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(item.urgencyLevel)}`}>
                        {item.urgencyLevel}
                      </span>
                    </div>
                    <div className="text-sm text-amber-700">
                      {item.category} • Qty: {item.quantity} • Current: {item.currentStock}
                      {item.estimatedCost && ` • Est: $${item.estimatedCost.toFixed(2)}`}
                    </div>
                    {item.notes && (
                      <div className="text-sm text-amber-600 mt-1">Notes: {item.notes}</div>
                    )}
                  </div>
                  <Button size="sm" variant="danger" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
            <span>Add Inventory Item</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Item Name and Category */}
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
                  placeholder="e.g., Flour, Cleaning supplies, Mixer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Category *
                </label>
                <select
                  value={currentItem.category}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                >
                  <option value="ingredients">Ingredients</option>
                  <option value="supplies">Supplies</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>
            </div>

            {/* Quantities and Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Quantity Needed *
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
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Current Stock
                </label>
                <input
                  type="number"
                  value={currentItem.currentStock}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, currentStock: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Current amount"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Urgency Level
                </label>
                <select
                  value={currentItem.urgencyLevel}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, urgencyLevel: e.target.value as any }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Estimated Cost and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Estimated Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentItem.estimatedCost}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, estimatedCost: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Notes
                </label>
                <input
                  type="text"
                  value={currentItem.notes}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Special requirements..."
                />
              </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-end">
              <Button
                onClick={addItem}
                disabled={!currentItem.itemName || !currentItem.quantity}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Request
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit All Items */}
      {inventoryItems.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-amber-900">Ready to Submit</h3>
                <p className="text-sm text-amber-700">
                  {inventoryItems.length} item(s) will be sent to inventory manager
                </p>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('Clear all items?')) {
                      setInventoryItems([]);
                    }
                  }}
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : `Submit ${inventoryItems.length} Request(s)`}
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
              Your inventory requests will be reviewed by:
            </p>
            <div className="flex items-center space-x-2">
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                Kitchen Manager (You)
              </div>
              <div className="mx-2 text-amber-400">→</div>
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                Inventory Manager
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}