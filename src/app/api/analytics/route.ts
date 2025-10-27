import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

interface PageView {
  page: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
}

interface RegistrationEvent {
  timestamp: string;
  source: string; // 'landing' or 'register'
}

interface AnalyticsData {
  pageViews: PageView[];
  registrations: RegistrationEvent[];
  lastUpdated: string;
}

function readAnalytics(): AnalyticsData {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const data = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading analytics:', error);
  }
  
  return {
    pageViews: [],
    registrations: [],
    lastUpdated: new Date().toISOString()
  };
}

function writeAnalytics(data: AnalyticsData): void {
  try {
    const dir = path.dirname(ANALYTICS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing analytics:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const analytics = readAnalytics();
    
    // Get business registrations count
    const businessRegistrationsFile = path.join(process.cwd(), 'data', 'business-registrations.json');
    let totalRegistrations = 0;
    if (fs.existsSync(businessRegistrationsFile)) {
      const businessData = JSON.parse(fs.readFileSync(businessRegistrationsFile, 'utf-8'));
      totalRegistrations = businessData.length;
    }

    // Calculate metrics
    const totalPageViews = analytics.pageViews.length;
    const uniqueVisitors = new Set(analytics.pageViews.map(v => v.userAgent)).size;
    const landingPageViews = analytics.pageViews.filter(v => v.page === '/landing' || v.page === '/').length;
    const registerPageViews = analytics.pageViews.filter(v => v.page === '/register').length;
    const aboutPageViews = analytics.pageViews.filter(v => v.page === '/about').length;
    const pricingPageViews = analytics.pageViews.filter(v => v.page === '/pricing').length;
    
    // Calculate bounce rate (single page views / total visitors)
    const singlePageVisitors = analytics.pageViews.reduce((acc, view) => {
      const visitorKey = view.userAgent;
      if (!acc[visitorKey]) {
        acc[visitorKey] = [];
      }
      acc[visitorKey].push(view);
      return acc;
    }, {} as Record<string, PageView[]>);
    
    const bouncedVisitors = Object.values(singlePageVisitors).filter(views => views.length === 1).length;
    const bounceRate = uniqueVisitors > 0 ? (bouncedVisitors / uniqueVisitors * 100) : 0;

    // Average session duration (simplified - using timestamps difference)
    let avgSessionDuration = 0;
    if (analytics.pageViews.length > 1) {
      const sessions = analytics.pageViews.reduce((acc, view) => {
        const day = new Date(view.timestamp).toDateString();
        if (!acc[day]) acc[day] = [];
        acc[day].push(new Date(view.timestamp).getTime());
        return acc;
      }, {} as Record<string, number[]>);
      
      const durations = Object.values(sessions)
        .map(times => Math.max(...times) - Math.min(...times))
        .filter(d => d > 0);
      
      avgSessionDuration = durations.length > 0 
        ? durations.reduce((a, b) => a + b, 0) / durations.length / 1000 / 60 // Convert to minutes
        : 0;
    }

    return NextResponse.json({
      totalPageViews,
      uniqueVisitors,
      totalRegistrations,
      bounceRate: bounceRate.toFixed(2),
      avgSessionDuration: avgSessionDuration.toFixed(2),
      pageViews: {
        landing: landingPageViews,
        register: registerPageViews,
        about: aboutPageViews,
        pricing: pricingPageViews,
      },
      recentActivity: analytics.pageViews.slice(-10).reverse()
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { page, userAgent, referrer } = await request.json();
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page is required' },
        { status: 400 }
      );
    }

    const analytics = readAnalytics();
    
    // Add new page view
    analytics.pageViews.push({
      page,
      timestamp: new Date().toISOString(),
      userAgent: userAgent || 'Unknown',
      referrer: referrer || 'Direct'
    });

    // Keep only last 1000 page views to prevent file size issues
    if (analytics.pageViews.length > 1000) {
      analytics.pageViews = analytics.pageViews.slice(-1000);
    }

    analytics.lastUpdated = new Date().toISOString();
    writeAnalytics(analytics);

    return NextResponse.json({ message: 'Page view recorded' });
  } catch (error) {
    console.error('Error recording page view:', error);
    return NextResponse.json(
      { error: 'Failed to record page view' },
      { status: 500 }
    );
  }
}

