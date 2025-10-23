// CalculationHistoryFooter.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Paper, Stack } from '@mui/material';
import '../App.css';

interface CalculationHistory {
    id: number;
    timestamp: string;
    parameters: string;
    calculationType: string;
    result: number;
}

interface Props {
    refreshKey: number;
}

export default function CalculationHistoryFooter({ refreshKey }: Props) {
    const [history, setHistory] = useState<CalculationHistory[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/calculator/calculation-history');
                const data = await response.json();
                setHistory(data);
            } catch (err) {
                console.error('Chyba při načítání historie');
            }
        };

        fetchHistory();
    }, [refreshKey]); // Refresh when the key changes

    return (
        <footer style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" gutterBottom>
                Calculation History
            </Typography>
            <Paper style={{ maxHeight: '200px', overflow: 'auto', padding: '1rem' }}>
                {history.length > 0 ? (
                    <Stack spacing={2}>
                        {history.map((entry) => (
                            <div key={entry.id}>
                                <Typography variant="body2">
                                    <strong>Time:</strong> {new Date(entry.timestamp).toLocaleString()}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Type of Calculation:</strong> {entry.calculationType}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Result:</strong> {entry.result}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Parameters:</strong> {entry.parameters}
                                </Typography>
                            </div>
                        ))}
                    </Stack>
                ) : (
                    <Typography variant="body2">No history to show.</Typography>
                )}
            </Paper>
        </footer>
    );
}
