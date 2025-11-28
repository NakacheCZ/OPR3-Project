let accessToken = '';

export const setAccessToken = (token: string) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

const api = {
    async fetch(url: string, options: RequestInit = {}): Promise<Response> {
        const headers = new Headers(options.headers || {});
        const token = getAccessToken();

        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
        if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
            headers.append('Content-Type', 'application/json');
        }

        let response = await fetch(url, { ...options, headers, credentials: 'include' });

        if (response.status === 401 && !headers.has('X-Retry')) {
            try {
                const refreshResponse = await fetch('http://localhost:8080/api/auth/refresh', {
                    method: 'POST',
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    const { token: newToken } = await refreshResponse.json();
                    setAccessToken(newToken);
                    headers.set('Authorization', `Bearer ${newToken}`);
                    
                    const retryOptions = { ...options, headers };
                    headers.set('X-Retry', 'true');
                    response = await fetch(url, { ...retryOptions, headers });
                } else {
                    window.location.href = '/login';
                }
            } catch (error) {
                window.location.href = '/login';
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        return response;
    },

    async get<T>(url: string): Promise<T> {
        const response = await this.fetch(url);
        return response.json();
    },

    async post<T>(url: string, data: any): Promise<T> {
        const response = await this.fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.json();
    },

    async put<T>(url: string, data: any): Promise<T> {
        const response = await this.fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.json();
    },

    async delete(url: string): Promise<Response> {
        return await this.fetch(url, {
            method: 'DELETE',
        });
    },
};

export default api;
