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
} from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";
import ecommerce from "../assets/E-Commerce.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { logIn, isLogginIn, Oauth } = useAuthStore();

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    logIn(formData);
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
              gap: 2,
            }}
          >
            <CardHeader
              title="Login"
              sx={{ textAlign: "center" }}
              titleTypographyProps={{ fontWeight: "bold", fontSize: 24 }}
            />

            <TextField
              name="email"
              type="text"
              value={formData.email || formData.phone}
              label="Email/Phone number"
              variant="outlined"
              sx={{ width: 350, alignSelf: "center" }}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[^\s@]+@[^\s@]+\.(com)$/.test(value)) {
                  setFormData({ ...formData, email: value, phone: "" });
                } else {
                  setFormData({ ...formData, phone: value, email: "" });
                }
              }}
            />

            <TextField
              name="password"
              type="password"
              value={formData.password}
              label="Password"
              variant="outlined"
              sx={{ width: 350, alignSelf: "center" }}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
            />

            <Button
              variant="contained"
              size="medium"
              sx={{ width: 350 }}
              onClick={handleSubmit}
              disabled={isLogginIn}
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
