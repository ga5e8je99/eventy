import Container from "@mui/material/Container";

import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import MessageIcon from "@mui/icons-material/Message";
import Avatar from "@mui/material/Avatar";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import IconButton from "@mui/material/IconButton";
import Wave from "../Components/Wave";
import GitHubIcon from "@mui/icons-material/GitHub";
import { styled, useTheme } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Background from "../assets/Image/Contact/background.jpg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../App.css";
import TextField from "@mui/material/TextField";
import Sarah from "../assets/Image/Contact/sarah.jpg";
import Ahmed from "../assets/Image/Contact/ahmed.jpeg";
import Gamal from "../assets/Image/Contact/Gamal.png";
import Hazem from "../assets/Image/Contact/hazem.png";
import Tasnim from "../assets/Image/Contact/tasneem.png";
import MohamedHassen from "../assets/Image/Contact/hussen.png";
import MohamedRajab from "../assets/Image/Contact/Rajeb.png";
import Kareem from "../assets/Image/Contact/Kareem.png";
import { transform } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "axios";
import LoadingTimer from "../Components/LoadingTimer";
console.log(transform);
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[10],
  backgroundColor: theme.palette.background.paper,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[16],
  },
}));

const TeamMemberCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  textAlign: "center",
  height: "400px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: theme.shadows[8],
  },
  "& .avatar": {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: theme.spacing(2),
    border: `3px solid ${
      theme.palette.mode === "dark"
        ? theme.palette.primary.light
        : theme.palette.primary.main
    }`,
  },
  "& .social-icons": {
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));
const ContactInfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  borderRadius: theme.spacing(1),
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.primary.light
      : theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "scale(1.02)",
  },
  "& svg": {
    marginRight: theme.spacing(2),
    fontSize: "2rem",
  },
}));

const InfoText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  lineHeight: 1.8,
  color: theme.palette.text.secondary,
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
  "& svg": {
    fontSize: "3rem",
    marginBottom: theme.spacing(2),
    color:
      theme.palette.mode === "dark"
        ? theme.palette.primary.light
        : theme.palette.primary.main,
  },
}));

