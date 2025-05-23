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
            localStorage.setItem('user', JSON.stringify(currUser));
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
        try {
            const response = await fetch('http://localhost:3000/users');
            
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }

            const users = await response.json();

            if (users.find(usr => usr.username === username)) {
            return { success: false };
            }

            const newUser = { username, password };

            const postResponse = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
            });

            if (!postResponse.ok) {
            throw new Error(`Failed to register: ${postResponse.status}`);
            }

            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
            setIsLoggedIn(true);

            return { success: true };

        } catch (error) {
            console.error("Registration failed:", error);
            return { success: false, error: error.message };
        }
    };



    return (
        <AuthContext.Provider value={{ user, login, logout, register, isLoggedIn}}>
            { children }
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}