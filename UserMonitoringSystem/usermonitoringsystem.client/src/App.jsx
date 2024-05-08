import './App.css';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import HomePage from './components/pages/HomePage';
import ProfilePage from './components/pages/ProfilePage';
import WeatherForecast from './components/pages/WeatherForecast';
import UsersMonitoringPage from './components/pages/UsersMonitoringPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import NotFoundPage from './components/pages/NotFoundPage';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/weatherforecast" element={<WeatherForecast />} />
                    <Route path="/usersmonitoring" element={<UsersMonitoringPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;