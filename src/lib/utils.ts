// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    main_manager: 'Main Manager',
    branch_manager: 'Branch Manager',
    central_kitchen_manager: 'Central Kitchen Manager',
    inventory_manager: 'Inventory Manager',
    supplier_manager: 'Supplier Manager',
    logistics_manager: 'Logistics Manager'
  };
  return roleNames[role] || role;
}