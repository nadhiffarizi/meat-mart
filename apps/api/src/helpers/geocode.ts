import { opencage_apikey } from '@/config';

export async function getCoordinates(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${opencage_apikey}&countrycode=id&no_cache=1&limit=5`,
    );

    if (!response.ok) {
      throw new Error(`OpenCage API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Full API response:', data);

    if (data.results?.length > 0) {
      data.results.forEach((result: any, index: number) => {
        console.log(
          `Result ${index}:`,
          result.formatted,
          result.geometry,
          result.confidence,
        );
      });

      const bestResult = data.results.reduce((prev: any, current: any) =>
        prev.confidence > current.confidence ? prev : current,
      );

      return {
        lat: bestResult.geometry.lat,
        lng: bestResult.geometry.lng,
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
