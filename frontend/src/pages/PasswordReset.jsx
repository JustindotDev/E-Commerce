import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { supabase } from "../lib/supabaseClient.js";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSend = async () => {
    if (!formData.email) {
      setError("Please enter your email address.");
      setOpenSnackbar(true);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(
      formData.email,
      {
        redirectTo: `${window.location.origin}/update-password`,
      }
    );

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox.");
    }
    setOpenSnackbar(true);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card
        sx={{
          width: 500,
          height: 300,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 12,
            }}
          >
            <IconButton disableRipple onClick={() => navigate("/login")}>
              <KeyboardBackspaceIcon sx={{ color: "blue", fontSize: 32 }} />
            </IconButton>
            <CardHeader
              title="Reset Password"
              titleTypographyProps={{ fontSize: 22 }}
            />
          </Box>

          <TextField
            placeholder="Enter your email address"
            type="email"
            value={formData.email}
            sx={{ width: "80%" }}
            onChange={(e) => setFormData({ email: e.target.value })}
          />
          <Button
            variant="contained"
            sx={{ width: "80%", padding: 1 }}
            onClick={handleSend}
          >
            Send
          </Button>
        </CardContent>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={error ? "error" : "success"}
          onClose={() => setOpenSnackbar(false)}
        >
          {error || message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PasswordReset;
