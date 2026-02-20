import NavBar from "../Components/NavBar";
import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Slider1 from "../assets/Image/Home/slider1.jpg";
import Slider2 from "../assets/Image/Home/slider2.jpg";
import Slider3 from "../assets/Image/Home/slider3.jpg";
import Mobile from "../assets/Image/Home/mobile.png";
import {
  EffectFade,
  Navigation,
  Pagination,
  Autoplay,
  FreeMode,
} from "swiper/modules";

import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Wave from "../Components/Wave";

import ItemsCard from "../Components/ItemsCard";
import Image from "../assets/Image/Onboarding/description.png";

import Footer from "../Components/Footer";
import AppleLogo from "../assets/Image/Home/apple.svg";
import GooglePlayLogo from "../assets/Image/Home/google.svg";
import Qr from "../assets/Image/Home/qr.png";
// Import Icons
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

import HandshakeIcon from "@mui/icons-material/Handshake";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import MosqueIcon from "@mui/icons-material/Mosque";

import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import LoadingTimer from "../Components/LoadingTimer";
export default function Home() {
  const { t, i18n } = useTranslation("home");
  const theme = useTheme();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const nextFavRef = useRef(null);
  const prevFavRef = useRef(null);
  const nextTopRef = useRef(null);
  const prevTopRef = useRef(null);
  // Swiper instance refs
  const swiperMainRef = useRef(null);
  const swiperFavRef = useRef(null);
  const swiperTopRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.down("lg"));

  const eventCategories = [
    {
      image: Image,
      title: "Music & Concerts",
      description:
        "Enjoy live concerts, music festivals, and performances by top artists around the world.",
      price: "$20 - $150",
      location: "Global Venues",
      time: "8:00 PM",
      date: "Upcoming Events",
      rating: 4.8,
      type: "Music",
    },
    {
      image: Image,
      title: "Tech & Innovation",
      description:
        "Explore cutting-edge technology events, hackathons, and startup showcases.",
      price: "$10 - $100",
      location: "Tech Hubs",
      time: "10:00 AM",
      date: "Weekends",
      rating: 4.7,
      type: "Technology",
    },
    {
      image: Image,
      title: "Sports & Fitness",
      description:
        "Join exciting tournaments, marathons, and fitness training sessions.",
      price: "$5 - $200",
      location: "Stadiums & Gyms",
      time: "6:00 AM",
      date: "Daily Events",
      rating: 4.6,
      type: "Sports",
    },
    {
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      title: "Business & Networking",
      description:
        "Meet entrepreneurs, investors, and professionals at business and startup events.",
      price: "Free - $300",
      location: "Conference Centers",
      time: "9:00 AM",
      date: "Monthly",
      rating: 4.9,
      type: "Business",
    },
    {
      image: Image,
      title: "Art & Culture",
      description:
        "Experience art exhibitions, theater plays, and cultural showcases from diverse creators.",
      price: "$10 - $80",
      location: "Art Galleries",
      time: "7:00 PM",
      date: "Weekly",
      rating: 4.8,
      type: "Art",
    },
    {
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      title: "Food & Culinary",
      description:
        "Taste delicious dishes and discover new flavors at food festivals and cooking shows.",
      price: "$15 - $120",
      location: "Food Festivals",
      time: "11:00 AM",
      date: "Seasonal",
      rating: 4.7,
      type: "Food",
    },
    {
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
      title: "Education & Workshops",
      description:
        "Join hands-on workshops, seminars, and educational programs to enhance your skills.",
      price: "Free - $200",
      location: "Learning Centers",
      time: "2:00 PM",
      date: "Weekdays",
      rating: 4.8,
      type: "Education",
    },
    {
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      title: "Travel & Adventure",
      description:
        "Discover exciting destinations and outdoor adventures around the world.",
      price: "$50 - $500",
      location: "Outdoor Destinations",
      time: "Anytime",
      date: "Seasonal",
      rating: 4.9,
      type: "Travel",
    },
    {
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
      title: "Health & Wellness",
      description:
        "Find balance with yoga retreats, meditation sessions, and wellness conferences.",
      price: "$20 - $220",
      location: "Retreat Centers",
      time: "Morning",
      date: "Monthly",
      rating: 4.7,
      type: "Health",
    },
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
      title: "Fashion & Lifestyle",
      description:
        "Celebrate trends, fashion shows, and lifestyle exhibitions featuring top designers.",
      price: "$25 - $300",
      location: "Fashion Venues",
      time: "6:00 PM",
      date: "Seasonal",
      rating: 4.6,
      type: "Fashion",
    },
    {
      image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
      title: "Gaming & Esports",
      description:
        "Compete in gaming tournaments and explore the latest in esports and entertainment.",
      price: "Free - $150",
      location: "Gaming Arenas",
      time: "All Day",
      date: "Weekend Events",
      rating: 4.9,
      type: "Gaming",
    },
    {
      image: "https://images.unsplash.com/photo-1529651737248-dad5e287768e",
      title: "Photography & Media",
      description:
        "Attend photography exhibitions, film screenings, and creative media workshops.",
      price: "$10 - $120",
      location: "Studios & Galleries",
      time: "5:00 PM",
      date: "Monthly",
      rating: 4.7,
    },
  ];
  const categoryTypes = [
    { name: t("home.conference"), icon: <PrecisionManufacturingIcon /> },
    { name: t("home.workshop"), icon: <HandshakeIcon /> },
    { name: t("home.concert"), icon: <MusicNoteIcon /> },
    { name: t("home.sports"), icon: <SportsSoccerIcon /> },
    { name: t("home.enterainment"), icon: <TheaterComedyIcon /> },
    { name: t("home.Religious"), icon: <MosqueIcon /> },
    { name: t("home.business"), icon: <BusinessCenterIcon /> },
    { name: t("home.education"), icon: <SchoolIcon /> },
  ];
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);


  useEffect(() => {
    const swiper = swiperMainRef.current;
    if (!swiper) return;
    const tryWire = () => {
      if (swiper.params?.navigation && prevRef.current && nextRef.current) {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
        if (swiper.navigation && typeof swiper.navigation.init === "function") {
          swiper.navigation.init();
          swiper.navigation.update();
        }
      }
    };
    // Run once and schedule a short retry in case refs mount slightly later
    tryWire();
    const id = setTimeout(tryWire, 50);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const swiper = swiperFavRef.current;
    if (!swiper) return;
    const tryWire = () => {
      if (
        swiper.params?.navigation &&
        prevFavRef.current &&
        nextFavRef.current
      ) {
        swiper.params.navigation.prevEl = prevFavRef.current;
        swiper.params.navigation.nextEl = nextFavRef.current;
        if (swiper.navigation && typeof swiper.navigation.init === "function") {
          swiper.navigation.init();
          swiper.navigation.update();
        }
      }
    };
    tryWire();
    const id = setTimeout(tryWire, 50);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const swiper = swiperTopRef.current;
    if (!swiper) return;
    const tryWire = () => {
      if (
        swiper.params?.navigation &&
        prevTopRef.current &&
        nextTopRef.current
      ) {
        swiper.params.navigation.prevEl = prevTopRef.current;
        swiper.params.navigation.nextEl = nextTopRef.current;
        if (swiper.navigation && typeof swiper.navigation.init === "function") {
          swiper.navigation.init();
          swiper.navigation.update();
        }
      }
    };
    tryWire();
    const id = setTimeout(tryWire, 50);
    return () => clearTimeout(id);
  }, []);

  const slideContent = [
    {
      id: 1,
      text: t("home.titleSlider1"),
      image: Slider1,
      description: t("home.descriptionSlider1"),
    },
    {
      id: 2,
      text: t("home.titleSlider2"),
      image: Slider2,
      description: t("home.descriptionSlider2"),
    },
    {
      id: 3,
      text: t("home.titleSlider3"),
      image: Slider3,
      description: t("home.descriptionSlider3"),
    },
  ];
  const [loading, setLoading] = React.useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 4000);
  if (loading) {
    return <LoadingTimer />;
  } else {
    return (
      <Box
        sx={{
          "@keyframes fadeIn": {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <NavBar active={i18n.language === "en" ? "Home" : "الرئيسية"} />
        <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
          <Box sx={{ width: "100%", height: "100%" }}>
            <Swiper
              spaceBetween={30}
              effect="fade"
              loop
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ type: "progressbar" }}
              modules={[EffectFade, Navigation, Pagination, Autoplay]}
              onSwiper={(swiper) => {
                swiperMainRef.current = swiper;
              }}
              style={{ height: "100%" }}
            >
              {slideContent.map((s) => (
                <SwiperSlide key={s.id}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(#0e367c73, #0e367c73), url(${s.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      textAlign: i18n.language === "en" ? "left" : "right",
                    }}
                    role="img"
                    aria-label={s.text}
                  >
                    <Container
                      maxWidth="md"
                      sx={{
                        color: "#fff",
                        px: { xs: 2, md: 4 },
                        direction: i18n.language === "ar" ? "rtl" : "ltr",
                      }}
                    >
                      {/* العنوان */}
                      <Typography
                        variant="h2"
                        data-aos="fade-up"
                        sx={{
                          fontWeight: 600,
                          textShadow: "2px 2px 12px rgba(0,0,0,0.9)",
                          fontSize: { xs: "2rem", md: "3.8rem" },
                          lineHeight: 1.2,
                          mb: 2,
                        }}
                      >
                        {s.text}
                      </Typography>

                      {/* الوصف */}
                      <Typography
                        variant="h6"
                        data-aos="fade-up"
                        data-aos-delay="300"
                        sx={{
                          mt: 1,
                          mb: 4,
                          textShadow: "1px 1px 6px rgba(0,0,0,0.7)",
                          fontSize: { xs: "1rem", md: "1.25rem" },
                          lineHeight: 1.8,
                          mx: 0,
                        }}
                      >
                        {s.description}
                      </Typography>

                      {/* الزرار */}
                      <Button
                        variant="contained"
                        size="large"
                        data-aos="zoom-in"
                        data-aos-delay="600"
                        sx={{
                          color: "white",
                          fontWeight: "600",
                          px: 5,
                          py: 1.5,
                          borderRadius: "50px",
                          background:
                            "linear-gradient(90deg, #A00651, #f64c9eff)",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #f64c9eff, #A00651)",
                            transform: "scale(1.07)",
                          },
                          transition: "all 0.4s ease-in-out",
                        }}
                      >
                        {t("home.learnMore")}
                      </Button>
                    </Container>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* زر السهم التالي */}
            <IconButton
              ref={nextRef}
              sx={{
                position: "absolute",
                top: "50%",
                right: i18n.language === "ar" ? "unset" : 20,
                left: i18n.language === "ar" ? 20 : "unset",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                width: 55,
                height: 55,
                borderRadius: "50%",
                backdropFilter: "blur(5px)",
                zIndex: 10,
                "&:hover": {
                  background: "rgba(255,255,255,0.35)",
                },
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 30 }} />
            </IconButton>

            {/* زر السهم السابق */}
            <IconButton
              ref={prevRef}
              sx={{
                position: "absolute",
                top: "50%",
                left: i18n.language === "ar" ? "unset" : 20,
                right: i18n.language === "ar" ? 20 : "unset",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                width: 55,
                height: 55,
                borderRadius: "50%",
                backdropFilter: "blur(5px)",
                zIndex: 10,
                "&:hover": {
                  background: "rgba(255,255,255,0.35)",
                },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box
            width={"100vw"}
            sx={{ position: "absolute", bottom: -8, zIndex: 99 }}
          >
            <Wave />
          </Box>
        </Box>
        {/* ========================== Categories ================== */}
        <Box
          sx={{
            py: 10,
            px: { xs: 2, sm: 6 },
            backgroundColor:
              theme.palette.mode === "light" ? "#ffffffff" : "#121212",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.mode === "light" ? "#0e367c" : "#90caf9",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              mb: 1,
            }}
            data-aos="fade-up"
          >
            {t("home.categoryTitle")}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#555",
              textAlign: "center",
              mb: 4,
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
            }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t("home.categoryDescription")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
              },
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
            }}
          >
            {categoryTypes.map((type, index) => (
              <Button
                key={`category-${type.name || index}`}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  borderColor:
                    theme.palette.mode === "light" ? "#0e367c" : "#90caf9",
                  color: theme.palette.mode === "light" ? "#0e367c" : "#90caf9",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "light" ? "#0e367c" : "#90caf9",
                    color: "#fff",
                    borderColor:
                      theme.palette.mode === "light" ? "#0e367c" : "#90caf9",
                  },
                  direction: i18n.language === "ar" ? "rtl" : "ltr",
                }}
              >
                {type.icon} {type.name}
              </Button>
            ))}
          </Box>
        </Box>

        {/* ========================== For You  ================== */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.mode === "light" ? "#0e367c" : "#90caf9",
              textAlign: "center",
              mt: 8,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
            data-aos="fade-up"
          >
            {t("home.forYouTitle")}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#555",
              textAlign: "center",
              mt: 2,
            }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t("home.forYouDescription")}
          </Typography>
          <Box sx={{ py: 2, px: { xs: 2, sm: 4 }, position: "relative" }}>
            <Swiper
              slidesPerView={isMobile ? 1 : isTablet ? 1.5 : isDesktop ? 2 : 3}
              spaceBetween={30}
              freeMode={true}
              loop
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              modules={[Autoplay, Pagination, Navigation, FreeMode]}
              style={{ padding: "40px 60px" }}
              onSwiper={(swiper) => {
                swiperFavRef.current = swiper;
              }}
            >
              {eventCategories.map((category, index) => (
                <SwiperSlide
                  key={`event-category-${category.title || index}`}
                  style={{
                    height: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ItemsCard
                    image={category.image}
                    title={category.title}
                    description={category.description}
                    price={category.price}
                    date={category.date}
                    time={category.time}
                    location={category.location}
                    rating={category.rating}
                    type={category.type}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* زر السهم التالي */}
            <IconButton
              ref={nextFavRef}
              sx={{
                position: "absolute",
                top: "50%",
                right: i18n.language === "ar" ? "unset" : 20,
                left: i18n.language === "ar" ? 20 : "unset",
                transform: "translateY(-50%)",
                background: "rgba(67, 67, 67, 0.61)",
                color: "#fff",
                width: 55,
                height: 55,
                borderRadius: "50%",
                backdropFilter: "blur(5px)",
                zIndex: 10,
                "&:hover": {
                  background: "rgba(67, 67, 67, 0.41)",
                },
              }}
              className="btn-next"
            >
              <ArrowForwardIcon sx={{ fontSize: 30 }} />
            </IconButton>

            {/* زر السهم السابق */}
            <IconButton
              ref={prevFavRef}
              sx={{
                position: "absolute",
                top: "50%",
                left: i18n.language === "ar" ? "unset" : 20,
                right: i18n.language === "ar" ? 20 : "unset",
                transform: "translateY(-50%)",
                background: "rgba(67, 67, 67, 0.61)",
                color: "#fff",
                width: 55,
                height: 55,
                borderRadius: "50%",
                backdropFilter: "blur(5px)",
                zIndex: 10,
                "&:hover": {
                  background: "rgba(67, 67, 67, 0.41)",
                },
              }}
              className="btn-prev"
            >
              <ArrowBackIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
        </Box>
        {/* ========================== Download Our Mobile App ================== */}
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${
                theme.palette.mode === "light" ? "#0a2540" : "#193c58"
              }, ${theme.palette.mode === "light" ? "#0e367c" : "#1e4e7a"})`,
              color: "white",
              py: 20,
              px: { xs: 2, sm: 6 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-around",
              gap: 5,
              direction: i18n.language === "ar" ? "rtl" : "ltr",
            }}
          >
            {/* Left Text Content */}
            <Box
              sx={{
                maxWidth: 450,
                textAlign: {
                  xs: "center",
                  md: i18n.language === "ar" ? "right" : "left",
                },
              }}
            >
              <Typography variant="h4" fontWeight={700} mb={2}>
                {t("home.downloadAppTitle")}
              </Typography>

              <Typography sx={{ opacity: 0.9 }} mb={3}>
                {t("home.downloadAppDescription")}
              </Typography>
              <Box
                sx={{
                  width: isMobile ? "100%" : "fit-content",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  alignContent: isMobile ? "center" : "flex-start'",
                }}
              >
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  justifyContent={isMobile ? "center" : "flex-start"}
                  sx={{
                    direction: i18n.language === "ar" ? "rtl" : "ltr",
                    gap: 6,
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      p: "6px 14px",
                      borderRadius: "10px",
                      background: "#000000",
                      color: "#ffffff",
                    }}
                  >
                    {t("home.googlePlay")}
                    <img
                      src={GooglePlayLogo}
                      alt={t("home.googlePlay")}
                      width="20"
                      style={{ marginLeft: 8 }}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      p: "2px 14px",
                      borderRadius: "10px",
                      background: "#000000",
                      color: "#ffffff",
                    }}
                  >
                    {t("home.appStore")}
                    <img
                      src={AppleLogo}
                      alt={t("home.appStore")}
                      width="20"
                      style={{ marginLeft: 8 }}
                    />
                  </Button>
                </Stack>

                {/* QR Code */}
                <Stack
                  direction="column"
                  spacing={2}
                  alignItems="center"
                  mt={3}
                  justifyContent={isMobile ? "center" : "flex-end"}
                  sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
                  alignContent={isMobile ? "center" : "flex-end"}
                >
                  <img
                    src={Qr}
                    width="85"
                    style={{ borderRadius: "10px" }}
                    alt="QR"
                  />
                  <Typography>{t("home.scanQRCode")}</Typography>
                </Stack>
              </Box>
            </Box>

            {/* Mobile Preview */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                animation: "float 3s infinite ease-in-out",
              }}
            >
              <img
                src={Mobile}
                alt="Eventy App"
                width={isMobile ? "220" : "300"}
                style={{ borderRadius: "20px" }}
              />
            </Box>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
          </Box>
          <Box
            width={"100vw"}
            sx={{
              position: "absolute",
              top: -30,
              zIndex: 99,
              transform: "rotate(180deg)",
            }}
          >
            <Wave />
          </Box>
          <Box
            width={"100vw"}
            sx={{
              position: "absolute",
              bottom: -30,
              zIndex: 99,
            }}
          >
            <Wave />
          </Box>
        </Box>
        {/* ========================== Top Rated Events ================== */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.mode === "light" ? "#0e367c" : "#90caf9",
              textAlign: "center",
              mt: 8,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
            data-aos="fade-up"
          >
            {t("home.topEventsTitle")}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#555",
              textAlign: "center",
              mt: 2,
            }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t("home.topEventsDescription")}
          </Typography>
          <Box sx={{ py: 2, px: { xs: 2, sm: 4 }, position: "relative" }}>
            <Swiper
              slidesPerView={isMobile ? 1 : isTablet ? 1.5 : isDesktop ? 2 : 3}
              spaceBetween={30}
              freeMode={true}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              modules={[Autoplay, Pagination, Navigation, FreeMode]}
              style={{ padding: "40px 60px" }}
              onSwiper={(swiper) => {
                swiperTopRef.current = swiper;
              }}
            >
              {eventCategories.map((category, index) => (
                <SwiperSlide
                  key={`top-category-${category.title || index}`}
                  style={{
                    height: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ItemsCard
                    image={category.image}
                    title={category.title}
                    description={category.description}
                    price={category.price}
                    date={category.date}
                    time={category.time}
                    location={category.location}
                    rating={category.rating}
                    type={category.type}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* زر السهم التالي */}
            <IconButton
              ref={nextTopRef}
              sx={{
                position: "absolute",
                top: "50%",
                right: i18n.language === "ar" ? "unset" : 20,
                left: i18n.language === "ar" ? 20 : "unset",
                transform: "translateY(-50%)",
                background: "rgba(67, 67, 67, 0.61)",
                color: "#fff",
                width: 55,
                height: 55,
                borderRadius: "50%",
                backdropFilter: "blur(5px)",
                zIndex: 10,
                "&:hover": {
                  background: "rgba(67, 67, 67, 0.41)",
                },
              }}
              className="btn-next-top"
            >
              <ArrowForwardIcon sx={{ fontSize: 30 }} />
            </IconButton>

            {/* زر السهم السابق */}
            <IconButton
              ref={prevTopRef}
              sx={{
                position: "absolute",
                top: "50%",
                left: i18n.language === "ar" ? "unset" : 20,
                right: i18n.language === "ar" ? 20 : "unset",
                transform: "translateY(-50%)",
                background: "rgba(67, 67, 67, 0.61)",
                color: "#fff",
                width: 55,
                height: 55,
                borderRadius: "50%",
                backdropFilter: "blur(5px)",
                zIndex: 10,
                "&:hover": {
                  background: "rgba(67, 67, 67, 0.41)",
                },
              }}
              className="btn-prev-top"
            >
              <ArrowBackIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
        </Box>

        <Footer />
      </Box>
    );
  }
}
