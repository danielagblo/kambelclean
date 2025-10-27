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
      // Create default pricing plans if file doesn't exist
      const defaultPlans: PricingPlan[] = [
        {
          id: '1',
          name: 'Basic',
          multiplier: '1.5x',
          features: [
            'Share limited number of ads',
            'All ads stays promoted for a week'
          ],
          price: '$567',
          originalPrice: '$567',
          badge: 'For you 50% off',
          badgeColor: '#374957',
          order: 1
        },
        {
          id: '2',
          name: 'Business',
          multiplier: '4x',
          features: [
            'Pro partnership status',
            'All ads stays promoted for a month'
          ],
          price: '$567',
          originalPrice: '$567',
          order: 2
        },
        {
          id: '3',
          name: 'Platinum',
          multiplier: '10x',
          features: [
            'Unlimited number of ads',
            'Sell 10x faster in all categories'
          ],
          price: '$567',
          originalPrice: '$567',
          order: 3
        }
      ];
      
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultPlans, null, 2), 'utf-8');
      return defaultPlans;
    }
    console.error('Error reading pricing plans file:', error);
    return [];
  }
}

async function writePricingPlans(plans: PricingPlan[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(plans, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const plans = await readPricingPlans();
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Failed to fetch pricing plans:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, multiplier, features, price, originalPrice, badge, badgeColor } = await request.json();

    if (!name || !multiplier || !features || !price || !originalPrice) {
      return NextResponse.json({ error: 'All required fields are missing' }, { status: 400 });
    }

    const plans = await readPricingPlans();
    const newPlan: PricingPlan = {
      id: Date.now().toString(),
      name,
      multiplier,
      features: Array.isArray(features) ? features : [features],
      price,
      originalPrice,
      badge: badge || undefined,
      badgeColor: badgeColor || '#374957',
      order: plans.length + 1
    };

    plans.push(newPlan);
    await writePricingPlans(plans);

    return NextResponse.json({ message: 'Pricing plan created successfully', plan: newPlan }, { status: 201 });
  } catch (error) {
    console.error('Failed to create pricing plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
