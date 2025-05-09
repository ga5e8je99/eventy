import { Box, Typography, Button, useMediaQuery, Container, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState } from "react";
import Image from "../assets/image1.png";
import Cart from "./Cart";

export default function TopRite() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showAll, setShowAll] = useState(false);

  const topEvents = [
    {
      id: 1,
      name: "Summer Music Festival",
      category: "Music",
      image: Image,
      description: "Annual summer music festival featuring top artists",
      date: "2023-06-15T00:00:00.000Z",
      location: { address: "Central Park, New York" },
      rating: 4.5,
    },
    {
      id: 2,
      name: "Marathon Championship",
      category: "Sports",
      image: Image,
      description: "International marathon through downtown",
      date: "2023-06-20T00:00:00.000Z",
      location: { address: "Downtown, Los Angeles" },
      rating: 4.2,
    },
    {
      id: 3,
      name: "Modern Art Exhibition",
      category: "Art",
      image: Image,
      description: "Cutting-edge modern art from emerging artists",
      date: "2023-06-25T00:00:00.000Z",
      location: { address: "Art Institute, Chicago" },
      rating: 4.7,
    },
    {
      id: 4,
      name: "Jazz Night",
      category: "Music",
      image: Image,
      description: "Evening of smooth jazz featuring musicians",
      date: "2023-07-02T00:00:00.000Z",
      location: { address: "French Quarter, New Orleans" },
      rating: 4.3,
    },
    {
      id: 5,
      name: "Tech Conference",
      category: "Business",
      image: Image,
      description: "Leading tech conference with keynote speakers",
      date: "2023-07-10T00:00:00.000Z",
      location: { address: "Moscone Center, San Francisco" },
      rating: 4.6,
    },
    {
      id: 6,
      name: "Food Festival",
      category: "Food",
      image: Image,
      description: "Celebration of local and international cuisine",
      date: "2023-07-15T00:00:00.000Z",
      location: { address: "Zilker Park, Austin" },
      rating: 4.8,
    },
  ];

  // Helper functions
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getLastTwoWords = (address) => {
    if (!address) return '';
    const words = address.split(',');
    return words.slice(-2).join(',').trim();
  };

  const displayedEvents = showAll ? topEvents : topEvents.slice(0, isMobile ? 2 : 4);

  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, sm: 4, md: 6 },
        bgcolor: theme.palette.background.paper,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.paper} 100%)`,
          opacity: 0.05,
          zIndex: 0,
        },
      }}
    >
      <Box position="relative" zIndex={1}>
        <Typography
          variant="h2"
          sx={{
            mb: 2,
            textAlign: "center",
            fontWeight: 700,
            fontSize: { xs: "1.8rem", md: "2.5rem" },
            color: theme.palette.text.primary,
            position: "relative",
            "&::after": {
              content: '""',
              display: "block",
              width: "80px",
              height: "4px",
              background: theme.palette.primary.main,
              margin: "16px auto 0",
              borderRadius: "2px",
            },
          }}
        >
          Top Rated Events
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            mb: 6,
            textAlign: "center",
            color: theme.palette.text.secondary,
            maxWidth: 700,
            mx: "auto",
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          Discover the most popular events based on attendee ratings and participation
        </Typography>

        <Container maxWidth="xl">
          <LayoutGroup>
            <Grid
              container
              component={motion.div}
              spacing={4}
              sx={{
                justifyContent: "center",
              }}
              layout
            >
              <AnimatePresence>
                {displayedEvents.map((event) => (
                  <Grid 
                    item 
                    key={event.id} 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    lg={3}
                    component={motion.div}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div whileHover={{ y: -5 }}>
                      <Box
                        sx={{
                          height: "100%",
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 3
                          }
                        }}
                      >
                        <Cart
                          image={event.image || Image}
                          title={event.name}
                          imageDesc={event.name}
                          id={event.id}
                          category={capitalize(event.category)}
                          rating={event.rating.toString()}
                          description={event.description}
                          date={event.date.split('T')[0]}
                          location={getLastTwoWords(event.location?.address)}
                          fit={event.image ? 'cover' : 'contain'}
                        />
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </LayoutGroup>
        </Container>

        {!showAll && topEvents.length > (isMobile ? 2 : 4) && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowAll(true)}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "8px",
                  boxShadow: theme.shadows[2],
                  "&:hover": {
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                Show More Events
              </Button>
            </motion.div>
          </Box>
        )}

        {showAll && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowAll(false)}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "8px",
                }}
              >
                Show Less
              </Button>
            </motion.div>
          </Box>
        )}
      </Box>
    </Box>
  );
}