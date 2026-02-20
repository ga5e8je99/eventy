import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  Stack,
  TextField,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRef, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function VerifyEmail() {
  const { email } = useParams();
  const theme = useTheme();
  const decodedEmail = decodeURIComponent(email);
  const apiURL = import.meta.env.VITE_API_URL;
  const { t } = useTranslation("verifyEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [openAlert, setOpenAlert] = useState(false);

  // === Improved OTP Logic ===
  const handleOtpChange = (value, index) => {
    const filtered = value.replace(/[^0-9]/g, ""); 

    // منع الإدخال بدون ملء السابق
    if (index > 0 && otp[index - 1] === "") return;

    const newOtp = [...otp];
    newOtp[index] = filtered;
    setOtp(newOtp);


    if (filtered && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index] === "") {
        if (index > 0) inputRefs.current[index - 1]?.focus();
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    try {
      const response = await axios.post(`${apiURL}/eventy/users/verify`, {
        email: decodedEmail,
        code: enteredOtp,
      });
      localStorage.setItem("email", JSON.stringify(response.data.user.email));
      localStorage.setItem("token", response.data.token);
      window.location.href = "/";
    } catch (error) {
      setErrorMessage(error.response?.data?.message);
      setOpenAlert(true);
      setTimeout(() => setOpenAlert(false), 5000);
    }
  };

  const handleResend = async () => {
    try {
      const response = await axios.post(`${apiURL}/eventy/users/resend-verification`, {
        email: decodedEmail,
      });

      console.log("Verification code resent:", response.data);
    } catch (error) {
      console.error("Error resending verification code:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(
          180deg,
          ${theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main} 0%,
          ${theme.palette.primary.light} 30%,
          ${theme.palette.mode === "light" ? "#f9f9f9" : "#121212"} 100%
        )`,
        p: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          p: 5,
          borderRadius: "20px",
          textAlign: "center",
          backgroundColor:
            theme.palette.mode === "light" ? "#ffffffdd" : "#1e1e1edd",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 25px rgba(0,0,0,0.18)",
        }}
      >
        <Typography variant="h4" fontWeight={800} mb={2} letterSpacing={1}>
          {t("verifyEmailTitle")}
        </Typography>

        <Typography variant="body1" sx={{ opacity: 0.8, mb: 1 }}>
          {t("verifyEmailDesc")}
        </Typography>

        <Typography variant="body1" fontWeight="bold" sx={{ mb: 3 }}>
          {decodedEmail}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
          {t("enterCodeDesc")}
        </Typography>

        {/* OTP Fields */}
        <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
          {otp.map((digit, index) => (
            <TextField
              key={`otp-${index}`}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: "center",
                  fontSize: "22px",
                  fontWeight: 800,
                  padding: "10px",
                },
              }}
              sx={{
                width: "50px",
              }}
            />
          ))}
        </Stack>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.2, fontWeight: 700, borderRadius: "12px" }}
          endIcon={<CheckCircleIcon />}
          onClick={handleVerify}
        >
          {t("verifyButton")}
        </Button>

        <Typography variant="body2" mt={3}>
          {t("didntReceiveCode")}{" "}
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={handleResend}
          >
            {t("resendLink")}
          </span>
        </Typography>
      </Container>

      <Alert
        severity="error"
        sx={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          display: openAlert ? "flex" : "none",
        }}
      >
        {errorMessage}
      </Alert>
    </Box>
  );
}
