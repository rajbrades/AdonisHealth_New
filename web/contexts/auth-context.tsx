"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, User, LoginCredentials, RegisterData } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = apiClient.getUser();
        const token = apiClient.getToken();

        if (storedUser && token) {
          // Verify token is still valid by fetching profile
          const freshUser = await apiClient.getProfile();
          setUser(freshUser);
        }
      } catch (error) {
        // Token invalid or expired
        apiClient.removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.login(credentials);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await apiClient.register(data);
    setUser(response.user);
  };

  const logout = async () => {
    await apiClient.logout();
    setUser(null);
    router.push('/');
  };

  const refreshUser = async () => {
    try {
      const freshUser = await apiClient.getProfile();
      setUser(freshUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
