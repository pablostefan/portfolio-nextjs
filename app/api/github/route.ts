import { NextResponse } from 'next/server';
import { fetchPortfolioProjects } from '@/lib/github';

export const revalidate = 3600;

export async function GET(): Promise<NextResponse> {
  try {
    const projects = await fetchPortfolioProjects();
    return NextResponse.json(projects, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
