import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load settings
const loadSettings = () => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
      const settings = JSON.parse(data);
      return settings;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return {
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    }
  };
};

// Save settings
const saveSettings = (settings: any) => {
  try {
    ensureDataDirectory();
    const currentSettings = loadSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export async function GET() {
  try {
    const settings = loadSettings();
    return NextResponse.json({ 
      contactInfo: settings.contactInfo || {
        phone: '',
        email: '',
        address: ''
      }
    });
  } catch (error) {
    console.error('Error fetching contact info settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email, address } = body;

    // Validate required fields
    if (phone === undefined && email === undefined && address === undefined) {
      return NextResponse.json(
        { error: 'At least one field (phone, email, or address) is required' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    const settings = loadSettings();
    const contactInfo = {
      phone: phone !== undefined ? phone : (settings.contactInfo?.phone || ''),
      email: email !== undefined ? email : (settings.contactInfo?.email || ''),
      address: address !== undefined ? address : (settings.contactInfo?.address || '')
    };

    settings.contactInfo = contactInfo;
    saveSettings(settings);

    console.log('Contact info updated:', contactInfo);

    return NextResponse.json({
      message: 'Contact information updated successfully',
      contactInfo: contactInfo
    });

  } catch (error) {
    console.error('Error updating contact information:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
