
import React, { useRef, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { Card, CardContent } from "@/components/ui/card";

export interface LocationData {
  lat: number;
  lng: number;
  formattedAddress?: string;
}

export interface PlaceData {
  id: string;
  name: string;
  type: 'hospital' | 'school' | 'transport';
  location: {
    lat: number;
    lng: number;
  };
}

interface MapDisplayProps {
  location?: LocationData;
  radius: number; // in kilometers
  places: PlaceData[];
  mapboxToken: string; // Renamed to googleMapsApiKey in the Index component
}

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 2rem)',
  minHeight: '400px'
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795 // Center of US
};

const MapDisplay: React.FC<MapDisplayProps> = ({ location, radius, places, mapboxToken }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circleRef = useRef<google.maps.Circle | null>(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: mapboxToken // Using the provided API key
  });

  // Map load callback
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Map unload callback
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Update markers and circle when location or places change
  React.useEffect(() => {
    if (!isLoaded || !map) return;

    // Clear previous markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Clear previous circle
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }

    // If we have a location, add the main marker and circle
    if (location) {
      // Add main location marker
      const mainMarker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#FFFFFF',
        }
      });

      // Add info window if we have a formatted address
      if (location.formattedAddress) {
        const infoWindow = new google.maps.InfoWindow({
          content: `<p class="font-medium">${location.formattedAddress}</p>`
        });

        mainMarker.addListener('click', () => {
          infoWindow.open(map, mainMarker);
        });
      }

      markersRef.current.push(mainMarker);

      // Add radius circle (1km radius)
      const radiusInMeters = radius * 1000;
      circleRef.current = new google.maps.Circle({
        map: map,
        center: { lat: location.lat, lng: location.lng },
        radius: radiusInMeters,
        fillColor: '#3B82F6',
        fillOpacity: 0.15,
        strokeColor: '#3B82F6',
        strokeWeight: 2,
        strokeOpacity: 0.5
      });

      // Center map on the location
      map.setCenter({ lat: location.lat, lng: location.lng });
      map.setZoom(14);
    }

    // Add place markers
    if (places.length > 0 && location) {
      places.forEach(place => {
        // Different colors for different place types
        let iconColor = '#3B82F6'; // Default blue
      
        switch (place.type) {
          case 'hospital':
            iconColor = '#EC4899'; // Pink
            break;
          case 'school':
            iconColor = '#22C55E'; // Green
            break;
          case 'transport':
            iconColor = '#F59E0B'; // Orange
            break;
        }
      
        const placeMarker = new google.maps.Marker({
          position: { lat: place.location.lat, lng: place.location.lng },
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: iconColor,
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
          }
        });
      
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <p class="font-medium">${place.name}</p>
            <p class="text-sm capitalize">${place.type}</p>
          `
        });
      
        placeMarker.addListener('click', () => {
          infoWindow.open(map, placeMarker);
        });
      
        markersRef.current.push(placeMarker);
      });
    }
  }, [isLoaded, map, location, places, radius]);

  if (!isLoaded) {
    return (
      <Card className="w-full h-full overflow-hidden shadow-md">
        <CardContent className="p-0 flex items-center justify-center h-[calc(100vh-2rem)] min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading Maps...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full overflow-hidden shadow-md">
      <CardContent className="p-0">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={location || defaultCenter}
          zoom={location ? 14 : 3}
          onLoad={onMapLoad}
          onUnmount={onUnmount}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default MapDisplay;
