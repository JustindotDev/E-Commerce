import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PasswordReset from "./pages/PasswordReset";
import UpdatePassword from "./pages/UpdatePassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
      <Toaster
        toastOptions={{
          style: {
            fontFamily: "roboto",
          },
        }}
      />
    </>
  );
}

export default App;
