import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export default function LoadingTimer() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: " 100vh",
        margin: 0,
        background: theme.palette.mode === "dark" ? "#121212" : "#f5f5f5",
      }}
    >
      <Box
        className="clock-loader"
        sx={{
          
          border: `3px solid ${
            theme.palette.mode === "dark"
              ? theme.palette.primary.light
              : theme.palette.primary.main
          }`,
          "&::before": {
            background:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.main,
          },
          "&::after": {
            background:
              theme.palette.mode === "dark"
                ? theme.palette.secondary.light
                : theme.palette.secondary.main,
          },
        }}
      ></Box>
    </Box>
  );
}
