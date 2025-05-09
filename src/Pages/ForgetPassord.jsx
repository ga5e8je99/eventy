import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { FormInputContext } from "../Contexts/Context";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Input from "../Components/Input";
import Image from "../assets/image2.svg";
import axios from "axios";
import { useNavigate } from "react-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call the forgot password API
      const response = await axios.post(
        "https://eventplanner-production-ce6e.up.railway.app/api/auth/forgotpassword",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Store email in localStorage
        localStorage.setItem("emailForgetPassword", email);
        setIsSubmitted(true);

        // Optional: Redirect after successful submission
        setTimeout(() => {
          navigate("/reset-password"); // Assuming you have a reset password page
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(90deg,rgba(14, 55, 124, 0.47),#A0065147), url(${Image})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <LockIcon
            sx={{
              fontSize: 60,
              color: "primary.main",
              mb: 2,
              bgcolor: "rgba(66, 91, 215, 0.1)",
              p: 1.5,
              borderRadius: "50%",
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Forgot Your Password?
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            Enter your email and we'll send you a link to reset your password
          </Typography>

          {error && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "error.light", borderRadius: 2 }}>
              <Typography color="error.dark">{error}</Typography>
            </Box>
          )}

          {isSubmitted ? (
            <Box
              sx={{ mt: 3, p: 2, bgcolor: "success.light", borderRadius: 2 }}
            >
              <Typography color="success.dark">
                Reset link has been sent to your email. Please check your inbox.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <FormInputContext.Provider
                value={{
                  labelTitle: "Email Address",
                  handelChange: (e) => setEmail(e),
                  inputValue: email,
                  type: "email",
                  icon: <EmailIcon />,
                  register: null,
                  error: null,
                  sx: { mb: 3 },
                  required: true,
                }}
              >
                <Input />
              </FormInputContext.Provider>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  background: "linear-gradient(rgba(14, 55, 124, 0.47),#A0065147)",
                  "&:disabled": {
                    background: "#e0e0e0",
                  },
                }}
                disabled={!email || isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </Box>
          )}

          <Typography variant="body2" sx={{ mt: 3 }}>
            Remembered your password?{" "}
            <Button
              href="/login"
              color="primary"
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Sign In
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
