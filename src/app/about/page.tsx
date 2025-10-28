'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Star, Users, TrendingUp, Smartphone, ArrowRight, Zap, Shield, Globe, Award, Target, Heart, Sparkles, Lock, BarChart, Globe2, Rocket, Briefcase, Circle as CircleIcon, Phone, Mail, MapPin } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import CountdownTimer from '@/components/CountdownTimer';
import FloatingMenu from '@/components/FloatingMenu';

export default function AboutPage() {
  const router = useRouter();
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [launchDate, setLaunchDate] = useState<string>('2025-12-31T00:00:00');
  const [stats, setStats] = useState({
    usersWaiting: 0,
    waitingAds: 0,
    satisfaction: 96
  });
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Add cache busting to force fresh data
        const response = await fetch(`/api/gallery?t=${Date.now()}`, {
          cache: 'no-store'
        });
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

  useEffect(() => {
    const fetchLaunchDate = async () => {
      try {
        const response = await fetch('/api/settings/launch-date');
        if (response.ok) {
          const data = await response.json();
          setLaunchDate(data.launchDate);
        }
      } catch (error) {
        console.error('Error loading launch date:', error);
      }
    };
    fetchLaunchDate();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/business/register');
        if (response.ok) {
          const data = await response.json();
          const userCount = data.registrations && data.registrations.length ? data.registrations.length : 0;
          setStats({
            usersWaiting: userCount,
            waitingAds: userCount * 20,
            satisfaction: 96
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/settings/contact');
        if (response.ok) {
          const data = await response.json();
          setContactInfo(data.contactInfo || { phone: '', email: '', address: '' });
        }
      } catch (error) {
        console.error('Error loading contact info:', error);
      }
    };
    fetchContactInfo();
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

  const statsItems = [
    { number: "10x", label: "Growth Potential", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "50%", label: "Discount Available", icon: <Star className="h-6 w-6" /> },
    { number: "6 Months", label: "Free Subscription", icon: <CheckCircle className="h-6 w-6" /> }
  ];

  return (
    <>
      <PageTransition>
      <div className="min-h-screen bg-white overflow-x-hidden md:overflow-x-visible">
      {/* App Screenshots Carousel */}
      {carouselImages.length > 0 && (
        <section className="py-24 hidden md:block">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Horizontal Sliding Carousel */}
            <div className="relative overflow-hidden">
              {/* All images on one line with center image larger */}
              <div className="overflow-hidden px-4">
                <div className="flex gap-4 justify-center items-end">
                  {carouselImages.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`flex-shrink-0 transition-all duration-500 ${
                        index === currentSlide 
                          ? 'opacity-100' 
                          : 'opacity-70 hover:opacity-90'
                      }`}
                      style={{ flexShrink: 0 }}
                    >
                      <div className={`rounded-3xl overflow-hidden transition-all duration-1000 ${
                        index === currentSlide 
                          ? 'w-72 h-[450px] md:w-80 md:h-[550px]' 
                          : 'w-24 h-40'
                      }`}>
                        <img 
                          src={imageUrl} 
                          alt={`App screenshot ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
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

      {/* About Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#374957' }}>
              About Oysloe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Empowering businesses to connect, grow, and succeed in the digital marketplace
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-20">
            <div>
              <h3 className="text-3xl font-bold mb-6" style={{ color: '#374957' }}>
                Revolutionizing Business Growth
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Oysloe is more than just a platform – it's a comprehensive ecosystem designed to help businesses 
                thrive in today's competitive market. We understand the challenges entrepreneurs face, and we've 
                built solutions that make success accessible to everyone.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                From small startups to established enterprises, our platform provides the tools, visibility, 
                and support needed to reach new customers and expand your market presence.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors bg-white border-2 border-gray-200 hover:border-[#374957] hover:-translate-y-0.5 hover:shadow-md">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#374957' }}>
                    <Smartphone className="w-6 h-6" style={{ color: 'white' }} />
                  </div>
                  <span className="text-gray-700 font-medium">User-friendly interface designed for all skill levels</span>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors bg-white border-2 border-gray-200 hover:border-[#374957] hover:-translate-y-0.5 hover:shadow-md">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#374957' }}>
                    <BarChart className="w-6 h-6" style={{ color: 'white' }} />
                  </div>
                  <span className="text-gray-700 font-medium">Advanced analytics to track your success</span>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors bg-white border-2 border-gray-200 hover:border-[#374957] hover:-translate-y-0.5 hover:shadow-md">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#374957' }}>
                    <Globe className="w-6 h-6" style={{ color: 'white' }} />
                  </div>
                  <span className="text-gray-700 font-medium">24/7 customer support when you need it</span>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors bg-white border-2 border-gray-200 hover:border-[#374957] hover:-translate-y-0.5 hover:shadow-md">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#374957' }}>
                    <Rocket className="w-6 h-6" style={{ color: 'white' }} />
                  </div>
                  <span className="text-gray-700 font-medium">Scalable solutions that grow with your business</span>
                </div>
              </div>
            </div>
          </div>

          {/* Launch Countdown */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4" style={{ color: '#374957' }}>
              Launching Soon
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Countdown to our official launch
            </p>
            <CountdownTimer targetDate={launchDate} />
          </div>

          {/* Mission Statement */}
          <div className="text-center bg-gray-50 rounded-3xl p-12 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <Target className="w-full h-full" style={{ color: '#374957' }} />
            </div>
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#374957' }}>
                <Target className="w-10 h-10" style={{ color: 'white' }} />
              </div>
              <h3 className="text-3xl font-bold mb-6" style={{ color: '#374957' }}>
                Our Mission
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                To democratize business success by providing accessible, powerful tools that enable every entrepreneur 
                and business owner to reach their full potential, regardless of their background or resources.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-[#374957] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all" style={{ backgroundColor: '#374957', color: 'white', border: '2px solid #374957' }}>
                <Users className="w-8 h-8" style={{ color: 'white' }} />
              </div>
              <h4 className="text-xl font-bold mb-3" style={{ color: '#374957' }}>Community First</h4>
              <p className="text-gray-600">
                We believe in the power of community and collaboration to drive innovation and success.
              </p>
            </div>
            
            <div className="text-center group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-[#374957] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all" style={{ backgroundColor: '#374957', color: 'white', border: '2px solid #374957' }}>
                <Zap className="w-8 h-8" style={{ color: 'white' }} />
              </div>
              <h4 className="text-xl font-bold mb-3" style={{ color: '#374957' }}>Innovation</h4>
              <p className="text-gray-600">
                Constantly evolving our platform with cutting-edge technology and user-centered design.
              </p>
            </div>
            
            <div className="text-center group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-[#374957] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all" style={{ backgroundColor: '#374957', color: 'white', border: '2px solid #374957' }}>
                <Shield className="w-8 h-8" style={{ color: 'white' }} />
              </div>
              <h4 className="text-xl font-bold mb-3" style={{ color: '#374957' }}>Trust & Security</h4>
              <p className="text-gray-600">
                Your data and business information are protected with enterprise-grade security measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#374957] to-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Users Waiting */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <Users className="w-10 h-10" style={{ color: '#374957' }} />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stats.usersWaiting}</div>
              <div className="text-lg text-gray-200">Users Waiting</div>
            </div>

            {/* Waiting Ads */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <TrendingUp className="w-10 h-10" style={{ color: '#374957' }} />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stats.waitingAds}</div>
              <div className="text-lg text-gray-200">Waiting Ads</div>
            </div>

            {/* Satisfaction */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <Star className="w-10 h-10" style={{ color: '#374957' }} />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stats.satisfaction}%</div>
              <div className="text-lg text-gray-200">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#374957' }}>Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3F4F6' }}>
                <Phone className="h-8 w-8" style={{ color: '#374957' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#374957' }}>Phone</h3>
              {contactInfo.phone ? (
                <a href={`tel:${contactInfo.phone}`} className="text-sm hover:underline" style={{ color: '#374957' }}>
                  {contactInfo.phone}
                </a>
              ) : (
                <p className="text-sm text-gray-500">Not set</p>
              )}
            </div>

            {/* Email */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3F4F6' }}>
                <Mail className="h-8 w-8" style={{ color: '#374957' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#374957' }}>Email</h3>
              {contactInfo.email ? (
                <a href={`mailto:${contactInfo.email}`} className="text-sm hover:underline" style={{ color: '#374957' }}>
                  {contactInfo.email}
                </a>
              ) : (
                <p className="text-sm text-gray-500">Not set</p>
              )}
            </div>

            {/* Address */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3F4F6' }}>
                <MapPin className="h-8 w-8" style={{ color: '#374957' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#374957' }}>Address</h3>
              {contactInfo.address ? (
                <p className="text-sm" style={{ color: '#374957' }}>
                  {contactInfo.address}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Not set</p>
              )}
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
      </div>
      </PageTransition>

      <FloatingMenu />
    </>
  );
}