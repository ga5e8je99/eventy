import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MapIcon from "@mui/icons-material/Map";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ImageIcon from "@mui/icons-material/Image";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DirectionsIcon from "@mui/icons-material/Directions";
import NavigationIcon from "@mui/icons-material/Navigation";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// Map Components

import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export default function Event() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  // Detect dark mode
  const isDarkMode = theme.palette.mode === "dark";

  const id = window.location.pathname.split("/")[2];

  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [selectedTicketTier, setSelectedTicketTier] = useState(null);
  const [selectedTierId, setSelectedTierId] = useState(null);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/eventy/events/joined/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched joined events:", res.data);
        res.data.forEach((event) => {
          if (event._id === id) {
            setDisabled(true);
          }
        });
        console.log("Joined events:", res.data);
      } catch (err) {
        console.error("Error fetching joined events:", err);
      }
    };

    fetchJoinedEvents();
  }, [id, token]);

  const primaryColor = isDarkMode
    ? theme.palette.primary.light
    : theme.palette.primary.main;
  const secondaryColor = isDarkMode
    ? theme.palette.secondary.light
    : theme.palette.secondary.main;
  const cardBackground = isDarkMode
    ? theme.palette.background.paper
    : "#ffffff";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await axios.get(`${apiUrl}/eventy/events/${id}`);
        setEventDetails(res.data);
        
        if (res.data.ticketTiers?.length > 0) {
          const defaultTier = res.data.ticketTiers[0];
          setSelectedTicketTier(defaultTier);
          setSelectedTierId(defaultTier._id);
        }

      } catch (err) {
        setError(err?.message || "Failed to load event data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    const checkIfInterested = async () => {
      if (!token || !userId) return;
      
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await axios.get(`${apiUrl}/eventy/users/${userId}/interested`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const isInterested = response.data.some(event => event._id === id);
        setIsBookmarked(isInterested);
      } catch (err) {
        console.error("Error checking interest status:", err);
      }
    };

    if (eventDetails) {
      checkIfInterested();
    }
  }, [eventDetails, token, userId, id]);

  const handleBookmark = async () => {
    if (!token) {
      alert(i18n.language === "ar" ? "يجب تسجيل الدخول أولاً" : "Please login first");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      
      if (isBookmarked) {
        await axios.delete(`${apiUrl}/eventy/users/${userId}/interested/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsBookmarked(false);
      } else {
        await axios.post(
          `${apiUrl}/eventy/users/${userId}/interested`,
          { eventId: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error("Error updating interest:", err);
      alert(
        i18n.language === "ar"
          ? "حدث خطأ أثناء تحديث الحالة"
          : "Error updating interest"
      );
    }
  };

  const handleJoinEvent = async () => {
    if (selectedTicketTier?.price === 0) {
      setJoining(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
        const handelJoin = await axios.post(
          `${apiUrl}/eventy/events/${id}/join`,
          { ticketTierId: selectedTierId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        console.log(handelJoin.data);
  
        setDisabled(true);
  
        setEventDetails((prevDetails) => ({
          ...prevDetails,
          joined: true,
        }));
  
        alert(
          i18n.language === "ar"
            ? "تم تسجيلك في الفعالية بنجاح!"
            : "You have successfully joined the event!"
        );
        
        navigate(`/booking/${id}`, { 
          state: { 
            event: eventDetails,
            ticketTier: selectedTicketTier
          } 
        });
      } catch (err) {
        console.error(err);
        alert(
          i18n.language === "ar"
            ? "حدث خطأ أثناء الانضمام للفعالية"
            : "Error joining the event"
        );
      } finally {
        setJoining(false);
      }
    } else {
      navigate(`/booking/${id}`, { 
        state: { 
          event: eventDetails,
          ticketTier: selectedTicketTier
        } 
      });
    }
  };

  const handleTicketTierSelect = (tierId) => {
    const selectedTier = eventDetails.ticketTiers.find(tier => tier._id === tierId);
    setSelectedTicketTier(selectedTier);
    setSelectedTierId(tierId);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: eventDetails?.name,
        text: eventDetails?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(
        i18n.language === "ar" ? "تم نسخ الرابط" : "Link copied to clipboard"
      );
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(
      i18n.language === "ar" ? "ar-SA" : "en-US",
      options
    );
  };

  const getDirections = () => {
    if (eventDetails?.location?.latitude && eventDetails?.location?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${eventDetails.location.latitude},${eventDetails.location.longitude}`;
      window.open(url, "_blank");
    }
  };

  if (loading)
    return (
      <>
        <NavBar />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ color: primaryColor }} />
            <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
              {i18n.language === "ar"
                ? "جاري تحميل بيانات الفعالية..."
                : "Loading event details..."}
            </Typography>
          </Box>
        </Container>
      </>
    );

  if (error)
    return (
      <>
        <NavBar />
        <Container sx={{ py: 10 }}>
          <Alert
            severity="error"
            sx={{
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              py: 2,
              backgroundColor: isDarkMode
                ? alpha(theme.palette.error.main, 0.1)
                : undefined,
            }}
          >
            <Typography variant="h6">
              {i18n.language === "ar"
                ? "حدث خطأ أثناء تحميل بيانات الفعالية"
                : "Error loading event data"}
            </Typography>
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mt: 3 }}
          >
            {i18n.language === "ar" ? "العودة" : "Go Back"}
          </Button>
        </Container>
      </>
    );

  const e = eventDetails;

  // Calculate remaining capacity
  const remainingCapacity = e.capacity - (e.attendees?.length || 0);
  const attendancePercentage = ((e.attendees?.length || 0) / e.capacity) * 100;

  return (
    <>
      <NavBar />

      <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Header with Back Button */}
        <Box sx={{ mb: isMobile ? 2 : 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: "text.secondary",
              mb: 2,
            }}
          >
            {i18n.language === "ar" ? "العودة إلى الفعاليات" : "Back to Events"}
          </Button>
        </Box>

        {/* Main Event Card */}
        <Card
          elevation={isDarkMode ? 0 : 1}
          sx={{
            borderRadius: isMobile ? 2 : 4,
            overflow: "hidden",
            boxShadow: isDarkMode
              ? "0 8px 32px rgba(0,0,0,0.2)"
              : "0 10px 40px rgba(0,0,0,0.08)",
            mb: 4,
            border: isDarkMode
              ? `1px solid ${theme.palette.divider}`
              : undefined,
            backgroundColor: cardBackground,
          }}
        >
          {/* Hero Image Section with Address */}
          <Box
            sx={{
              height: isMobile ? "35vh" : isTablet ? "40vh" : "45vh",
              position: "relative",
              background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${
                e.coverImage || "/default-event.jpg"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: isMobile ? 2 : 4,
              color: "white",
            }}
          >
            {/* Status and Address Bar */}
            <Box
              sx={{
                position: "absolute",
                top: isMobile ? 15 : 20,
                left: isMobile ? 15 : 20,
                right: isMobile ? 15 : 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 1,
                }}
              >
                <Chip
                  icon={<CheckCircleIcon />}
                  label={
                    e.approvalStatus === "approved"
                      ? i18n.language === "ar"
                        ? "معتمد"
                        : "Approved"
                      : i18n.language === "ar"
                      ? "بانتظار الموافقة"
                      : "Pending Approval"
                  }
                  sx={{
                    backgroundColor:
                      e.approvalStatus === "approved"
                        ? alpha("#4CAF50", 0.9)
                        : alpha("#FF9800", 0.9),
                    color: "white",
                    fontWeight: 600,
                    backdropFilter: "blur(10px)",
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                  }}
                />

                {/* Address Display */}
                {e.location?.address && (
                  <Chip
                    icon={<LocationOnIcon />}
                    label={
                      isMobile
                        ? e.location.address.substring(0, 20) + "..."
                        : e.location.address
                    }
                    sx={{
                      backgroundColor: alpha(primaryColor, 0.8),
                      color: "white",
                      fontWeight: 500,
                      backdropFilter: "blur(10px)",
                      fontSize: isMobile ? "0.75rem" : "0.85rem",
                      maxWidth: isMobile ? 150 : 300,
                    }}
                  />
                )}
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                }}
              >
                <Tooltip title={i18n.language === "ar" ? "مهتم" : "Interested"}>
                  <IconButton
                    onClick={handleBookmark}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    {isBookmarked ? (
                      <BookmarkIcon
                        sx={{ color: "white", fontSize: isMobile ? 20 : 24 }}
                      />
                    ) : (
                      <BookmarkBorderIcon
                        sx={{ color: "white", fontSize: isMobile ? 20 : 24 }}
                      />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title={i18n.language === "ar" ? "مشاركة" : "Share"}>
                  <IconButton
                    onClick={handleShare}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    <ShareIcon
                      sx={{ color: "white", fontSize: isMobile ? 20 : 24 }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Typography
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
              fontWeight={800}
              sx={{
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                mb: 1,
                direction: i18n.language === "ar" ? "rtl" : "ltr",
                fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem",
                lineHeight: 1.2,
              }}
            >
              {e.name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
                mt: 1,
              }}
            >
              <Chip
                icon={<CategoryIcon sx={{ fontSize: isMobile ? 14 : 16 }} />}
                label={e.category === "Other" ? e.customCategory : e.category}
                size={isMobile ? "small" : "medium"}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Chip
                label={
                  e.type === "Online"
                    ? i18n.language === "ar"
                      ? "أونلاين"
                      : "Online"
                    : i18n.language === "ar"
                    ? "حضوري"
                    : "Offline"
                }
                size={isMobile ? "small" : "medium"}
                sx={{
                  backgroundColor:
                    e.type === "Online"
                      ? alpha(theme.palette.info.main, 0.8)
                      : alpha(primaryColor, 0.8),
                  color: "white",
                  fontWeight: 600,
                }}
              />
              {e.isRecurring && (
                <Chip
                  icon={
                    <EventRepeatIcon sx={{ fontSize: isMobile ? 14 : 16 }} />
                  }
                  label={
                    e.isRecurring === "Yearly"
                      ? i18n.language === "ar"
                        ? "سنوي"
                        : "Yearly"
                      : i18n.language === "ar"
                      ? "متكرر"
                      : "Recurring"
                  }
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Tabs Section */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: isDarkMode
                ? theme.palette.background.paper
                : "#f8f9fa",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                "& .MuiTab-root": {
                  fontSize: isMobile ? "0.85rem" : "1rem",
                  fontWeight: 600,
                  minHeight: isMobile ? 48 : 60,
                  minWidth: isMobile ? 100 : undefined,
                },
                "& .Mui-selected": {
                  color: primaryColor + "!important",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: primaryColor,
                  height: 3,
                },
              }}
            >
              <Tab
                icon={isMobile ? <EventAvailableIcon /> : undefined}
                iconPosition="start"
                label={
                  !isMobile &&
                  (i18n.language === "ar" ? "تفاصيل الفعالية" : "Event Details")
                }
                aria-label="Event Details"
              />
              <Tab
                icon={isMobile ? <LocationOnIcon /> : undefined}
                iconPosition="start"
                label={
                  !isMobile && (i18n.language === "ar" ? "الموقع" : "Location")
                }
                aria-label="Location"
              />
              <Tab
                icon={isMobile ? <ImageIcon /> : undefined}
                iconPosition="start"
                label={
                  !isMobile && (i18n.language === "ar" ? "الصور" : "Gallery")
                }
                aria-label="Gallery"
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: isMobile ? 2 : 4 }}>
            {activeTab === 0 && (
              <Grid container spacing={isMobile ? 2 : 4} alignItems={"center"}>
                {/* Left Column - Details */}
                <Grid item xs={12} md={8}>
                  {!isMobile && (
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{ mb: 3, color: "text.primary" }}
                    >
                      {i18n.language === "ar"
                        ? "عن الفعالية"
                        : "About the Event"}
                    </Typography>
                  )}

                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      color: "text.secondary",
                      lineHeight: 1.8,
                      fontSize: isMobile ? "1rem" : "1.1rem",
                      whiteSpace: "pre-line",
                      textAlign: i18n.language === "ar" ? "right" : "left",
                    }}
                  >
                    {e.description}
                  </Typography>

                  {/* Event Statistics - Responsive Grid */}
                  <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: 4 }}>
                    {[
                      {
                        value: e.attendees?.length || 0,
                        label: i18n.language === "ar" ? "مسجلين" : "Registered",
                        color: primaryColor,
                        icon: <PeopleIcon />,
                      },
                      {
                        value: remainingCapacity,
                        label:
                          i18n.language === "ar" ? "مقاعد متاحة" : "Available",
                        color: "#4CAF50",
                        icon: <EventAvailableIcon />,
                      },
                      {
                        value: `${Math.round(attendancePercentage)}%`,
                        label: i18n.language === "ar" ? "معدل الحجز" : "Booked",
                        color: "#FF9800",
                        icon: <AttachMoneyIcon />,
                      },
                      {
                        value: `${e.ticketPrice} EGP`,
                        label:
                          i18n.language === "ar"
                            ? "سعر التذكرة"
                            : "Ticket Price",
                        color: "#2196F3",
                        icon: <AttachMoneyIcon />,
                      },
                    ].map((stat, index) => (
                      <Grid item xs={6} sm={3} key={`stat-${stat.label || index}`}>
                        <Card
                          elevation={0}
                          sx={{
                            p: isMobile ? 1.5 : 2,
                            borderRadius: isMobile ? 2 : 3,
                            textAlign: "center",
                            backgroundColor: alpha(stat.color, 0.1),
                            border: `1px solid ${alpha(stat.color, 0.2)}`,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              color: stat.color,
                              mb: 0.5,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {stat.icon}
                          </Box>
                          <Typography
                            variant={isMobile ? "h6" : "h5"}
                            fontWeight={800}
                            sx={{ color: stat.color }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
                          >
                            {stat.label}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Event Details Cards - Responsive Layout */}
                  <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 , justifyContent: 'center' , alignItems:'center'}}>
                    <Grid item xs={12} md={6} sx={{ width: "100%" }}>
                      <Card
                        elevation={0}
                        sx={{
                          p: isMobile ? 2 : 3,
                          borderRadius: isMobile ? 2 : 3,
                          backgroundColor: isDarkMode
                            ? alpha(theme.palette.background.paper, 0.5)
                            : "#f8f9fa",
                          border: `1px solid ${theme.palette.divider}`,
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        {!isMobile && (
                          <Typography variant="h6" fontWeight={600} mb={3}>
                            {i18n.language === "ar"
                              ? "معلومات التاريخ والوقت"
                              : "Date & Time Information"}
                          </Typography>
                        )}
                        <Stack spacing={isMobile ? 1.5 : 2.5}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: alpha(primaryColor, 0.1),
                                color: primaryColor,
                                width: isMobile ? 36 : 40,
                                height: isMobile ? 36 : 40,
                              }}
                            >
                              <CalendarTodayIcon
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {i18n.language === "ar"
                                  ? "تاريخ البداية"
                                  : "Start Date"}
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {formatDate(e.startDate)}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: alpha(secondaryColor, 0.1),
                                color: secondaryColor,
                                width: isMobile ? 36 : 40,
                                height: isMobile ? 36 : 40,
                              }}
                            >
                              <CalendarTodayIcon
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {i18n.language === "ar"
                                  ? "تاريخ النهاية"
                                  : "End Date"}
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {formatDate(e.endDate)}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: alpha("#4CAF50", 0.1),
                                color: "#4CAF50",
                                width: isMobile ? 36 : 40,
                                height: isMobile ? 36 : 40,
                              }}
                            >
                              <AccessTimeIcon
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {i18n.language === "ar" ? "الوقت" : "Time"}
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {e.startTime} - {e.endTime}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Card>
                    </Grid>

                    <Grid item xs={12}  sx={{ width: "100%" }}>
                      <Card
                        elevation={0}
                        sx={{
                          p: isMobile ? 2 : 3,
                          borderRadius: isMobile ? 2 : 3,
                          backgroundColor: isDarkMode
                            ? alpha(theme.palette.background.paper, 0.5)
                            : "#f8f9fa",
                          border: `1px solid ${theme.palette.divider}`,
                          height: "100%",
                        }}
                      >
                        {!isMobile && (
                          <Typography variant="h6" fontWeight={600} mb={3}>
                            {i18n.language === "ar"
                              ? "معلومات إضافية"
                              : "Additional Information"}
                          </Typography>
                        )}
                        <Stack spacing={isMobile ? 1.5 : 2.5}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: alpha("#FF9800", 0.1),
                                color: "#FF9800",
                                width: isMobile ? 36 : 40,
                                height: isMobile ? 36 : 40,
                              }}
                            >
                              <PeopleIcon
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {i18n.language === "ar"
                                  ? "السعة الكلية"
                                  : "Total Capacity"}
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {e.capacity}{" "}
                                {i18n.language === "ar" ? "شخص" : "people"}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: alpha("#9C27B0", 0.1),
                                color: "#9C27B0",
                                width: isMobile ? 36 : 40,
                                height: isMobile ? 36 : 40,
                              }}
                            >
                              <EventRepeatIcon
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {i18n.language === "ar"
                                  ? "نوع التكرار"
                                  : "Recurrence Type"}
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {e.isRecurring === "Yearly"
                                  ? i18n.language === "ar"
                                    ? "سنوي"
                                    : "Yearly"
                                  : i18n.language === "ar"
                                  ? "غير متكرر"
                                  : "Not Recurring"}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: alpha("#2196F3", 0.1),
                                color: "#2196F3",
                                width: isMobile ? 36 : 40,
                                height: isMobile ? 36 : 40,
                              }}
                            >
                              {e.isPublic ? (
                                <PublicIcon
                                  fontSize={isMobile ? "small" : "medium"}
                                />
                              ) : (
                                <LockIcon
                                  fontSize={isMobile ? "small" : "medium"}
                                />
                              )}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {i18n.language === "ar"
                                  ? "نوع الفعالية"
                                  : "Event Type"}
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {e.isPublic
                                  ? i18n.language === "ar"
                                    ? "عام"
                                    : "Public"
                                  : i18n.language === "ar"
                                  ? "خاص"
                                  : "Private"}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Right Column - Ticket Tiers & Join Button */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      position: isMobile ? "static" : "sticky",
                      top: 100,
                    }}
                  >
                    {/* Ticket Categories Selection */}
                    {e.ticketTiers?.length > 0 && (
                      <Card
                        elevation={0}
                        sx={{
                          p: isMobile ? 2 : 3,
                          borderRadius: isMobile ? 2 : 3,
                          mb: 3,
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: isDarkMode
                            ? alpha(theme.palette.background.paper, 0.5)
                            : "#f8f9fa",
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocalOfferIcon sx={{ mr: 1, color: primaryColor }} />
                          <Typography
                            variant={isMobile ? "subtitle1" : "h6"}
                            fontWeight={700}
                          >
                            {t("Ticket Categories")}
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {i18n.language === "ar" 
                            ? "اختر فئة التذكرة التي تريدها" 
                            : "Select your preferred ticket category"}
                        </Typography>

                        <FormControl component="fieldset" sx={{ width: '100%' }}>
                          <RadioGroup
                            value={selectedTierId}
                            onChange={(e) => handleTicketTierSelect(e.target.value)}
                          >
                            <Stack spacing={isMobile ? 1.5 : 2}>
                              {e.ticketTiers.map((tier, index) => (
                                <Paper
                                  key={tier._id}
                                  elevation={0}
                                  sx={{
                                    p: isMobile ? 1.5 : 2,
                                    borderRadius: isMobile ? 1.5 : 2,
                                    border: `2px solid ${
                                      selectedTierId === tier._id
                                        ? primaryColor
                                        : theme.palette.divider
                                    }`,
                                    backgroundColor:
                                      selectedTierId === tier._id
                                        ? alpha(primaryColor, 0.05)
                                        : "transparent",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      transform: "translateY(-2px)",
                                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                                    },
                                  }}
                                >
                                  <FormControlLabel
                                    value={tier._id}
                                    control={
                                      <Radio 
                                        color="primary" 
                                        checked={selectedTierId === tier._id}
                                      />
                                    }
                                    label={
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          width: "100%",
                                        }}
                                      >
                                        <Box>
                                          <Typography
                                            variant={isMobile ? "body2" : "subtitle1"}
                                            fontWeight={700}
                                          >
                                            {tier.tierName}
                                          </Typography>
                                          {tier.description && (
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                              sx={{ mt: 0.5 }}
                                            >
                                              {tier.description}
                                            </Typography>
                                          )}
                                        </Box>
                                        <Typography
                                          variant={isMobile ? "body1" : "h6"}
                                          fontWeight={800}
                                          color={tier.price === 0 ? "success.main" : "primary"}
                                          sx={{
                                            fontSize: isMobile ? "1rem" : undefined,
                                          }}
                                        >
                                          {tier.price === 0 
                                            ? i18n.language === "ar" ? "مجاني" : "FREE" 
                                            : `${tier.price} EGP`}
                                        </Typography>
                                      </Box>
                                    }
                                    sx={{ width: '100%', m: 0 }}
                                  />
                                </Paper>
                              ))}
                            </Stack>
                          </RadioGroup>
                        </FormControl>

                        {selectedTicketTier && selectedTicketTier.price === 0 && (
                          <Alert 
                            severity="success" 
                            sx={{ mt: 2, borderRadius: 2 }}
                            icon={<EventAvailableIcon />}
                          >
                            <Typography variant="body2" fontWeight={600}>
                              {i18n.language === "ar" 
                                ? "هذه التذكرة مجانية! يمكنك الانضمام مباشرة." 
                                : "This ticket is FREE! You can join directly."}
                            </Typography>
                          </Alert>
                        )}
                      </Card>
                    )}

                    {/* Join Button - Mobile First */}
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleJoinEvent}
                      disabled={
                        disabled || !token || joining || remainingCapacity <= 0 || !selectedTicketTier
                      }
                      sx={{
                        py: isMobile ? 1.5 : 2.5,
                        borderRadius: isMobile ? 2 : 3,
                        fontSize: isMobile ? "1rem" : "18px",
                        fontWeight: 800,
                        textTransform: "none",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                        mb: 3,
                        background: selectedTicketTier?.price === 0
                          ? `linear-gradient(135deg, #4CAF50, #2E7D32)`
                          : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        "&:hover": {
                          boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
                          transform: "translateY(-2px)",
                        },
                        "&:disabled": {
                          background: theme.palette.grey[400],
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {joining ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : remainingCapacity <= 0 ? (
                        i18n.language === "ar" ? (
                          "اكتمل العدد"
                        ) : (
                          "Sold Out"
                        )
                      ) : selectedTicketTier?.price === 0 ? (
                        i18n.language === "ar" ? (
                          "انضم للفعالية مجاناً"
                        ) : (
                          "Join Event for FREE"
                        )
                      ) : i18n.language === "ar" ? (
                        "تابع لحجز التذكرة"
                      ) : (
                        "Continue to Book Ticket"
                      )}
                    </Button>

                    {/* Ticket Price Card */}
                    {selectedTicketTier && (
                      <Card
                        elevation={0}
                        sx={{
                          p: isMobile ? 2 : 3,
                          borderRadius: isMobile ? 2 : 3,
                          mb: 3,
                          background: selectedTicketTier.price === 0
                            ? `linear-gradient(135deg, #4CAF50, ${alpha('#4CAF50', 0.8)})`
                            : `linear-gradient(135deg, ${primaryColor}, ${alpha(
                                primaryColor,
                                0.8
                              )})`,
                          color: "white",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: isMobile ? 1 : 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                backgroundColor: "rgba(255,255,255,0.2)",
                                color: "white",
                              }}
                            >
                              <LocalOfferIcon />
                            </Avatar>
                            <Box>
                              <Typography
                                variant={isMobile ? "caption" : "subtitle2"}
                                sx={{ opacity: 0.9 }}
                              >
                                {i18n.language === "ar"
                                  ? "التذكرة المختارة"
                                  : "Selected Ticket"}
                              </Typography>
                              <Typography
                                variant={isMobile ? "h5" : "h4"}
                                fontWeight={800}
                              >
                                {selectedTicketTier.price === 0 
                                  ? i18n.language === "ar" ? "مجاني" : "FREE" 
                                  : `${selectedTicketTier.price} EGP`}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ opacity: 0.9 }}
                              >
                                {selectedTicketTier.tierName}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && e.location && (
              <Box >
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  fontWeight={700}
                  mb={3}
                >
                  {i18n.language === "ar" ? "موقع الفعالية" : "Event Location"}
                </Typography>

                <Grid container spacing={isMobile ? 2 : 4}>
                  {/* تفاصيل الموقع */}
                  <Grid item xs={12} md={6} sx={{width:isMobile?"100%":"auto"}}>
                    <Card
                      elevation={0}
                      sx={{
                        p: isMobile ? 2 : 3,
                        borderRadius: isMobile ? 2 : 3,
                        height: "100%",
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: isDarkMode
                          ? alpha(theme.palette.background.paper, 0.5)
                          : "#f8f9fa",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        fontWeight={600}
                        mb={2}
                      >
                        {i18n.language === "ar"
                          ? "تفاصيل الموقع"
                          : "Location Details"}
                      </Typography>

                      <Stack spacing={isMobile ? 1.5 : 2} sx={{ flex: 1 }}>
                        {/* العنوان */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: isMobile ? 1 : 2,
                          }}
                        >
                          <LocationOnIcon
                            color="primary"
                            sx={{
                              mt: 0.5,
                              fontSize: isMobile ? 20 : 24,
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant={isMobile ? "body1" : "subtitle1"}
                              fontWeight={600}
                              sx={{ mb: 0.5 }}
                            >
                              {e.location.address}
                            </Typography>
                            {e.city && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <LocationOnIcon sx={{ fontSize: 14 }} />
                                {e.city}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        {/* الإحداثيات */}
                        <Box
                          sx={{
                            display: "flex",
                            gap: isMobile ? 2 : 3,
                            flexWrap: "wrap",
                            mt: 1,
                          }}
                        >
                          <Box
                            sx={{
                              flex: 1,
                              minWidth: 120,
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: isDarkMode
                                ? alpha(theme.palette.primary.main, 0.1)
                                : alpha(theme.palette.primary.light, 0.1),
                              border: `1px solid ${alpha(
                                theme.palette.primary.main,
                                0.2
                              )}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {i18n.language === "ar" ? "خط العرض" : "Latitude"}
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight={700}
                              color="primary"
                            >
                              {e.location.latitude}°
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              flex: 1,
                              minWidth: 120,
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: isDarkMode
                                ? alpha(theme.palette.secondary.main, 0.1)
                                : alpha(theme.palette.secondary.light, 0.1),
                              border: `1px solid ${alpha(
                                theme.palette.secondary.main,
                                0.2
                              )}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {i18n.language === "ar"
                                ? "خط الطول"
                                : "Longitude"}
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight={700}
                              color="secondary"
                            >
                              {e.location.longitude}°
                            </Typography>
                          </Box>
                        </Box>

                        {/* أزرار الإجراءات */}
                        <Box
                          sx={{
                            mt: "auto",
                            pt: 2,
                            display: "flex",
                            gap: 2,
                            flexDirection: isMobile ? "column" : "row",
                          }}
                        >
                          <Button
                            variant="contained"
                            startIcon={<DirectionsIcon />}
                            onClick={getDirections}
                            fullWidth={isMobile}
                            sx={{
                              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                              py: isMobile ? 1.2 : 1.5,
                              fontWeight: 600,
                            }}
                          >
                            {i18n.language === "ar"
                              ? "احصل على اتجاهات"
                              : "Get Directions"}
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<MapIcon />}
                            href={`https://maps.google.com/?q=${e.location.latitude},${e.location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            fullWidth={isMobile}
                            sx={{
                              py: isMobile ? 1.2 : 1.5,
                              fontWeight: 600,
                              borderWidth: 2,
                              "&:hover": {
                                borderWidth: 2,
                              },
                            }}
                          >
                            {i18n.language === "ar"
                              ? "خرائط جوجل"
                              : "Google Maps"}
                          </Button>
                        </Box>
                      </Stack>
                    </Card>
                  </Grid>

                  {/* خريطة جوجل iframe */}
                  <Grid item xs={12} md={6} sx={{width:isMobile?"100%":"auto"}}>
                    <Card
                      elevation={0}
                      sx={{
                        p: isMobile ? 0 : 0,
                        borderRadius: isMobile ? 2 : 3,
                        height: isMobile ? 350 : 450,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: "hidden",
                        backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      {/* عنوان الخريطة */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          zIndex: 1000,
                          backgroundColor: isDarkMode
                            ? "rgba(0, 0, 0, 0.8)"
                            : "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                          p: isMobile ? 1 : 1.5,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant={isMobile ? "body2" : "subtitle2"}
                          fontWeight={600}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <MapIcon fontSize="small" />
                          {i18n.language === "ar"
                            ? "موقع الفعالية على الخريطة"
                            : "Event Location on Map"}
                        </Typography>

                        <Chip
                          size="small"
                          label="Google Maps"
                          color="primary"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            fontSize: isMobile ? "0.7rem" : "0.75rem",
                          }}
                        />
                      </Box>

                      {/* iframe الخريطة */}
                      {e.location.latitude && e.location.longitude ? (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                          }}
                        >
                          <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11595.069163018313!2d${
                              e.location.longitude
                            }!3d${
                              e.location.latitude
                            }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg!4v${Date.now()}`}
                            width="100%"
                            height="100%"
                            style={{
                              border: 0,
                              position: "absolute",
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                            }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Event Location Map"
                          />

                          {/* Overlay لمعلومات الموقع */}
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: isMobile ? 10 : 20,
                              left: isMobile ? 10 : 20,
                              right: isMobile ? 10 : 20,
                              backgroundColor: isDarkMode
                                ? "rgba(0, 0, 0, 0.85)"
                                : "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(10px)",
                              borderRadius: 2,
                              p: isMobile ? 1.5 : 2,
                              border: `1px solid ${theme.palette.divider}`,
                              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                              zIndex: 1000,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                              <Typography
                                variant={isMobile ? "caption" : "body2"}
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                {i18n.language === "ar"
                                  ? "الموقع الحالي"
                                  : "Current Location"}
                              </Typography>
                              <Typography
                                variant={isMobile ? "body2" : "body1"}
                                fontWeight={600}
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {e.location.address}
                              </Typography>
                            </Box>

                            <Button
                              size={isMobile ? "small" : "medium"}
                              variant="contained"
                              startIcon={<NavigationIcon />}
                              onClick={getDirections}
                              sx={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                minWidth: isMobile ? "auto" : 120,
                              }}
                            >
                              {i18n.language === "ar"
                                ? "الاتجاهات"
                                : "Directions"}
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "text.secondary",
                            p: 4,
                          }}
                        >
                          <MapIcon
                            sx={{
                              fontSize: isMobile ? 48 : 60,
                              mb: 2,
                              opacity: 0.5,
                            }}
                          />
                          <Typography
                            variant={isMobile ? "h6" : "h5"}
                            fontWeight={600}
                            align="center"
                            sx={{ mb: 1 }}
                          >
                            {i18n.language === "ar"
                              ? "لا توجد إحداثيات متاحة"
                              : "No coordinates available"}
                          </Typography>
                          <Typography
                            variant="body2"
                            align="center"
                            sx={{ maxWidth: 300 }}
                          >
                            {i18n.language === "ar"
                              ? "لم يتم تحديد موقع جغرافي لهذه الفعالية"
                              : "No geographic location has been specified for this event"}
                          </Typography>
                        </Box>
                      )}
                    </Card>

                    {/* معلومات إضافية تحت الخريطة */}
                    {!isMobile &&
                      e.location.latitude &&
                      e.location.longitude && (
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: isDarkMode
                              ? alpha(theme.palette.background.paper, 0.3)
                              : "#f8f9fa",
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {i18n.language === "ar"
                              ? "لأفضل تجربة، افتح الخريطة في تطبيق خرائط جوجل"
                              : "For best experience, open the map in Google Maps app"}
                          </Typography>

                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Chip
                              size="small"
                              label="📍 Live Location"
                              variant="outlined"
                              color="success"
                              sx={{ fontWeight: 500 }}
                            />
                            <Chip
                              size="small"
                              label="🗺️ Interactive"
                              variant="outlined"
                              color="info"
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                        </Box>
                      )}
                  </Grid>
                </Grid>

                {/* معلومات إضافية للجوال */}
                {isMobile && e.location.latitude && e.location.longitude && (
                  <Card
                    elevation={0}
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: isDarkMode
                        ? alpha(theme.palette.background.paper, 0.3)
                        : "#f8f9fa",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      {i18n.language === "ar"
                        ? "💡 يمكنك الضغط مطولاً على الخريطة لحفظ الموقع"
                        : "💡 Long press on the map to save the location"}
                    </Typography>
                  </Card>
                )}
              </Box>
            )}
            {activeTab === 2 && (
              <Box>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  fontWeight={700}
                  mb={3}
                >
                  {i18n.language === "ar" ? "معرض الصور" : "Photo Gallery"}
                </Typography>

                {e.images && e.images.length > 0 ? (
                  <Grid container spacing={isMobile ? 1 : 2}>
                    {e.images.map((image, index) => (
                      <Grid item xs={6} sm={4} md={3} key={`image-${image || index}`}>
                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: isMobile ? 1.5 : 2,
                            overflow: "hidden",
                            height: isMobile ? 120 : 200,
                            border: `1px solid ${theme.palette.divider}`,
                            "&:hover": {
                              transform: "scale(1.03)",
                              transition: "transform 0.3s ease",
                              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                            },
                          }}
                        >
                          <img
                            src={image}
                            alt={`Event ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onClick={() => window.open(image, "_blank")}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 8,
                      color: "text.secondary",
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6">
                      {i18n.language === "ar"
                        ? "لا توجد صور متاحة"
                        : "No photos available"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, maxWidth: 400, mx: "auto" }}
                    >
                      {i18n.language === "ar"
                        ? "يمكن للمنظم إضافة صور للفعالية لعرضها هنا"
                        : "The organizer can add event photos to display here"}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Card>
      </Container>

      <Footer />
    </>
  );
}