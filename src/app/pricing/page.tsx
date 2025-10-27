'use client';

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';

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

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPricingPlans();
  }, []);

  const loadPricingPlans = async () => {
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="py-16 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#374957' }}>
            We feature the simplest pricing module.
          </h1>
          <p className="text-lg" style={{ color: '#374957' }}>
            Pricing that works for all business types.
          </p>
        </div>

        {/* Pricing Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => (
              <div key={plan.id} className="relative bg-gray-100 rounded-3xl p-8">
                {/* Special Badge */}
                {plan.badge && (
                  <div 
                    className="absolute top-6 right-6 text-white px-4 py-2 rounded-full text-sm font-medium" 
                    style={{ backgroundColor: plan.badgeColor || '#374957' }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-3xl font-bold" style={{ color: '#374957' }}>
                    {plan.name}
                  </h2>
                  <span className="text-xl font-medium" style={{ color: '#374957' }}>
                    {plan.multiplier}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span style={{ color: '#374957' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Pricing */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold" style={{ color: '#374957' }}>
                    {plan.price}
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    {plan.originalPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 mt-2 py-8 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-[#374957]">
              Designed & Owned by{' '}
              <a
                href="https://bricsky.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                Bricsky Softwares
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Menu */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-8">
          {/* Home */}
          <button 
            onClick={() => router.push('/landing')}
            className="flex flex-col items-center justify-center gap-1 group"
          >
            <img src="/home.png" alt="Home" className="w-6 h-6" />
            <span className="text-xs text-gray-700 font-medium">Home</span>
          </button>

          {/* Pricing */}
          <button 
            onClick={() => router.push('/pricing')}
            className="flex flex-col items-center justify-center gap-1 group"
          >
            <img src="/price.png" alt="Pricing" className="w-6 h-6" />
            <span className="text-xs text-gray-700 font-medium">Pricing</span>
          </button>

          {/* Register */}
          <button 
            onClick={() => router.push('/register')}
            className="flex flex-col items-center justify-center gap-1 group"
          >
            <img src="/register.png" alt="Register" className="w-6 h-6" />
            <span className="text-xs text-gray-700 font-medium">Register</span>
          </button>

          {/* About */}
          <button 
            onClick={() => router.push('/about')}
            className="flex flex-col items-center justify-center gap-1 group"
          >
            <img src="/about.png" alt="About" className="w-6 h-6" />
            <span className="text-xs text-gray-700 font-medium">About</span>
          </button>
        </div>
      </div>
    </div>
  );
}
