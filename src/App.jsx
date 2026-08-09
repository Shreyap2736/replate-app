import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Modal from './components/Modal';

import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import PostMeal from './pages/PostMeal';
import Tracking from './pages/Tracking';
import Impact from './pages/Impact';

import { useAuth } from './hooks/useAuth';
import { useMeals } from './hooks/useMeals';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [modalType, setModalType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietFilter, setSelectedDietFilter] = useState('All');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('All');

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(''), 4000);
  };

  const {
    isLoggedIn,
    userRole,
    userRoleLabel,
    userOrgName,
    userLocation,
    loginForm,
    setLoginForm,
    handleRoleSelect,
    handleLoginSubmit,
    handleLogout,
  } = useAuth(showAlert, setCurrentView, setModalType);

  const {
    surplusListings,
    registeredNgos,
    newMeal,
    setNewMeal,
    activeTrackedMeal,
    setActiveTrackedMeal,
    watchId,
    fetchProfiles,
    handlePostMealSubmit,
    handleClaimMeal,
    handleStartGPSBroadcast,
    handleMarkDelivered,
  } = useMeals(showAlert, setCurrentView, userOrgName, userRole);

  const foodItems = [
    { id: 1, name: 'South Indian Thali', category: 'Fermented & Fiber-Rich', nutrients: 'Probiotics, Complex Carbs, Fiber', benefits: 'Nurtures gut health and delivers sustained energy.', image: '/dosa.jpeg' },
    { id: 2, name: 'Spinach Paratha & Curd', category: 'Probiotic & Greens', nutrients: 'Iron, Vitamin A, Calcium', benefits: 'Boosts immunity and promotes smooth digestion.', image: '/paratha.jpeg' },
    { id: 3, name: 'Spiced Aloo Gobi Bowl', category: 'Antioxidant Power', nutrients: 'Vitamin C, Fiber, Curcumin', benefits: 'Reduces inflammation and supports cell repair.', image: '/aloo-gobi.jpeg' },
    { id: 4, name: 'Comfort Dal Tadka & Rice', category: 'Complete Protein', nutrients: 'Plant Protein, Essential Amino Acids', benefits: 'Aids muscle repair and supports heart health.', image: '/Dal-chawal.jpeg' },
    { id: 5, name: 'Sprouted Misal Pav', category: 'Protein Sprouts', nutrients: 'Bioavailable Sprouts, Zinc, B-Vitamins', benefits: 'Increases nutrient absorption and metabolism.', image: '/misal.jpeg' },
    { id: 6, name: 'Quinoa & Broccoli Bowl', category: 'Superfood Salad', nutrients: '9 Essential Amino Acids, Omega-3s', benefits: 'Fights oxidative stress and aids muscle recovery.', image: '/Salad.jpeg' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % foodItems.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + foodItems.length) % foodItems.length);

  const getItemClass = (index) => {
    const total = foodItems.length;
    if (index === currentIndex) return 'arc-dish-card active';
    if (index === (currentIndex - 1 + total) % total) return 'arc-dish-card prev';
    if (index === (currentIndex + 1) % total) return 'arc-dish-card next';
    return 'arc-dish-card hidden';
  };

  const handleDonateClick = () => {
    if (isLoggedIn && userRole === 'receiver') {
      showAlert('🚫 Donate Food is restricted to Commercial Owners & Event Organizers.');
      return;
    }
    if (isLoggedIn && userRole === 'donor') {
      setCurrentView('post_form');
    } else {
      setModalType('donor');
    }
  };

  const displayNgoList = React.useMemo(() => {
    if (isLoggedIn && userRole === 'receiver' && userOrgName) {
      const activeUserEntry = { id: 'active_user', name: userOrgName, location: userLocation || 'Andheri West', distance: '0.0 km (Your Location)', status: 'Online (You)', isCurrentUser: true };
      const remainingList = registeredNgos.filter((ngo) => ngo.name.toLowerCase() !== userOrgName.toLowerCase());
      return [activeUserEntry, ...remainingList];
    }
    return registeredNgos;
  }, [isLoggedIn, userRole, userOrgName, userLocation, registeredNgos]);

  const filteredListings = surplusListings.filter((meal) => {
    const dishMatch = (meal.dish || '').toLowerCase().includes(searchQuery.toLowerCase()) || (meal.donor || '').toLowerCase().includes(searchQuery.toLowerCase());
    const dietTypeVal = meal.dietType || meal.diettype || 'Veg';
    const dietMatch = selectedDietFilter === 'All' || dietTypeVal === selectedDietFilter;
    const areaMatch = selectedAreaFilter === 'All' || meal.location === selectedAreaFilter;
    return dishMatch && dietMatch && areaMatch;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (isLoggedIn && userRole === 'receiver' && userLocation) {
      if (a.location === userLocation && b.location !== userLocation) return -1;
      if (a.location !== userLocation && b.location === userLocation) return 1;
    }
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {alertMessage && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#111827', color: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, fontSize: '13px', fontWeight: '700', borderLeft: '4px solid #059669' }}>
          {alertMessage}
        </div>
      )}

      <Navbar
        userRole={userRole}
        isLoggedIn={isLoggedIn}
        userOrgName={userOrgName}
        userLocation={userLocation}
        handleLogout={() => handleLogout(() => watchId && navigator.geolocation.clearWatch(watchId))}
        setCurrentView={setCurrentView}
        handleDonateClick={handleDonateClick}
        setModalType={setModalType}
      />

      {currentView === 'landing' && (
        <Landing
          surplusListings={surplusListings}
          foodItems={foodItems}
          currentIndex={currentIndex}
          handlePrev={handlePrev}
          handleNext={handleNext}
          setCurrentIndex={setCurrentIndex}
          getItemClass={getItemClass}
        />
      )}

      {currentView === 'ngo_feed' && (
        <Marketplace
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          userOrgName={userOrgName}
          userLocation={userLocation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDietFilter={selectedDietFilter}
          setSelectedDietFilter={setSelectedDietFilter}
          selectedAreaFilter={selectedAreaFilter}
          setSelectedAreaFilter={setSelectedAreaFilter}
          sortedListings={sortedListings}
          handleClaimMeal={(id) => handleClaimMeal(id, isLoggedIn)}
          handleStartGPSBroadcast={handleStartGPSBroadcast}
          setActiveTrackedMeal={setActiveTrackedMeal}
          setCurrentView={setCurrentView}
          displayNgoList={displayNgoList}
        />
      )}

      {currentView === 'post_form' && (
        <PostMeal
          newMeal={newMeal}
          setNewMeal={setNewMeal}
          userOrgName={userOrgName}
          handlePostMealSubmit={handlePostMealSubmit}
        />
      )}

      {currentView === 'tracking' && (
        <Tracking
          activeTrackedMeal={activeTrackedMeal}
          handleMarkDelivered={handleMarkDelivered}
          setCurrentView={setCurrentView}
        />
      )}

      {currentView === 'impact' && (
        <Impact 
          surplusListings={surplusListings}
          setCurrentView={setCurrentView} 
        />
      )}

      <Modal
        modalType={modalType}
        setModalType={setModalType}
        handleRoleSelect={handleRoleSelect}
        selectedRole={userRoleLabel}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLoginSubmit={(e) => handleLoginSubmit(e, fetchProfiles)}
      />

      <Footer />
    </div>
  );
}