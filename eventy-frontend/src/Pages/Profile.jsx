import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import dayjs from "dayjs";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

// Icons
import SettingsIcon from "@mui/icons-material/Settings";
import EventIcon from "@mui/icons-material/Event";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const isDarkMode = theme.palette.mode === "dark";
  const primaryColor = isDarkMode 
    ? theme.palette.primary.light 
    : theme.palette.primary.main;

  const [userData, setUserData] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [interestedEvents, setInterestedEvents] = useState([]);

  // تحميل بيانات المستخدم
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${apiUrl}/eventy/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = {
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          profileImage: res.data.profileImage,
          myEvents: res.data.myEvents || [],
          interestedEvents: res.data.interestedEvents || [],
        };

        setUserData(user);
        console.log("User data:",user);
        console.log("My Events IDs:", res.data);

        // تحميل تفاصيل الأحداث
        if (user.myEvents.length > 0) {
          fetchEventsDetails(user.myEvents, setMyEvents);
        }
        if (user.interestedEvents.length > 0) {
          fetchEventsDetails(user.interestedEvents, setInterestedEvents);
        }
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  // تحميل تفاصيل الأحداث
  const fetchEventsDetails = async (eventIds, setter) => {
    try {
      const token = localStorage.getItem("token");
      const promises = eventIds.map((id) =>
        axios.get(`${apiUrl}/eventy/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(err => {
          console.error(`Error fetching event ${id}:`, err);
          return null;
        })
      );

      const results = await Promise.all(promises);
      const validEvents = results
        .filter(r => r && r.data)
        .map((r) => r.data.event || r.data);
      
      setter(validEvents);
    } catch (err) {
      console.log("Error fetching event details:", err);
    }
  };

  // الحصول على الحرف الأول من الاسم
  const getInitial = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    return dayjs(dateString).format(
      i18n.language === "ar" ? "DD/MM/YYYY" : "MM/DD/YYYY"
    );
  };

  if (!userData) {
    return (
      <>
        <NavBar active={"Schedule"} />
        <Container sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {i18n.language === "ar" ? "جاري تحميل البيانات..." : "Loading data..."}
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar active={"Schedule"} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          

          {/* User Profile Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: isDarkMode 
                ? `linear-gradient(135deg, ${alpha(primaryColor, 0.05)} 0%, ${alpha(primaryColor, 0.02)} 100%)`
                : `linear-gradient(135deg, ${alpha(primaryColor, 0.08)} 0%, ${alpha('#ffffff', 0.8)} 100%)`,
              border: `1px solid ${isDarkMode ? theme.palette.divider : alpha(primaryColor, 0.1)}`,
              mb: 4,
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              
            }}
          >
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4} alignItems="center">
                {/* Avatar Section */}
                <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: primaryColor,
                          color: 'white',
                          '&:hover': {
                            bgcolor: isDarkMode ? theme.palette.primary.dark : theme.palette.primary.dark,
                          }
                        }}
                        onClick={() => navigate("/settings")}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    {userData.profileImage ? (
                      <Avatar
                        src={userData.profileImage}
                        sx={{
                          width: 120,
                          height: 120,
                          border: `3px solid ${alpha(primaryColor, 0.3)}`,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          fontSize: '3rem',
                          fontWeight: 700,
                          bgcolor: primaryColor,
                          color: 'white',
                          border: `3px solid ${alpha(primaryColor, 0.3)}`,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        }}
                      >
                        {getInitial(userData.name)}
                      </Avatar>
                    )}
                  </Badge>
                </Grid>

                {/* User Info Section */}
                <Grid item xs={12} md={9}>
                  <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
                    {userData.name}
                  </Typography>
                  
                  <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      icon={<EventIcon />}
                      label={`${myEvents.length} ${i18n.language === "ar" ? "فعالية" : "Events"}`}
                      variant="outlined"
                      sx={{
                        borderColor: alpha(primaryColor, 0.3),
                        color: primaryColor,
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      icon={<FavoriteIcon />}
                      label={`${interestedEvents.length} ${i18n.language === "ar" ? "مهتم" : "Interested"}`}
                      variant="outlined"
                      sx={{
                        borderColor: alpha(theme.palette.secondary.main, 0.3),
                        color: theme.palette.secondary.main,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>

                  {/* Contact Info */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: isDarkMode ? alpha('#ffffff', 0.05) : '#f8f9fa',
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                          {i18n.language === "ar" ? "البريد الإلكتروني" : "Email Address"}
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {userData.email}
                        </Typography>
                        <Box>
                          
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: isDarkMode ? alpha('#ffffff', 0.05) : '#f8f9fa',
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                          {i18n.language === "ar" ? "رقم الهاتف" : "Phone Number"}
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          +2 {userData.phone}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: isDarkMode ? alpha('#ffffff', 0.05) : '#f8f9fa',
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                          {i18n.language === "ar" ? "معرفة المستخدم" : "User Id"}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {userData.id}
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => {
                            navigator.clipboard.writeText(userData.id);
                          }}
                        >
                          <ShareIcon fontSize="small" />
                        </IconButton>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ p: 2, position: 'absolute', top: 16, right: 16 }}>
            <Tooltip title={i18n.language === "ar" ? "الإعدادات" : "Settings"} >
              <IconButton
                onClick={() => navigate("/settings")}
                sx={{
                  backgroundColor: alpha(primaryColor, 0.1),
                  color: primaryColor,
                  '&:hover': {
                    backgroundColor: alpha(primaryColor, 0.2),
                  }
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            </Box>
          </Card>

          
        </Box>
      </Container>

      <Footer />
    </>
  );
}