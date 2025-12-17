import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

import { useContext } from "react";
import { CheckToken } from "../Contexts/CheckToken";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Background from "../assets/Image/Home/slider2.jpg";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
export default function Create() {
  const { t } = useTranslation("create");
  const isTokenValid = useContext(CheckToken);
  const theme = useTheme();
  if (isTokenValid) {
    return (
      <>
        <NavBar active={'Create'}/>
        <Box
          sx={{
            height: "90vh",
            display: "flex",
            flex: "center center",
            backgroundImage: `
  linear-gradient(
    to bottom,
    transparent,
    ${
      theme.palette.mode === "dark"
        ? theme.palette.primary.light
        : theme.palette.primary.main
    }
  ),
  url(${Background})
`,
            backgroundSize: "cover",
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "20px",
              alignItems: "center",
              textAlign: "center",
              color: theme.palette.mode === "dark" ? "black" : "white",
            }}
          >
            <Typography variant="h3" fontSize={40}>
              {t("createTitle")}
            </Typography>

            <Typography variant="body1" sx={{ maxWidth: "650px", mt: 1 }}>
              {t("createDescription")}
              
            </Typography>
            <Button
              LinkComponent={Link}
              variant="contained"
              sx={{
                background:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                borderRadius: 24,
                padding: "10px 20px",
              }}
              to={"/create/createSteps"}
            >
              {t("startNow")}
            </Button>
          </Container>
        </Box>

        <Footer />
        
      </>
    );
  } else {
    return (
      <>
        <NavBar />

        <Box
          sx={{
            width: "100%",
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
           
            px: 2,
          }}
        >
          <Box
            sx={{
              background: theme.palette.mode === "dark" ? "#121212" : "#fefefe",
              p: 4,
              borderRadius: 4,
              boxShadow: 4,
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: theme.palette.mode === "dark" ? "#e2e8f0" : "#1e293b",
              }}
            >
              {t("loginRequiredTitle")}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
              {t("loginRequiredDesc")}
            </Typography>

            <Button
              variant="contained"
              component={Link}
              to="/login"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                borderRadius: 3,
              }}
            >
              {t("login")}
            </Button>
          </Box>
        </Box>

        <Footer />
      </>
    );
  }
}
