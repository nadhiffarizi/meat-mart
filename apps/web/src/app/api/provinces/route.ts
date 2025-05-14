import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://wilayah.id/api/provinces.json', {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provinces' },
      { status: 500 },
    );
  }
}
