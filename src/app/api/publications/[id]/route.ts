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

const loadPublications = (): Publication[] => {
  try {
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
    fs.writeFileSync(DATA_FILE, JSON.stringify(publications, null, 2));
  } catch (error) {
    console.error('Error saving publications:', error);
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const publications = loadPublications();
    const publication = publications.find(p => p.id === params.id);

    if (!publication) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ publication });
  } catch (error) {
    console.error('Error fetching publication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const publications = loadPublications();
    const index = publications.findIndex(p => p.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }

    publications[index] = { ...publications[index], ...body, id: params.id };
    savePublications(publications);

    return NextResponse.json({
      message: 'Publication updated successfully',
      publication: publications[index]
    });
  } catch (error) {
    console.error('Error updating publication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const publications = loadPublications();
    const filtered = publications.filter(p => p.id !== params.id);

    if (filtered.length === publications.length) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }

    savePublications(filtered);

    return NextResponse.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

