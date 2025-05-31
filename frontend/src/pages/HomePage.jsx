import React, { useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { axiosInstance } from "../lib/axiosInstance";

const HomePage = () => {
  useEffect(() => {
    const syncUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.log("User fetch error: ", error.message);
        return;
      }

      if (user) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log("Session info: ", session);
          await axiosInstance.post("/auth/oauth-callback", {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
        }
      }
    };
    syncUser();
  });
  return <div>HomePage</div>;
};

export default HomePage;
