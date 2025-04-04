import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Create map
      const map = L.map(mapRef.current).setView([51.505, -0.09], 13);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add marker for ECODATA CIC office (example location)
      L.marker([51.505, -0.09])
        .addTo(map)
        .bindPopup('ECODATA CIC<br>123 Sustainable Street')
        .openPopup();
      
      mapInstanceRef.current = map;
      
      // Resize handler to ensure map displays correctly
      const handleResize = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      // Clean up on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  return (
    <div ref={mapRef} className="w-full h-full"></div>
  );
};

export default Map;
