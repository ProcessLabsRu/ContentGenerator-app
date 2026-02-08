'use client';

import { useAuth } from './AuthProvider';
import { LoginForm } from './LoginForm';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <LoginForm />;
    }

    if (requireAdmin && !isAdmin) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Доступ запрещен</h1>
                    <p className="text-gray-600">У вас нет прав для просмотра этой страницы.</p>
                    <p className="text-sm text-gray-500 mt-2">Требуется роль: Администратор</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
