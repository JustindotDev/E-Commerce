import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { supabase } from "../lib/supabaseClient";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const passwordValidation = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in both fields.");
      setOpenSnackbar(true);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Password does not match.");
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const success = passwordValidation();

    if (success) {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        setError(error.message);
      }

      setMessage("Password updated successfully.");
      setOpenSnackbar(true);

      setTimeout(() => navigate("/login"), 2000);
    }
  };
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card
        sx={{
          width: 500,
          height: 350,
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
            title="Update Password"
            titleTypographyProps={{ fontSize: 22 }}
          />

          <TextField
            label="New password"
            placeholder="Enter your new password"
            type="password"
            value={formData.password}
            sx={{ width: "80%" }}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <TextField
            label="Confirm new password"
            placeholder="Confirm your new password"
            type="password"
            value={formData.confirmPassword}
            sx={{ width: "80%" }}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          <Button
            variant="contained"
            sx={{ width: "80%", padding: 1 }}
            onClick={handleSubmit}
          >
            Submit
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

export default UpdatePassword;
