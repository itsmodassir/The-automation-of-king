export const api = async <T = any>(url: string, options: RequestInit = {}): Promise<T> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add auth token if exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(fullUrl, {
            ...options,
            headers,
        });

        if (!response.ok) {
            // Fallback for analytics until backend endpoint is ready/verified
            if (url.includes("/analytics/overview")) {
                return { tenants: 0, messages: 0, ai: 0, wa: 0 } as T;
            }
            const error = await response.json().catch(() => ({ message: 'An error occurred' }));
            throw new Error(error.message || response.statusText);
        }

        return response.json();
    } catch (error) {
        if (url.includes("/analytics/overview")) {
            return { tenants: 0, messages: 0, ai: 0, wa: 0 } as T;
        }
        throw error;
    }
};
