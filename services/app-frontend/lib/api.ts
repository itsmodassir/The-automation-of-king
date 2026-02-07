export const api = async <T = any>(url: string, options?: any): Promise<T> => {
    // Mock responses based on URL for app-frontend
    if (url.includes("/contacts")) {
        return [] as T;
    }
    if (url.includes("/conversations")) {
        return [] as T;
    }
    if (url.includes("/automation")) {
        return { enabled: false } as T;
    }
    if (url.includes("/billing")) {
        return { plan: 'free', usage: 0 } as T;
    }
    // Default return for unknown paths
    return {} as T;
};

export const getToken = () => {
    if (typeof document === 'undefined') return null;
    return document.cookie
        .split("; ")
        .find((c) => c.startsWith("auth_token="))
        ?.split("=")[1];
};
