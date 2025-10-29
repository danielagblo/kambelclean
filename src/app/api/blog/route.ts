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

const ensureDataDirectory = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const loadBlogPosts = (): BlogPost[] => {
  try {
    ensureDataDirectory();
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
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Error saving blog posts:', error);
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const published = searchParams.get('published');

    let posts = loadBlogPosts();

    if (published === 'true') {
      posts = posts.filter(p => p.published);
    }

    if (category) {
      posts = posts.filter(p => p.category === category);
    }

    if (tag) {
      posts = posts.filter(p => p.tags.includes(tag));
    }

    // Sort by published date (newest first)
    posts.sort((a, b) => {
      const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
      const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, author, featuredImage, published, tags, category } = body;

    if (!title || !content || !author || !category) {
      return NextResponse.json(
        { error: 'Title, content, author, and category are required' },
        { status: 400 }
      );
    }

    const posts = loadBlogPosts();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Ensure unique slug
    let uniqueSlug = slug;
    let counter = 1;
    while (posts.find(p => p.slug === uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title,
      slug: uniqueSlug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      author,
      featuredImage,
      published: published || false,
      publishedDate: published ? new Date().toISOString() : undefined,
      tags: tags || [],
      category,
      views: 0
    };

    posts.push(newPost);
    saveBlogPosts(posts);

    return NextResponse.json({
      message: 'Blog post created successfully',
      post: newPost
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

