import React from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

interface Location {
  id: number;
  lat: number;
  lng: number;
  name: string;
  value: number;
  description?: string;
}

interface MapWithHeatmapProps {
  locations: Location[];
  title?: string;
  subtitle?: string;
  className?: string;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  height?: string;
}

const MapWithHeatmap: React.FC<MapWithHeatmapProps> = ({
  locations,
  title,
  subtitle,
  className = '',
  centerLat = 54.5, // Default center on UK
  centerLng = -2,
  zoom = 6,
  height = '400px'
}) => {
  // Function to determine the radius and intensity of the heat circle based on value
  const getCircleProperties = (value: number) => {
    // Find max value for normalization
    const maxValue = Math.max(...locations.map(loc => loc.value));
    
    // Normalize between 10 and 30 for radius
    const radius = 10 + (value / maxValue) * 20;
    
    // Opacity between 0.4 and 0.8
    const fillOpacity = 0.4 + (value / maxValue) * 0.4;
    
    return { radius, fillOpacity };
  };
  
  // Custom icon for markers
  const markerIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  return (
    <motion.div 
      className={`bg-card rounded-xl p-4 shadow-sm border ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && <h3 className="font-bold text-lg mb-1">{title}</h3>}
      {subtitle && <p className="text-muted-foreground text-sm mb-4">{subtitle}</p>}
      
      <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden">
        <MapContainer 
          center={[centerLat, centerLng]}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {locations.map(location => {
            const { radius, fillOpacity } = getCircleProperties(location.value);
            
            return (
              <React.Fragment key={location.id}>
                {/* Heat circle */}
                <CircleMarker
                  center={[location.lat, location.lng]}
                  radius={radius}
                  fillColor="#2A9D8F"
                  color="#2A9D8F"
                  weight={1}
                  fillOpacity={fillOpacity}
                />
                
                {/* Marker with popup */}
                <Marker 
                  position={[location.lat, location.lng]}
                  icon={markerIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold text-base">{location.name}</h3>
                      <p className="text-sm text-primary font-medium">{location.value} sessions</p>
                      {location.description && (
                        <p className="text-sm mt-1">{location.description}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
      
      <div className="mt-3 flex justify-between items-center px-2 text-xs text-muted-foreground">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-primary/30 mr-1"></div>
          <span>Fewer sessions</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-primary/90 mr-1"></div>
          <span>More sessions</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MapWithHeatmap;