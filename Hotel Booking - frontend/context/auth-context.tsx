"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, AuthResponse } from "@/lib/api";

export interface AuthUser {
    id: number;
    username: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export interface AuthContextValue {
    isAuthenticated: boolean;
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
}

const AUTH_TOKEN_KEY = "hotel-booking-token";
const AUTH_USER_KEY = "hotel-booking-user";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const savedUser = localStorage.getItem(AUTH_USER_KEY);

        if (savedToken) {
            setToken(savedToken);
        }

        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser) as AuthUser);
            } catch {
                localStorage.removeItem(AUTH_USER_KEY);
            }
        }

        setIsLoading(false);
    }, []);

    async function login(username: string, password: string): Promise<AuthResponse> {
        const response = await apiLogin({ username, password });

        if (!response.success) {
            throw new Error(response.message || "Login failed.");
        }

        setToken(response.token);
        setUser(response.user ?? null);

        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));

        return response;
    }

    function logout() {
        setToken(null);
        setUser(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
    }

    const value = useMemo<AuthContextValue>(
        () => ({
            isAuthenticated: !!token,
            user,
            token,
            isLoading,
            login,
            logout,
        }),
        [token, user, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
