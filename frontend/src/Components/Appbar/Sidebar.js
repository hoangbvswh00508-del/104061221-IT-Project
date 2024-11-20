import React, { useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link } from 'react-router-dom';

const Sidebar = ({ sidebarState, toggleSidebar }) => {
  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Order', icon: <ShoppingCartIcon />, link: '/order' },
    { text: 'Analytics', icon: <AnalyticsIcon />, link: '/analytics' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
    { text: 'Role', icon: <AdminPanelSettingsIcon />, link: '/role' },
    { text: 'Create Account', icon: <AddCircleIcon />, link: '/accountCreate' }
  ];

  const handleSidebarClose = useCallback(() => {
    if (sidebarState.left) {
      toggleSidebar(false);
    }
  }, [sidebarState.left, toggleSidebar]);

  useEffect(() => {
    console.log('Sidebar state changed:', sidebarState);
  }, [sidebarState]);

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleSidebarClose}
      onKeyDown={handleSidebarClose}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.link}
              onClick={handleSidebarClose}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={sidebarState.left}
      onClose={handleSidebarClose}
    >
      {list()}
    </Drawer>
  );
};

export default Sidebar;
