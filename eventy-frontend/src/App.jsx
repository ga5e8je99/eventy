import Onboarding from "./Pages/Onboarding";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { ModeContext } from "./Contexts/ModeContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import i18n from "./i18n";
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Route, Routes } from "react-router";
import Home from "./Pages/Home";
import ContactUs from "./Pages/ContactUs";
import Create from "./Pages/Create";
import Login from "./Pages/Login";
import VerifyEmail from "./Pages/VerifyEmail";
import { CheckToken } from "./Contexts/CheckToken";
import axios from "axios";
import CreateSteps from "./Pages/CreateSteps";
import Profile from "./Pages/Profile";
import ScrollRouter from "./Components/ScrollRouter";
import ScrollTop from "./Components/ScrollTop";
import Box from '@mui/material/Box';
import Search from "./Pages/Search";
import Event from "./Pages/Event";
import BookingPage from "./Pages/BookingPage";
import { LocationContext } from "./Contexts/LocationContect";
function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const lang = i18n.language;
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [location,setLocation]=useState({});
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const checkTokenValidity = async () => {
      if (!token) {
        if (isMounted) setIsTokenValid(false);
        return;
      }

      try {
        const response = await axios.post(
          `${API_URL}/eventy/users/check-token`,
          { token },
          { signal: controller.signal }
        );

        if (!isMounted) return;

        if (response.data.valid && !response.data.expired) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          localStorage.removeItem("token");
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error refreshing token:", error);
        setIsTokenValid(false);
        localStorage.removeItem("token");
      }
    };

    checkTokenValidity();

    // 🔥 Cleanup Function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [API_URL, token]);

  const [mode, setMode] = useState(
    localStorage.getItem("mode") || (prefersDarkMode ? "dark" : "light")
  );
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        light: "#4d87ecff",
        main: "#0e367cff",
        dark: "#092452ff",
        contrastText: "#fff",
      },
      secondary: {
        light: "#e8589dff",
        main: "#A00651",
        dark: "#5a082fff",
        contrastText: "#000",
      },
      error: {
        main: "#A00651",
      },
      success: {
        main: "#0E377C",
      },
    },
    direction: lang === "ar" ? "rtl" : "ltr",
    typography: {
      fontFamily: lang === "ar" ? "IBM" : "Inter",
    },
  });

  return (
    <CheckToken.Provider value={isTokenValid}>
      <ModeContext.Provider value={{ mode, setMode }}>
        <ThemeProvider theme={theme}>
          <LocationContext.Provider value={{location,setLocation}}>
          
          <CssBaseline />
          <ScrollRouter/>
          <Box id="back-to-top-anchor" />


          <Routes>
            {/* Public: اللي مفروض بس اللي مش عامل Login يدخلها */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Onboarding />
                </PublicRoute>
              }
            />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/verify-email/:email"
              element={
                <PublicRoute>
                  <VerifyEmail />
                </PublicRoute>
              }
            />

            {/* Protected: لازم توكن صالح */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/contact"
              element={
                
                  <ContactUs />
                
              }
            />
            <Route
              path="/create"
              element={
                
                  <Create />
                
              }
            />
            <Route
              path="/create/createSteps"
              element={
                
                  <CreateSteps />
                
              }
            />
             <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile/>
                </ProtectedRoute>
              }
            />
          <Route
          path="/search"
          element={
            <Search />
          }
        />
        <Route path="/event/:id"
          element={
            <Event/>
          }
        />
        <Route path="/booking/:id"
          element={
            <BookingPage/>
          }
        />
          </Routes>
          <ScrollTop/>
          </LocationContext.Provider>
        </ThemeProvider>
      </ModeContext.Provider>
    </CheckToken.Provider>
  );
}

export default App;
