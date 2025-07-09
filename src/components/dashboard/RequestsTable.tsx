// src/components/dashboard/RequestsTable.tsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, getRoleDisplayName } from '@/lib/utils';
import { AllRequestTypes, RequestStatus } from '@/types';
import { 
  ClipboardList, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  Filter,
  MessageSquare,
  Package,
  ChefHat,
  Truck,
  Zap,
  Route,
  MapPin,
  Weight,
  AlertTriangle
} from 'lucide-react';

export function RequestsTable() {
  const { user } = useAuth();
  const { requests, products, branches, suppliers, approveRequest, rejectRequest } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<AllRequestTypes | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'approve' | 'reject', requestId: string } | null>(null);

  // Filter requests based on user role and permissions
  const getRelevantRequests = () => {
    let filteredRequests = [...requests];

    switch (user?.role) {
      case 'branch_manager':
        filteredRequests = filteredRequests.filter(req => {
          if (req.type === 'product_request' || req.type === 'direct_inventory_request') {
            return req.branchId === user.branchId;
          }
          return false;
        });
        break;
      case 'main_manager':
        // Main manager can see all requests
        break;
      case 'central_kitchen_manager':
        filteredRequests = filteredRequests.filter(req => 
          req.type === 'inventory_request' ||
          req.currentApprover === 'central_kitchen_manager' || 
          req.approvalHistory.some(step => step.role === 'central_kitchen_manager')
        );
        break;
      case 'inventory_manager':
        filteredRequests = filteredRequests.filter(req => 
          req.type === 'inventory_request' ||
          req.type === 'supply_request' ||
          req.type === 'direct_inventory_request' ||
          req.type === 'logistics_request' ||
          req.currentApprover === 'inventory_manager' || 
          req.approvalHistory.some(step => step.role === 'inventory_manager')
        );
        break;
      case 'supplier_manager':
        filteredRequests = filteredRequests.filter(req => 
          req.type === 'supply_request' ||
          req.currentApprover === 'supplier_manager' || 
          req.approvalHistory.some(step => step.role === 'supplier_manager')
        );
        break;
      case 'logistics_manager':
        filteredRequests = filteredRequests.filter(req => 
          req.type === 'logistics_request' ||
          req.currentApprover === 'logistics_manager' || 
          req.approvalHistory.some(step => step.role === 'logistics_manager')
        );
        break;
    }

    if (statusFilter !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.type === typeFilter);
    }

    return filteredRequests.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };

  const relevantRequests = getRelevantRequests();

  const canApprove = (request: AllRequestTypes) => {
    return request.currentApprover === user?.role && request.status !== 'approved' && request.status !== 'rejected';
  };

  const handleApprovalAction = (type: 'approve' | 'reject', requestId: string) => {
    setPendingAction({ type, requestId });
    setShowNotesModal(true);
  };

  const confirmAction = () => {
    if (!pendingAction || !user) return;

    if (pendingAction.type === 'approve') {
      approveRequest(pendingAction.requestId, user.id, approvalNotes || undefined);
    } else {
      rejectRequest(pendingAction.requestId, user.id, approvalNotes || undefined);
    }

    setApprovalNotes('');
    setShowNotesModal(false);
    setPendingAction(null);
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'product_request': return Package;
      case 'inventory_request': return ChefHat;
      case 'supply_request': return Truck;
      case 'direct_inventory_request': return Zap;
      case 'logistics_request': return Route;
      default: return ClipboardList;
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'product_request': return 'Product Request';
      case 'inventory_request': return 'Inventory Request';
      case 'supply_request': return 'Supply Request';
      case 'direct_inventory_request': return 'Direct Inventory';
      case 'logistics_request': return 'Logistics Request';
      default: return 'Unknown';
    }
  };

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case 'product_request': return 'default';
      case 'inventory_request': return 'pending';
      case 'supply_request': return 'approved';
      case 'direct_inventory_request': return 'rejected';
      case 'logistics_request': return 'in_progress';
      default: return 'default';
    }
  };

  const renderRequestDetails = (request: AllRequestTypes) => {
    switch (request.type) {
      case 'product_request':
        const product = products.find(p => p.id === request.productId);
        const branch = branches.find(b => b.id === request.branchId);
        return (
          <div className="text-sm text-amber-700">
            {product?.name} • {branch?.name} • Qty: {request.orderQuantity}
          </div>
        );
      case 'inventory_request':
        return (
          <div className="text-sm text-amber-700">
            {request.itemName} • {request.category} • Qty: {request.quantity}
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              request.urgencyLevel === 'high' ? 'bg-red-100 text-red-800' :
              request.urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {request.urgencyLevel}
            </span>
          </div>
        );
      case 'supply_request':
        const supplier = suppliers.find(s => s.id === request.supplierId);
        return (
          <div className="text-sm text-amber-700">
            {supplier?.name} • {request.items.length} items • ${request.totalEstimatedCost.toFixed(2)}
            {request.priority === 'urgent' && (
              <span className="ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                Urgent
              </span>
            )}
          </div>
        );
      case 'direct_inventory_request':
        const directBranch = branches.find(b => b.id === request.branchId);
        return (
          <div className="text-sm text-amber-700">
            {request.itemName} • {directBranch?.name} • Qty: {request.quantity}
            <span className="ml-2 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
              Direct
            </span>
          </div>
        );
      case 'logistics_request':
        const fromBranch = branches.find(b => b.id === request.fromLocation);
        const toBranch = branches.find(b => b.id === request.toLocation);
        const totalWeight = request.items.reduce((sum, item) => sum + (item.weight || 0), 0);
        return (
          <div className="text-sm text-amber-700">
            {request.requestType} • {fromBranch?.name} → {toBranch?.name} • {request.items.length} items
            {totalWeight > 0 && ` • ${totalWeight}kg`}
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
              request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
              request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {request.priority}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const getUniqueRequestTypes = () => {
    const types = new Set(requests.map(req => req.type));
    return Array.from(types);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">Requests Management</h2>
          <p className="text-amber-700">Manage all types of requests and approvals</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-amber-600" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {getUniqueRequestTypes().map(type => (
                <option key={type} value={type}>
                  {getRequestTypeLabel(type)}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
              className="border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5" />
            <span>All Requests ({relevantRequests.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {relevantRequests.length === 0 ? (
            <div className="text-center py-12 text-amber-600">
              <ClipboardList className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No requests found</p>
              <p className="text-sm">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-amber-100">
                    <th className="text-left py-3 px-4 font-medium text-amber-900">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-amber-900">Details</th>
                    <th className="text-left py-3 px-4 font-medium text-amber-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-amber-900">Current Approver</th>
                    <th className="text-left py-3 px-4 font-medium text-amber-900">Updated</th>
                    <th className="text-left py-3 px-4 font-medium text-amber-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {relevantRequests.map((request) => {
                    const TypeIcon = getRequestTypeIcon(request.type);
                    
                    return (
                      <tr key={request.id} className="border-b border-amber-50 hover:bg-amber-25 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <TypeIcon className="h-5 w-5 text-amber-600" />
                            <div>
                              <Badge variant={getRequestTypeBadge(request.type) as any}>
                                {getRequestTypeLabel(request.type)}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {renderRequestDetails(request)}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={request.status}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-amber-700 text-sm">
                          {request.currentApprover ? getRoleDisplayName(request.currentApprover) : 'Complete'}
                        </td>
                        <td className="py-4 px-4 text-amber-600 text-sm">
                          {formatDate(request.updatedAt)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canApprove(request) && (
                              <>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleApprovalAction('approve', request.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleApprovalAction('reject', request.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Notes Modal */}
      {showNotesModal && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>{pendingAction.type === 'approve' ? 'Approve' : 'Reject'} Request</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={4}
                  placeholder={`Add notes for this ${pendingAction.type}al...`}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNotesModal(false);
                    setPendingAction(null);
                    setApprovalNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant={pendingAction.type === 'approve' ? 'secondary' : 'danger'}
                  onClick={confirmAction}
                >
                  {pendingAction.type === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {React.createElement(getRequestTypeIcon(selectedRequest.type), { className: "h-5 w-5" })}
                <span>{getRequestTypeLabel(selectedRequest.type)} Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Request-specific details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-amber-700">Request Type</label>
                  <p className="text-amber-900 font-medium">
                    <Badge variant={getRequestTypeBadge(selectedRequest.type) as any}>
                      {getRequestTypeLabel(selectedRequest.type)}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-amber-700">Status</label>
                  <Badge variant={selectedRequest.status}>
                    {selectedRequest.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {/* Render specific details based on request type */}
              {selectedRequest.type === 'product_request' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-amber-700">Product</label>
                    <p className="text-amber-900 font-medium">
                      {products.find(p => p.id === selectedRequest.productId)?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700">Branch</label>
                    <p className="text-amber-900">
                      {branches.find(b => b.id === selectedRequest.branchId)?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700">Order Quantity</label>
                    <p className="text-amber-900 font-medium">{selectedRequest.orderQuantity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700">Balance Quantity</label>
                    <p className="text-amber-900">{selectedRequest.balanceQuantity}</p>
                  </div>
                </div>
              )}

              {selectedRequest.type === 'inventory_request' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-amber-700">Item Name</label>
                    <p className="text-amber-900 font-medium">{selectedRequest.itemName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700">Category</label>
                    <p className="text-amber-900">{selectedRequest.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700">Quantity</label>
                    <p className="text-amber-900 font-medium">{selectedRequest.quantity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700">Urgency</label>
                    <Badge variant={selectedRequest.urgencyLevel === 'high' ? 'rejected' : 'default'}>
                      {selectedRequest.urgencyLevel}
                    </Badge>
                  </div>
                </div>
              )}

              {selectedRequest.type === 'supply_request' && (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-amber-700">Supplier</label>
                      <p className="text-amber-900 font-medium">
                        {suppliers.find(s => s.id === selectedRequest.supplierId)?.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amber-700">Total Cost</label>
                      <p className="text-amber-900 font-medium">${selectedRequest.totalEstimatedCost.toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700 mb-2 block">Items</label>
                    <div className="space-y-2">
                      {selectedRequest.items.map((item, index) => (
                        <div key={index} className="bg-amber-50 p-3 rounded-lg">
                          <div className="font-medium text-amber-900">{item.itemName}</div>
                          <div className="text-sm text-amber-700">
                            Qty: {item.quantity}
                            {item.unitPrice && ` • $${item.unitPrice.toFixed(2)} each`}
                            {item.totalPrice && ` • Total: $${item.totalPrice.toFixed(2)}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedRequest.type === 'direct_inventory_request' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-amber-700">Item Name</label>
                    <p className="text-amber-900 font-medium">{selectedRequest.itemName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700">Quantity</label>
                    <p className="text-amber-900 font-medium">{selectedRequest.quantity}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-amber-700">Justification</label>
                    <p className="text-amber-900 bg-amber-50 p-3 rounded-lg">{selectedRequest.justification}</p>
                  </div>
                </div>
              )}

              {selectedRequest.type === 'logistics_request' && (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-amber-700">Request Type</label>
                      <p className="text-amber-900 font-medium capitalize">{selectedRequest.requestType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amber-700">Priority</label>
                      <Badge variant={selectedRequest.priority === 'urgent' ? 'rejected' : 'default'}>
                        {selectedRequest.priority}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amber-700">From Location</label>
                      <p className="text-amber-900">{branches.find(b => b.id === selectedRequest.fromLocation)?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amber-700">To Location</label>
                      <p className="text-amber-900">{branches.find(b => b.id === selectedRequest.toLocation)?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amber-700">Vehicle Type</label>
                      <p className="text-amber-900 capitalize">{selectedRequest.vehicleType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amber-700">Scheduled Date</label>
                      <p className="text-amber-900">{selectedRequest.scheduledDate ? formatDate(selectedRequest.scheduledDate) : 'Not scheduled'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-700 mb-2 block">Items to Transport</label>
                    <div className="space-y-2">
                      {selectedRequest.items.map((item, index) => (
                        <div key={index} className="bg-amber-50 p-3 rounded-lg">
                          <div className="font-medium text-amber-900">{item.itemName}</div>
                          <div className="text-sm text-amber-700 flex items-center space-x-4">
                            <span>Qty: {item.quantity}</span>
                            {item.weight && (
                              <span className="flex items-center">
                                <Weight className="h-3 w-3 mr-1" />
                                {item.weight}kg
                              </span>
                            )}
                            {item.dimensions && (
                              <span className="flex items-center">
                                <Package className="h-3 w-3 mr-1" />
                                {item.dimensions}
                              </span>
                            )}
                          </div>
                          {item.handlingInstructions && (
                            <div className="text-sm text-amber-600 mt-1 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {item.handlingInstructions}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedRequest.specialInstructions && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-amber-700">Special Instructions</label>
                      <p className="text-amber-900 bg-amber-50 p-3 rounded-lg">{selectedRequest.specialInstructions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedRequest.notes && (
                <div>
                  <label className="text-sm font-medium text-amber-700">Notes</label>
                  <p className="text-amber-900 bg-amber-50 p-3 rounded-lg">{selectedRequest.notes}</p>
                </div>
              )}

              {/* Approval History */}
              <div>
                <label className="text-sm font-medium text-amber-700 mb-3 block">Approval History</label>
                <div className="space-y-3">
                  {selectedRequest.approvalHistory.map((step, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-amber-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        step.action === 'approved' ? 'bg-green-100' : 
                        step.action === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        {step.action === 'approved' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : step.action === 'rejected' ? (
                          <XCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-amber-900">
                          {getRoleDisplayName(step.role)}
                        </div>
                        <div className="text-sm text-amber-700">
                          {step.action} • {formatDate(step.timestamp)}
                        </div>
                        {step.notes && (
                          <div className="text-sm text-amber-600 mt-1">{step.notes}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-amber-100">
                {canApprove(selectedRequest) && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedRequest(null);
                        handleApprovalAction('approve', selectedRequest.id);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setSelectedRequest(null);
                        handleApprovalAction('reject', selectedRequest.id);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}