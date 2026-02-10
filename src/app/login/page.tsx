// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Coffee, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
    setIsLoading(false);
  };

  const demoAccounts = [
    { role: 'Main Manager', username: 'main.manager', password: 'main123' },
    { role: 'Branch Manager (Downtown)', username: 'branch.downtown', password: 'branch123' },
    { role: 'Branch Manager (Uptown)', username: 'branch.uptown', password: 'branch123' },
    { role: 'Kitchen Manager', username: 'kitchen.manager', password: 'kitchen123' },
    { role: 'Inventory Manager', username: 'inventory.manager', password: 'inventory123' },
    { role: 'Supplier Manager', username: 'supplier.manager', password: 'supplier123' },
    { role: 'Logistics Manager', username: 'logistics.manager', password: 'logistics123' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Login Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-amber-600 p-3 rounded-full">
                  <Coffee className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-amber-900">
                Rahul Cafe
              </CardTitle>
              <p className="text-amber-700 mt-2">Management System</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-600" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-600" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Demo Accounts */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Welcome to Rahul Cafe
            </h2>
            <p className="text-amber-700 text-lg">
              Multi-branch management system with role-based access control
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Demo Accounts</CardTitle>
              <p className="text-amber-700 text-sm">Use these credentials to explore different roles</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {demoAccounts.map((account, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors cursor-pointer"
                    onClick={() => {
                      setUsername(account.username);
                      setPassword(account.password);
                    }}
                  >
                    <div>
                      <div className="font-medium text-amber-900">{account.role}</div>
                      <div className="text-sm text-amber-700">
                        {account.username} / {account.password}
                      </div>
                    </div>
                    <div className="text-amber-600 text-sm">Click to use</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}