import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'about-config.json');

const ensureDataDirectory = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const loadAboutConfig = () => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading about config:', error);
  }
  return null;
};

const saveAboutConfig = (config: any) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error saving about config:', error);
  }
};

export async function GET() {
  try {
    const config = loadAboutConfig();
    if (!config) {
      return NextResponse.json(
        { error: 'About configuration not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ config });
  } catch (error) {
    console.error('Error fetching about config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const config = loadAboutConfig();
    
    if (!config) {
      return NextResponse.json(
        { error: 'About configuration not found' },
        { status: 404 }
      );
    }

    // Update the config with new data
    const updatedConfig = {
      ...config,
      ...body,
      // Merge nested objects
      mission: body.mission || config.mission,
      ceo: body.ceo || config.ceo,
      education: body.education || config.education,
      achievements: body.achievements || config.achievements,
      timeline: body.timeline || config.timeline,
      values: body.values || config.values,
      stats: body.stats || config.stats
    };

    saveAboutConfig(updatedConfig);

    return NextResponse.json({
      message: 'About configuration updated successfully',
      config: updatedConfig
    });
  } catch (error) {
    console.error('Error updating about config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

