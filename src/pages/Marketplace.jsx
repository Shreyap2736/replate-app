import React from 'react';
import { Search, MapPin, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function Marketplace({
  isLoggedIn,
  userRole,
  userOrgName,
  userLocation,
  searchQuery,
  setSearchQuery,
  selectedDietFilter,
  setSelectedDietFilter,
  selectedAreaFilter,
  setSelectedAreaFilter,
  sortedListings,
  handleClaimMeal,
  handleStartGPSBroadcast,
  setActiveTrackedMeal,
  setCurrentView,
  displayNgoList,
}) {
  return (
    <main className="page-container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        
        {/* LEFT COLUMN: SURPLUS MARKETPLACE FEED */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 className="heading-primary">Live Surplus Food Marketplace</h2>
            <p className="subheading-muted">
              Fresh surplus meals available for immediate shelter rescue across Mumbai.
            </p>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="filter-bar-container">
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search dish or kitchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
              />
            </div>

            <select
              value={selectedDietFilter}
              onChange={(e) => setSelectedDietFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white' }}
            >
              <option value="All">All Dietary Types</option>
              <option value="Veg">🟢 Veg Only</option>
              <option value="Non-Veg">🔴 Non-Veg Only</option>
            </select>

            <select
              value={selectedAreaFilter}
              onChange={(e) => setSelectedAreaFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white' }}
            >
              <option value="All">All Regions</option>
              <option value="Andheri West">Andheri West</option>
              <option value="Bandra East">Bandra East</option>
              <option value="Juhu">Juhu</option>
              <option value="Andheri East">Andheri East</option>
              <option value="Malad West">Malad West</option>
            </select>
          </div>

          {/* MEAL CARDS FEED */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sortedListings.length === 0 ? (
              <div className="surface-card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <p style={{ fontWeight: '700', fontSize: '15px' }}>No active surplus meals match your search filter.</p>
              </div>
            ) : (
              sortedListings.map((meal) => {
                const dietTypeVal = meal.dietType || meal.diettype || 'Veg';
                const isClaimed = meal.claimed || meal.status === 'claimed' || meal.status === 'pickup_in_progress' || meal.status === 'delivered';
                const claimedByName = meal.claimedBy || meal.claimedby;

                // AUTHORIZATION CHECKS FOR TRACKING BUTTON VISIBILITY
                const isMyPostedMeal = isLoggedIn && userOrgName && (meal.donor?.toLowerCase() === userOrgName.toLowerCase());
                const isMyClaimedMeal = isLoggedIn && userOrgName && (claimedByName?.toLowerCase() === userOrgName.toLowerCase());
                const isAuthorizedToTrack = isMyPostedMeal || isMyClaimedMeal;

                return (
                  <div key={meal.id} className="card-base" style={{ border: isClaimed ? '1px solid #e2e8f0' : '1px solid #a7f3d0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <span className={dietTypeVal === 'Veg' ? 'badge-veg' : 'badge-non-veg'}>
                          {dietTypeVal === 'Veg' ? '🟢 Pure Veg' : '🔴 Non-Veg'}
                        </span>
                        <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#111827', margin: '6px 0 2px 0' }}>
                          {meal.dish}
                        </h3>
                        <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <span><strong>Prepared By:</strong> {meal.donor}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} color="#059669" /> {meal.location}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: '#059669' }}>
                          {meal.servings} Servings
                        </span>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                          <Clock size={12} /> {meal.postedTime || 'Freshly Logged'}
                        </div>
                      </div>
                    </div>

                    {/* ADDRESS, CONTACT & PACKAGING INFO */}
                    <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', color: '#334155', marginBottom: '14px', border: '1px solid #f1f5f9' }}>
                      {meal.address && (
                        <div style={{ marginBottom: '4px' }}>
                          <strong>Pickup Address:</strong> {meal.address}
                        </div>
                      )}
                      <div><strong>Packaging:</strong> {meal.packagingType || meal.packagingtype || 'Disposable Box Packaging'}</div>
                      {meal.contactPerson && (
                        <div style={{ marginTop: '4px', color: '#047857', fontWeight: '700' }}>
                          📞 Contact: {meal.contactPerson} ({meal.contactPhone})
                        </div>
                      )}
                    </div>

                    {/* ACTION & AUTHORIZED TRACKING BUTTONS */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {!isClaimed ? (
                        userRole === 'donor' ? (
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', background: '#f1f5f9', padding: '10px 14px', borderRadius: '12px', width: '100%', textAlign: 'center' }}>
                            🔒 Claiming Reserved for Verified NGOs & Volunteers
                          </div>
                        ) : (
                          <button
                            onClick={() => handleClaimMeal(meal.id)}
                            className="btn-primary"
                          >
                            <ShieldCheck size={16} /> Reserve & Claim Meal
                          </button>
                        )
                      ) : (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontSize: '12px', fontWeight: '800', color: '#047857', background: '#ecfdf5', padding: '8px 12px', borderRadius: '10px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>✓ Reserved by: <strong>{claimedByName || 'Verified Partner'}</strong></span>
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#059669' }}>
                              ● {meal.status?.replace(/_/g, ' ') || 'CLAIMED'}
                            </span>
                          </div>

                          {/* STRICT AUTHORIZATION GUARD FOR LIVE TRACKING BUTTON */}
                          {isAuthorizedToTrack && meal.status !== 'delivered' && (
                            <button
                              onClick={() => {
                                setActiveTrackedMeal(meal);
                                handleStartGPSBroadcast(meal);
                              }}
                              style={{
                                width: '100%',
                                background: '#2563eb',
                                color: 'white',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '12px',
                                fontWeight: '800',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                            >
                              <Truck size={16} /> 📡 TRACK ARRIVING VOLUNTEER LIVE
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTERED NGO DIRECTORY */}
        <div>
          <div className="surface-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🛡️ Active Shelter Network
            </h3>
            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>
              Verified shelters actively receiving surplus food in your area.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {displayNgoList.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No registered shelters found.</div>
              ) : (
                displayNgoList.map((ngo) => (
                  <div
                    key={ngo.id}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: ngo.isCurrentUser ? '#ecfdf5' : '#f8fafc',
                      border: ngo.isCurrentUser ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                      {ngo.name} {ngo.isCurrentUser && <span style={{ color: '#059669', fontSize: '11px' }}>(You)</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>📍 {ngo.location}</span>
                      <span style={{ color: '#059669', fontWeight: '700' }}>● {ngo.status || 'Active'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}