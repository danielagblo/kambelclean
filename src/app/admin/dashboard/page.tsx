'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  Package, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Smartphone,
  DollarSign
} from 'lucide-react';

interface DashboardData {
  recentOrders: Array<{
    id: string;
    customer: string;
    product: string;
    amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    date: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    joinDate: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [screenshotCount, setScreenshotCount] = useState(0);
  const [businessCount, setBusinessCount] = useState(0);
  const [pricingCount, setPricingCount] = useState(0);

  useEffect(() => {
    // Load screenshot count
    const loadScreenshotCount = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setScreenshotCount(data.images.length);
        }
      } catch (error) {
        console.error('Error loading screenshot count:', error);
      }
    };

    // Load business registration count
    const loadBusinessCount = async () => {
      try {
        const response = await fetch('/api/business/register');
        if (response.ok) {
          const data = await response.json();
          setBusinessCount(data.registrations.length);
        }
      } catch (error) {
        console.error('Error loading business count:', error);
      }
    };

    // Load pricing plans count
    const loadPricingCount = async () => {
      try {
        const response = await fetch('/api/pricing');
        if (response.ok) {
          const data = await response.json();
          setPricingCount(data.plans.length);
        }
      } catch (error) {
        console.error('Error loading pricing count:', error);
      }
    };

    loadScreenshotCount();
    loadBusinessCount();
    loadPricingCount();

    // Simulate API call
    setTimeout(() => {
      setData({
        recentOrders: [
          { id: '1', customer: 'John Doe', product: 'Premium Plan', amount: 99, status: 'completed', date: '2024-01-15' },
          { id: '2', customer: 'Jane Smith', product: 'Basic Plan', amount: 29, status: 'pending', date: '2024-01-14' },
          { id: '3', customer: 'Bob Johnson', product: 'Enterprise Plan', amount: 299, status: 'completed', date: '2024-01-13' },
          { id: '4', customer: 'Alice Brown', product: 'Basic Plan', amount: 29, status: 'cancelled', date: '2024-01-12' },
        ],
        recentUsers: [
          { id: '1', name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-01-14' },
          { id: '3', name: 'Bob Johnson', email: 'bob@example.com', joinDate: '2024-01-13' },
          { id: '4', name: 'Alice Brown', email: 'alice@example.com', joinDate: '2024-01-12' },
        ],
        topProducts: [
          { id: '1', name: 'Premium Plan', sales: 45, revenue: 4455 },
          { id: '2', name: 'Basic Plan', sales: 120, revenue: 3480 },
          { id: '3', name: 'Enterprise Plan', sales: 8, revenue: 2392 },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Users className="h-4 w-4 mr-2" />
            Add User
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Package className="h-4 w-4 mr-2" />
            Add Product
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Reports
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Event
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Screenshot Count Widget */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Smartphone className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">App Screenshots</h3>
                <p className="text-sm text-gray-500">Manage screenshots for the About page carousel</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{screenshotCount}</div>
              <div className="text-sm text-gray-500">screenshots uploaded</div>
            </div>
          </div>
          <div className="mt-4">
            <a 
              href="/admin/gallery" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Manage Screenshots
            </a>
          </div>
        </div>

        {/* Business Registration Widget */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Business Registrations</h3>
                <p className="text-sm text-gray-500">Manage business registration submissions</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{businessCount}</div>
              <div className="text-sm text-gray-500">registrations received</div>
            </div>
          </div>
          <div className="mt-4">
            <a 
              href="/admin/business" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Users className="h-4 w-4 mr-2" />
              View Registrations
            </a>
          </div>
        </div>

        {/* Pricing Plans Widget */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Pricing Plans</h3>
                <p className="text-sm text-gray-500">Manage pricing plans for the pricing page</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">{pricingCount}</div>
              <div className="text-sm text-gray-500">plans configured</div>
            </div>
          </div>
          <div className="mt-4">
            <a 
              href="/admin/pricing" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Manage Pricing
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {data?.recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.product}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">${order.amount}</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {data?.recentUsers.map((user) => (
              <div key={user.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(user.joinDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.topProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.sales}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.revenue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${(product.sales / 120) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.round((product.sales / 120) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
