import {
  Grid,
  Typography,
  Button,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import "../App.css";

export default function NavDescription() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const textVariants = {
    hidden: { opacity: 0, y: 20 }, 
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1, 
        ease: [0.16, 0.77, 0.47, 0.97], 
        staggerChildren: 0.1, 
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 }, 
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5, 
        duration: 0.7,
        ease: [0.16, 0.77, 0.47, 0.97],
        type: "spring", 
        damping: 6, 
        stiffness: 100, 
      },
    },
  };

  return (
    <Container fixed>
      <Grid
        container
        justifyContent={isSmallScreen ? "center" : "left"}
        alignItems="center"
        style={{ height: "90vh", width: "100%" }}
      >
        <Grid item xs={12} lg={8}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={textVariants}
            viewport={{ once: true, amount: 0.3 }} 
          >
            <Typography
              variant="h2"
              style={{ fontWeight: "bolder" }}
              className="navbar-text-content"
              align={isSmallScreen ? "center" : "left"}
            >
              Join events nearby you easily and discover new events
            </Typography>
          </motion.div>

          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: isSmallScreen ? "center" : "left",
              marginTop: "40px",
            }}
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={buttonVariants}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.05 }} // إضافة حركة hover ناعمة
              whileTap={{ scale: 0.98 }} // إضافة حركة عند الضغط
            >
              <Button
                variant="contained"
                className="get-start-button"
                style={{
                  background: "#A00651",
                  color: "white",
                  fontWeight: 600,
                  transition: "all ease-in 0.3s",
                  borderRadius: "24px",
                  padding: "10px 20px",
                }}
                
                
              >
                Get started
              </Button>
            </motion.div>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
