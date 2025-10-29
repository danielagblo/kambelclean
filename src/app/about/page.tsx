'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Award, 
  Briefcase, 
  Target, 
  Users, 
  TrendingUp,
  BookOpen,
  GraduationCap,
  Calendar,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  UserCircle,
  Star,
  Lightbulb,
  Trophy,
  School,
  Medal
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FloatingMenu from '@/components/FloatingMenu';
import NewsletterSubscription from '@/components/NewsletterSubscription';
import { getIcon } from '@/lib/iconMap';

interface AboutConfig {
  mission: {
    title: string;
    description: string;
  };
  ceo: {
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
  };
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

export default function AboutPage() {
  const router = useRouter();
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: ''
  });
  const [config, setConfig] = useState<AboutConfig | null>(null);
  const [loading, setLoading] = useState(true);

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

    const fetchAboutConfig = async () => {
      try {
        const response = await fetch('/api/about');
        if (response.ok) {
          const data = await response.json();
          setConfig(data.config);
        }
      } catch (error) {
        console.error('Error loading about config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
    fetchAboutConfig();
  }, []);

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#000080] via-[#000060] to-[#000080] text-white py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <img
                  src="/klogo.jpeg"
                  alt="Kambel Consult Logo"
                  className="h-24 md:h-32 w-auto"
                />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-white">About </span>
                <span className="text-[#39B54A]">Kambel Consult</span>
              </h1>
              <p className="text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto leading-relaxed">
                Empowering businesses and professionals through expert consulting, strategic insights, and transformative learning experiences
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-[#000080] rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-[#000080] mb-6">{config.mission.title}</h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                {config.mission.description}
              </p>
            </div>
          </div>
        </section>

        {/* CEO Highlight Section */}
        <section className="py-20" style={{ background: 'linear-gradient(to bottom right, rgba(57, 181, 74, 0.1), rgba(255, 242, 0, 0.05), rgba(57, 181, 74, 0.1))' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                Meet Our CEO
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Visionary leadership driving excellence and innovation
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* CEO Image/Icon Section */}
                  <div className="lg:col-span-1 bg-gradient-to-br from-[#000080] to-[#39B54A] p-8 lg:p-12 flex flex-col items-center justify-center text-white">
                    <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border-4 border-white border-opacity-30">
                      <UserCircle className="w-20 h-20 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{config.ceo.name}</h3>
                    <p className="text-xl text-white opacity-90 mb-4">{config.ceo.title}</p>
                    <div className="flex gap-2">
                      {[...Array(config.ceo.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                      ))}
                    </div>
                  </div>

                  {/* CEO Details Section */}
                  <div className="lg:col-span-2 p-8 lg:p-12">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-2xl font-bold text-[#000080] mb-4 flex items-center gap-2">
                          <Award className="w-6 h-6 text-[#39B54A]" />
                          Leadership Excellence
                        </h4>
                        <p className="text-slate-600 leading-relaxed">
                          {config.ceo.leadership}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-2xl font-bold text-[#000080] mb-4 flex items-center gap-2">
                          <Lightbulb className="w-6 h-6 text-[#FFF200]" />
                          Vision & Expertise
                        </h4>
                        <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                          {config.ceo.vision}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        {config.ceo.highlights.map((highlight, index) => {
                          const Icon = getIcon(highlight.icon);
                          return (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-[#39B54A] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-[#39B54A]" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-slate-900 mb-1">{highlight.title}</h5>
                                <p className="text-sm text-slate-600">{highlight.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                Education & Qualifications
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Academic excellence and continuous learning foundation
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {config.education.map((edu, index) => {
                const Icon = getIcon(edu.icon);
                const bgStyles = [
                  { background: 'linear-gradient(to right, rgba(57, 181, 74, 0.1), rgba(0, 0, 128, 0.1))' },
                  { background: 'linear-gradient(to right, rgba(0, 0, 128, 0.1), rgba(57, 181, 74, 0.1))' },
                  { background: 'linear-gradient(to right, rgba(255, 242, 0, 0.1), rgba(57, 181, 74, 0.1))' }
                ];
                const iconColors = [
                  'bg-[#000080]',
                  'bg-[#39B54A]',
                  'bg-[#FFF200]'
                ];
                const borderColors = [
                  'border-[#39B54A] border-opacity-20',
                  'border-[#000080] border-opacity-20',
                  'border-[#FFF200] border-opacity-30'
                ];
                return (
                  <div
                    key={index}
                    style={bgStyles[index % bgStyles.length]}
                    className={`rounded-xl p-8 border ${borderColors[index % borderColors.length]} hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 ${iconColors[index % iconColors.length]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#000080] mb-2">{edu.type}</h3>
                        <p className="text-slate-700 leading-relaxed mb-3">{edu.description}</p>
                        {edu.tags && edu.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {edu.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-[#39B54A] bg-opacity-10 text-[#39B54A] rounded-full text-sm font-semibold"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                Awards & Recognitions
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Celebrating excellence and industry recognition
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {config.achievements.map((achievement, index) => {
                const Icon = getIcon(achievement.icon);
                const gradients = [
                  'from-[#FFF200] to-[#39B54A]',
                  'from-[#000080] to-[#39B54A]',
                  'from-[#39B54A] to-[#2A8F39]',
                  'from-[#000080] to-[#FFF200]',
                  'from-[#39B54A] to-[#000080]',
                  'from-[#FFF200] to-[#000080]'
                ];
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-lg flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#000080] mb-3">{achievement.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">{achievement.description}</p>
                    <div className="text-sm font-semibold text-[#39B54A]">{achievement.year}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Professional Journey Timeline */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                Our Professional Journey
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                A timeline of milestones and achievements that define our story
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#39B54A] via-[#000080] to-[#39B54A] hidden md:block"></div>

              {/* Timeline Events */}
              <div className="space-y-12 md:space-y-0">
                {config.timeline.map((event, index) => {
                  const Icon = getIcon(event.icon);
                  const isLeft = index % 2 === 0;
                  
                  return (
                    <div
                      key={index}
                      className={`relative flex items-center ${
                        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                      } flex-col md:flex-row`}
                    >
                      {/* Content */}
                      <div className={`w-full md:w-1/2 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'} text-center md:text-left`}>
                        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                          <div className={`flex items-center gap-4 mb-4 ${isLeft ? 'md:flex-row-reverse md:justify-end' : ''}`}>
                            <div className="w-16 h-16 bg-gradient-to-br from-[#39B54A] to-[#000080] rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-[#39B54A] mb-1">{event.year}</div>
                              <h3 className="text-xl font-bold text-[#000080]">{event.title}</h3>
                            </div>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{event.description}</p>
                        </div>
                      </div>

                      {/* Timeline Dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white border-4 border-[#39B54A] rounded-full flex items-center justify-center z-10 hidden md:flex">
                        <div className="w-4 h-4 bg-[#39B54A] rounded-full"></div>
                      </div>

                      {/* Year on Mobile */}
                      <div className="w-full md:w-1/2 flex justify-center md:hidden mb-4">
                        <div className="w-12 h-12 bg-[#39B54A] rounded-full flex items-center justify-center">
                          <div className="text-white font-bold text-sm">{event.year}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                Our Core Values
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {config.values.map((value, index) => {
                const Icon = getIcon(value.icon);
                return (
                  <div
                    key={index}
                    className="text-center p-6 rounded-xl bg-gray-50 hover:bg-[#39B54A] hover:bg-opacity-5 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-[#39B54A] hover:border-opacity-30"
                  >
                    <div className="w-16 h-16 bg-[#000080] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#000080] mb-3">{value.title}</h3>
                    <p className="text-slate-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Achievements Stats */}
        <section className="py-20 bg-gradient-to-r from-[#000080] to-[#39B54A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Achievements</h2>
              <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
                Numbers that reflect our impact and commitment to excellence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {config.stats.map((stat, index) => {
                const Icon = getIcon(stat.icon);
                return (
                  <div key={index} className="text-center">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-5xl font-bold mb-2">{stat.number}</div>
                    <div className="text-xl text-white opacity-90">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsletterSubscription />
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#000080] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#000080]">Phone</h3>
                {contactInfo.phone ? (
                  <a href={`tel:${contactInfo.phone}`} className="text-slate-600 hover:text-[#39B54A]">
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
        <footer className="bg-[#000080] text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4">
              <img
                src="/klogo.jpeg"
                alt="Kambel Consult Logo"
                className="h-12 w-auto mx-auto"
              />
            </div>
            <p className="text-sm text-white opacity-90">
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
