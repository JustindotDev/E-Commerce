import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import { supabase } from "../lib/supabaseClient.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  Error: "",
  emailError: "",
  passwordError: "",
  snackbar: {
    open: false,
    message: "",
    severity: "success",
  },

  setSnackbar: (snackbar) => set({ snackbar }),

  signUp: async (data, navigate) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user });
      set({
        snackbar: {
          open: true,
          message: res.data.message,
          severity: "success",
        },
      });
      navigate("/home");
    } catch (error) {
      console.error("Error caught:", error);
      set({ Error: error.response.data.message });
    } finally {
      set({ isSigningUp: false });
    }
  },

  logIn: async (data, navigate) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("auth/login", data);
      set({ authUser: res.data.user });
      set({
        snackbar: {
          open: true,
          message: res.data.message,
          severity: "success",
        },
      });
      navigate("/home");
    } catch (error) {
      console.log("Error caught: ", error);
      const errorData = error.response.data;
      set({
        emailError: errorData.emailError,
        passwordError: errorData.passwordError,
      });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  Oauth: async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
    if (error) {
      set({
        snackbar: {
          open: true,
          message: error.message,
          severity: "error",
        },
      });
    }
  },
}));
