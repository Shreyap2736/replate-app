import React, { useState } from 'react';
import { User, LogOut, HeartHandshake, Plus, Menu, X } from 'lucide-react';

export default function Navbar({
  userRole,
  isLoggedIn,
  userOrgName,
  userLocation,
  handleLogout,
  setCurrentView,
  handleDonateClick,
  setModalType,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (viewName) => {
    setCurrentView(viewName);
    setIsMobileMenuOpen(false);
  };

  const handleDonateMobile = () => {
    handleDonateClick();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => handleNavClick('landing')}>
        <img src="/replate-logo.png" alt="RePlate Logo" className="logo-img" />
        <span className="logo-text">RePlate</span>
      </div>

      <ul className="nav-links desktop-only">
        <li onClick={() => handleNavClick('landing')} style={{ cursor: 'pointer' }}>Home</li>
        {userRole !== 'receiver' && (
          <li onClick={handleDonateMobile} style={{ cursor: 'pointer' }}>Donate Food</li>
        )}
        <li onClick={() => handleNavClick('ngo_feed')} style={{ cursor: 'pointer' }}>Live Food Feed</li>
        <li onClick={() => handleNavClick('impact')} style={{ cursor: 'pointer' }}>Our Impact</li>
      </ul>

      <div className="nav-right desktop-only">
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669', background: '#ecfdf5', padding: '6px 14px', borderRadius: '20px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} /> {userOrgName} {userLocation ? `(${userLocation})` : ''}
            </span>
            <button className="btn-logout" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <>
            <button className="btn-login-text" onClick={() => setModalType('receiver')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HeartHandshake size={16} /> Claim Meals (NGO & Volunteers)
            </button>
            <button className="btn-donate" onClick={() => setModalType('donor')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Post Surplus Meal
            </button>
          </>
        )}
      </div>

      <button 
        className="mobile-hamburger-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
        style={{
          background: 'none',
          border: 'none',
          color: '#111827',
          cursor: 'pointer',
          padding: '8px',
          display: 'none'
        }}
      >
        {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {isMobileMenuOpen && (
        <div 
          className="mobile-dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {isLoggedIn && (
            <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0', fontSize: '13px', fontWeight: '800', color: '#047857', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} /> {userOrgName} {userLocation ? `(${userLocation})` : ''}
            </div>
          )}

          <div onClick={() => handleNavClick('landing')} style={{ fontSize: '15px', fontWeight: '700', color: '#111827', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}>
            Home
          </div>

          <div onClick={() => handleNavClick('ngo_feed')} style={{ fontSize: '15px', fontWeight: '700', color: '#111827', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}>
            Live Surplus Feed
          </div>

          {userRole !== 'receiver' && (
            <div onClick={handleDonateMobile} style={{ fontSize: '15px', fontWeight: '700', color: '#059669', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}>
              + Donate Food
            </div>
          )}

          <div onClick={() => handleNavClick('impact')} style={{ fontSize: '15px', fontWeight: '700', color: '#111827', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}>
            Our Impact
          </div>

          {isLoggedIn ? (
            <button 
              onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '12px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <button 
                onClick={() => { setModalType('receiver'); setIsMobileMenuOpen(false); }}
                style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <HeartHandshake size={16} /> Claim Meals (NGO & Volunteers)
              </button>
              
              <button 
                onClick={() => { setModalType('donor'); setIsMobileMenuOpen(false); }}
                style={{ background: '#059669', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Plus size={16} /> Post Surplus Meal
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}