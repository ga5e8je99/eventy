import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ImageLogin from "../assets/loginBackground.png";
import SignUpImage from "../assets/signUpBackground.svg";
import LoginForm from "../Components/LoginForm";
import SignUpForm from "../Components/SignUpForm";
import Logo from "../assets/logo.svg";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  

  const authContent = [
    {
      type: "login",
      image: ImageLogin,
      headerText: "Welcome Back to Eventy!",
      descriptionText:
        "Log in to discover, join, and manage amazing events tailored to your interests. Your next adventure is just a click away!",
      formComponent: LoginForm,
      background: `url("${ImageLogin}"), linear-gradient(rgba(14,55,124,0.47),#A0065147)`,
    },
    {
      type: "signup",
      image: SignUpImage,
      headerText: "Join Eventy Today!",
      descriptionText:
        "Sign up now and become part of a vibrant community. Create, explore, and enjoy events that inspire and connect people around you.",
      formComponent: SignUpForm,
      background: `url("${SignUpImage}"), linear-gradient(rgba(14, 55, 124, 0.47),#A0065147)`,
    },
  ];

  const currentContent = isLogin ? authContent[0] : authContent[1];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: isLogin
          ? `url("${ImageLogin}"), linear-gradient(rgba(14, 55, 124, 0.47),#A0065147)`
          : `url("${SignUpImage}"), linear-gradient(rgba(14, 55, 124, 0.47),#A0065147)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        p: 0,
        m: 0,
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          component={Paper}
          elevation={6}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            minHeight: "95vh",
            position: "relative",
          }}
        >
          {/* Left Section - Image & Text */}
          <Grid
            item
            xs={0}
            md={6}
            component={motion.div}
            initial={{ x: isLogin ? "50%" : "0" }}
            animate={{ x: "0%" }}
            transition={{ type: "tween", stiffness: 100 }}
            sx={{
              background: currentContent.background,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              p: 4,
              textAlign: "center",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay",
              position: "absolute",
              top: 0,
              right: isLogin ? "0" : "50%",
              width: "50%",
              height: "100%",
              zIndex: 2,
              transition: "all 0.6s ease",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentContent.type}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    textShadow:
                      "2px -2px 10px rgba(14, 55, 124, 0.47), -1px 1px 20px #A0065147",
                  }}
                >
                  {currentContent.headerText}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 200,
                    fontSize: "medium",
                    textShadow:
                      " 2px -2px 10px rgb(14 55 124 / 82%), -1px 1px 20px #a00651cf",
                  }}
                >
                  {currentContent.descriptionText}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Grid>

          {/* Right Section - Form */}
          <Grid
            item
            xs={12}
            md={6}
            component={motion.div}
            initial={{ x: isLogin ? "0" : "50%" }}
            animate={{ x: "0" }}
            transition={{ type: "spring", stiffness: 100 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginLeft: { md: isLogin ? "0" : "auto" },
              marginRight: { md: isLogin ? "auto" : "0" },
              width: { md: "50%", xs: "100%" },
              position: "absolute",
              top: 0,
              right: { md: isLogin ? "50%" : "0" },
              background: "white",
              height: "100%",

              transition: "all 0.5s ease-in-out",
            }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: "center", marginBottom: "20px" }}
              >
                <img
                  src={Logo}
                  alt="logo"
                  style={{
                    width: "200px",
                    margin: "auto",
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants} style={{ flexGrow: 1 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? "login" : "signup"}
                    initial={{ opacity: 0, x: isLogin ? 100 : -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isLogin ? -100 : 100 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {isLogin ? <LoginForm /> : <SignUpForm />}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography variant="body2" textAlign="center">
                  {isLogin ? (
                    <>
                      Don't have an account?{" "}
                      <Button
                        onClick={() => setIsLogin(false)}
                        sx={{
                          textTransform: "none",
                          color: "primary.main",
                          fontWeight: 600,
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Sign up
                      </Button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Button
                        onClick={() => setIsLogin(true)}
                        sx={{
                          textTransform: "none",
                          color: "primary.main",
                          fontWeight: 600,
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Login
                      </Button>
                    </>
                  )}
                </Typography>
                <Typography
                  component="small"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    color: "rgb(111, 111, 111)",
                    margin: "10px 0",
                    fontSize: "0.75rem",
                  }}
                >
                  © 2025 Eventy. All Rights Reserved.
                </Typography>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
