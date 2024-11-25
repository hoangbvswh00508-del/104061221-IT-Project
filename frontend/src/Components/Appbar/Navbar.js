import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
  Menu,
  Drawer,
  InputBase,
  MenuItem,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Sidebar from "./Sidebar"; // Make sure Sidebar component is imported
import Notification from "../pages/notification/Notification";
import Sendmsg from "../pages/notification/Sendmsg";
import axios from "axios";
import "./style.css";

// Styled components for Search
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Navbar = () => {
  const [sidebarState, setSidebarState] = useState({ left: false });
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [isSendmsgOpen, setIsSendmsgOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          return;
        }
        const response = await axios.get(
          "http://localhost:5000/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched Notifications:", response.data);

        const newNotifications = response.data.filter((msg) => msg.isNew);
        setNotifications(response.data);
        setNewMessages(newNotifications);
        setNotificationCount(newNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    async function fetchUnreadCount() {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await fetch("http://localhost:5000/notifications/unread-count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Unread notifications count:", data.unread_count);
        setUnreadCount(data.unread_count);
      } catch (error) {
        console.error("Error fetching unread notifications count:", error);
      }
    }    
    fetchUnreadCount();
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/");
  };

  const toggleSidebar = (open) => {
    if (sidebarState.left !== open) {
      setSidebarState({ left: open });
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleSendmsgOpen = () => {
    setIsSendmsgOpen(true);
  };

  const handleSendmsgClose = () => {
    setIsSendmsgOpen(false);
  };

  const addMessage = (text) => {
    const newMessage = { sender: "You", time: "Just now", text };
    setNewMessages((prev) => [newMessage, ...prev]);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id="profile-menu"
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
       <MenuItem
      onClick={() => {
        handleProfileMenuClose(); // Close the menu
        navigate("/profile");    // Navigate to Profile
      }}
    >
      Profile
    </MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderNotificationsMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      id="notifications-menu"
      open={Boolean(notificationsAnchorEl)}
      onClose={() => setNotificationsAnchorEl(null)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Box sx={{ p: 2, width: 400 }}>
        <Notification notifications={notifications} />
      </Box>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      id="mobile-menu"
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleMobileMenuClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem>
        <IconButton size="large" color="inherit" onClick={handleSendmsgOpen}>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          color="inherit"
          onClick={handleNotificationsClick}
        >
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
<Box sx={{ flexGrow: 1 }}>
  <AppBar position="static" sx={{ backgroundColor: "black" }}>
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => toggleSidebar(true)}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase placeholder="Search…" />
      </Search>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <IconButton size="large" color="inherit" onClick={handleSendmsgOpen}>
            <MailIcon />
        </IconButton>
        <IconButton size="large" color="inherit" onClick={handleNotificationsClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton size="large" edge="end" color="inherit" onClick={handleProfileMenuOpen}>
          <AccountCircle />
        </IconButton>
      </Box>
    </Toolbar>
  </AppBar>
  <Sidebar sidebarState={sidebarState} toggleSidebar={toggleSidebar} />
  {renderMobileMenu}
  {renderNotificationsMenu}
  {renderMenu}
  {isSendmsgOpen && (
    <div className="sendmsg-container">
      <button className="close-button" onClick={handleSendmsgClose}> x </button>
      <Sendmsg addMessage={addMessage} onClose={handleSendmsgClose} />
    </div>
  )}
</Box>

  );
};
export default Navbar;
