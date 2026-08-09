import React from 'react';
import { ShieldCheck, Utensils, HeartHandshake, Leaf } from 'lucide-react';

export default function Impact({ surplusListings = [], setCurrentView }) {
  const claimedMealsList = surplusListings.filter(
    (m) => m.claimed || m.status === 'delivered' || m.status === 'claimed' || m.status === 'pickup_in_progress'
  );
  const mealsRescuedCount = claimedMealsList.length;

  const totalServingsRedistributed = claimedMealsList.reduce(
    (acc, m) => acc + (Number(m.servings) || 0),
    0
  );

  const foodSavedKg = Math.round(totalServingsRedistributed * 0.4);

  const uniqueDonors = new Set(
    surplusListings.map((m) => m.donor?.trim().toLowerCase()).filter(Boolean)
  );
  const uniqueShelters = new Set(
    claimedMealsList.map((m) => (m.claimedBy || m.claimedby)?.trim().toLowerCase()).filter(Boolean)
  );
  
  const activePartnersCount = new Set([...uniqueDonors, ...uniqueShelters]).size;

  return (
    <main className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#111827' }}>RePlate Impact & ESG Portal</h2>
          <p className="subheading-muted">
            Live ESG analytics calculated directly from verified database food rescue transactions.
          </p>
        </div>
        <button onClick={() => setCurrentView('landing')} className="btn-secondary">
          ← Back to Home
        </button>
      </div>

      <section className="surface-card">
        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#047857', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🌱 Verified Community Impact
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#f6f8f6', padding: '24px', borderRadius: '18px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '8px' }}>
              <ShieldCheck size={20} />
              <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#374151' }}>Meals Rescued</span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#059669' }}>{mealsRescuedCount.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Active listings claimed & delivered</div>
          </div>

          <div style={{ background: '#f6f8f6', padding: '24px', borderRadius: '18px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '8px' }}>
              <Utensils size={20} />
              <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#374151' }}>Servings Redistributed</span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#059669' }}>{totalServingsRedistributed.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Portions allocated to local shelters</div>
          </div>

          <div style={{ background: '#ecfdf5', padding: '24px', borderRadius: '18px', border: '1px solid #a7f3d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', marginBottom: '8px' }}>
              <Leaf size={20} />
              <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#047857' }}>Food Diverted</span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#047857' }}>{foodSavedKg.toLocaleString()} kg</div>
            <div style={{ fontSize: '11px', color: '#047857', fontWeight: '700', marginTop: '4px' }}>
              Landfill waste prevented
            </div>
            <div style={{ fontSize: '10px', color: '#059669', marginTop: '6px', fontStyle: 'italic' }}>
              * Estimated using an average serving weight of 400g (0.4 kg).
            </div>
          </div>

          <div style={{ background: '#f6f8f6', padding: '24px', borderRadius: '18px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '8px' }}>
              <HeartHandshake size={20} />
              <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#374151' }}>Active Partners</span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#059669' }}>{activePartnersCount}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Unique donors & verified shelters</div>
          </div>
        </div>
      </section>
    </main>
  );
}