export default function ContactUs() {
  const { t, i18n } = useTranslation("contactUs");
  const ourTeam = [
    {
      id: 1,
      name: t("Gamal"),
      src: Gamal,
      job: t("GamalJob"),
      jobDetails: t("GamalJobDetails"),
      linkedIn: "",
      gitHub: "",
    },
    {
      id: 2,
      name: t("Hazem"),
      src: Hazem,
      job: t("HazemJob"),
      jobDetails: t("HazemJobDetails"),
      linkedIn: "",
      gitHub: "",
    },
    {
      id: 3,
      name: t("Tasnim"),
      src: Tasnim,
      job: t("TasnimJob"),
      jobDetails: t("TasnimJobDetails"),
      linkedIn: "",
      gitHub: "",
    },

    {
      id: 5,
      name: t("MohamedHassen"),
      src: MohamedHassen,
      job: t("MohamedHassenJob"),
      jobDetails: t("MohamedHassenJobDetails"),
      linkedIn: "",
      gitHub: "",
    },
    {
      id: 6,
      name: t("MohamedRajab"),
      src: MohamedRajab,
      job: t("MohamedRajabJob"),
      jobDetails: t("MohamedRajabJobDetails"),
      linkedIn: "",
      gitHub: "",
    },
    {
      id: 7,
      name: t("Kareem"),
      src: Kareem,
      job: t("KareemJob"),
      jobDetails: t("KareemJobDetails"),
      linkedIn: "",
      gitHub: "",
    },
  ];

  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [value, setValue] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  // Regex patterns for validation
  const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]{3,}$/;
  const phoneRegex = /^[0-9]{10,15}$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const messageRegex = /^.{10,}$/;
  const [alertMassage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const onSubmit = async () => {
    try {
      const apiURL = import.meta.env.VITE_API_URL;

      await axios.post(`${apiURL}/eventy/contact/send`, value);

      setAlertMessage(t("alertMessage"));
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      reset();
      setValue({
        fullName: "",
        phoneNumber: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending contact form:", error);
      setAlertMessage(t("alertErrorMessage"));
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  };
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 3000);
  if (loading) {
    return <LoadingTimer />;
  } else {
    return (
      <Box
        sx={{
          direction: i18n.language === "ar" ? "rtl" : "ltr",
          "::@keyframes fadeIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <NavBar active={i18n.language === "en" ? "Contact" : "اتصل بنا"} />
        <Box
          sx={{
            backgroundImage: `linear-gradient(to bottom right,
  ${
    theme.palette.mode === "light"
      ? theme.palette.primary.main.replace(/ff$/, "9e")
      : theme.palette.primary.light.replace(/ff$/, "9e")
  },
  ${
    theme.palette.mode === "light"
      ? theme.palette.primary.dark.replace(/ff$/, "9e")
      : theme.palette.primary.main.replace(/ff$/, "9e")
  }
), url(${Background})`,

            height: "100vh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "white",
            position: "relative",
            marginBottom: "30px",
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                mb: 2,
              }}
            >
              {t("contactUs")}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {t("description")}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {t("subDescription")}
            </Typography>
          </Container>
          <Box sx={{ width: "100%", position: "absolute", bottom: -20 }}>
            <Wave />
          </Box>
        </Box>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box
            sx={{
              display: "grid",
              gap: 6,
              gridTemplateColumns: { md: "1fr 1fr" },
            }}
          >
            <Box>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <Box
                  sx={{
                    height: "400px",
                    borderRadius: theme.shape.borderRadius,
                    overflow: "hidden",
                    boxShadow: theme.shadows[10],
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.390372053275!2d32.2664939752128!3d30.622954074637395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f8597f201556e7%3A0x9bd6053867337ff3!2sSuez%20Canal%20University!5e0!3m2!1sen!2seg!4v1744196918174!5m2!1sen!2seg"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </Box>

                <Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      mb: 3,
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                    }}
                  >
                    {t("ourContact")}
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <ContactInfoCard>
                      <LocationOnIcon />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {t("eventyHeadquarters")}
                        </Typography>
                        <Typography>{t("address")}</Typography>
                      </Box>
                    </ContactInfoCard>

                    <ContactInfoCard>
                      <PhoneInTalkIcon />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {t("supportHotline")}
                        </Typography>
                        <Typography>{t("phoneNumber")}</Typography>
                      </Box>
                    </ContactInfoCard>

                    <ContactInfoCard>
                      <EmailOutlinedIcon />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {t("email")}
                        </Typography>
                        <Typography>{t("emailAddress")}</Typography>
                      </Box>
                    </ContactInfoCard>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box>
              <StyledPaper elevation={3}>
                <Typography
                  variant="h4"
                  gutterBottom
                  align="center"
                  sx={{
                    mb: 4,
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                  }}
                >
                  {t("getInTouch")}
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    textAlign: "center",
                  }}
                >
                  <Box>
                    <InfoText>{t("getInTouchDesc")}</InfoText>
                  </Box>

                  {/* Full Name Field */}
                  <Box>
                    <TextField
                      sx={{ width: "100%" }}
                      label={t("fullName")}
                      variant="outlined"
                      {...register("fullName", {
                        required: t("isRequired"),
                        pattern: {
                          value: nameRegex,
                          message: t("invalidName"),
                        },
                      })}
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                      InputProps={{
                        startAdornment: (
                          <PersonIcon
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.primary.light
                                  : theme.palette.primary.main,
                              mr: 8,
                            }}
                          />
                        ),
                      }}
                    />
                  </Box>

                  {/* Phone Number Field */}
                  <Box>
                    <TextField
                      sx={{ width: "100%" }}
                      fullWidth
                      label={t("phoneNumberField")}
                      type="tel"
                      variant="outlined"
                      {...register("phoneNumber", {
                        required: t("isRequired"),
                        pattern: {
                          value: phoneRegex,
                          message: t("invalidPhoneNumber"),
                        },
                      })}
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                      InputProps={{
                        startAdornment: (
                          <PhoneIcon
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.primary.light
                                  : theme.palette.primary.main,
                              mr: 8,
                            }}
                          />
                        ),
                      }}
                    />
                  </Box>

                  {/* Email Field */}
                  <Box>
                    <TextField
                      sx={{ width: "100%" }}
                      fullWidth
                      label={t("emailAddressField")}
                      type="email"
                      variant="outlined"
                      {...register("email", {
                        required: t("isRequired"),
                        pattern: {
                          value: emailRegex,
                          message: t("invalidEmailAddress"),
                        },
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <EmailIcon
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.primary.light
                                  : theme.palette.primary.main,
                              mr: 8,
                            }}
                          />
                        ),
                      }}
                    />
                  </Box>

                  {/* Message Field */}
                  <Box>
                    <TextField
                      sx={{ width: "100%" }}
                      fullWidth
                      label={t("messageField")}
                      variant="outlined"
                      multiline
                      rows={5}
                      {...register("message", {
                        required: t("isRequired"),
                        pattern: {
                          value: messageRegex,
                          message: t("invalidMessage"),
                        },
                      })}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                      InputProps={{
                        startAdornment: (
                          <MessageIcon
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.primary.light
                                  : theme.palette.primary.main,
                              mr: 8,
                            }}
                          />
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <InfoText variant="body2">{t("infoConsent")}</InfoText>
                  </Box>

                  {/* Submit Button */}
                  <Box>
                    <Box display="flex" justifyContent="center">
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                          mt: 1,
                          py: 2,
                          fontWeight: "bold",
                          fontSize: "1rem",
                          borderRadius: 2,
                          boxShadow: theme.shadows[3],
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: theme.shadows[6],
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? theme.palette.primary.light
                                : theme.palette.primary.main,
                          },
                          transition: "all 0.3s ease",
                          color: "white",
                        }}
                      >
                        {t("sendMessage")}
                      </Button>
                    </Box>
                  </Box>

                  <Box>
                    <Box textAlign="center" mt={2}>
                      <Typography variant="body2" color="textSecondary">
                        {t("preferContact")} <strong>{t("phoneNumber")}</strong>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </StyledPaper>
            </Box>
          </Box>
        </Container>

        {/* New Informational Section */}
        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[50]
                : theme.palette.background.default,
            py: 8,
            borderTop: `1px solid ${theme.palette.divider}`,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: "bold",
                mb: 6,
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
              }}
            >
              {t("whyChooseEventy")}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 4,
                gridTemplateColumns: { md: "1fr 1fr 1fr" },
              }}
            >
              <Box>
                <FeatureCard elevation={3}>
                  <EventIcon />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {t("comprehensiveTitle")}
                  </Typography>
                  <Typography>{t("comprehensiveDesc")}</Typography>
                </FeatureCard>
              </Box>

              <Box>
                <FeatureCard elevation={3}>
                  <GroupIcon />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {t("attendeeTitle")}
                  </Typography>
                  <Typography>{t("attendeeDesc")}</Typography>
                </FeatureCard>
              </Box>

              <Box>
                <FeatureCard elevation={3}>
                  <CheckCircleIcon />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {t("reliableSupportTitle")}
                  </Typography>
                  <Typography>{t("reliableSupportDesc")}</Typography>
                </FeatureCard>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: "bold",
              mb: 6,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.main,
            }}
          >
            {t("whatOurClients")}
          </Typography>

          <Box
            sx={{
              textAlign: "center",
              mb: 6,
              display: "flex",
              gap: 4,
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "center",
            }}
          >
            <Box>
              <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar src={Ahmed} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {t("client1Name")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {t("client1Position")}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ fontStyle: "italic", mb: 2 }}>
                  {t("client1Feedback")}
                </Typography>
              </Paper>
            </Box>

            <Box>
              <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar src={Sarah} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {t("client2Name")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {t("client2Position")}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ fontStyle: "italic", mb: 2 }}>
                  {t("client2Feedback")}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            py: 8,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: "bold",
                mb: 6,
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
              }}
            >
              {t("meetOurTeam")}
            </Typography>

            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                600: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop
              style={{
                marginBottom: "40px",
                gap: "30px",
                paddingBottom: "30px",
              }}
            >
              {ourTeam.map((t) => {
                return (
                  <SwiperSlide
                    key={t.id}
                    sx={{ marginBottom: "20px", height: { md: "400px" } }}
                    style={{ position: "relative" }}
                  >
                    <TeamMemberCard elevation={3}>
                      <Box
                        component="img"
                        alt={t.name}
                        src={t.src}
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginBottom: 2,
                          border: "2px solid",
                          borderColor:
                            theme.palette.mode === "dark"
                              ? theme.palette.primary.light
                              : theme.palette.primary.main,
                          boxShadow: 1,
                        }}
                      />

                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {t.name}
                      </Typography>
                      <Typography
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? theme.palette.primary.light
                              : theme.palette.primary.contrastText,
                          mb: 1,
                        }}
                      >
                        {t.job}
                      </Typography>
                      <Typography variant="body2">{t.jobDetails}</Typography>
                      <Box
                        className="social-icons"
                        style={{
                          position: "absolute",
                          left: "50%",
                          bottom: "10%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <IconButton
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? theme.palette.primary.light
                                : theme.palette.primary.main,
                          }}
                        >
                          <LinkedInIcon />
                        </IconButton>
                        <IconButton
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? theme.palette.primary.light
                                : theme.palette.primary.main,
                          }}
                        >
                          <GitHubIcon />
                        </IconButton>
                      </Box>
                    </TeamMemberCard>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Container>
        </Box>

        <Alert
          sx={{
            position: "fixed",
            top: "120px",
            zIndex: 5555,
            left: "50%",
            opacity: open ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            transform: "translateX(-50%)",
          }}
          severity={
            alertMassage === t("alertMassageError") ? "error" : "success"
          }
        >
          {alertMassage}
        </Alert>

        <Footer />
      </Box>
    );
  }
}
