import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Stack, Alert } from '@mui/material';
import api from '../api';

export default function SignupPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {
        try {
            const response = await api.post<{ token: string }>('http://localhost:8080/api/auth/signup', { username, password });
            localStorage.setItem('token', response.token);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Stack spacing={2} sx={{ width: 300 }}>
                <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" onClick={handleSignup}>Sign Up</Button>
                {error && <Alert severity="error">{error}</Alert>}
                <Button onClick={() => navigate('/login')}>Already have an account? Login</Button>
            </Stack>
        </div>
    );
}
