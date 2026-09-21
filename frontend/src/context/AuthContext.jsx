import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  deleteUserAccount,
  getCurrentUser,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // =========================
  // SAVE ACTIVE SESSION
  // =========================

  useEffect(() => {
    if (!localStorage.getItem("musicverseToken")) {
      setIsAuthLoading(false);
      return;
    }

    getCurrentUser()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {
        localStorage.removeItem("musicverseToken");
        setUser(null);
      })
      .finally(() => setIsAuthLoading(false));
  }, []);

  // =========================
  // LOGIN
  // =========================

  const login = async (email, password) => {
    try {
      const result = await loginUser(email, password);
      localStorage.setItem("musicverseToken", result.token);
      setUser(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Unable to login." };
    }
  };

  // =========================
  // REGISTER
  // =========================

  const register = async (name, email, password) => {
    try {
      await registerUser(name, email, password);
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Unable to create account." };
    }
  };

  // =========================
  // UPDATE NAME
  // =========================

  const updateProfileName = async (newName) => {
    if (!user) {
      return {
        success: false,
        message: "No user is logged in.",
      };
    }

    const trimmedName =
      newName.trim();

    if (!trimmedName) {
      return {
        success: false,
        message: "Name cannot be empty.",
      };
    }

    try {
      const result = await updateUserProfile(trimmedName);
      setUser(result.user);
      return { success: true };
    } catch (error) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error
      );

      return {
        success: false,
        message:
          "Unable to update profile.",
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("musicverseToken");
    setUser(null);
  };

  // =========================
  // DELETE ACCOUNT
  // =========================

  const deleteAccount = async () => {
    if (!user) {
      return {
        success: false,
        message: "No user is logged in.",
      };
    }

    try {
      await deleteUserAccount();
      localStorage.removeItem("musicverseToken");
      setUser(null);

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        "DELETE ACCOUNT ERROR:",
        error
      );

      return {
        success: false,
        message:
          "Unable to delete account.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        login,
        register,
        logout,
        updateProfileName,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(
    AuthContext
  );
}