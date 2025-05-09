import { Box, Typography, useTheme, keyframes } from "@mui/material";
import Image from "../assets/welcome.svg";
import Logo from "../assets/eventy.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Animations
const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blink = keyframes`
  50% { border-color: transparent }
`;

const logoPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.9 }
  50% { transform: scale(1.1); opacity: 1 }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function WelcomePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);

    const timer = setTimeout(() => {
      navigate("/home"); // Redirect after 3 seconds
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        background: `
          linear-gradient(rgba(14, 55, 124, 0.85), rgba(160, 6, 81, 0.6)),
          url("${Image}")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.25)",
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          px: 3,
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: loaded ? `${fadeIn} 1.5s ease-out` : "none",
        }}
      >
        {/* Typing text animation */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 300,
            letterSpacing: "1px",
            mb: 1,
            overflow: "hidden",
            whiteSpace: "nowrap",
            borderRight: "2px solid white",
            width: loaded ? "100%" : "0",
            animation: loaded
              ? `${typing} 2s steps(22, end), ${blink} 0.7s step-end infinite`
              : "none",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            [theme.breakpoints.down("sm")]: {
              fontSize: "2rem",
            },
          }}
        >
          Welcome To
        </Typography>

        {/* Animated Logo */}
        <Box
          sx={{
            mb: 2,
            mt: 1,
            "& img": {
              width: { xs: "180px", sm: "260px" },
              height: "auto",
              filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
              animation: loaded ? `${logoPulse} 2.5s ease-in-out infinite` : "none",
            },
          }}
        >
          <img src={Logo} alt="Eventy Logo" />
        </Box>

        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            color: "#f1f1f1",
            fontWeight: 300,
            animation: loaded ? `${fadeIn} 1.5s ease-out 1s forwards` : "none",
            opacity: 0,
          }}
        >
          We’re getting things ready for you...
        </Typography>
      </Box>
    </Box>
  );
}
