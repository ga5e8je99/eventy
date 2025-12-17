import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import NavBar from "../Components/NavBar";
import { useTranslation } from "react-i18next";
import Footer from "../Components/Footer";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import Image from "../assets/Image/Onboarding/image1.png";
import ItemsCard from "../Components/ItemsCard";
import Wave from "../Components/Wave";
import axios from "axios";

export default function Search() {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [eventCategories, setEventCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(
          `${apiUrl}/eventy/events/provided/events`
        );
        console.log("Fetched events:", response.data);
        setEventCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#search-items"
    );
    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const filteredEvents = useMemo(() => {
    if (!eventCategories || eventCategories.length === 0) return [];

    return eventCategories.filter((event) => {
      const query = debouncedSearchQuery || "";

      if (query === "") return true;

      return (
        (event.name &&
          event.name.toLowerCase().includes(query.toLowerCase())) ||
        (event.description &&
          event.description.toLowerCase().includes(query.toLowerCase())) ||
        (event.category &&
          event.category.toLowerCase().includes(query.toLowerCase())) ||
        (event.customCategory &&
          event.customCategory.toLowerCase().includes(query.toLowerCase()))
      );
    });
  }, [debouncedSearchQuery, eventCategories]);

  const MobileEventCard = ({ event, index }) => (
    <Paper
      key={index}
      sx={{
        width: "100%",
        display: "flex",
        gap: 2,
        alignItems: "center",
        bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#1e1e1e",
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
        },
      }}
    >
      <img
        src={event.coverImage || Image}
        alt={event.name}
        style={{
          width: 100,
          height: 100,
          borderRadius: 12,
          objectFit: "cover",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      />

      <Box
        sx={{
          textAlign: i18n.language === "en" ? "left" : "right",
          flex: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.palette.mode === "light" ? "#1976d2" : "#90caf9",
            mb: 0.5,
          }}
        >
          {event.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 1,
          }}
        >
          {event.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              color: theme.palette.success.main,
            }}
          >
            ${event.ticketPrice}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.location?.address?.split(",")[0] || "Location not specified"}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 0.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {event.startDate
              ? new Date(event.startDate).toLocaleDateString()
              : "No date"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {event.startTime || "No time"}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <>
      <NavBar active={i18n.language === "en" ? "Search" : "بحث"} />

      <Box
        sx={{
          backgroundImage: `linear-gradient(135deg,
          ${
            theme.palette.mode === "light"
              ? theme.palette.primary.main.replace(/ff$/, "cc")
              : theme.palette.primary.dark.replace(/ff$/, "cc")
          },
          ${
            theme.palette.mode === "light"
              ? theme.palette.primary.main.replace(/ff$/, "cc")
              : theme.palette.primary.light.replace(/ff$/, "cc")
          }
        ), url(${Image})`,

          height: "100vh",
          minHeight: "400px",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          flexDirection: "column",
          color: "white",
          position: "relative",
          marginBottom: "30px",
        }}
      >
        <Box sx={{ zIndex: 1, px: 2, maxWidth: "800px" }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {i18n.language === "en"
              ? "Discover Amazing Events"
              : "اكتشف الفعاليات المذهلة"}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7)",
              mb: 4,
              opacity: 0.9,
            }}
          >
            {i18n.language === "en"
              ? "Find the perfect events and venues that match your interests"
              : "ابحث عن الفعاليات والأماكن المثالية التي تناسب اهتماماتك"}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: 2,
            px: { xs: 2, md: 6 },
          }}
        >
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", md: "70%" },
              borderRadius: "50px",
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.95)"
                  : "#121212",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <InputBase
              sx={{
                ml: 2,
                flex: 1,
                fontSize: "1.1rem",
                "::placeholder": {
                  color: theme.palette.mode === "dark" ? "#121212" : "#fefefe",
                  opacity: 1,
                },
              }}
              placeholder={
                i18n.language === "en"
                  ? "Search events, categories, venues..."
                  : "ابحث في الفعاليات، الفئات، الأماكن..."
              }
              inputProps={{ "aria-label": "search events and venues" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <IconButton
              type="button"
              sx={{
                p: "10px",
                color:
                  theme.palette.mode === "light"
                    ? theme.palette.primary.main
                    : theme.palette.primary.light,
              }}
              aria-label="search"
              onClick={handleClick}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
        <Box sx={{ position: "absolute", bottom: -10, left: 0, width: "100%" }}>
          <Wave />
        </Box>
      </Box>

      <Box sx={{ px: 2, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          {loading ? (
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: "bold",
                background:
                  theme.palette.mode === "light"
                    ? "linear-gradient(45deg, #1976d2, #2196f3)"
                    : "linear-gradient(45deg, #90caf9, #29b6f6)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {i18n.language === "en"
                ? "Loading events..."
                : "جاري تحميل الفعاليات..."}
            </Typography>
          ) : (
            <>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  background:
                    theme.palette.mode === "light"
                      ? "linear-gradient(45deg, #1976d2, #2196f3)"
                      : "linear-gradient(45deg, #90caf9, #29b6f6)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                {filteredEvents.length > 0
                  ? i18n.language === "en"
                    ? "Discover Events"
                    : "اكتشف الفعاليات"
                  : i18n.language === "en"
                  ? "No Results Found"
                  : "لم يتم العثور على نتائج"}
              </Typography>

              {filteredEvents.length > 0 && (
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  {i18n.language === "en"
                    ? `Found ${filteredEvents.length} event${
                        filteredEvents.length > 1 ? "s" : ""
                      }`
                    : `تم العثور على ${filteredEvents.length} فعالية`}
                </Typography>
              )}

              {filteredEvents.length === 0 && searchQuery && !loading && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  {i18n.language === "en"
                    ? "Try adjusting your search terms to find more results."
                    : "حاول تعديل مصطلحات البحث للعثور على المزيد من النتائج."}
                </Typography>
              )}
            </>
          )}
        </Box>

        {!loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 3,
            }}
            id="search-items"
          >
            {filteredEvents.map((event, index) =>
              isMobile ? (
                <MobileEventCard
                  key={event._id || index}
                  event={event}
                  index={index}
                />
              ) : (
                <ItemsCard
                  key={event._id || index}
                  image={event.coverImage || Image}
                  title={event.name}
                  description={event.description}
                  price={`$${event.ticketPrice}`}
                  date={
                    event.startDate
                      ? new Date(event.startDate).toLocaleDateString()
                      : "No date"
                  }
                  time={event.startTime || "No time"}
                  location={
                    event.location?.address?.split(",")[0] ||
                    "Location not specified"
                  }
                  type={event.type}
                  id={event._id}
                />
              )
            )}
          </Box>
        )}
      </Box>

      <Footer />
    </>
  );
}
