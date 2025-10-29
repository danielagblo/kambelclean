import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ConsultancyService {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  icon?: string;
  image?: string;
  category: string;
  featured: boolean;
  order: number;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'consultancy-services.json');

const ensureDataDirectory = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const loadServices = (): ConsultancyService[] => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading services:', error);
  }
  return [];
};

const saveServices = (services: ConsultancyService[]) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(services, null, 2));
  } catch (error) {
    console.error('Error saving services:', error);
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let services = loadServices();

    if (category) {
      services = services.filter(s => s.category === category);
    }

    if (featured === 'true') {
      services = services.filter(s => s.featured);
    }

    // Sort by order
    services.sort((a, b) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, detailedDescription, icon, image, category, featured, order } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    const services = loadServices();
    const newService: ConsultancyService = {
      id: Date.now().toString(),
      title,
      description,
      detailedDescription,
      icon,
      image,
      category,
      featured: featured || false,
      order: order || services.length
    };

    services.push(newService);
    saveServices(services);

    return NextResponse.json({
      message: 'Service created successfully',
      service: newService
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

