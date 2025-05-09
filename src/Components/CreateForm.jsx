import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Collapse,
  Avatar,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Egypt geographical boundaries
const egyptBounds = [
  [22.0, 24.7], // Southwest coordinates
  [31.7, 37.0], // Northeast coordinates
];

const predefinedCategories = [
  "Finance & Business",
  "Technology",
  "Health & Wellness",
  "Arts & Culture",
  "Education",
  "Social",
];

const steps = ["Basic Information", "Event Details", "Location", "Review"];

function SearchControl({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const map = useMap();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=eg&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        if (
          lat >= egyptBounds[0][0] &&
          lat <= egyptBounds[1][0] &&
          lon >= egyptBounds[0][1] &&
          lon <= egyptBounds[1][1]
        ) {
          map.flyTo([lat, lon], 15);
          onSearch({
            address: display_name,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          });
        } else {
          alert("Please select a location within Egypt's borders");
        }
      } else {
        alert("Location not found, please try a different address");
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      alert("An error occurred while searching, please try again");
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1000,
        width: "calc(100% - 20px)",
        maxWidth: "400px",
      }}
    >
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for an address in Egypt..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
              >
                Search
              </Button>
            ),
            sx: {
              backgroundColor: "background.paper",
              borderRadius: "4px",
            },
          }}
        />
      </form>
    </Box>
  );
}

function LocationMarker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition);
  const map = useMapEvents({
    async click(e) {
      if (
        e.latlng.lat >= egyptBounds[0][0] &&
        e.latlng.lat <= egyptBounds[1][0] &&
        e.latlng.lng >= egyptBounds[0][1] &&
        e.latlng.lng <= egyptBounds[1][1]
      ) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
          );
          const data = await response.json();
          const address = data.display_name || "Selected location";

          const newPosition = {
            address: address,
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
          };

          setPosition(newPosition);
          onLocationSelect(newPosition);
        } catch (error) {
          const newPosition = {
            address: "Selected location",
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
          };
          setPosition(newPosition);
          onLocationSelect(newPosition);
          console.log(error);
        }
      } else {
        alert("Please select a location within Egypt's borders");
      }
    },
  });

  useEffect(() => {
    if (initialPosition && initialPosition.latitude) {
      map.flyTo([initialPosition.latitude, initialPosition.longitude], 15);
    }
  }, [initialPosition, map]);

  return position?.latitude ? (
    <Marker position={[position.latitude, position.longitude]}>
      <Popup>{position.address}</Popup>
    </Marker>
  ) : null;
}

