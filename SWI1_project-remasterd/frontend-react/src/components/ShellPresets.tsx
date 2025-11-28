import React from 'react';
import { useEffect, useState } from 'react';
import '../App.css';
import {
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridValueGetter,
} from '@mui/x-data-grid';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Tab,
    Tabs,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel, Stack, DialogContentText, Typography,
} from '@mui/material';


import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom";
import { ExplosiveType } from '../types';
import api from '../api';

// Definice typů
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface BasePreset {
    id?: number;
    name: string;
    userId?: number;
}

interface FullCaliberPreset extends BasePreset {
    mass: number;
    velocity: number;
    diameter: number;
    angle: number;
    range: number;
    constant: number;
    thicknessExponent: number;
    scaleExponent: number;
}

interface SubCaliberPreset extends BasePreset {
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

interface HeatPreset extends BasePreset {
    explosiveTypeId: number;
    diameter: number;
    explosiveMass: number;
    coefficient: number;
    efficiency: number;
}

interface HePreset extends BasePreset {
    explosiveTypeId: number;
    diameter: number;
    explosiveMass: number;
}

type Preset = FullCaliberPreset | SubCaliberPreset | HeatPreset | HePreset;

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function ShellPresets() {
    const [tabValue, setTabValue] = useState(0);
    const [fullCaliberPresets, setFullCaliberPresets] = useState<any[]>([]);
    const [subCaliberPresets, setSubCaliberPresets] = useState<SubCaliberPreset[]>([]);
    const [heatPresets, setHeatPresets] = useState<any[]>([]);
    const [hePresets, setHePresets] = useState<any[]>([]);
    
// Přidat state pro typy výbušnin
const [explosiveTypes, setExplosiveTypes] = useState<ExplosiveType[]>([]);
const [selectedExplosiveType, setSelectedExplosiveType] = useState<string>('');
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
const [name, setName] = useState('');
const [mass, setMass] = useState('');
const [velocity, setVelocity] = useState('');
const [diameter, setDiameter] = useState('');
const [range, setRange] = useState('');
const [angle, setAngle] = useState('');
const [constant, setConstant] = useState('');
const [thicknessExponent, setThicknessExponent] = useState('');
const [scaleExponent, setScaleExponent] = useState('');
const [status, setStatus] = useState('');
// Přidejte nové stavy
const [currentPreset, setCurrentPreset] = useState<any>(null);
const [presetType, setPresetType] = useState<'full-caliber' | 'sub-caliber' | 'heat' | 'he'>('full-caliber');
const [formData, setFormData] = useState<any>(() => ({
    name: '',
    ...(presetType === 'full-caliber' && {
        mass: '',
        velocity: '',
        diameter: '',
        angle: '',
        range: '',
        constant: '',
        thicknessExponent: '',
        scaleExponent: ''
    }),
    ...(presetType === 'sub-caliber' && {
        totalLength: '',
        diameter: '',
        densityPenetrator: '',
        hardnessPenetrator: '',
        velocity: '',
        densityTarget: '',
        hardnessTarget: '',
        angle: '',
        material: '',
        range: ''
    }),
    ...(presetType === 'heat' && {
        explosiveTypeId: '',
        diameter: '',
        explosiveMass: '',
        coefficient: '',
        efficiency: ''
    }),
    ...(presetType === 'he' && {
        explosiveTypeId: '',
        diameter: '',
        explosiveMass: ''
    })

}));
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [presetToDelete, setPresetToDelete] = useState<{ id: number; name: string } | null>(null);
const [error, setError] = useState<string>('');
const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
}, []);

const handleDeleteClick = (preset: { id: number; name: string }, type: typeof presetType) => {
    setPresetType(type);
    setPresetToDelete(preset);
    setDeleteDialogOpen(true);
};

