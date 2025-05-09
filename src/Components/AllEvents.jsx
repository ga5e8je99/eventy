import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Container,
  Slide,
  Fade,
  Grow,
  useMediaQuery,
  useTheme,
  Collapse,
  Card as MuiCard,
  Stack,
  Rating,
  IconButton,
  Chip,
  Snackbar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Link } from "react-router";
import Image from "../assets/logo.svg";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Helper functions
  const capitalize = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());
  const getLastTwoWords = (address) =>
    address ? address.split(" ").slice(-2).join(" ") : "";

  useEffect(() => {
    const token = localStorage.getItem("authToken") || "";
    setToken(token);
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://eventplanner-production-ce6e.up.railway.app/api/events/getevents",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(response.data.events);
      console.log(response.data.events)
      setFilteredEvents(response.data.events);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(
          response.data.events.map((event) => capitalize(event.category))
        ),
      ];

      setCategories(uniqueCategories);

      // Initialize favorite status
      if (token) {
        await checkFavoriteStatus(response.data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async (eventsList) => {
    try {
      const response = await axios.get(
        "https://eventplanner-production-ce6e.up.railway.app/api/events/favorites",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const favoriteIds = response.data.data.map((event) => event._id);
      const statusMap = {};
      eventsList.forEach((event) => {
        statusMap[event._id] = favoriteIds.includes(event._id);
      });
      setFavoriteStatus(statusMap);
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  const toggleFavorite = async (eventId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      setSnackbar({
        open: true,
        message: "Please login to manage favorites",
        severity: "warning",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (favoriteStatus[eventId]) {
        await axios.delete(
          `https://eventplanner-production-ce6e.up.railway.app/api/events/favorites/${eventId}`,
          config
        );
        setSnackbar({
          open: true,
          message: "Removed from favorites",
          severity: "info",
        });
      } else {
        await axios.post(
          `https://eventplanner-production-ce6e.up.railway.app/api/events/favorites/${eventId}`,
          {},
          config
        );
        setSnackbar({
          open: true,
          message: "Added to favorites",
          severity: "success",
        });
      }

      setFavoriteStatus((prev) => ({
        ...prev,
        [eventId]: !prev[eventId],
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update favorites",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  // Filter events
  useEffect(() => {
    let results = events;

    if (searchTerm) {
      results = results.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      results = results.filter((event) =>
        selectedCategories.includes(capitalize(event.category))
      );
    }

    setFilteredEvents(results);
  }, [searchTerm, selectedCategories, events]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleFilters = () => setShowFilters(!showFilters);
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  if (!token) {
    return (
      <Fade in timeout={500}>
        <Alert severity="error" sx={{ mt: 2 }}>
          No access token found. Please log in first.
        </Alert>
      </Fade>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Slide direction="down" in timeout={500}>
        <Box sx={{ mt: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={fetchEvents}>
            Retry
          </Button>
        </Box>
      </Slide>
    );
  }

  // Mobile List Item Component with improved text wrapping
  const MobileEventItem = ({ event }) => (
    <Link
      to={`/events/${event._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <ListItem
        sx={{
          px: 0,
          py: 2,
          alignItems: "flex-start",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <ListItemAvatar sx={{ minWidth: 80, mt: 1 }}>
          <Avatar
            src={event.image || Image}
            alt={event.name}
            variant="rounded"
            sx={{
              width: 80,
              height: 80,
              marginRight: 2,
              "& img": {
                objectFit: event.image ? "cover" : "contain",
              },
            }}
          />
        </ListItemAvatar>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                flex: 1,
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}
            >
              {event.name}
            </Typography>
            <IconButton
              onClick={(e) => toggleFavorite(event._id, e)}
              size="small"
              sx={{ ml: 1, mt: -0.5 }}
            >
              {favoriteStatus[event._id] ? (
                <StarIcon color="warning" />
              ) : (
                <StarBorderIcon />
              )}
            </IconButton>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              wordBreak: "break-word",
              whiteSpace: "normal",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {event.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {new Date(event.date).toLocaleDateString()}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                flex: 1,
                textAlign: "right",
                wordBreak: "break-word",
              }}
            >
              {getLastTwoWords(event.location?.address)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "40px",
            }}
          >
            <Chip
              label={capitalize(event.category)}
              size="small"
              sx={{
                mt: 1,
                alignSelf: "flex-start",
                backgroundColor: theme.palette.primary.main,
                color: "white",
              }}
            />
            <Rating
              value={5}
              precision={0.5}
              readOnly
              size="small"
              sx={{ mr: 0.5 }}
            />
          </Box>
        </Box>
      </ListItem>
      <Divider />
    </Link>
  );

  // Desktop Card Component (unchanged)
  const DesktopEventCard = ({ event, index }) => (
    <Grow in timeout={(index + 1) * 200}>
      <Grid item xs={12} sm={5} md={4} lg={3}>
        <Link
          to={`/events/${event._id}`}
          style={{ textDecoration: "none", display: "block", height: "100%" }}
        >
          <MuiCard
            sx={{
              height: "100%",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: theme.shadows[3],
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: theme.shadows[6],
                transform: "translateY(-4px)",
              },
            }}
          >
            {/* Image Section */}
            <Box sx={{ height: 180, position: "relative", overflow: "hidden" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
                }}
              />
              <img
                src={event.image || Image}
                alt={event.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: event.image ? "cover" : "contain",
                }}
              />
              <IconButton
                onClick={(e) => toggleFavorite(event._id, e)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: favoriteStatus[event._id]
                    ? theme.palette.warning.main
                    : "white",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  zIndex: 2,
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.6)" },
                }}
              >
                {favoriteStatus[event._id] ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  color: "white",
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  fontSize: "1.25rem",
                  width:'60%',
                  zIndex: 2,
                }}
              >
                {event.name}
              </Typography>
              <Chip
                label={capitalize(event.category)}
                color="primary"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  fontWeight: 600,
                  color: "white",
                  zIndex: 2,
                  backgroundColor: theme.palette.primary.main,
                }}
              />
            </Box>

            {/* Content Section */}
            <Box sx={{ p: 3, position: "relative" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6" fontWeight={600} noWrap>
                  {event.name}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Rating
                    value={4.5} // Static rating for example
                    precision={0.5}
                    readOnly
                    size="small"
                    sx={{ mr: 0.5 }}
                  />
                </Box>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                mb={2}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                  width: "100%",
                }}
              >
                {event.description}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                mb={3}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ maxWidth: "50%" }}
                >
                  {getLastTwoWords(event.location?.address)}
                </Typography>
              </Stack>

              <Button
                variant="text"
                color="primary"
                sx={{ borderRadius: "24px", py: 1 }}
              >
                View Details
              </Button>
            </Box>
          </MuiCard>
        </Link>
      </Grid>
    </Grow>
  );

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        mb: 4,
        px: isMobile ? 2 : 3,
        overflowX: "hidden",
      }}
    >
      {/* Search and Filter Section */}
      <Box
        elevation={2}
        sx={{
          mb: 4,
          borderRadius: 2,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: isMobile ? 8 : 16,
                },
              }}
            />
            <Button
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<FilterListIcon />}
              onClick={toggleFilters}
              sx={{
                borderRadius: 1,
                px: 3,
                whiteSpace: "nowrap",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Filters
            </Button>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
              width: "100%",
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              Filter by Category
            </Typography>
            <FormGroup
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {categories.map((category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      color="primary"
                    />
                  }
                  label={category}
                  sx={{
                    minWidth: isMobile ? "100%" : "auto",
                    mr: 0,
                  }}
                />
              ))}
            </FormGroup>
          </Box>
        </Collapse>
      </Box>

      {/* Events Display */}
      {filteredEvents.length === 0 ? (
        <Fade in timeout={500}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "300px",
              textAlign: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              No events found matching your criteria
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategories([]);
              }}
              sx={{ width: isMobile ? "100%" : "auto" }}
            >
              Clear filters
            </Button>
          </Box>
        </Fade>
      ) : isMobile ? (
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          {filteredEvents.map((event, index) => (
            <MobileEventItem key={event._id} event={event} />
          ))}
        </List>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {filteredEvents.map((event, index) => (
            <DesktopEventCard key={event._id} event={event} index={index} />
          ))}
        </Grid>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ width: isMobile ? "90%" : "auto" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AllEvents;