export default function CreateEventForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategoryField, setShowCustomCategoryField] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem("authToken") || "";

  const [createEvent, setCreateEvent] = useState({
    name: "",
    description: "",
    category: "",
    location: {
      address: "",
      latitude: null,
      longitude: null,
    },
    price: "0",
    date: "",
    time: "09:00:00 AM",
    type: "Public",
    hostCompany: "",
    isRecurring: "Not Annual",
    picture: null,
    coverImage: null,
  });

  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enhanced alert states
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [createdEvent, setCreatedEvent] = useState(null);

  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      if (!createEvent.name || !createEvent.description || !createEvent.hostCompany) {
        setAlert({
          open: true,
          message: "Please fill all required fields",
          severity: "error",
        });
        return;
      }
    } else if (activeStep === 1) {
      if (!createEvent.category || !createEvent.date) {
        setAlert({
          open: true,
          message: "Please fill all required fields",
          severity: "error",
        });
        return;
      }
    } else if (activeStep === 2) {
      if (!createEvent.location.address || !createEvent.location.latitude) {
        setAlert({
          open: true,
          message: "Please select the event location",
          severity: "error",
        });
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match("image.*")) {
        setAlert({
          open: true,
          message: "Please upload an image file",
          severity: "error",
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAlert({
          open: true,
          message: "Image size should be less than 5MB",
          severity: "error",
        });
        return;
      }

      setCreateEvent({ ...createEvent, [field]: file });
    }
  };

  const handleLocationSelect = (location) => {
    setCreateEvent((prev) => ({
      ...prev,
      location: {
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));
  };

  const handleSearchResult = (location) => {
    handleLocationSelect(location);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCreateEvent({
      ...createEvent,
      category: value,
    });

    // Show custom category field only when "Other" is selected
    setShowCustomCategoryField(value === "Other");

    // Reset custom category if selecting a predefined one
    if (value !== "Other") {
      setCustomCategory("");
    }
  };

  const handleCustomCategoryChange = (e) => {
    const value = e.target.value;
    setCustomCategory(value);
    setCreateEvent({
      ...createEvent,
      category: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", createEvent.name);
    formData.append("description", createEvent.description);
    formData.append("category", createEvent.category.toLowerCase());
    formData.append("location[address]", createEvent.location.address);
    formData.append("location[latitude]", createEvent.location.latitude);
    formData.append("location[longitude]", createEvent.location.longitude);
    formData.append("price", createEvent.price);
    formData.append("date", new Date(createEvent.date).toISOString());
    formData.append("hostCompany", createEvent.hostCompany);

    const formattedTime =
      createEvent.time.includes("AM") || createEvent.time.includes("PM")
        ? createEvent.time
        : `${createEvent.time} AM`;
    formData.append("time", formattedTime);

    formData.append("type", createEvent.type);
    formData.append("isRecurring", createEvent.isRecurring);

    if (createEvent.picture) {
      formData.append("image", createEvent.picture);
    }

    if (createEvent.coverImage) {
      formData.append("coverImage", createEvent.coverImage);
    }

    try {
      const response = await fetch(
        "https://eventplanner-production-ce6e.up.railway.app/api/events/addevents",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCreatedEvent(data.event);
        setAlert({
          open: true,
          message: "Event created successfully!",
          severity: "success",
        });

        // Reset form
        setCreateEvent({
          name: "",
          description: "",
          category: "",
          location: {
            address: "",
            latitude: null,
            longitude: null,
          },
          price: "0",
          date: "",
          time: "09:00:00 AM",
          type: "Public",
          isRecurring: "Not Annual",
          picture: null,
          coverImage: null,
          hostCompany: "",
        });
        setCustomCategory("");
        setShowCustomCategoryField(false);
        setActiveStep(0);
      } else {
        setAlert({
          open: true,
          message: data.message || "Failed to create event",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "An error occurred while creating the event",
        severity: "error",
      });
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {/* Event Images Section */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  height: "100%",
                }}
              >
                {/* Main Image Upload */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: 600, color: "primary.dark" }}
                  >
                    Main Event Image *
                  </Typography>
                  <input
                    accept="image/*"
                    id="event-image-upload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, "picture")}
                  />
                  <label htmlFor="event-image-upload" style={{ width: "100%" }}>
                    <IconButton component="span" sx={{ p: 0, width: "100%" }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: isMobile ? 150 : 200,
                          border: "2px dashed",
                          borderColor: "divider",
                          background:
                            "linear-gradient(45deg, rgba(25, 118, 210, 0.05), rgba(156, 39, 176, 0.05))",
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: 2,
                            borderColor: "primary.main",
                          },
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {createEvent.picture ? (
                          <>
                            <img
                              src={URL.createObjectURL(createEvent.picture)}
                              alt="Preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background:
                                  "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                                "&:hover": {
                                  opacity: 1,
                                },
                              }}
                            >
                              <AddPhotoAlternateIcon
                                sx={{ fontSize: 40, color: "white", mb: 1 }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: "white" }}
                              >
                                Change Main Image
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <>
                            <AddPhotoAlternateIcon
                              sx={{
                                fontSize: isMobile ? 40 : 50,
                                color: "primary.main",
                                mb: 1,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: isMobile ? "0.7rem" : "0.8rem",
                                textAlign: "center",
                                px: 2,
                              }}
                            >
                              Upload main event image (2:1 ratio recommended)
                            </Typography>
                          </>
                        )}
                      </Box>
                    </IconButton>
                  </label>
                  {createEvent.picture && (
                    <Box sx={{ width: "100%", mt: 1 }}>
                      <Chip
                        label={createEvent.picture.name}
                        onDelete={() =>
                          setCreateEvent({ ...createEvent, picture: null })
                        }
                        sx={{
                          maxWidth: "100%",
                          background:
                            "linear-gradient(45deg, primary.light, secondary.light)",
                          color: "primary.contrastText",
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Cover Image Upload */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: 600, color: "primary.dark" }}
                  >
                    Cover Image
                  </Typography>
                  <input
                    accept="image/*"
                    id="cover-image-upload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, "coverImage")}
                  />
                  <label htmlFor="cover-image-upload" style={{ width: "100%" }}>
                    <IconButton component="span" sx={{ p: 0, width: "100%" }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: isMobile ? 80 : 100,
                          border: "2px dashed",
                          borderColor: "divider",
                          background:
                            "linear-gradient(45deg, rgba(25, 118, 210, 0.03), rgba(156, 39, 176, 0.03))",
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: 2,
                            borderColor: "secondary.main",
                          },
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {createEvent.coverImage ? (
                          <>
                            <img
                              src={URL.createObjectURL(createEvent.coverImage)}
                              alt="Cover Preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background:
                                  "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                                "&:hover": {
                                  opacity: 1,
                                },
                              }}
                            >
                              <AddPhotoAlternateIcon
                                sx={{ fontSize: 30, color: "white" }}
                              />
                            </Box>
                          </>
                        ) : (
                          <>
                            <AddPhotoAlternateIcon
                              sx={{
                                fontSize: isMobile ? 30 : 35,
                                color: "secondary.main",
                                mb: 0.5,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: isMobile ? "0.65rem" : "0.75rem",
                                textAlign: "center",
                                px: 2,
                              }}
                            >
                              Upload cover image (4:1 ratio recommended)
                            </Typography>
                          </>
                        )}
                      </Box>
                    </IconButton>
                  </label>
                  {createEvent.coverImage && (
                    <Box sx={{ width: "100%", mt: 1 }}>
                      <Chip
                        label={createEvent.coverImage.name}
                        onDelete={() =>
                          setCreateEvent({ ...createEvent, coverImage: null })
                        }
                        sx={{
                          maxWidth: "100%",
                          background:
                            "linear-gradient(45deg, secondary.light, primary.light)",
                          color: "secondary.contrastText",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Event Details Section */}
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Event Name *"
                  variant="outlined"
                  value={createEvent.name}
                  onChange={(e) =>
                    setCreateEvent({ ...createEvent, name: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "primary.main",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.dark",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Host Company *"
                  variant="outlined"
                  value={createEvent.hostCompany}
                  onChange={(e) =>
                    setCreateEvent({
                      ...createEvent,
                      hostCompany: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "primary.main",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.dark",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Event Description *"
                  variant="outlined"
                  value={createEvent.description}
                  onChange={(e) =>
                    setCreateEvent({
                      ...createEvent,
                      description: e.target.value,
                    })
                  }
                  multiline
                  rows={isMobile ? 4 : 6}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "primary.main",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.dark",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start" }}
                      >
                        <DescriptionIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={createEvent.category}
                    label="Category *"
                    onChange={handleCategoryChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "primary.main",
                        },
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  >
                    {predefinedCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                {showCustomCategoryField && (
                  <TextField
                    fullWidth
                    label="Custom Category *"
                    variant="outlined"
                    value={customCategory}
                    onChange={handleCustomCategoryChange}
                    sx={{ mt: 2 }}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Price (EGP)"
                  variant="outlined"
                  value={createEvent.price}
                  onChange={(e) =>
                    setCreateEvent({
                      ...createEvent,
                      price: e.target.value,
                    })
                  }
                  sx={{ width: "100%" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">EGP</InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 3,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <TextField
                  fullWidth
                  label="Event Date *"
                  type="date"
                  value={createEvent.date}
                  onChange={(e) =>
                    setCreateEvent({ ...createEvent, date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Event Time *"
                  value={createEvent.time}
                  onChange={(e) =>
                    setCreateEvent({ ...createEvent, time: e.target.value })
                  }
                  placeholder="09:00:00 AM"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 3,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Event Type *</InputLabel>
                  <Select
                    value={createEvent.type}
                    label="Event Type *"
                    onChange={(e) =>
                      setCreateEvent({ ...createEvent, type: e.target.value })
                    }
                  >
                    <MenuItem value="Public">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PublicIcon fontSize="small" />
                        Public
                      </Box>
                    </MenuItem>
                    <MenuItem value="Private">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LockIcon fontSize="small" />
                        Private
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Recurrence *</InputLabel>
                  <Select
                    value={createEvent.isRecurring}
                    label="Recurrence *"
                    onChange={(e) =>
                      setCreateEvent({
                        ...createEvent,
                        isRecurring: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="Not Annual">One-time</MenuItem>
                    <MenuItem value="Annual">Annual</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    mb: 2,
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <Box sx={{ width: { xs: "100%", md: "80%" } }}>
                    <TextField
                      fullWidth
                      label="Location Address *"
                      variant="outlined"
                      value={createEvent.location.address}
                      onChange={(e) => {
                        setCreateEvent((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            address: e.target.value,
                          },
                        }));
                      }}
                      sx={{ width: "100%" }}
                    />
                  </Box>

                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<LocationOnIcon />}
                    onClick={() => setMapDialogOpen(true)}
                    sx={{
                      width: isMobile ? "100%" : "auto",
                      borderRadius: "8px",
                      padding: "10px 20px",
                    }}
                  >
                    Select on Map
                  </Button>
                </Box>

                {createEvent.location.latitude && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1.5,
                      backgroundColor: "action.hover",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Selected Location:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      {createEvent.location.address}
                    </Typography>
                    <Chip
                      label={`Latitude: ${createEvent.location.latitude.toFixed(
                        5
                      )}, Longitude: ${createEvent.location.longitude.toFixed(
                        5
                      )}`}
                      size="small"
                      sx={{
                        backgroundColor: "action.selected",
                        color: "text.primary",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  height: "400px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <MapContainer
                  center={[26.8206, 30.8025]}
                  zoom={6}
                  style={{ height: "100%", width: "100%" }}
                  maxBounds={egyptBounds}
                  maxBoundsViscosity={1.0}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {createEvent.location.latitude && (
                    <Marker
                      position={[
                        createEvent.location.latitude,
                        createEvent.location.longitude,
                      ]}
                    >
                      <Popup>{createEvent.location.address}</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </Box>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: "primary.main" }}>
              Review Your Event Details
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  {createEvent.picture ? (
                    <Avatar
                      src={URL.createObjectURL(createEvent.picture)}
                      variant="rounded"
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: 200,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        bgcolor: "background.default",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1,
                      }}
                    >
                      <Typography>No Image Uploaded</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {createEvent.name || "No event name provided"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {createEvent.description || "No description provided"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Host Company:</strong> {createEvent.hostCompany || "Not specified"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Event Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {createEvent.category || "Not specified"}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="body1">
                    {createEvent.price} EGP
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {createEvent.date || "Not specified"}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Time
                  </Typography>
                  <Typography variant="body1">{createEvent.time}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">{createEvent.type}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Recurrence
                  </Typography>
                  <Typography variant="body1">
                    {createEvent.isRecurring}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Location
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                {createEvent.location.address || "No location selected"}
              </Typography>
              {createEvent.location.latitude && (
                <Typography variant="body2" color="text.secondary">
                  Coordinates: {createEvent.location.latitude.toFixed(5)},{" "}
                  {createEvent.location.longitude.toFixed(5)}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Event Images
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Main Image
                  </Typography>
                  {createEvent.picture ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: 150,
                        borderRadius: 1,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(createEvent.picture)}
                        alt="Main Event Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2">No image uploaded</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Cover Image
                  </Typography>
                  {createEvent.coverImage ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: 150,
                        borderRadius: 1,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(createEvent.coverImage)}
                        alt="Cover Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2">No cover image uploaded</Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
      {/* Enhanced Alert System */}
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          top: 16,
          left: 0,
          zIndex: 1400,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Collapse in={alert.open}>
          <Alert
            severity={alert.severity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleCloseAlert}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{
              mb: 2,
              width: isMobile ? "90%" : "60%",
              boxShadow: theme.shadows[4],
              alignItems: "center",
              "& .MuiAlert-message": {
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {alert.severity === "success" && <EventIcon sx={{ mr: 1 }} />}
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {alert.message}
              </Typography>
            </Box>
          </Alert>
        </Collapse>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 2 : 4,
          borderRadius: 3,
          boxShadow: 3,
          background: "background.paper",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 4,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "primary.main",
            mb: 3,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Create New Event
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>{renderStepContent(activeStep)}</Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{
              color: "primary.main",
              fontWeight: 600,
              visibility: activeStep === 0 ? "hidden" : "visible",
            }}
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>

      {/* Map Dialog */}
      <Dialog
        open={mapDialogOpen}
        onClose={() => setMapDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            height: isMobile ? "90vh" : "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <LocationOnIcon />
          Select Event Location (Egypt only)
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: "calc(100% - 64px)" }}>
          <MapContainer
            center={[26.8206, 30.8025]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
            maxBounds={egyptBounds}
            maxBoundsViscosity={1.0}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <SearchControl onSearch={handleSearchResult} />
            <LocationMarker
              onLocationSelect={handleLocationSelect}
              initialPosition={createEvent.location}
            />
          </MapContainer>
          {createEvent.location.latitude && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "background.paper",
                borderTop: "1px solid",
                borderColor: "divider",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {createEvent.location.address}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5 }}
              >
                Coordinates: {createEvent.location.latitude.toFixed(5)},{" "}
                {createEvent.location.longitude.toFixed(5)}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setMapDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setMapDialogOpen(false)}
                >
                  Confirm Location
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}