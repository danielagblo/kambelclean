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

const loadMessages = (): ContactMessage[] => {
  try {
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
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messages = loadMessages();
    const message = messages.find(m => m.id === params.id);

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const messages = loadMessages();
    const index = messages.findIndex(m => m.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    messages[index] = { ...messages[index], ...body, id: params.id };
    saveMessages(messages);

    return NextResponse.json({
      message: 'Message updated successfully',
      contactMessage: messages[index]
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messages = loadMessages();
    const filtered = messages.filter(m => m.id !== params.id);

    if (filtered.length === messages.length) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    saveMessages(filtered);

    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

