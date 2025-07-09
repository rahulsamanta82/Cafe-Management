// src/types/index.ts
export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  branchId?: string;
}

export type UserRole = 
  | 'main_manager' 
  | 'branch_manager' 
  | 'central_kitchen_manager' 
  | 'inventory_manager' 
  | 'supplier_manager'
  | 'logistics_manager';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  supplier?: string;
  supplierPhone?: string;
  createdBy?: string;
  branchId?: string;
  productType?: 'branch_item' | 'kitchen_ingredient' | 'supplier_item';
  status?: 'pending' | 'approved' | 'rejected';
  currentApprover?: UserRole | null;
  approvalHistory?: ProductApprovalStep[];
  createdAt?: string;
  updatedAt?: string;
}

// Base Request Interface
export interface BaseRequest {
  id: string;
  requestedBy: string;
  status: RequestStatus;
  currentApprover: UserRole | null;
  approvalHistory: ApprovalStep[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// Product Request (Branch → Main Manager workflow)
export interface ProductRequest extends BaseRequest {
  type: 'product_request';
  productId: string;
  branchId: string;
  orderQuantity: number;
  balanceQuantity: number;
}

// Inventory Request (Kitchen → Inventory workflow)
export interface InventoryRequest extends BaseRequest {
  type: 'inventory_request';
  itemName: string;
  category: 'ingredients' | 'supplies' | 'equipment';
  quantity: number;
  currentStock: number;
  urgencyLevel: 'low' | 'medium' | 'high';
  estimatedCost?: number;
}

// Supply Request (Inventory → Supplier workflow)
export interface SupplyRequest extends BaseRequest {
  type: 'supply_request';
  supplierId: string;
  items: SupplyItem[];
  totalEstimatedCost: number;
  deliveryDate?: string;
  priority: 'normal' | 'urgent';
}

// Direct Inventory Request (Branch → Inventory direct)
export interface DirectInventoryRequest extends BaseRequest {
  type: 'direct_inventory_request';
  branchId: string;
  itemName: string;
  quantity: number;
  justification: string;
}

// NEW: Logistics Request (Logistics coordination)
export interface LogisticsRequest extends BaseRequest {
  type: 'logistics_request';
  requestType: 'delivery' | 'transfer' | 'pickup';
  fromLocation: string;
  toLocation: string;
  items: LogisticsItem[];
  scheduledDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  vehicleType?: 'van' | 'truck' | 'refrigerated';
  specialInstructions?: string;
}

export interface LogisticsItem {
  itemName: string;
  quantity: number;
  weight?: number;
  dimensions?: string;
  handlingInstructions?: string;
}

export interface SupplyItem {
  itemName: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  specifications?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  categories: string[];
  reliability: 'excellent' | 'good' | 'average';
}

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'in_progress';

export type AllRequestTypes = ProductRequest | InventoryRequest | SupplyRequest | DirectInventoryRequest | LogisticsRequest;

export interface ApprovalStep {
  role: UserRole;
  userId: string;
  action: 'approved' | 'rejected' | 'pending';
  timestamp: string;
  notes?: string;
}

export interface ProductApprovalStep {
  role: UserRole;
  userId: string;
  action: 'approved' | 'rejected' | 'pending';
  timestamp: string;
  notes?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  managerId: string;
}

// Workflow Definitions
export const PRODUCT_APPROVAL_WORKFLOW: UserRole[] = [
  'main_manager',
  'central_kitchen_manager',
  'inventory_manager'
];

export const INVENTORY_REQUEST_WORKFLOW: UserRole[] = [
  'inventory_manager'
];

export const SUPPLY_REQUEST_WORKFLOW: UserRole[] = [
  'supplier_manager',
  'inventory_manager'
];

export const DIRECT_INVENTORY_WORKFLOW: UserRole[] = [
  'inventory_manager',
  'main_manager'
];

export const LOGISTICS_REQUEST_WORKFLOW: UserRole[] = [
  'logistics_manager',
  'inventory_manager'
];