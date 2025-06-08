import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { supabase } from "../lib/supabaseClient";
import { validatePassword } from "../lib/password-validator";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const passwordValidation = () => {
    const passwordValidator = validatePassword(formData.password);
    if (!formData.password || !formData.confirmPassword) {
      setError("Missing required fields.");

      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Password does not match.");
      return false;
    }
    if (!passwordValidator.isValid) {
      setError(passwordValidator.message);
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
      } else {
        setMessage("All Set! Let’s Get You Logged In");
        setOpenDialog(true);
      }
    }
  };

  const handleProceed = () => {
    setOpenDialog(false);
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card
        sx={{
          width: 500,
          minHeight: 350,
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
            error={error ? true : false}
            helperText={error || ""}
            label="New password"
            placeholder="Enter your new password"
            type="password"
            value={formData.password}
            sx={{ width: "80%" }}
            onChange={(e) => {
              setPasswordMatchError("");
              setError("");
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          <TextField
            error={error || passwordMatchError ? true : false}
            helperText={error || passwordMatchError || ""}
            label="Confirm password"
            placeholder="Confirm your new password"
            type="password"
            value={formData.confirmPassword}
            sx={{ width: "80%" }}
            onChange={(e) => {
              setPasswordMatchError("");
              setError("");
              setFormData({ ...formData, confirmPassword: e.target.value });
            }}
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
      <Dialog
        open={openDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Password Changed!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProceed} autoFocus>
            Proceed to Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdatePassword;