const handleDeleteConfirm = async () => {
  if (presetToDelete) {
    try {
      await api.delete(`http://localhost:8080/api/calculator/presets/${presetType}/${presetToDelete.id}`);
      
      setDeleteDialogOpen(false);
      setPresetToDelete(null);
      // Obnovit seznam presetů pro všechny typy
      await fetchAllData();
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

// Při vytváření HEAT presetu
const handleSave = async () => {
    try {
        if (!formData.name?.trim()) {
            setError('Prosím vyplňte název presetu');
            return;
        }

        // Určení správného endpointu podle typu presetu
        let endpoint;
        switch (presetType) {
            case 'full-caliber':
                endpoint = 'presets/full-caliber';
                break;
            case 'sub-caliber':
                endpoint = 'presets/sub-caliber';
                break;
            case 'heat':
                endpoint = 'presets/heat';
                break;
            case 'he':
                endpoint = 'presets/he';
                break;
            default:
                throw new Error('Neznámý typ presetu');
        }

        let dataToSend = formData;
        if (presetType === 'full-caliber') {
            dataToSend = {
                ...formData,
                angle: Math.PI / 6 // 30 degrees in radians
            };
        }
        if (presetType === 'heat' || presetType === 'he') {
            dataToSend = {
                ...formData,
                explosiveType: { id: formData.explosiveTypeId }
            };
        }

        await api.post(`http://localhost:8080/api/calculator/${endpoint}`, dataToSend);
        
        // Po úspěšném uložení
        setOpenDialog(false);
        await fetchAllData(); // Místo fetchPresets použijeme fetchAllData
        setStatus('Preset byl úspěšně uložen');
    } catch (error) {
        console.error('Error:', error);
        setError('Chyba při ukládání presetu');
    }
};

// Načtení typů výbušnin při načtení komponenty
useEffect(() => {
    api.get<ExplosiveType[]>('http://localhost:8080/api/calculator/explosive-types')
        .then(data => setExplosiveTypes(data));
}, []);

useEffect(() => {
    // Načtení typů výbušnin
    api.get<ExplosiveType[]>('http://localhost:8080/api/calculator/explosive-types')
        .then(data => setExplosiveTypes(data));
}, []);

const handleAdd = (type: 'full-caliber' | 'sub-caliber' | 'heat' | 'he') => {
    setPresetType(type);
    setCurrentPreset(null);
    setFormData({
        name: '',
        ...(type === 'full-caliber' && {
            mass: '',
            velocity: '',
            diameter: '',
            constant: '',
            thicknessExponent: '',
            scaleExponent: ''
        }),
        ...(type === 'sub-caliber' && {
            totalLength: '',
            diameter: '',
            densityPenetrator: '',
            hardnessPenetrator: '',
            velocity: '',
            densityTarget: '',
            hardnessTarget: '',
            angle: '',
            material: '',
            range: ''
        }),
        ...(type === 'heat' && {
            explosiveTypeId: '',
            diameter: '',
            explosiveMass: '',
            coefficient: '',
            efficiency: ''
        }),
        ...(type === 'he' && {
            explosiveTypeId: '',
            diameter: '',
            explosiveMass: ''
        })
    });
    setOpenDialog(true);
};




    const handleBackClick = () => {
        navigate('/');
    };

    const handleSourceClick = (url: string) => {
        window.open(url, '_blank');
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [full, sub, heat, he, explosives] = await Promise.all([
                api.get<any[]>('http://localhost:8080/api/calculator/presets/full-caliber'),
                api.get<SubCaliberPreset[]>('http://localhost:8080/api/calculator/presets/sub-caliber'),
                api.get<any[]>('http://localhost:8080/api/calculator/presets/heat'),
                api.get<any[]>('http://localhost:8080/api/calculator/presets/he'),
                api.get<ExplosiveType[]>('http://localhost:8080/api/calculator/explosive-types')
            ]);

            setFullCaliberPresets(full || []);
            setSubCaliberPresets(sub || []);
            setHeatPresets(
                (heat || []).map((preset: any) => ({
                    ...preset,
                    explosiveTypeName: preset.explosiveType?.name || ''
                }))
            );
            setHePresets(
                (he || []).map((preset: any) => ({
                    ...preset,
                    explosiveTypeName: preset.explosiveType?.name || ''
                }))
            );
            setExplosiveTypes(explosives || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Upravte handleEdit funkci pro nastavení výchozích hodnot úhlu a vzdálenosti
    const handleDelete = async (id: number, type: string) => {
    try {
        await api.delete(`http://localhost:8080/api/calculator/presets/${type}/${id}`);

        // Aktualizace seznamu presetů po úspěšném smazání
        fetchPresets();
    } catch (error) {
        console.error('Error deleting preset:', error);
        // Zde můžete přidat zobrazení chybové hlášky uživateli
    }
};

    

    // Definice sloupců pro každý typ presetu
    const fullCaliberColumns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'mass', headerName: 'Weight (kg)', flex: 1 },
        { field: 'velocity', headerName: 'Velocity (m/s)', flex: 1 },
        { field: 'diameter', headerName: 'Diameter (mm)', flex: 1 },
        { field: 'constant', headerName: 'DeMarre Constant (K)', flex: 1 },
        { field: 'thicknessExponent', headerName: 'Thickness Exponent (n)', flex: 1 },
        { field: 'scaleExponent', headerName: 'Absolute Scale Exponent (s)', flex: 1 },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params) => [
                
<GridActionsCellItem
    icon={<EditIcon />}
    label="Edit"
    onClick={() => handleEdit(params.row, 'full-caliber')}
    disabled={!params.row.userId}
/>,
                <GridActionsCellItem
    icon={<DeleteIcon />}
    label="Delete"
    onClick={() => handleDeleteClick(params.row, 'full-caliber')}
    disabled={!params.row.userId}
/>
            ]
        }
    ];

// Přidejte další definice sloupců pod fullCaliberColumns:

const subCaliberColumns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'material', headerName: 'Material', flex: 1 },
    { field: 'totalLength', headerName: 'Total length of penetrator (mm)', flex: 1 },
    { field: 'diameter', headerName: 'Diameter (mm)', flex: 1 },
    { field: 'densityPenetrator', headerName: 'Density (kg/m³)', flex: 1 },
    { field: 'hardnessPenetrator', headerName: 'Brinell Hardness Number', flex: 1 },
    { field: 'velocity', headerName: 'Velocity (km/s)', flex: 1 },
    {
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
            
<GridActionsCellItem
    icon={<EditIcon />}
    label="Edit"
    onClick={() => handleEdit(params.row, 'sub-caliber')}
    disabled={!params.row.userId}
/>,
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleDeleteClick(params.row, 'sub-caliber')}
                disabled={!params.row.userId}
            />
        ]
    }
];

