
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MapboxTokenInputProps {
  onSubmit: (token: string) => void;
}

const MapboxTokenInput: React.FC<MapboxTokenInputProps> = ({ onSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onSubmit(token.trim());
    }
  };

  return (
    <Card className="max-w-md mx-auto my-8 shadow-md">
      <CardHeader>
        <CardTitle>Mapbox API Token Required</CardTitle>
        <CardDescription>
          This application requires a Mapbox public token to display maps and search for locations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="pk.eyJ1Ijo..."
              className="font-mono text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            Get your token from the <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mapbox Dashboard</a> after creating an account.
          </div>
          <Button type="submit" disabled={!token.trim()}>
            Save Token
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MapboxTokenInput;
