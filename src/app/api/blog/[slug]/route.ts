import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  featuredImage?: string;
  published: boolean;
  publishedDate?: string;
  tags: string[];
  category: string;
  views: number;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

const loadBlogPosts = (): BlogPost[] => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }
  return [];
};

const saveBlogPosts = (posts: BlogPost[]) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Error saving blog posts:', error);
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const posts = loadBlogPosts();
    const post = posts.find(p => p.slug === slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Increment views
    const index = posts.findIndex(p => p.slug === slug);
    if (index !== -1) {
      posts[index].views = (posts[index].views || 0) + 1;
      saveBlogPosts(posts);
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const posts = loadBlogPosts();
    const index = posts.findIndex(p => p.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Update slug if title changed
    let newSlug = slug;
    if (body.title && body.title !== posts[index].title) {
      newSlug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      // Ensure unique slug
      let uniqueSlug = newSlug;
      let counter = 1;
      while (posts.find(p => p.slug === uniqueSlug && p.id !== posts[index].id)) {
        uniqueSlug = `${newSlug}-${counter}`;
        counter++;
      }
      newSlug = uniqueSlug;
    }

    posts[index] = { 
      ...posts[index], 
      ...body, 
      slug: newSlug,
      id: posts[index].id,
      publishedDate: body.published && !posts[index].published ? new Date().toISOString() : posts[index].publishedDate
    };
    saveBlogPosts(posts);

    return NextResponse.json({
      message: 'Blog post updated successfully',
      post: posts[index]
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const posts = loadBlogPosts();
    const filtered = posts.filter(p => p.slug !== slug);

    if (filtered.length === posts.length) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    saveBlogPosts(filtered);

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
