import { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";


import Wave from "../Components/Wave";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { ModeContext } from "../Contexts/ModeContext";

import DescriptionImage from "../assets/Image/Onboarding/description.png";
import Image1 from "../assets/Image/Onboarding/image1.png";
import Image2 from "../assets/Image/Onboarding/image2.png";
import Image3 from "../assets/Image/Onboarding/image3.png";

export default function Onboarding() {
  const { t, i18n } = useTranslation("onboarding");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const mode = useContext(ModeContext).mode;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef(null);

  useEffect(() => {
    const boxes = containerRef.current.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 300);
          }
        });
      },
      { threshold: 0.4 }
    );

    boxes.forEach((box) => observer.observe(box));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { title: t("feature1Title"), description: t("feature1Desc"), icon: "🚀" },
    { title: t("feature2Title"), description: t("feature2Desc"), icon: "📅" },
    { title: t("feature3Title"), description: t("feature3Desc"), icon: "🔍" },
    { title: t("feature4Title"), description: t("feature4Desc"), icon: "📊" },
  ];

  return (
    <>
      <NavBar />

      {/* Hero Section */}
      <Box
        id="back-to-top-anchor"
        sx={{
          background: `linear-gradient(${
            theme.palette.mode === "dark" ? "#4d87ec73" : "#0e367c73"
          }, ${
            theme.palette.mode === "dark" ? "#4d87ec73" : "#0e367c73"
          }), url(${DescriptionImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: scrolled ? "fixed" : "initial",
          minHeight: "100vh",
          direction: direction,
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          position: "relative",
          transition: "background-attachment 0.3s ease",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 5 }, py: 8 }}>
          <Box data-aos="fade-up" sx={{ maxWidth: "800px", mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                fontWeight: 800,
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              {t("description")}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                opacity: 0.9,
                mb: 5,
                fontWeight: 400,
                fontSize: { xs: "1.1rem", md: "1.4rem" },
              }}
            >
              {t("subDescription")}
            </Typography>
          </Box>

          <Box data-aos="fade-up" data-aos-delay="200">
            <Button
              variant="contained"
              size="large"
              color="secondary"
              endIcon={
                i18n.language === "en" ? (
                  <ArrowForwardIcon />
                ) : (
                  <ArrowBackIcon sx={{ mr: 2 }} />
                )
              }
              sx={{
                fontSize: "1rem",
                py: 1,
                px: 3,
                borderRadius: 5,
                fontWeight: 600,
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 25px rgba(0, 0, 0, 0.3)",
                },
                transition: "all 0.3s ease",
                color: "white",
              }}
            >
              {t("started")}
            </Button>
          </Box>
        </Container>

        {/* Scroll indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: isMobile ? 150 : 130,
            left: "50%",
            transform: "translateX(-50%)",
            animation: "bounce 2s infinite",
          }}
        >
          <IconButton
            sx={{
              color: "white",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            }}
            onClick={() => {
              document
                .getElementById("features-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: "2rem" }} />
          </IconButton>
        </Box>

        <Box
          width="100vw"
          sx={{ position: "absolute", bottom: { xs: -8, lg: -30 } }}
        >
          <Wave />
        </Box>

        <style>
          {`
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% {transform: translateY(0) translateX(-50%);}
              40% {transform: translateY(-20px) translateX(-50%);}
              60% {transform: translateY(-10px) translateX(-50%);}
            }
          `}
        </style>
      </Box>

      {/* About Us Section */}
      <Box mt={20} sx={{ display: "flex", justifyContent: "center" }}>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            flexDirection: isMobile
              ? "column"
              : i18n.language === "en"
              ? "row-reverse"
              : "row",
            columnGap: isMobile ? 0 : 30,
            rowGap: !isMobile ? 0 : 20,
          }}
        >
          {/* Images */}
          <Box
            ref={containerRef}
            sx={{
              position: "relative",
              width: isMobile ? "100%" : 360,
              display: "grid",
              justifyContent: "center",
            }}
          >
            {[Image1, Image2, Image3].map((img, i) => (
              <Box
                key={`carousel-image-${i}`}
                className="fade-in"
                sx={{
                  background: `linear-gradient(${
                    theme.palette.mode === "dark" ? "#4d87ec73" : "#0e367c73"
                  }, ${
                    theme.palette.mode === "dark" ? "#4d87ec73" : "#0e367c73"
                  }), url(${img})`,
                  width: 260,
                  height: 180,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: `4px solid ${mode === "dark" ? "#121212" : "white"}`,
                  borderRadius: 3,
                  position: "absolute",
                  top: [0, 150, 260][i],
                  left: isMobile ? "50%" : [0, 50, 20][i],
                  transform: isMobile
                    ? `translateX(-50%) rotate(${
                        [8, -10, 10][i]
                      }deg) !important `
                    : `rotate(${[8, -10, 10][i]}deg) !important`,
                  boxShadow: 3,
                }}
              />
            ))}
            <style>{`
              .fade-in {
  opacity: 0;
  transform: translateY(50px) rotate(var(--rotate));
  transition: opacity 1s ease, transform 1s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0) rotate(var(--rotate));
}

            `}</style>
          </Box>

          {/* Description */}
          <Box
            textAlign={isMobile ? "center" : "left"}
            sx={{ width: isMobile ? "100%" : "50%" }}
          >
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
              {t("aboutTitle")}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "rgb(167, 167, 167)" }}
            >
              {t("aboutSubtitle")}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography
                component="p"
                sx={{ color: "rgb(167, 167, 167)", fontWeight: 600 }}
              >
                {t("aboutDesc1")}
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography
                component="p"
                sx={{ color: "rgb(167, 167, 167)", fontWeight: 600 }}
              >
                {t("aboutDesc2")}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        id="features-section"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: "background.default",
          direction: direction,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: "2.2rem", md: "2.8rem" },
            }}
          >
            {t("featuresTitle")}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{
              mb: 8,
              maxWidth: "700px",
              mx: "auto",
              fontSize: { xs: "1.1rem", md: "1.2rem" },
            }}
          >
            {t("featuresSubtitle")}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr 1fr",
              },
              gap: 4,
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={`feature-${index}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                sx={{
                  textAlign: "center",
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: "background.paper",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Typography variant="h3" sx={{ fontSize: "3rem", mb: 2 }}>
                  {feature.icon}
                </Typography>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 10, md: 15 },
          background: `linear-gradient(${
            theme.palette.mode === "dark" ? "#4d87ec73" : "#0e367c73"
          }, ${
            theme.palette.mode === "dark" ? "#4d87ec73" : "#0e367c73"
          }), url(${DescriptionImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          color: "white",
          direction: direction,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              fontWeight: 700,
              fontSize: { xs: "2.2rem", md: "2.8rem" },
            }}
          >
            {t("ctaTitle")}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 5,
              opacity: 0.9,
              fontSize: { xs: "1.1rem", md: "1.2rem" },
            }}
          >
            {t("ctaDescription")}
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            endIcon={
              i18n.language === "en" ? (
                <ArrowForwardIcon />
              ) : (
                <ArrowBackIcon sx={{ mr: 2 }} />
              )
            }
            sx={{
              fontSize: "1rem",
              py: 1.5,
              px: 4,
              borderRadius: 5,
              fontWeight: "bold",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 12px 25px rgba(0,0,0,0.4)",
              },
              transition: "all 0.3s ease",
              color: "white",
            }}
          >
            {t("startNow")}
          </Button>
        </Container>
      </Box>

      <Footer />
    </>
  );
}
