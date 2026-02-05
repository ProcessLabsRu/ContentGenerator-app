'use client';

import { useEffect, useState } from 'react';

type ConnectionStatus = 'checking' | 'connected' | 'error' | 'unknown';

interface ConnectionIndicatorProps {
    className?: string;
}

export function ConnectionIndicator({ className = '' }: ConnectionIndicatorProps) {
    const [status, setStatus] = useState<ConnectionStatus>('checking');
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        checkConnection();

        // Проверяем подключение каждые 30 секунд
        const interval = setInterval(checkConnection, 30000);

        return () => clearInterval(interval);
    }, []);

    const checkConnection = async () => {
        try {
            const response = await fetch('/api/health/pocketbase');
            const data = await response.json();

            setUrl(data.url || '');

            if (data.status === 'ok') {
                setStatus('connected');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Connection check failed:', error);
            setStatus('error');
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'checking':
                return 'bg-yellow-500';
            case 'connected':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'checking':
                return 'Проверка...';
            case 'connected':
                return 'Подключено';
            case 'error':
                return 'Ошибка';
            default:
                return 'Неизвестно';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'checking':
                return '⏳';
            case 'connected':
                return '✓';
            case 'error':
                return '✗';
            default:
                return '?';
        }
    };

    return (
        <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 ${className}`}
            title={url || 'PocketBase'}
        >
            <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${status === 'checking' ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-medium text-gray-700">
                    {getStatusIcon()} PocketBase
                </span>
            </div>
            <span className="text-xs text-gray-500">
                {getStatusText()}
            </span>
        </div>
    );
}
