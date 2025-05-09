import {
  Box,
  Link,
  styled,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router";
import { keyframes } from "@mui/system";

// Animations
const ringAnimation = keyframes`
  from { stroke-dasharray: 0 257 0 0 1 0 0 258; }
  25% { stroke-dasharray: 0 0 0 0 257 0 258 0; }
  50%, to { stroke-dasharray: 0 0 0 0 0 515 0 0; }
`;

const ballAnimation = keyframes`
  from, 50% { animation-timing-function: ease-in; stroke-dashoffset: 1; }
  64% { animation-timing-function: ease-in; stroke-dashoffset: -109; }
  78% { animation-timing-function: ease-in; stroke-dashoffset: -145; }
  92% { animation-timing-function: ease-in; stroke-dashoffset: -157; }
  57%, 71%, 85%, 99%, to { animation-timing-function: ease-out; stroke-dashoffset: -163; }
`;

// Styled Components
const LoaderBackdrop = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
  zIndex: 9999,
  backdropFilter: 'blur(2px)',
}));

const LoaderSVG = styled("svg")({
  width: 100,
  height: 100,
});

const AnimatedRing = styled("circle")({
  animation: `${ringAnimation} 2s ease-out infinite`,
});

const AnimatedBall = styled("line")({
  animation: `${ballAnimation} 2s ease-out infinite`,
});

const LinkItem = ({
  children,
  to = '#',
  loadingTimeout = 1000,
  showLoader = true,
  replace = false,
  state,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (e) => {
    if (to === '#' || to === window.location.pathname) {
      e.preventDefault();
      return;
    }

    if (showLoader) {
      e.preventDefault();
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      navigate(to, { replace, state });
      setIsLoading(false);
    }, loadingTimeout);

    return () => clearTimeout(timer);
  }, [isLoading, loadingTimeout, navigate, replace, state, to]);

  return (
    <>
      <Link
        component={RouterLink}
        to={to}
        onClick={handleNavigation}
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          '&:hover': { textDecoration: 'underline' },
          ...props.sx,
        }}
        {...props}
      >
        {children}
      </Link>

      {isLoading && showLoader && (
        <LoaderBackdrop>
          <LoaderSVG viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
                <stop offset="0%" stopColor="#A00651" />
                <stop offset="100%" stopColor="#03235A" />
              </linearGradient>
              <linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A00651" />
                <stop offset="100%" stopColor="#03235A" />
              </linearGradient>
            </defs>
            <AnimatedRing
              cx="100"
              cy="100"
              r="82"
              fill="none"
              stroke="url(#pl-grad1)"
              strokeWidth="36"
              strokeDasharray="0 257 1 257"
              strokeDashoffset="0.01"
              strokeLinecap="round"
              transform="rotate(-90,100,100)"
            />
            <AnimatedBall
              stroke="url(#pl-grad2)"
              x1="100"
              y1="18"
              x2="100.01"
              y2="182"
              strokeWidth="36"
              strokeDasharray="1 165"
              strokeLinecap="round"
            />
          </LoaderSVG>
        </LoaderBackdrop>
      )}
    </>
  );
};

export default LinkItem;