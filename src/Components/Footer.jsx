import React from "react";
import Logo from "../assets/eventy.svg";
import "../App.css";
import {
  Button,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  Box,
  Fade,
  Slide,
  Grow,
  styled,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, Link as RouterLink } from "react-router";
import { keyframes } from "@emotion/react";
import Whatsapp from "../assets/WhatsApp";
import Instagram from "../assets/Instagram";
import Facebook from "../assets/Facebook"; // Fixed typo in import

const PulseButton = styled(Button)(({ theme }) => ({
  animation: `${keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `} 3s infinite`,
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[6],
  },
  transition: theme.transitions.create(["transform", "box-shadow"], {
    duration: theme.transitions.duration.standard,
  }),
}));

export default function Footer() {
  const categories = [
    [
      { categoryTitle: "Technology", link: "/technology" },
      { categoryTitle: "Programming", link: "/programming" },
      { categoryTitle: "Web Development", link: "/web-dev" },
      { categoryTitle: "Mobile Apps", link: "/mobile-apps" },
    ],
    [
      { categoryTitle: "Design", link: "/design" },
      { categoryTitle: "UI/UX", link: "/ui-ux" },
      { categoryTitle: "Graphics", link: "/graphics" },
      { categoryTitle: "3D Modeling", link: "/3d-modeling" },
    ],
    [
      { categoryTitle: "Business", link: "/business" },
      { categoryTitle: "Marketing", link: "/marketing" },
      { categoryTitle: "Finance", link: "/finance" },
      { categoryTitle: "Entrepreneurship", link: "/entrepreneurship" },
    ],
    [
      { categoryTitle: "Health", link: "/health" },
      { categoryTitle: "Fitness", link: "/fitness" },
      { categoryTitle: "Nutrition", link: "/nutrition" },
      { categoryTitle: "Mental Wellness", link: "/mental-wellness" },
    ],
    [
      { categoryTitle: "Languages", link: "/languages" },
      { categoryTitle: "Travel", link: "/travel" },
      { categoryTitle: "Photography", link: "/photography" },
      { categoryTitle: "Music", link: "/music" },
    ],
  ];

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ fontFamily: theme.typography.fontFamily }}>
      {/* Categories Section */}
      <Box
        sx={{
          padding: isSmallScreen ? "15px" : "30px",
          background: theme.palette.primary.light,
          marginTop: "60px",
        }}
      >
        <Container maxWidth="lg">
          <Fade in={true} timeout={800}>
            <Typography
              variant={isSmallScreen ? "h6" : "h5"}
              gutterBottom
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                color: theme.palette.primary.main,
                mb: isSmallScreen ? 2 : 3,
              }}
            >
              Popular Categories
            </Typography>
          </Fade>

          <Grid
            container
            spacing={isSmallScreen ? 2 : 3}
            justifyContent="center"
            sx={{
              textAlign: "center",
            }}
          >
            {categories.map((categoryGroup, index) => (
              <Grow in={true} timeout={index * 200 + 500} key={index}>
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={2.4}
                  sx={{
                    textAlign: "center",
                    mb: isSmallScreen ? 1 : 0,
                  }}
                >
                  <List dense>
                    {categoryGroup.map((e, i) => (
                      <ListItem
                        key={i}
                        sx={{
                          padding: 0,
                          display: "block",
                          marginTop: isSmallScreen ? "8px" : "12px",
                          textAlign: "left",
                          "&:hover": {
                            transform: "translateX(5px)",
                          },
                          transition: theme.transitions.create("transform", {
                            duration: theme.transitions.duration.short,
                          }),
                        }}
                      >
                        <RouterLink
                          to={e.link}
                          style={{
                            color: theme.palette.text.primary,
                            textDecoration: "none",
                            fontSize: isSmallScreen ? "0.9rem" : "1rem",
                            fontWeight: 500,
                            fontFamily: theme.typography.fontFamily,
                            display: "block",
                            "&:hover": {
                              color: theme.palette.secondary.main,
                            },
                          }}
                        >
                          {e.categoryTitle}
                        </RouterLink>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grow>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: theme.palette.primary.dark,
          color: "white",
          position: "relative",
          overflow: "hidden",
          paddingBottom: isSmallScreen ? 4 : 8,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            textAlign: "center",
            py: isSmallScreen ? 4 : 8,
            position: "relative",
            zIndex: 1,
            "&::after": {
              width: "100%",
              height: "2px",
              content: `''`,
              background: "rgba(255, 255, 255, 0.4)",
              position: "relative",
              display: "block",
              marginTop: "60px",
              borderRadius: "24px",
            },
          }}
        >
          <Slide direction="up" in={true} timeout={500}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: isSmallScreen ? 2 : 3,
              }}
            >
              <Typography
                variant={isSmallScreen ? "body1" : "subtitle1"}
                sx={{ mb: 1 }}
              >
                Events just a click away
              </Typography>

              <Typography
                variant={isSmallScreen ? "h4" : "h3"}
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: `white`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: isSmallScreen ? "1.8rem" : "2.4rem",
                }}
              >
                Request More Information
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  maxWidth: "500px",
                  mb: 3,
                  opacity: 0.9,
                  px: isSmallScreen ? 2 : 0,
                  fontSize: isSmallScreen ? "0.9rem" : "1rem",
                }}
              >
                We are here to help you join your favorite events and create
                them with just a click
              </Typography>

              <Link to="/contactUs" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size={isSmallScreen ? "medium" : "large"}
                  sx={{
                    borderRadius: "24px",
                    px: isSmallScreen ? 3 : 4,
                    py: isSmallScreen ? 1 : 1.5,
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  Contact Us
                </Button>
              </Link>
            </Box>
          </Slide>
        </Container>

        <Container maxWidth="xl">
          <Grid
            container
            alignItems="center"
            spacing={isSmallScreen ? 2 : 14}
            justifyContent="space-around"
            sx={{
              flexDirection: isSmallScreen ? "column-reverse" : "row",
              textAlign: isSmallScreen ? "center" : "left",
              paddingTop: isSmallScreen ? 2 : 0,
            }}
          >
            <Grid item xs={12} md="auto">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: isSmallScreen ? "center" : "flex-start",
                  mb: isSmallScreen ? 2 : 0,
                }}
              >
                <img
                  src={Logo}
                  width={isSmallScreen ? "100px" : "150px"}
                  alt="Eventy Logo"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md="auto">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: isSmallScreen ? 1 : 2,
                }}
              >
                <IconButton component="a" href="#" aria-label="Facebook">
                  <Facebook />
                </IconButton>
                <IconButton component="a" href="#" aria-label="Instagram">
                  <Instagram />
                </IconButton>
                <IconButton component="a" href="#" aria-label="WhatsApp">
                  <Whatsapp />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              textAlign: "center",
              mt: isSmallScreen ? 2 : 4,
              mb: isSmallScreen ? 1 : 0,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "rgba(255,255,255,0.4)",
                fontSize: isSmallScreen ? "0.6rem" : "0.7rem",
              }}
            >
              © 2025 Eventy All Rights Reserved
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
