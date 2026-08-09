import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

export function useMeals(showAlert, setCurrentView, userOrgName, userRole) {
  const [surplusListings, setSurplusListings] = useState([]);
  const [activeTrackedMeal, setActiveTrackedMeal] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [isSimulatedGps, setIsSimulatedGps] = useState(false);

  const [registeredNgos, setRegisteredNgos] = useState([]);

  const [newMeal, setNewMeal] = useState({
    donor: '',
    dish: '',
    servings: '',
    dietType: 'Veg',
    packagingType: 'Disposable Containers',
    contactPerson: '',
    contactPhone: '',
    location: 'Andheri West',
    address: '',
    expiryHours: '3',
  });

  const fetchMeals = async () => {
    const { data, error } = await supabase.from('meals').select('*').order('id', { ascending: false });
    if (!error && data) {
      setSurplusListings(data);
      if (activeTrackedMeal) {
        const updated = data.find((m) => m.id === activeTrackedMeal.id);
        if (updated) setActiveTrackedMeal((prev) => ({ ...updated, isSimulatedGps: prev?.isSimulatedGps }));
      }
    }
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('*').eq('role', 'receiver');
    if (!error && data) {
      const formattedFromDb = data.map((p, idx) => ({
        id: p.id || `profile-${idx}`,
        name: p.orgName,
        location: p.userArea || 'Andheri West',
        distance: '0.8 km',
        status: 'Active',
      }));
      setRegisteredNgos(formattedFromDb);
    }
  };

  useEffect(() => {
    fetchMeals();
    fetchProfiles();

    const profileSub = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchProfiles())
      .subscribe();

    const subscription = supabase
      .channel('public:meals')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'meals' }, (payload) => {
        setSurplusListings((prev) => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'meals' }, (payload) => {
        setSurplusListings((prev) => prev.map((m) => (m.id === payload.new.id ? payload.new : m)));
        setActiveTrackedMeal((prev) =>
          prev && prev.id === payload.new.id ? { ...payload.new, isSimulatedGps: prev.isSimulatedGps } : prev
        );
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'meals' }, (payload) => {
        setSurplusListings((prev) => prev.filter((m) => m.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
      supabase.removeChannel(profileSub);
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [watchId]);

  const handlePostMealSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const timeString = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const hoursNum = parseInt(newMeal.expiryHours) || 3;
    const expiresAtISO = new Date(Date.now() + hoursNum * 60 * 60 * 1000).toISOString();

    const { error } = await supabase.from('meals').insert([{
      donor: newMeal.donor || userOrgName || 'Verified Kitchen',
      dish: newMeal.dish,
      servings: Number(newMeal.servings),
      dietType: newMeal.dietType,
      packagingType: newMeal.packagingType,
      postedTime: timeString,
      location: newMeal.location,
      address: newMeal.address,
      contactPerson: newMeal.contactPerson,
      contactPhone: newMeal.contactPhone,
      expiresAt: expiresAtISO,
      claimed: false,
      claimedBy: '',
      status: 'available',
      pickupStatus: 'Pending',
    }]);

    if (error) {
      showAlert('❌ Error posting meal. Please try again.');
    } else {
      setNewMeal({ donor: '', dish: '', servings: '', dietType: 'Veg', packagingType: 'Disposable Containers', contactPerson: '', contactPhone: '', location: 'Andheri West', address: '', expiryHours: '3' });
      showAlert('🚀 Surplus meal logged with active food-safety countdown!');
      fetchMeals();
      setCurrentView('ngo_feed');
    }
  };

  const handleClaimMeal = async (id, isLoggedIn) => {
    if (!isLoggedIn) {
      showAlert('⚠️ Please log in as an NGO or Volunteer before claiming meals.');
      return;
    }
    if (userRole === 'donor') {
      showAlert('🔒 Business owners cannot claim meals.');
      return;
    }

    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from('meals')
      .update({
        claimed: true,
        claimedBy: userOrgName,
        status: 'claimed',
        pickupStatus: 'Assigned to Volunteer',
      })
      .eq('id', id)
      .eq('status', 'available')
      .eq('claimed', false)
      .gt('expiresAt', nowIso)
      .select();

    if (error) {
      showAlert('❌ Unable to reserve meal. Please try again.');
      return;
    }

    if (!data || data.length === 0) {
      showAlert('⚡ Cannot claim! Either the meal was claimed or its countdown expired.');
      fetchMeals();
      return;
    }

    showAlert('🎉 SUCCESS! Meal reserved. Proceed to assign volunteer.');
    fetchMeals();
  };

  const handleStartGPSBroadcast = (meal) => {
    if (!navigator.geolocation) {
      showAlert('⚠️ Browser GPS unavailable. Switched to Demo Location mode.');
      setIsSimulatedGps(true);
      triggerFallbackGps(meal);
      return;
    }

    if (watchId) navigator.geolocation.clearWatch(watchId);

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setIsSimulatedGps(false);

        await supabase.from('meals').update({
          volunteerLat: latitude,
          volunteerLng: longitude,
          status: 'pickup_in_progress',
          pickupStatus: 'Volunteer En Route (Live Stream)',
        }).eq('id', meal.id);

        setActiveTrackedMeal((prev) => ({
          ...(prev || meal),
          volunteerLat: latitude,
          volunteerLng: longitude,
          status: 'pickup_in_progress',
          pickupStatus: 'Volunteer En Route (Live Stream)',
          isSimulatedGps: false,
        }));
      },
      async (err) => {
        setIsSimulatedGps(true);
        showAlert('⚠️ Browser GPS permission denied. Switched to Demo Location mode.');
        await triggerFallbackGps(meal);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    setWatchId(id);
    setCurrentView('tracking');
  };

  const triggerFallbackGps = async (meal) => {
    const simLat = 19.1197;
    const simLng = 72.8464;

    await supabase.from('meals').update({
      volunteerLat: simLat,
      volunteerLng: simLng,
      status: 'pickup_in_progress',
      pickupStatus: 'Volunteer En Route (Demo Location)',
    }).eq('id', meal.id);

    setActiveTrackedMeal({
      ...meal,
      volunteerLat: simLat,
      volunteerLng: simLng,
      status: 'pickup_in_progress',
      pickupStatus: 'Volunteer En Route (Demo Location)',
      isSimulatedGps: true,
    });
  };

  const handleMarkDelivered = async (id) => {
    if (watchId) navigator.geolocation.clearWatch(watchId);

    const { error } = await supabase.from('meals').update({
      status: 'delivered',
      pickupStatus: 'Delivered Successfully'
    }).eq('id', id);

    if (!error) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      setActiveTrackedMeal((prev) => prev ? { ...prev, status: 'delivered', pickupStatus: 'Delivered Successfully' } : null);
      fetchMeals();
    } else {
      showAlert('❌ Error updating status to Delivered.');
    }
  };

  return {
    surplusListings,
    registeredNgos,
    newMeal,
    setNewMeal,
    activeTrackedMeal,
    setActiveTrackedMeal,
    watchId,
    isSimulatedGps,
    fetchProfiles,
    handlePostMealSubmit,
    handleClaimMeal,
    handleStartGPSBroadcast,
    handleMarkDelivered,
  };
}