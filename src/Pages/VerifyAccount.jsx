import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Paper,
  Container,
  Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate("/register"); // Redirect if no email found
    }
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && success) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && success) {
      navigate("/welcome"); // Redirect after countdown
    }
    return () => clearTimeout(timer);
  }, [countdown, success, navigate]);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://eventplanner-production-b14f.up.railway.app/api/auth/verifyUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            confirmCode: Number(confirmCode),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setSuccess(true);
      localStorage.setItem("isVerified", "true");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://eventplanner-production-b14f.up.railway.app/api/auth/resendCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to resend code");
      }
      localStorage.setItem("authToken", data.token);

      setError(null);
      setCountdown(30); // Reset countdown
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <CheckCircleIcon color="primary" sx={{ fontSize: 80 }} />

          <Typography variant="h4" component="h1" fontWeight="bold">
            Verify Your Email
          </Typography>

          <Typography variant="body1" textAlign="center" color="text.secondary">
            We've sent a verification code to {email}. Please enter it below.
          </Typography>

          <Grid container spacing={2} sx={{ width: "100%", mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Confirmation Code"
                fullWidth
                type="number"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                variant="outlined"
                size="medium"
                disabled={success}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </Grid>

            {success && (
              <Grid item xs={12}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Account verified successfully! Redirecting in {countdown}{" "}
                  seconds...
                </Alert>
              </Grid>
            )}

            {error && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleVerify}
                disabled={loading || !confirmCode || success}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {success ? "Verified" : "Verify Account"}
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleResendCode}
                disabled={loading || success}
                startIcon={<EmailIcon />}
              >
                Resend Code
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyAccount;
