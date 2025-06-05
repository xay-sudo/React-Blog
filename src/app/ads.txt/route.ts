
import { getSiteSettings } from '@/data/siteSettings';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure it's always fresh

export async function GET() {
  const settings = getSiteSettings();
  const adsTxtContent = settings.adsTxtContent || '';

  return new NextResponse(adsTxtContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
