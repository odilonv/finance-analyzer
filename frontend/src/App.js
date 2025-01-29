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
  NewsPage
} from './pages';
import { NotificationProvider, UserProvider } from './contexts';

function App() {
  return (
    <Router>
      <UserProvider>
        <HeaderComponent />
        <NotificationProvider>
          <div className="App">
            <div className="main-content">
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
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            <FooterComponent />
          </div>
        </NotificationProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
