
import { AddressData } from '@/components/AddressForm';
import { LocationData, PlaceData } from '@/components/MapDisplay';

// Geocode an address to get coordinates using Google Maps Geocoding API
export async function geocodeAddress(address: AddressData, googleMapsApiKey: string): Promise<LocationData> {
  const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  
  try {
    // For demonstration, we'll simulate the API response
    // In production, you would use the actual Google Geocoding API
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a random location near the center of the US
    // In a real application, you would call the Google Geocoding API
    const baseLat = 39.8283;
    const baseLng = -98.5795;
    const lat = baseLat + (Math.random() - 0.5) * 10;
    const lng = baseLng + (Math.random() - 0.5) * 20;
    
    return {
      lat,
      lng,
      formattedAddress: addressString
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

// Search for nearby places using Google Places API
export async function searchNearbyPlaces(
  location: LocationData,
  googleMapsApiKey: string,
  radius: number
): Promise<PlaceData[]> {
  // For demonstration, we'll simulate the API response with mock data
  // In a real application, you would use the actual Google Places API
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate some random points within the given radius (in km)
    const places: PlaceData[] = [];
    const types = ['hospital', 'school', 'transport'] as const;
    const names = {
      hospital: ['General Hospital', 'Medical Center', 'Emergency Care', 'Health Clinic', 'Family Medicine'],
      school: ['Elementary School', 'High School', 'Middle School', 'Academy', 'Learning Center'],
      transport: ['Bus Station', 'Metro Station', 'Train Stop', 'Transit Center', 'Bus Terminal']
    };
    
    // Generate between 3-7 places of each type
    types.forEach(type => {
      const count = Math.floor(Math.random() * 5) + 3; // 3 to 7 places
      
      for (let i = 0; i < count; i++) {
        // Random angle
        const angle = Math.random() * Math.PI * 2;
        // Random distance (between 0 and radius)
        const distance = Math.random() * radius;
        
        // Convert distance to lat/lng offset
        // This is a rough approximation and works for small distances
        const latOffset = distance * Math.sin(angle) / 111.32; // 1 degree lat = 111.32 km
        const lngOffset = distance * Math.cos(angle) / (111.32 * Math.cos(location.lat * (Math.PI / 180)));
        
        const typeNames = names[type];
        const name = `${typeNames[Math.floor(Math.random() * typeNames.length)]} ${Math.floor(Math.random() * 10) + 1}`;
        
        places.push({
          id: `${type}-${i}`,
          name,
          type,
          location: {
            lat: location.lat + latOffset,
            lng: location.lng + lngOffset
          }
        });
      }
    });
    
    return places;
  } catch (error) {
    console.error('Search places error:', error);
    throw error;
  }
}
