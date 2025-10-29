'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';

interface Publication {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  price?: number;
  purchaseLink?: string;
  featured: boolean;
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    price: '',
    purchaseLink: '',
    featured: false
  });

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/publications');
      if (response.ok) {
        const data = await response.json();
        setPublications(data.publications || []);
      }
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPublication ? `/api/publications/${editingPublication.id}` : '/api/publications';
      const method = editingPublication ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : undefined
        }),
      });

      if (response.ok) {
        fetchPublications();
        setShowModal(false);
        setEditingPublication(null);
        setFormData({ title: '', author: '', description: '', category: '', price: '', purchaseLink: '', featured: false });
      }
    } catch (error) {
      console.error('Error saving publication:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    
    try {
      const response = await fetch(`/api/publications/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPublications();
      }
    } catch (error) {
      console.error('Error deleting publication:', error);
    }
  };

  const handleEdit = (publication: Publication) => {
    setEditingPublication(publication);
    setFormData({
      title: publication.title,
      author: publication.author,
      description: publication.description,
      category: publication.category,
      price: publication.price?.toString() || '',
      purchaseLink: publication.purchaseLink || '',
      featured: publication.featured
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Publications</h2>
        <button
          onClick={() => {
            setEditingPublication(null);
            setFormData({ title: '', author: '', description: '', category: '', price: '', purchaseLink: '', featured: false });
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Publication
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((pub) => (
                <tr key={pub.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pub.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pub.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pub.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pub.price ? `$${pub.price}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(pub)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(pub.id)} className="text-red-600 hover:text-red-900">
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
            <h3 className="text-xl font-bold mb-4">{editingPublication ? 'Edit Publication' : 'Add Publication'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                <input type="text" required value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Link</label>
                  <input type="url" value={formData.purchaseLink} onChange={(e) => setFormData({ ...formData, purchaseLink: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="mr-2" />
                  Featured
                </label>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingPublication(null); }} className="px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

