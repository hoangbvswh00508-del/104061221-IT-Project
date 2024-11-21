import React, { useState, useEffect, useCallback } from 'react';
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
import WifiIcon from '@mui/icons-material/Wifi';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link } from 'react-router-dom';

const Sidebar = ({ sidebarState, toggleSidebar }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-user-data', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log('Fetched user data:', data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  const handleSidebarClose = useCallback(() => {
    if (sidebarState.left) {
      toggleSidebar(false);
    }
  }, [sidebarState.left, toggleSidebar]);

  if (!user) {
    return <div>Loading...</div>;
  }

  console.log('User object:', user);
  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  ];

  if (user.verify) {
    console.log('User verified:', user.role);
    if (user.role === 'Super Admin' || user.role === 'Admin') {
      menuItems.push(
        { text: 'Network', icon: <WifiIcon />, link: '/network' },
        { text: 'Office List', icon: <ApartmentIcon />, link: '/officeList' },
        { text: 'Finance analytics', icon: <AnalyticsIcon />, link: '/analytics' },
        { text: 'Role', icon: <AdminPanelSettingsIcon />, link: '/role' },
        { text: 'Create Account', icon: <AddCircleIcon />, link: '/accountCreate' }
      );
    }

    if (user.role === 'Finance Admin') {
      menuItems.push(
        { text: 'Office List', icon: <ApartmentIcon />, link: '/officeList' },
        { text: 'Finance analytics', icon: <AnalyticsIcon />, link: '/analytics' }
      );
    }

    if (user.role === 'Network Admin') {
      menuItems.push(
        { text: 'Network', icon: <WifiIcon />, link: '/network' }
      );
    }

    if (user.role === 'Production Admin') {
      menuItems.push(
        { text: 'Office List', icon: <ApartmentIcon />, link: '/officeList' }
      );
    }
  }

  console.log('Menu items:', menuItems);

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
