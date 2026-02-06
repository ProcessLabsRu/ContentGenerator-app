'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, login as authLogin, logout as authLogout, getCurrentUser, isAuthenticated } from '@/lib/auth-service';
import { getPocketBase } from '@/lib/pocketbase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Проверяем, есть ли сохраненная сессия
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setLoading(false);

        // Подписываемся на изменения auth store
        const pb = getPocketBase();
        const unsubscribe = pb.authStore.onChange(() => {
            const updatedUser = getCurrentUser();
            setUser(updatedUser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const loggedInUser = await authLogin(email, password);
            setUser(loggedInUser);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        authLogout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: isAuthenticated(),
        isAdmin: user?.role === 'admin',
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
