import "./App.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Onboarding from "./Pages/Onboarding";
import { Routes, Route } from "react-router";
import Home from "./Pages/Home";
import Create from "./Pages/Create";
import Schedule from "./Pages/Schedule";
import ContactUs from "./Pages/ContactUs";
import Search from "./Pages/Search";
import Login from "./Pages/Login";
import EventDetails from "./Pages/EventDetails";
import PaymentPage from "./Pages/PaymenPage";
import VerifyAccount from "./Pages/VerifyAccount";
import ForgetPassword from "./Pages/ForgetPassord";
import WelcomePage from "./Pages/WelcomePage";
import ProfilePage from "./Pages/ProfilePage";
import EditProfilePage from "./Pages/EditProfilePage";

const theme = createTheme({
  palette: {
    primary: {
      light: "rgb(140, 191, 255)",
      main: "#114084",
      dark: "#03235A",
      contrastText: "#fff",
    },
    secondary: {
      light: "#D13B7F",
      main: "#A00651",
      dark: "#6E0038",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: "Inter",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ fontFamily: theme.typography.fontFamily }}>
        <Routes>
          <Route element={<Onboarding />} path="/" />
          <Route element={<Home />} path="/home" />
          <Route element={<Create />} path="/create" />
          <Route element={<Schedule />} path="/schedule" />
          <Route element={<Search />} path="/search" />
          <Route element={<ContactUs />} path="/contactUs" />
          <Route element={<Login />} path="/login" />
          <Route element={<EventDetails />} path="/:name/:id" />
          <Route element={<VerifyAccount />} path="/verifyAccount" />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route element={<ForgetPassword />} path="/forgot-password" />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route element={<WelcomePage />} path="/interests" />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
