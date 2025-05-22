import { useState, useContext, createContext } from 'react'

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = async ({ username, password }) => {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();

        const currUser = users.find(usr => usr.username === username && usr.password === password);
        if (currUser) {
            setUser(currUser);
            setIsLoggedIn(true);
            return { success: true };
        } else {
            return { success: false };
        }
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
    }

    const register = async ({ username, password }) => {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();

        if (users.find(usr => usr.username === username)) {
            return { success: false };
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register, isLoggedIn}}>
            { children }
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}