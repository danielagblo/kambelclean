'use client';

import { useState, useEffect } from 'react';
import { Mail, Download, Trash2 } from 'lucide-react';

interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  active: boolean;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter');
      if (response.ok) {
        const data = await response.json();
        // Load all subscribers (including inactive) from data file
        const allResponse = await fetch('/api/newsletter?all=true');
        if (allResponse.ok) {
          const allData = await allResponse.json();
          setSubscribers(allData.subscribers || data.subscribers || []);
        } else {
          setSubscribers(data.subscribers || []);
        }
      }
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (email: string) => {
    if (!confirm('Are you sure you want to unsubscribe this email?')) return;
    
    try {
      const response = await fetch(`/api/newsletter?email=${encodeURIComponent(email)}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchSubscribers();
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  const exportCSV = () => {
    const csv = [
      ['Email', 'Name', 'Subscribed At', 'Active'].join(','),
      ...subscribers.filter(s => s.active).map(s => [
        s.email,
        s.name || '',
        s.subscribedAt,
        s.active ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const activeCount = subscribers.filter(s => s.active).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h2>
          <p className="text-sm text-gray-600 mt-1">{activeCount} active subscribers</p>
        </div>
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="h-5 w-5" />
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subscriber.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subscriber.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      subscriber.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {subscriber.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {subscriber.active && (
                      <button
                        onClick={() => handleUnsubscribe(subscriber.email)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

