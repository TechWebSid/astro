export interface CityData {
  name: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
  tzOffsetHours: number;
}

export const CITIES_DATABASE: CityData[] = [
  { name: "New Delhi", state: "Delhi", country: "India", lat: 28.6139, lng: 77.2090, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Hardoi", state: "Uttar Pradesh", country: "India", lat: 27.3966, lng: 80.1253, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Lucknow", state: "Uttar Pradesh", country: "India", lat: 26.8467, lng: 80.9462, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Kanpur", state: "Uttar Pradesh", country: "India", lat: 26.4499, lng: 80.3319, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Varanasi", state: "Uttar Pradesh", country: "India", lat: 25.3176, lng: 82.9739, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Prayagraj (Allahabad)", state: "Uttar Pradesh", country: "India", lat: 25.4358, lng: 81.8463, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Gorakhpur", state: "Uttar Pradesh", country: "India", lat: 26.7663, lng: 83.3689, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Agra", state: "Uttar Pradesh", country: "India", lat: 27.1767, lng: 78.0081, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Bareilly", state: "Uttar Pradesh", country: "India", lat: 28.3670, lng: 79.4304, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Aligarh", state: "Uttar Pradesh", country: "India", lat: 27.8974, lng: 78.0880, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Moradabad", state: "Uttar Pradesh", country: "India", lat: 28.8386, lng: 78.7733, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Saharanpur", state: "Uttar Pradesh", country: "India", lat: 29.9679, lng: 77.5510, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Noida", state: "Uttar Pradesh", country: "India", lat: 28.5355, lng: 77.3910, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Ghaziabad", state: "Uttar Pradesh", country: "India", lat: 28.6692, lng: 77.4538, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Mumbai", state: "Maharashtra", country: "India", lat: 19.0760, lng: 72.8777, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Pune", state: "Maharashtra", country: "India", lat: 18.5204, lng: 73.8567, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Nagpur", state: "Maharashtra", country: "India", lat: 21.1458, lng: 79.0882, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lng: 77.5946, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Kolkata", state: "West Bengal", country: "India", lat: 22.5726, lng: 88.3639, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Chennai", state: "Tamil Nadu", country: "India", lat: 13.0827, lng: 80.2707, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Hyderabad", state: "Telangana", country: "India", lat: 17.3850, lng: 78.4867, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Ahmedabad", state: "Gujarat", country: "India", lat: 23.0225, lng: 72.5714, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Surat", state: "Gujarat", country: "India", lat: 21.1702, lng: 72.8311, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Jaipur", state: "Rajasthan", country: "India", lat: 26.9124, lng: 75.7873, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Jodhpur", state: "Rajasthan", country: "India", lat: 26.2389, lng: 73.0243, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Patna", state: "Bihar", country: "India", lat: 25.5941, lng: 85.1376, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Gaya", state: "Bihar", country: "India", lat: 24.7914, lng: 85.0002, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Muzaffarpur", state: "Bihar", country: "India", lat: 26.1209, lng: 85.3647, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Chandigarh", state: "Punjab/Haryana", country: "India", lat: 30.7333, lng: 76.7794, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Amritsar", state: "Punjab", country: "India", lat: 31.6340, lng: 74.8723, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Ludhiana", state: "Punjab", country: "India", lat: 30.9010, lng: 75.8573, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Bhopal", state: "Madhya Pradesh", country: "India", lat: 23.2599, lng: 77.4126, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Indore", state: "Madhya Pradesh", country: "India", lat: 22.7196, lng: 75.8577, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Jabalpur", state: "Madhya Pradesh", country: "India", lat: 23.1815, lng: 79.9864, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Gwalior", state: "Madhya Pradesh", country: "India", lat: 26.2183, lng: 78.1828, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Ranchi", state: "Jharkhand", country: "India", lat: 23.3441, lng: 85.3096, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Jamshedpur", state: "Jharkhand", country: "India", lat: 22.8046, lng: 86.2029, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Raipur", state: "Chhattisgarh", country: "India", lat: 21.2514, lng: 81.6296, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Bhubaneswar", state: "Odisha", country: "India", lat: 20.2961, lng: 85.8245, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Cuttack", state: "Odisha", country: "India", lat: 20.4625, lng: 85.8828, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Dehradun", state: "Uttarakhand", country: "India", lat: 30.3165, lng: 78.0322, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Haridwar", state: "Uttarakhand", country: "India", lat: 29.9457, lng: 78.1642, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Shimla", state: "Himachal Pradesh", country: "India", lat: 31.1048, lng: 77.1734, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Jammu", state: "Jammu & Kashmir", country: "India", lat: 32.7266, lng: 74.8570, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Srinagar", state: "Jammu & Kashmir", country: "India", lat: 34.0837, lng: 74.7973, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Guwahati", state: "Assam", country: "India", lat: 26.1445, lng: 91.7362, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Kochi", state: "Kerala", country: "India", lat: 9.9312, lng: 76.2673, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Thiruvananthapuram", state: "Kerala", country: "India", lat: 8.5241, lng: 76.9366, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Coimbatore", state: "Tamil Nadu", country: "India", lat: 11.0168, lng: 76.9558, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Madurai", state: "Tamil Nadu", country: "India", lat: 9.9252, lng: 78.1198, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", country: "India", lat: 17.6868, lng: 83.2185, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "Vijayawada", state: "Andhra Pradesh", country: "India", lat: 16.5062, lng: 80.6480, timezone: "Asia/Kolkata", tzOffsetHours: 5.5 },
  { name: "London", state: "England", country: "United Kingdom", lat: 51.5074, lng: -0.1278, timezone: "Europe/London", tzOffsetHours: 0 },
  { name: "New York", state: "NY", country: "United States", lat: 40.7128, lng: -74.0060, timezone: "America/New_York", tzOffsetHours: -5 },
  { name: "Dubai", state: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, timezone: "Asia/Dubai", tzOffsetHours: 4 },
  { name: "Singapore", state: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, timezone: "Asia/Singapore", tzOffsetHours: 8 },
  { name: "Toronto", state: "ON", country: "Canada", lat: 43.6532, lng: -79.3832, timezone: "America/Toronto", tzOffsetHours: -5 }
];

export const POPULAR_CITIES = CITIES_DATABASE;

/**
 * Fast city search: filters local indexed cities first, and searches global cities via geocoding API.
 */
export async function searchWorldCities(query: string): Promise<CityData[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  // 1. Instant local match
  const localMatches = CITIES_DATABASE.filter((c) =>
    c.name.toLowerCase().includes(trimmed) ||
    c.state.toLowerCase().includes(trimmed)
  );

  // 2. Fetch external for any additional cities
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed
    )}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.results) {
        const fetched: CityData[] = data.results.map((item: any) => ({
          name: item.name,
          state: item.admin1 || '',
          country: item.country || '',
          lat: item.latitude,
          lng: item.longitude,
          timezone: item.timezone || 'Asia/Kolkata',
          tzOffsetHours: item.country_code === 'IN' ? 5.5 : Math.round((item.longitude / 15) * 2) / 2
        }));

        const combined = [...localMatches];
        const seen = new Set(localMatches.map((c) => c.name.toLowerCase()));
        for (const f of fetched) {
          if (!seen.has(f.name.toLowerCase())) {
            seen.add(f.name.toLowerCase());
            combined.push(f);
          }
        }
        return combined.slice(0, 10);
      }
    }
  } catch {
    // Return local matches if offline
  }

  return localMatches.slice(0, 10);
}
