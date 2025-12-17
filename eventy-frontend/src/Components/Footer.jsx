import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import EnglishLogo from "../assets/Image/Logo/whiteLogoEn.png";
import ArabicLogo from "../assets/Image/Logo/whiteLogoAr.png";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import BlackArabicLogo from "../assets/Image/Logo/blackLogoAr.png";
import BlackEnglishLogo from "../assets/Image/Logo/blackLogoEn.png";
export default function Footer() {
  const theme = useTheme();
  const { t, i18n } = useTranslation("footer");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        background:
          theme.palette.mode === "dark"
            ? theme.palette.primary.light
            : theme.palette.primary.main,
        color: theme.palette.mode === "dark" ? "black" : "white",
        py: 7,
        direction: direction,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        {/* الجزء العلوي */}
        <Grid container spacing={4} justifyContent="center" textAlign="center">
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight={400} mb={2}>
              {t("footer.eventsAway")}
            </Typography>
            <Typography variant="h4" fontWeight={700} mb={2}>
              {t("footer.requestInfo")}
            </Typography>
            <Typography variant="body1" maxWidth="600px" margin="0 auto" mb={4}>
              {t("footer.description")}
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.mode==="dark"?"black":'white',
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                fontWeight: 600,
                px: 4,
                py: 1,
                "&:hover": {
                  backgroundColor: theme.palette.grey[200],
                },
              }}
            >
              {t("footer.contactBtn")}
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, backgroundColor: "rgba(255,255,255,0.2)" }} />

        {/* الجزء الأوسط */}
        <Grid
          container
          spacing={4}
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "center" : "flex-start"}
          justifyContent="space-between"
          sx={{
            flexDirection: isMobile
              ? "column"
              : i18n.language === "ar"
              ? "row-reverse"
              : "row",
          }}
        >
          {/* الشعار */}
          <Grid
            item
            xs={12}
            md={3}
            textAlign={
              isMobile ? "center" : i18n.language === "ar" ? "right" : "left"
            }
          >
            <Box mb={2}>
              <img
                src={
                  i18n.language === "ar"
                    ? theme.palette.mode === "dark"
                      ? BlackArabicLogo
                      : ArabicLogo
                    : theme.palette.mode === "dark"
                    ? BlackEnglishLogo
                    : EnglishLogo
                }
                width={150}
                alt="Logo"
              />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              {t("footer.tagline")}
            </Typography>

            {/* وسائل التواصل الاجتماعي */}
            <Box
              display="flex"
              justifyContent={
                isMobile
                  ? "center"
                  : i18n.language === "ar"
                  ? "flex-end"
                  : "flex-start"
              }
            >
              <IconButton
                sx={{
                  color: theme.palette.mode === "dark" ? "black" : "white",
                  mx: 0.5,
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: theme.palette.mode === "dark" ? "black" : "white",
                  mx: 0.5,
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: theme.palette.mode === "dark" ? "black" : "white",
                  mx: 0.5,
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* روابط سريعة */}
          <Grid
            item
            xs={12}
            md={3}
            textAlign={
              isMobile ? "center" : i18n.language === "ar" ? "right" : "left"
            }
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              {t("footer.quickLinks")}
            </Typography>
            <List dense sx={{ py: 0 }}>
              {["home", "create", "schedule", "search", "contactUs"].map(
                (item) => (
                  <ListItem
                    key={item}
                    sx={{
                      justifyContent: isMobile
                        ? "center"
                        : i18n.language === "ar"
                        ? "flex-end"
                        : "flex-start",
                      py: 0.5,
                    }}
                  >
                    <Link
                      to={`/${item === "home" ? "" : item}`}
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "black" : "white",
                        textDecoration: "none",
                        opacity: 0.8,
                        fontSize: "0.9rem",
                        transition: "opacity 0.3s",
                        "&:hover": {
                          opacity: 1,
                        },
                      }}
                    >
                      {t(`footer.${item}`)}
                    </Link>
                  </ListItem>
                )
              )}
            </List>
          </Grid>

          {/* معلومات التواصل */}
          <Grid
            item
            xs={12}
            md={4}
            textAlign={
              isMobile ? "center" : i18n.language === "ar" ? "right" : "left"
            }
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              {t("footer.contactInfo")}
            </Typography>
            <Box sx={{ opacity: 0.8 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent={
                  isMobile
                    ? "center"
                    : i18n.language === "ar"
                    ? "flex-end"
                    : "flex-start"
                }
                mb={1}
              >
                <LocationOnIcon
                  sx={{
                    fontSize: 18,
                    mr: i18n.language === "ar" ? 0 : 1,
                    ml: i18n.language === "ar" ? 1 : 0,
                  }}
                />
                <Typography variant="body2">123 Event Street, City</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent={
                  isMobile
                    ? "center"
                    : i18n.language === "ar"
                    ? "flex-end"
                    : "flex-start"
                }
                mb={1}
              >
                <PhoneIcon
                  sx={{
                    fontSize: 18,
                    mr: i18n.language === "ar" ? 0 : 1,
                    ml: i18n.language === "ar" ? 1 : 0,
                  }}
                />
                <Typography variant="body2">+123 456 7890</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent={
                  isMobile
                    ? "center"
                    : i18n.language === "ar"
                    ? "flex-end"
                    : "flex-start"
                }
                mb={1}
              >
                <EmailIcon
                  sx={{
                    fontSize: 18,
                    mr: i18n.language === "ar" ? 0 : 1,
                    ml: i18n.language === "ar" ? 1 : 0,
                  }}
                />
                <Typography variant="body2">info@eventy.com</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: "rgba(255,255,255,0.2)" }} />

        {/* الجزء السفلي */}
        <Box textAlign="center" pt={2}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2025 Eventy. {t("footer.allRightsReserved")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
