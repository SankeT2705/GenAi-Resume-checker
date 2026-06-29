import { useContext } from "react";
import { AuthContext } from "../auth.context";
import {
  Login,
  register,
  logout
} from "../../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  const {
    user,
    setUser,
    loading,
    setLoading
  } = context;

  const handleLogin = async ({
    email,
    password
  }) => {
    setLoading(true);

    try {
      const data = await Login({
        email,
        password
      });

      setUser(data.user);

      return data.user;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({
    username,
    email,
    password
  }) => {
    setLoading(true);

    try {
      const data = await register({
        username,
        email,
        password
      });

      setUser(data.user);

      return data.user;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();

      setUser(null);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    setUser,
    loading,
    handleLogin,
    handleRegister,
    handleLogout
  };
};