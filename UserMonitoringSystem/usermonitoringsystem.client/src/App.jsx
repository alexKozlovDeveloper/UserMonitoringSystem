import './App.css';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import ProfilePage from './components/pages/ProfilePage';
import WeatherForecastPage from './components/pages/WeatherForecastPage';
import UsersPage from './components/pages/UsersPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import NotFoundPage from './components/pages/NotFoundPage';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<WeatherForecastPage />} />
                    <Route path="/profile" element={<ProfilePage />} />                   
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;