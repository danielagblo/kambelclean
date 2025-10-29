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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const masterclasses = loadMasterclasses();
    const masterclass = masterclasses.find(m => m.id === id);

    if (!masterclass) {
      return NextResponse.json(
        { error: 'Masterclass not found' },
        { status: 404 }
      );
    }

    if (!masterclass.published) {
      return NextResponse.json(
        { error: 'Masterclass is not available for registration' },
        { status: 400 }
      );
    }

    // Check if already registered
    const existingRegistration = masterclass.registrations.find(
      r => r.email === email && r.status !== 'cancelled'
    );

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You are already registered for this masterclass' },
        { status: 400 }
      );
    }

    // Check if max participants reached
    if (masterclass.maxParticipants && masterclass.currentParticipants >= masterclass.maxParticipants) {
      return NextResponse.json(
        { error: 'Masterclass is full' },
        { status: 400 }
      );
    }

    const registration: MasterclassRegistration = {
      id: Date.now().toString(),
      masterclassId: id,
      name,
      email,
      phone,
      message,
      registeredAt: new Date().toISOString(),
      status: 'pending'
    };

    masterclass.registrations.push(registration);
    masterclass.currentParticipants = masterclass.registrations.filter(
      r => r.status !== 'cancelled'
    ).length;
    
    const index = masterclasses.findIndex(m => m.id === id);
    masterclasses[index] = masterclass;
    saveMasterclasses(masterclasses);

    return NextResponse.json({
      message: 'Registration submitted successfully',
      registration
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering for masterclass:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

