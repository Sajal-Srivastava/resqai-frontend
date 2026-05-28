import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const sosIcon = new L.DivIcon({
  className: '',
  html: '<div style="width:32px;height:32px;background:#EF4444;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 0 4px rgba(239,68,68,0.3)">📍</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const serviceIcon = (type) => new L.DivIcon({
  className: '',
  html: `<div style="width:28px;height:28px;background:${type==='hospital'?'#EF4444':type==='police'?'#1D4ED8':'#F97316'};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${type==='hospital'?'🏥':type==='police'?'🚔':'🚒'}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function LiveMap({ location, services = [], height = 280 }) {
  if (!location) {
    return (
      <div style={{ height, background: 'var(--bg-card)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 32 }}>📍</span>
        <p style={{ color: 'var(--t-muted)', fontSize: 14 }}>Location not available</p>
      </div>
    );
  }
  return (
    <div className="map-container" style={{ height }}>
      <MapContainer center={[location.lat, location.lon]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
        <Marker position={[location.lat, location.lon]} icon={sosIcon}>
          <Popup>📍 Your Location</Popup>
        </Marker>
        <Circle center={[location.lat, location.lon]} radius={location.accuracy || 50} color="#EF4444" fillOpacity={0.08} />
        {services.map((s) => s.lat && s.lon && (
          <Marker key={s.id} position={[s.lat, s.lon]} icon={serviceIcon(s.type)}>
            <Popup>{s.name}<br />{s.distance ? `${s.distance.toFixed(1)} km away` : ''}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
