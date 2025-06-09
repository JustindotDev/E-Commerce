import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { supabase } from "../lib/supabaseClient";
import { validatePassword } from "../lib/password-validator";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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

    try {
      setIsUpdating(true);
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
    } catch (error) {
      setError(error);
    } finally {
      setIsUpdating(false);
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
            type={showPassword ? "text" : "password"}
            value={formData.password}
            sx={{ width: "80%" }}
            onChange={(e) => {
              setPasswordMatchError("");
              setError("");
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
          <TextField
            error={error || passwordMatchError ? true : false}
            helperText={error || passwordMatchError || ""}
            label="Confirm password"
            placeholder="Confirm your new password"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            sx={{ width: "80%" }}
            onChange={(e) => {
              setPasswordMatchError("");
              setError("");
              setFormData({ ...formData, confirmPassword: e.target.value });
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showConfirmPassword ? "hide password" : "show password"
                    }
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? (
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
            loading={isUpdating}
            loadingPosition="start"
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
