'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FloatingMenu from '@/components/FloatingMenu';

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
  image?: string;
  published: boolean;
}

export default function MasterclassesPage() {
  const router = useRouter();
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [selectedMasterclass, setSelectedMasterclass] = useState<Masterclass | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchMasterclasses = async () => {
      try {
        const response = await fetch('/api/masterclasses?published=true');
        if (response.ok) {
          const data = await response.json();
          setMasterclasses(data.masterclasses || []);
        }
      } catch (error) {
        console.error('Error loading masterclasses:', error);
      }
    };

    fetchMasterclasses();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleRegister = (masterclass: Masterclass) => {
    setSelectedMasterclass(masterclass);
    setShowRegistrationForm(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`/api/masterclasses/${selectedMasterclass?.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        // Refresh masterclasses to update participant count
        const refreshResponse = await fetch('/api/masterclasses?published=true');
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setMasterclasses(refreshData.masterclasses || []);
        }
      } else {
        setSubmitError(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFull = (masterclass: Masterclass) => {
    return masterclass.maxParticipants && masterclass.currentParticipants >= masterclass.maxParticipants;
  };

  return (
    <>
      <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Masterclasses</h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Join our expert-led masterclasses and advance your skills
              </p>
            </div>
          </div>
        </section>

        {/* Masterclasses Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {masterclasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {masterclasses.map((masterclass) => (
                  <div
                    key={masterclass.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {masterclass.image ? (
                      <img
                        src={masterclass.image}
                        alt={masterclass.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{masterclass.title}</h3>
                      <p className="text-slate-600 mb-4 line-clamp-3">{masterclass.description}</p>
                      
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Instructor: {masterclass.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(masterclass.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{masterclass.time} ({masterclass.duration})</span>
                        </div>
                        {masterclass.maxParticipants && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>
                              {masterclass.currentParticipants} / {masterclass.maxParticipants} participants
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="text-2xl font-bold text-slate-900">${masterclass.price}</span>
                        </div>
                        <button
                          onClick={() => handleRegister(masterclass)}
                          disabled={isFull(masterclass)}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                            isFull(masterclass)
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isFull(masterclass) ? 'Full' : 'Register'}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">No masterclasses available at this time</p>
              </div>
            )}
          </div>
        </section>

        {/* Registration Modal */}
        {showRegistrationForm && selectedMasterclass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Register for {selectedMasterclass.title}</h2>
                <button
                  onClick={() => {
                    setShowRegistrationForm(false);
                    setSelectedMasterclass(null);
                    setSubmitSuccess(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {submitError}
                  </div>
                )}

                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Registration submitted successfully! We'll be in touch soon.
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegistrationForm(false);
                      setSelectedMasterclass(null);
                      setSubmitSuccess(false);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      </PageTransition>

      <FloatingMenu />
    </>
  );
}

