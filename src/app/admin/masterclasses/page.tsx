'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, GraduationCap, Users, Calendar } from 'lucide-react';

interface Masterclass {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  maxParticipants?: number;
  currentParticipants: number;
  published: boolean;
  registrations: any[];
}

export default function MasterclassesPage() {
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMasterclass, setEditingMasterclass] = useState<Masterclass | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    date: '',
    time: '',
    duration: '',
    price: '',
    maxParticipants: '',
    published: false
  });

  useEffect(() => {
    fetchMasterclasses();
  }, []);

  const fetchMasterclasses = async () => {
    try {
      const response = await fetch('/api/masterclasses');
      if (response.ok) {
        const data = await response.json();
        setMasterclasses(data.masterclasses || []);
      }
    } catch (error) {
      console.error('Error loading masterclasses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMasterclass ? `/api/masterclasses/${editingMasterclass.id}` : '/api/masterclasses';
      const method = editingMasterclass ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined
        }),
      });

      if (response.ok) {
        fetchMasterclasses();
        setShowModal(false);
        setEditingMasterclass(null);
        setFormData({ title: '', description: '', instructor: '', date: '', time: '', duration: '', price: '', maxParticipants: '', published: false });
      }
    } catch (error) {
      console.error('Error saving masterclass:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this masterclass?')) return;
    
    try {
      const response = await fetch(`/api/masterclasses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchMasterclasses();
      }
    } catch (error) {
      console.error('Error deleting masterclass:', error);
    }
  };

  const handleEdit = (masterclass: Masterclass) => {
    setEditingMasterclass(masterclass);
    setFormData({
      title: masterclass.title,
      description: masterclass.description,
      instructor: masterclass.instructor,
      date: masterclass.date.split('T')[0],
      time: masterclass.time,
      duration: masterclass.duration,
      price: masterclass.price.toString(),
      maxParticipants: masterclass.maxParticipants?.toString() || '',
      published: masterclass.published
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Masterclasses</h2>
        <button
          onClick={() => {
            setEditingMasterclass(null);
            setFormData({ title: '', description: '', instructor: '', date: '', time: '', duration: '', price: '', maxParticipants: '', published: false });
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Masterclass
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {masterclasses.map((mc) => (
                <tr key={mc.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{mc.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mc.instructor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(mc.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mc.currentParticipants}{mc.maxParticipants ? ` / ${mc.maxParticipants}` : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${mc.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mc.published ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(mc)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(mc.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingMasterclass ? 'Edit Masterclass' : 'Add Masterclass'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructor *</label>
                  <input type="text" required value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input type="time" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <input type="text" required value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 2 hours" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                  <input type="number" value={formData.maxParticipants} onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="mr-2" />
                  Published
                </label>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingMasterclass(null); }} className="px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

