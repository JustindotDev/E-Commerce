import React, { useState } from "react";
import ecommerce from "../assets/E-Commerce.png";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const SignupPage = () => {
  const { signUp, isSigningUp } = useAuthStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
  });

  function handleValdation(formName) {
    if (formName === "phone") {
      if (!/^09\d{9}$/.test(formData.phone)) {
        toast.error(
          "Invalid phone number format. Must start with 09 and be 11 digits."
        );
        return false;
      }
      return true;
    }

    if (formName === "email") {
      if (!/^[^\s@]+@[^\s@]+\.(com)$/.test(formData.email)) {
        toast.error("Invalid email format.");
        return false;
      }

      return true;
    }
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.phone) {
        return toast.error("Enter phone number.");
      }
      const success = handleValdation("phone");
      if (success) {
        return setStep((prev) => prev + 1);
      }
      return;
    }
    if (step === 2) {
      if (!formData.email) {
        return toast.error("Enter email address.");
      }
      const success = handleValdation("email");
      if (success) {
        return setStep((prev) => prev + 1);
      }
      return;
    }
    if (step === 3 && !formData.password) {
      return toast.error("Enter passowrd.");
    }
    if (step < 3) return setStep((prev) => prev + 1);

    signUp(formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="h-screen w-screen">
      <div className="h-full flex justify-center items-center gap-45">
        <img className="h-full" src={ecommerce} alt="" />
        <Card
          sx={{
            width: 400,
            height: 500,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CardHeader
              title="Sign Up"
              sx={{ textAlign: "center" }}
              titleTypographyProps={{ fontWeight: "bold", fontSize: 24 }}
            />
            {step === 1 && (
              <TextField
                name="phone"
                label="Phone Number"
                variant="outlined"
                sx={{ width: 350, alignSelf: "center" }}
                value={formData.phone}
                onChange={handleChange}
              />
            )}

            {step === 2 && (
              <TextField
                name="email"
                type="email"
                value={formData.email}
                label="Email"
                variant="outlined"
                sx={{ width: 350, alignSelf: "center" }}
                onChange={handleChange}
              />
            )}
            {step === 3 && (
              <TextField
                name="password"
                type="password"
                value={formData.password}
                label="Password"
                variant="outlined"
                sx={{ width: 350, alignSelf: "center" }}
                onChange={handleChange}
              />
            )}

            <Button
              variant="contained"
              size="medium"
              sx={{ width: 350 }}
              onClick={handleNext}
              disabled={isSigningUp}
            >
              {step < 3 ? "Next" : "Sign Up"}
            </Button>
            <Box sx={{ width: 350 }}>
              <Divider
                sx={{
                  "&::before, &::after": { borderColor: "lightgray" },
                  color: "lightgray",
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
                OR
              </Divider>
            </Box>
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={
                <img
                  src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
                  alt="Google"
                  style={{ width: 20, height: 20 }}
                />
              }
              sx={{
                width: 350,
                color: "black",
                borderColor: "gray",
                textTransform: "none",
              }}
            >
              Google
            </Button>
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={
                <img
                  src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000"
                  alt="Facebook"
                  style={{ width: 20, height: 20 }}
                />
              }
              sx={{
                width: 350,
                color: "black",
                borderColor: "gray",
                textTransform: "none",
              }}
            >
              Facebook
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
