import { Snackbar, Alert } from "@mui/material";

const SnackBar = ({
  open,
  message,
  severity = "success",
  autoHideDuration = 5000,
  position = { vertical: "top", horizontal: "center" },
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
