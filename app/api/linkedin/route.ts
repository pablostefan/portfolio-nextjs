import { NextResponse } from 'next/server';
import { fetchLinkedInProfile } from '@/lib/linkedin';

export const revalidate = 3600;

export async function GET(): Promise<NextResponse> {
  try {
    const profile = await fetchLinkedInProfile();
    if (!profile) {
      return NextResponse.json({ error: 'LinkedIn token not configured' }, { status: 503 });
    }
    return NextResponse.json(profile, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
