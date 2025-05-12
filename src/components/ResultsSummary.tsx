
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, School, Bus } from 'lucide-react';
import { PlaceData } from './MapDisplay';

interface ResultsSummaryProps {
  places: PlaceData[];
  isLoading: boolean;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ places, isLoading }) => {
  const counts = {
    hospital: places.filter(p => p.type === 'hospital').length,
    school: places.filter(p => p.type === 'school').length,
    transport: places.filter(p => p.type === 'transport').length,
  };
  
  const totalPlaces = places.length;

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Nearby Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ) : totalPlaces > 0 ? (
          <div className="space-y-4">
            <CategoryCount 
              icon={<Hospital className="h-6 w-6 text-map-hospital" />}
              label="Hospitals"
              count={counts.hospital}
              color="bg-pink-100 text-pink-800 border-pink-200"
            />
            
            <CategoryCount 
              icon={<School className="h-6 w-6 text-map-school" />}
              label="Schools"
              count={counts.school}
              color="bg-green-100 text-green-800 border-green-200"
            />
            
            <CategoryCount 
              icon={<Bus className="h-6 w-6 text-map-transport" />}
              label="Transport"
              count={counts.transport}
              color="bg-amber-100 text-amber-800 border-amber-200"
            />
            
            <div className="text-sm text-gray-500 mt-6">
              Within 1km radius of the specified location
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>Enter an address to see nearby amenities</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface CategoryCountProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
}

const CategoryCount: React.FC<CategoryCountProps> = ({ icon, label, count, color }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg border ${color}`}>
    <div className="flex items-center space-x-3">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <div className="text-lg font-bold">{count}</div>
  </div>
);

export default ResultsSummary;
