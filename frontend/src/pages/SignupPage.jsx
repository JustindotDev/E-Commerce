import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ecommerce from "../assets/E-Commerce.png";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useAuthStore } from "../store/useAuthStore";
import countryCodes from "../lib/country-code.json";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp, isSigningUp, Oauth, Error } = useAuthStore();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    countryCode: "+63",
    phone: "",
    email: "",
    password: "",
  });

  function handleValdation(formName) {
    if (formName === "phone") {
      if (!/^[1-9]\d{9,14}$/.test(formData.phone)) {
        setError("Invalid phone number.");
        return false;
      }
      const phoneNumber = formData.countryCode + formData.phone;
      if (!/^\+\d{10,15}$/.test(phoneNumber)) {
        setError("Phone number too long.");
        return false;
      }
      return true;
    }

    if (formName === "email") {
      if (!/^[^\s@]+@[^\s@]+\.(com)$/.test(formData.email)) {
        setError("Invalid email format.");
        return false;
      }

      return true;
    }
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.phone || !formData.countryCode) {
        return setError("Enter phone number.");
      }
      const success = handleValdation("phone");
      if (success) {
        return setStep((prev) => prev + 1);
      }
      return;
    }
    if (step === 2) {
      if (!formData.email) {
        return setError("Enter email address.");
      }
      const success = handleValdation("email");
      if (success) {
        return setStep((prev) => prev + 1);
      }
      return;
    }
    if (step === 3 && !formData.password) {
      return setError("Enter password.");
    }
    if (step < 3) return setStep((prev) => prev + 1);

    signUp(formData, navigate);
  };

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="h-screen w-screen">
      <div className="h-full flex justify-center items-center gap-45">
        <img className="h-full" src={ecommerce} alt="" />
        <Card
          sx={{
            width: 400,
            minHeight: 400,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              position: "relative",
            }}
          >
            {step > 1 && (
              <IconButton
                disableRipple
                onClick={() => setStep((prev) => prev - 1)}
                sx={{ position: "absolute", left: 10, top: 20 }}
              >
                <KeyboardBackspaceIcon sx={{ color: "blue", fontSize: 32 }} />
              </IconButton>
            )}
            <CardHeader
              title="Sign Up"
              sx={{ textAlign: "center" }}
              titleTypographyProps={{ fontWeight: "bold", fontSize: 24 }}
            />
            {step === 1 && (
              <Box sx={{ display: "flex", width: 350 }}>
                <FormControl sx={{ marginRight: 1, flexGrow: 1, maxWidth: 75 }}>
                  <Select
                    value={formData.countryCode}
                    onChange={handleChange}
                    autoWidth
                    renderValue={(selected) => selected}
                  >
                    {countryCodes.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.code}({country.name})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  error={error ? true : false}
                  helperText={error || ""}
                  name="phone"
                  label="Phone Number"
                  variant="outlined"
                  sx={{ flexGrow: 1, alignSelf: "center" }}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Box>
            )}

            {step === 2 && (
              <TextField
                error={error || Error ? true : false}
                helperText={error || Error || ""}
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
                error={error || Error ? true : false}
                helperText={error || Error || ""}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                label="Password"
                variant="outlined"
                sx={{ width: 350, alignSelf: "center" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? "hide password" : "show password"
                        }
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon sx={{ color: "lightgray" }} />
                        ) : (
                          <VisibilityIcon sx={{ color: "lightgray" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
              />
            )}

            <Button
              fullWidth
              loading={isSigningUp}
              loadingPosition="start"
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
                borderColor: "lightgray",
                textTransform: "none",
              }}
              onClick={() => Oauth("google")}
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
                borderColor: "lightgray",
                textTransform: "none",
              }}
            >
              Facebook
            </Button>
            <Typography
              variant="body2"
              sx={{
                marginTop: 1,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              Have an account?
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  color: "blue",
                  textTransform: "none",
                  padding: 0,
                  minWidth: "auto",
                  fontSize: "inherit",
                  lineHeight: "inherit",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Login
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
