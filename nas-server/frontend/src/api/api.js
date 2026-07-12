const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
    return localStorage.getItem("token");
}

export async function apiFetch(endpoint, options = {}) {

    const token = getToken();

    const headers = {
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("username");

        window.location.reload();

    }

    return response;
}

export default API_URL;