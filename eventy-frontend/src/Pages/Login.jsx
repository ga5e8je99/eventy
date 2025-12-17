import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import LoginImage from "../assets/Image/Login/Login.png";
import SignUpImage from "../assets/Image/Login/SignUp.png";
import { useState } from "react";
import axios from "axios";
import LogoEn from "../assets/Image/Logo/whiteLogoEn.png";
import LogoAr from "../assets/Image/Logo/whiteLogoAr.png";
import DarkLogoAr from "../assets/Image/Logo/blackLogoAr.png";
import DarkLogoEn from "../assets/Image/Logo/blackLogoEn.png";
export default function Login() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const theme = useTheme();
  const { t, i18n } = useTranslation("login");
  const currentLanguage = i18n.language;
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const language = i18n.language;
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [alertOpen, setAlertOpen] = useState(0);
  const direction = currentLanguage === "ar" ? "rtl" : "ltr";
  const apiURL = import.meta.env.VITE_API_URL;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPhone = /^[0-9]{11}$/;
  function validateEmail(email) {
    return regexEmail.test(email);
  }

  function validatePhone(phone) {
    return regexPhone.test(phone);
  }

  const gradientOverlay =
    theme.palette.mode === "light"
      ? "rgba(14,55,124,0.35), rgba(14,55,124,0.35) , rgba(249,249,249,0.35), rgba(249,249,249,0.85)"
      : "rgba(14,55,124,0.55), rgba(14,55,124,0.55), rgba(18,18,18,0.55), rgba(18,18,18,0.55)";
  const handelSingUp = async () => {
    if (
      !userData.name ||
      !userData.email ||
      !userData.password ||
      !userData.confirmPassword
    ) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    if (!validateEmail(userData.email)) {
      setErrorMessage("Invalid email");
      setAlertOpen(1);
      setTimeout(() => {
        setAlertOpen(0);
      }, 3000);
      return;
    }

    if (!validatePhone(userData.phone)) {
      setErrorMessage("Phone must be 10 digits");
      setAlertOpen(1);
      setTimeout(() => {
        setAlertOpen(0);
      }, 3000);
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setAlertOpen(1);
      setTimeout(() => {
        setAlertOpen(0);
      }, 3000);
      return;
    }

    try {
      const response = await axios.post(`${apiURL}/eventy/users/signup`, userData);
      console.log("User registered successfully:", response.data);
      window.location.href =
        "/verify-email/" + encodeURIComponent(userData.email);
    } catch (error) {
      // Axios Error
      if (error.response) {
        console.error("Error message from server:", error.response.data.error);
        setErrorMessage(error.response.data.error);
        setAlertOpen(1);
        setTimeout(() => {
          setAlertOpen(0);
        }, 3000);
      } else if (error.request) {
        setErrorMessage(error.request);
        setAlertOpen(1);
        setTimeout(() => {
          setAlertOpen(0);
        }, 3000);
      } else {
        // أي خطأ تاني
        setErrorMessage(error.message);
        setAlertOpen(1);
        setTimeout(() => {
          setAlertOpen(0);
        }, 3000);
      }
    }
  };
  const handelLogin = async () => {
    // تحقق من صحة الإدخالات هنا إذا لزم الأمر
    try {
      const response = await axios.post(`${apiURL}/eventy/users/login`, loginData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.user._id);
      
      window.location.href = "/home";
    } catch (error) {
      if (error.response) {
        console.error("Error message from server:", error.response.data.error);
        setErrorMessage(error.response.data.error);
        setAlertOpen(1);
        setTimeout(() => {
          setAlertOpen(0);
        }, 3000);
      } else if (error.request) {
        setErrorMessage(error.request);
        setAlertOpen(1);
        setTimeout(() => {
          setAlertOpen(0);
        }, 3000);
      } else {
        // أي خطأ تاني
        setErrorMessage(error.message);
        setAlertOpen(1);
        setTimeout(() => {
          setAlertOpen(0);
        }, 3000);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
        backgroundImage: `linear-gradient(to bottom, ${gradientOverlay}), url(${
          isLoginMode ? LoginImage : SignUpImage
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        direction: direction,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Grid container sx={{ height: "90vh", position: "relative" }}>
          <Grid
            item
            size={{ sm: 12, md: 6 }}
            sx={{
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: 4,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              backgroundColor:
                theme.palette.mode === "light" ? "#fff" : "#121212",
              position: isMobile ? "static" : "absolute",
              top: 0,
              height: "100%",
              left: isLoginMode ? 0 : "50%",

              transition: "all 0.7s ease-in-out",
            }}
          >
            {isLoginMode ? (
              <>
                <Typography variant="h4" fontWeight={700}>
                  {t("login.titleSlider1")}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  {t("login.descriptionSlider1")}
                </Typography>

                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    mt: 3,
                  }}
                >
                  <TextField
                    label={t("login.emailPlaceholder")}
                    variant="outlined"
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? theme.palette.primary.light
                              : theme.palette.primary.main,
                          backgroundColor: "transparent",
                        },
                    }}
                  />

                  <TextField
                    label={t("login.passwordPlaceholder")}
                    type="password"
                    variant="outlined"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? theme.palette.primary.light
                              : theme.palette.primary.main,
                          backgroundColor: "transparent",
                        },
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{
                              color: theme.palette.mode === "dark"
                                ? "#ffffff"
                                : "#000000",
                              "&.Mui-checked": {
                                color: theme.palette.mode === "dark"
                                  ? theme.palette.primary.light
                                  : theme.palette.primary.main,
                              },
                              "&:hover": {
                                backgroundColor: theme.palette.mode === "dark"
                                  ? "rgba(14, 55, 124, 0.1)"
                                  : "rgba(14, 55, 124, 0.08)",
                              },
                            }}
                          />
                        }
                        label={t("login.rememberMe")}
                      />
                    </Box>

                    <Link
                      to="/forgot-password"
                      style={{
                        textDecoration: "none",
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                        fontSize: "0.9rem",
                      }}
                    >
                      {t("login.forgotPassword")}
                    </Link>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      mt: 1,
                      py: 1.2,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                    onClick={handelLogin}
                  >
                    {t("login.loginButton")}
                  </Button>
                </FormControl>

                <Button
                  variant="outlined"
                  color={
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.light
                      : "primary"
                  }
                  sx={{
                    mt: 2,
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    textTransform: "none",
                  }}
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="google"
                    width="20"
                    height="20"
                  />
                  {t("login.loginGoogleButton")}
                </Button>

                <Typography
                  variant="body2"
                  sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}
                >
                  {t("login.signUpNoAccount")}{" "}
                  <Link
                    onClick={() => {
                      isLoginMode
                        ? setIsLoginMode(false)
                        : setIsLoginMode(true);
                    }}
                    style={{
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    {t("login.signUp")}
                  </Link>
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
                >
                  {t("login.copyright")}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h4" fontWeight={700}>
                  {t("signUp.titleSlider1")}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  {t("signUp.descriptionSlider1")}
                </Typography>

                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    mt: 3,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label={t("signUp.fullNamePlaceholder")}
                      variant="outlined"
                      fullWidth
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      sx={{
                        "& .MuiInputLabel-root.Mui-focused": {
                          color:
                            theme.palette.mode === "dark"
                              ? theme.palette.primary.light
                              : theme.palette.primary.main,
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor:
                              theme.palette.mode === "dark"
                                ? theme.palette.primary.light
                                : theme.palette.primary.main,
                            backgroundColor: "transparent",
                          },
                      }}
                    />
                    <TextField
                      label={t("signUp.phonePlaceholder")}
                      variant="outlined"
                      fullWidth
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                      sx={{
                        "& .MuiInputLabel-root.Mui-focused": {
                          color:
                            theme.palette.mode === "dark"
                              ? theme.palette.primary.light
                              : theme.palette.primary.main,
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor:
                              theme.palette.mode === "dark"
                                ? theme.palette.primary.light
                                : theme.palette.primary.main,
                            backgroundColor: "transparent",
                          },
                      }}
                    />
                  </Box>
                  <TextField
                    label={t("signUp.emailPlaceholder")}
                    variant="outlined"
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? theme.palette.primary.light
                              : theme.palette.primary.main,
                          backgroundColor: "transparent",
                        },
                    }}
                  />

                  <TextField
                    label={t("signUp.passwordPlaceholder")}
                    type="password"
                    variant="outlined"
                    value={userData.password}
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? theme.palette.primary.light
                              : theme.palette.primary.main,
                          backgroundColor: "transparent",
                        },
                    }}
                  />
                  <TextField
                    label={t("signUp.confirmPasswordPlaceholder")}
                    type="password"
                    variant="outlined"
                    value={userData.confirmPassword}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        confirmPassword: e.target.value,
                      })
                    }
                    sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? theme.palette.primary.light
                              : theme.palette.primary.main,
                          backgroundColor: "transparent",
                        },
                    }}
                  />

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      mt: 1,
                      py: 1.2,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                    onClick={handelSingUp}
                  >
                    {t("signUp.signUpButton")}
                  </Button>
                </FormControl>

                <Typography
                  variant="body2"
                  sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}
                >
                  {t("signUp.alreadyHaveAccount")}
                  <Link
                    onClick={() => {
                      isLoginMode
                        ? setIsLoginMode(false)
                        : setIsLoginMode(true);
                    }}
                    style={{
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    {t("signUp.login")}
                  </Link>
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
                >
                  {t("login.copyright")}
                </Typography>
              </>
            )}
          </Grid>

          {/* Right Side */}
          <Grid
            item
            size={{ sm: 0, md: 6 }}
            sx={{
              display: isMobile ? "none" : "block",
              backgroundImage: `linear-gradient(to bottom, ${gradientOverlay}), url(${
                isLoginMode ? LoginImage : SignUpImage
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              position: "absolute",
              top: 0,
              height: "100%",
              right: isLoginMode ? 0 : "50%",
              transition: "all 0.7s ease-in-out",
              zIndex: 99,
              width: isMobile ? "100%" : "50%",
            }}
          >
            <Container
              maxWidth="sm"
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box>
                  <img
                    src={
                      language === "ar"
                        ? theme.palette.mode === "light"
                          ? DarkLogoAr
                          : LogoAr
                        : theme.palette.mode === "light"
                        ? DarkLogoEn
                        : LogoEn
                    }
                    alt="Eventy Logo"
                    width={200}
                  />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    color: theme.palette.mode === "dark" ? "#fff" : "#121212",
                    textAlign: "center",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    lineHeight: 1.2,
                  }}
                >
                  {isLoginMode
                    ? t("login.titleSlider2")
                    : t("signUp.titleSlider2")}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#dcdcdc" : "#232323ff",
                    textAlign: "center",
                    mt: 2,
                    maxWidth: "420px",
                    mx: "auto",
                  }}
                >
                  {isLoginMode
                    ? t("login.descriptionSlider2")
                    : t("signUp.descriptionSlider2")}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#dcdcdc" : "#2f2f2fff",
                    textAlign: "center",
                    mt: 2,
                    maxWidth: "420px",
                    mx: "auto",
                  }}
                >
                  {isLoginMode
                    ? t("login.joinSubtitle")
                    : t("signUp.joinSubtitle")}
                </Typography>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Container>
      <Alert
        severity="error"
        sx={{
          zIndex: 1300,
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        style={{ opacity: alertOpen, transition: "opacity 0.5s ease-in-out" }}
      >
        {errorMessage}
      </Alert>
    </Box>
  );
}
