
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, School, Bus, Calculator } from 'lucide-react';
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

  // Calculate QAP score based on proximity to services
  const qapScore = useMemo(() => {
    if (totalPlaces === 0) return null;

    // Define max points for each category
    const maxPoints = {
      affordabilityTargeting: 40,
      developerExperience: 20,
      locationProximity: 30,
      energyEfficiency: 20,
      tenantServices: 25,
      costEfficiency: 15,
      projectReadiness: 20,
      otherStatePriorities: 30
    };

    // Total possible points
    const totalMaxPoints = Object.values(maxPoints).reduce((sum, val) => sum + val, 0);

    // Calculate location proximity score based on nearby places
    // More places = higher score, up to the max for that category
    const locationScore = Math.min(
      maxPoints.locationProximity,
      Math.floor((counts.hospital * 4 + counts.school * 3 + counts.transport * 3) * 1.5)
    );

    // For demo purposes, we'll use fixed values for other categories
    const demoScores = {
      affordabilityTargeting: Math.round(maxPoints.affordabilityTargeting * 0.85),
      developerExperience: Math.round(maxPoints.developerExperience * 0.9),
      locationProximity: locationScore,
      energyEfficiency: Math.round(maxPoints.energyEfficiency * 0.7),
      tenantServices: Math.round(maxPoints.tenantServices * 0.8),
      costEfficiency: Math.round(maxPoints.costEfficiency * 0.75),
      projectReadiness: Math.round(maxPoints.projectReadiness * 0.85),
      otherStatePriorities: Math.round(maxPoints.otherStatePriorities * 0.65)
    };

    // Calculate total score
    const totalScore = Object.values(demoScores).reduce((sum, val) => sum + val, 0);

    // Calculate percentage
    const percentageScore = Math.round((totalScore / totalMaxPoints) * 100);

    return {
      scores: demoScores,
      totalScore,
      totalMaxPoints,
      percentageScore
    };
  }, [counts, totalPlaces]);

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
            
            {qapScore && (
              <QAPScoreCard qapScore={qapScore} />
            )}
            
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

interface QAPScoreCardProps {
  qapScore: {
    scores: Record<string, number>;
    totalScore: number;
    totalMaxPoints: number;
    percentageScore: number;
  };
}

const QAPScoreCard: React.FC<QAPScoreCardProps> = ({ qapScore }) => {
  const { scores, totalScore, totalMaxPoints, percentageScore } = qapScore;
  
  // Determine color based on score
  let scoreColor = "text-red-500";
  if (percentageScore >= 80) {
    scoreColor = "text-green-600";
  } else if (percentageScore >= 65) {
    scoreColor = "text-amber-500";
  }
  
  return (
    <Card className="mt-4 border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          QAP Score Calculation
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-semibold">Criteria</div>
            <div className="font-semibold text-right">Score</div>
            
            {Object.entries(scores).map(([key, value]) => {
              const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              const maxValue = {
                'Affordability Targeting': 40,
                'Developer Experience': 20,
                'Location Proximity': 30,
                'Energy Efficiency': 20,
                'Tenant Services': 25,
                'Cost Efficiency': 15,
                'Project Readiness': 20,
                'Other State Priorities': 30
              }[formattedKey];
              
              return (
                <React.Fragment key={key}>
                  <div>{formattedKey}</div>
                  <div className="text-right">{value}/{maxValue}</div>
                </React.Fragment>
              );
            })}
            
            <div className="border-t pt-1 font-semibold">Total</div>
            <div className="border-t pt-1 font-semibold text-right">{totalScore}/{totalMaxPoints}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="font-medium">Calculation:</div>
            <div className="font-mono text-sm mt-1">
              Score % = ({totalScore} / {totalMaxPoints}) × 100 = <span className={scoreColor}>{percentageScore}%</span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              The higher the percentage, the more likely the project is to receive credits—unless there are set-asides, tie-breakers, or geographic limits.
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-1">
            The Qualified Allocation Plan (QAP) is a document created by each state to set criteria for awarding LIHTC credits to housing developments.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsSummary;
