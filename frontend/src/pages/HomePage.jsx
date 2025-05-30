import React, { useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
// import { axiosInstance } from "../lib/axiosInstance";

const HomePage = () => {
  useEffect(() => {
    const syncUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.log("User fetch erorr: ", error.message);
        return;
      }

      if (user) {
        console.log({ user });
        // const {
        //   data: { session },
        // } = await supabase.auth.getSession();

        // await axiosInstance.post("/auth/oauth-callback", { user });
      }
    };
    syncUser();
  });
  return <div>HomePage</div>;
};

export default HomePage;
