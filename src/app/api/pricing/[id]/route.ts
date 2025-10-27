import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'pricing-plans.json');

interface PricingPlan {
  id: string;
  name: string;
  multiplier: string;
  features: string[];
  price: string;
  originalPrice: string;
  badge?: string;
  badgeColor?: string;
  order: number;
}

async function readPricingPlans(): Promise<PricingPlan[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, '[]', 'utf-8');
      return [];
    }
    console.error('Error reading pricing plans file:', error);
    return [];
  }
}

async function writePricingPlans(plans: PricingPlan[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(plans, null, 2), 'utf-8');
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const plans = await readPricingPlans();
    const plan = plans.find(p => p.id === id);

    if (!plan) {
      return NextResponse.json({ error: 'Pricing plan not found' }, { status: 404 });
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Failed to fetch pricing plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updatedFields = await request.json();
    let plans = await readPricingPlans();

    const index = plans.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Pricing plan not found' }, { status: 404 });
    }

    plans[index] = { ...plans[index], ...updatedFields };
    await writePricingPlans(plans);

    return NextResponse.json({ message: 'Pricing plan updated successfully', plan: plans[index] });
  } catch (error) {
    console.error('Failed to update pricing plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    let plans = await readPricingPlans();

    const initialLength = plans.length;
    plans = plans.filter(p => p.id !== id);

    if (plans.length === initialLength) {
      return NextResponse.json({ error: 'Pricing plan not found' }, { status: 404 });
    }

    await writePricingPlans(plans);

    return NextResponse.json({ message: 'Pricing plan deleted successfully' });
  } catch (error) {
    console.error('Failed to delete pricing plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
