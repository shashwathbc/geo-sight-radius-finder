
import React, { useState } from 'react';
import AddressForm, { AddressData } from '@/components/AddressForm';
import MapDisplay, { LocationData, PlaceData } from '@/components/MapDisplay';
import ResultsSummary from '@/components/ResultsSummary';
import MapInfo from '@/components/MapboxTokenInput';
import { geocodeAddress, searchNearbyPlaces } from '@/services/locationService';
import { useToast } from '@/components/ui/use-toast';

const DEFAULT_RADIUS = 1; // 1km radius

const Index = () => {
  const [showMap, setShowMap] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationData | undefined>(undefined);
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddressSubmit = async (address: AddressData) => {
    setIsLoading(true);
    
    try {
      // First, geocode the address to get coordinates
      const locationData = await geocodeAddress(address);
      setLocation(locationData);
      
      // Then search for places
      const placesData = await searchNearbyPlaces(locationData, DEFAULT_RADIUS);
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

  // If user hasn't clicked continue yet, show the intro screen
  if (!showMap) {
    return <MapInfo onContinue={() => setShowMap(true)} />;
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
            you would use real-world location data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
