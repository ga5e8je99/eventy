import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Grid,
  Button,
  IconButton,
  useTheme,
  Container,
  Stack,
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  AccessTime,
  People,
  Business,
  Public,
  Lock,
  ArrowBack,
  Share,
} from "@mui/icons-material";
import Loading from "../Components/Loading";
import Navbar from "../Components/Navbar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Footer from '../Components/Footer'
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `https://eventplanner-production-ce6e.up.railway.app/api/events/getevent/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      setEvent(response.data);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      // Check if event is paid
      if (eventData.price && eventData.price !== "0" && eventData.price !== null) {
        navigate(`/payment/${id}`);
        return;
      }
      
      // For free events
      await axios.post(
        `https://eventplanner-production-ce6e.up.railway.app/api/events/attend/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("You have successfully joined the event!");
    } catch (err) {
      console.error("Error joining event:", err);
      alert("Failed to join event. Please try again.");
    }
  };

  // const handleCompletePayment = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     await axios.post(
  //       `https://eventplanner-production-ce6e.up.railway.app/api/events/completepayment/${id}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     alert("Payment completed successfully! You have joined the event.");
  //   } catch (err) {
  //     console.error("Error completing payment:", err);
  //     alert("Failed to complete payment. Please try again.");
  //   }
  // };

  const isEventPassed = () => {
    if (!eventData.date || !eventData.time) return false;
    
    const eventDate = new Date(eventData.date);
    const [hours, minutes] = eventData.time.split(':').map(Number);
    eventDate.setHours(hours, minutes);
    
    return new Date() > eventDate;
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

  const eventData = event.event;
  const eventHasPassed = isEventPassed();

  return (
    <>
      <Navbar />
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        {/* Cover Image Section */}
        <Box
          sx={{
            height: { xs: 200, sm: 300, md: 350 },
            position: "relative",
            overflow: "hidden",
            backgroundImage: `linear-gradient(to bottom, rgba(17, 64, 132, 0.44), rgba(17, 64, 132, 0.44)), url(${
              eventData.coverImage || DEFAULT_COVER_IMAGE
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
            }}
          >
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.7)",
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          </Box>
        </Box>

        <Container maxWidth="xl" sx={{ position: "relative", mt: 0 }}>
          <Box
            sx={{
              borderRadius: 4,
              backgroundColor: "transparent",
            }}
          >
            {/* Event Header Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-start" },
                p: { xs: 3, sm: 4 },
                gap: 3,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: { xs: 120, sm: 150, md: 180 },
                  height: { xs: 120, sm: 150, md: 180 },
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `4px solid ${theme.palette.primary.main}`,
                  boxShadow: theme.shadows[4],
                  flexShrink: 0,
                  mt: { xs: -8, sm: -12 },
                  backgroundColor: "background.paper",
                }}
              >
                <img
                  src={eventData.image}
                  alt={eventData.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "center", sm: "flex-start" }}
                  spacing={2}
                  sx={{ mb: 2, width: "100%" }}
                >
                  <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                        lineHeight: 1.2,
                      }}
                      noWrap
                    >
                      {eventData.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: { xs: "center", sm: "flex-start" },
                        gap: 1,
                      }}
                    >
                      <Business fontSize="small" />{" "}
                      {eventData.hostCompany || "Private Host"}
                    </Typography>
                  </Box>

                  <Chip
                    label={eventData.type}
                    color={
                      eventData.type === "Public" ? "primary" : "secondary"
                    }
                    icon={eventData.type === "Public" ? <Public /> : <Lock />}
                    sx={{
                      px: 1,
                      fontSize: "0.875rem",
                      height: 32,
                      alignSelf: { xs: "center", sm: "flex-start" },
                      ml: { sm: "auto" },
                    }}
                  />
                </Stack>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleJoinEvent}
                    disabled={eventHasPassed}
                    sx={{
                      borderRadius: 6,
                      px: 4,
                      fontWeight: "bold",
                      boxShadow: theme.shadows[2],
                      "&:hover": {
                        boxShadow: eventHasPassed ? theme.shadows[2] : theme.shadows[4],
                        transform: eventHasPassed ? "none" : "translateY(-1px)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {eventHasPassed 
                      ? "Event Ended" 
                      : (eventData.price && eventData.price !== "0" && eventData.price !== null 
                          ? "Buy Ticket" 
                          : "Join Now")}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Share />}
                    sx={{
                      borderRadius: 6,
                      px: 4,
                      fontWeight: "medium",
                    }}
                  >
                    Share
                  </Button>
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Main Content */}
            <Box sx={{ p: { xs: 3, sm: 4 } }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  {/* Event Description */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: "text.primary",
                        fontWeight: "medium",
                      }}
                    >
                      About the Event
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.8,
                        color: "text.secondary",
                      }}
                    >
                      {eventData.description}
                    </Typography>
                  </Box>

                  {/* Event Details */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: "text.primary",
                        fontWeight: "medium",
                      }}
                    >
                      Event Details
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            height: "100%",
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                              gap: 1,
                            }}
                          >
                            <CalendarToday color="primary" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight="medium">
                              Date
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {new Date(eventData.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </Typography>
                          {eventHasPassed && (
                            <Typography variant="caption" color="error">
                              This event has already passed
                            </Typography>
                          )}
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            height: "100%",
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                              gap: 1,
                            }}
                          >
                            <AccessTime color="primary" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight="medium">
                              Time
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {eventData.time}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                              gap: 1,
                            }}
                          >
                            <LocationOn color="primary" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight="medium">
                              Location
                            </Typography>
                          </Box>
                          <Typography variant="body2" paragraph>
                            {eventData.location?.address || "Not specified"}
                          </Typography>
                          {eventData.location?.latitude &&
                            eventData.location?.longitude && (
                              <Box
                                sx={{
                                  height: 400,
                                  borderRadius: 1,
                                  mt: 2,
                                  overflow: "hidden",
                                }}
                              >
                                <MapContainer
                                  center={[
                                    eventData.location.latitude,
                                    eventData.location.longitude,
                                  ]}
                                  zoom={15}
                                  style={{ height: "100%", width: "100%" }}
                                >
                                  <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  />
                                  <Marker
                                    position={[
                                      eventData.location.latitude,
                                      eventData.location.longitude,
                                    ]}
                                  >
                                    <Popup>{eventData.name}</Popup>
                                  </Marker>
                                </MapContainer>
                              </Box>
                            )}
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            height: "100%",
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                              gap: 1,
                            }}
                          >
                            <People color="primary" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight="medium">
                              Category
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {eventData.category}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            height: "100%",
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="medium"
                            sx={{ mb: 1 }}
                          >
                            Price
                          </Typography>
                          <Typography
                            variant="h6"
                            color="primary"
                            fontWeight="bold"
                          >
                            {eventData.price === "0" || eventData.price === null
                              ? "FREE"
                              : `EGP ${eventData.price}`}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      position: "sticky",
                      top: 20,
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    {/* Event Summary Card */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ mb: 2 }}
                        fontWeight="medium"
                      >
                        Event Summary
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Date
                          </Typography>
                          <Typography>
                            {new Date(eventData.date).toLocaleDateString()}
                          </Typography>
                          {eventHasPassed && (
                            <Typography variant="caption" color="error">
                              Event has ended
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Time
                          </Typography>
                          <Typography>{eventData.time}</Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Location
                          </Typography>
                          <Typography>
                            {eventData.location?.address || "Not specified"}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Price
                          </Typography>
                          <Typography fontWeight="medium">
                            {eventData.price === "0" || eventData.price === null
                              ? "FREE"
                              : `EGP ${eventData.price}`}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    {/* Share Card */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ mb: 2 }}
                        fontWeight="medium"
                      >
                        Share This Event
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="medium"
                          fullWidth
                          sx={{
                            textTransform: "none",
                          }}
                        >
                          Facebook
                        </Button>
                        <Button
                          variant="outlined"
                          size="medium"
                          fullWidth
                          sx={{
                            textTransform: "none",
                          }}
                        >
                          Twitter
                        </Button>
                        <Button
                          variant="outlined"
                          size="medium"
                          fullWidth
                          sx={{
                            textTransform: "none",
                          }}
                        >
                          Copy Link
                        </Button>
                      </Box>
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer/>
    </>
  );
};

export default EventDetails;