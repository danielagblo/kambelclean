import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FAVICON_PATH = path.join(process.cwd(), 'public', 'favicon.svg');
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
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return {
    favicon: {
      current: '/favicon.svg',
      custom: null
    }
  };
};

// Save settings
const saveSettings = (settings: any) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export async function GET() {
  try {
    const settings = loadSettings();
    return NextResponse.json({ favicon: settings.favicon });
  } catch (error) {
    console.error('Error fetching favicon settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('favicon') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Accept any file type - no restrictions

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'svg';
    const filename = `favicon-${timestamp}.${extension}`;
    const filepath = path.join(process.cwd(), 'public', filename);

    // Save the file
    fs.writeFileSync(filepath, buffer);

    // Update settings
    const settings = loadSettings();
    settings.favicon = {
      current: `/${filename}`,
      custom: `/${filename}`
    };
    saveSettings(settings);

    console.log('Favicon uploaded:', filename);

    return NextResponse.json({
      message: 'Favicon uploaded successfully',
      filename: filename,
      url: `/${filename}`
    });

  } catch (error) {
    console.error('Error uploading favicon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const settings = loadSettings();
    
    if (settings.favicon.custom) {
      // Delete the custom favicon file
      const customPath = path.join(process.cwd(), 'public', settings.favicon.custom.replace('/', ''));
      if (fs.existsSync(customPath)) {
        fs.unlinkSync(customPath);
      }
      
      // Reset to default
      settings.favicon = {
        current: '/favicon.svg',
        custom: null
      };
      saveSettings(settings);
      
      return NextResponse.json({
        message: 'Favicon reset to default'
      });
    }
    
    return NextResponse.json({
      message: 'No custom favicon to delete'
    });

  } catch (error) {
    console.error('Error deleting favicon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
