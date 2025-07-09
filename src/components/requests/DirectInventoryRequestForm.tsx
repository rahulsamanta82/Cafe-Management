'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, CheckCircle, Plus, Trash2 } from 'lucide-react';

interface DirectInventoryItem {
  id: string;
  itemName: string;
  quantity: number;
  justification: string;
}

export function DirectInventoryRequestForm() {
  const { user } = useAuth();
  const { branches, createDirectInventoryRequest } = useApp();
  const [inventoryItems, setInventoryItems] = useState<DirectInventoryItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    itemName: '',
    quantity: '',
    justification: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const userBranch = branches.find(b => b.id === user?.branchId);

  const addItem = () => {
    if (!currentItem.itemName || !currentItem.quantity || !currentItem.justification) return;

    const newItem: DirectInventoryItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemName: currentItem.itemName,
      quantity: parseInt(currentItem.quantity),
      justification: currentItem.justification
    };

    setInventoryItems(prev => [...prev, newItem]);
    
    // Clear form
    setCurrentItem({
      itemName: '',
      quantity: '',
      justification: ''
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
      createDirectInventoryRequest({
        branchId: user.branchId!,
        itemName: item.itemName,
        quantity: item.quantity,
        justification: item.justification,
        requestedBy: user.id,
        status: 'pending',
        currentApprover: 'inventory_manager'
      });
    }

    // Reset form
    setInventoryItems([]);
    setIsSubmitting(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (user?.role !== 'branch_manager') {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-amber-300" />
          <h3 className="text-lg font-medium text-amber-900 mb-2">Access Restricted</h3>
          <p className="text-amber-600">Only branch managers can create direct inventory requests</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Direct Inventory Requests Submitted!</h3>
                <p className="text-sm text-green-700">
                  {inventoryItems.length} request(s) sent directly to inventory manager.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-amber-900">Direct Inventory Request</h2>
        <p className="text-amber-700">Request items directly from inventory (bypass normal workflow)</p>
      </div>

      {/* Branch Info */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-600 p-2 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-amber-900">{userBranch?.name}</h3>
              <p className="text-sm text-amber-700">{userBranch?.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Items */}
      {inventoryItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Direct Inventory Items ({inventoryItems.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex-1">
                    <div className="font-medium text-amber-900">{item.itemName}</div>
                    <div className="text-sm text-amber-700">
                      Quantity: {item.quantity}
                    </div>
                    <div className="text-sm text-amber-600 mt-1">
                      Justification: {item.justification}
                    </div>
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
                  placeholder="e.g., Extra napkins, Paper cups, Cleaning supplies"
                  required
                />
              </div>
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
            </div>

            {/* Justification */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Justification *
              </label>
              <textarea
                value={currentItem.justification}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, justification: e.target.value }))}
                className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={4}
                placeholder="Explain why this item is needed urgently and cannot wait for normal workflow..."
                required
              />
              <p className="text-sm text-amber-600 mt-2">
                Note: Direct requests bypass normal approval workflow and require strong justification
              </p>
            </div>

            {/* Add Button */}
            <div className="flex justify-end">
              <Button
                onClick={addItem}
                disabled={!currentItem.itemName || !currentItem.quantity || !currentItem.justification}
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
                  {inventoryItems.length} direct inventory item(s) will be sent for urgent review
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
                  variant="secondary"
                >
                  {isSubmitting ? 'Submitting...' : `Submit ${inventoryItems.length} Direct Request(s)`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">⚠️ Important Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-yellow-800 text-sm space-y-2">
            <p>
              <strong>Direct inventory requests</strong> bypass the normal product request workflow and should only be used for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Emergency situations (equipment breakdown, unexpected events)</li>
              <li>Urgent operational needs that cannot wait for normal approval</li>
              <li>Critical items needed to maintain customer service</li>
            </ul>
            <p className="mt-3">
              <strong>All direct requests require detailed justification and will be closely reviewed.</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fast-Track Approval Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-amber-700 text-sm mb-4">
              Direct requests go through expedited approval:
            </p>
            <div className="flex items-center space-x-2">
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                Branch Manager (You)
              </div>
              <div className="mx-2 text-amber-400">→</div>
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                Inventory Manager
              </div>
              <div className="mx-2 text-amber-400">→</div>
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                Main Manager (Final)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}