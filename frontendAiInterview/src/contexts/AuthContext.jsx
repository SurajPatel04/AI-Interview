import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { setUserData, clearAllUserData, getUserData, setAccessToken } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const refreshIntervalRef = useRef(null);


  const verifyAuthentication = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.get("/api/v1/user/currentUser", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      if (response.status === 200 && response.data.success) {
        const userData = response.data.data;
        setUserData(userData);
        setUser(userData);
        return true;
      } else {
        clearAllUserData();
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error('Authentication verification failed:', err);
      clearAllUserData();
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  // Silent token refresh — calls backend refresh token API every 28 minutes
  const silentRefresh = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      const response = await axios.post(
        "/api/v1/user/refreshToken",
        { refreshToken },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      if (response.status === 200 && response.data.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Update tokens in localStorage
        if (accessToken) {
          setAccessToken(accessToken);
        }
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        console.log('Token silently refreshed at', new Date().toLocaleTimeString());
        return true;
      }
      return false;
    } catch (err) {
      console.error('Silent token refresh failed:', err);
      // If refresh fails, the user session is invalid — log them out
      clearAllUserData();
      setUser(null);
      return false;
    }
  }, []);

  // Set up 28-minute silent refresh interval when user is authenticated
  useEffect(() => {
    if (user) {
      // Clear any existing interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }

      const REFRESH_INTERVAL = 28 * 60 * 1000; // 28 minutes

      // Start the interval
      refreshIntervalRef.current = setInterval(() => {
        silentRefresh();
      }, REFRESH_INTERVAL);

    } else {
      // User logged out — clear the interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [user, silentRefresh]);


  const logout = useCallback(async () => {
    try {
      await axios.post(
        "/api/v1/user/logout",
        {},
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {

      clearAllUserData();
      setUser(null);
    }
  }, []);


  const login = useCallback((userData) => {
    setUserData(userData);
    setUser(userData);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = getUserData();
      if (savedUser) {
        setUser(savedUser);
        setIsInitialized(true);
        setIsLoading(false);
        
        const lastVerified = localStorage.getItem('lastVerified');
        const now = Date.now();
        const VERIFICATION_INTERVAL = 30 * 60 * 1000; // 30 minutes
        
        if (!lastVerified || (now - parseInt(lastVerified)) > VERIFICATION_INTERVAL) {
          verifyAuthentication().then(() => {
            localStorage.setItem('lastVerified', now.toString());
          });
        }
      } else {
        await verifyAuthentication();
      }
    };

    initializeAuth();
  }, [verifyAuthentication]);

  const value = {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    verifyAuthentication,
    silentRefresh,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
