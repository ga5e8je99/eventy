import { Container } from "@mui/material";
import ChatPot from "../Components/ChatPot";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Background from "../assets/contact.jpg";
import Grid from "@mui/material/Grid";
import { FormInputContext } from "../Contexts/Context";
import Input from "../Components/Input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import MessageIcon from "@mui/icons-material/Message";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import IconButton from "@mui/material/IconButton";
import SVG from "../Components/SVG";
import GitHubIcon from "@mui/icons-material/GitHub";
import Rajab from "../assets/rajeb.jpg";
import { useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  styled,
  useTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../App.css";
import Gamal from "../assets/gamal.png";
import Hazem from "../assets/hazem.jpg";

import { motion, AnimatePresence } from "framer-motion";
import Loading from "../Components/Loading";

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
    border: `3px solid ${theme.palette.primary.main}`,
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
  background: `linear-gradient(45deg,rgba(14, 54, 124, 0.90),#A0065190 )`,
  color: theme.palette.primary.contrastText,
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(45deg, rgba(10, 39, 90, 0.9),rgba(131, 6, 66, 0.56))",
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
    color: theme.palette.secondary.main,
  },
}));

export default function ContactUs() {
  const ourTeam = [
    {
      id: 1,
      name: "Gamal Ahmed",
      src: Gamal,
      job: "Frontend Web Developer",
      jobDetails:
        "Specialized in creating responsive and user-friendly web interfaces using modern JavaScript frameworks like React .",
      linkedIn: "",
      gitHub: "",
    },
    {
      id: 2,
      name: "Hazem Ahmed",
      src: Hazem,
      job: "Frontend Web Developer",
      jobDetails:
        "Passionate about building high-performance web applications with clean, maintainable code and a strong focus on user experience.",
      linkedIn: "",
      gitHub: "",
    },
    {
      id: 3,
      name: "Tasnim Hussam",
      src: "/team/gamal.jpg",
      job: "UI & UX Design",
      jobDetails:
        "Focused on designing intuitive, accessible, and visually appealing user interfaces, with strong attention to usability and detail.",
      linkedIn: "",
      gitHub: "",
    },
    {
      id: 4,
      name: "Ahmed Gamal",
      src: "/team/ahmedGamal.jpg",
      job: "Backend Developer",
      jobDetails:
        "Experienced in building robust backend systems, RESTful APIs, and secure server-side logic using Node.js and Express.",
      linkedIn: "",
      gitHub: "",
    },
    {
      id: 5,
      name: "Mohamed Hassen",
      src: "/team/mohamedHassen.jpg",
      job: "Flutter Developer",
      jobDetails:
        "Skilled in developing cross-platform mobile applications using Flutter, with a focus on smooth performance and attractive UI.",
      linkedIn: "",
      gitHub: "",
    },
    {
      id: 6,
      name: "Mohamed Rajab",
      src: Rajab,
      job: "Flutter Developer",
      jobDetails:
        "Builds modern, scalable mobile apps with Flutter and Dart, ensuring optimal user experience across Android and iOS.",
      linkedIn: "",
      gitHub: "",
    },
    {
      id: 7,
      name: "Kareem",
      src: "/team/kareem.jpg",
      job: "Flutter Developer",
      jobDetails:
        "Builds modern, scalable mobile apps with Flutter and Dart, ensuring optimal user experience across Android and iOS.",
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

  const onSubmit = () => {
    alert("Your message has been sent successfully!");
    reset();
    setValue({
      fullName: "",
      phoneNumber: "",
      email: "",
      message: "",
    });
  };
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <Loading />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          exit={{ opacity: 0, y: 0 }}
        >
          <Navbar activePage={"Contact us"} />
          <Box
            sx={{
              backgroundImage: `linear-gradient(45deg, rgba(14, 54, 124, 0.7),#A0065170), url(${Background})`,
              height: { xs: "50vh", md: "70vh" },
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
                Contact Eventy Team
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                We're here to help with your event planning needs
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                Reach out for inquiries, partnerships, or support
              </Typography>
            </Container>
            <SVG color={"white"} />
          </Box>

          <Container maxWidth="lg" sx={{ py: 6 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
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
                        color: theme.palette.primary.main,
                      }}
                    >
                      Our Contact Details
                    </Typography>

                    <ContactInfoCard>
                      <LocationOnIcon />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Eventy Headquarters
                        </Typography>
                        <Typography>
                          123 Event Street, Tech Park, Ismailia, Egypt
                        </Typography>
                      </Box>
                    </ContactInfoCard>

                    <ContactInfoCard>
                      <PhoneInTalkIcon />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Support Hotline
                        </Typography>
                        <Typography>
                          +20 100 123 4567 (9AM - 5PM, Sunday-Thursday)
                        </Typography>
                      </Box>
                    </ContactInfoCard>

                    <ContactInfoCard>
                      <EmailOutlinedIcon />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Email Us
                        </Typography>
                        <Typography>
                          support@eventy.com (Response within 24 hours)
                        </Typography>
                      </Box>
                    </ContactInfoCard>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledPaper elevation={3}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    sx={{
                      mb: 4,
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Get In Touch
                  </Typography>

                  <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <InfoText>
                          Have questions about our event management platform?
                          Interested in partnership opportunities? Fill out the
                          form below and our team will get back to you promptly.
                        </InfoText>
                      </Grid>

                      {/* Full Name Field */}
                      <Grid item xs={12}>
                        <FormInputContext.Provider
                          value={{
                            inputValue: value.fullName,
                            handelChange: (v) =>
                              setValue({ ...value, fullName: v }),
                            labelTitle: "Full Name",
                            icon: <PersonIcon color="primary" />,
                            type: "text",
                            register: register("fullName", {
                              required: "This field is required",
                              pattern: {
                                value: nameRegex,
                                message:
                                  "Please enter a valid name (min 3 characters)",
                              },
                            }),
                            error: errors.fullName,
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                  borderColor: "primary.main",
                                  borderWidth: 2,
                                },
                              },
                            },
                          }}
                        >
                          <Input />
                        </FormInputContext.Provider>
                      </Grid>

                      {/* Phone Number Field */}
                      <Grid item xs={12} md={6}>
                        <FormInputContext.Provider
                          value={{
                            inputValue: value.phoneNumber,
                            handelChange: (v) =>
                              setValue({ ...value, phoneNumber: v }),
                            labelTitle: "Phone Number",
                            icon: <PhoneIcon color="primary" />,
                            type: "tel",
                            register: register("phoneNumber", {
                              required: "This field is required",
                              pattern: {
                                value: phoneRegex,
                                message:
                                  "Please enter a valid phone number (10-15 digits)",
                              },
                            }),
                            error: errors.phoneNumber,
                          }}
                        >
                          <Input />
                        </FormInputContext.Provider>
                      </Grid>

                      {/* Email Field */}
                      <Grid item xs={12} md={6}>
                        <FormInputContext.Provider
                          value={{
                            inputValue: value.email,
                            handelChange: (v) =>
                              setValue({ ...value, email: v }),
                            labelTitle: "Email Address",
                            icon: <EmailIcon color="primary" />,
                            type: "email",
                            register: register("email", {
                              required: "This field is required",
                              pattern: {
                                value: emailRegex,
                                message: "Please enter a valid email address",
                              },
                            }),
                            error: errors.email,
                          }}
                        >
                          <Input />
                        </FormInputContext.Provider>
                      </Grid>

                      {/* Message Field */}
                      <Grid item xs={12}>
                        <FormInputContext.Provider
                          value={{
                            inputValue: value.message,
                            handelChange: (v) =>
                              setValue({ ...value, message: v }),
                            labelTitle: "Your Message",
                            icon: <MessageIcon color="primary" />,
                            type: "textarea",
                            register: register("message", {
                              required: "This field is required",
                              pattern: {
                                value: messageRegex,
                                message:
                                  "Message must be at least 10 characters",
                              },
                            }),
                            error: errors.message,
                            multiline: true,
                            rows: 5,
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                alignItems: "flex-start",
                              },
                            },
                          }}
                        >
                          <Input />
                        </FormInputContext.Provider>
                      </Grid>

                      <Grid item xs={12}>
                        <InfoText variant="body2">
                          By submitting this form, you agree to our privacy
                          policy and terms of service. We'll never share your
                          information with third parties.
                        </InfoText>
                      </Grid>

                      {/* Submit Button */}
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="center">
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
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
                                backgroundColor: theme.palette.secondary.dark,
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            Send Message
                          </Button>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box textAlign="center" mt={2}>
                          <Typography variant="body2" color="textSecondary">
                            Prefer direct contact? Call us at{" "}
                            <strong>+20 100 123 4567</strong>
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </StyledPaper>
              </Grid>
            </Grid>
          </Container>

          {/* New Informational Section */}
          <Box
            sx={{
              backgroundColor: theme.palette.grey[50],
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
                  color: theme.palette.primary.main,
                }}
              >
                Why Choose Eventy?
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <FeatureCard elevation={3}>
                  <EventIcon sx={{ color: "red" }} />

                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      Comprehensive Event Management
                    </Typography>
                    <Typography>
                      From small meetups to large conferences, Eventy provides
                      all the tools you need to plan, organize, and execute
                      successful events with ease.
                    </Typography>
                  </FeatureCard>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FeatureCard elevation={3}>
                    <GroupIcon />
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      Attendee Engagement
                    </Typography>
                    <Typography>
                      Our platform enhances attendee experience with interactive
                      features, networking opportunities, and seamless
                      registration processes.
                    </Typography>
                  </FeatureCard>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FeatureCard elevation={3}>
                    <CheckCircleIcon />
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      Reliable Support
                    </Typography>
                    <Typography>
                      Our dedicated support team is available around the clock
                      to ensure your events run smoothly without any technical
                      hiccups.
                    </Typography>
                  </FeatureCard>
                </Grid>
              </Grid>
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
                color: theme.palette.primary.main,
              }}
            >
              What Our Clients Say
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4, borderRadius: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontStyle: "italic", mb: 2 }}
                  >
                    "Eventy transformed how we organize our annual tech
                    conference. The platform is intuitive and saved us countless
                    hours of administrative work."
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Ahmed Mohamed
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Tech Summit Organizer
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4, borderRadius: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontStyle: "italic", mb: 2 }}
                  >
                    "The customer support team went above and beyond to help us
                    set up our charity fundraiser. The event was a huge success
                    thanks to Eventy!"
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Sara Mahmoud
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nonprofit Director
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
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
                  color: theme.palette.primary.main,
                }}
              >
                Meet Our Team
              </Typography>

              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
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
                            borderColor: "primary.main",
                            boxShadow: 1,
                          }}
                        />

                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {t.name}
                        </Typography>
                        <Typography color="primary" sx={{ mb: 1 }}>
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
                          <IconButton color="primary">
                            <LinkedInIcon />
                          </IconButton>
                          <IconButton color="primary">
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
          <ChatPot />
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
