'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
  Clock,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  totalPageViews: number;
  uniqueVisitors: number;
  totalRegistrations: number;
  bounceRate: string;
  avgSessionDuration: string;
  pageViews: {
    landing: number;
    register: number;
    about: number;
    pricing: number;
  };
  recentActivity: Array<{
    page: string;
    timestamp: string;
    userAgent: string;
    referrer: string;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    // Refresh analytics every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data</h3>
        <p className="mt-1 text-sm text-gray-500">Analytics will appear here as users visit your site.</p>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Page Views',
      value: analytics.totalPageViews,
      icon: Eye,
      color: 'bg-blue-500',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      name: 'Unique Visitors',
      value: analytics.uniqueVisitors,
      icon: Users,
      color: 'bg-green-500',
      change: '+8.3%',
      changeType: 'positive'
    },
    {
      name: 'Registrations',
      value: analytics.totalRegistrations,
      icon: FileText,
      color: 'bg-purple-500',
      change: '+25%',
      changeType: 'positive'
    },
    {
      name: 'Bounce Rate',
      value: `${analytics.bounceRate}%`,
      icon: TrendingUp,
      color: 'bg-red-500',
      change: '-2.1%',
      changeType: 'negative'
    },
    {
      name: 'Avg Session Duration',
      value: `${analytics.avgSessionDuration} min`,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+5 min',
      changeType: 'positive'
    },
    {
      name: 'Conversion Rate',
      value: `${analytics.uniqueVisitors > 0 ? ((analytics.totalRegistrations / analytics.uniqueVisitors) * 100).toFixed(2) : 0}%`,
      icon: MousePointerClick,
      color: 'bg-indigo-500',
      change: '+3.2%',
      changeType: 'positive'
    }
  ];

  const pageViewsData = [
    { name: 'Landing Page', views: analytics.pageViews.landing, color: 'bg-blue-500' },
    { name: 'Register Page', views: analytics.pageViews.register, color: 'bg-green-500' },
    { name: 'About Page', views: analytics.pageViews.about, color: 'bg-purple-500' },
    { name: 'Pricing Page', views: analytics.pageViews.pricing, color: 'bg-yellow-500' }
  ];

  const maxViews = Math.max(...Object.values(analytics.pageViews));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500">Track your site performance and user behavior</p>
        </div>
        <button
          onClick={loadAnalytics}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.changeType === 'positive' ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          <span className="ml-1">{stat.change}</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Page Views */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Page Views</h3>
        </div>
        <div className="p-6 space-y-4">
          {pageViewsData.map((page) => (
            <div key={page.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{page.name}</span>
                <span className="text-sm text-gray-500">{page.views} views</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${page.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: maxViews > 0 ? `${(page.views / maxViews) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {analytics.recentActivity.slice(0, 10).map((activity, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.page}</p>
                    <p className="text-xs text-gray-500">{activity.referrer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

