'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  CheckCircle, 
  BookOpen,
  Users,
  Briefcase,
  Target,
  Award,
  TrendingUp,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FloatingMenu from '@/components/FloatingMenu';
import NewsletterSubscription from '@/components/NewsletterSubscription';

interface ConsultancyService {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  icon?: string;
  image?: string;
  category: string;
  featured: boolean;
}

export default function LandingPage() {
  const router = useRouter();
  const [services, setServices] = useState<ConsultancyService[]>([]);
  const [featuredServices, setFeaturedServices] = useState<ConsultancyService[]>([]);
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data.services || []);
        }
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };

    const fetchFeaturedServices = async () => {
      try {
        const response = await fetch('/api/services?featured=true');
        if (response.ok) {
          const data = await response.json();
          setFeaturedServices(data.services || []);
        }
      } catch (error) {
        console.error('Error loading featured services:', error);
      }
    };

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

    fetchServices();
    fetchFeaturedServices();
    fetchContactInfo();
  }, []);

  return (
    <>
      <PageTransition>
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Kambel Consult
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Empowering businesses and individuals through expert consulting, strategic insights, and transformative masterclasses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/#services')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Our Services
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => router.push('/masterclasses')}
                className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
              >
                View Masterclasses
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Our Consulting Services
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive solutions tailored to your business needs
            </p>
          </div>

          {featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>
                  <button
                    onClick={() => router.push('/contact')}
                    className="text-blue-600 font-semibold flex items-center gap-2 hover:text-blue-700 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>
                  <button
                    onClick={() => router.push('/contact')}
                    className="text-blue-600 font-semibold flex items-center gap-2 hover:text-blue-700 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Default services */}
              {[
                { title: 'Business Strategy', description: 'Strategic planning and business development consulting to help you achieve your goals' },
                { title: 'Leadership Development', description: 'Executive coaching and leadership training programs for organizational excellence' },
                { title: 'Financial Consulting', description: 'Expert financial advice and planning to optimize your business performance' },
                { title: 'Marketing & Growth', description: 'Digital marketing strategies and growth consulting to expand your reach' },
                { title: 'Operations Optimization', description: 'Streamline processes and improve operational efficiency' },
                { title: 'Organizational Development', description: 'Transform your organization with proven change management strategies' }
              ].map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>
                  <button
                    onClick={() => router.push('/contact')}
                    className="text-blue-600 font-semibold flex items-center gap-2 hover:text-blue-700 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {services.length > 6 && (
            <div className="text-center mt-12">
              <button
                onClick={() => router.push('/services')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all"
              >
                View All Services
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Expert Team</h3>
              <p className="text-slate-600">Experienced consultants with proven track records</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tailored Solutions</h3>
              <p className="text-slate-600">Customized strategies for your unique needs</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Proven Results</h3>
              <p className="text-slate-600">Measurable outcomes and business growth</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Industry Expertise</h3>
              <p className="text-slate-600">Deep knowledge across multiple sectors</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get in touch with us today to discuss how we can help you achieve your goals
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Contact Us Now
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSubscription />
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Phone</h3>
              {contactInfo.phone ? (
                <a href={`tel:${contactInfo.phone}`} className="text-slate-600 hover:text-blue-600">
                  {contactInfo.phone}
                </a>
              ) : (
                <p className="text-slate-500">Not set</p>
              )}
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Email</h3>
              {contactInfo.email ? (
                <a href={`mailto:${contactInfo.email}`} className="text-slate-600 hover:text-blue-600">
                  {contactInfo.email}
                </a>
              ) : (
                <p className="text-slate-500">Not set</p>
              )}
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Address</h3>
              {contactInfo.address ? (
                <p className="text-slate-600">{contactInfo.address}</p>
              ) : (
                <p className="text-slate-500">Not set</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Kambel Consult. All rights reserved.
          </p>
        </div>
      </footer>
      </div>
      </PageTransition>

      <FloatingMenu />
    </>
  );
}
