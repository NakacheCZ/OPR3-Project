import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import PersonIcon from './PersonIcon';

interface HeaderProps {
    title?: string;
    username?: string;
}

export default function Header({ title, username }: HeaderProps) {
    const navigate = useNavigate();

    const handleUserClick = () => {
        navigate('/login');
    };

    const handleTitleClick = () => {
        navigate('/');
    }

    return (
        <header className="w-full max-w-4xl px-4 mt-8 pb-4">
            {/* Top Row for the Title */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h1 onClick={handleTitleClick} className="cursor-pointer text-2xl font-bold">
                    {title || 'Armor Penetration Calculator'}
                </h1>
            </div>

            {/* Bottom Row for Button and User Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Left Side: Back Button or a placeholder */}
                <div style={{ minWidth: '130px' }}>
                    {title && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/')}
                        >
                            Back to Menu
                        </Button>
                    )}
                </div>

                {/* Right Side: User Info */}
                <div 
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
                    onClick={handleUserClick}
                >
                    <PersonIcon size={32} />
                    <span className="text-white ml-2">{username || 'Guest'}</span>
                </div>
            </div>
        </header>
    );
}
