import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, TextField, Typography, Stack, Alert, Paper, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import CalculationHistoryFooter from './CalculationHistoryFooter';
import '../App.css';
import api from '../api';


interface SubCaliberPreset {
    id: number;
    name: string;
    totalLength: number;
    diameter: number;
    densityPenetrator: number;
    hardnessPenetrator: number;
    velocity: number;
    densityTarget: number;
    hardnessTarget: number;
    angle: number;
    material: string;
    range: number;
}

interface SubCaliberResult {
    totalLength: number;
    diameter: number;
    density: number;
    hardness: number;
    velocity: number;
    targetDensity: number;
    targetHardness: number;
    angle: number;
    range: number;
    result: number;
}

interface CalculationHistory {
    id: number;
    timestamp: string;
    parameters: string;
    calculationType: string;
    result: number;
}

// Add this above your component
const MATERIALS = [
  "Tungsten",
  "Steel",
  "DU"
];

export default function SubCaliberPage() {
    const [shellPresets, setShellPresets] = useState<SubCaliberPreset[]>([]);
    const [shellPreset, setShellPreset] = useState('');
    const [totalLength, setTotalLength] = useState('');
    const [diameter, setDiameter] = useState('');
    const [density, setDensity] = useState('');
    const [hardness, setHardness] = useState('');
    const [velocity, setVelocity] = useState('');
    const [targetDensity, setTargetDensity] = useState('');
    const [targetHardness, setTargetHardness] = useState('');
    const [angle, setAngle] = useState('');
    const [range, setRange] = useState('');
    const [material, setMaterial] = useState('Tungsten'); // Default to first material
    const [results, setResults] = useState<SubCaliberResult[]>([]);
    const [finalResult, setFinalResult] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [history, setHistory] = useState<CalculationHistory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const calculateButtonRef = useRef<HTMLButtonElement | null>(null);
    const navigate = useNavigate();

    // Set default values for target fields on mount
    useEffect(() => {
        setTargetDensity("7850");
        setTargetHardness("237");
        setAngle("60");
        setRange("500");
        fetchHistory();
    }, []);
    useEffect(() => {
        api.get<SubCaliberPreset[]>('http://localhost:8080/api/calculator/presets/sub-caliber')
            .then(data => setShellPresets(Array.isArray(data) ? data : []))
            .catch(() => setShellPresets([]));
    }, []);
    const handleShellPresetChange = (event: SelectChangeEvent) => {
        const presetId = event.target.value;
        setShellPreset(presetId);
        const preset = shellPresets.find(p => String(p.id) === String(presetId));
        if (preset) {
            setTotalLength(String(preset.totalLength));
            setDiameter(String(preset.diameter));
            setDensity(String(preset.densityPenetrator));
            setHardness(String(preset.hardnessPenetrator));
            setVelocity((preset.velocity).toFixed(3)); // Convert m/s to km/s for input
            setTargetDensity(String(preset.densityTarget || "7850"));
            setTargetHardness(String(preset.hardnessTarget || "237"));
            setAngle(String(preset.angle || "60"));
            setMaterial(preset.material && MATERIALS.includes(preset.material) ? preset.material : MATERIALS[0]);
            setRange(String(preset.range || "500"));
        }
    };

    const columns: GridColDef[] = [
        { field: 'range', headerName: 'Range', flex: 1 },
        { field: 'result0', headerName: '0°', flex: 1 },
        { field: 'result30', headerName: '30°', flex: 1 },
        { field: 'result60', headerName: '60°', flex: 1 },
    ];

    const fetchHistory = async () => {
        try {
            const data = await api.get<CalculationHistory[]>('http://localhost:8080/api/calculator/calculation-history');
            setHistory(data);
        } catch (err) {
            console.error('Chyba při načítání historie');
        }
    };

    const validateFields = () => {
        const missingFields = [];
        if (!totalLength) missingFields.push('Total Length');
        if (!diameter) missingFields.push('Diameter');
        if (!density) missingFields.push('Density');
        if (!hardness) missingFields.push('Brinell Hardness');
        if (!velocity) missingFields.push('Impact Velocity');
        if (!targetDensity) missingFields.push('Target Density');
        if (!targetHardness) missingFields.push('Target Hardness');
        if (!angle) missingFields.push('Angle');
        if (!range) missingFields.push('Range');
        if (!material) missingFields.push('Material');

        if (missingFields.length > 0) {
            setError(`Please fill in the following fields: ${missingFields.join(', ')}`);
            return false;
        }
        setError('');
        return true;
    };

    const handleCalculate = async () => {
        if (!validateFields()) {
            return;
        }
        setError('');
        setFinalResult('');
        setResults([]);
        
        try {
            const angles = [0, 30, 60];
            const ranges = [0, 100, 200, 500, 1000, 2000];
            const tableResults = [];

            for (let index = 0; index < ranges.length; index++) {
                const rangeValue = ranges[index];
                const row: any = { id: index, range: rangeValue };
                
                for (const angleValue of angles) {
                    const data = await api.post<any>('http://localhost:8080/api/calculator/sub-caliber', {
                            totalLength: parseFloat(totalLength),
                            diameter: parseFloat(diameter),
                            densityPenetrator: parseFloat(density),
                            hardnessPenetrator: parseFloat(hardness),
                            velocity: parseFloat(velocity),
                            densityTarget: parseFloat(targetDensity),
                            hardnessTarget: parseFloat(targetHardness),
                            angle: angleValue * Math.PI / 180,
                            range: rangeValue,
                            material: material
                        });

                    row[`result${angleValue}`] = data.result?.toFixed(2) ?? '';
                }
                tableResults.push(row);
            }

            setResults(tableResults);

            const currentData = await api.post<any>('http://localhost:8080/api/calculator/sub-caliber', {
                    totalLength: parseFloat(totalLength),
                    diameter: parseFloat(diameter),
                    densityPenetrator: parseFloat(density),
                    hardnessPenetrator: parseFloat(hardness),
                    velocity: parseFloat(velocity),
                    densityTarget: parseFloat(targetDensity),
                    hardnessTarget: parseFloat(targetHardness),
                    angle: parseFloat(angle) * Math.PI / 180,
                    range: parseFloat(range),
                    material: material
                });

            setFinalResult(currentData.result?.toFixed(2) ?? '');

            await saveCalculationHistory({
                timestamp: new Date().toISOString(),
                parameters: JSON.stringify({
                    totalLength,
                    diameter,
                    density,
                    hardness,
                    velocity,
                    targetDensity,
                    targetHardness,
                    angle,
                    range,
                    material
                }),
                calculationType: 'Sub-Caliber Penetration',
                result: currentData.result,
            });

            await fetchHistory();
        } catch (err: any) {
            setError(err.message || 'An error occurred during calculation.');
        }
    };

    const saveCalculationHistory = async (history: Partial<CalculationHistory>) => {
        try {
            await api.post('http://localhost:8080/api/calculator/save-calculation-history', history);
        } catch (err) {
            console.error('Chyba při ukládání historie');
        }
    };

    return (
        <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
                <Stack spacing={2} flex={1}>
                    <Select
                        value={shellPreset}
                        onChange={handleShellPresetChange}
                        displayEmpty
                        fullWidth
                        sx={{ bgcolor: '#fff', color: '#000' }}
                    >
                        <MenuItem value="" disabled>
                            Select Shell Preset
                        </MenuItem>
                        {Array.isArray(shellPresets) && shellPresets.map(preset => (
                            <MenuItem key={preset.id} value={preset.id}>
                                {preset.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    fullWidth
                    sx={{ bgcolor: '#fff', color: '#000' }}
                >
                    {MATERIALS.map(mat => (
                        <MenuItem key={mat} value={mat}>{mat}</MenuItem>
                    ))}
                </Select>
                    
                <TextField
                    label="Total Length (mm)"
                    value={totalLength}
                    onChange={(e) => setTotalLength(e.target.value)}
                    type="number"
                />
                <TextField
                    label="Diameter (mm)"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    type="number"
                />
                
                <TextField
                    label="Density (kg/m³)"
                    value={density}
                    onChange={(e) => setDensity(e.target.value)}
                    type="number"
                />
                <TextField
                    label="Brinell Hardness"
                    value={hardness}
                    onChange={(e) => setHardness(e.target.value)}
                    type="number"
                />
                <TextField
                    label="Impact Velocity (km/s)"
                    value={velocity}
                    onChange={(e) => setVelocity(e.target.value)}
                    type="number"
                />
                    <h3>Target</h3>
                <TextField
                    label="Target Density (kg/m³)"
                    value={targetDensity}
                    onChange={(e) => setTargetDensity(e.target.value)}
                    type="number"
                />
                <TextField
                    label="Target Hardness"
                    value={targetHardness}
                    onChange={(e) => setTargetHardness(e.target.value)}
                    type="number"
                />
                <TextField
                    label="Angle (degrees)"
                    value={angle}
                    onChange={(e) => setAngle(e.target.value)}
                    type="number"
                />
                <TextField
                    label="Range (m)"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    type="number"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCalculate}
                    ref={calculateButtonRef}
                >
                    Calculate
                </Button>
                </Stack>

                <Stack flex={1}>
                    <DataGrid
                        rows={results}
                        columns={columns}
                        autoHeight
                        disableRowSelectionOnClick
                        hideFooter
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {finalResult && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Result: {finalResult} mm
                        </Alert>
                    )}
                </Stack>
            </Stack>
            <CalculationHistoryFooter refreshKey={history.length} />
        </>
    );
}
