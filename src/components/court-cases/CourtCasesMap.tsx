import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CourtCase } from '@/types/courtCase';
import { MapPin } from 'lucide-react';

// Fix for default Leaflet marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface CourtCasesMapProps {
  cases: CourtCase[];
  onCaseClick?: (courtCase: CourtCase) => void;
}

export const CourtCasesMap: React.FC<CourtCasesMapProps> = ({ cases, onCaseClick }) => {
  // Get cases with templeLocation data
  const casesWithLocation = cases.filter(c => c.templeLocation?.lat && c.templeLocation?.lng);

  // Kerala center coordinates
  const keralaCenter: [number, number] = [10.8505, 76.2711];

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer
        center={keralaCenter}
        zoom={7}
        style={{ height: '350px', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {casesWithLocation.map((courtCase) => (
          <Marker
            key={courtCase.id}
            position={[courtCase.templeLocation!.lat, courtCase.templeLocation!.lng]}
            eventHandlers={{
              click: () => onCaseClick?.(courtCase),
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-orange-600 text-sm">{courtCase.caseTitle}</h3>
                {courtCase.templeLocation?.name && (
                  <p className="text-xs text-gray-700">{courtCase.templeLocation.name}</p>
                )}
                <p className="text-xs text-gray-600 mt-1">{courtCase.caseNumber}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">
                  {courtCase.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="bg-white px-4 py-2 border-t flex items-center gap-2 text-xs text-gray-600">
        <MapPin className="h-4 w-4 text-orange-600" />
        <span>{casesWithLocation.length} of {cases.length} cases pinned on map</span>
      </div>
    </div>
  );
};
