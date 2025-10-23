import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, TextField, MenuItem, Typography, Stack, Alert, Paper } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CalculationHistoryFooter from './CalculationHistoryFooter';
import '../App.css';


interface FullCaliberResult {
  id: number;
  range: number;
  result0: number;
  result30: number;
  result60: number;
}

interface ShellPreset {
  id: number;
  name: string;
  mass: number;
  velocity: number;
  diameter: number;
  range: number;
  angle: number;
  constant: number;
  thicknessExponent: number;
  scaleExponent: number;
}

interface CalculationHistory {
  id: number;
  timestamp: string;
  parameters: string;
  calculationType: string;
  result: number;
}

export default function FullCaliberPage() {
  const navigate = useNavigate();
  const [shellPresets, setShellPresets] = useState<ShellPreset[]>([]);
  const [shellPreset, setShellPreset] = useState('');
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');
  const [diameter, setDiameter] = useState('');
  const [range, setRange] = useState('');
  const [angle, setAngle] = useState('');
  const [constant, setConstant] = useState('');
  const [thicknessExponent, setThicknessExponent] = useState('');
  const [scaleExponent, setScaleExponent] = useState('');
  const [results, setResults] = useState<FullCaliberResult[]>([]);
  const [finalResult, setFinalResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const calculateButtonRef = useRef<HTMLButtonElement | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);


  useEffect(() => {
    fetch('http://localhost:8080/api/calculator/presets/full-caliber')
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch presets');
          }
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setShellPresets(data);
          } else {
            setShellPresets([]);
          }
        })
        .catch(() => setShellPresets([]));
  }, []);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/calculator/calculation-history');
        if (!response.ok) {
          throw new Error('Chyba při načítání historie');
        }
        const data = await response.json();
        setHistory(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchHistory();
  }, []);

  const columns: GridColDef[] = [
    { field: 'range', headerName: 'Range', flex: 1 },
    { field: 'result0', headerName: '0°', flex: 1 },
    { field: 'result30', headerName: '30°', flex: 1 },
    { field: 'result60', headerName: '60°', flex: 1 },
  ];

  const handleCalculate = async () => {
  setResults([]);
  try {
    const angles = [0, 30, 60];
    const ranges = [0, 100, 200, 500, 1000, 2000];
    const tableResults: FullCaliberResult[] = [];

    for (let index = 0; index < ranges.length; index++) {
      const range = ranges[index];
      const row: any = { id: index, range };
      for (const angle of angles) {
        const response = await fetch('http://localhost:8080/api/calculator/full-caliber', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mass: parseFloat(mass),
            velocity: parseFloat(velocity),
            diameter: parseFloat(diameter),
            range,
            angle: angle * Math.PI / 180,
            materialCoefficient: parseFloat(constant),
            materialExponent: parseFloat(thicknessExponent),
            resistanceCoefficient: parseFloat(scaleExponent),
          }),
        });

        if (!response.ok) {
          throw new Error('Chyba při výpočtu');
        }

        const data = await response.json();
        row[`result${angle}`] = data.result?.toFixed(2) ?? '';
      }
      tableResults.push(row);
    }

    setResults(tableResults);
  } catch (err: any) {
    setError(err.message || 'Došlo k chybě');
  }
};

  const handleIndividualCalculate = async () => {
    try {
      const parsedAngle = parseFloat(angle); // Převeďte `angle` na číslo
      const response = await fetch('http://localhost:8080/api/calculator/full-caliber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mass: parseFloat(mass),
          velocity: parseFloat(velocity),
          angle: parsedAngle * Math.PI / 180, // Použijte převedený úhel
          diameter: parseFloat(diameter),
          materialCoefficient: parseFloat(constant),
          materialExponent: parseFloat(thicknessExponent),
          resistanceCoefficient: parseFloat(scaleExponent),
          range: parseFloat(range),
        }),
      });

      if (!response.ok) {
        throw new Error('Chyba při výpočtu');
      }

      const data = await response.json();
      setFinalResult(data.result?.toFixed(2) ?? '');

      // Aktualizace seznamu historie
      await fetchHistory();
    } catch (err: any) {
      setError(err.message || 'Došlo k chybě');
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true); // Zobrazit indikátor načítání
    try {
      const response = await fetch('http://localhost:8080/api/calculator/calculation-history');
      if (!response.ok) {
        throw new Error('Chyba při načítání historie');
      }
      const data = await response.json();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'Došlo k chybě při načítání historie');
    } finally {
      setIsLoading(false); // Skrytí indikátoru načítání
    }
  };

  useEffect(() => {
    fetchHistory(); // Automatické načtení historie při načtení komponenty
  }, []);

  const handleCalculateBoth = async () => {
    try {
      const parsedAngle = parseFloat(angle); // Převeďte `angle` na číslo
      const response = await fetch('http://localhost:8080/api/calculator/full-caliber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mass: parseFloat(mass),
          velocity: parseFloat(velocity),
          angle: parsedAngle * Math.PI / 180, // Převod na radiány
          diameter: parseFloat(diameter),
          materialCoefficient: parseFloat(constant),
          materialExponent: parseFloat(thicknessExponent),
          resistanceCoefficient: parseFloat(scaleExponent),
          range: parseFloat(range),
        }),
      });

      if (!response.ok) {
        throw new Error('Chyba při výpočtu');
      }

      const data = await response.json();
      await handleCalculate(); // Also fill the full-angle results table
      setFinalResult(data.result?.toFixed(2) ?? '');



