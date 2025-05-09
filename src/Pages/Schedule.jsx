import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Skeleton,
  useTheme,
  Paper,
  Badge,
} from "@mui/material";
import axios from "axios";
import Navbar from "../Components/Navbar";
import ChatPot from "../Components/ChatPot";
import Footer from "../Components/Footer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import dayjs from "dayjs";
import {
  Event,
  LocationOn,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";

function ServerDay(props) {
  const { events = [], day, outsideCurrentMonth, ...other } = props;

  const hasEvent = events.some(event => 
    dayjs(event.date).isSame(day, 'day')
  );

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={hasEvent ? "•" : undefined}
      color="primary"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          ...(hasEvent && {
            backgroundColor: "primary.light",
            color: "primary.contrastText",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }),
        }}
      />
    </Badge>
  );
}

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const theme = useTheme();
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setIsCalendarLoading(true);
        const response = await axios.get(
          `https://eventplanner-production-ce6e.up.railway.app/api/auth/viewprofilewithevent/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userEvents = response.data.registeredEvents || [];
        setEvents(userEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
        setIsCalendarLoading(false);
      }
    };

    fetchEvents();
  }, [userId, token]);

  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMMM D, YYYY");
  };

  const formatTime = (dateString) => {
    return dayjs(dateString).format("h:mm A");
  };

  return (
    <>
      <Navbar activePage={"Schedule"} />
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: "1800px",
          margin: "0 auto",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: theme.palette.background.paper,
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: theme.palette.text.primary,
                }}
              >
                <CalendarToday color="primary" />
                Event Calendar
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  loading={isCalendarLoading}
                  renderLoading={() => <DayCalendarSkeleton />}
                  slots={{
                    day: ServerDay,
                  }}
                  slotProps={{
                    day: {
                      events,
                    },
                  }}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}
                />
              </LocalizationProvider>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: theme.palette.text.primary,
                }}
              >
                <Event color="primary" />
                Upcoming Events
              </Typography>

              {loading ? (
                <Grid container spacing={3}>
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Skeleton
                          variant="rounded"
                          width="100%"
                          height={180}
                        />
                      </Grid>
                    ))}
                </Grid>
              ) : events.length > 0 ? (
                <Grid container spacing={3}>
                  {events
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((event) => (
                      <Grid item xs={12} sm={6} key={event._id}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: 2,
                            borderRadius: 3,
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: 4,
                            },
                            backgroundColor: theme.palette.background.default,
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 600 }}
                              >
                                {event.name}
                              </Typography>
                              <Chip
                                label={event.type}
                                size="small"
                                color={
                                  event.type === "Public"
                                    ? "primary"
                                    : "secondary"
                                }
                              />
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <CalendarToday
                                color="action"
                                sx={{ mr: 1, fontSize: "1rem" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(event.date)}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <AccessTime
                                color="action"
                                sx={{ mr: 1, fontSize: "1rem" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatTime(event.date)}
                              </Typography>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="body2" sx={{ mb: 2 }}>
                              {event.description}
                            </Typography>

                            <Box
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <LocationOn
                                color="action"
                                sx={{ mr: 1, fontSize: "1rem" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {event.location?.address ||
                                  "Location not specified"}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "300px",
                    textAlign: "center",
                  }}
                >
                  <Event
                    sx={{
                      fontSize: 60,
                      color: theme.palette.text.disabled,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    No upcoming events
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create or join events to see them here
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <ChatPot />
      <Footer />
    </>
  );
}