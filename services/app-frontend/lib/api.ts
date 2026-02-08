export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = async <T = any>(endpoint: string, options: any = {}): Promise<T> => {
    const token = getToken();

    const headers: any = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const config: RequestInit = {
        ...options,
        headers,
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
        if (response.status === 401) {
            // Unauthorized - clear token and redirect to login
            if (typeof window !== 'undefined') {
                removeToken();
                window.location.href = '/login';
            }
        }
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }

    return response.json();
};

export const getToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    return document.cookie
        .split("; ")
        .find((c) => c.startsWith("auth_token="))
        ?.split("=")[1] || null;
};

export const removeToken = (): void => {
    if (typeof document !== 'undefined') {
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};
