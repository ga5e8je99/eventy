import Input from "./Input";
import { FormInputContext } from "../Contexts/Context";
import { useState } from "react";
import {
  Button,
  Container,
  Box,
  Typography,
  Link,
  Alert,
  Snackbar,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router"; // تم التصحيح هنا

export default function LoginForm() {
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!inputValue.email || !inputValue.password) {
      setError("Please fill in all fields");
      setOpenSnackbar(true);
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch("https://eventplanner-production-ce6e.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputValue.email,
          password: inputValue.password
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  

      if (data.data.user.role === 'admin') {
        throw new Error("Admins cannot login through this portal");
      }
  
      // تخزين token و user ID في localStorage
      localStorage.setItem("authToken", data.data.accessToken);
      localStorage.setItem("userId", data.data.user._id); 

      
      if (data.data.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }
  
      navigate("/interests");
  
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      setOpenSnackbar(true);
      // في حالة كان المستخدم admin، نقوم بمسح أي بيانات تم تخزينها
      if (err.message === "Admins cannot login through this portal") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        py: 4,
        px: 2,
      }}
      maxWidth={"lg"}
    >
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          width: "100%",
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box mb={4}>
            <FormInputContext.Provider
              value={{
                inputValue: inputValue.email,
                handelChange: (value) =>
                  setInputValue({ ...inputValue, email: value }),
                labelTitle: "Email",
                type: "email",
              }}
            >
              <Input />
            </FormInputContext.Provider>
          </Box>

          <Box mb={3}>
            <FormInputContext.Provider
              value={{
                inputValue: inputValue.password,
                handelChange: (value) =>
                  setInputValue({ ...inputValue, password: value }),
                labelTitle: "Password",
                type: "password",
              }}
            >
              <Input />
            </FormInputContext.Provider>
          </Box>

          <Box textAlign="right" mb={5}>
            <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": {
                  color: "#03235A",
                  fontWeight: "medium",
                },
                transition: "all 0.3s ease",
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2 }}>
            <Button
              variant="contained"
              size="medium"
              type="submit"
              disabled={isLoading}
              sx={{
                py: 1.5,
                width: '90%',
                borderRadius: '24px',
                backgroundColor: "#03235A",
                "&:hover": { 
                  backgroundColor: "#021d47",
                  transform: 'translateY(-2px)',
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
                },
                transition: "all 0.3s ease",
                fontSize: "1rem",
                fontWeight: "bold",
                "&:disabled": {
                  backgroundColor: "#cccccc",
                  color: "#666666"
                }
              }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}