import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  KeyboardArrowRight,
  Circle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import SliderImage1 from "../assets/slider1.jpg";
import SliderImage2 from "../assets/slider2.jpg";
import SliderImage3 from "../assets/slider3.jpg";

const Slider = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);
  const timeoutRef = useRef(null);
  
  const items = [
    {
      url: SliderImage1,
      title: "Seamless Event Management",
      description: "Plan, organize, and execute your events with our comprehensive platform",
      color: "rgba(0, 28, 77, 0.85)",
      buttonColor: "linear-gradient(45deg, rgba(14, 54, 124, 0.91),#A0065191 )",
    },
    {
      url: SliderImage2,
      title: "Real-time Analytics",
      description: "Get insights into your event performance with our powerful analytics dashboard",
      color: "rgba(3, 35, 90, 0.85)",
      buttonColor: "linear-gradient(45deg,rgba(14, 54, 124, 0.91),#A0065191 )",
    },
    {
      url: SliderImage3,
      title: "Engage Your Audience",
      description: "Interactive features to keep your attendees connected and engaged",
      color: "rgba(3, 35, 90, 0.85)",
      buttonColor: "linear-gradient(45deg, rgba(14, 54, 124, 0.91),#A0065191 )",
    },
  ];

  // Go to specific slide
  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    resetTimer();
  }, []);

  // Next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    resetTimer();
  }, [items.length]);

  // Reset timer
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isPlaying) {
      timeoutRef.current = setTimeout(nextSlide, 5000);
    }
  }, [isPlaying, nextSlide]);

  // Touch handling
  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      nextSlide();
    }
  }, [touchStart, touchEnd, nextSlide]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isPlaying, resetTimer]);

  return (
    <Box
      ref={sliderRef}
      sx={{
        position: "relative",
        height: { xs: "70vh", sm: "80vh", md: "90vh" },
        maxHeight: "900px",
        minHeight: "500px",
        width: "100%",
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
        direction: "ltr",
        userSelect: "none",
        isolation: "isolate",
      }}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides with parallax effect */}
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transition: "opacity 1s ease, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            opacity: currentIndex === index ? 1 : 0,
            transform: currentIndex === index 
              ? "scale(1)" 
              : `scale(${index < currentIndex ? 0.95 : 1.05})`,
            zIndex: currentIndex === index ? 1 : 0,
            willChange: "transform, opacity",
          }}
        >
          {/* Image with parallax effect */}
          <Box
            component="img"
            src={item.url}
            alt={item.title}
            loading="lazy"
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(0.9)",
              transform: currentIndex === index 
                ? "scale(1)" 
                : `scale(${index < currentIndex ? 1.05 : 0.95})`,
              transition: "transform 1.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease",
              willChange: "transform",
            }}
          />

          {/* Gradient overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(45deg, transparent 0%, rgba(14, 54, 124, 0.41) 40%,#A0065141 100% )`,
            }}
          />

          {/* Content container */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              px: { xs: 4, sm: 6, md: 8, lg: 12 },
              py: { xs: 8, sm: 10 },
              color: "white",
              textAlign: "left",
            }}
          >
            {/* Animated content */}
            <Box
              sx={{
                maxWidth: { xs: "100%", md: "60%", lg: "50%" },
                transform: currentIndex === index 
                  ? "translateY(0)" 
                  : `translateY(${index < currentIndex ? "-40px" : "40px"})`,
                opacity: currentIndex === index ? 1 : 0,
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease",
                transitionDelay: currentIndex === index ? "0.3s" : "0s",
                willChange: "transform, opacity",
              }}
            >
              <Typography
                variant={isMobile ? "h3" : "h1"}
                fontWeight={700}
                sx={{
                  mb: { xs: 2, sm: 3 },
                  lineHeight: 1.2,
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  fontSize: { xs: "2.2rem", sm: "3rem", md: "3.5rem", lg: "4rem" },
                }}
              >
                {item.title}
              </Typography>
              
              <Typography
                variant={isMobile ? "body1" : "h5"}
                sx={{
                  mb: { xs: 3, sm: 4 },
                  textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  fontWeight: 400,
                }}
              >
                {item.description}
              </Typography>
              
              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                sx={{
                  px: { xs: 4, sm: 5 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: "50px",
                  background: item.buttonColor,
                  color: "white",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                  transform: currentIndex === index ? "scale(1)" : "scale(0.9)",
                  opacity: currentIndex === index ? 1 : 0,
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, box-shadow 0.3s ease",
                  transitionDelay: currentIndex === index ? "0.5s" : "0s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.4)",
                    backgroundColor: item.buttonColor,
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Box>
      ))}

      {/* Single Next Button */}
      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          right: { xs: "16px", sm: "24px" },
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
          width: { xs: 48, sm: 56 },
          height: { xs: 48, sm: 56 },
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.3)",
            transform: "translateY(-50%) scale(1.1)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <KeyboardArrowRight fontSize={isMobile ? "large" : "large"} />
      </IconButton>

      {/* Minimal Indicators */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "16px", sm: "24px" },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          gap: { xs: "6px", sm: "8px" },
        }}
      >
        {items.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: currentIndex === index ? "12px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: currentIndex === index ? "white" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          />
        ))}
      </Box>

      {/* Progress bar */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          backgroundColor: "rgba(255,255,255,0.2)",
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            height: "100%",
            backgroundColor: "white",
            width: "100%",
            transformOrigin: "left center",
            transform: `scaleX(${(currentIndex + 1) / items.length})`,
            transition: "transform 4.8s linear",
          }}
        />
      </Box>
    </Box>
  );
};

export default Slider;