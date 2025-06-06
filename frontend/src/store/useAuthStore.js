import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import { supabase } from "../lib/supabaseClient.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  Error: "",
  emailError: "",
  passwordError: "",

  signUp: async (data, navigate) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
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
      toast.success(res.data.message);
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
      toast.error(error.message);
    }
  },
}));
