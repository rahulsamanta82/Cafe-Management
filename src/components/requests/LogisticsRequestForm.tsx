// src/components/requests/LogisticsRequestForm.tsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Truck, Package, CheckCircle, Plus, Trash2, Edit2, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { LogisticsItem } from '@/types';

interface ExtendedLogisticsItem extends LogisticsItem {
  id: string;
}

export function LogisticsRequestForm() {
  const { user } = useAuth();
  const { branches, createLogisticsRequest } = useApp();
  const [requestType, setRequestType] = useState<'delivery' | 'transfer' | 'pickup'>('delivery');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [logisticsItems, setLogisticsItems] = useState<ExtendedLogisticsItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    itemName: '',
    quantity: '',
    weight: '',
    dimensions: '',
    handlingInstructions: ''
  });
  const [scheduledDate, setScheduledDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [vehicleType, setVehicleType] = useState<'van' | 'truck' | 'refrigerated'>('van');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const addItem = () => {
    if (!currentItem.itemName || !currentItem.quantity) return;

    const newItem: ExtendedLogisticsItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemName: currentItem.itemName,
      quantity: parseInt(currentItem.quantity),
      weight: parseFloat(currentItem.weight) || undefined,
      dimensions: currentItem.dimensions || undefined,
      handlingInstructions: currentItem.handlingInstructions || undefined
    };

    setLogisticsItems(prev => [...prev, newItem]);
    
    // Clear form
    setCurrentItem({
      itemName: '',
      quantity: '',
      weight: '',
      dimensions: '',
      handlingInstructions: ''
    });
  };

  const removeItem = (itemId: string) => {
    setLogisticsItems(prev => prev.filter(item => item.id !== itemId));
    if (editingItemId === itemId) {
      setEditingItemId(null);
    }
  };

  const editItem = (item: ExtendedLogisticsItem) => {
    setEditingItemId(item.id);
    setCurrentItem({
      itemName: item.itemName,
      quantity: item.quantity.toString(),
      weight: item.weight?.toString() || '',
      dimensions: item.dimensions || '',
      handlingInstructions: item.handlingInstructions || ''
    });
  };

  const updateItem = () => {
    if (!editingItemId || !currentItem.itemName || !currentItem.quantity) return;

    setLogisticsItems(prev => prev.map(item => 
      item.id === editingItemId 
        ? {
            ...item,
            itemName: currentItem.itemName,
            quantity: parseInt(currentItem.quantity),
            weight: parseFloat(currentItem.weight) || undefined,
            dimensions: currentItem.dimensions || undefined,
            handlingInstructions: currentItem.handlingInstructions || undefined
          }
        : item
    ));

    // Clear form and exit edit mode
    setCurrentItem({
      itemName: '',
      quantity: '',
      weight: '',
      dimensions: '',
      handlingInstructions: ''
    });
    setEditingItemId(null);
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setCurrentItem({
      itemName: '',
      quantity: '',
      weight: '',
      dimensions: '',
      handlingInstructions: ''
    });
  };

  const getTotalWeight = () => {
    return logisticsItems.reduce((total, item) => total + (item.weight || 0), 0);
  };

  const handleSubmit = async () => {
    if (!user || !fromLocation || !toLocation || logisticsItems.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const itemsWithoutId = logisticsItems.map(({ id, ...item }) => item);

    createLogisticsRequest({
      requestType,
      fromLocation,
      toLocation,
      items: itemsWithoutId,
      scheduledDate: scheduledDate || undefined,
      priority,
      vehicleType,
      specialInstructions: specialInstructions || undefined,
      requestedBy: user.id,
      status: 'pending',
      currentApprover: 'inventory_manager'
    });

    // Reset form
    setRequestType('delivery');
    setFromLocation('');
    setToLocation('');
    setLogisticsItems([]);
    setScheduledDate('');
    setPriority('medium');
    setVehicleType('van');
    setSpecialInstructions('');
    setIsSubmitting(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (user?.role !== 'logistics_manager') {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Truck className="h-16 w-16 mx-auto mb-4 text-amber-300" />
          <h3 className="text-lg font-medium text-amber-900 mb-2">Access Restricted</h3>
          <p className="text-amber-600">Only logistics managers can create logistics requests</p>
        </CardContent>
      </Card>
    );
  }

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case 'delivery': return 'bg-blue-100 text-blue-800';
      case 'transfer': return 'bg-purple-100 text-purple-800';
      case 'pickup': return 'bg-green-100 text-green-800';
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
                <h3 className="font-medium text-green-900">Logistics Request Submitted!</h3>
                <p className="text-sm text-green-700">
                  Request sent to inventory manager for coordination.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-amber-900">Logistics Request</h2>
        <p className="text-amber-700">Coordinate deliveries, transfers, and pickups</p>
      </div>

      {/* Request Type and Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Request Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Request Type */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Request Type *
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as 'delivery' | 'transfer' | 'pickup')}
                className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              >
                <option value="delivery">Delivery</option>
                <option value="transfer">Transfer</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  From Location *
                </label>
                <select
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                >
                  <option value="">Select origin...</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  To Location *
                </label>
                <select
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                >
                  <option value="">Select destination...</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Schedule and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as 'van' | 'truck' | 'refrigerated')}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="van">Van</option>
                  <option value="truck">Truck</option>
                  <option value="refrigerated">Refrigerated</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Items */}
      {logisticsItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Items to Transport ({logisticsItems.length})</span>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={getRequestTypeColor(requestType) as any}>
                  {requestType}
                </Badge>
                <Badge variant={getPriorityColor(priority) as any}>
                  {priority}
                </Badge>
                <div className="text-sm text-amber-700">
                  Total Weight: {getTotalWeight()}kg
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logisticsItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex-1">
                    <div className="font-medium text-amber-900">{item.itemName}</div>
                    <div className="text-sm text-amber-700">
                      Qty: {item.quantity}
                      {item.weight && ` • Weight: ${item.weight}kg`}
                      {item.dimensions && ` • Dimensions: ${item.dimensions}`}
                    </div>
                    {item.handlingInstructions && (
                      <div className="text-sm text-amber-600 mt-1 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {item.handlingInstructions}
                      </div>
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
            <span>{editingItemId ? 'Edit Item' : 'Add Item'}</span>
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
                  placeholder="e.g., Coffee beans, Pastries, Equipment"
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
                  placeholder="Number of items"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Weight and Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currentItem.weight}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Total weight"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={currentItem.dimensions}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, dimensions: e.target.value }))}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., 50x30x20 cm"
                />
              </div>
            </div>

            {/* Handling Instructions */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Handling Instructions
              </label>
              <input
                type="text"
                value={currentItem.handlingInstructions}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, handlingInstructions: e.target.value }))}
                className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Fragile, Keep upright, Refrigerated"
              />
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

      {/* Special Instructions */}
      {logisticsItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Special Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Additional Notes
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={3}
                placeholder="Special delivery instructions, time constraints, contact information..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Request */}
      {logisticsItems.length > 0 && fromLocation && toLocation && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-amber-900">Ready to Submit</h3>
                <p className="text-sm text-amber-700">
                  {logisticsItems.length} item(s) • {requestType} • {priority} priority
                </p>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('Clear all items?')) {
                      setLogisticsItems([]);
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
                  {isSubmitting ? 'Submitting...' : 'Submit Logistics Request'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logistics Role Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">📋 Logistics Manager Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-800 text-sm space-y-2">
            <p><strong>Your role coordinates:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Deliveries from suppliers to branches and kitchen</li>
              <li>Inventory transfers between locations</li>
              <li>Equipment and supply pickups</li>
              <li>Route optimization and scheduling</li>
              <li>Vehicle allocation and maintenance</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Approval Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-amber-700 text-sm mb-4">
              Logistics requests go through the following approval:
            </p>
            <div className="flex items-center space-x-2">
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                Logistics Manager (You)
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