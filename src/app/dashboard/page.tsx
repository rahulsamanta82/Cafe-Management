// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { RequestsTable } from '@/components/dashboard/RequestsTable';
import { ProductsTable } from '@/components/dashboard/ProductsTable';
import { NewRequestForm } from '@/components/dashboard/NewRequestForm';
import { InventoryRequestForm } from '@/components/requests/InventoryRequestForm';
import { SupplyRequestForm } from '@/components/requests/SupplyRequestForm';
import { DirectInventoryRequestForm } from '@/components/requests/DirectInventoryRequestForm';
import { LogisticsRequestForm } from '@/components/requests/LogisticsRequestForm';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'requests':
        return <RequestsTable />;
      case 'products':
        return <ProductsTable />;
      case 'new-request':
        return <NewRequestForm />;
      case 'inventory-request':
        return <InventoryRequestForm />;
      case 'supply-request':
        return <SupplyRequestForm />;
      case 'direct-inventory':
        return <DirectInventoryRequestForm />;
      case 'logistics-request':
        return <LogisticsRequestForm />;
      
      // Logistics Manager specific tabs
      case 'routes':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Route Planning</h2>
            <p className="text-amber-700">Optimize delivery routes and schedules</p>
            <div className="mt-8 text-amber-600">Feature coming soon...</div>
          </div>
        );
      case 'deliveries':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Delivery Schedule</h2>
            <p className="text-amber-700">Manage delivery schedules and assignments</p>
            <div className="mt-8 text-amber-600">Feature coming soon...</div>
          </div>
        );
      case 'vehicles':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Vehicle Management</h2>
            <p className="text-amber-700">Manage fleet vehicles and maintenance</p>
            <div className="mt-8 text-amber-600">Feature coming soon...</div>
          </div>
        );
      case 'tracking':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Shipment Tracking</h2>
            <p className="text-amber-700">Track deliveries and shipments in real-time</p>
            <div className="mt-8 text-amber-600">Feature coming soon...</div>
          </div>
        );
      case 'logistics':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Logistics Overview</h2>
            <p className="text-amber-700">Comprehensive logistics management dashboard</p>
            <div className="mt-8 text-amber-600">Feature coming soon...</div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
            </h2>
            <p className="text-amber-700">This feature is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}