'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit, UserCircle, School, Trophy } from 'lucide-react';

interface CEOInfo {
  name: string;
  title: string;
  rating: number;
  leadership: string;
  vision: string;
  highlights: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

interface AboutConfig {
  mission: {
    title: string;
    description: string;
  };
  ceo: CEOInfo;
  education: Array<{
    type: string;
    icon: string;
    description: string;
    tags?: string[];
  }>;
  achievements: Array<{
    title: string;
    year: string;
    description: string;
    icon: string;
  }>;
  timeline: Array<{
    year: string;
    title: string;
    description: string;
    icon: string;
  }>;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  stats: Array<{
    number: string;
    label: string;
    icon: string;
  }>;
}

export default function AboutConfigPage() {
  const [config, setConfig] = useState<AboutConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('mission');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/about');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        alert('Configuration saved successfully!');
      } else {
        alert('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateMission = (field: string, value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      mission: { ...config.mission, [field]: value }
    });
  };

  const updateCEO = (field: string, value: any) => {
    if (!config) return;
    setConfig({
      ...config,
      ceo: { ...config.ceo, [field]: value }
    });
  };

  const addEducation = () => {
    if (!config) return;
    setConfig({
      ...config,
      education: [...config.education, { type: '', icon: 'School', description: '', tags: [] }]
    });
  };

  const updateEducation = (index: number, field: string, value: any) => {
    if (!config) return;
    const updated = [...config.education];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, education: updated });
  };

  const removeEducation = (index: number) => {
    if (!config) return;
    setConfig({
      ...config,
      education: config.education.filter((_, i) => i !== index)
    });
  };

  const addAchievement = () => {
    if (!config) return;
    setConfig({
      ...config,
      achievements: [...config.achievements, { title: '', year: '', description: '', icon: 'Trophy' }]
    });
  };

  const updateAchievement = (index: number, field: string, value: string) => {
    if (!config) return;
    const updated = [...config.achievements];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, achievements: updated });
  };

  const removeAchievement = (index: number) => {
    if (!config) return;
    setConfig({
      ...config,
      achievements: config.achievements.filter((_, i) => i !== index)
    });
  };

  const addTimelineEvent = () => {
    if (!config) return;
    setConfig({
      ...config,
      timeline: [...config.timeline, { year: '', title: '', description: '', icon: 'Briefcase' }]
    });
  };

  const updateTimelineEvent = (index: number, field: string, value: string) => {
    if (!config) return;
    const updated = [...config.timeline];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, timeline: updated });
  };

  const removeTimelineEvent = (index: number) => {
    if (!config) return;
    setConfig({
      ...config,
      timeline: config.timeline.filter((_, i) => i !== index)
    });
  };

  const updateValue = (index: number, field: string, value: string) => {
    if (!config) return;
    const updated = [...config.values];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, values: updated });
  };

  const updateStat = (index: number, field: string, value: string) => {
    if (!config) return;
    const updated = [...config.stats];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, stats: updated });
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!config) {
    return <div className="text-center py-12">Error loading configuration</div>;
  }

  const tabs = [
    { id: 'mission', label: 'Mission' },
    { id: 'ceo', label: 'CEO' },
    { id: 'education', label: 'Education' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'values', label: 'Values' },
    { id: 'stats', label: 'Stats' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">About Page Configuration</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mission Tab */}
      {activeTab === 'mission' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mission Title</label>
            <input
              type="text"
              value={config.mission.title}
              onChange={(e) => updateMission('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mission Description</label>
            <textarea
              value={config.mission.description}
              onChange={(e) => updateMission('description', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* CEO Tab */}
      {activeTab === 'ceo' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CEO Name</label>
              <input
                type="text"
                value={config.ceo.name}
                onChange={(e) => updateCEO('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CEO Title</label>
              <input
                type="text"
                value={config.ceo.title}
                onChange={(e) => updateCEO('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={config.ceo.rating}
              onChange={(e) => updateCEO('rating', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Leadership Excellence</label>
            <textarea
              value={config.ceo.leadership}
              onChange={(e) => updateCEO('leadership', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vision & Expertise</label>
            <textarea
              value={config.ceo.vision}
              onChange={(e) => updateCEO('vision', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CEO Highlights</label>
            {config.ceo.highlights.map((highlight, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Icon Name</label>
                    <input
                      type="text"
                      value={highlight.icon}
                      onChange={(e) => {
                        const updated = [...config.ceo.highlights];
                        updated[index] = { ...updated[index], icon: e.target.value };
                        updateCEO('highlights', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={highlight.title}
                      onChange={(e) => {
                        const updated = [...config.ceo.highlights];
                        updated[index] = { ...updated[index], title: e.target.value };
                        updateCEO('highlights', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={highlight.description}
                    onChange={(e) => {
                      const updated = [...config.ceo.highlights];
                      updated[index] = { ...updated[index], description: e.target.value };
                      updateCEO('highlights', updated);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && (
        <div className="space-y-4">
          <button
            onClick={addEducation}
            className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Education Item
          </button>
          {config.education.map((edu, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-gray-900">Education Item {index + 1}</h3>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={edu.type}
                    onChange={(e) => updateEducation(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={edu.icon}
                    onChange={(e) => updateEducation(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={edu.description}
                  onChange={(e) => updateEducation(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              {edu.tags && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={edu.tags.join(', ')}
                    onChange={(e) => updateEducation(index, 'tags', e.target.value.split(',').map(t => t.trim()))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <button
            onClick={addAchievement}
            className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Achievement
          </button>
          {config.achievements.map((achievement, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-gray-900">Achievement {index + 1}</h3>
                <button
                  onClick={() => removeAchievement(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={achievement.title}
                    onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={achievement.year}
                    onChange={(e) => updateAchievement(index, 'year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={achievement.icon}
                    onChange={(e) => updateAchievement(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={achievement.description}
                  onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <button
            onClick={addTimelineEvent}
            className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Timeline Event
          </button>
          {config.timeline.map((event, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-gray-900">Event {index + 1}</h3>
                <button
                  onClick={() => removeTimelineEvent(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={event.year}
                    onChange={(e) => updateTimelineEvent(index, 'year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => updateTimelineEvent(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={event.icon}
                    onChange={(e) => updateTimelineEvent(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={event.description}
                  onChange={(e) => updateTimelineEvent(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Values Tab */}
      {activeTab === 'values' && (
        <div className="space-y-4">
          {config.values.map((value, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">Value {index + 1}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={value.title}
                    onChange={(e) => updateValue(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={value.icon}
                    onChange={(e) => updateValue(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={value.description}
                  onChange={(e) => updateValue(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          {config.stats.map((stat, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">Stat {index + 1}</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => updateStat(index, 'number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={stat.icon}
                    onChange={(e) => updateStat(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

