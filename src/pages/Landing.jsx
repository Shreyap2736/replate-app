import React from 'react';
import { Radio, ShieldCheck } from 'lucide-react';

export default function Landing({
  surplusListings,
  foodItems,
  currentIndex,
  handlePrev,
  handleNext,
  setCurrentIndex,
  getItemClass,
}) {
  const livePostActivities = surplusListings.slice(0, 3);
  const liveClaimActivities = surplusListings.filter((m) => m.claimed).slice(0, 3);
  const activeItem = foodItems[currentIndex];

  return (
    <>
      <section className="header-section">
        <h1 className="header-punchline">
          Don't let good meals go to waste. <span>RePlate them today for a better tomorrow.</span>
        </h1>
      </section>

      <div className="dashboard-grid">
        <aside className="dashboard-panel">
          <div className="stat-box-container">
            <div className="stat-card">
              <p className="stat-number">{surplusListings.length + 850}+</p>
              <p className="stat-label">Meals Rescued</p>
            </div>
            <div className="stat-card">
              <p className="stat-number">38</p>
              <p className="stat-label">Shelters Served</p>
            </div>
          </div>

          <div className="activity-card" style={{ marginBottom: '14px' }}>
            <div className="activity-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} color="#059669" /> Live Post Activity
              </span>
              <span style={{ fontSize: '10px', color: '#059669', fontWeight: '800' }}>● REALTIME</span>
            </div>
            {livePostActivities.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#6b7280', padding: '6px 0' }}>No recent postings logged yet.</div>
            ) : (
              livePostActivities.map((meal) => (
                <div key={meal.id} className="feed-item">
                  <span className="feed-ngo">{meal.donor}</span> posted {meal.servings} servings of {meal.dish} at {meal.location}.
                </div>
              ))
            )}
          </div>

          <div className="activity-card">
            <div className="activity-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#059669" /> Live Claim Activity
              </span>
              <span style={{ fontSize: '10px', color: '#059669', fontWeight: '800' }}>● REALTIME</span>
            </div>
            {liveClaimActivities.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#6b7280', padding: '6px 0' }}>No meals claimed yet. Log in as NGO to claim!</div>
            ) : (
              liveClaimActivities.map((meal) => (
                <div key={meal.id} className="feed-item">
                  <span className="feed-ngo">{meal.claimedBy || meal.claimedby || 'Verified NGO'}</span> claimed {meal.servings} servings of {meal.dish}.
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="carousel-panel">
          <section className="arc-carousel-stage">
            <button className="nav-arrow left" onClick={handlePrev}>←</button>
            <div className="arc-track">
              {foodItems.map((item, index) => (
                <div key={item.id} className={getItemClass(index)} onClick={() => setCurrentIndex(index)}>
                  <img src={item.image} alt={item.name} />
                </div>
              ))}
            </div>
            <button className="nav-arrow right" onClick={handleNext}>→</button>
          </section>

          <section className="lower-info-stack">
            <div className="dish-title-badge">{activeItem.name}</div>
            <p className="category-tag">{activeItem.category}</p>
            <div className="benefit-bar">
              <div>🧪 <strong>Nutrients:</strong> <span style={{ color: '#059669' }}>{activeItem.nutrients}</span></div>
              <div style={{ color: '#d1d5db' }}>|</div>
              <div>💡 <strong>Benefits:</strong> {activeItem.benefits}</div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}