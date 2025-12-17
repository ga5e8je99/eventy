import  { useState , useRef, useContext } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import Location from "../Components/Location";
import { LocationContext } from "../Contexts/LocationContect";
export default function CreateSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [open, setOpen] = useState(false);
  const locationContext = useContext(LocationContext) || {};
  const location = locationContext.location ;
  const [dateForm, setDataForm] = useState({
    name: "",
    description: "",
    category: "",
    customCategory: "",
    type: "",
    isRecurring: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: {
      address: location.address || "",
      latitude: location.latitude || "",
      longitude: location.longitude || "",
    },
    city: location.governorate || "",
    coverImage: "",
    images: [],
    ticketPrice: null,
    ticketTiers: [{ tierName: "", price: null }],
    capacity: null,
    isPublic: true,
    hostCompany: "",
  });

  const steps = ["", "", "", "", ""];
  const fileUploadStyles = {
    uploadArea: {
      border: "2px dashed #ccc",
      borderRadius: "8px",
      padding: "40px 20px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.04)",
      },
    },
  };
  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setDataForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setDataForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
    const ImageUploadButton = ({ type, multiple = false, onUpload }) => {
    const fileInputRef = useRef(null);
    
    return (
      <>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          {type === 'cover' ? 'Upload Cover Image' : 'Upload Images'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            hidden
            onChange={(e) => onUpload(type, e.target.files)}
          />
        </Button>
      </>
    );
  };
  const handleAddTicketTier = () => {
    const newTier = {
      tierName: `Tier ${dateForm.ticketTiers.length + 1}`,
      price: 0,
    };
    setDataForm((prev) => ({
      ...prev,
      ticketTiers: [...prev.ticketTiers, newTier],
    }));
  };

  const handleRemoveTicketTier = (index) => {
    if (dateForm.ticketTiers.length > 1) {
      setDataForm((prev) => ({
        ...prev,
        ticketTiers: prev.ticketTiers.filter((_, i) => i !== index),
      }));
    }
  };

  const handleTicketTierChange = (index, field, value) => {
    const updatedTiers = [...dateForm.ticketTiers];
    updatedTiers[index][field] = value;
    setDataForm((prev) => ({
      ...prev,
      ticketTiers: updatedTiers,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSend = async () => {
    setLoading(true);
    setResponseData(null);
    setErrorMsg("");

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const url = `${apiBase}/eventy/events`;
      const token = localStorage.getItem("token") || "";

      const res = await axios.post(url, dateForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setResponseData(res.data.message || "Event created successfully!");
      
      setOpen(true);
      setActiveStep(0); // Reset to first step after success
    } catch (err) {
      console.error("Create event error:", err?.response || err.message || err);
      const serverMsg = err?.response?.data || err?.message || "Request failed";
      setErrorMsg(
        typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg)
      );
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpen(false);
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Basic Information
            </Typography>
            <TextField
              label="Event Name"
              value={dateForm.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              value={dateForm.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              select
              label="Category"
              value={dateForm.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Music">Music</MenuItem>
              <MenuItem value="Tech">Tech</MenuItem>
              <MenuItem value="Arts">Arts & Culture</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            {dateForm.category === "Other" && (
              <TextField
                label="Custom Category"
                value={dateForm.customCategory}
                onChange={(e) =>
                  handleInputChange("customCategory", e.target.value)
                }
                variant="outlined"
                fullWidth
                margin="normal"
                required
              />
            )}
            <TextField
              select
              label="Event Type"
              value={dateForm.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="Offline">Offline</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </TextField>
          </Box>
        );

        case 1:
          return (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Event Images
              </Typography>
              
              {/* Cover Image Upload */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Cover Image *
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    This will be the main image displayed for your event
                  </Typography>
                </Typography>
                
                {dateForm.coverImage ? (
                  <Card sx={{ maxWidth: 400, mb: 2 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={dateForm.coverImage}
                      alt="Cover preview"
                      sx={{ objectFit: "cover" }}
                    />
                    <CardActions sx={{ justifyContent: "space-between" }}>
                      <Button
                        size="small"
                        startIcon={<ImageIcon />}
                        onClick={() => window.open(dateForm.coverImage, "_blank")}
                      >
                        View Full Size
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleInputChange("coverImage", "")}
                        color="error"
                      >
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                ) : (
                  <Box
                    sx={fileUploadStyles.uploadArea}
                    onClick={() => document.getElementById("cover-image-upload").click()}
                  >
                    <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      Click to upload cover image
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Recommended size: 1200x600px
                    </Typography>
                    <input
                      id="cover-image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // For production, you would upload to a server
                          // For demo, we'll create a local URL
                          const imageUrl = URL.createObjectURL(file);
                          handleInputChange("coverImage", imageUrl);
                        }
                      }}
                    />
                  </Box>
                )}
                
                
                
              </Box>
        
              {/* Additional Images */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle1">
                    Additional Images
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      Upload more images to showcase your event
                    </Typography>
                  </Typography>
                  <Button
                    startIcon={<CloudUploadIcon />}
                    variant="outlined"
                    onClick={() => document.getElementById("additional-images-upload").click()}
                    size="small"
                  >
                    Add Images
                  </Button>
                  <input
                    id="additional-images-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const newImageUrls = files.map(file => URL.createObjectURL(file));
                      handleInputChange("images", [...dateForm.images, ...newImageUrls]);
                    }}
                  />
                </Box>
        
                {/* Image Gallery Grid */}
                {dateForm.images.length > 0 ? (
                  <Grid container spacing={2}>
                    {dateForm.images.map((imageUrl, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: "100%" }}>
                          <Box sx={{ position: "relative", paddingTop: "75%" }}>
                            <CardMedia
                              component="img"
                              image={imageUrl}
                              alt={`Event image ${index + 1}`}
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                          <CardActions sx={{ justifyContent: "flex-end", p: 1 }}>
                            <Button
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                const updatedImages = [...dateForm.images];
                                updatedImages.splice(index, 1);
                                handleInputChange("images", updatedImages);
                              }}
                              color="error"
                            >
                              Remove
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 4,
                      textAlign: "center",
                      backgroundColor: "grey.50",
                      borderRadius: 2,
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      No additional images added yet
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Upload images to give attendees a better preview of your event
                    </Typography>
                  </Paper>
                )}
        
        <TextField
              label="Host Company"
              value={dateForm.hostCompany}
              onChange={(e) => handleInputChange("hostCompany", e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <FormControlLabel
              control={
                <Switch
                  checked={dateForm.isPublic}
                  onChange={(e) =>
                    handleInputChange("isPublic", e.target.checked)
                  }
                  color="primary"
                />
              }
              label="Make event public"
            />
               
              </Box>
        
              
            </Box>
          );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Location & Timing
            </Typography>
            <Grid container spacing={2}>
              
              <Grid item xs={12} md={6}>
                <Location/>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Recurrence"
                  value={dateForm.isRecurring}
                  onChange={(e) =>
                    handleInputChange("isRecurring", e.target.value)
                  }
                  variant="outlined"
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="None">One-time</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={dateForm.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={dateForm.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={dateForm.startTime}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End Time"
                  type="time"
                  value={dateForm.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Tickets & Pricing
            </Typography>
            <TextField
              label="Capacity"
              type="number"
              value={dateForm.capacity}
              onChange={(e) =>
                handleInputChange("capacity", parseInt(e.target.value) || 0)
              }
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                inputProps: { min: 1 },
              }}
              required
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Ticket Tiers
              </Typography>
              {dateForm.ticketTiers.map((tier, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    mb: 2,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                  }}
                >
                  <TextField
                    label="Tier Name"
                    value={tier.tierName}
                    onChange={(e) =>
                      handleTicketTierChange(index, "tierName", e.target.value)
                    }
                    variant="outlined"
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    label="Price"
                    type="number"
                    value={tier.price}
                    onChange={(e) =>
                      handleTicketTierChange(
                        index,
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    variant="outlined"
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                      inputProps: { min: 0, step: 0.01 },
                    }}
                  />
                  {dateForm.ticketTiers.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveTicketTier(index)}
                      color="error"
                    >
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddTicketTier}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Tier
              </Button>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Review Event Details
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.50" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Event Name
                  </Typography>
                  <Typography variant="body1">{dateForm.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">{dateForm.category}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">{dateForm.type}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1">
                    {dateForm.startDate} {dateForm.startTime} -{" "}
                    {dateForm.endDate} {dateForm.endTime}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {dateForm.location.address}, {dateForm.city}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Capacity
                  </Typography>
                  <Typography variant="body1">{dateForm.capacity}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Visibility
                  </Typography>
                  <Typography variant="body1">
                    {dateForm.isPublic ? "Public" : "Private"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ticket Tiers
                  </Typography>
                  {dateForm.ticketTiers.map((tier, index) => (
                    <Typography key={index} variant="body1">
                      {tier.tierName}: ${tier.price}
                    </Typography>
                  ))}
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Create New Event
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Fill in the details to create your event in 5 simple steps
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={2} sx={{ p: 3 }}>
        {renderStepContent(activeStep)}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Creating..." : "Create Event"}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={errorMsg ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {errorMsg ? `Error: ${errorMsg}` : responseData}
        </Alert>
      </Snackbar>
    </Container>
  );
}
