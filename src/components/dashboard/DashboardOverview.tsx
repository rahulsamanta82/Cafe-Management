'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate, getRoleDisplayName } from '@/lib/utils';
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  XCircle,
  Package,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export function DashboardOverview() {
  const { user } = useAuth();
  const { requests, products, branches } = useApp();

  // Filter requests based on user role
  const getRelevantRequests = () => {
    switch (user?.role) {
      case 'branch_manager':
        return requests.filter(req => req.branchId === user.branchId);
      case 'main_manager':
        return requests.filter(req => req.currentApprover === 'main_manager');
      case 'central_kitchen_manager':
        return requests.filter(req => req.currentApprover === 'central_kitchen_manager');
      case 'inventory_manager':
        return requests.filter(req => req.currentApprover === 'inventory_manager');
      case 'supplier_manager':
        return requests.filter(req => req.currentApprover === 'supplier_manager');
      default:
        return requests;
    }
  };

  // Filter products based on user role
  const getRelevantProducts = () => {
    switch (user?.role) {
      case 'branch_manager':
        return products.filter(prod => prod.branchId === user.branchId || !prod.branchId);
      case 'main_manager':
        return products.filter(prod => prod.currentApprover === 'main_manager');
      case 'central_kitchen_manager':
        return products.filter(prod => prod.currentApprover === 'central_kitchen_manager');
      case 'inventory_manager':
        return products.filter(prod => prod.currentApprover === 'inventory_manager');
      default:
        return products;
    }
  };

  const relevantRequests = getRelevantRequests();
  const relevantProducts = getRelevantProducts();
  const pendingRequests = relevantRequests.filter(req => req.status === 'pending' || req.status === 'in_progress');
  const approvedRequests = relevantRequests.filter(req => req.status === 'approved');
  const pendingProducts = relevantProducts.filter(prod => prod.status === 'pending');
  const approvedProducts = products.filter(prod => prod.status === 'approved');

  const stats = [
    {
      title: 'Pending Request Approvals',
      value: pendingRequests.length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Pending Product Approvals',
      value: pendingProducts.length,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Approved Products',
      value: approvedProducts.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Branches',
      value: branches.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-amber-100">
          Here's what's happening in your cafe management system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-700">{stat.title}</p>
                    <p className="text-3xl font-bold text-amber-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5" />
              <span>Recent Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {relevantRequests.length === 0 ? (
              <div className="text-center py-8 text-amber-600">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No requests to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                {relevantRequests.slice(0, 5).map((request) => {
                  const product = products.find(p => p.id === request.productId);
                  const branch = branches.find(b => b.id === request.branchId);
                  
                  return (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h4 className="font-medium text-amber-900">{product?.name}</h4>
                            <p className="text-sm text-amber-700">
                              {branch?.name} • Qty: {request.orderQuantity}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={request.status}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                        <div className="text-sm text-amber-600">
                          {formatDate(request.updatedAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Recent Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {relevantProducts.length === 0 ? (
              <div className="text-center py-8 text-amber-600">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No products to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                {relevantProducts.slice(0, 5).map((product) => {
                  const branch = branches.find(b => b.id === product.branchId);
                  
                  return (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h4 className="font-medium text-amber-900">{product.name}</h4>
                            <p className="text-sm text-amber-700">
                              {product.category} • ${product.basePrice.toFixed(2)}
                              {branch && ` • ${branch.name}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={product.status === 'pending' ? 'pending' : product.status === 'approved' ? 'approved' : 'rejected'}>
                          {product.status || 'approved'}
                        </Badge>
                        {product.currentApprover && (
                          <div className="text-xs text-amber-600">
                            → {getRoleDisplayName(product.currentApprover)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Workflow Information */}
      {(user?.role === 'branch_manager' || user?.role === 'main_manager') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Product Approval Workflow</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-amber-700 text-sm">
                New products go through the following approval process:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Branch Manager (Submit)',
                  'Main Manager',
                  'Central Kitchen Manager',
                  'Inventory Manager',
                  'Approved'
                ].map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      index === 0 ? 'bg-blue-100 text-blue-800' :
                      index === 4 ? 'bg-green-100 text-green-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {step}
                    </div>
                    {index < 4 && (
                      <div className="mx-2 text-amber-400">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}