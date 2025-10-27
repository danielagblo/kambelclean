import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'settings.json');

interface Settings {
  launchDate: string;
}

function readSettings(): Settings {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading settings:', error);
  }
  
  // Default launch date if not set
  return { launchDate: '2025-12-31T00:00:00' };
}

function writeSettings(settings: Settings): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error writing settings:', error);
  }
}

export async function GET() {
  try {
    const settings = readSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching launch date:', error);
    return NextResponse.json(
      { error: 'Failed to fetch launch date' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { launchDate } = await request.json();

    if (!launchDate) {
      return NextResponse.json(
        { error: 'Launch date is required' },
        { status: 400 }
      );
    }

    // Validate date format
    const date = new Date(launchDate);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const settings = { launchDate };
    writeSettings(settings);

    return NextResponse.json({ message: 'Launch date updated successfully', settings });
  } catch (error) {
    console.error('Error updating launch date:', error);
    return NextResponse.json(
      { error: 'Failed to update launch date' },
      { status: 500 }
    );
  }
}

