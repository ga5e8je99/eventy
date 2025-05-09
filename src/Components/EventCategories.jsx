import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Material UI Icons
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BuildIcon from '@mui/icons-material/Build';
import PaletteIcon from '@mui/icons-material/Palette';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MovieIcon from '@mui/icons-material/Movie';
import FestivalIcon from '@mui/icons-material/Festival';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CreateIcon from '@mui/icons-material/Create';

const categories = [
  { id: 1, name: 'Music Concerts', icon: <MusicNoteIcon /> },
  { id: 2, name: 'Conferences', icon: <BusinessCenterIcon /> },
  { id: 3, name: 'Workshops', icon: <BuildIcon /> },
  { id: 4, name: 'Art Exhibitions', icon: <PaletteIcon /> },
  { id: 5, name: 'Sports Events', icon: <SportsSoccerIcon /> },
  { id: 6, name: 'Culinary Events', icon: <RestaurantIcon /> },
  { id: 7, name: 'Film Screenings', icon: <MovieIcon /> },
  { id: 8, name: 'Festivals', icon: <FestivalIcon /> },
  { id: 9, name: 'Cultural Seminars', icon: <MenuBookIcon /> },
  { id: 10, name: 'Book Signings', icon: <CreateIcon /> }
];

function SampleNextArrow(props) {
  const { onClick } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        right: { xs: '-8px', sm: '-12px', md: '-20px' },
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        backgroundColor: '#03235A',
        color: 'white',
        width: { xs: 28, sm: 32, md: 40 },
        height: { xs: 28, sm: 32, md: 40 },
        '&:hover': {
          backgroundColor: '#021d47',
          transform: 'translateY(-50%) scale(1.05)'
        },
        transition: 'all 0.2s ease',
        boxShadow: 1,
        display: isMobile ? 'none' : 'flex'
      }}
    >
      <KeyboardArrowRight fontSize={isMobile ? 'small' : 'medium'} />
    </IconButton>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: { xs: '-8px', sm: '-12px', md: '-20px' },
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        backgroundColor: '#03235A',
        color: 'white',
        width: { xs: 28, sm: 32, md: 40 },
        height: { xs: 28, sm: 32, md: 40 },
        '&:hover': {
          backgroundColor: '#021d47',
          transform: 'translateY(-50%) scale(1.05)'
        },
        transition: 'all 0.2s ease',
        boxShadow: 1,
        display: isMobile ? 'none' : 'flex'
      }}
    >
      <KeyboardArrowLeft fontSize={isMobile ? 'small' : 'medium'} />
    </IconButton>
  );
}

export default function EventCategoriesSlider() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    arrows: !isSmallScreen,
    autoplay: true,
    autoplaySpeed: 3000, // 3 seconds between slides
    pauseOnHover: true,
    responsive: [
      { 
        breakpoint: 1200, 
        settings: { 
          slidesToShow: 4,
          dots: true
        } 
      },
      { 
        breakpoint: 900, 
        settings: { 
          slidesToShow: 3,
          dots: true
        } 
      },
      { 
        breakpoint: 600, 
        settings: { 
          slidesToShow: 2,
          dots: true,
          arrows: false,
          autoplaySpeed: 4000
        } 
      },
      { 
        breakpoint: 400, 
        settings: { 
          slidesToShow: 1,
          dots: true,
          arrows: false,
          autoplaySpeed: 5000
        } 
      }
    ]
  };

  return (
    <Box sx={{ 
      px: { xs: 1, sm: 3, md: 6 },
      py: { xs: 4, md: 6 },
      backgroundColor: '#f5f7fa',
      position: 'relative'
    }}>
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          mb: { xs: 3, md: 4 },
          textAlign: 'center',
          fontWeight: 600,
          color: '#03235A',
          fontSize: { xs: '1.4rem', sm: '1.6rem', md: '2rem' }
        }}
      >
        Browse Events by Category
      </Typography>
      
      <Box sx={{ 
        position: 'relative',
        maxWidth: '1300px',
        margin: '0 auto',
        px: { xs: 0.5, sm: 2 }
      }}>
        <Slider {...settings}>
          {categories.map((category) => (
            <Box key={category.id} sx={{ px: { xs: 0.5, sm: 1 }, py: 0.5 }}>
              <Card sx={{ 
                height: { xs: '100px', sm: '120px', md: '140px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                px: { xs: 1, sm: 2 },
                borderRadius: { xs: '10px', md: '12px' },
                boxShadow: 1,
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                '&:hover': {
                  transform: { xs: 'translateY(-3px)', md: 'translateY(-5px)' },
                  boxShadow: 3
                }
              }}>
                <Box sx={{
                  width: { xs: '44px', sm: '52px', md: '60px' },
                  height: { xs: '44px', sm: '52px', md: '60px' },
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg,rgba(14, 55, 124),#A00651)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: { xs: 1, md: 1.5 }
                }}>
                  {React.cloneElement(category.icon, {
                    sx: { 
                      color: 'white', 
                      fontSize: { xs: '22px', sm: '26px', md: '30px' } 
                    }
                  })}
                </Box>
                <Typography 
                  variant="subtitle1" 
                  component="div"
                  sx={{ 
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                    textAlign: 'center',
                    lineHeight: 1.2,
                    px: 0.5
                  }}
                >
                  {category.name}
                </Typography>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}