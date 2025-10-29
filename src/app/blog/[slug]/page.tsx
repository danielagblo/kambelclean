'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Calendar, User, ArrowLeft, Tag, Eye } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FloatingMenu from '@/components/FloatingMenu';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  featuredImage?: string;
  publishedDate?: string;
  tags: string[];
  category: string;
  views: number;
}

export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data.post);
        } else {
          router.push('/blog');
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug, router]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header Image */}
        {post.featuredImage && (
          <div className="w-full h-96 relative">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => router.push('/blog')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Blog
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div
              className="prose prose-lg max-w-none text-slate-700"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            />
          </div>
        </article>
      </div>
      </PageTransition>

      <FloatingMenu />
    </>
  );
}

