import React from 'react';
import './assets/css/App.css'; // Assurez-vous d'importer le CSS
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FooterComponent, HeaderComponent } from './components';
import {
  HomePage,
  LoginPage,
  NotFoundPage,
  SettingsPage,
  SignUpPage,
  UserPage,
  StockPage,
  SymbolDetailPage,
  WalletPage,
  NewsPage
} from './pages';
import { NotificationProvider, UserProvider } from './contexts';

function App() {
  return (
    <Router>
      <UserProvider>
        <HeaderComponent />
        <NotificationProvider>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/stocks" element={<StockPage />} />
            <Route path="/stocks/:symbol" element={<SymbolDetailPage />} />
            <Route path="/logout" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signUp" element={<SignUpPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NotificationProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
