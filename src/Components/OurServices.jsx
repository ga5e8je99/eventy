import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card, Container } from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import SmartToy from "@mui/icons-material/SmartToy";
import HowToReg from "@mui/icons-material/HowToReg";
import { motion } from "framer-motion";
import SVG from "./SVG";

export default function OurServices() {
  const services = [
    {
      title: "Create Your Perfect Event",
      description:
        "Easily design and customize your event with our intuitive planning tools. Select themes, venues, and services to bring your vision to life.",
      id: 1,
      icon: (
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(45deg,rgba(14, 55, 124),#A00651)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <EditCalendarIcon sx={{ fontSize: 40, color: "#fff" }} />
        </Box>
      ),
    },
    {
      title: "Browse & Join Events",
      description:
        "Discover exciting events in your area or interests. Join with one click and get all the information you need for a seamless experience.",
      id: 2,
      icon: (
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(45deg,rgba(14, 55, 124),#A00651)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <HowToReg sx={{ fontSize: 40, color: "#fff" }} />
        </Box>
      ),
    },
    {
      title: "AI Event Assistant",
      description:
        "Our smart chatbot helps you plan, suggests ideas, and answers all your event-related questions 24/7. Get personalized recommendations instantly.",
      id: 3,
      icon: (
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(45deg,rgba(14, 55, 124),#A00651)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <SmartToy sx={{ fontSize: 40, color: "#fff" }} />
        </Box>
      ),
    },
  ];

  return (
    <Box
      style={{
        backgroundColor: "rgb(231, 231, 231)",
        position: "relative",
        minHeight: "115vh",
        padding: "80px 0",
      }}
    >
      <Container>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: "2.5rem",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            Our Services
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              maxWidth: "800px",
              margin: "0 auto",
              marginBottom: "40px",
              color: "rgb(167, 167, 167)",
              padding: "30px 0",
            }}
          >
            We’ll do everything we can to grow your revenue. Our motivation is
            to drive your business further that you can imagine.
          </Typography>
          <Grid container spacing={4}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    className="services-card"
                    sx={{
                      padding: "20px",
                      height: { xs: "auto", sm: "300px" },
                      minHeight: "300px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      background: "rgb(235, 234, 234)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:hover": {
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <motion.div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "0%",
                        background: "linear-gradient(45deg,rgba(14, 55, 124),#A00651)",
                        zIndex: 0,
                      }}
                      whileHover={{ height: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    <Box
                      sx={{
                        position: "relative",
                        zIndex: 1,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ marginBottom: "20px" }}>{service.icon}</Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: "1.5rem",
                          marginBottom: "10px",
                          fontWeight: "400",
                        }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "1rem",
                          color: "#666",
                          flex: 1,
                          marginTop: "30px",
                        }}
                      >
                        {service.description}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <SVG color={"white"} />
    </Box>
  );
}
