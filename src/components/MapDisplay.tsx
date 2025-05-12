import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
  mapboxToken: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ location, radius, places, mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const circleLayer = useRef<string | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-98.5795, 39.8283], // Default to center of US
        zoom: 3
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current.on('load', () => {
        setMapInitialized(true);
      });
    }
    
    // Cleanup function to remove map
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map when location changes
  useEffect(() => {
    if (!map.current || !mapInitialized || !location) return;
    
    // Clear previous markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add main location marker
    const mainMarker = new mapboxgl.Marker({ color: '#3B82F6' })
      .setLngLat([location.lng, location.lat])
      .addTo(map.current);
    
    if (location.formattedAddress) {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<p class="font-medium">${location.formattedAddress}</p>`);
      
      mainMarker.setPopup(popup);
    }
    
    markers.current.push(mainMarker);
    
    // Center and zoom the map
    map.current.flyTo({
      center: [location.lng, location.lat],
      zoom: 14,
      essential: true
    });
    
    // Draw radius circle
    if (map.current.getLayer('radius-circle')) {
      map.current.removeLayer('radius-circle');
    }
    
    if (map.current.getSource('radius-source')) {
      map.current.removeSource('radius-source');
    }
    
    // Create a circle with the specified radius
    // 1km radius in meters
    const radiusInMeters = radius * 1000;
    
    map.current.addSource('radius-source', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        },
        properties: {}
      }
    });
    
    map.current.addLayer({
      id: 'radius-circle',
      type: 'circle',
      source: 'radius-source',
      paint: {
        'circle-radius': {
          stops: [
            [0, 0],
            [20, radiusInMeters / 0.3]
          ],
          base: 2
        },
        'circle-color': '#3B82F6',
        'circle-opacity': 0.15,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#3B82F6',
        'circle-stroke-opacity': 0.5
      }
    });
    
    circleLayer.current = 'radius-circle';
    
  }, [location, radius, mapInitialized]);
  
  // Add place markers when places change
  useEffect(() => {
    if (!map.current || !mapInitialized || !location || places.length === 0) return;
    
    // Remove old place markers but keep the main marker
    markers.current.slice(1).forEach(marker => marker.remove());
    markers.current = markers.current.slice(0, 1);
    
    // Add new place markers
    places.forEach(place => {
      // Different colors for different place types
      let color = '#3B82F6'; // Default blue
      
      switch (place.type) {
        case 'hospital':
          color = '#EC4899'; // Pink
          break;
        case 'school':
          color = '#22C55E'; // Green
          break;
        case 'transport':
          color = '#F59E0B'; // Orange
          break;
      }
      
      const placeMarker = new mapboxgl.Marker({ color })
        .setLngLat([place.location.lng, place.location.lat])
        .addTo(map.current!);
        
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <p class="font-medium">${place.name}</p>
          <p class="text-sm capitalize">${place.type}</p>
        `);
        
      placeMarker.setPopup(popup);
      markers.current.push(placeMarker);
    });
    
  }, [places, location, mapInitialized]);

  return (
    <Card className="w-full h-full overflow-hidden shadow-md">
      <CardContent className="p-0">
        <div 
          ref={mapContainer} 
          className="w-full h-[calc(100vh-2rem)] min-h-[400px]"
        />
      </CardContent>
    </Card>
  );
};

export default MapDisplay;
