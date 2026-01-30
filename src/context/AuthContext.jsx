// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('use Auth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await authAPI.me();
      setUser(response.data.data.user);
      setCompany(response.data.data.company);
    } catch (err) {
      localStorage.removeItem('auth_token');
      setUser(null);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const loginWithToken = async (userData, token) => {
  try {
    localStorage.setItem('auth_token', token);
    setUser(userData);

    // Optionally fetch full user + company data
    await fetchUser();

    return { success: true };
  } catch (err) {
    console.error('loginWithToken error', err);
    return { success: false, error: 'Erreur lors de la connexion' };
  }
};

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data.data;
      
      localStorage.setItem('auth_token', token);
      setUser(user);
      
      // Fetch full user data including company
      await fetchUser();
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 
                     err.response?.data?.errors?.email?.[0] ||
                     'Erreur de connexion';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (data) => {
    try {
      setError(null);
      const response = await authAPI.register(data);
      const { user, token } = response.data.data;
      
      localStorage.setItem('auth_token', token);
      setUser(user);
      
      await fetchUser();
      
      return { success: true };
    } catch (err) {
      const errors = err.response?.data?.errors || {};
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
      setError(message);
      return { success: false, error: message, errors };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setCompany(null);
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);

      if (response.data.success) {
        setUser(prev => ({
          ...prev,
          ...response.data.data,
        }));
        return { success: true };
      }

      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('Erreur updateProfile:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du profil' 
      };
    }
  };

  const updateCompanyProfile = async (data) => {
    try {
      const response = await authAPI.updateCompanyProfile(data);
      setCompany(response.data.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la mise à jour';
      return { success: false, error: message };
    }
  };

  const changePassword = async (currentPassword, newPassword, newPasswordConfirmation) => {
    try {
      const response = await authAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      });
      
      localStorage.setItem('auth_token', response.data.data.token);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.errors?.current_password?.[0] ||
                     err.response?.data?.message || 
                     'Erreur lors du changement de mot de passe';
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    company,
    loading,
    error,
    isAuthenticated: !!user,
    isProfessionnel: user?.account_type === 'professionnel',
    login,
    loginWithToken,
    register,
    logout,
    updateProfile,
    updateCompanyProfile,
    changePassword,
    refreshUser: fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};