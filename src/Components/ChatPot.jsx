import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Paper,
  useMediaQuery,
  CircularProgress,
  Avatar,
  Badge,
  Tooltip,
  Zoom,
  Fade,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SmartToy from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useRef } from "react";
import "./chat.css"; // Import the CSS file

export default function ChatBot() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [position, setPosition] = useState(
    isMobile ? "calc(-100% + 60px)" : "-23%"
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I assist you with your event planning today?",
      sender: "bot",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [hoverOpen, setHoverOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const messagesEndRef = useRef(null);
  const chatButtonRef = useRef(null);
  const notificationInterval = useRef(null);

  const tips = [
    "Need help planning your event? I'm here to help!",
    "Ask me about venues, catering, or decoration ideas!",
    "I can suggest creative themes for your event!",
    "Get instant answers to your event planning questions!",
    "Struggling with planning? Let me assist you!",
  ];

  useEffect(() => {
    notificationInterval.current = setInterval(() => {
      if (!notificationOpen && position !== "0") {
        setNotificationMessage(tips[Math.floor(Math.random() * tips.length)]);
        setNotificationOpen(true);

        setTimeout(() => {
          setNotificationOpen(false);
        }, 3000);
      }
    }, 15000);

    return () => clearInterval(notificationInterval.current);
  }, [notificationOpen, position]);

  useEffect(() => {
    setPosition(isMobile ? "calc(-100% + 60px)" : "-23%");
  }, [isMobile]);

  useEffect(() => {
    scrollToBottom();
    if (position !== "0" && messages.length > 1) {
      setUnreadMessages((prev) => prev + 1);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setPosition((prev) => {
      const isOpening = prev !== "0";
      const newPosition = isOpening
        ? "0"
        : isMobile
        ? "calc(-100% + 60px)"
        : "-23%";

      if (isOpening) {
        setNotificationMessage(tips[Math.floor(Math.random() * tips.length)]);
        setNotificationOpen(true);
        setUnreadMessages(0);
      }

      return newPosition;
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://eventplanner-production-ce6e.up.railway.app/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          text: data.response || "I'm here to help with your event planning!",
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Interface */}
      <Box
        className={`chat-interface ${
          position === "0" ? (isMobile ? "open-mobile" : "open") : ""
        }`}
        sx={{
          width: "500px",
          display: "flex",
          gap: "50px",
        }}
      >
        {/* Chat Button with Badge */}
        <Badge
          badgeContent={unreadMessages}
          color="error"
          overlap="circular"
          sx={{
            "& .MuiBadge-badge": {
              animation: unreadMessages > 0 ? "pulse 1.5s infinite" : "none",
            },
          }}
        >
          <Tooltip
            title="Event Planning Assistant"
            placement="right"
            TransitionComponent={Zoom}
          >
            <IconButton
              className={`chat-button ${position === "0" ? "open" : ""}`}
              onClick={toggleChat}
              onMouseEnter={() => {
                setHoverOpen(true);
                setNotificationMessage(
                  tips[Math.floor(Math.random() * tips.length)]
                );
              }}
              onMouseLeave={() => setHoverOpen(false)}
              aria-label="Toggle chat"
            >
              {position === "0" ? (
                <CloseIcon />
              ) : (
                <SmartToy sx={{ fontSize: "1.8rem" }} />
              )}
            </IconButton>
          </Tooltip>
        </Badge>

        {/* Notification Bubble */}
        <Fade in={notificationOpen || hoverOpen} timeout={300}>
          <div ref={chatButtonRef} className="notification-bubble">
            <Avatar
              className="chat-header-avatar "
              sx={{ background: "linear-gradient(45deg, #114084, #A00651)" }}
            >
              <SmartToy sx={{ fontSize: "1rem" }} />
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {notificationMessage}
            </Typography>
          </div>
        </Fade>

        {/* Chat Window */}
        <Paper className="chat-window" sx={{flexGrow:552}}>
          {/* Chat Header */}
          <Box className="chat-header">
            <Box className="chat-header-content">
              <Avatar className="chat-header-avatar">
                <SmartToy />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Event Planning Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {loading ? (
                    <Box
                      component="span"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          animation: "typing 1.5s infinite",
                          "&:nth-of-type(2)": { animationDelay: "0.2s" },
                          "&:nth-of-type(3)": { animationDelay: "0.4s" },
                        }}
                      >
                        •
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          animation: "typing 1.5s infinite",
                          animationDelay: "0.2s",
                        }}
                      >
                        •
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          animation: "typing 1.5s infinite",
                          animationDelay: "0.4s",
                        }}
                      >
                        •
                      </Box>
                    </Box>
                  ) : (
                    "Online now"
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box className="messages-area">
            {messages.length === 0 ? (
              <Box className="empty-state">
                <Avatar className="empty-state-avatar">
                  <SmartToy sx={{ fontSize: "2rem", color: "grey.600" }} />
                </Avatar>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  How can I help with your event planning?
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "grey.600" }}>
                  Ask about venues, catering, or event ideas!
                </Typography>
              </Box>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    className={`message-container ${
                      msg.sender === "bot" ? "bot" : ""
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <Avatar className="message-avatar bot">
                        <SmartToy
                          sx={{ fontSize: "1rem", color: "grey.600" }}
                        />
                      </Avatar>
                    )}
                    <Box
                      className={`message-bubble ${
                        msg.sender === "bot" ? "bot" : "user"
                      }`}
                    >
                      {msg.text}
                      <Typography
                        variant="caption"
                        className={`message-sender ${
                          msg.sender === "bot" ? "bot" : "user"
                        }`}
                      >
                        {msg.sender === "user" ? "You" : "Assistant"}
                      </Typography>
                    </Box>
                    {msg.sender === "user" && (
                      <Avatar className="message-avatar user">
                        <PersonIcon
                          sx={{
                            fontSize: "1rem",
                            color: "primary.contrastText",
                          }}
                        />
                      </Avatar>
                    )}
                  </Box>
                ))}
                {loading && (
                  <Box className="typing-indicator">
                    <Avatar className="message-avatar bot">
                      <SmartToy sx={{ fontSize: "1rem", color: "grey.600" }} />
                    </Avatar>
                    <Box className="typing-bubble">
                      <CircularProgress size={16} thickness={5} />
                      <Typography variant="body2">Typing...</Typography>
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          {/* Input Area */}
          <Box className="input-area">
            <Box className="input-container">
              <TextField
                fullWidth
                className="input"
                variant="outlined"
                size="small"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                multiline
                maxRows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.5)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    textAlign: "right",
                  },
                  "&::placeholder": {
                    color: "#000000", // <-- لون placeholder هنا
                    opacity: 1, // تأكد من أن اللون ظاهر بوضوح
                  },
                }}
              />
              <Button
                className="send-button"
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={!message.trim() || loading}
                aria-label="Send message"
              >
                <SendIcon fontSize="small" />
              </Button>
            </Box>
            <Typography className="status-text">
              Event Planning Assistant - Online now
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
