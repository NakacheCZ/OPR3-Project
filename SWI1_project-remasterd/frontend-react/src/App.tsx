import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import FullCaliberPage from './components/FullCaliberPage';
import SubCaliberPage from './components/SubCaliberPage';
import HighExplosivePage from './components/HighExplosivePage';
import InfoPage from './components/InfoPage';
import ShellPresets from './components/ShellPresets';
import 'bootstrap/dist/css/bootstrap.min.css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { jwtDecode } from 'jwt-decode';
import api from './api';

function MainPage() {
    const navigate = useNavigate();

    const handleFullCaliberClick = () => {
        navigate('/full-caliber');
    };

    const handleSubCaliberClick = () => {
        navigate('/sub-caliber');
    };

    const handleHighExplosiveClick = () => {
        navigate('/high-explosive');
    };

    const handleInfoClick = () => {
        navigate('/info');
    };

    const handleShellsClick = () => {
        navigate('/shells');
    };

    function AmmoButton({ image, icon, label, onClick }: { image?: string; icon?: React.ReactNode; label: string; onClick: () => void }) {
    return (
        <button onClick={onClick} className="ammo-button flex flex-col items-center mx-4">
            {icon ? (
                <span style={{ fontSize: 48, marginBottom: 8 }}>{icon}</span>
            ) : (
                <img src={image} alt={label} className="w-16 h-16 mb-2" />
            )}
            <span>{label}</span>
        </button>
    );
}

    return (
        <div className="button-bar bg-gray-800 rounded-lg shadow-lg flex flex-col items-center py-16 px-8 w-full max-w-md mb-8 min-h-[350px]">
            <div className="button-row flex justify-center w-full mb-8">
                <AmmoButton
                    image="Images/FullCaliber.png"
                    label="Full Caliber"
                    onClick={handleFullCaliberClick}
                />
                <AmmoButton
                    image="Images/SubCaliber.png"
                    label="Sub Caliber"
                    onClick={handleSubCaliberClick}
                />
                <AmmoButton
                    image="Images/HighExplosive.png"
                    label="High Explosive"
                    onClick={handleHighExplosiveClick}
                />
            </div>
            <div className="button-row-single flex justify-center w-full">
                <AmmoButton
                    icon={<InfoOutlinedIcon style={{ fontSize: 48 }} />}
                    label="Info"
                    onClick={handleInfoClick}
                />
                <AmmoButton
                    icon={<ListAltOutlinedIcon style={{ fontSize: 48 }} />}
                    label="Presets"
                    onClick={handleShellsClick}
                />
            </div>
        </div>
    );
}

export default function App() {
    const [username, setUsername] = useState<string | undefined>(undefined);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken: { sub: string } = jwtDecode(token);
                setUsername(decodedToken.sub);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token'); // Clear invalid token
                loginAsGuest();
            }
        } else {
            loginAsGuest();
        }
    }, []);

    const loginAsGuest = async () => {
        try {
            const response = await api.post<{ token: string }>('http://localhost:8080/api/auth/signin', { username: 'guest', password: 'guest' });
            localStorage.setItem('token', response.token);
            const decodedToken: { sub: string } = jwtDecode(response.token);
            setUsername(decodedToken.sub);
        } catch (error) {
            console.error("Failed to log in as guest:", error);
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout username={username}><MainPage /></Layout>} />
                <Route path="/full-caliber" element={<Layout title="Full Caliber" username={username}><FullCaliberPage /></Layout>} />
                <Route path="/sub-caliber" element={<Layout title="Sub Caliber" username={username}><SubCaliberPage /></Layout>} />
                <Route path="/high-explosive" element={<Layout title="High Explosive" username={username}><HighExplosivePage /></Layout>} />
                <Route path="/info" element={<Layout title="Info" username={username}><InfoPage /></Layout>} />
                <Route path="/shells" element={<Layout title="Presets" username={username}><ShellPresets username={username} /></Layout>} />
                <Route path="/login" element={<Layout title="Login" username={username}><LoginPage /></Layout>} />
                <Route path="/signup" element={<Layout title="Sign Up" username={username}><SignupPage /></Layout>} />
            </Routes>
        </Router>
    );
}
