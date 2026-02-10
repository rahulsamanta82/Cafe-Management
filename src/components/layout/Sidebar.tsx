// src/components/layout/Sidebar.tsx
'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { getRoleDisplayName } from '@/lib/utils';
import { 
  Coffee, 
  Home, 
  Package, 
  ClipboardList, 
  Users, 
  Settings, 
  LogOut,
  ShoppingCart,
  Truck,
  ChefHat,
  Warehouse,
  Zap,
  Map,
  Route,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home }
    ];

    switch (user?.role) {
      case 'branch_manager':
        return [
          ...baseItems,
          { id: 'requests', label: 'My Requests', icon: ClipboardList },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'new-request', label: 'New Product Request', icon: ShoppingCart },
          { id: 'direct-inventory', label: 'Direct Inventory', icon: Zap }
        ];
      case 'main_manager':
        return [
          ...baseItems,
          { id: 'requests', label: 'All Requests', icon: ClipboardList },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'branches', label: 'Branches', icon: Users },
          { id: 'logistics', label: 'Logistics Overview', icon: Truck },
          { id: 'reports', label: 'Reports', icon: Settings }
        ];
      case 'central_kitchen_manager':
        return [
          ...baseItems,
          { id: 'requests', label: 'My Requests', icon: ClipboardList },
          { id: 'inventory-request', label: 'Request Inventory', icon: ChefHat },
          { id: 'kitchen', label: 'Kitchen Orders', icon: ChefHat },
          { id: 'products', label: 'Products', icon: Package }
        ];
      case 'inventory_manager':
        return [
          ...baseItems,
          { id: 'requests', label: 'All Requests', icon: ClipboardList },
          { id: 'supply-request', label: 'Request Supplies', icon: Warehouse },
          { id: 'inventory', label: 'Inventory', icon: Package },
          { id: 'logistics', label: 'Logistics Coordination', icon: Truck },
          { id: 'stock', label: 'Stock Levels', icon: Settings }
        ];
      case 'supplier_manager':
        return [
          ...baseItems,
          { id: 'requests', label: 'Supply Requests', icon: ClipboardList },
          { id: 'suppliers', label: 'Suppliers', icon: Truck },
          { id: 'orders', label: 'Supply Orders', icon: ShoppingCart },
          { id: 'logistics', label: 'Delivery Schedule', icon: Calendar }
        ];
      case 'logistics_manager':
        return [
          ...baseItems,
          { id: 'requests', label: 'Logistics Requests', icon: ClipboardList },
          { id: 'logistics-request', label: 'Create Logistics Request', icon: Truck },
          { id: 'routes', label: 'Route Planning', icon: Route },
          { id: 'deliveries', label: 'Delivery Schedule', icon: Calendar },
          { id: 'vehicles', label: 'Vehicle Management', icon: Truck },
          { id: 'tracking', label: 'Shipment Tracking', icon: Map }
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white shadow-lg border-r border-amber-100 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-600 p-2 rounded-lg">
            <Coffee className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-amber-900">Rahul Cafe</h1>
            <p className="text-sm text-amber-700">Management System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-amber-100">
        <div className="bg-amber-50 rounded-lg p-3">
          <div className="font-medium text-amber-900">{user?.name}</div>
          <div className="text-sm text-amber-700">{getRoleDisplayName(user?.role || '')}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-amber-100 text-amber-900 border-l-4 border-amber-600'
                    : 'text-amber-700 hover:bg-amber-50 hover:text-amber-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-amber-100">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}