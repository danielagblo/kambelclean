import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  active: boolean;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');

const ensureDataDirectory = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const loadSubscribers = (): NewsletterSubscriber[] => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading subscribers:', error);
  }
  return [];
};

const saveSubscribers = (subscribers: NewsletterSubscriber[]) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(subscribers, null, 2));
  } catch (error) {
    console.error('Error saving subscribers:', error);
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    
    const subscribers = loadSubscribers();
    const result = all ? subscribers : subscribers.filter(s => s.active);
    
    return NextResponse.json({ 
      subscribers: result,
      total: result.length 
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    const subscribers = loadSubscribers();
    
    // Check if already subscribed
    const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { error: 'Email is already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        existing.active = true;
        existing.name = name || existing.name;
        saveSubscribers(subscribers);
        return NextResponse.json({
          message: 'Subscription reactivated successfully',
          subscriber: existing
        });
      }
    }

    const newSubscriber: NewsletterSubscriber = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name,
      subscribedAt: new Date().toISOString(),
      active: true
    };

    subscribers.push(newSubscriber);
    saveSubscribers(subscribers);

    return NextResponse.json({
      message: 'Subscribed successfully',
      subscriber: newSubscriber
    }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const subscribers = loadSubscribers();
    const subscriber = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    subscriber.active = false;
    saveSubscribers(subscribers);

    return NextResponse.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

