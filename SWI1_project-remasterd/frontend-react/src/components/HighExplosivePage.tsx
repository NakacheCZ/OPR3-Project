import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {Button, TextField, Typography, Stack, Alert, Select, MenuItem, Divider, Box} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import CalculationHistoryFooter from './CalculationHistoryFooter';
import '../App.css';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

interface HePreset {
    id: number;
    name: string;
    explosiveMass: number;
    explosiveType: {
        id: number;
        name: string;
        energyFactor?: number;
    };
}

interface ExplosiveType {
    id: number;
    name: string;
    energyFactor: number;
}

interface HeatPresetResponse {
    id: number;
    name: string;
    diameter: number;
    explosiveMass: number;
    coefficient: number;
    efficiency: number;
    explosiveType: {
        id: number;
        name: string;
        energyFactor?: number;
    };
}

export default function HighExplosivePage() {
    const navigate = useNavigate();

    // HEAT states
    const [heatPresets, setHeatPresets] = useState<HeatPresetResponse[]>([]);
    const [selectedHeatPreset, setSelectedHeatPreset] = useState('');
    const [explosiveTypes, setExplosiveTypes] = useState<ExplosiveType[]>([]);
    const [heatExplosiveType, setHeatExplosiveType] = useState('');
    const [explosiveMass, setExplosiveMass] = useState('');
    const [diameter, setDiameter] = useState('');
    const [angle, setAngle] = useState('');
    const [coefficient, setCoefficient] = useState('');
    const [efficiency, setEfficiency] = useState('');
    const [heatResults, setHeatResults] = useState<any[]>([]);
    const [heatPenetrationResult, setHeatPenetrationResult] = useState<string>('');

    // HE states
    const [hePresets, setHePresets] = useState<HePreset[]>([]);
    const [selectedHePreset, setSelectedHePreset] = useState('');
    const [heExplosiveType, setHeExplosiveType] = useState('');
    const [heExplosiveMass, setHeExplosiveMass] = useState('');
    const [heResult, setHeResult] = useState<string>('');

    // Common states
    const [error, setError] = useState<string>('');
    const [heatOverpressure, setHeatOverpressure] = useState<string>('');
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        api.get<HeatPresetResponse[]>('http://localhost:8080/api/calculator/presets/heat')
            .then(data => setHeatPresets(Array.isArray(data) ? data : []))
            .catch(() => setHeatPresets([]));
    }, []);

    useEffect(() => {
        api.get<ExplosiveType[]>('http://localhost:8080/api/calculator/explosive-types')
            .then(data => setExplosiveTypes(Array.isArray(data) ? data : []))
            .catch(() => setExplosiveTypes([]));
    }, []);

    useEffect(() => {
        api.get<HePreset[]>('http://localhost:8080/api/calculator/presets/he')
            .then(data => setHePresets(Array.isArray(data) ? data : []))
            .catch(() => setHePresets([]));
    }, []);

    useEffect(() => {
        fetchHistory();
    }, []);

    const columns: GridColDef[] = [
        { field: 'efficiency', headerName: 'Efficiency (%)', flex: 1 },
        { field: 'result0', headerName: '0°', flex: 1 },
        { field: 'result30', headerName: '30°', flex: 1 },
        { field: 'result60', headerName: '60°', flex: 1 },
    ];

    const handleHeatPresetChange = (event: SelectChangeEvent) => {
        const presetId = event.target.value;
        setSelectedHeatPreset(presetId);
        const preset = heatPresets.find(p => String(p.id) === String(presetId));
        if (preset) {
            setExplosiveMass(String(preset.explosiveMass));
            setDiameter(String(preset.diameter));
            setAngle("0");
            setCoefficient(String(preset.coefficient ?? ''));
            setEfficiency(String(preset.efficiency));
            const explosiveTypeValue = typeof preset.explosiveType === 'object' 
                ? String(preset.explosiveType.id)
                : String(preset.explosiveType);
            setHeatExplosiveType(explosiveTypeValue);
        }
    };

    const handleHePresetChange = (event: SelectChangeEvent) => {
        const presetId = event.target.value;
        setSelectedHePreset(presetId);
        const preset = hePresets.find(p => String(p.id) === String(presetId));
        if (preset) {
            setHeExplosiveMass(String(preset.explosiveMass));
            const explosiveTypeValue = typeof preset.explosiveType === 'object'
                ? String(preset.explosiveType.id)
                : String(preset.explosiveType);
            setHeExplosiveType(explosiveTypeValue);
        }
    };

    const validateHeatFields = () => {
        const missingFields = [];
        if (!explosiveMass) missingFields.push('Explosive Mass');
        if (!diameter) missingFields.push('Diameter');
        if (!angle) missingFields.push('Angle of Impact');
        if (!coefficient) missingFields.push('Warhead Coefficient');
        if (!efficiency) missingFields.push('Efficiency');
        if (!heatExplosiveType) missingFields.push('Explosive Type');

        if (missingFields.length > 0) {
            setError(`Please fill in the following HEAT fields: ${missingFields.join(', ')}`);
            return false;
        }
        setError('');
        return true;
    };

    const validateHeFields = () => {
        const missingFields = [];
        if (!heExplosiveMass) missingFields.push('Explosive Mass');
        if (!heExplosiveType) missingFields.push('Explosive Type');

        if (missingFields.length > 0) {
            setError(`Please fill in the following HE fields: ${missingFields.join(', ')}`);
            return false;
        }
        setError('');
        return true;
    };

    const handleHeatCalculate = async () => {
        if (!validateHeatFields()) {
            return;
        }
        setError('');
        setHeatResults([]);
        setHeatPenetrationResult('');
        setHeatOverpressure('');
        try {
            const efficiencies = [Number(efficiency), 100, 90, 80, 70, 60, 50];
            const angles = [0, 30, 60];
            const tableResults: any[] = [];

            for (let i = 0; i < efficiencies.length; i++) {
                const efficiencyVal = efficiencies[i];
                const row: any = { id: i, efficiency: efficiencyVal };
                for (const angleVal of angles) {
                    const data = await api.post<any>('http://localhost:8080/api/calculator/heat', {
                        explosiveMass: Number(explosiveMass),
                        diameter: Number(diameter),
                        angleOfImpact: Number(angleVal) * Math.PI / 180,
                        coefficient: Number(coefficient),
                        efficiency: efficiencyVal,
                        explosiveType: heatExplosiveType
                    });
                    row[`result${angleVal}`] = data.result?.toFixed(2) ?? '';
                }
                tableResults.push(row);
            }
            setHeatResults(tableResults);

            const currentData = await api.post<any>('http://localhost:8080/api/calculator/heat', {
                explosiveMass: Number(explosiveMass),
                diameter: Number(diameter),
                angleOfImpact: Number(angle),
                coefficient: Number(coefficient),
                efficiency: Number(efficiency),
                explosiveType: heatExplosiveType
            });
            setHeatPenetrationResult(currentData.result?.toFixed(2) ?? '');

            const explosiveTypeName = explosiveTypes.find(t => String(t.id) === String(heatExplosiveType))?.name || '';
            const overpressureData = await api.post<any>('http://localhost:8080/api/calculator/overpressure', {
                explosiveMass: Number(explosiveMass),
                explosiveType: explosiveTypeName
            });
            setHeatOverpressure(overpressureData.result?.toFixed(2) ?? '');

            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken: { sub: string } = jwtDecode(token);
                if (decodedToken.sub !== 'guest') {
                    await api.post('http://localhost:8080/api/calculator/save-calculation-history', {
                        timestamp: new Date().toISOString(),
                        parameters: JSON.stringify({ explosiveMass, diameter, angleOfImpact: angle, coefficient, efficiency, explosiveType: heatExplosiveType }),
                        calculationType: 'HEAT Penetration',
                        result: currentData.result
                    });
                    await api.post('http://localhost:8080/api/calculator/save-calculation-history', {
                        timestamp: new Date().toISOString(),
                        parameters: JSON.stringify({ explosiveMass, explosiveType: heatExplosiveType }),
                        calculationType: 'HEAT Overpressure',
                        result: overpressureData.result
                    });
                }
            }
            fetchHistory();
        } catch (error: any) {
            setError(error.message || 'An error occurred during HEAT calculation.');
        }
    };

    const handleHeCalculate = async () => {
        if (!validateHeFields()) {
            return;
        }
        try {
            const explosiveTypeName = explosiveTypes.find(t => String(t.id) === String(heExplosiveType))?.name || '';
            const requestData = { explosiveType: explosiveTypeName, explosiveMass: Number(heExplosiveMass) };
            const data = await api.post<any>('http://localhost:8080/api/calculator/he', requestData);
            setHeResult(data.result?.toFixed(2) ?? '');

            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken: { sub: string } = jwtDecode(token);
                if (decodedToken.sub !== 'guest') {
                    await api.post('http://localhost:8080/api/calculator/save-calculation-history', {
                        timestamp: new Date().toISOString(),
                        parameters: JSON.stringify({ explosiveMass: heExplosiveMass, explosiveType: heExplosiveType }),
                        calculationType: 'HE Overpressure',
                        result: data.result
                    });
                }
            }
            fetchHistory();
        } catch (error: any) {
            setError(error.message || 'An error occurred during HE calculation.');
        }
    };

    const fetchHistory = async () => {
        try {
            const data = await api.get<any[]>('http://localhost:8080/api/calculator/calculation-history');
            setHistory(data);
        } catch (err) {
            console.error('Error fetching history');
        }
    };

    return (
        <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="stretch" width="100%">
                <Stack spacing={4} flex={1}>
                    <Stack spacing={2}>
                        <Typography variant="h5">HEAT Calculations</Typography>
                        <Select
                            value={selectedHeatPreset}
                            onChange={handleHeatPresetChange}
                            displayEmpty
                            fullWidth
                            sx={{ bgcolor: '#fff', color: '#000' }}
                        >
                            <MenuItem value="" disabled>Select HEAT Shell Preset</MenuItem>
                            {heatPresets.map(preset => (
                                <MenuItem key={preset.id} value={preset.id}>{preset.name}</MenuItem>
                            ))}
                        </Select>
                        <Select
                            value={heatExplosiveType}
                            onChange={(e) => setHeatExplosiveType(e.target.value)}
                            displayEmpty
                            fullWidth
                            sx={{ bgcolor: '#fff', color: '#000' }}
                        >
                            <MenuItem value="" disabled>Select Explosive Type</MenuItem>
                            {explosiveTypes.map(type => (
                                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                            ))}
                        </Select>
                        <TextField label="Explosive Mass (kg)" value={explosiveMass} onChange={(e) => setExplosiveMass(e.target.value)} fullWidth type="number" />
                        <TextField label="Diameter (mm)" value={diameter} onChange={(e) => setDiameter(e.target.value)} fullWidth type="number" />
                        <TextField label="Angle of Impact (degrees)" value={angle} onChange={(e) => setAngle(e.target.value)} fullWidth type="number" />
                        <TextField label="Warhead Coefficient" value={coefficient} onChange={(e) => setCoefficient(e.target.value)} fullWidth type="number" />
                        <TextField label="Efficiency (%)" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} fullWidth type="number" />
                        <Button variant="contained" color="primary" onClick={handleHeatCalculate} fullWidth>
                            Calculate HEAT
                        </Button>
                    </Stack>

                    <Divider sx={{ my: 4, bgcolor: 'grey.500' }} />

                    <Stack spacing={2}>
                        <Typography variant="h5">HE Calculations</Typography>
                        <Select
                            value={selectedHePreset}
                            onChange={handleHePresetChange}
                            displayEmpty
                            fullWidth
                            sx={{ bgcolor: '#fff', color: '#000' }}
                        >
                            <MenuItem value="" disabled>Select HE Shell Preset</MenuItem>
                            {hePresets.map(preset => (
                                <MenuItem key={preset.id} value={preset.id}>{preset.name}</MenuItem>
                            ))}
                        </Select>
                        <Select
                            value={heExplosiveType}
                            onChange={(e) => setHeExplosiveType(e.target.value)}
                            displayEmpty
                            fullWidth
                            sx={{ bgcolor: '#fff', color: '#000' }}
                        >
                            <MenuItem value="" disabled>Select Explosive Type</MenuItem>
                            {explosiveTypes.map(type => (
                                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                            ))}
                        </Select>
                        <TextField label="Explosive Mass (kg)" value={heExplosiveMass} onChange={(e) => setHeExplosiveMass(e.target.value)} fullWidth type="number" />
                        <Button variant="contained" color="primary" onClick={handleHeCalculate} fullWidth>
                            Calculate HE
                        </Button>
                    </Stack>
                </Stack>

                <Stack flex={1} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Stack spacing={2} sx={{ flex: '0 0 auto' }}>
                        <Typography variant="h6">HEAT Results Table</Typography>
                        <DataGrid rows={heatResults} columns={columns} autoHeight disableRowSelectionOnClick hideFooter />
                        {heatPenetrationResult && <Alert severity="success">HEAT Penetration (current input): {heatPenetrationResult} mm</Alert>}
                        {heatOverpressure && <Alert severity="info">HEAT Overpressure: {heatOverpressure} mm</Alert>}
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </Stack>

                    <Stack spacing={2} sx={{ flex: '0 0 auto', marginTop: '2rem' }}>
                        <Typography variant="h6">HE Results</Typography>
                        {heResult && <Alert severity="success">HE Overpressure: {heResult} mm</Alert>}
                    </Stack>
                </Stack>
            </Stack>

            <CalculationHistoryFooter refreshKey={history.length} />
        </>
    );
}
