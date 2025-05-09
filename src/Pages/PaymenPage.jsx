import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  useTheme,
  InputAdornment,
  FormControl,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  ArrowBack as ArrowBackIcon,
  Lock as LockIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import Navbar from '../Components/Navbar';
import Loading from '../Components/Loading';

const PaymentPage = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [formErrors, setFormErrors] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
  });

  const getAuthenticationToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found. Please log in.');
    }
    return token;
  };

  const fetchEventDetails = async () => {
    try {
      if (!eventId) {
        throw new Error('Event ID is missing');
      }

      const token = getAuthenticationToken();
      const response = await axios.get(
        `https://eventplanner-production-ce6e.up.railway.app/api/events/getevent/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEvent(response.data.event);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching event details:', error);
      
      let errorMsg = 'Failed to load event details';
      if (error.message === 'Event ID is missing') {
        errorMsg = 'Invalid event link. Please check the URL.';
      } else if (error.response?.status === 401) {
        errorMsg = 'Session expired. Please log in again.';
        navigate('/login', { state: { from: `/payment/${eventId}` } });
        return;
      } else if (error.response?.status === 404) {
        errorMsg = 'Event not found. It may have been canceled or removed.';
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.';
      }

      setErrorMessage(errorMsg);
      setIsLoading(false);
    }
  };

  const validatePaymentForm = () => {
    const errors = {
      cardNumber: '',
      expirationDate: '',
      securityCode: '',
    };
    let isValid = true;

    if (!cardNumber.match(/^\d{16,19}$/)) {
      errors.cardNumber = 'Card number must be 16-19 digits';
      isValid = false;
    }

    if (!expirationDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      errors.expirationDate = 'Please use MM/YY format';
      isValid = false;
    }

    if (!securityCode.match(/^\d{3,4}$/)) {
      errors.securityCode = 'Security code must be 3 or 4 digits';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const processPayment = async () => {
    const token = getAuthenticationToken();
    
    // Extract month and year from expiration date
    const [expMonth, expYear] = expirationDate.split('/');
    
    const paymentData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      expMonth: parseInt(expMonth),
      expYear: parseInt(expYear),
      cvv: securityCode,
    };

    const response = await axios.post(
      `https://eventplanner-production-ce6e.up.railway.app/api/events/completepayment/${eventId}`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  };

  const handlePaymentSubmission = async (event) => {
    event.preventDefault();
    
    if (!validatePaymentForm()) {
      return;
    }
    
    setIsProcessingPayment(true);
    setErrorMessage(null);

    try {
      await processPayment();
      setPaymentSuccess(true);
      
      setTimeout(() => {
        navigate('/schedule', { 
          state: { 
            paymentSuccess: true,
            message: 'Your payment was processed successfully!',
            eventName: event.name,
          } 
        });
      }, 4000);
    } catch (error) {
      console.error('Payment processing error:', error);
      
      let errorMessage = 'Payment processing failed. Please try again.';
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 
            'Invalid payment information. Please check your details.';
        } else if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
          navigate('/login', { state: { from: `/payment/${eventId}` } });
          return;
        } else if (error.response.status === 402) {
          errorMessage = 'Payment declined. Please check your card details or try another payment method.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const formatCardNumberInput = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .slice(0, 19);
  };

  const formatExpirationDate = (value) => {
    return value
      .replace(/^([1-9]\/|[2-9])$/g, '0$1/') // Handle 3/ > 03/
      .replace(/^(0[1-9]|1[0-2])$/g, '$1/') // Handle 11 > 11/
      .replace(/^([0-1])([3-9])$/g, '0$1/$2') // Handle 13 > 01/3
      .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2') // Handle 1123 > 11/23
      .replace(/^([0]+)\/|[0]+$/g, '0') // Handle 0/ > 0
      .replace(/[^\d\/]|^[\/]*$/g, '') // Remove non-digits and leading slashes
      .replace(/\/\//g, '/') // Prevent double slashes
      .slice(0, 5); // Limit to MM/YY format
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    } else {
      setErrorMessage('Invalid event link. Please check the URL.');
      setIsLoading(false);
    }
  }, [eventId]);

  if (isLoading) {
    return <Loading />;
  }

  if (errorMessage) {
    return (
      <Box sx={{ padding: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {errorMessage}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/events')}
          sx={{ marginTop: 2 }}
        >
          Browse Available Events
        </Button>
      </Box>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ marginBottom: 2 }}
        >
          Back to Event
        </Button>
        
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            marginBottom: 4, 
            fontWeight: 700,
            color: theme.palette.primary.main,
          }}
        >
          Complete Your Payment
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
              {paymentSuccess ? (
                <Box textAlign="center">
                  <Alert 
                    severity="success" 
                    sx={{ 
                      marginBottom: 3,
                      backgroundColor: theme.palette.success.light,
                    }}
                    icon={<ScheduleIcon fontSize="inherit" />}
                  >
                    Payment successful! You will be redirected to your schedule.
                  </Alert>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Preparing your event schedule...
                  </Typography>
                  <CircularProgress sx={{ marginTop: 2 }} />
                </Box>
              ) : (
                <>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      marginBottom: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LockIcon color="primary" />
                    Secure Payment Details
                  </Typography>
                  <Divider sx={{ marginBottom: 3 }} />
                  
                  {errorMessage && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        marginBottom: 3,
                        backgroundColor: theme.palette.error.light,
                      }}
                    >
                      {errorMessage}
                    </Alert>
                  )}
                  
                  <Box 
                    component="form" 
                    onSubmit={handlePaymentSubmission}
                    sx={{ marginTop: 2 }}
                  >
                    <TextField
                      fullWidth
                      label="Card Number"
                      value={formatCardNumberInput(cardNumber)}
                      onChange={(event) => 
                        setCardNumber(event.target.value.replace(/\s/g, ''))
                      }
                      placeholder="4242 4242 4242 4242"
                      margin="normal"
                      error={Boolean(formErrors.cardNumber)}
                      helperText={formErrors.cardNumber}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCardIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        maxLength: 19,
                      }}
                      sx={{ marginBottom: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Expiration Date (MM/YY)"
                      value={formatExpirationDate(expirationDate)}
                      onChange={(event) => 
                        setExpirationDate(event.target.value)
                      }
                      placeholder="MM/YY"
                      margin="normal"
                      error={Boolean(formErrors.expirationDate)}
                      helperText={formErrors.expirationDate}
                      sx={{ marginBottom: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Security Code (CVV)"
                      value={securityCode}
                      onChange={(event) => 
                        setSecurityCode(event.target.value.replace(/\D/g, '').slice(0, 4))
                      }
                      placeholder="123"
                      margin="normal"
                      error={Boolean(formErrors.securityCode)}
                      helperText={formErrors.securityCode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      type="password"
                      sx={{ marginBottom: 3 }}
                    />
                    
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ 
                        marginTop: 2,
                        paddingY: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        }
                      }}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <>
                          <CircularProgress 
                            size={24} 
                            sx={{ marginRight: 1, color: 'white' }} 
                          />
                          Processing Payment...
                        </>
                      ) : (
                        `Pay EGP ${event.price}`
                      )}
                    </Button>
                    
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        display: 'block', 
                        marginTop: 2,
                        textAlign: 'center',
                      }}
                    >
                      <LockIcon sx={{ fontSize: 14, verticalAlign: 'middle', marginRight: 0.5 }} />
                      Your payment information is encrypted and secure
                    </Typography>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={3} 
              sx={{ 
                padding: 3, 
                height: '100%',
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  marginBottom: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <EventIcon color="primary" />
                Order Summary
              </Typography>
              <Divider sx={{ marginBottom: 3 }} />
              
              <Card 
                sx={{ 
                  marginBottom: 3,
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <CardContent>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    {event.name}
                  </Typography>
                  <Typography 
                    color="text.secondary" 
                    sx={{ marginBottom: 2 }}
                  >
                    Hosted by {event.host?.name || 'Private Host'}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: 1.5,
                    }}
                  >
                    <EventIcon 
                      color="primary" 
                      sx={{ marginRight: 1.5 }} 
                    />
                    <Typography>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                  
                  {event.location?.address && (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: 1.5,
                      }}
                    >
                      <LocationOnIcon 
                        color="primary" 
                        sx={{ marginRight: 1.5 }} 
                      />
                      <Typography>{event.location.address}</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
              
              <Divider sx={{ marginY: 2 }} />
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: 1.5,
                }}
              >
                <Typography variant="body1">Ticket Price:</Typography>
                <Typography variant="body1">EGP {event.price}</Typography>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: 1.5,
                }}
              >
                <Typography variant="body1">Service Fee:</Typography>
                <Typography variant="body1">EGP 0</Typography>
              </Box>
              
              <Divider sx={{ marginY: 2 }} />
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginTop: 2,
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ fontWeight: 'bold' }}
                >
                  Total Amount:
                </Typography>
                <Typography 
                  variant="h5" 
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  EGP {event.price}
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  marginTop: 3,
                  padding: 2,
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 1,
                }}
              >
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block' }}
                >
                  * This is a secure payment process. Your card details are encrypted and never stored.
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', marginTop: 1 }}
                >
                  * By completing this payment, you agree to our Terms of Service.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default PaymentPage;