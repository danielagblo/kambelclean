import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

const DATA_FILE = path.join(process.cwd(), 'data', 'publications.json');

const ensureDataDirectory = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const loadPublications = (): Publication[] => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading publications:', error);
  }
  return [];
};

const savePublications = (publications: Publication[]) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(publications, null, 2));
  } catch (error) {
    console.error('Error saving publications:', error);
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let publications = loadPublications();

    if (category) {
      publications = publications.filter(p => p.category === category);
    }

    if (featured === 'true') {
      publications = publications.filter(p => p.featured);
    }

    return NextResponse.json({ publications });
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, description, category, coverImage, price, purchaseLink, featured } = body;

    if (!title || !author || !description || !category) {
      return NextResponse.json(
        { error: 'Title, author, description, and category are required' },
        { status: 400 }
      );
    }

    const publications = loadPublications();
    const newPublication: Publication = {
      id: Date.now().toString(),
      title,
      author,
      description,
      category,
      coverImage,
      price,
      purchaseLink,
      publishedDate: new Date().toISOString(),
      featured: featured || false
    };

    publications.push(newPublication);
    savePublications(publications);

    return NextResponse.json({
      message: 'Publication created successfully',
      publication: newPublication
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

