'use client';

import { useState } from 'react';
import { Mail, CheckCircle, X } from 'lucide-react';

interface NewsletterSubscriptionProps {
  className?: string;
}

export default function NewsletterSubscription({ className = '' }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setEmail('');
        setName('');
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(data.error || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span>Thank you for subscribing to our newsletter!</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Mail className="h-6 w-6" />
        <h3 className="text-2xl font-bold">Subscribe to Our Newsletter</h3>
      </div>
      <p className="text-blue-100 mb-6">
        Stay updated with our latest insights, publications, and masterclasses
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        {submitError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-3 text-sm text-red-100">
            {submitError}
          </div>
        )}
      </form>
    </div>
  );
}

