import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme } from "@mui/material/styles";
function ScrollTop(props) {
  const { children } = props;
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );
    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}
      >
        {children || (
          <Fab color={theme.palette.mode === "dark" ? theme.palette.primary.light : "primary"} size="medium" aria-label="scroll back to top">
            <KeyboardArrowDownIcon sx={{ transform: "rotate(180deg)" }} />
          </Fab>
        )}
      </Box>
    </Zoom>
  );
}

export default ScrollTop;