import {
  Box,
  Typography,
  Card as MuiCard,
  Stack,
  Rating,
  Button,
  IconButton,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Link } from "react-router";
import axios from "axios";

export default function EventCard({
  image,
  title,
  imageDesc,
  id,
  category,
  rating,
  description,
  date,
  location,
  fit,
  isFavorite: initialIsFavorite = false,
}) {
  const theme = useTheme();
  const token = localStorage.getItem("authToken");
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Check if event is in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          "https://eventplanner-production-ce6e.up.railway.app/api/events/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if current event exists in favorites
        const favoriteEventIds = response.data.data.map((event) => event._id);
        setIsFavorite(favoriteEventIds.includes(id));
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [token, id]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      setSnackbarMessage("Please login to manage favorites");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (isFavorite) {
        // Remove from favorites
        await axios.delete(
          `https://eventplanner-production-ce6e.up.railway.app/api/events/favorites/${id}`,
          config
        );
        setSnackbarMessage("Removed from favorites");
        setSnackbarSeverity("info");
      } else {
        // Add to favorites
        await axios.post(
          `https://eventplanner-production-ce6e.up.railway.app/api/events/favorites/${id}`,
          {},
          config
        );
        setSnackbarMessage("Added to favorites");
        setSnackbarSeverity("success");
      }
      setIsFavorite(!isFavorite);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error toggling favorite:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        setSnackbarMessage(
          error.response.data.message || "Failed to update favorites"
        );
      } else {
        setSnackbarMessage("Failed to update favorites");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Link
        to={`/events/${id}`}
        style={{
          textDecoration: "none",
          borderRadius: theme.shape.borderRadius,
          display: "block",
          height: "100%",
        }}
      >
        <MuiCard
          sx={{
            height: "100%",
            width:'100%',
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
          <Box
            sx={{
              height: 180,
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
              },
            }}
          >
            <img
              src={image}
              alt={imageDesc}
              style={{
                width: "100%",
                height: "100%",
                objectFit: fit,
                transition: "transform 0.5s ease",
              }}
            />

            <IconButton
              onClick={toggleFavorite}
              disabled={isLoading}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: isFavorite ? theme.palette.warning.main : "white",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 2,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                },
              }}
            >
              {isFavorite ? <StarIcon /> : <StarBorderIcon />}
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
                maxWidth: "70%",
                zIndex: 2,
              }}
            >
              {title}
            </Typography>
            <Chip
              label={category}
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

          <Box sx={{ p: 3, position: "relative", minHeight: 200 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6" fontWeight={600} noWrap>
                {title}
              </Typography>
              <Box display="flex" alignItems="center">
                <Rating
                  value={rating}
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
              {description}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              mb={3}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" color="text.secondary">
                {new Date(date).toLocaleDateString()}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{ maxWidth: "50%" }}
              >
                {location}
              </Typography>
            </Stack>

            <Button
              variant="text"
              color="primary"
              sx={{
                borderRadius: "24px",
                py: 1,
              }}
            >
              View Details
            </Button>
          </Box>
        </MuiCard>
      </Link>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
