const registerUrl = "http://localhost:3001/api/register";
const loginUrl = "http://localhost:3001/api/login";

export interface User {
    username: string;
    authToken: string;
}

interface UserError {
    detail: string;
}

interface RegisterResponse {
    success: boolean;
    error?: UserError;
}

interface LoginResponse {
    success: boolean;
    error?: UserError;
    user?: User;
}

const register = async (username: string, password: string): Promise<RegisterResponse> => {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
    };

    const res = await fetch(registerUrl, options);
    const data = await res.json();

    return data;
};

const login = async (username: string, password: string): Promise<LoginResponse> => {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
    };

    const res = await fetch(loginUrl, options);
    const data = await res.json();

    return data;
};

export default {
    register,
    login
};