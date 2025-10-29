import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
  replied: boolean;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'contact-messages.json');

const ensureDataDirectory = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const loadMessages = (): ContactMessage[] => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
  return [];
};

const saveMessages = (messages: ContactMessage[]) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

export async function GET() {
  try {
    const messages = loadMessages();
    // Sort by date (newest first)
    messages.sort((a, b) => {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
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

    const messages = loadMessages();
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      subject,
      message,
      submittedAt: new Date().toISOString(),
      read: false,
      replied: false
    };

    messages.push(newMessage);
    saveMessages(messages);

    return NextResponse.json({
      message: 'Message sent successfully',
      contactMessage: newMessage
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

