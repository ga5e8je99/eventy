import React, { useState, useEffect } from 'react';
import { 
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  TextField,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EditProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: null,
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://eventplanner-production-ce6e.up.railway.app/api/auth/viewprofile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          dob: response.data.dob ? new Date(response.data.dob) : null,
          address: response.data.address || ''
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          navigate('/login');
        }
        setError(err.response?.data?.message || err.message);
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setUserData(prev => ({
      ...prev,
      dob: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError(null);
      
      const response = await axios.put(
        `https://eventplanner-production-ce6e.up.railway.app/api/auth/updateprofile/${userId}`,
        {
          name: userData.name,
          phone: userData.phone,
          dob: userData.dob,
          address: userData.address
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Failed to update profile:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton component={Link} to="/profile" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            Edit Profile
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={userData.email}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
             
              
             
              
              
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button
                variant="outlined"
                component={Link}
                to="/profile"
                sx={{ borderRadius: '20px' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={updating}
                sx={{ borderRadius: '20px' }}
                startIcon={updating ? <CircularProgress size={20} /> : <EditIcon />}
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default EditProfilePage;