const heatColumns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'explosiveTypeName', headerName: 'Explosive Type', flex: 1 },
    { field: 'diameter', headerName: 'Diameter (mm)', flex: 1 },
    { field: 'explosiveMass', headerName: 'Explosive Mass (kg)', flex: 1 },
    { field: 'coefficient', headerName: 'Warhead Coeficient', flex: 1 },
    { field: 'efficiency', headerName: 'Efficiency (%)', flex: 1 },
    {
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
            <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                onClick={() => handleEdit(params.row, 'heat')}
                disabled={!params.row.userId}
            />,
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleDeleteClick(params.row, 'heat')}
                disabled={!params.row.userId}
            />
        ]
    }
];

const heColumns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'explosiveTypeName', headerName: 'Explosive Type', flex: 1 },
    { field: 'diameter', headerName: 'Diameter (mm)', flex: 1 },
    { field: 'explosiveMass', headerName: 'Explosive Mass (kg)', flex: 1 },
    {
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
            <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                onClick={() => handleEdit(params.row, 'he')}
                disabled={!params.row.userId}
            />,
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleDeleteClick(params.row, 'he')}
                disabled={!params.row.userId}
            />
        ]
    }
];

const explosiveTypeColumns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'energyFactor', headerName: 'TNT Equivalent Coeficient', flex: 1 }
];

