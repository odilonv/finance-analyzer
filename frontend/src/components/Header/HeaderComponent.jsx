import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts';
import { IconButton } from '@mui/material';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5001/users/session', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    checkSession();
  }, [setUser]);

  const navButtons = [
    { icon: <SpaceDashboardRoundedIcon />, path: '/' },
    { icon: <ArticleRoundedIcon />, path: '/news' },
    { icon: <ShowChartRoundedIcon />, path: '/stocks' },
  ];

  if (user) {
    navButtons.push({ icon: <AccountBalanceWalletRoundedIcon />, path: '/wallet' });
  } else {
    navButtons.push({ icon: <PersonRoundedIcon />, path: '/user' });
  }

  if (user) {
    navButtons.push({ icon: <PersonRoundedIcon />, path: '/user' });
  }

  return (
    <header style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
      <nav className='app-header' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        {navButtons.map((button, index) => (
          <IconButton
            key={index}
            onClick={() => { navigate(button.path); setActiveButton(button.path); }}
            style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              color: activeButton === button.path ? 'var(--main-darker-color)' : 'var(--main-color)'
            }}>
            {button.icon}
          </IconButton>
        ))}
      </nav>
    </header>
  );
}

export default Header;