// Uložení historie
await saveCalculationHistory({
  timestamp: new Date().toISOString(),
  parameters: JSON.stringify({
    mass,
    velocity,
    angle,
    diameter,
    constant,
    thicknessExponent,
    scaleExponent,
    range,
  }),
  calculationType: 'Full Caliber',
  result: data.result,
});

// Zvyšení klíče pro refresh footeru
setRefreshKey(prev => prev + 1);


      // Aktualizace seznamu historie
      await fetchHistory();
    } catch (err: any) {
      setError(err.message || 'Došlo k chybě');
    }
  };

  const saveCalculationHistory = async (history: any) => {
    try {
      const response = await fetch('http://localhost:8080/api/calculator/save-calculation-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(history),
      });

      if (!response.ok) {
        throw new Error('Chyba při ukládání historie');
      }
    } catch (err: any) {
      setError(err.message || 'Došlo k chybě při ukládání historie');
    }
  };





  // When preset changes, fill the form
  const handleShellPresetChange = (event: SelectChangeEvent) => {
    const presetId = event.target.value;
    setShellPreset(presetId);
    const preset = shellPresets.find(p => String(p.id) === String(presetId));
    if (preset) {
      setMass(String(preset.mass));
      setVelocity(String(preset.velocity));
      setDiameter(String(preset.diameter));
      setRange('100');
      setAngle('30');
      setConstant(String(preset.constant));
      setThicknessExponent(String(preset.thicknessExponent));
      setScaleExponent(String(preset.scaleExponent));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center px-4 ">
            <Stack direction="row" alignItems="center" justifyContent="space-between" className="header-section mt-8">
  <Button
    variant="contained"
    color="primary"
    onClick={() => navigate('/')}
  >
    Back to Menu
  </Button>
  <h1 style={{ margin: 0, flexGrow: 1, textAlign: 'center' }}>Full Caliber</h1>
  {/* Empty space holder to balance layout */}
  <div style={{ width: '120px' }}></div>
</Stack>



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
            {shellPresets.map(preset => (
              <MenuItem key={preset.id} value={preset.id}>
                {preset.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Mass (kg)"
            value={mass}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMass(e.target.value)}
            fullWidth
          />
          <TextField
            label="Velocity (m/s)"
            value={velocity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVelocity(e.target.value)}
            fullWidth
          />
          <TextField
            label="Diameter (mm)"
            value={diameter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiameter(e.target.value)}
            fullWidth
          />
          <TextField
            label="Angle (°)"
            value={angle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAngle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Range (m)"
            value={range}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRange(e.target.value)}
            fullWidth
          />
          <TextField
            label="Material Coefficient"
            value={constant}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConstant(e.target.value)}
            fullWidth
          />
          <TextField
            label="Material Exponent"
            value={thicknessExponent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThicknessExponent(e.target.value)}
            fullWidth
          />
          <TextField
            label="Resistance Coefficient"
            value={scaleExponent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScaleExponent(e.target.value)}
            fullWidth
          />
          <Button
  ref={calculateButtonRef}
  variant="contained"
  color="primary"
  onClick={handleCalculateBoth}
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
      <CalculationHistoryFooter refreshKey={refreshKey} />

    </div>
  );
}