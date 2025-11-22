import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = loading, null = no user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("accessToken");
      console.log("token from loadUser:", token);

      if (!token) {
        setUser(null); // no token → unauthenticated
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:4000/api/profile/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("res from loadUser:", res);

        if (res.data?.user) {
          setUser(res.data.user); // authenticated user
        } else {
          setUser(null); // no user from backend
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null); // error → treat as unauthenticated
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const getData = () => useContext(UserContext);
