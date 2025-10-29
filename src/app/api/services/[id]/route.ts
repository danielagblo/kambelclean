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

const loadServices = (): ConsultancyService[] => {
  try {
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
    fs.writeFileSync(DATA_FILE, JSON.stringify(services, null, 2));
  } catch (error) {
    console.error('Error saving services:', error);
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const services = loadServices();
    const service = services.find(s => s.id === params.id);

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error fetching service:', error);
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
    const services = loadServices();
    const index = services.findIndex(s => s.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    services[index] = { ...services[index], ...body, id: params.id };
    saveServices(services);

    return NextResponse.json({
      message: 'Service updated successfully',
      service: services[index]
    });
  } catch (error) {
    console.error('Error updating service:', error);
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
    const services = loadServices();
    const filtered = services.filter(s => s.id !== params.id);

    if (filtered.length === services.length) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    saveServices(filtered);

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

