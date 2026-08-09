import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ArrowLeft, CheckCircle2, AlertTriangle, Store, HeartHandshake } from 'lucide-react';

const kitchenIcon = L.divIcon({
  className: 'custom-map-icon kitchen-marker',
  html: `<div style="background-color: #059669; color: white; padding: 8px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; font-size: 18px; border: 2px solid white;">🏪</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const volunteerIcon = L.divIcon({
  className: 'custom-map-icon volunteer-marker',
  html: `<div style="background-color: #2563eb; color: white; padding: 8px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; font-size: 18px; border: 2px solid white;">🚗</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function SmoothRecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, map.getZoom(), { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Tracking({ activeTrackedMeal, handleMarkDelivered, setCurrentView }) {
  if (!activeTrackedMeal) return null;

  const currentStatus = activeTrackedMeal.status || (activeTrackedMeal.claimed ? 'pickup_in_progress' : 'available');

  if (currentStatus === 'delivered') {
    const savedFoodKg = (Number(activeTrackedMeal.servings) * 0.25).toFixed(1);

    return (
      <main className="page-container-narrow" style={{ marginTop: '40px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', border: '1px solid #a7f3d0', boxShadow: '0 10px 30px rgba(5,150,105,0.1)', textAlign: 'center' }}>
          
          <div style={{ background: '#ecfdf5', width: '72px', height: '72px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#059669' }}>
            <CheckCircle2 size={42} />
          </div>

          <span className="badge-veg">
            ✓ MISSION ACCOMPLISHED
          </span>

          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#111827', margin: '12px 0 6px 0' }}>
            Food Rescue Delivered!
          </h2>

          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '28px' }}>
            The surplus meal has been safely transported and handed over.
          </p>

          <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '18px', border: '1px solid #f3f4f6', marginBottom: '28px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Rescued Item:</span>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#111827' }}>{activeTrackedMeal.dish}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Quantity:</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#059669' }}>{activeTrackedMeal.servings} Servings</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Picked Up From:</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#111827' }}>{activeTrackedMeal.donor}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Delivered To:</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#059669' }}>{activeTrackedMeal.claimedBy || activeTrackedMeal.claimedby || 'Verified Shelter'}</span>
            </div>

            {activeTrackedMeal.address && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Pickup Point:</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>{activeTrackedMeal.address}</span>
              </div>
            )}

            <div style={{ borderTop: '1px dashed #e5e7eb', paddingTop: '10px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#047857' }}>Saved From Waste:</span>
              <span style={{ fontSize: '15px', fontWeight: '900', color: '#047857' }}>~{savedFoodKg} kg</span>
            </div>
          </div>

          <button onClick={() => setCurrentView('ngo_feed')} className="btn-primary">
            Back to Live Marketplace
          </button>
        </div>
      </main>
    );
  }

  const fallbackKitchenCoords = [19.1197, 72.8464];
  const volunteerLat = activeTrackedMeal.volunteerLat || activeTrackedMeal.volunteerlat;
  const volunteerLng = activeTrackedMeal.volunteerLng || activeTrackedMeal.volunteerlng;
  const volunteerCoords = (volunteerLat && volunteerLng) ? [Number(volunteerLat), Number(volunteerLng)] : [19.1235, 72.8362];

  const distanceKm = calculateDistanceKm(
    volunteerCoords[0],
    volunteerCoords[1],
    fallbackKitchenCoords[0],
    fallbackKitchenCoords[1]
  );
  const etaMinutes = Math.max(1, Math.round((distanceKm / 20) * 60));

  return (
    <main className="page-container">
      <div className="surface-card">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="badge-veg">
              ● STATUS: {currentStatus.replace(/_/g, ' ').toUpperCase()}
            </span>
            <h2 className="heading-primary" style={{ marginTop: '4px' }}>
              Pickup Tracking: {activeTrackedMeal.dish}
            </h2>
          </div>
          <button onClick={() => setCurrentView('ngo_feed')} className="btn-secondary">
            <ArrowLeft size={16} /> Back to Marketplace
          </button>
        </div>

        <div style={{ background: '#022c22', color: 'white', borderRadius: '20px', padding: '20px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#a7f3d0', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Store size={12} /> PICKUP LOCATION
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', marginTop: '4px' }}>{activeTrackedMeal.donor}</div>
            <div style={{ fontSize: '11px', color: '#d1d5db', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <MapPin size={12} /> {activeTrackedMeal.address || activeTrackedMeal.location}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: '#a7f3d0', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              EN ROUTE VOLUNTEER
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', marginTop: '4px' }}>
              {activeTrackedMeal.claimedBy || activeTrackedMeal.claimedby || 'Volunteer'}
            </div>
            {activeTrackedMeal.isSimulatedGps ? (
              <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: '800', marginTop: '2px' }}>
                ● DEMO LOCATION
              </div>
            ) : (
              <div style={{ fontSize: '10px', color: '#34d399', fontWeight: '800', marginTop: '2px' }}>
                ● LIVE GPS ACTIVE
              </div>
            )}
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#34d399', marginTop: '4px' }}>
              ~{etaMinutes} Mins ({distanceKm.toFixed(1)} km)
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: '#a7f3d0', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <HeartHandshake size={12} /> DELIVERY DESTINATION
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', marginTop: '4px', color: '#34d399' }}>
              {activeTrackedMeal.claimedBy || activeTrackedMeal.claimedby || 'Receiving Shelter'}
            </div>
            <div style={{ fontSize: '11px', color: '#d1d5db', marginTop: '2px' }}>
              Verified Organization
            </div>
          </div>
        </div>

        {activeTrackedMeal.isSimulatedGps && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '10px 16px', marginBottom: '16px', fontSize: '12px', fontWeight: '700', color: '#b45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} /> Using simulated location because browser GPS permission was unavailable or denied.
          </div>
        )}

        <div style={{ height: '380px', width: '100%', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
          <MapContainer center={volunteerCoords} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={fallbackKitchenCoords} icon={kitchenIcon}>
              <Popup><strong>Pickup: {activeTrackedMeal.donor}</strong><br />{activeTrackedMeal.address || activeTrackedMeal.location}</Popup>
            </Marker>
            <Marker position={volunteerCoords} icon={volunteerIcon}>
              <Popup><strong>Volunteer En Route</strong><br />Delivering to: {activeTrackedMeal.claimedBy || 'Shelter'}</Popup>
            </Marker>
            <SmoothRecenterMap center={volunteerCoords} />
          </MapContainer>
        </div>

        <button onClick={() => handleMarkDelivered(activeTrackedMeal.id)} className="btn-primary">
          <CheckCircle2 size={18} /> Complete Delivery & Confetti Celebration
        </button>
      </div>
    </main>
  );
}