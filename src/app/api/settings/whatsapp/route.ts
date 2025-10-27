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
    whatsappLink: {
      url: 'https://wa.me/+233XXXXXXXXX',
      enabled: true
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
      whatsappLink: settings.whatsappLink || {
        url: 'https://wa.me/+233XXXXXXXXX',
        enabled: true
      }
    });
  } catch (error) {
    console.error('Error fetching WhatsApp link settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, enabled } = body;

    if (url === undefined && enabled === undefined) {
      return NextResponse.json(
        { error: 'URL or enabled status is required' },
        { status: 400 }
      );
    }

    // Validate URL format if provided
    if (url) {
      try {
        new URL(url);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid URL format' },
          { status: 400 }
        );
      }
    }

    const settings = loadSettings();
    const whatsappLink = {
      url: url || settings.whatsappLink?.url || 'https://wa.me/+233XXXXXXXXX',
      enabled: enabled !== undefined ? enabled : (settings.whatsappLink?.enabled !== undefined ? settings.whatsappLink.enabled : true)
    };

    settings.whatsappLink = whatsappLink;
    saveSettings(settings);

    console.log('WhatsApp link updated:', whatsappLink);

    return NextResponse.json({
      message: 'WhatsApp link updated successfully',
      whatsappLink: whatsappLink
    });

  } catch (error) {
    console.error('Error updating WhatsApp link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
