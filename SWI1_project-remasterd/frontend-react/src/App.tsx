import React from 'react';
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
        <div className="min-h-screen bg-gray-900 flex flex-col items-center px-4">
            <div className="header-section mt-8">
                <h1>Armor Penetration Calculator</h1>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center w-full">
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
            </div>
        </div>
        
    );
}

function AmmoButton({ image, label, onClick }: { image: string; label: string; onClick: () => void }) {
    return (
        <button onClick={onClick} className="ammo-button flex flex-col items-center mx-4">
            <img src={image} alt={label} className="w-16 h-16 mb-2" />
            <span>{label}</span>
        </button>
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/full-caliber" element={<FullCaliberPage />} />
                <Route path="/sub-caliber" element={<SubCaliberPage />} />
                <Route path="/high-explosive" element={<HighExplosivePage />} />
                <Route path="/info" element={<InfoPage />} />
                <Route path="/shells" element={<ShellPresets />} />
            </Routes>
        </Router>
    );
}
