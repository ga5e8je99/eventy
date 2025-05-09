import Input from "./Input";
import { FormInputContext } from "../Contexts/Context";
import { useState } from "react";
import { Container, Button, Box, Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router";

const BASE_URL = "https://eventplanner-production-ce6e.up.railway.app";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error", // Changed default to error since we'll remove success alerts
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputValue.password !== inputValue.confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords do not match",
        severity: "error",
      });
      return;
    }

    try {

      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inputValue.name,
          email: inputValue.email,
          password: inputValue.password,
          role: "user",
        }),
      });

      // Log response details
      console.group("Response Details:");

      

      const data = await response.json();

      console.groupEnd();

      if (response.ok) {
        // Store only email in localStorage
        localStorage.setItem("userEmail", inputValue.email);

        // Clear other stored data if any
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("isLogin");

        // Redirect immediately without showing success alert
        navigate("/verifyAccount");
      } else {
        const errorMessage = data.message.toLowerCase().includes("email")
          ? "Email already registered, please use another email"
          : "Registration failed: " + data.message;

        setAlert({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
    } catch (error) {
      console.group("Connection Error:");
      console.error("Full error details:", error);
 
      console.groupEnd();

      setAlert({
        open: true,
        message: "Error connecting to server",
        severity: "error",
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Container
      style={{
        display: "grid",
        gridTemplateRows: "auto auto",
        gap: "20px",
      }}
    >
      {/* Only show error alerts */}
      {alert.severity === "error" && (
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateRows: "1fr 1fr 1fr 1fr",
          gap: "20px",
        }}
      >
        <FormInputContext.Provider
          value={{
            inputValue: inputValue.name,
            handelChange: (value) =>
              setInputValue({ ...inputValue, name: value }),
            labelTitle: "Full Name",
            type: "text",
            id: "signup-name-input",
          }}
        >
          <Input />
        </FormInputContext.Provider>

        <FormInputContext.Provider
          value={{
            inputValue: inputValue.email,
            handelChange: (value) =>
              setInputValue({ ...inputValue, email: value }),
            labelTitle: "Email",
            type: "email",
            id: "signup-email-input",
          }}
        >
          <Input />
        </FormInputContext.Provider>

        <FormInputContext.Provider
          value={{
            inputValue: inputValue.password,
            handelChange: (value) =>
              setInputValue({ ...inputValue, password: value }),
            labelTitle: "Password",
            type: "password",
            id: "signup-password-input",
          }}
        >
          <Input />
        </FormInputContext.Provider>

        <FormInputContext.Provider
          value={{
            inputValue: inputValue.confirmPassword,
            handelChange: (value) =>
              setInputValue({ ...inputValue, confirmPassword: value }),
            labelTitle: "Confirm Password",
            type: "password",
            id: "signup-confirm-password-input",
          }}
        >
          <Input />
        </FormInputContext.Provider>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            size="medium"
            type="submit"
            sx={{
              py: 1.5,
              width: "90%",
              borderRadius: "24px",
              backgroundColor: "#03235A",
              "&:hover": {
                backgroundColor: "#021d47",
                transform: "translateY(-2px)",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              },
              transition: "all 0.3s ease",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Register
          </Button>
        </Box>
      </form>
    </Container>
  );
}
