import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface BusinessRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  category: string;
  location: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const DATA_FILE = path.join(process.cwd(), 'data', 'business-registrations.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load existing registrations
const loadRegistrations = (): BusinessRegistration[] => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading registrations:', error);
  }
  return [];
};

// Save registrations
const saveRegistrations = (registrations: BusinessRegistration[]) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(registrations, null, 2));
  } catch (error) {
    console.error('Error saving registrations:', error);
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, businessName, category, location } = body;

    // Validate required fields
    if (!name || !email || !phone || !businessName || !category || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Load existing registrations
    const registrations = loadRegistrations();

    // Check if email already exists
    const existingRegistration = registrations.find(reg => reg.email === email);
    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new registration
    const newRegistration: BusinessRegistration = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      businessName,
      category,
      location,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Add to registrations
    registrations.push(newRegistration);
    saveRegistrations(registrations);

    console.log('New business registration:', newRegistration);

    return NextResponse.json(
      { 
        message: 'Registration submitted successfully',
        id: newRegistration.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const registrations = loadRegistrations();
    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}