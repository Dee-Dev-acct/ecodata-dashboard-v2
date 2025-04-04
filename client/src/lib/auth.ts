import { apiRequest } from "./queryClient";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiRequest("POST", "/api/auth/login", credentials);
  const data = await response.json();
  
  // Store token in localStorage
  localStorage.setItem("authToken", data.token);
  
  return data;
}

export function logout(): void {
  localStorage.removeItem("authToken");
}

export function getToken(): string | null {
  return localStorage.getItem("authToken");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getUserFromToken(): { id: number; username: string; role: string } | null {
  const token = getToken();
  if (!token) return null;
  
  // Decode JWT without verification (just to extract payload)
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing token:', e);
    return null;
  }
}

export function isAdmin(): boolean {
  const user = getUserFromToken();
  return user?.role === 'admin';
}
