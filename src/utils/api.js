const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://resqai-backend.onrender.com';

const OFFLINE_GUIDANCE = {
  Medical: '• Keep the person calm and still.\n• Check for breathing and pulse.\n• Apply pressure to any bleeding wound.\n• Do not give food or water.\n• Call 112 immediately.',
  Fire: '• Evacuate immediately. Leave everything.\n• Stay low to avoid smoke inhalation.\n• Close doors to slow fire spread.\n• Call fire brigade (101) from outside.',
  Crime: '• Move to a safe location immediately.\n• Do not confront the suspect.\n• Note vehicle/person description.\n• Call police (100) when safe.',
  Accident: '• Do not move injured persons unless in danger.\n• Turn off vehicle ignition if possible.\n• Apply pressure to wounds.\n• Call ambulance (108) immediately.',
  Disaster: '• Move to higher ground immediately.\n• Follow evacuation instructions.\n• Avoid downed power lines.\n• Call NDRF (011-24363260).',
  'Women Safety': '• Move to a crowded, well-lit area.\n• Call Womens Helpline: 1091.\n• Share location with trusted contact.\n• Make noise to attract attention if threatened.',
  'Child Emergency': '• Stay with the child, keep them calm.\n• Do not leave the child alone.\n• Call Childline: 1098.\n• Note last known location.',
};

export const classifyEmergency = async (text, location) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, location }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    const lower = text.toLowerCase();
    let emergencyType = 'Medical';
    if (lower.includes('fire') || lower.includes('burn')) emergencyType = 'Fire';
    else if (lower.includes('crime') || lower.includes('theft') || lower.includes('attack')) emergencyType = 'Crime';
    else if (lower.includes('accident') || lower.includes('crash') || lower.includes('car')) emergencyType = 'Accident';
    else if (lower.includes('flood') || lower.includes('earthquake') || lower.includes('disaster')) emergencyType = 'Disaster';
    else if (lower.includes('women') || lower.includes('girl') || lower.includes('harass')) emergencyType = 'Women Safety';
    else if (lower.includes('child') || lower.includes('baby') || lower.includes('kid')) emergencyType = 'Child Emergency';
    return {
      emergencyType,
      confidence: 75,
      locationReceived: !!location,
      guidance: OFFLINE_GUIDANCE[emergencyType] || OFFLINE_GUIDANCE.Medical,
      severity: 'High',
      offline: true,
    };
  }
};

export const getNearbyServices = async (lat, lon) => {
  const query = `[out:json][timeout:20];
(node["amenity"="hospital"](around:6000,${lat},${lon});
way["amenity"="hospital"](around:6000,${lat},${lon});
node["amenity"="clinic"](around:6000,${lat},${lon});
node["amenity"="police"](around:6000,${lat},${lon});
way["amenity"="police"](around:6000,${lat},${lon});
node["amenity"="fire_station"](around:6000,${lat},${lon});
way["amenity"="fire_station"](around:6000,${lat},${lon}););
out center;`;
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    return (data.elements || [])
      .filter((el) => el.tags?.name)
      .map((el) => ({
        id: el.id,
        name: el.tags.name,
        type: el.tags.amenity,
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
        distance: calculateDistance(lat, lon, el.lat || el.center?.lat, el.lon || el.center?.lon),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20);
  } catch {
    return [];
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
