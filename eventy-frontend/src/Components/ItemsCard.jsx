import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import { useTheme } from "@mui/material/styles";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function ItemsCard({
  image,
  description,
  title,
  type,
  rating,
  price,
  date,
  location,
  time,
  id,
}) {
  const theme = useTheme();
  const token = localStorage.getItem("token");
  const [alert, setAlert] = React.useState(false);
  const { i18n } = useTranslation();

  return (
    <Card
      sx={{
        width: { xs: "100%", sm: 340, md: 360 },
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        background: theme.palette.mode === "light" ? "#ffffff" : "#111",

        transition: ".35s",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
        },
      }}
    >
      {/* Image + Overlay */}
      <Box sx={{ position: "relative", height: 210 }}>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(.82)",
            
          }}
        />

        {/* Dark Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, #0e367c7e, transparent)`,
            
          }}
        />

        {/* Top Labels */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ position: "absolute", top: 12, left: 12, right: 12 }}
        >
          <Chip
            label={type}
            size="small"
            sx={{
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.45)",
              fontWeight: 600,
            }}
          />

          <Rating value={rating} precision={0.1} readOnly size="small" />
        </Stack>

        {/* Price Badge */}
        <Chip
          icon={<AttachMoneyIcon />}
          label={price}
          sx={{
            position: "absolute",
            bottom: 12,
            right: 12,
            color: "#fff",
            bgcolor: "rgba(0,0,0,0.45)",
            fontWeight: 700,
            backdropFilter: "blur(4px)",
          }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.85,
            my: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>

        <Stack spacing={0.5} mt={1}>
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <LocationOnIcon fontSize="inherit" /> {location} |{" "}
            <EventIcon fontSize="inherit" /> {date} |{" "}
            <AccessTimeIcon fontSize="inherit" /> {time}
          </Typography>
        </Stack>
      </Box>

      {/* Buttons */}
      <Box sx={{ p: 2, pt: 0, position: "relative" }}>
        <Stack direction="row" spacing={1} >
          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius: 3,
              bgcolor:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.main,
              color: "#ffffffff",
              fontWeight: 700,
              "&:hover": { bgcolor: theme.palette.primary.dark },
              opacity: !token ? 0.6 : 1,
              cursor: !token ? "not-allowed" : "pointer",
              mr: i18n.language === "ar" ? 0 : "15px !important",
              ml: i18n.language === "ar" ? "15px !important" : 0,
            }}
            
            onMouseEnter={() => !token && setAlert(true)}
            onMouseLeave={() => setAlert(false)}
            onClick={() => !token && setAlert(true)}
          >
            {i18n.language === "ar" ? "اشترك دلوقتي " : "Join Now"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.main,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.main,
              fontWeight: 600,
              "&:hover": {
                borderColor:
                  theme.palette.mode === "dark"
                    ? "#ffffff"
                    : theme.palette.primary.dark,
                color:
                  theme.palette.mode === "dark"
                    ? "#fff"
                    : theme.palette.primary.dark,
              },
            }}
            component={Link}
            to={`/event/${id}`}
          >
            {i18n.language === "ar" ? "تفاصيل" : "Details"}
          </Button>
        </Stack>
        <Box
          component="span"
          sx={{
            position: "absolute",
            top: "-70px",
            left: "50%",
            transform: "translateX(-50%)",
            background: theme.palette.mode === "dark" ? "#1f1f1f" : "#f0f0f0",
            color: theme.palette.mode === "dark" ? "#eaeaea" : "#4f4f4fff",
            fontWeight: 600,
            px: 2,
            py: 1,
            borderRadius: "16px",
            fontSize: "13px",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 12px rgba(0,0,0,0.4)"
                : "0 4px 12px rgba(0,0,0,0.15)",
            pointerEvents: "none",
            userSelect: "none",
            opacity: alert ? 1 : 0,
            transition: "opacity .3s, transform .3s",
            zIndex: 999,
            animation: alert ? "fadeSlide .3s ease-out" : "none",

            "::after": {
              content: '""',
              position: "absolute",
              bottom: "-8px",
              left: i18n.language === "ar" ? "auto" : "20px",
              right: i18n.language === "ar" ? "20px" : "auto",
              // transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `8px solid ${
                theme.palette.mode === "dark" ? "#1f1f1f" : "#f0f0f0"
              }`,
            },

            "@keyframes fadeSlide": {
              "0%": {
                opacity: 0,
                transform: "translateX(-50%) translateY(5px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateX(-50%) translateY(0)",
              },
            },
          }}
        >
          {i18n.language === "ar" ? "لازم تسجل دخول عشان تشترك" : "Please login to join"}
        </Box>
      </Box>
    </Card>
  );
}
