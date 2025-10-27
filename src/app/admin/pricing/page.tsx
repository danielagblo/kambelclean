'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  multiplier: string;
  features: string[];
  price: string;
  originalPrice: string;
  badge?: string;
  badgeColor?: string;
  order: number;
}

export default function PricingManagementPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<PricingPlan>>({
    name: '',
    multiplier: '',
    features: [''],
    price: '',
    originalPrice: '',
    badge: '',
    badgeColor: '#374957'
  });

  useEffect(() => {
    loadPricingPlans();
  }, []);

  const loadPricingPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pricing');
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans.sort((a: PricingPlan, b: PricingPlan) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error loading pricing plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan({ ...plan });
    setIsAddingNew(false);
  };

  const handleSaveEdit = async () => {
    if (!editingPlan) return;

    try {
      const response = await fetch(`/api/pricing/${editingPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPlan),
      });

      if (response.ok) {
        await loadPricingPlans();
        setEditingPlan(null);
        alert('Pricing plan updated successfully!');
      } else {
        alert('Failed to update pricing plan');
      }
    } catch (error) {
      console.error('Error updating pricing plan:', error);
      alert('Error updating pricing plan');
    }
  };

  const handleAddNew = async () => {
    if (!newPlan.name || !newPlan.multiplier || !newPlan.price || !newPlan.originalPrice) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPlan,
          features: newPlan.features?.filter(f => f.trim() !== '') || []
        }),
      });

      if (response.ok) {
        await loadPricingPlans();
        setIsAddingNew(false);
        setNewPlan({
          name: '',
          multiplier: '',
          features: [''],
          price: '',
          originalPrice: '',
          badge: '',
          badgeColor: '#374957'
        });
        alert('Pricing plan created successfully!');
      } else {
        alert('Failed to create pricing plan');
      }
    } catch (error) {
      console.error('Error creating pricing plan:', error);
      alert('Error creating pricing plan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) return;

    try {
      const response = await fetch(`/api/pricing/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadPricingPlans();
        alert('Pricing plan deleted successfully!');
      } else {
        alert('Failed to delete pricing plan');
      }
    } catch (error) {
      console.error('Error deleting pricing plan:', error);
      alert('Error deleting pricing plan');
    }
  };

  const movePlan = async (plan: PricingPlan, direction: 'up' | 'down') => {
    const currentIndex = plans.findIndex(p => p.id === plan.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= plans.length) return;

    const newPlans = [...plans];
    [newPlans[currentIndex], newPlans[newIndex]] = [newPlans[newIndex], newPlans[currentIndex]];

    // Update order numbers
    newPlans.forEach((p, index) => {
      p.order = index + 1;
    });

    setPlans(newPlans);

    // Update each plan's order
    for (const p of newPlans) {
      await fetch(`/api/pricing/${p.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: p.order }),
      });
    }
  };

  const addFeature = (plan: PricingPlan | null) => {
    if (plan) {
      setEditingPlan({
        ...plan,
        features: [...plan.features, '']
      });
    } else {
      setNewPlan({
        ...newPlan,
        features: [...(newPlan.features || []), '']
      });
    }
  };

  const removeFeature = (plan: PricingPlan | null, index: number) => {
    if (plan) {
      setEditingPlan({
        ...plan,
        features: plan.features.filter((_, i) => i !== index)
      });
    } else {
      setNewPlan({
        ...newPlan,
        features: newPlan.features?.filter((_, i) => i !== index) || []
      });
    }
  };

  const updateFeature = (plan: PricingPlan | null, index: number, value: string) => {
    if (plan) {
      const newFeatures = [...plan.features];
      newFeatures[index] = value;
      setEditingPlan({
        ...plan,
        features: newFeatures
      });
    } else {
      const newFeatures = [...(newPlan.features || [])];
      newFeatures[index] = value;
      setNewPlan({
        ...newPlan,
        features: newFeatures
      });
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
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <DollarSign className="h-6 w-6 mr-2 text-indigo-600" />
              Pricing Plans Management
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage pricing plans displayed on the pricing page
            </p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Plan
          </button>
        </div>

        {/* Plans List */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pricing plans</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first pricing plan to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan, index) => (
              <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => movePlan(plan, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => movePlan(plan, 'down')}
                        disabled={index === plans.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                      <p className="text-sm text-gray-500">
                        {plan.multiplier} • {plan.price} {plan.originalPrice !== plan.price && `(was ${plan.originalPrice})`}
                      </p>
                      {plan.badge && (
                        <span 
                          className="inline-block px-2 py-1 text-xs font-medium text-white rounded-full mt-1"
                          style={{ backgroundColor: plan.badgeColor || '#374957' }}
                        >
                          {plan.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-2 text-blue-400 hover:text-blue-600"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="p-2 text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Features:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Pricing Plan</h3>
              <button
                onClick={() => setEditingPlan(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Multiplier</label>
                  <input
                    type="text"
                    value={editingPlan.multiplier}
                    onChange={(e) => setEditingPlan({ ...editingPlan, multiplier: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="text"
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Original Price</label>
                  <input
                    type="text"
                    value={editingPlan.originalPrice}
                    onChange={(e) => setEditingPlan({ ...editingPlan, originalPrice: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Badge Text (optional)</label>
                  <input
                    type="text"
                    value={editingPlan.badge || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Badge Color</label>
                  <input
                    type="color"
                    value={editingPlan.badgeColor || '#374957'}
                    onChange={(e) => setEditingPlan({ ...editingPlan, badgeColor: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    onClick={() => addFeature(editingPlan)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {editingPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(editingPlan, index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeFeature(editingPlan, index)}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2 inline" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Pricing Plan</h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                  <input
                    type="text"
                    value={newPlan.name || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Multiplier</label>
                  <input
                    type="text"
                    value={newPlan.multiplier || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, multiplier: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="text"
                    value={newPlan.price || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Original Price</label>
                  <input
                    type="text"
                    value={newPlan.originalPrice || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, originalPrice: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Badge Text (optional)</label>
                  <input
                    type="text"
                    value={newPlan.badge || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, badge: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Badge Color</label>
                  <input
                    type="color"
                    value={newPlan.badgeColor || '#374957'}
                    onChange={(e) => setNewPlan({ ...newPlan, badgeColor: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    onClick={() => addFeature(null)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {(newPlan.features || ['']).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(null, index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeFeature(null, index)}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2 inline" />
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
