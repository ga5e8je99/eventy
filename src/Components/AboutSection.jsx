import React from "react";
import SVG from "./SVG";
import ImageTwo from "../assets/image2.png";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Container, useMediaQuery } from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function AboutSection() {
  const controls = useAnimation();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const threshold = isSmallScreen ? 0.09 : 0.7;

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: threshold,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      <Container>
        <Box
          sx={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "rgb(255, 255, 255)",
            marginTop: "40px",
          }}
        >
          <Grid container spacing={{ xs: 6, md: 20 }}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ width: "100%", position: "relative", height: "500px" }}
              >
                <motion.img
                  src={ImageTwo}
                  alt="Team"
                  style={{
                    width: "60%",
                    height: "40%",
                    position: "absolute",
                    top: "0%",
                    left: "0%",
                    zIndex: 2,
                  }}
                  initial="hidden"
                  animate={controls}
                  variants={variants}
                  transition={{ duration: 0.6 }}
                  className="image1"
                />

                <motion.img
                  className="image2"
                  src={ImageTwo}
                  alt="Team"
                  style={{
                    width: "60%",
                    height: "40%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                  }}
                  initial="hidden"
                  animate={controls}
                  variants={variants}
                  transition={{ delay: 0.2, duration: 0.6 }}
                />

                <motion.img
                  className="image3"
                  src={ImageTwo}
                  alt="Team"
                  style={{
                    width: "60%",
                    height: "40%",
                    position: "absolute",
                    bottom: "0%",
                    right: "0%",
                    zIndex: 1,
                    transform: "rotate(10deg)",
                  }}
                  initial="hidden"
                  animate={controls}
                  variants={variants}
                  transition={{ delay: 0.4, duration: 0.6 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} ref={ref}>
              <motion.div
                initial="hidden"
                animate={controls}
                variants={variants}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: "2.5rem",
                    fontWeight: "600",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  About Us,
                </Typography>
                <Typography
                  style={{ fontWeight: "600" }}
                  sx={{
                    fontSize: "2.5rem",
                    marginBottom: "20px",
                    color: "rgb(167, 167, 167)",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  Creating unforgettable moments.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1rem",
                    color: "rgb(167, 167, 167)",
                    maxWidth: "800px",
                    margin: "40px auto",
                    fontWeight: "400",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  Eventy is a team of passionate event planners, designers, and
                  coordinators dedicated to turning your vision into reality.
                  Whether it's a corporate event, wedding, or private party, we
                  work closely with you to ensure every detail is perfect.
                  Together, we create experiences that leave lasting
                  impressions.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1rem",
                    maxWidth: "800px",
                    margin: "40px auto",
                    color: "rgb(168, 168, 168)",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  With a culture of creativity and collaboration, the Eventy
                  team is committed to delivering exceptional events. From
                  concept to execution, we bring your ideas to life with
                  professionalism, enthusiasm, and a touch of magic. Let us make
                  your next event truly unforgettable.
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <SVG color={"rgb(233, 231, 231)"} />
    </div>
  );
}
