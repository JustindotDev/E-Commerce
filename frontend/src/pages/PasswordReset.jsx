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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { supabase } from "../lib/supabaseClient.js";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSend = async () => {
    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }
    try {
      setIsSending(true);
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
        setOpenDialog(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
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
            error={error ? true : false}
            helperText={error || ""}
            placeholder="Enter your email address"
            type="email"
            value={formData.email}
            sx={{ width: "80%" }}
            onChange={(e) => {
              setError("");
              setFormData({ email: e.target.value });
            }}
          />
          <Button
            fullWidth
            loading={isSending}
            loadingPosition="start"
            variant="contained"
            sx={{ width: "80%", padding: 1 }}
            onClick={handleSend}
          >
            Send
          </Button>
        </CardContent>
      </Card>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Sent!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PasswordReset;
