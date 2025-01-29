import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../Button/ButtonComponent';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { UserContext } from '../../contexts';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import { IconButton } from '@mui/material';

function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

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

  const handleStocksClick = () => {
    navigate('/stocks');
  };

  const handleUserPageClick = () => {
    navigate('/user');
  };

  const handleFinanceAnalyzer = () => {
    navigate('/');
  };

  const handleLogoutClick = async () => {
    try {
      const response = await fetch('http://localhost:5001/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        navigate('/');
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <header>
      <nav className='app-header'>
        <span onClick={handleFinanceAnalyzer} id='logo-header'>
          <SpaceDashboardRoundedIcon style={{ color: 'var(--main-color)', transform: 'rotate(180deg)', fontSize: '2rem' }} />
        </span>
        <div>
          <div className='app-header-buttons'>
            {user ? (
              <>
                <IconButton onClick={handleUserPageClick} style={{
                  color: 'var(--main-color)'
                }}>
                  <PersonRoundedIcon style={{ fontSize: '2rem' }} />
                </IconButton>
              </>
            ) : (
              <ButtonComponent text="Connexion" textColor='var(--white)' color='var(--black)'
                href='/user' />
            )}
          </div>
        </div>
      </nav>
    </header >
  );
}

export default Header;
