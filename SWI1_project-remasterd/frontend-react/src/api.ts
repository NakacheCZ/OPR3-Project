const api = {
    async fetch(url: string, options: RequestInit = {}): Promise<Response> {
        const token = localStorage.getItem('token');

        const headers = new Headers(options.headers || {});
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
        if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
            headers.append('Content-Type', 'application/json');
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

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
