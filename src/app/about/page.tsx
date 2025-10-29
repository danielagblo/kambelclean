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
  Mail
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FloatingMenu from '@/components/FloatingMenu';
import NewsletterSubscription from '@/components/NewsletterSubscription';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: any;
}

export default function AboutPage() {
  const router = useRouter();
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: ''
  });

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

  const timelineEvents: TimelineEvent[] = [
    {
      year: '2010',
      title: 'Founding & Early Years',
      description: 'Kambel Consult was established with a vision to provide expert consulting services and empower businesses through strategic guidance and innovative solutions.',
      icon: Briefcase
    },
    {
      year: '2013',
      title: 'Expansion & Growth',
      description: 'Expanded our service offerings and established partnerships with leading organizations, delivering transformative results across various industries.',
      icon: TrendingUp
    },
    {
      year: '2016',
      title: 'Masterclass Program Launch',
      description: 'Launched our premier masterclass program, providing intensive training and development opportunities for professionals and business leaders.',
      icon: GraduationCap
    },
    {
      year: '2018',
      title: 'Publication & Thought Leadership',
      description: 'Published first book and established thought leadership through publications and research, sharing insights with a global audience.',
      icon: BookOpen
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Embarked on digital transformation journey, enhancing our service delivery through technology and innovative consulting methodologies.',
      icon: Target
    },
    {
      year: '2023',
      title: 'Global Recognition',
      description: 'Received industry awards and recognition for excellence in consulting, leadership development, and organizational transformation.',
      icon: Award
    },
    {
      year: '2025',
      title: 'Future Vision',
      description: 'Continuing to innovate and lead in consulting excellence, expanding our reach and impact on businesses worldwide.',
      icon: CheckCircle
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, delivering outstanding results for our clients.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Building strong partnerships and working closely with clients to achieve shared success.'
    },
    {
      icon: Award,
      title: 'Integrity',
      description: 'Operating with the highest ethical standards and transparency in all our engagements.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Embracing new ideas and methodologies to provide cutting-edge solutions.'
    }
  ];

  const achievements = [
    { number: '500+', label: 'Clients Served', icon: Users },
    { number: '1000+', label: 'Masterclass Participants', icon: GraduationCap },
    { number: '50+', label: 'Publications', icon: BookOpen },
    { number: '15+', label: 'Years Experience', icon: Calendar }
  ];

  return (
    <>
      <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                About Kambel Consult
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Empowering businesses and professionals through expert consulting, strategic insights, and transformative learning experiences
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                To empower businesses and individuals to achieve their fullest potential through expert consulting, 
                strategic guidance, and transformative learning experiences. We are committed to delivering exceptional 
                value and fostering sustainable growth for our clients.
              </p>
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
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 hidden md:block"></div>

              {/* Timeline Events */}
              <div className="space-y-12 md:space-y-0">
                {timelineEvents.map((event, index) => {
                  const Icon = event.icon;
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
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-blue-600 mb-1">{event.year}</div>
                              <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                            </div>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{event.description}</p>
                        </div>
                      </div>

                      {/* Timeline Dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center z-10 hidden md:flex">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                      </div>

                      {/* Year on Mobile */}
                      <div className="w-full md:w-1/2 flex justify-center md:hidden mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
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
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200"
                  >
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                    <p className="text-slate-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Achievements</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Numbers that reflect our impact and commitment to excellence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-5xl font-bold mb-2">{achievement.number}</div>
                    <div className="text-xl text-blue-100">{achievement.label}</div>
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
