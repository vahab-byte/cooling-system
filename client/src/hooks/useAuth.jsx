import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for an existing session
    const storedUser = localStorage.getItem('arcticfresh_user');
    const token = localStorage.getItem('arcticfresh_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, fullName) => {
    try {
      const { data } = await axios.post('/api/auth/register', { email, password, fullName });
      // Supabase signUp might not log them in immediately if email confirmation is required,
      // but if it does, it returns session. Let's just return data.
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error };
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      const session = data.data.session;
      const userData = data.data.user;

      if (session) {
        localStorage.setItem('arcticfresh_token', session.access_token);
        localStorage.setItem('arcticfresh_user', JSON.stringify(userData));
        setUser(userData);
      }
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error };
    }
  };

  const logout = () => {
    localStorage.removeItem('arcticfresh_token');
    localStorage.removeItem('arcticfresh_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
