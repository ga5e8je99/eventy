import React, { useState, useEffect } from "react";
import Cart from "./Cart";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";

export default function Fav() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!token) {
          throw new Error("Please login to view favorites");
        }

        const response = await axios.get(
          "https://eventplanner-production-ce6e.up.railway.app/api/events/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }
        );

        const formattedFavorites = response.data.data.map(event => ({
          ...event,
          // Handle location object
          location: event.location?.address || event.location || 'Location not specified',
          // Handle missing image
          image: event.image || "https://source.unsplash.com/random/600x400/?event"
        }));

        setFavorites(formattedFavorites);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please login again");
          localStorage.removeItem("authToken");
        } else {
          setError(err.response?.data?.message || err.message);
        }
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  const handleRemoveFavorite = async (eventId) => {
    try {
      if (!token) {
        throw new Error("Please login to manage favorites");
      }

      await axios.delete(
        `https://eventplanner-production-ce6e.up.railway.app/api/events/favorites/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      setFavorites(prev => prev.filter(item => item._id !== eventId));
      setError("Removed from favorites");
      setSnackbarOpen(true);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again");
        localStorage.removeItem("authToken");
      } else {
        setError(err.response?.data?.message || err.message);
      }
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (!token) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="300px"
        color="text.secondary"
        textAlign="center"
        p={4}
      >
        <FavoriteIcon fontSize="large" color="primary" />
        <Typography variant="h5" mt={2} color="primary">
          Please login to view favorites
        </Typography>
      </Box>
    );
  }

  if (favorites.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="300px"
        color="text.secondary"
        textAlign="center"
        p={4}
      >
        <FavoriteIcon fontSize="large" color="primary" />
        <Typography variant="h5" mt={2} color="primary">
          {error?.includes("expired") ? "Session expired" : "No favorites yet"}
        </Typography>
        <Typography variant="body1" mt={1}>
          {error?.includes("expired") 
            ? "Please login again" 
            : "Add events to your favorites to see them here"}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 4,
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 4,
            textAlign: "center",
            color: theme.palette.primary.main,
          }}
        >
          Your Favorites
        </Typography>

        <Grid container spacing={4}>
          {favorites.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={item._id}
              display="flex"
              justifyContent="center"
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <Cart
                  {...item}
                  isFavorite= {true}
                  onFavoriteToggle={() => handleRemoveFavorite(item._id)}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error === "Removed from favorites" ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}