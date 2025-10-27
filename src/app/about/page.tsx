'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Star, Users, TrendingUp, Smartphone, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setCarouselImages(data.images.map((img: any) => img.url));
        }
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };
    fetchImages();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (carouselImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(interval);
    }
  }, [carouselImages.length]);

  const features = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile-First Design",
      description: "Optimized for mobile devices with intuitive navigation and smooth user experience.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Boost Your Sales",
      description: "Increase your business visibility and sales with our powerful advertising platform.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Wide Reach",
      description: "Connect with customers across multiple categories and expand your market reach.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-6 w-6" />,
      text: "Lightning-fast performance"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      text: "Secure and reliable platform"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      text: "Global reach and accessibility"
    },
    {
      icon: <Star className="h-6 w-6" />,
      text: "Premium customer support"
    }
  ];

  const stats = [
    { number: "10x", label: "Growth Potential", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "50%", label: "Discount Available", icon: <Star className="h-6 w-6" /> },
    { number: "6 Months", label: "Free Subscription", icon: <CheckCircle className="h-6 w-6" /> },
    { number: "2025", label: "Launch Date", icon: <Zap className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* App Screenshots Carousel */}
      {carouselImages.length > 0 && (
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Horizontal Sliding Carousel */}
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselImages.map((imageUrl, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4 transition-opacity duration-1000">
                    <div className="flex justify-center items-center space-x-4">
                        {/* Left side images */}
                        {index > 0 && (
                          <div className="hidden md:block">
                            <div className="w-28 h-48 rounded-2xl overflow-hidden opacity-70 transition-all duration-1000 ease-in-out">
                              <img 
                                src={carouselImages[index - 1]} 
                                alt={`App screenshot ${index}`}
                                className="w-full h-full object-contain transition-all duration-1000 ease-in-out"
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Center main image */}
                        <div className="relative group">
                          <div className="w-72 h-[450px] md:w-80 md:h-[550px] rounded-3xl overflow-hidden transition-all duration-1000 transform group-hover:-translate-y-2">
                            <img 
                              src={imageUrl} 
                              alt={`App screenshot ${index + 1}`}
                              className="w-full h-full object-contain transition-all duration-1000 ease-in-out"
                            />
                          </div>
                        </div>
                        
                        {/* Right side images */}
                        {index < carouselImages.length - 1 && (
                          <div className="hidden md:block">
                            <div className="w-28 h-48 rounded-2xl overflow-hidden opacity-70 transition-all duration-1000 ease-in-out">
                              <img 
                                src={carouselImages[index + 1]} 
                                alt={`App screenshot ${index + 2}`}
                                className="w-full h-full object-contain transition-all duration-1000 ease-in-out"
                              />
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                disabled={currentSlide === 0}
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentSlide(Math.min(carouselImages.length - 1, currentSlide + 1))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                disabled={currentSlide === carouselImages.length - 1}
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide 
                      ? 'bg-indigo-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#374957' }}>
              Why Choose Oysloe?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the features that make Oysloe the perfect platform for your business growth and success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#374957' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-16 h-16 bg-gray-200 rounded-full opacity-20"></div>
          <div className="absolute top-40 right-32 w-12 h-12 bg-gray-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-32 left-40 w-8 h-8 bg-gray-200 rounded-full opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#374957' }}>
              Impressive Results
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of businesses already experiencing incredible growth with Oysloe
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-2xl mb-4 group-hover:bg-green-200 transition-colors duration-300">
                    <div className="text-green-600">{stat.icon}</div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold" style={{ color: '#374957' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-green-500 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-16 w-24 h-24 bg-white rounded-full opacity-10"></div>
          <div className="absolute top-32 right-24 w-20 h-20 bg-white rounded-full opacity-10"></div>
          <div className="absolute bottom-24 left-32 w-16 h-16 bg-white rounded-full opacity-10"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-green-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of businesses already growing with Oysloe. 
              Get started today and see the difference in just 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => router.push('/register')}
                className="bg-white text-green-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Start Free Trial
                <ArrowRight className="h-6 w-6" />
              </button>
              <button
                onClick={() => router.push('/pricing')}
                className="border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-green-600 transition-all duration-300 backdrop-blur-sm"
              >
                View All Plans
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-green-100">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">No credit card required • Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

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
          <button className="flex flex-col items-center justify-center gap-1 group">
            <img src="/about.png" alt="About" className="w-6 h-6" />
            <span className="text-xs text-gray-700 font-medium">About</span>
          </button>
        </div>
      </div>
    </div>
  );
}