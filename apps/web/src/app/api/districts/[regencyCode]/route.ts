import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { regencyCode: string } },
) {
  try {
    console.log('Fetching cities for province:', params.regencyCode);

    const response = await fetch(
      `https://wilayah.id/api/districts/${params.regencyCode}.json`,
      { next: { revalidate: 86400 } }, // Cache for 24 hours
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('DATA KOTA', data.data);

    return NextResponse.json(data.data);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 },
    );
  }
}
