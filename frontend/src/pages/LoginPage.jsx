import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
  Button,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuthStore } from "../store/useAuthStore";
import ecommerce from "../assets/E-Commerce.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { logIn, isLoggingIn, Oauth, emailError, passwordError } =
    useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    logIn(formData, navigate);
  };

  const handleOAuthLogin = (e) => {
    e.preventDefault();

    Oauth("google");
  };

  return (
    <div className="h-screen w-screen">
      <div className="h-full flex justify-center items-center gap-45">
        <img className="h-full" src={ecommerce} alt="" />
        <Card
          sx={{
            width: 400,
            minHeight: 500,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CardHeader
              title="Login"
              sx={{ textAlign: "center" }}
              titleTypographyProps={{ fontWeight: "bold", fontSize: 24 }}
            />

            <TextField
              error={emailError ? true : false}
              helperText={emailError || ""}
              name="email"
              type="text"
              value={formData.identifier}
              label="Email/Phone number"
              variant="outlined"
              sx={{ width: 350, alignSelf: "center" }}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
            />

            <TextField
              error={passwordError ? true : false}
              helperText={passwordError || ""}
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              label="Password"
              variant="outlined"
              sx={{ width: 350, alignSelf: "center" }}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
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
            />

            <Button
              fullWidth
              loading={isLoggingIn}
              loadingPosition="start"
              variant="contained"
              size="medium"
              sx={{ width: 350 }}
              onClick={handleSubmit}
              disabled={isLoggingIn}
            >
              Log in
            </Button>
            <Box
              sx={{
                width: 350,
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: -1,
                marginLeft: 1,
              }}
            >
              <Button
                onClick={() => navigate("/reset-password")}
                sx={{
                  color: "darkblue",
                  textTransform: "none",
                  padding: 0,
                  minWidth: "auto",
                  fontSize: "12px",
                  lineHeight: "inherit",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                Forgot Password
              </Button>
            </Box>
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
              onClick={handleOAuthLogin}
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
                marginTop: 0.8,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              Don't have an account?
              <Button
                onClick={() => navigate("/signup")}
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
                Sign up
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
