import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {Button, TextField, Typography, Stack, Alert, Select, MenuItem, Divider, Box} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import CalculationHistoryFooter from './CalculationHistoryFooter';
import '../App.css';

interface HePreset {
    id: number;
    name: string;
    explosiveMass: number;
    explosiveType: {
        id: number;
        name: string;
        energyFactor?: number;  // volitelné pole, pokud ho API vrací
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
        energyFactor?: number;  // volitelné pole, pokud ho API vrací
    };
}

export default function HighExplosivePage() {
    const navigate = useNavigate();

    // HEAT states
    //const [heatPresets, setHeatPresets] = useState<HeatPreset[]>([]);
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
    const [heatPenetrationResult, setHeatPenetrationResult] = useState<string>(''); // Add this state

    // HE states
    const [hePresets, setHePresets] = useState<HePreset[]>([]);
    const [selectedHePreset, setSelectedHePreset] = useState('');
    const [heExplosiveType, setHeExplosiveType] = useState('');
    const [heExplosiveMass, setHeExplosiveMass] = useState('');
    const [heResult, setHeResult] = useState<string>('');

    // Common states
    const [error, setError] = useState<string>('');

    // Přidání state pro HEAT overpressure
    const [heatOverpressure, setHeatOverpressure] = useState<string>('');

    // 1. Add state for history
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/calculator/presets/heat')
            .then(res => res.json())
            .then(data => setHeatPresets(Array.isArray(data) ? data : []))
            .catch(() => setHeatPresets([]));
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/api/calculator/explosive-types')
            .then(res => res.json())
            .then(data => setExplosiveTypes(Array.isArray(data) ? data : []))
            .catch(() => setExplosiveTypes([]));
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/api/calculator/presets/he')
            .then(res => res.json())
            .then(data => setHePresets(Array.isArray(data) ? data : []))
            .catch(() => setHePresets([]));
    }, []);

    // 3. Fetch history on mount
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
        console.log('Loading preset:', preset);
        setExplosiveMass(String(preset.explosiveMass));
        setDiameter(String(preset.diameter));
        setAngle("0");
        setCoefficient(
            preset.coefficient !== undefined && preset.coefficient !== null
                ? String(preset.coefficient)
                : ''
        );
        setEfficiency(String(preset.efficiency));
        
        // Nastavíme ID typu výbušniny
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
            // Nastavíme ID typu výbušniny místo názvu
            const explosiveTypeValue = typeof preset.explosiveType === 'object'
                ? String(preset.explosiveType.id)
                : String(preset.explosiveType);
            setHeExplosiveType(explosiveTypeValue);
        }
    };


    const handleHeatCalculate = async () => {
    setError('');
    setHeatResults([]);
    setHeatPenetrationResult('');
    setHeatOverpressure('');
    try {
        // Table of results for various efficiencies and angles
        const efficiencies = [Number(efficiency),100, 90, 80, 70, 60, 50];
        const angles = [0, 30, 60];
        const tableResults: any[] = [];

        for (let i = 0; i < efficiencies.length; i++) {
            const efficiencyVal = efficiencies[i];
            const row: any = { id: i, efficiency: efficiencyVal };
            for (const angleVal of angles) {
                const response = await fetch('http://localhost:8080/api/calculator/heat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        explosiveMass: Number(explosiveMass),
                        diameter: Number(diameter),
                        angleOfImpact: Number(angleVal) * Math.PI / 180, // <-- FIXED
                        coefficient: Number(coefficient),
                        efficiency: efficiencyVal,
                        explosiveType: heatExplosiveType
                    }),
                });

                if (!response.ok) {
                    row[`result${angleVal}`] = '';
                    continue;
                }

                const data = await response.json();
                row[`result${angleVal}`] = typeof data.result === 'number'
                    ? data.result.toFixed(2)
                    : data.result
                        ? String(data.result)
                        : '';
            }
            tableResults.push(row);
        }
        setHeatResults(tableResults);

        // Main result for current input
        const currentResponse = await fetch('http://localhost:8080/api/calculator/heat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                explosiveMass: Number(explosiveMass),
                diameter: Number(diameter),
                angleOfImpact: Number(angle), // <-- FIXED
                coefficient: Number(coefficient),
                efficiency: Number(efficiency),
                explosiveType: heatExplosiveType
            }),
        });

        if (!currentResponse.ok) throw new Error('HEAT penetration calculation failed');
        const currentData = await currentResponse.json();
        setHeatPenetrationResult(
            typeof currentData.result === 'number'
                ? currentData.result.toFixed(2)
                : currentData.result
                    ? String(currentData.result)
                    : ''
        );

        const explosiveTypeName = explosiveTypes.find(t => String(t.id) === String(heatExplosiveType))?.name || '';

        // Overpressure for current input
        const overpressureResponse = await fetch('http://localhost:8080/api/calculator/overpressure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                explosiveMass: Number(explosiveMass),
                explosiveType: explosiveTypeName  // posíláme název výbušniny
            }),
        });



        if (overpressureResponse.ok) {
            const overpressureData = await overpressureResponse.json();
            setHeatOverpressure(
                typeof overpressureData.result === 'number'
                    ? overpressureData.result.toFixed(2)
                    : overpressureData.result
                        ? String(overpressureData.result)
                        : ''
            );
            // Save HEAT overpressure to history
            await fetch('http://localhost:8080/api/calculator/save-calculation-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    parameters: JSON.stringify({
                        explosiveMass,
                        diameter,
                        angleOfImpact: angle,
                        coefficient,
                        efficiency,
                        explosiveType: heatExplosiveType
                    }),
                    calculationType: 'HEAT Overpressure',
                    result: overpressureData.result
                }),
            });
            fetchHistory(); // <-- add this after each save
        } else {
            setHeatOverpressure('');
        }

        // Save calculation to history
        await fetch('http://localhost:8080/api/calculator/save-calculation-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                parameters: JSON.stringify({
                    explosiveMass,
                    diameter,
                    angleOfImpact: angle, // <-- FIXED
                    coefficient,
                    efficiency,
                    explosiveType: heatExplosiveType
                }),
                calculationType: 'HEAT Penetration',
                result: currentData.result
            }),
        });
        fetchHistory(); // <-- add this after each save

    } catch (error: any) {
        setError(error.message || 'Chyba při HEAT výpočtu');
    }
};

