import React, { useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function PostMeal({ newMeal, setNewMeal, userOrgName, handlePostMealSubmit }) {
  const [safetyChecklist, setSafetyChecklist] = useState({
    preparedToday: false,
    safelyStored: false,
    suitableForRedistribution: false,
    accurateWindow: false,
  });

  const handleCheckboxChange = (key) => {
    setSafetyChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isSafetyConfirmed =
    safetyChecklist.preparedToday &&
    safetyChecklist.safelyStored &&
    safetyChecklist.suitableForRedistribution &&
    safetyChecklist.accurateWindow;

  return (
    <main className="page-container-narrow">
      <div className="surface-card">
        <h2 className="heading-primary">Post Surplus Prepared Food</h2>
        <p className="subheading-muted" style={{ marginBottom: '24px' }}>
          Fill in preparation details, exact pickup address, and verify safety protocols so shelter teams can manage pickup smoothly.
        </p>

        <form onSubmit={handlePostMealSubmit}>
          <div className="form-group">
            <label>Kitchen / Establishment Name</label>
            <input 
              type="text" 
              placeholder="e.g. Northern Tadka" 
              required 
              minLength={3}
              value={newMeal.donor || userOrgName} 
              onChange={(e) => setNewMeal({ ...newMeal, donor: e.target.value })} 
            />
          </div>

          <div className="form-group">
            <label>Prepared Dish Name & Menu Details</label>
            <input 
              type="text" 
              placeholder="e.g. Paneer Butter Masala & Fresh Naan" 
              required 
              minLength={3}
              value={newMeal.dish} 
              onChange={(e) => setNewMeal({ ...newMeal, dish: e.target.value })} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label>Dietary Category</label>
              <select value={newMeal.dietType} onChange={(e) => setNewMeal({ ...newMeal, dietType: e.target.value })}>
                <option value="Veg">🟢 Pure Vegetarian</option>
                <option value="Non-Veg">🔴 Non-Vegetarian</option>
              </select>
            </div>
            <div className="form-group">
              <label>Portion Count (Servings)</label>
              <input 
                type="number" 
                placeholder="e.g. 50" 
                required 
                min="1"
                value={newMeal.servings} 
                onChange={(e) => setNewMeal({ ...newMeal, servings: e.target.value })} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label>Region / Area</label>
              <select value={newMeal.location} onChange={(e) => setNewMeal({ ...newMeal, location: e.target.value })}>
                <option value="Andheri West">Andheri West</option>
                <option value="Bandra East">Bandra East</option>
                <option value="Juhu">Juhu</option>
                <option value="Andheri East">Andheri East</option>
                <option value="Malad West">Malad West</option>
              </select>
            </div>
            <div className="form-group">
              <label>Packaging & Container Type</label>
              <select value={newMeal.packagingType} onChange={(e) => setNewMeal({ ...newMeal, packagingType: e.target.value })}>
                <option value="Disposable Containers">Disposable Box Packaging</option>
                <option value="Large Metal Handi (Bring Containers)">Large Metal Handi (Bring Own Vessels)</option>
                <option value="Packed Trays">Sealed Food Trays</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Exact Pickup Address</label>
            <input 
              type="text" 
              placeholder="e.g. Shop 12, Link Road, Near Andheri Metro Station" 
              required 
              minLength={5}
              value={newMeal.address} 
              onChange={(e) => setNewMeal({ ...newMeal, address: e.target.value })} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label>Contact Person Name</label>
              <input 
                type="text" 
                placeholder="e.g. Rahul Sharma" 
                required 
                value={newMeal.contactPerson} 
                onChange={(e) => setNewMeal({ ...newMeal, contactPerson: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Pickup Contact Phone (10 digits)</label>
              <input 
                type="tel" 
                placeholder="e.g. 9876543210" 
                required 
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                value={newMeal.contactPhone} 
                onChange={(e) => setNewMeal({ ...newMeal, contactPhone: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Remaining Consumption Window</label>
            <select value={newMeal.expiryHours} onChange={(e) => setNewMeal({ ...newMeal, expiryHours: e.target.value })}>
              <option value="1">1 Hour (Urgent Dispatch)</option>
              <option value="2">2 Hours</option>
              <option value="3">3 Hours</option>
              <option value="4">4 Hours</option>
            </select>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '18px', padding: '20px', marginTop: '10px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', marginBottom: '12px' }}>
              <ShieldCheck size={20} />
              <h4 style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>Mandatory Food Safety Declaration</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#374151' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600' }}>
                <input 
                  type="checkbox" 
                  checked={safetyChecklist.preparedToday} 
                  onChange={() => handleCheckboxChange('preparedToday')}
                  style={{ width: '16px', height: '16px', accentColor: '#059669', cursor: 'pointer' }}
                />
                Food was freshly prepared today
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600' }}>
                <input 
                  type="checkbox" 
                  checked={safetyChecklist.safelyStored} 
                  onChange={() => handleCheckboxChange('safelyStored')}
                  style={{ width: '16px', height: '16px', accentColor: '#059669', cursor: 'pointer' }}
                />
                Food has been stored in clean, safe temperature conditions
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600' }}>
                <input 
                  type="checkbox" 
                  checked={safetyChecklist.suitableForRedistribution} 
                  onChange={() => handleCheckboxChange('suitableForRedistribution')}
                  style={{ width: '16px', height: '16px', accentColor: '#059669', cursor: 'pointer' }}
                />
                Food is fully suitable for immediate shelter consumption
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600' }}>
                <input 
                  type="checkbox" 
                  checked={safetyChecklist.accurateWindow} 
                  onChange={() => handleCheckboxChange('accurateWindow')}
                  style={{ width: '16px', height: '16px', accentColor: '#059669', cursor: 'pointer' }}
                />
                Selected consumption window accurately reflects meal freshness
              </label>
            </div>

            {!isSafetyConfirmed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#b45309', fontWeight: '700', marginTop: '12px' }}>
                <AlertCircle size={14} /> Please check all safety boxes to enable meal publishing.
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!isSafetyConfirmed}
            style={{ 
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              fontWeight: '900',
              fontSize: '14px',
              cursor: isSafetyConfirmed ? 'pointer' : 'not-allowed',
              background: isSafetyConfirmed ? '#059669' : '#9ca3af',
              color: 'white',
              transition: 'all 0.2s ease'
            }}
          >
            🚀 Publish Surplus Meal
          </button>
        </form>
      </div>
    </main>
  );
}