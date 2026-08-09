import React from 'react';
import { X } from 'lucide-react';

export default function Modal({
  modalType,
  setModalType,
  handleRoleSelect,
  selectedRole,
  loginForm,
  setLoginForm,
  handleLoginSubmit,
}) {
  if (!modalType) return null;

  return (
    <div className="modal-overlay" onClick={() => setModalType(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setModalType(null)}>
          <X size={18} />
        </button>

        {/* 1. DONOR ROLE SELECTION */}
        {modalType === 'donor' && (
          <div>
            <h3 className="heading-primary" style={{ fontSize: '20px' }}>Post Surplus Food</h3>
            <p className="subheading-muted" style={{ marginBottom: '16px' }}>
              Select your business type to proceed to login.
            </p>

            <div
              className="role-option-card"
              onClick={() => handleRoleSelect('Commercial Business Owner', 'donor')}
            >
              <div className="role-icon-box">🏪</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800' }}>Commercial Business Owner</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Restaurants, Caterers & Hotels</div>
              </div>
            </div>

            <div
              className="role-option-card"
              onClick={() => handleRoleSelect('Event Organizer', 'donor')}
            >
              <div className="role-icon-box">🎉</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800' }}>Event Organizer</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Private events & weddings</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. RECEIVER ROLE SELECTION */}
        {modalType === 'receiver' && (
          <div>
            <h3 className="heading-primary" style={{ fontSize: '20px' }}>Claim Surplus Meals</h3>
            <p className="subheading-muted" style={{ marginBottom: '16px' }}>
              Select your organization type to proceed to login.
            </p>

            <div
              className="role-option-card"
              onClick={() => handleRoleSelect('Verified Shelter Partner', 'receiver')}
            >
              <div className="role-icon-box">🛡️</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800' }}>Verified Shelter Partner</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Shelters & community programs</div>
              </div>
            </div>

            <div
              className="role-option-card"
              onClick={() => handleRoleSelect('Community Volunteer', 'receiver')}
            >
              <div className="role-icon-box">🤝</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800' }}>Community Volunteer</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Helps assisting transport</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. AUTHENTICATION & LOGIN FORM */}
        {modalType === 'login' && (
          <div>
            <button className="back-to-roles" onClick={() => setModalType('donor')}>
              ← Change Role ({selectedRole || 'User'})
            </button>

            <h3 className="heading-primary" style={{ fontSize: '20px', marginBottom: '4px' }}>
              Sign In / Register
            </h3>
            <p className="subheading-muted" style={{ marginBottom: '20px' }}>
              Logging in as <strong>{selectedRole || 'Verified User'}</strong>
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Organization / Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Northern Tadka or Asha Shelter"
                  required
                  value={loginForm.orgName}
                  onChange={(e) => setLoginForm({ ...loginForm, orgName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="name@organization.com"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Primary Region / Area</label>
                <select
                  value={loginForm.userArea}
                  onChange={(e) => setLoginForm({ ...loginForm, userArea: e.target.value })}
                >
                  <option value="Andheri West">Andheri West</option>
                  <option value="Bandra East">Bandra East</option>
                  <option value="Juhu">Juhu</option>
                  <option value="Andheri East">Andheri East</option>
                  <option value="Malad West">Malad West</option>
                </select>
              </div>

              <button type="submit" className="btn-submit-form" style={{ marginTop: '10px' }}>
                Authenticate & Continue
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}