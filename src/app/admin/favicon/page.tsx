'use client';

import { useState, useEffect } from 'react';
import { Upload, Trash2, Image, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface FaviconSettings {
  current: string;
  custom: string | null;
}

export default function FaviconPage() {
  const [faviconSettings, setFaviconSettings] = useState<FaviconSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadFaviconSettings();
  }, []);

  const loadFaviconSettings = async () => {
    try {
      const response = await fetch('/api/favicon');
      if (response.ok) {
        const data = await response.json();
        setFaviconSettings(data.favicon);
      }
    } catch (error) {
      console.error('Error loading favicon settings:', error);
      setMessage({ type: 'error', text: 'Failed to load favicon settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('favicon', file);

      const response = await fetch('/api/favicon', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: 'Favicon uploaded successfully!' });
        await loadFaviconSettings();
        
        // Force page reload to update favicon
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to upload favicon' });
      }
    } catch (error) {
      console.error('Error uploading favicon:', error);
      setMessage({ type: 'error', text: 'Failed to upload favicon' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFavicon = async () => {
    if (!confirm('Are you sure you want to reset the favicon to default?')) return;

    setDeleting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/favicon', {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Favicon reset to default!' });
        await loadFaviconSettings();
        
        // Force page reload to update favicon
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to delete favicon' });
      }
    } catch (error) {
      console.error('Error deleting favicon:', error);
      setMessage({ type: 'error', text: 'Failed to delete favicon' });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Image className="h-6 w-6 mr-2 text-indigo-600" />
              Favicon Management
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Upload and manage your site's favicon
            </p>
          </div>
          <button
            onClick={loadFaviconSettings}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Current Favicon Display */}
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Current Favicon</h4>
        
        {faviconSettings && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src={faviconSettings.current} 
                alt="Current Favicon" 
                className="w-8 h-8 rounded"
                onError={(e) => {
                  e.currentTarget.src = '/favicon.svg';
                }}
              />
              <span className="text-sm text-gray-600">
                {faviconSettings.custom ? 'Custom Favicon' : 'Default Favicon'}
              </span>
            </div>
            
            {faviconSettings.custom && (
              <button
                onClick={handleDeleteFavicon}
                disabled={deleting}
                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {deleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Reset to Default
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Upload New Favicon</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Favicon File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="favicon-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="favicon-upload"
                      name="favicon-upload"
                      type="file"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  Upload any file
                </p>
              </div>
            </div>
          </div>

          {uploading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-2"></div>
              <span className="text-sm text-gray-600">Uploading favicon...</span>
            </div>
          )}
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            )}
            <span className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
