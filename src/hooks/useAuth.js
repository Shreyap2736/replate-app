import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth(showAlert, setCurrentView, setModalType) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userRoleLabel, setUserRoleLabel] = useState('');
  const [userOrgName, setUserOrgName] = useState('');
  const [userLocation, setUserLocation] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    orgName: '',
    userArea: 'Andheri West',
  });

  // Sync user details from Supabase Profiles table
  const syncUserProfile = async (user) => {
    if (!user) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      setUserRole(profile.role);
      setUserOrgName(profile.orgName);
      setUserLocation(profile.userArea || 'Andheri West');
      setUserEmail(user.email);
      setIsLoggedIn(true);
    } else if (user.user_metadata) {
      setUserRole(user.user_metadata.role || 'donor');
      setUserOrgName(user.user_metadata.orgName || 'Verified User');
      setUserLocation(user.user_metadata.userArea || 'Andheri West');
      setUserEmail(user.email);
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUserProfile(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncUserProfile(session.user);
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
        setUserRole('');
        setUserRoleLabel('');
        setUserOrgName('');
        setUserLocation('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handler triggered when clicking a role card inside the selection modal
  const handleRoleSelect = (roleName, roleCategory) => {
    setUserRole(roleCategory);
    setUserRoleLabel(roleName);
    setModalType('login'); // Switch view directly to the login/register form
  };

  // Complete Authentication Form Handler
  const handleLoginSubmit = async (e, fetchProfiles) => {
    e.preventDefault();
    const inputEmail = loginForm.email.trim().toLowerCase();
    const inputPassword = loginForm.password.trim();
    const inputOrgName = loginForm.orgName.trim();
    const inputArea = loginForm.userArea || 'Andheri West';

    try {
      // 1. Attempt Sign Up
      let { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: inputEmail,
        password: inputPassword,
        options: {
          data: {
            orgName: inputOrgName,
            role: userRole,
            userArea: inputArea,
          },
        },
      });

      // 2. If user already exists, fall back to Sign In
      if (signUpError) {
        if (signUpError.message.includes('already registered') || signUpError.status === 400) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: inputEmail,
            password: inputPassword,
          });

          if (signInError) {
            showAlert(`❌ Login failed: ${signInError.message}`);
            return;
          }

          authData = signInData;
        } else {
          showAlert(`❌ Sign-up error: ${signUpError.message}`);
          return;
        }
      } else {
        // Immediate Sign-In right after signup
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email: inputEmail,
          password: inputPassword,
        });
        if (signInData?.user) authData = signInData;
      }

      // 3. Upsert user into profiles table
      if (authData?.user) {
        await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            email: inputEmail,
            orgName: inputOrgName,
            role: userRole,
            userArea: inputArea,
          },
        ]);
        if (fetchProfiles) fetchProfiles();
        await syncUserProfile(authData.user);
      }

      showAlert(`🎉 Authenticated successfully as ${inputOrgName}!`);
      
      // Navigate based on user role
      if (userRole === 'receiver') {
        setCurrentView('ngo_feed');
      } else {
        setCurrentView('post_form');
      }
      setModalType(null);
    } catch (err) {
      showAlert('❌ An unexpected authentication error occurred.');
      console.error(err);
    }
  };

  const handleLogout = async (clearWatch) => {
    if (clearWatch) clearWatch();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserEmail('');
    setUserRole('');
    setUserRoleLabel('');
    setUserOrgName('');
    setUserLocation('');
    setCurrentView('landing');
    showAlert('Logged out successfully.');
  };

  return {
    isLoggedIn,
    userEmail,
    userRole,
    userRoleLabel,
    userOrgName,
    userLocation,
    loginForm,
    setLoginForm,
    handleRoleSelect,
    handleLoginSubmit,
    handleLogout,
  };
}