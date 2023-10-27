import React, { useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link} from 'react-router-dom';

import {getUserName} from '../utils/auth';
import LogoutButton from '../components/Structure/LogoutButton';
import Logo from '../components/Structure/Logo';
import ListItemButton from '@mui/material/ListItemButton';


const ParentNav = () => {


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userName = getUserName();


  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsSidebarOpen(open);
  };

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem>
      {userName}님, 안녕하세요
      </ListItem>
        <ListItem>
          <ListItemButton component={Link} to="/parent">
            <ListItemText primary="예약 정보" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component={Link} to="/update-child">
            <ListItemText primary="등록학생정보" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component={Link} to="/update-details">
            <ListItemText primary="내 정보" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start'  }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Logo />
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <LogoutButton />
          </Box>
        </Toolbar>
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          onClose={toggleDrawer(false)}
          
        >
          {list()}
        </Drawer>
      </AppBar>
    </Box>
  );
};

export default ParentNav;