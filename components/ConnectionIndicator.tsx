'use client';

import { useEffect, useState } from 'react';
import { Database } from 'lucide-react';

type ConnectionStatus = 'checking' | 'connected' | 'error' | 'unknown';

interface ConnectionIndicatorProps {
    className?: string;
}

export function ConnectionIndicator({ className = '' }: ConnectionIndicatorProps) {
    const [status, setStatus] = useState<ConnectionStatus>('checking');
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        checkConnection();
        const interval = setInterval(checkConnection, 30000);
        return () => clearInterval(interval);
    }, []);

    const checkConnection = async () => {
        try {
            const response = await fetch('/api/health/pocketbase');
            const data = await response.json();
            setUrl(data.url || '');
            setStatus(data.status === 'ok' ? 'connected' : 'error');
        } catch (error) {
            setStatus('error');
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'checking': return 'text-yellow-400';
            case 'connected': return 'text-green-400';
            case 'error': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div
            className={`flex items-center ${className}`}
            title={url || 'PocketBase'}
        >
            <Database className={`w-5 h-5 ${getStatusColor()} transition-colors duration-300`} />
        </div>
    );
}
