// src/context/AppContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  ProductRequest, 
  InventoryRequest,
  SupplyRequest,
  DirectInventoryRequest,
  LogisticsRequest,
  AllRequestTypes,
  Branch, 
  UserRole, 
  ProductApprovalStep,
  Supplier,
  SupplyItem,
  LogisticsItem
} from '@/types';
import { PRODUCTS as INITIAL_PRODUCTS, MOCK_REQUESTS as INITIAL_REQUESTS, BRANCHES, SUPPLIERS } from '@/data/mockData';

interface AppContextType {
  products: Product[];
  requests: AllRequestTypes[];
  productRequests: ProductRequest[];
  inventoryRequests: InventoryRequest[];
  supplyRequests: SupplyRequest[];
  directInventoryRequests: DirectInventoryRequest[];
  logisticsRequests: LogisticsRequest[];
  branches: Branch[];
  suppliers: Supplier[];
  
  // Product methods
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, createdBy: string, branchId?: string) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  approveProduct: (productId: string, userId: string, notes?: string) => void;
  rejectProduct: (productId: string, userId: string, notes?: string) => void;
  
  // Product request methods
  createProductRequest: (request: Omit<ProductRequest, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory' | 'type'>) => void;
  
  // Inventory request methods
  createInventoryRequest: (request: Omit<InventoryRequest, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory' | 'type'>) => void;
  
  // Supply request methods
  createSupplyRequest: (request: Omit<SupplyRequest, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory' | 'type'>) => void;
  
  // Direct inventory request methods
  createDirectInventoryRequest: (request: Omit<DirectInventoryRequest, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory' | 'type'>) => void;
  
  // Logistics request methods
  createLogisticsRequest: (request: Omit<LogisticsRequest, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory' | 'type'>) => void;
  
  // Generic approval methods
  approveRequest: (requestId: string, userId: string, notes?: string) => void;
  rejectRequest: (requestId: string, userId: string, notes?: string) => void;
  updateRequest: (id: string, updates: Partial<AllRequestTypes>) => void;
  
  // Reset data (for testing)
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<AllRequestTypes[]>([]);
  const [branches] = useState<Branch[]>(BRANCHES);
  const [suppliers] = useState<Supplier[]>(SUPPLIERS);

  // Filtered request arrays
  const productRequests = requests.filter(req => req.type === 'product_request') as ProductRequest[];
  const inventoryRequests = requests.filter(req => req.type === 'inventory_request') as InventoryRequest[];
  const supplyRequests = requests.filter(req => req.type === 'supply_request') as SupplyRequest[];
  const directInventoryRequests = requests.filter(req => req.type === 'direct_inventory_request') as DirectInventoryRequest[];
  const logisticsRequests = requests.filter(req => req.type === 'logistics_request') as LogisticsRequest[];

  // Initialize products with proper defaults
  const initializeProducts = () => {
    console.log('Initializing products...', INITIAL_PRODUCTS.length);
    const enhancedProducts = INITIAL_PRODUCTS.map(product => ({
      ...product,
      status: 'approved' as const,
      currentApprover: null,
      approvalHistory: [
        {
          role: 'main_manager' as UserRole,
          userId: '1',
          action: 'approved' as const,
          timestamp: new Date().toISOString(),
          notes: 'Initial product - pre-approved'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    console.log('Enhanced products:', enhancedProducts.length);
    setProducts(enhancedProducts);
    localStorage.setItem('blumen_products', JSON.stringify(enhancedProducts));
  };

  // Initialize requests
  const initializeRequests = () => {
    const enhancedRequests = INITIAL_REQUESTS.map(req => ({ ...req, type: 'product_request' as const }));
    setRequests(enhancedRequests);
    localStorage.setItem('blumen_all_requests', JSON.stringify(enhancedRequests));
  };

  // Reset data function for testing
  const resetData = () => {
    localStorage.removeItem('blumen_products');
    localStorage.removeItem('blumen_all_requests');
    initializeProducts();
    initializeRequests();
  };

  // Initialize data
  useEffect(() => {
    console.log('AppContext useEffect triggered');
    
    const storedProducts = localStorage.getItem('blumen_products');
    const storedRequests = localStorage.getItem('blumen_all_requests');
    
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        console.log('Loaded products from storage:', parsedProducts.length);
        setProducts(parsedProducts);
      } catch (error) {
        console.error('Error parsing stored products:', error);
        initializeProducts();
      }
    } else {
      console.log('No stored products found, initializing...');
      initializeProducts();
    }
    
    if (storedRequests) {
      try {
        const parsedRequests = JSON.parse(storedRequests);
        setRequests(parsedRequests);
      } catch (error) {
        console.error('Error parsing stored requests:', error);
        initializeRequests();
      }
    } else {
      initializeRequests();
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('blumen_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem('blumen_all_requests', JSON.stringify(requests));
    }
  }, [requests]);

  // Product methods
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, createdBy: string, branchId?: string) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdBy,
      branchId,
      status: 'pending',
      currentApprover: 'main_manager',
      approvalHistory: [
        {
          role: branchId ? 'branch_manager' : 'main_manager',
          userId: createdBy,
          action: 'pending',
          timestamp: new Date().toISOString(),
          notes: 'Product created and submitted for approval'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { 
        ...product, 
        ...productData, 
        updatedAt: new Date().toISOString() 
      } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getNextProductApprover = (currentApprover: UserRole | null | undefined): UserRole | null => {
    const workflow: UserRole[] = ['main_manager', 'central_kitchen_manager', 'inventory_manager'];
    
    if (!currentApprover) return workflow[0];
    
    const currentIndex = workflow.indexOf(currentApprover);
    return currentIndex < workflow.length - 1 ? workflow[currentIndex + 1] : null;
  };

  const approveProduct = (productId: string, userId: string, notes?: string) => {
    setProducts(prev => prev.map(product => {
      if (product.id !== productId) return product;

      const currentApprover = product.currentApprover;
      const nextApprover = getNextProductApprover(currentApprover);
      
      const newApprovalStep: ProductApprovalStep = {
        role: currentApprover!,
        userId,
        action: 'approved',
        timestamp: new Date().toISOString(),
        notes
      };

      return {
        ...product,
        status: nextApprover ? 'pending' : 'approved',
        currentApprover: nextApprover,
        approvalHistory: [...(product.approvalHistory || []), newApprovalStep],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const rejectProduct = (productId: string, userId: string, notes?: string) => {
    setProducts(prev => prev.map(product => {
      if (product.id !== productId) return product;

      const newApprovalStep: ProductApprovalStep = {
        role: product.currentApprover!,
        userId,
        action: 'rejected',
        timestamp: new Date().toISOString(),
        notes
      };

      return {
        ...product,
        status: 'rejected',
        currentApprover: null,
        approvalHistory: [...(product.approvalHistory || []), newApprovalStep],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // Request creation methods
  const createProductRequest = (requestData: Omit<ProductRequest, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory' | 'type'>) => {
    const newRequest: ProductRequest = {
      ...requestData,
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'product_request',
      status: 'pending',
      currentApprover: 'main_manager',
      approvalHistory: [
        {
          role: 'branch_manager',
          userId: requestData.requestedBy,
          action: 'approved',
          timestamp: new Date().toISOString(),
          notes: 'Product request submitted'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const createInventoryRequest = (requestData: Omit<InventoryRequest, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory' | 'type'>) => {
    const newRequest: InventoryRequest = {
      ...requestData,
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'inventory_request',
      status: 'pending',
      currentApprover: 'inventory_manager',
      approvalHistory: [
        {
          role: 'central_kitchen_manager',
          userId: requestData.requestedBy,
          action: 'approved',
          timestamp: new Date().toISOString(),
          notes: 'Inventory request submitted'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const createSupplyRequest = (requestData: Omit<SupplyRequest, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory' | 'type'>) => {
    const newRequest: SupplyRequest = {
      ...requestData,
      id: `sup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'supply_request',
      status: 'pending',
      currentApprover: 'supplier_manager',
      approvalHistory: [
        {
          role: 'inventory_manager',
          userId: requestData.requestedBy,
          action: 'approved',
          timestamp: new Date().toISOString(),
          notes: 'Supply request submitted'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const createDirectInventoryRequest = (requestData: Omit<DirectInventoryRequest, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory' | 'type'>) => {
    const newRequest: DirectInventoryRequest = {
      ...requestData,
      id: `dir-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'direct_inventory_request',
      status: 'pending',
      currentApprover: 'inventory_manager',
      approvalHistory: [
        {
          role: 'branch_manager',
          userId: requestData.requestedBy,
          action: 'approved',
          timestamp: new Date().toISOString(),
          notes: 'Direct inventory request submitted'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const createLogisticsRequest = (requestData: Omit<LogisticsRequest, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory' | 'type'>) => {
    const newRequest: LogisticsRequest = {
      ...requestData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'logistics_request',
      status: 'pending',
      currentApprover: 'inventory_manager',
      approvalHistory: [
        {
          role: 'logistics_manager',
          userId: requestData.requestedBy,
          action: 'approved',
          timestamp: new Date().toISOString(),
          notes: 'Logistics request submitted'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRequests(prev => [...prev, newRequest]);
  };

  // Generic workflow helpers
  const getNextApprover = (currentApprover: string, requestType: string) => {
    const workflows = {
      'product_request': ['main_manager', 'central_kitchen_manager', 'main_manager', 'inventory_manager', 'main_manager', 'supplier_manager', 'main_manager'],
      'inventory_request': ['inventory_manager'],
      'supply_request': ['supplier_manager', 'inventory_manager'],
      'direct_inventory_request': ['inventory_manager', 'main_manager'],
      'logistics_request': ['inventory_manager']
    };
    
    const workflow = workflows[requestType as keyof typeof workflows] || [];
    const currentIndex = workflow.indexOf(currentApprover);
    return currentIndex < workflow.length - 1 ? workflow[currentIndex + 1] : null;
  };

  const approveRequest = (requestId: string, userId: string, notes?: string) => {
    setRequests(prev => prev.map(request => {
      if (request.id !== requestId) return request;

      const currentApprover = request.currentApprover;
      const nextApprover = getNextApprover(currentApprover || '', request.type);
      
      const newApprovalStep = {
        role: currentApprover!,
        userId,
        action: 'approved' as const,
        timestamp: new Date().toISOString(),
        notes
      };

      return {
        ...request,
        status: nextApprover ? 'in_progress' as const : 'approved' as const,
        currentApprover: nextApprover,
        approvalHistory: [...request.approvalHistory, newApprovalStep],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const rejectRequest = (requestId: string, userId: string, notes?: string) => {
    setRequests(prev => prev.map(request => {
      if (request.id !== requestId) return request;

      const newApprovalStep = {
        role: request.currentApprover!,
        userId,
        action: 'rejected' as const,
        timestamp: new Date().toISOString(),
        notes
      };

      return {
        ...request,
        status: 'rejected' as const,
        currentApprover: null,
        approvalHistory: [...request.approvalHistory, newApprovalStep],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const updateRequest = (id: string, updates: Partial<AllRequestTypes>) => {
    setRequests(prev => prev.map(request => 
      request.id === id ? { ...request, ...updates, updatedAt: new Date().toISOString() } : request
    ));
  };

  return (
    <AppContext.Provider value={{
      products,
      requests,
      productRequests,
      inventoryRequests,
      supplyRequests,
      directInventoryRequests,
      logisticsRequests,
      branches,
      suppliers,
      addProduct,
      updateProduct,
      deleteProduct,
      approveProduct,
      rejectProduct,
      createProductRequest,
      createInventoryRequest,
      createSupplyRequest,
      createDirectInventoryRequest,
      createLogisticsRequest,
      approveRequest,
      rejectRequest,
      updateRequest,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}