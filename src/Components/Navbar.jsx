import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";
import "../App.css";
import LoginIcon from "@mui/icons-material/Login";
import {
  Button,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageDropdown from "./LanguageDropdown";
import { Link } from "react-router";
import "../App.css";
import axios from "axios";
import { styled } from "@mui/material/styles";

const NavLink = styled(Link)(({ active }) => ({
  textDecoration: "none",
  position: "relative",
  color: active ? "#660030" : "#114084",
  fontWeight: 600,
  fontFamily: "Inter",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    color: "#660030",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -4,
    left: 0,
    width: active ? "100%" : 0,
    height: "2.5px",
    backgroundColor: "#660030",
    borderRadius: "24px",
    transition: "all 0.3s ease-in-out",
  },
  "&:hover::after": {
    width: "100%",
  },
}));

export default function Navbar({ activePage }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  useEffect(() => {
    const checkTokenAndFetchUser = async () => {
      const expired = isTokenExpired(token);
      setTokenValid(!expired);

      if (!expired && token && userId) {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://eventplanner-production-ce6e.up.railway.app/api/auth/viewprofile/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserData(response.data);
          console.log(response.data);
        } catch (err) {
          if (err.response?.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userId");
            setTokenValid(false);
          }
          setError(err.response?.data?.message || err.message);
          console.error("Failed to fetch user profile:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    checkTokenAndFetchUser();
  }, [token, userId]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const pagesLink = [
    { title: "Home", path: "/home", id: 1 },
    { title: "Create", path: "/create", id: 2 },
    { title: "Schedule", path: "/schedule", id: 3 },
    { title: "Search", path: "/search", id: 4 },
    { title: "Contact us", path: "/contactUs", id: 5 },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "rgba(255,255,255,0.99)",
        padding: "10px",
        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
        zIndex: 99,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar>
          <Box>
            <Link to={!tokenValid ? "/" : "/home"}>
              <img
                src={Logo}
                alt="Logo"
                style={{ marginRight: "30px", height: "40px" }}
              />
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {tokenValid ? (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: "15px",
                alignItems: "center",
                marginLeft: "20px",
              }}
            >
              {pagesLink.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  active={activePage === link.title ? 1 : 0}
                >
                  {link.title}
                </NavLink>
              ))}
            </Box>
          ) : null}

          {/* Right Side - User Controls */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: "20px",
              marginLeft: "auto",
            }}
          >
            {!tokenValid ? (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<LoginIcon />}
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: "20px",
                    px: 2,
                    color: "#A00651",
                    borderColor: "#A00651",
                    "&:hover": {
                      backgroundColor: "rgba(160, 6, 81, 0.04)",
                      borderColor: "#A00651",
                    },
                  }}
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
                <LanguageDropdown />
              </>
            ) : (
              <>
                <IconButton
                  color="inherit"
                  sx={{
                    color: "#666",
                    "&:hover": {
                      backgroundColor: "rgba(160, 6, 81, 0.1)",
                    },
                  }}
                >
                  <Badge badgeContent={4} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  color="inherit"
                  sx={{
                    color: "#666",
                    "&:hover": {
                      backgroundColor: "rgba(160, 6, 81, 0.1)",
                    },
                  }}
                >
                  <Badge badgeContent={2} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Avatar
                  sx={{
                    bgcolor: !userData?.image ? "#A00651" : "transparent", // خلفية فقط لو مفيش صورة
                    width: 32,
                    height: 32,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                  component={Link}
                  to={`/profile/${userData?._id}`}
                  src={userData?.image || undefined}
                >
                  {!userData?.image && userData?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </>
            )}
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", md: "none" }, marginLeft: "auto" }}>
            <IconButton
              color="inherit"
              sx={{ color: "black" }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={isDrawerOpen}
              onClose={toggleDrawer(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  width: "65vw",
                  maxWidth: "300px",
                },
              }}
            >
              <List>
                {tokenValid
                  ? pagesLink.map((link) => (
                      <React.Fragment key={link.id}>
                        <ListItem
                          button
                          component={Link}
                          to={link.path}
                          sx={{
                            fontWeight:
                              activePage === link.title ? "600" : "400",
                            py: 1.5,
                          }}
                          onClick={toggleDrawer(false)}
                        >
                          <ListItemText primary={link.title} />
                        </ListItem>
                        <hr style={{ margin: 0, opacity: 0.2 }} />
                      </React.Fragment>
                    ))
                  : null}

                {!tokenValid ? (
                  <>
                    <ListItem sx={{ py: 1.5 }}>
                      <LanguageDropdown fullWidth />
                    </ListItem>
                    <hr style={{ margin: 0, opacity: 0.2 }} />
                    <ListItem sx={{ py: 1.5 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<LoginIcon />}
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "20px",
                          backgroundColor: "#A00651",
                          "&:hover": {
                            backgroundColor: "#8a0547",
                          },
                        }}
                        component={Link}
                        to="/login"
                        onClick={toggleDrawer(false)}
                      >
                        Login
                      </Button>
                    </ListItem>
                  </>
                ) : (
                  <>
                    <ListItem sx={{ py: 1.5 }}>
                      <IconButton color="primary" sx={{ mr: 1 }}>
                        <Badge badgeContent={4} color="secondary">
                          <MailIcon />
                        </Badge>
                      </IconButton>
                      <ListItemText primary="Messages" />
                    </ListItem>
                    <hr style={{ margin: 0, opacity: 0.2 }} />
                    <ListItem sx={{ py: 1.5 }}>
                      <IconButton color="primary" sx={{ mr: 1 }}>
                        <Badge badgeContent={2} color="secondary">
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>
                      <ListItemText primary="Notifications" />
                    </ListItem>
                    <hr style={{ margin: 0, opacity: 0.2 }} />
                    <ListItem
                      button
                      component={Link}
                      to={`/profile/${userId}`}
                      sx={{ py: 1.5 }}
                      onClick={toggleDrawer(false)}
                    >
                      <Avatar
                        sx={{
                          bgcolor: !userData?.image ? "#A00651" : "transparent", // خلفية فقط لو مفيش صورة
                          width: 32,
                          height: 32,
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                          transition: "all 0.2s ease",
                        }}
                        component={Link}
                        to={`/profile/${userData?._id}`} 
                        src={userData?.image || undefined}
                      >
                        {!userData?.image &&
                          userData?.name?.charAt(0).toUpperCase()}
                      </Avatar>

                      <ListItemText primary="Profile" />
                    </ListItem>
                  </>
                )}
              </List>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
