import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Stack, Alert } from '@mui/material';
import api from '../api';

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await api.post<{ token: string }>('http://localhost:8080/api/auth/signin', { username, password });
            localStorage.setItem('token', response.token);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.message || 'An error occurred during login.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Stack spacing={2} sx={{ width: 300 }}>
                <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" onClick={handleLogin}>Login</Button>
                {error && <Alert severity="error">{error}</Alert>}
                <Button onClick={() => navigate('/signup')}>Don't have an account? Sign up</Button>
            </Stack>
        </div>
    );
}
