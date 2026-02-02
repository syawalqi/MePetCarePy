import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import apiClient from '../api/client';
import { userService } from '../api/userService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const installHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', installHandler);

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
        fetchProfile(session.user.id);
      }
      else setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session) {
        // Update Axios default header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
        await fetchProfile(session.user.id);
      } else {
        delete apiClient.defaults.headers.common['Authorization'];
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeinstallprompt', installHandler);
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data } = await apiClient.get('/users/me');
      setProfile(data); 
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401) {
        console.warn("Session invalidated by backend. Logging out.");
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  const logout = async () => {
    try {
      await userService.deleteSession();
    } catch (err) {
      console.error("Failed to delete backend session:", err);
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, logout, deferredPrompt, handleInstallClick }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
