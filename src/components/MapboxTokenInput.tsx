
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MapInfoProps {
  onContinue: () => void;
}

const MapInfo: React.FC<MapInfoProps> = ({ onContinue }) => {
  return (
    <Card className="max-w-md mx-auto my-8 shadow-md">
      <CardHeader>
        <CardTitle>Open Source Maps Ready</CardTitle>
        <CardDescription>
          This application uses MapLibre GL JS, an open-source mapping library that doesn't require an API key.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            <p>MapLibre GL JS is a free, open-source JavaScript library that renders interactive maps using WebGL.</p>
            <p className="mt-2">No API key is required to display maps or search for locations.</p>
          </div>
          <Button type="button" onClick={onContinue}>
            Continue to Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapInfo;
