import { useState, useEffect } from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import axios from "axios";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import PaymentIcon from "@mui/icons-material/Payment";
import LockIcon from "@mui/icons-material/Lock";
import ShieldIcon from "@mui/icons-material/Shield";

// Components
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

export default function BookingPage() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();
  
  // State
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // User Info
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [walletNumber, setWalletNumber] = useState("");
  
  // Event and Ticket Data
  const [eventData, setEventData] = useState(null);
  const [ticketTier, setTicketTier] = useState(null);
  
  // Stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    i18n.language === "ar" ? "تفاصيل التذكرة" : "Ticket Details",
    i18n.language === "ar" ? "معلومات الحجز" : "Booking Information",
    i18n.language === "ar" ? "الدفع" : "Payment",
  ];

  // Colors
  const isDarkMode = theme.palette.mode === "dark";
  const primaryColor = isDarkMode
    ? theme.palette.primary.light
    : theme.palette.primary.main;
  const secondaryColor = isDarkMode
    ? theme.palette.secondary.light
    : theme.palette.secondary.main;

  // Fetch event data on load
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        
        // Get data from navigation state or fetch from API
        if (location.state?.event && location.state?.ticketTier) {
          setEventData(location.state.event);
          setTicketTier(location.state.ticketTier);
          
          // Fetch user info if token exists. This can 401/404 if user not logged in;
          // handle it locally so the booking page still loads event data.
          const token = localStorage.getItem("token");
          if (token) {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
            try {
              const userRes = await axios.get(`${apiUrl}/eventy/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              if (userRes?.data) {
                setUserInfo({
                  fullName: userRes.data.fullName || "",
                  email: userRes.data.email || "",
                  phone: userRes.data.phone || "",
                });
              }
            } catch (err) {
              // Not fatal: user may be unauthenticated or token expired.
              // Log useful details for debugging (status + body when available).
              console.warn("Could not fetch current user (/auth/me):", err?.response?.status, err?.response?.data || err.message);
            }
          }
        } else {
          // If no state, fetch from API
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
          const eventRes = await axios.get(`${apiUrl}/eventy/events/${eventId}`);
          setEventData(eventRes.data);
          
          // For simplicity, take first ticket tier
          if (eventRes.data.ticketTiers?.length > 0) {
            setTicketTier(eventRes.data.ticketTiers[0]);
          }
        }
      } catch (err) {
        // Log detailed info to aid debugging (status and response body when available)
        console.error("Error fetching event data:", err?.response?.status, err?.response?.data || err.message);
        setError(t("حدث خطأ في تحميل بيانات الفعالية", "Error loading event data"));
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, location.state, t]);

  // Handle form input changes
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle wallet number change
  const handleWalletNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 11);
    setWalletNumber(value);
  };

  // Handle step navigation
  const handleNext = () => {
    // Validate current step
    if (activeStep === 1) {
      if (!userInfo.fullName.trim() || !userInfo.email.trim() || !userInfo.phone.trim()) {
        setError(i18n.language === "ar" 
          ? "يرجى ملء جميع الحقول المطلوبة" 
          : "Please fill all required fields");
        return;
      }
    }
    
    setActiveStep((prevStep) => prevStep + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  // Handle payment
  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError(i18n.language === "ar" 
          ? "يرجى تسجيل الدخول أولاً" 
          : "Please login first");
        setProcessing(false);
        return;
      }
  
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      
      // Prepare payment data
      const paymentData = {
        eventId: eventData._id,
        amount: ticketTier.price,
        paymentMethod: paymentMethod,
      };
  
      // Add wallet number if payment method is wallet
      if (paymentMethod === "wallet") {
        if (!walletNumber || walletNumber.length !== 11) {
          setError(i18n.language === "ar" 
            ? "يرجى إدخال رقم محفظة صحيح (11 رقم)" 
            : "Please enter a valid wallet number (11 digits)");
          setProcessing(false);
          return;
        }
        paymentData.wallet_number = walletNumber;
      }
  
      // Basic client-side validation before sending
      if (!eventData?._id) {
        throw new Error(i18n.language === "ar" ? "بيانات الفعالية غير متاحة" : "Event data is missing");
      }

      // Send payment request
      let response;
      try {
        response = await axios.post(
          `${apiUrl}/eventy/events/pay`,
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
      } catch (err) {
        // Log server error details for debugging
        console.error("Payment request failed:", err?.response?.status, err?.response?.data || err.message);
        const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
        setError(serverMsg || (i18n.language === "ar" ? "حدث خطأ في عملية الدفع" : "Payment process failed"));
        setProcessing(false);
        return;
      }

      console.log("Payment response:", response.data);

      // Handle response based on payment method
      if (paymentMethod === "card") {
        // For card payment, redirect to Paymob iframe
        if (response.data?.redirect_url) {
          window.location.href = response.data.redirect_url;
        } else {
          setError(i18n.language === "ar" 
            ? "حدث خطأ في إنشاء رابط الدفع" 
            : "Error generating payment link");
        }
      } else if (paymentMethod === "wallet") {
        // For wallet payment, show success message
        if (response.data?.success) {
          setSuccess(true);
          // Store booking info for confirmation
          localStorage.setItem('lastBooking', JSON.stringify({
            eventId: eventData._id,
            ticketTier: ticketTier.tierName,
            amount: ticketTier.price,
            date: new Date().toISOString(),
            transactionId: response.data.transactionId || Date.now().toString()
          }));
        } else {
          setError(response.data?.message || 
            (i18n.language === "ar" 
              ? "حدث خطأ في عملية الدفع" 
              : "Payment process failed"));
        }
      }
    } catch (err) {
      // Print detailed error info from backend
      console.error("Payment error details:", err.response?.data || err);
  
      setError(
        err.response?.data?.message || 
        err.message || 
        (i18n.language === "ar" 
          ? "حدث خطأ في عملية الدفع" 
          : "Payment process failed")
      );
    } finally {
      setProcessing(false);
    }
  };
  

  // Format currency
  const formatCurrency = (amount) => {
    return `${amount} ${i18n.language === "ar" ? "جنيه" : "EGP"}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(
      i18n.language === "ar" ? "ar-SA" : "en-US",
      options
    );
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Container sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ color: primaryColor }} />
            <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
              {i18n.language === "ar" ? "جاري التحميل..." : "Loading..."}
            </Typography>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  if (!eventData || !ticketTier) {
    return (
      <>
        <NavBar />
        <Container sx={{ py: 10 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {i18n.language === "ar" 
              ? "لم يتم العثور على بيانات الفعالية" 
              : "Event data not found"}
          </Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            {i18n.language === "ar" ? "العودة" : "Go Back"}
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  // Success screen
  if (success) {
    return (
      <>
        <NavBar />
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Card
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
              background: `linear-gradient(135deg, ${alpha(primaryColor, 0.1)}, ${alpha(secondaryColor, 0.1)})`,
              border: `1px solid ${alpha(primaryColor, 0.2)}`,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <CheckCircleIcon 
                sx={{ 
                  fontSize: 80, 
                  color: "success.main",
                  mb: 2 
                }} 
              />
              <Typography variant="h4" fontWeight={700} color="success.main" gutterBottom>
                {i18n.language === "ar" ? "تم الدفع بنجاح!" : "Payment Successful!"}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {i18n.language === "ar" 
                  ? "تم حجز تذكرتك بنجاح" 
                  : "Your ticket has been booked successfully"}
              </Typography>
            </Box>

            <Card
              sx={{
                p: 3,
                mb: 4,
                backgroundColor: isDarkMode ? "background.paper" : "#f8f9fa",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {i18n.language === "ar" ? "الفعالية" : "Event"}
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {eventData.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {i18n.language === "ar" ? "فئة التذكرة" : "Ticket Tier"}
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {ticketTier.tierName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {i18n.language === "ar" ? "المبلغ المدفوع" : "Amount Paid"}
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="primary">
                    {formatCurrency(ticketTier.price)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {i18n.language === "ar" ? "طريقة الدفع" : "Payment Method"}
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {paymentMethod === "wallet" 
                      ? (i18n.language === "ar" ? "المحفظة الإلكترونية" : "E-Wallet")
                      : (i18n.language === "ar" ? "البطاقة الإئتمانية" : "Credit Card")}
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={() => navigate(`/event/${eventData._id}`)}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                {i18n.language === "ar" ? "العودة للفعالية" : "Back to Event"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{ px: 4, py: 1.5 }}
              >
                {i18n.language === "ar" ? "الصفحة الرئيسية" : "Home Page"}
              </Button>
            </Box>

            <Alert 
              severity="info" 
              sx={{ mt: 4, textAlign: "right" }}
              icon={<InfoIcon />}
            >
              <Typography variant="body2">
                {i18n.language === "ar" 
                  ? "سيتم إرسال تأكيد الحجز إلى بريدك الإلكتروني. يمكنك عرض التذاكر المحجوزة في قسم 'تذاكري' في حسابك." 
                  : "A booking confirmation will be sent to your email. You can view booked tickets in 'My Tickets' section of your account."}
              </Typography>
            </Alert>
          </Card>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            {i18n.language === "ar" ? "العودة" : "Go Back"}
          </Button>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {i18n.language === "ar" ? "حجز التذكرة" : "Book Ticket"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {i18n.language === "ar" 
              ? "أكمل عملية حجز تذكرتك للفعالية" 
              : "Complete your ticket booking for the event"}
          </Typography>
        </Box>

        {/* Stepper */}
        <Box sx={{ mb: 6 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4 }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Box sx={{display:'flex', justffyContent:'center',gap:10}}>
          {/* Left Column: Steps Content */}
          <Box sx={{width: "50%"}}>
            <Card
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: isDarkMode 
                  ? theme.palette.background.paper 
                  : "#f8f9fa",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {/* Step 1: Ticket Details */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {i18n.language === "ar" ? "تفاصيل التذكرة" : "Ticket Details"}
                  </Typography>
                  
                  <Box sx={{ mt: 4 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 3,
                            backgroundColor: alpha(primaryColor, 0.1),
                            border: `2px solid ${primaryColor}`,
                            borderRadius: 2,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <EventIcon sx={{ mr: 2, color: primaryColor }} />
                            <Typography variant="h6" fontWeight={700}>
                              {ticketTier.tierName}
                            </Typography>
                          </Box>
                          <Typography variant="body1" paragraph>
                            {ticketTier.description || 
                              (i18n.language === "ar" 
                                ? "تذكرة قياسية للفعالية" 
                                : "Standard event ticket")}
                          </Typography>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h4" fontWeight={800} color="primary">
                              {formatCurrency(ticketTier.price)}
                            </Typography>
                            {ticketTier.price === 0 && (
                              <Chip 
                                label={i18n.language === "ar" ? "مجاني" : "FREE"} 
                                color="success" 
                                variant="filled"
                              />
                            )}
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2.5, borderRadius: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {i18n.language === "ar" ? "اسم الفعالية" : "Event Name"}
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {eventData.name}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2.5, borderRadius: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {i18n.language === "ar" ? "التاريخ" : "Date"}
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {formatDate(eventData.startDate)}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2.5, borderRadius: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {i18n.language === "ar" ? "الوقت" : "Time"}
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {eventData.startTime} - {eventData.endTime}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2.5, borderRadius: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {i18n.language === "ar" ? "المكان" : "Location"}
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {eventData.location?.address || 
                              (i18n.language === "ar" ? "أونلاين" : "Online")}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        px: 4,
                        py: 1.5,
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    >
                      {i18n.language === "ar" ? "التالي" : "Next"}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step 2: Booking Information */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {i18n.language === "ar" ? "معلومات الحجز" : "Booking Information"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {i18n.language === "ar" 
                      ? "يرجى إدخال معلوماتك الشخصية للمتابعة" 
                      : "Please enter your personal information to continue"}
                  </Typography>

                  <Box sx={{ mt: 4 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label={i18n.language === "ar" ? "الاسم بالكامل" : "Full Name"}
                          name="fullName"
                          value={userInfo.fullName}
                          onChange={handleUserInfoChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                          sx={{ mb: 2 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={i18n.language === "ar" ? "البريد الإلكتروني" : "Email Address"}
                          name="email"
                          type="email"
                          value={userInfo.email}
                          onChange={handleUserInfoChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={i18n.language === "ar" ? "رقم الهاتف" : "Phone Number"}
                          name="phone"
                          value={userInfo.phone}
                          onChange={handleUserInfoChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={handleBack} sx={{ px: 4 }}>
                      {i18n.language === "ar" ? "السابق" : "Back"}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        px: 4,
                        py: 1.5,
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    >
                      {i18n.language === "ar" ? "التالي" : "Next"}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step 3: Payment */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {i18n.language === "ar" ? "طريقة الدفع" : "Payment Method"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {i18n.language === "ar" 
                      ? "اختر طريقة الدفع المناسبة لك" 
                      : "Choose your preferred payment method"}
                  </Typography>

                  <Box sx={{ mt: 4 }}>
                    <FormControl component="fieldset" sx={{ width: "100%" }}>
                      <RadioGroup
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        {/* Credit Card Option */}
                        <Paper
                          sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 2,
                            border: `2px solid ${
                              paymentMethod === "card" ? primaryColor : theme.palette.divider
                            }`,
                            backgroundColor: paymentMethod === "card" 
                              ? alpha(primaryColor, 0.05) 
                              : "transparent",
                            cursor: "pointer",
                            "&:hover": {
                              borderColor: paymentMethod === "card" ? primaryColor : alpha(primaryColor, 0.5),
                            },
                          }}
                          onClick={() => setPaymentMethod("card")}
                        >
                          <FormControlLabel
                            value="card"
                            control={<Radio color="primary" />}
                            label={
                              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <CreditCardIcon sx={{ mr: 2, fontSize: 30, color: primaryColor }} />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" fontWeight={600}>
                                    {i18n.language === "ar" ? "البطاقة الإئتمانية" : "Credit/Debit Card"}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {i18n.language === "ar" 
                                      ? "ادفع باستخدام بطاقة فيزا، ماستركارد، أو أمريكان إكسبريس" 
                                      : "Pay using Visa, Mastercard, or American Express"}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            sx={{ width: "100%", m: 0 }}
                          />
                        </Paper>

                        {/* Wallet Option */}
                        <Paper
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            border: `2px solid ${
                              paymentMethod === "wallet" ? "#4CAF50" : theme.palette.divider
                            }`,
                            backgroundColor: paymentMethod === "wallet" 
                              ? alpha("#4CAF50", 0.05) 
                              : "transparent",
                            cursor: "pointer",
                            "&:hover": {
                              borderColor: paymentMethod === "wallet" ? "#4CAF50" : alpha("#4CAF50", 0.5),
                            },
                          }}
                          onClick={() => setPaymentMethod("wallet")}
                        >
                          <FormControlLabel
                            value="wallet"
                            control={<Radio color="success" />}
                            label={
                              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <AccountBalanceWalletIcon sx={{ mr: 2, fontSize: 30, color: "#4CAF50" }} />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" fontWeight={600}>
                                    {i18n.language === "ar" ? "المحفظة الإلكترونية" : "E-Wallet"}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {i18n.language === "ar" 
                                      ? "ادفع باستخدام محفظتك الإلكترونية (فودافون كاش، أورانج كاش، إلخ)" 
                                      : "Pay using your e-wallet (Vodafone Cash, Orange Cash, etc.)"}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            sx={{ width: "100%", m: 0 }}
                          />
                        </Paper>
                      </RadioGroup>
                    </FormControl>

                    {/* Wallet Number Input */}
                    {paymentMethod === "wallet" && (
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          {i18n.language === "ar" ? "رقم المحفظة" : "Wallet Number"}
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder={i18n.language === "ar" ? "01XXXXXXXXX" : "01XXXXXXXXX"}
                          value={walletNumber}
                          onChange={handleWalletNumberChange}
                          InputProps={{
                            startAdornment: (
                              <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                          helperText={i18n.language === "ar" 
                            ? "أدخل رقم الهاتف المرتبط بمحفظتك الإلكترونية (11 رقم)" 
                            : "Enter the phone number associated with your e-wallet (11 digits)"}
                        />
                      </Box>
                    )}

                    {/* Security Info */}
                    <Alert 
                      severity="info" 
                      sx={{ mt: 4 }}
                      icon={<ShieldIcon />}
                    >
                      <Typography variant="body2">
                        {i18n.language === "ar" 
                          ? "جميع عمليات الدفع مشفرة وآمنة. لا نقوم بتخزين معلومات بطاقتك الإئتمانية." 
                          : "All payments are encrypted and secure. We do not store your credit card information."}
                      </Typography>
                    </Alert>

                    <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                      <Button onClick={handleBack} sx={{ px: 4 }}>
                        {i18n.language === "ar" ? "السابق" : "Back"}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handlePayment}
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={20} /> : <PaymentIcon />}
                        sx={{
                          px: 4,
                          py: 1.5,
                          background: paymentMethod === "wallet"
                            ? `linear-gradient(135deg, #4CAF50, #2E7D32)`
                            : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                          "&:disabled": {
                            background: theme.palette.grey[400],
                          },
                        }}
                      >
                        {processing 
                          ? (i18n.language === "ar" ? "جاري المعالجة..." : "Processing...")
                          : (paymentMethod === "wallet"
                            ? (i18n.language === "ar" ? "ادفع الآن" : "Pay Now")
                            : (i18n.language === "ar" ? "تابع للدفع" : "Continue to Payment"))}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Card>
          </Box>

          {/* Right Column: Order Summary */}
          <Box sx={{width:"50%"}}>
            <Box sx={{ position: "sticky", top: 100 }}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: isDarkMode 
                    ? theme.palette.background.paper 
                    : "#ffffff",
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {i18n.language === "ar" ? "ملخص الطلب" : "Order Summary"}
                </Typography>

                <Box sx={{ my: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {i18n.language === "ar" ? "فئة التذكرة" : "Ticket Tier"}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {ticketTier.tierName}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {i18n.language === "ar" ? "الكمية" : "Quantity"}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      1
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {i18n.language === "ar" ? "السعر" : "Price"}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(ticketTier.price)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {i18n.language === "ar" ? "الرسوم الإدارية" : "Service Fee"}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(0)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight={700}>
                      {i18n.language === "ar" ? "الإجمالي" : "Total"}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="primary">
                      {formatCurrency(ticketTier.price)}
                    </Typography>
                  </Box>
                </Box>

                {/* Event Info */}
                <Card
                  sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: alpha(primaryColor, 0.05),
                    border: `1px solid ${alpha(primaryColor, 0.2)}`,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {i18n.language === "ar" ? "معلومات الفعالية" : "Event Information"}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {eventData.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(eventData.startDate)} • {eventData.startTime}
                  </Typography>
                </Card>

                {/* Security Badge */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "success.main" }}>
                  <LockIcon fontSize="small" />
                  <Typography variant="caption">
                    {i18n.language === "ar" 
                      ? "دفع آمن ومشفر" 
                      : "Secure & Encrypted Payment"}
                  </Typography>
                </Box>
              </Card>

              {/* Help Card */}
              <Card
                sx={{
                  mt: 3,
                  p: 2.5,
                  backgroundColor: alpha("#2196F3", 0.05),
                  border: `1px solid ${alpha("#2196F3", 0.2)}`,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom color="info.main">
                  <InfoIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                  {i18n.language === "ar" ? "معلومات مهمة" : "Important Information"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {i18n.language === "ar" 
                    ? "• يمكنك إلغاء الحجز حتى 24 ساعة قبل الفعالية" 
                    : "• You can cancel booking up to 24 hours before the event"}
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  {i18n.language === "ar" 
                    ? "• سيتم إرسال التذكرة إلى بريدك الإلكتروني بعد الدفع" 
                    : "• Ticket will be sent to your email after payment"}
                </Typography>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>

      <Footer />
    </>
  );
}