import React, {
  useEffect,
  useState,
  useCallback,
  memo,
  useMemo,
  useContext,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Material-UI Components
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import RoomIcon from "@mui/icons-material/Room";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Skeleton from "@mui/material/Skeleton";
import { LocationContext } from "../Contexts/LocationContect";

// Fix for default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Egypt bounds
const EGYPT_BOUNDS = {
  north: 31.8,
  south: 22.0,
  west: 24.5,
  east: 37.0,
};

// Custom marker icon
const createCustomIcon = () => {
  return new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Memoized components
const MemoizedMapContainer = memo(MapContainer);
const MemoizedTileLayer = memo(TileLayer);
const MemoizedMarker = memo(Marker);

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Location Marker Component
const LocationMarker = memo(function LocationMarker({ setLocation, location }) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const map = useMap();

  const checkIfInEgypt = useCallback((lat, lng) => {
    return (
      lat >= EGYPT_BOUNDS.south &&
      lat <= EGYPT_BOUNDS.north &&
      lng >= EGYPT_BOUNDS.west &&
      lng <= EGYPT_BOUNDS.east
    );
  }, []);

  // Reverse geocoding function
  const reverseGeocode = useCallback(
    debounce(async (lat, lng) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en&countrycodes=eg`
        );
        const data = await response.json();

        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.county ||
          "Unknown";

        const governorate =
          data.address?.state || data.address?.region || "Unknown";

        setLocation({
          latitude: lat,
          longitude: lng,
          address: data.display_name || "Address not found",
          city: city,
          governorate: governorate,
          country: data.address?.country || "Egypt",
        });
        setLoading(false);
      } catch (err) {
        console.error("Reverse geocode failed:", err);
        setLocation({
          latitude: lat,
          longitude: lng,
          address: "Address not found",
          city: "Unknown",
          governorate: "Unknown",
          country: "Egypt",
        });
        setLoading(false);
      }
    }, 300),
    [setLocation]
  );

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      if (!checkIfInEgypt(lat, lng)) {
        alert("Please select a location within Egypt");
        return;
      }

      setPosition(e.latlng);
      setLoading(true);
      reverseGeocode(lat, lng);
    },
  });

  useEffect(() => {
    if (location?.latitude && location?.longitude && !position) {
      const lat = location.latitude;
      const lng = location.longitude;
      if (checkIfInEgypt(lat, lng)) {
        setPosition([lat, lng]);
        map.setView([lat, lng], 13);
      }
    }
  }, [location, map, checkIfInEgypt, position]);

  if (!position) return null;

  return (
    <>
      <MemoizedMarker position={position} icon={createCustomIcon()}>
        <Popup>
          <Box sx={{ p: 1, minWidth: 150 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              📍 Selected Location
            </Typography>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <Typography variant="caption">
                {location?.city || "Location selected"}
              </Typography>
            )}
          </Box>
        </Popup>
      </MemoizedMarker>
    </>
  );
});

// Recenter Button
const RecenterButton = memo(function RecenterButton({ lat, lng }) {
  const map = useMap();

  const handleClick = useCallback(() => {
    map.setView([lat, lng], 13);
  }, [map, lat, lng]);

  return (
    <div className="leaflet-top leaflet-right" style={{ top: "70px" }}>
      <div className="leaflet-control">
        <IconButton
          onClick={handleClick}
          sx={{
            bgcolor: "white",
            color: "primary.main",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.50" },
          }}
          size="small"
        >
          <MyLocationIcon />
        </IconButton>
      </div>
    </div>
  );
});

// Quick City Buttons
const QuickCityButtons = memo(function QuickCityButtons() {
  const map = useMap();

  const majorCities = useMemo(
    () => [
      { name: "Cairo", coords: [30.0444, 31.2357] },
      { name: "Alexandria", coords: [31.2001, 29.9187] },
      { name: "Giza", coords: [30.0131, 31.2089] },
      { name: "Sharm El Sheikh", coords: [27.9158, 34.3299] },
      { name: "Hurghada", coords: [27.2579, 33.8116] },
    ],
    []
  );

  const handleCityClick = useCallback(
    (coords) => {
      map.setView(coords, 12);
    },
    [map]
  );

  return (
    <div className="leaflet-top leaflet-left">
      <div
        className="leaflet-control"
        style={{
          background: "white",
          padding: "12px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          maxWidth: "180px",
        }}
      >
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{ mb: 1.5, display: "block", color: "text.primary" }}
        >
          🏙️ Major Cities
        </Typography>
        <Stack spacing={1}>
          {majorCities.map((city, idx) => (
            <Button
              key={idx}
              variant="outlined"
              size="small"
              onClick={() => handleCityClick(city.coords)}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                py: 0.5,
                fontSize: "0.8rem",
              }}
            >
              {city.name}
            </Button>
          ))}
        </Stack>
      </div>
    </div>
  );
});

// Main Component
export default function Location({ onChange }) {
  const { location, setLocation } = useContext(LocationContext);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapKey, setMapKey] = useState(Date.now()); // Key to force re-render

  const handleSetLocation = useCallback(
    (loc) => {
      setLocation(loc);
      if (typeof onChange === "function") onChange(loc);
    },
    [setLocation, onChange]
  );

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Browser doesn't support geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (
          !(
            latitude >= EGYPT_BOUNDS.south &&
            latitude <= EGYPT_BOUNDS.north &&
            longitude >= EGYPT_BOUNDS.west &&
            longitude <= EGYPT_BOUNDS.east
          )
        ) {
          alert("You're outside Egypt. Please select a location within Egypt.");
          return;
        }

        handleSetLocation({
          latitude,
          longitude,
          address: "Fetching address...",
          city: "",
          governorate: "",
          country: "Egypt",
        });

        // Force map re-render
        setMapKey(Date.now());
      },
      (error) => {
        alert("Failed to get current location");
        console.error(error);
      }
    );
  }, [handleSetLocation]);

  // Ensure default location object exists
  const defaultLocation = useMemo(
    () => ({
      latitude: location?.latitude || 26.8206,
      longitude: location?.longitude || 30.8025,
      address: location?.address || "",
      city: location?.city || "",
      governorate: location?.governorate || "",
      country: location?.country || "Egypt",
    }),
    [location]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 3 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <MapIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600} color="primary">
              Event Location Selection
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a location within Egypt using the map below
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2}>
          {/* Map Section */}
          <Grid item xs={12}>
            <Card
              variant="outlined"
              sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}
            >
              <Box sx={{ position: "relative", height: 400 }}>
                {mapLoading && (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                  />
                )}

                <MemoizedMapContainer
                  key={mapKey} // Add key to force re-render
                  center={[26.8206, 30.8025]}
                  zoom={6}
                  style={{
                    height: "100%",
                    width: "100%",
                    opacity: mapLoading ? 0 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                  minZoom={6}
                  maxBounds={[
                    [EGYPT_BOUNDS.south, EGYPT_BOUNDS.west],
                    [EGYPT_BOUNDS.north, EGYPT_BOUNDS.east],
                  ]}
                  whenReady={() => setMapLoading(false)}
                  zoomControl={false}
                  scrollWheelZoom={true}
                  doubleClickZoom={true}
                  dragging={true}
                  className="leaflet-container"
                >
                  <MemoizedTileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker
                    setLocation={handleSetLocation}
                    location={defaultLocation}
                  />
                  <RecenterButton
                    lat={defaultLocation.latitude}
                    lng={defaultLocation.longitude}
                  />
                  <QuickCityButtons />
                </MemoizedMapContainer>

                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    zIndex: 1000,
                  }}
                >
                  <Chip
                    icon={<LanguageIcon />}
                    label="📍 Egypt Only"
                    color="primary"
                    variant="filled"
                    size="small"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>

              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<GpsFixedIcon />}
                    onClick={handleUseCurrentLocation}
                    size="small"
                    sx={{ minWidth: 140 }}
                  >
                    Use Current Location
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Or click on the map to select location
                  </Typography>
                </Stack>

                <Alert severity="info" icon={<LocationOnIcon />}>
                  <Typography variant="body2">
                    <strong>Note:</strong> Please ensure the location is within
                    Egypt's borders. Locations outside Egypt will not be
                    accepted.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          {/* Location Details */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <CheckCircleIcon color="success" />
                <Typography variant="h6" fontWeight={600}>
                  Selected Location Details
                </Typography>
              </Stack>

              {defaultLocation.latitude ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        height: "100%",
                        bgcolor: "white",
                        transition: "box-shadow 0.2s",
                        "&:hover": {
                          boxShadow: 1,
                        },
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <RoomIcon color="primary" fontSize="small" />
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            color="primary"
                          >
                            Geographic Coordinates
                          </Typography>
                        </Stack>
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Latitude:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {Number(defaultLocation.latitude).toFixed(6)}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Longitude:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {Number(defaultLocation.longitude).toFixed(6)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        height: "100%",
                        bgcolor: "white",
                        transition: "box-shadow 0.2s",
                        "&:hover": {
                          boxShadow: 1,
                        },
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationCityIcon
                            color="primary"
                            fontSize="small"
                          />
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            color="primary"
                          >
                            Location Information
                          </Typography>
                        </Stack>
                        <Stack spacing={1}>
                          <Chip
                            label={defaultLocation.city || "City not specified"}
                            color="primary"
                            variant="outlined"
                            size="small"
                            icon={<PlaceIcon />}
                            sx={{ width: "fit-content" }}
                          />
                          {defaultLocation.governorate && (
                            <Chip
                              label={defaultLocation.governorate}
                              color="secondary"
                              variant="outlined"
                              size="small"
                              sx={{ width: "fit-content" }}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: "white",
                        transition: "box-shadow 0.2s",
                        "&:hover": {
                          boxShadow: 1,
                        },
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <HomeIcon color="primary" fontSize="small" />
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            color="primary"
                          >
                            Full Address
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.6,
                            wordBreak: "break-word",
                            color: "text.primary",
                          }}
                        >
                          {defaultLocation.address ||
                            "No address selected yet"}
                        </Typography>
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    No location selected yet. Please click on the map to choose
                    an event location.
                  </Typography>
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}