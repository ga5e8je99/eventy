import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import SearchIcon from "@mui/icons-material/Search";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import LanguageIcon from "@mui/icons-material/Language";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { ModeContext } from "../Contexts/ModeContext";

import LogoEn from "../assets/Image/Logo/LogoEn.png";
import WhiteLogoEn from "../assets/Image/Logo/whiteLogoEn.png";
import LogoAr from "../assets/Image/Logo/LogoAr.png";
import WhiteLogoAr from "../assets/Image/Logo/whiteLogoAr.png";

export default function NavBar({ active }) {
  const { t, i18n } = useTranslation("navbar");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, setMode } = useContext(ModeContext);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);

  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const openMenu = Boolean(anchorEl);
  const logo = i18n.language === "en" ? LogoEn : LogoAr;
  const whiteLogo = i18n.language === "en" ? WhiteLogoEn : WhiteLogoAr;
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const pages = [
    { text: t("home"), link: "/home", icon: <HomeIcon /> },
    { text: t("create"), link: "/create", icon: <AddCircleIcon /> },

    { text: t("search"), link: "/search", icon: <SearchIcon /> },
    { text: t("contactUs"), link: "/contact", icon: <ContactMailIcon /> },
  ];

  // Fetch user profile
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiURL}/eventy/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [apiURL, token]);

  // Logout function
  const logout = async () => {
    if (!token) return;
    try {
      await axios.post(
        `${apiURL}/eventy/users/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("token");
      setUserData(null);
      Navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  // Drawer list
  const DrawerList = (
    <Box
      sx={{
        width: 280,
        px: 3,
        py: 2,
        height: "100%",
        color:
          theme.palette.mode === "dark"
            ? theme.palette.primary.light
            : theme.palette.primary.main,
      }}
      role="presentation"
      dir={direction}
    >
      {/* Pages */}
      <List>
        {pages.map((e) => (
          <ListItem key={e.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={e.link}
              onClick={toggleDrawer(false)}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{e.icon}</ListItemIcon>
              <ListItemText primary={e.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Mode Switch */}
      <ListItem disablePadding sx={{ mb: 2 }}>
        <ListItemButton
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText
            primary={mode === "dark" ? t("lightMode") : t("darkMode")}
          />
        </ListItemButton>
      </ListItem>

      {/* Login OR Profile */}
      {token ? (
        <ListItem disablePadding sx={{ mb: 2 }}>
          <ListItemButton
            component={Link}
            to="/profile"
            onClick={() => toggleDrawer(false)}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Avatar sx={{ width: 26, height: 26 }}>
                {userData?.name?.[0] || "G"}
              </Avatar>
            </ListItemIcon>
            <ListItemText primary={t("profile")} />
          </ListItemButton>
        </ListItem>
      ) : (
        <ListItem disablePadding sx={{ mb: 2 }}>
          <ListItemButton
            component={Link}
            to="/login"
            onClick={toggleDrawer(false)}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItemButton>
        </ListItem>
      )}

      {/* Language Switch */}
      <ListItem disablePadding sx={{ mb: 2 }}>
        <ListItemButton
          onClick={() => {
            const newLang = i18n.language === "en" ? "ar" : "en";
            i18n.changeLanguage(newLang);
            localStorage.setItem("lang", newLang);
            toggleDrawer(false)();
          }}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText
            primary={i18n.language === "en" ? "العربية" : "English"}
          />
        </ListItemButton>
      </ListItem>
    </Box>
  );

  // User menu
  const UserMenu = (
    <Menu
      anchorEl={anchorEl}
      open={openMenu}
      onClose={handleMenuClose}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
        <Avatar /> {t("profile")}
      </MenuItem>
      <Divider />
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        {t("logout")}
      </MenuItem>
    </Menu>
  );

  return (
    <Box
      sx={{
        px: isMobile ? 3 : 4,
        py: 2,
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backgroundColor: mode === "dark" ? theme.palette.grey[900] : "white",
        color: mode === "dark" ? "white" : "inherit",
      }}
      dir={direction}
    >
      {/* Logo */}
      <Box>
        <Link to="/">
          <img
            src={mode === "dark" ? whiteLogo : logo}
            width={130}
            alt="Logo"
          />
        </Link>
      </Box>

      {isMobile ? (
        <>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor={i18n.language === "ar" ? "right" : "left"}
            open={open}
            onClose={toggleDrawer(false)}
          >
            {DrawerList}
          </Drawer>
        </>
      ) : (
        <Box sx={{ display: "flex", gap: 2 }}>
          {pages.map((e) => (
            <Button
              component={Link}
              to={e.link}
              key={e.text}
              startIcon={e.icon }
              sx={{
                textTransform: "none",
                position: "relative",
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                transition: "all ease-in-out 0.5s",

                "&::after": {
                  content: '""',
                  width: active === e.text ? "100%" : "0%",
                  height: "2px",
                  background:
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.light
                      : theme.palette.primary.main,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  transition: "width 0.3s ease",
                },

                "&:hover::after": {
                  width: "100%",
                },
              }}
            >
              <span style={{paddingRight:i18n.language==='ar'?'20px':'0px'}}>{e.text}</span>
            </Button>
          ))}
        </Box>
      )}

      {/* User controls */}
      <Box
        sx={{
          display: !isMobile ? "flex" : "none",
          alignItems: "center",
          gap: 1,
        }}
      >
        {!isMobile && (
          <Button
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            sx={{ minWidth: "auto" }}
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </Button>
        )}

        {token ? (
          <IconButton onClick={handleMenuClick}>
            <Avatar>{userData?.name?.[0] || "G"}</Avatar>
          </IconButton>
        ) : (
          !isMobile && (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                background:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                color: "white",
                borderRadius: 24,
                px: 4,
                py: 1,
              }}
            >
              Login
            </Button>
          )
        )}
      </Box>

      {UserMenu}
    </Box>
  );
}
