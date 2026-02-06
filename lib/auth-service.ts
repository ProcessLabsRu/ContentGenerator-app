import { getPocketBase } from './pocketbase';

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'member';
    verified: boolean;
    created: string;
    updated: string;
}

/**
 * Авторизация пользователя
 */
export async function login(email: string, password: string): Promise<User> {
    const pb = getPocketBase();

    const authData = await pb.collection('users').authWithPassword(email, password);

    return {
        id: authData.record.id,
        email: authData.record.email,
        role: authData.record.role,
        verified: authData.record.verified,
        created: authData.record.created,
        updated: authData.record.updated,
    };
}

/**
 * Выход из системы
 */
export function logout(): void {
    const pb = getPocketBase();
    pb.authStore.clear();
}

/**
 * Получить текущего пользователя
 */
export function getCurrentUser(): User | null {
    const pb = getPocketBase();

    if (!pb.authStore.isValid || !pb.authStore.model) {
        return null;
    }

    return {
        id: pb.authStore.model.id,
        email: pb.authStore.model.email,
        role: pb.authStore.model.role,
        verified: pb.authStore.model.verified,
        created: pb.authStore.model.created,
        updated: pb.authStore.model.updated,
    };
}

/**
 * Проверить, авторизован ли пользователь
 */
export function isAuthenticated(): boolean {
    const pb = getPocketBase();
    return pb.authStore.isValid;
}

/**
 * Проверить, является ли пользователь администратором
 */
export function isAdmin(): boolean {
    const user = getCurrentUser();
    return user?.role === 'admin';
}

/**
 * Получить токен авторизации
 */
export function getAuthToken(): string | null {
    const pb = getPocketBase();
    return pb.authStore.token;
}
