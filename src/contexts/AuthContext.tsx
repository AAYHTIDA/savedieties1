import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, firebaseApi, seedDemoCases } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isUser: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsUser: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin emails list (hardcoded for now)
const ADMIN_EMAILS = ['admin@savedeities.com', 'admin@courtcases.com'];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed demo cases on app load
    seedDemoCases().catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Check if admin email
          const isAdminEmail = ADMIN_EMAILS.includes(user.email || '');
          if (isAdminEmail) {
            setIsAdmin(true);
            setIsUser(false);
          } else {
            // Check user in users collection
            const appUser = await firebaseApi.getUserByEmail(user.email || '');
            if (appUser) {
              setIsAdmin(appUser.isAdmin);
              setIsUser(!appUser.isAdmin);
            } else {
              setIsAdmin(false);
              setIsUser(false);
            }
          }
        } catch (error) {
          console.error('Error verifying user status:', error);
          setIsAdmin(false);
          setIsUser(false);
        }
      } else {
        setIsAdmin(false);
        setIsUser(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Admin login - no enabled check needed
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginAsUser = async (email: string, password: string) => {
    // First authenticate the user
    await signInWithEmailAndPassword(auth, email, password);
    
    // Then check if user is enabled (now we're authenticated so we can query Firestore)
    const isEnabled = await firebaseApi.isUserEnabled(email);
    if (!isEnabled) {
      // User is disabled, sign them out and throw error
      await signOut(auth);
      throw new Error('Your account has been disabled. Please contact the administrator.');
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    isAdmin,
    isUser,
    loading,
    login,
    loginAsUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