const fetchPresets = async () => {
    try {
        const data = await api.get<any[]>('http://localhost:8080/api/calculator/presets/full-caliber');
        // Použijeme správný setter podle typu presetu
        setFullCaliberPresets(data); // nebo setHePresets, setHeatPresets, atd.
    } catch (error) {
        console.error('Error:', error);
        setStatus('Chyba při načítání presetů');
    }
};

const handleFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData((prev: any) => ({
        ...prev,
        [field]: event.target.value
    }));
};

// Přidejte useEffect pro načtení presetů při načtení komponenty
useEffect(() => {
    fetchPresets();
}, [presetType]); // Závislost na presetType zajistí načtení při změně typu

// Upravená funkce handleEdit s jedním parametrem
// Upravte handleEdit funkci
const handleEdit = (preset: any, type: typeof presetType) => {
    setPresetType(type);
    setCurrentPreset(preset);

    // For HEAT/HE, set explosiveTypeId from the nested object if present
    let explosiveTypeId = preset.explosiveTypeId;
    if ((type === 'heat' || type === 'he') && preset.explosiveType && preset.explosiveType.id) {
        explosiveTypeId = preset.explosiveType.id;
    }

    setFormData({
        ...preset,
        ...(explosiveTypeId && { explosiveTypeId }),
        ...(preset.angle && { angle: (preset.angle * 180 / Math.PI).toFixed(2) })
    });
    setOpenDialog(true);
};

    return (
        <>
        <Box sx={{ width: '100%' }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                <Tab label="Full Caliber" />
                <Tab label="Sub Caliber" />
                <Tab label="HEAT" />
                <Tab label="HE" />
                <Tab label="Explosive Types" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                {isLoggedIn ? (
                    <Button startIcon={<AddIcon />} onClick={() => handleAdd('full-caliber')}>Add New</Button>
                ) : (
                    <Typography>Login to add your own presets</Typography>
                )}
                <DataGrid
                    rows={fullCaliberPresets}
                    columns={fullCaliberColumns}
                    autoHeight
                />
            </TabPanel>
<TabPanel value={tabValue} index={1}>
    {isLoggedIn ? (
        <Button startIcon={<AddIcon />} onClick={() => handleAdd('sub-caliber')}>Add New</Button>
    ) : (
        <Typography>Login to add your own presets</Typography>
    )}
    <DataGrid
        rows={subCaliberPresets}
        columns={subCaliberColumns}
        autoHeight
    />
</TabPanel>

<TabPanel value={tabValue} index={2}>
    {isLoggedIn ? (
        <Button startIcon={<AddIcon />} onClick={() => handleAdd('heat')}>Add New</Button>
    ) : (
        <Typography>Login to add your own presets</Typography>
    )}
    <DataGrid
        rows={heatPresets}
        columns={heatColumns}
        autoHeight
    />
</TabPanel>

<TabPanel value={tabValue} index={3}>
    {isLoggedIn ? (
        <Button startIcon={<AddIcon />} onClick={() => handleAdd('he')}>Add New</Button>
    ) : (
        <Typography>Login to add your own presets</Typography>
    )}
    <DataGrid
        rows={hePresets}
        columns={heColumns}
        autoHeight
    />
</TabPanel>

<TabPanel value={tabValue} index={4}>
    <DataGrid
        rows={explosiveTypes}
        columns={explosiveTypeColumns}
        autoHeight
    />
</TabPanel>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    {currentPreset?.id ? 'Edit Preset' : 'Create New Preset'}
                </DialogTitle>
                <DialogContent>
  <Stack spacing={2}>
      <TextField
          label="Name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required

          fullWidth
      />
    {presetType === 'full-caliber' && (
      <>
        
        <TextField
          fullWidth
          label="Weight (kg)"
          type="number"
          value={formData.mass}
          onChange={(e) => setFormData({ ...formData, mass: e.target.value })}
        />
        <TextField
          fullWidth
          label="Velocity (m/s)"
          type="number"
          value={formData.velocity}
          onChange={(e) => setFormData({ ...formData, velocity: e.target.value })}
        />
        <TextField
          fullWidth
          label="Diameter (mm)"
          type="number"
          value={formData.diameter}
          onChange={(e) => setFormData({ ...formData, diameter: e.target.value })}
        />
        <TextField
          fullWidth
          label="DeMarre Constant (K)"
          type="number"
          value={formData.constant}
          onChange={(e) => setFormData({ ...formData, constant: e.target.value })}
        />
        <TextField
          fullWidth
          label="Thickness Exponent (n)"
          type="number"
          value={formData.thicknessExponent}
          onChange={(e) => setFormData({ ...formData, thicknessExponent: e.target.value })}
        />
        <TextField
          fullWidth
          label="Absolute Scale Exponent (s)"
          type="number"
          value={formData.scaleExponent}
          onChange={(e) => setFormData({ ...formData, scaleExponent: e.target.value })}
        />
      </>
    )}

    {(presetType === 'heat' || presetType === 'he') && (
      <>
    
        <Select
          fullWidth
          label="Explosive Type"
          value={formData.explosiveTypeId || ''}
          onChange={(e) => setFormData({ ...formData, explosiveTypeId: e.target.value })}
        >
          {explosiveTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          label="Diameter (mm)"
          type="number"
          value={formData.diameter}
          onChange={(e) => setFormData({ ...formData, diameter: e.target.value })}
        />
        <TextField
          fullWidth
          label="Explosive mass (kg)"
          type="number"
          value={formData.explosiveMass}
          onChange={(e) => setFormData({ ...formData, explosiveMass: e.target.value })}
        />
        {presetType === 'heat' && (
          <>
            <TextField
              fullWidth
              label="Warhead Coefficient"
              type="number"
              value={formData.coefficient}
              onChange={(e) => setFormData({ ...formData, coefficient: e.target.value })}
            />
            <TextField
              fullWidth
              label="Efficiency (%)"
              type="number"
              value={formData.efficiency}
              onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
            />
          </>
        )}
      </>
    )}

    {presetType === 'sub-caliber' && (
      <>
        <TextField
          fullWidth
          label="Material"
          value={formData.material}
          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
        />
        <TextField
          fullWidth
          label="Total legth of penetrator (mm)"
          type="number"
          value={formData.totalLength}
          onChange={(e) => setFormData({ ...formData, totalLength: e.target.value })}
        />
        <TextField
          fullWidth
          label="Diameter (mm)"
          type="number"
          value={formData.diameter}
          onChange={(e) => setFormData({ ...formData, diameter: e.target.value })}
        />
        <TextField
          fullWidth
          label="Density (kg/m³)"
          type="number"
          value={formData.densityPenetrator}
          onChange={(e) => setFormData({ ...formData, densityPenetrator: e.target.value })}
        />
        <TextField
          fullWidth
          label="Brinell Hardness Number"
          type="number"
          value={formData.hardnessPenetrator}
          onChange={(e) => setFormData({ ...formData, hardnessPenetrator: e.target.value })}
        />
        <TextField
          fullWidth
          label="Velocity (m/s)"
          type="number"
          value={formData.velocity}
          onChange={(e) => setFormData({ ...formData, velocity: e.target.value })}
        />
      </>
    )}
  </Stack>
</DialogContent>
<DialogActions>
  <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
  <Button 
    variant="contained" 
    color="primary" 
    onClick={handleSave}
  >
    {currentPreset ? 'Save Changes' : 'Add Preset'}
  </Button>
</DialogActions>
            </Dialog>
        </Box>
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete: "{presetToDelete?.name}"?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
      Delete
    </Button>
  </DialogActions>
</Dialog>
        </>
    );
}
