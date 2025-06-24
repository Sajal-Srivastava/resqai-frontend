// components/EmergencyMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issues with Webpack
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const EmergencyMap = ({ location }) => {
  if (!location?.lat || !location?.lon) return null;

  return (
    <div style={{ height: '300px', marginTop: '1rem', borderRadius: '10px', overflow: 'hidden' }}>
      <MapContainer center={[location.lat, location.lon]} zoom={13} style={{ height: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lon]}>
          <Popup>
            📍 This is your detected location.
          </Popup>
        </Marker>
      </MapContainer>

      <div style={{ marginTop: '8px', textAlign: 'center' }}>
        <a
          href={`https://maps.google.com/?q=${location.lat},${location.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#ff6600', textDecoration: 'underline' }}
        >
          🔗 View in Google Maps
        </a>
      </div>
    </div>
  );
};

export default EmergencyMap;
