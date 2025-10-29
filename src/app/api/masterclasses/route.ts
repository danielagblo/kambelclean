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

const ensureDataDirectory = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const loadMasterclasses = (): Masterclass[] => {
  try {
    ensureDataDirectory();
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
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(masterclasses, null, 2));
  } catch (error) {
    console.error('Error saving masterclasses:', error);
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    let masterclasses = loadMasterclasses();

    if (published === 'true') {
      masterclasses = masterclasses.filter(m => m.published);
    }

    // Sort by date (upcoming first)
    masterclasses.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return NextResponse.json({ masterclasses });
  } catch (error) {
    console.error('Error fetching masterclasses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, instructor, date, time, duration, price, maxParticipants, image, published } = body;

    if (!title || !description || !instructor || !date || !time || !duration || price === undefined) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const masterclasses = loadMasterclasses();
    const newMasterclass: Masterclass = {
      id: Date.now().toString(),
      title,
      description,
      instructor,
      date,
      time,
      duration,
      price,
      maxParticipants,
      currentParticipants: 0,
      image,
      published: published || false,
      registrations: []
    };

    masterclasses.push(newMasterclass);
    saveMasterclasses(masterclasses);

    return NextResponse.json({
      message: 'Masterclass created successfully',
      masterclass: newMasterclass
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating masterclass:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