const handleHeCalculate = async () => {
    try {
        const explosiveTypeName = explosiveTypes.find(t => String(t.id) === String(heExplosiveType))?.name || '';

        const requestData = {
            explosiveType: explosiveTypeName,  // posíláme název výbušniny
            explosiveMass: Number(heExplosiveMass)
        };


        console.log('Odesílání HE požadavku:', requestData);

        const response = await fetch('http://localhost:8080/api/calculator/he', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server odpověď:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHeResult(
            typeof data.result === 'number'
                ? data.result.toFixed(2) // Zaokrouhlení na 2 desetinná místa
                : data.result
                    ? String(data.result)
                    : ''
        );

        // Save HE overpressure to history
        await fetch('http://localhost:8080/api/calculator/save-calculation-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                parameters: JSON.stringify({
                    explosiveMass: heExplosiveMass,
                    explosiveType: heExplosiveType
                }),
                calculationType: 'HE Overpressure',
                result: data.result
            }),
        });
        fetchHistory(); // <-- add this after each save
    } catch (error) {
        console.error('Chyba při HE výpočtu:', error);
    }
};

    // 2. Add fetchHistory function
    const fetchHistory = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/calculator/calculation-history');
            const data = await response.json();
            setHistory(data);
        } catch (err) {
            console.error('Chyba při načítání historie');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center px-4">
            <Stack direction="row" alignItems="center" justifyContent="space-between" className="header-section mt-8" width="100%">
                <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                    Back to Menu
                </Button>
                <h1 style={{ margin: 0, flexGrow: 1, textAlign: 'center' }}>HEAT / HE</h1>
                <div style={{ width: '120px' }}></div>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="stretch" width="100%">
                {/* Levá strana - formuláře zůstává stejná */}
                <Stack spacing={4} flex={1}>
                    {/* HEAT sekce */}
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
                        <TextField
                            label="Explosive Mass (kg)"
                            value={explosiveMass}
                            onChange={(e) => setExplosiveMass(e.target.value)}
                            fullWidth
                            type="number"
                        />
                        <TextField
                            label="Diameter (mm)"
                            value={diameter}
                            onChange={(e) => setDiameter(e.target.value)}
                            fullWidth
                            type="number"
                        />
                        <TextField
                            label="Angle of Impact (degrees)"
                            value={angle}
                            onChange={(e) => setAngle(e.target.value)}
                            fullWidth
                            type="number"
                        />
                        <TextField
                            label="Warhead Coefficient"
                            value={coefficient}
                            onChange={(e) => setCoefficient(e.target.value)}
                            fullWidth
                            type="number"
                        />
                        <TextField
                            label="Efficiency (%)"
                            value={efficiency}
                            onChange={(e) => setEfficiency(e.target.value)}
                            fullWidth
                            type="number"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleHeatCalculate}
                            fullWidth
                        >
                            Calculate HEAT
                        </Button>
                    </Stack>

                    <Divider sx={{ my: 4, bgcolor: 'grey.500' }} />

                    {/* HE sekce */}
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
                        <TextField
                            label="Explosive Mass (kg)"
                            value={heExplosiveMass}
                            onChange={(e) => setHeExplosiveMass(e.target.value)}
                            fullWidth
                            type="number"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleHeCalculate}
                            fullWidth
                        >
                            Calculate HE
                        </Button>
                    </Stack>
                </Stack>

                {/* Pravá strana - výsledky */}
                <Stack flex={1} sx={{ display: 'flex', flexDirection: 'column' }}>
                    {/* HEAT výsledky */}
                    <Stack spacing={2} sx={{ flex: '0 0 auto' }}>
                        <Typography variant="h6">HEAT Results Table</Typography>
                        <DataGrid
                            rows={heatResults}
                            columns={columns}
                            autoHeight
                            disableRowSelectionOnClick
                            hideFooter
                        />
                        {heatPenetrationResult && (
                            <Alert severity="success">
                                HEAT Penetration (current input): {heatPenetrationResult} mm
                            </Alert>
                        )}
                        {heatOverpressure && (
                            <Alert severity="info">
                                HEAT Overpressure: {heatOverpressure} mm
                            </Alert>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </Stack>

                {/* HE výsledky */}
                <Stack spacing={2} sx={{
                    flex: '0 0 auto',
                    position: 'absolute',
                    marginTop: '655px'
                }}>
                    <Typography variant="h6">HE Results</Typography>
                    {heResult && (
                        <Alert severity="success">
                            HE Overpressure: {heResult} mm
                        </Alert>
                    )}
                </Stack>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Stack>
        </Stack>

        {/* 5. Pass refreshKey to CalculationHistoryFooter */}
        <CalculationHistoryFooter refreshKey={history.length} />
    </div>
);
}