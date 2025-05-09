import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import StarIcon from '@mui/icons-material/Star';

const Statistics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const statsData = [
    {
      id: 1,
      value: 1250,
      title: 'Events Held',
      icon: <EventAvailableIcon fontSize="large" />,
      color: 'white'
    },
    {
      id: 2,
      value: 85000,
      title: 'Participants',
      icon: <GroupsIcon fontSize="large" />,
      color: 'white'
    },
    {
      id: 3,
      value: 320,
      title: 'Award Winners',
      icon: <EmojiEventsIcon fontSize="large" />,
      color: 'white'
    },
    {
      id: 4,
      value: 98,
      title: 'Satisfaction Rate',
      suffix: '%',
      icon: <StarIcon fontSize="large" />,
      color: 'white'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const Counter = ({ end, suffix = '' }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      const duration = 2000;
      const increment = end / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [end]);

    return (
      <Typography variant="h3" sx={{ 
        fontWeight: 700,
        mb: 1,
        color: theme.palette.text.primary,
        fontSize: { xs: '2rem', sm: '2.5rem' }
      }}>
        {count.toLocaleString()}{suffix}
      </Typography>
    );
  };

  return (
    <Box sx={{
      px: { xs: 2, sm: 4, md: 8 },
      py: { xs: 4, md: 6 },
      backgroundColor: theme.palette.background.default,
      position: 'relative'
    }}>
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          mb: { xs: 3, md: 5 },
          textAlign: 'center',
          fontWeight: 700,
          color: theme.palette.text.primary,
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
        }}
      >
        Our Impact in Numbers
      </Typography>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: theme.spacing(3),
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        {statsData.map((stat) => (
          <motion.div key={stat.id} variants={itemVariants}>
            <Box sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '12px',
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: theme.shadows[2],
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[6]
              }
            }}>
              <Box sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: `linear-gradient(45deg,rgba(14, 55, 124),#A00651)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                color: stat.color
              }}>
                {stat.icon}
              </Box>
              <Counter end={stat.value} suffix={stat.suffix || ''} />
              <Typography variant="h6" sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 500,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}>
                {stat.title}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </motion.div>
    </Box>
  );
};

export default Statistics;