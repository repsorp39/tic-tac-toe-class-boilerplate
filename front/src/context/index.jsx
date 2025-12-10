import { createContext, useContext, useEffect, useState } from "react";
import getAxiosInstance from "../lib/axios-config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  let http = getAxiosInstance();
  const [isLogged, setLogged] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function fetchUser() {
    //necessare to make sure we are using the token currently stored an not an old one
    http = getAxiosInstance();
    try {
      setLoading(true);
      const res = await http.get("/player");
      setLogged(true);
      
      setUser({ ...res.data.player });
    } catch (error) {
      setLogged(false);
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials) {
    try {
      const { data } = await http.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      setLogged(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        status: error.status,
        message:
          error?.response?.data?.message ||
          "Une erreur est survenue. Veuillez réesayez plus tard.",
      };
    }
  }

  async function register(user) {
    try {
      await http.post("/auth/register/", user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        status: error.status,
        message:
          error?.response?.data?.message ||
          "Une erreur est survenue. Veuillez réesayez plus tard.",
      };
    }
  }

  async function logout() {
    try {
      // await http.post("/auth/logout");
      localStorage.removeItem("token");
      setLogged(false);
      window.location.reload();
    } catch (error) {}
  }

  useEffect(() => {
    fetchUser();
  }, [isLogged]);

  const authContextData = {
    register,
    login,
    logout,
    fetchUser,
    isLogged,
    isLoading,
    user,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuthContext() {
  return useContext(AuthContext);
}
