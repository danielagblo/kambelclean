'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Tag, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Edit
} from 'lucide-react';

interface BusinessRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  category: string;
  location: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function BusinessRegistrationsPage() {
  const [registrations, setRegistrations] = useState<BusinessRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<BusinessRegistration | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<BusinessRegistration | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const response = await fetch('/api/business/register');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations);
      }
    } catch (error) {
      console.error('Error loading registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/business/register/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await loadRegistrations();
        alert(`Registration ${status} successfully!`);
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...selectedRegistration! });
  };

  const handleSaveEdit = async () => {
    if (!editedData) return;

    try {
      const response = await fetch(`/api/business/register/${editedData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedData.name,
          email: editedData.email,
          phone: editedData.phone,
          businessName: editedData.businessName,
          category: editedData.category,
          location: editedData.location,
        }),
      });

      if (response.ok) {
        await loadRegistrations();
        setIsEditing(false);
        setEditedData(null);
        alert('Registration updated successfully!');
      } else {
        alert('Failed to update registration');
      }
    } catch (error) {
      console.error('Error updating registration:', error);
      alert('Error updating registration');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    try {
      const response = await fetch(`/api/business/register/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadRegistrations();
        alert('Registration deleted successfully!');
      } else {
        alert('Failed to delete registration');
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
      alert('Error deleting registration');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    filter === 'all' || reg.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="h-6 w-6 mr-2 text-indigo-600" />
              Business Registrations
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage business registration submissions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">{registrations.length}</div>
              <div className="text-sm text-gray-500">total registrations</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All', count: registrations.length },
            { key: 'pending', label: 'Pending', count: registrations.filter(r => r.status === 'pending').length },
            { key: 'approved', label: 'Approved', count: registrations.filter(r => r.status === 'approved').length },
            { key: 'rejected', label: 'Rejected', count: registrations.filter(r => r.status === 'rejected').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Registrations List */}
      <div className="bg-white shadow rounded-lg">
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' ? 'No business registrations have been submitted yet.' : `No ${filter} registrations found.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRegistrations.map((registration) => (
              <div key={registration.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(registration.status)}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{registration.businessName}</h4>
                      <p className="text-sm text-gray-500">{registration.name} • {registration.email}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {registration.phone}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {registration.location}
                        </span>
                        <span className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          {registration.category}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(registration.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(registration.status)}`}>
                      {registration.status}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRegistration(registration);
                        setIsEditing(true);
                        setEditedData({ ...registration });
                      }}
                      className="p-2 text-blue-400 hover:text-blue-600"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setSelectedRegistration(registration)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {registration.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(registration.id, 'approved')}
                          className="p-2 text-green-600 hover:text-green-800"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(registration.id, 'rejected')}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteRegistration(registration.id)}
                      className="p-2 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registration Detail Modal */}
      {selectedRegistration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedRegistration(null)}
        >
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Registration Details</h3>
              <div className="flex items-center space-x-2">
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedRegistration(null);
                    setIsEditing(false);
                    setEditedData(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  {isEditing && editedData ? (
                    <input
                      type="text"
                      value={editedData.businessName}
                      onChange={(e) => setEditedData({ ...editedData, businessName: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.businessName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                  {isEditing && editedData ? (
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  {isEditing && editedData ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  {isEditing && editedData ? (
                    <input
                      type="text"
                      value={editedData.phone}
                      onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  {isEditing && editedData ? (
                    <select
                      value={editedData.category}
                      onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Industry">Industry</option>
                      <option value="Grocery">Grocery</option>
                      <option value="Games">Games</option>
                      <option value="Cosmetics">Cosmetics</option>
                      <option value="Property">Property</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Services">Services</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.category}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  {isEditing && editedData ? (
                    <input
                      type="text"
                      value={editedData.location}
                      onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.location}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedRegistration.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRegistration.status)}`}>
                    {selectedRegistration.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {selectedRegistration.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          updateStatus(selectedRegistration.id, 'approved');
                          setSelectedRegistration(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          updateStatus(selectedRegistration.id, 'rejected');
                          setSelectedRegistration(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedRegistration(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
