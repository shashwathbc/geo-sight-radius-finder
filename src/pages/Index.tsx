
import React, { useState, useEffect } from 'react';
import AddressForm, { AddressData } from '@/components/AddressForm';
import MapDisplay, { LocationData, PlaceData } from '@/components/MapDisplay';
import ResultsSummary from '@/components/ResultsSummary';
import MapboxTokenInput from '@/components/MapboxTokenInput';
import { geocodeAddress, searchNearbyPlaces } from '@/services/locationService';
import { useToast } from '@/components/ui/use-toast';

const DEFAULT_RADIUS = 1; // 1km radius

const Index = () => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | undefined>(undefined);
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check local storage for saved token
  useEffect(() => {
    const savedToken = localStorage.getItem('google_maps_api_key');
    if (savedToken) {
      setGoogleMapsApiKey(savedToken);
    }
  }, []);

  const handleSaveToken = (token: string) => {
    setGoogleMapsApiKey(token);
    localStorage.setItem('google_maps_api_key', token);
    
    toast({
      title: "Google Maps API key saved",
      description: "Your Google Maps API key has been saved for this session."
    });
  };

  const handleAddressSubmit = async (address: AddressData) => {
    if (!googleMapsApiKey) {
      toast({
        title: "API Key Required",
        description: "Please provide a Google Maps API key first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, geocode the address to get coordinates
      const locationData = await geocodeAddress(address, googleMapsApiKey);
      setLocation(locationData);
      
      // Then search for places
      const placesData = await searchNearbyPlaces(locationData, googleMapsApiKey, DEFAULT_RADIUS);
      setPlaces(placesData);
      
      toast({
        title: "Location found",
        description: `Found ${placesData.length} places near ${address.street}`
      });
    } catch (error) {
      console.error('Error processing location:', error);
      toast({
        title: "Error finding location",
        description: error instanceof Error ? error.message : "Failed to process the address",
        variant: "destructive"
      });
      
      // Clear any previous results
      setLocation(undefined);
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  };

  // If no token is provided yet, show the token input form
  if (!googleMapsApiKey) {
    return <MapboxTokenInput onSubmit={handleSaveToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Location Amenities Finder</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Address Form - 1/4 width on large screens */}
          <div className="lg:col-span-1">
            <AddressForm 
              onSubmit={handleAddressSubmit} 
              isLoading={isLoading} 
            />
          </div>
          
          {/* Map Display - 2/4 width on large screens */}
          <div className="lg:col-span-2 min-h-[400px]">
            <MapDisplay 
              location={location} 
              radius={DEFAULT_RADIUS}
              places={places}
              mapboxToken={googleMapsApiKey}
            />
          </div>
          
          {/* Results Summary - 1/4 width on large screens */}
          <div className="lg:col-span-1">
            <ResultsSummary 
              places={places} 
              isLoading={isLoading} 
            />
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>Enter a U.S. address to find nearby hospitals, schools, and transport options within a 1km radius.</p>
          <p className="mt-2">
            Note: This is a demonstration using simulated data. In a production environment, 
            you would use Google Places API for real-world data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
