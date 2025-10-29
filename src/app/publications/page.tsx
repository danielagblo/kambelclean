'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FloatingMenu from '@/components/FloatingMenu';

interface Publication {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverImage?: string;
  price?: number;
  purchaseLink?: string;
  publishedDate: string;
  featured: boolean;
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/publications');
        if (response.ok) {
          const data = await response.json();
          setPublications(data.publications || []);
          setFilteredPublications(data.publications || []);
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set((data.publications || []).map((p: Publication) => p.category)));
          setCategories(uniqueCategories as string[]);
        }
      } catch (error) {
        console.error('Error loading publications:', error);
      }
    };

    fetchPublications();
  }, []);

  useEffect(() => {
    let filtered = publications;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPublications(filtered);
  }, [searchTerm, selectedCategory, publications]);

  return (
    <>
      <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Publications & Books</h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Explore our collection of insightful publications and books
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Publications Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredPublications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPublications.map((publication) => (
                  <div
                    key={publication.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {publication.coverImage ? (
                      <img
                        src={publication.coverImage}
                        alt={publication.title}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <BookOpen className="h-20 w-20 text-white opacity-50" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {publication.category}
                        </span>
                        {publication.featured && (
                          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{publication.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">By {publication.author}</p>
                      <p className="text-slate-600 mb-4 line-clamp-3">{publication.description}</p>
                      {publication.price !== undefined && (
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-2xl font-bold text-slate-900">
                            ${publication.price}
                          </span>
                          {publication.purchaseLink && (
                            <a
                              href={publication.purchaseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                              Purchase
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600">No publications found</p>
              </div>
            )}
          </div>
        </section>
      </div>
      </PageTransition>

      <FloatingMenu />
    </>
  );
}

