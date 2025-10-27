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

// Load existing registrations
const loadRegistrations = (): BusinessRegistration[] => {
  try {
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
    fs.writeFileSync(DATA_FILE, JSON.stringify(registrations, null, 2));
  } catch (error) {
    console.error('Error saving registrations:', error);
  }
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const registrations = loadRegistrations();
    const registrationIndex = registrations.findIndex(reg => reg.id === id);

    if (registrationIndex === -1) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // If status is provided, update only status
    if (body.status) {
      if (!['approved', 'rejected'].includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      registrations[registrationIndex].status = body.status;
      saveRegistrations(registrations);
      return NextResponse.json(
        { message: 'Status updated successfully' },
        { status: 200 }
      );
    }

    // Otherwise, update all fields
    const { name, email, phone, businessName, category, location } = body;
    
    if (name) registrations[registrationIndex].name = name;
    if (email) registrations[registrationIndex].email = email;
    if (phone) registrations[registrationIndex].phone = phone;
    if (businessName) registrations[registrationIndex].businessName = businessName;
    if (category) registrations[registrationIndex].category = category;
    if (location) registrations[registrationIndex].location = location;

    saveRegistrations(registrations);

    return NextResponse.json(
      { message: 'Registration updated successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating registration:', error);
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

    const registrations = loadRegistrations();
    const registrationIndex = registrations.findIndex(reg => reg.id === id);

    if (registrationIndex === -1) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    registrations.splice(registrationIndex, 1);
    saveRegistrations(registrations);

    return NextResponse.json(
      { message: 'Registration deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
