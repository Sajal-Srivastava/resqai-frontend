import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { useLocation } from '../hooks/useLocation';
import { getNearbyServices } from '../utils/api';
import LiveMap from '../components/emergency/LiveMap';
import NearbyServices from '../components/emergency/NearbyServices';

export default function NearbyServicesScreen() {
  const { state, dispatch, toast } = useApp();
  const t = useT(state.language);
  const { requestLocation, loading: locLoading } = useLocation();
  const [searching, setSearching] = useState(false);

  const fetchServices = async (loc) => {
    setSearching(true);
    try {
      const services = await getNearbyServices(loc.lat, loc.lon);
      dispatch({ type: 'SET_NEARBY', payload: services });
      if (services.length === 0) toast('No services found nearby. Try a larger area.', 'warning');
      else toast(`Found ${services.length} nearby services`, 'success');
    } catch {
      toast('Failed to load nearby services', 'error');
    }
    setSearching(false);
  };

  const handleLocate = async () => {
    try {
      const loc = await requestLocation();
      dispatch({ type: 'SET_LOCATION', payload: loc });
      await fetchServices(loc);
    } catch {
      toast('Could not get your location. Please enable location permissions.', 'error');
    }
  };

  useEffect(() => {
    if (state.location && state.nearbyServices.length === 0) {
      fetchServices(state.location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="screen">
      <div style={{ marginBottom: 'var(--sp-4)' }}>
        <p className="page-title">🗺️ {t.nearbyServices}</p>
        <p className="page-subtitle">Hospitals, police stations & fire departments near you</p>
      </div>

      {/* Map */}
      <LiveMap location={state.location} services={state.nearbyServices} height={260} />

      {/* Location Button */}
      <div style={{ marginTop: 'var(--sp-3)', display: 'flex', gap: 'var(--sp-3)' }}>
        <button className="btn btn-primary" onClick={handleLocate} disabled={locLoading || searching}>
          {locLoading || searching ? '🔄 Searching...' : '📍 Find Nearby Services'}
        </button>
      </div>

      {/* Location Info */}
      {state.location && (
        <div className="card mt-3" style={{ flexDirection: 'row', display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
          <span style={{ fontSize: 24 }}>📍</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t-primary)' }}>Location Active</p>
            <p style={{ fontSize: 12, color: 'var(--t-muted)' }}>
              {state.location.lat.toFixed(4)}, {state.location.lon.toFixed(4)}
              {state.location.accuracy && ` · ±${Math.round(state.location.accuracy)}m accuracy`}
            </p>
          </div>
        </div>
      )}

      <div className="divider mt-4 mb-4" />

      {/* Services List */}
      <NearbyServices services={state.nearbyServices} loading={searching} />

      {/* Manual emergency numbers if no location */}
      {!state.location && !searching && (
        <div className="mt-4">
          <p className="section-label mb-3">Default Emergency Numbers</p>
          {[
            { icon: '🏥', name: 'Ambulance (EMRI)', phone: '108', type: 'hospital', distance: 0 },
            { icon: '🚔', name: 'Police Control Room', phone: '100', type: 'police', distance: 0 },
            { icon: '🚒', name: 'Fire Brigade', phone: '101', type: 'fire_station', distance: 0 },
          ].map((s) => (
            <div key={s.phone} className="service-item" style={{ marginBottom: 8 }}>
              <div className="service-icon-wrap" style={{ background: 'rgba(239,68,68,0.1)' }}>{s.icon}</div>
              <div className="service-info">
                <p className="service-name">{s.name}</p>
                <p className="service-dist">National · Free call</p>
              </div>
              <a href={`tel:${s.phone}`} className="service-call-btn">📞</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
