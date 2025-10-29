import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Masterclass {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  maxParticipants?: number;
  currentParticipants: number;
  image?: string;
  published: boolean;
  registrations: MasterclassRegistration[];
}

interface MasterclassRegistration {
  id: string;
  masterclassId: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  registeredAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const DATA_FILE = path.join(process.cwd(), 'data', 'masterclasses.json');

const loadMasterclasses = (): Masterclass[] => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading masterclasses:', error);
  }
  return [];
};

const saveMasterclasses = (masterclasses: Masterclass[]) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(masterclasses, null, 2));
  } catch (error) {
    console.error('Error saving masterclasses:', error);
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const masterclasses = loadMasterclasses();
    const masterclass = masterclasses.find(m => m.id === id);

    if (!masterclass) {
      return NextResponse.json(
        { error: 'Masterclass not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ masterclass });
  } catch (error) {
    console.error('Error fetching masterclass:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const masterclasses = loadMasterclasses();
    const index = masterclasses.findIndex(m => m.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Masterclass not found' },
        { status: 404 }
      );
    }

    masterclasses[index] = { 
      ...masterclasses[index], 
      ...body, 
      id,
      currentParticipants: masterclasses[index].currentParticipants 
    };
    saveMasterclasses(masterclasses);

    return NextResponse.json({
      message: 'Masterclass updated successfully',
      masterclass: masterclasses[index]
    });
  } catch (error) {
    console.error('Error updating masterclass:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const masterclasses = loadMasterclasses();
    const filtered = masterclasses.filter(m => m.id !== id);

    if (filtered.length === masterclasses.length) {
      return NextResponse.json(
        { error: 'Masterclass not found' },
        { status: 404 }
      );
    }

    saveMasterclasses(filtered);

    return NextResponse.json({ message: 'Masterclass deleted successfully' });
  } catch (error) {
    console.error('Error deleting masterclass:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

