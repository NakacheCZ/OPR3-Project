import React from 'react';
import { useEffect, useState } from 'react';
import '../App.css';
import {
    DataGrid,
    GridColDef,
    GridActionsCellItem,
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
    Stack, DialogContentText, Typography,
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

export default function ShellPresets({ username }: { username?: string }) {
    const [tabValue, setTabValue] = useState(0);
    const [fullCaliberPresets, setFullCaliberPresets] = useState<any[]>([]);
    const [subCaliberPresets, setSubCaliberPresets] = useState<SubCaliberPreset[]>([]);
    const [heatPresets, setHeatPresets] = useState<any[]>([]);
    const [hePresets, setHePresets] = useState<any[]>([]);
    
const [explosiveTypes, setExplosiveTypes] = useState<ExplosiveType[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
const [currentPreset, setCurrentPreset] = useState<any>(null);
const [presetType, setPresetType] = useState<'full-caliber' | 'sub-caliber' | 'heat' | 'he'>('full-caliber');
const [formData, setFormData] = useState<any>({});
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [resetDialogOpen, setResetDialogOpen] = useState(false);
const [presetToDelete, setPresetToDelete] = useState<{ id: number; name: string } | null>(null);
const [error, setError] = useState<string>('');

const isGuest = username === 'guest';
const isAdmin = username === 'admin';

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
      await fetchAllData();
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

const handleSave = async () => {
    try {
        if (!formData.name?.trim()) {
            setError('Please fill in the preset name');
            return;
        }

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
                throw new Error('Unknown preset type');
        }

        if (currentPreset?.id) {
            await api.put(`http://localhost:8080/api/calculator/presets/${presetType}/${currentPreset.id}`, formData);
        } else {
            await api.post(`http://localhost:8080/api/calculator/presets/${presetType}`, formData);
        }
        
        setOpenDialog(false);
        await fetchAllData();
    } catch (error) {
        console.error('Error:', error);
        setError('Error saving preset');
    }
};

useEffect(() => {
    api.get<ExplosiveType[]>('http://localhost:8080/api/calculator/explosive-types')
        .then(data => setExplosiveTypes(data));
}, []);

const handleAdd = (type: 'full-caliber' | 'sub-caliber' | 'heat' | 'he') => {
    setPresetType(type);
    setCurrentPreset(null);
    setFormData({});
    setOpenDialog(true);
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

const handleEdit = (preset: any, type: typeof presetType) => {
    setPresetType(type);
    setCurrentPreset(preset);
    setFormData({
        ...preset,
        explosiveTypeId: preset.explosiveType?.id
    });
    setOpenDialog(true);
};

const handleResetPresets = async () => {
    try {
        await api.post('http://localhost:8080/api/presets/reset', {});
        setResetDialogOpen(false);
        await fetchAllData();
    } catch (error) {
        console.error('Error resetting presets:', error);
    }
};

    const columns: GridColDef[] = [
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
                    disabled={isGuest || isAdmin}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDeleteClick(params.row, 'full-caliber')}
                    disabled={isGuest || isAdmin}
                />
            ]
        }
    ];

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
                disabled={isGuest || isAdmin}
            />,
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleDeleteClick(params.row, 'sub-caliber')}
                disabled={isGuest || isAdmin}
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
                disabled={isGuest || isAdmin}
            />,
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleDeleteClick(params.row, 'heat')}
                disabled={isGuest || isAdmin}
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
                disabled={isGuest || isAdmin}
            />,
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleDeleteClick(params.row, 'he')}
                disabled={isGuest || isAdmin}
            />
        ]
    }
];

const explosiveTypeColumns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'energyFactor', headerName: 'TNT Equivalent Coeficient', flex: 1 }
];

    return (
        <div style={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} centered>
                    <Tab label="Full Caliber" />
                    <Tab label="Sub Caliber" />
                    <Tab label="HEAT" />
                    <Tab label="HE" />
                    <Tab label="Explosive Types" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                {!isGuest && <Button startIcon={<AddIcon />} onClick={() => handleAdd('full-caliber')}>Add New</Button>}
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={fullCaliberPresets} columns={columns} />
                </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                {!isGuest && <Button startIcon={<AddIcon />} onClick={() => handleAdd('sub-caliber')}>Add New</Button>}
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={subCaliberPresets} columns={subCaliberColumns} />
                </div>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                {!isGuest && <Button startIcon={<AddIcon />} onClick={() => handleAdd('heat')}>Add New</Button>}
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={heatPresets} columns={heatColumns} />
                </div>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
                {!isGuest && <Button startIcon={<AddIcon />} onClick={() => handleAdd('he')}>Add New</Button>}
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={hePresets} columns={heColumns} />
                </div>
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={explosiveTypes} columns={explosiveTypeColumns} />
                </div>
            </TabPanel>

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Button 
                    variant="contained" 
                    style={{ backgroundColor: (isGuest || isAdmin) ? 'darkgrey' : 'grey', color: 'white' }} 
                    onClick={() => setResetDialogOpen(true)}
                    disabled={isGuest || isAdmin}
                >
                    Reset Presets
                </Button>
            </Box>

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
                                <TextField fullWidth label="Weight (kg)" type="number" value={formData.mass} onChange={(e) => setFormData({ ...formData, mass: e.target.value })} />
                                <TextField fullWidth label="Velocity (m/s)" type="number" value={formData.velocity} onChange={(e) => setFormData({ ...formData, velocity: e.target.value })} />
                                <TextField fullWidth label="Diameter (mm)" type="number" value={formData.diameter} onChange={(e) => setFormData({ ...formData, diameter: e.target.value })} />
                                <TextField fullWidth label="DeMarre Constant (K)" type="number" value={formData.constant} onChange={(e) => setFormData({ ...formData, constant: e.target.value })} />
                                <TextField fullWidth label="Thickness Exponent (n)" type="number" value={formData.thicknessExponent} onChange={(e) => setFormData({ ...formData, thicknessExponent: e.target.value })} />
                                <TextField fullWidth label="Absolute Scale Exponent (s)" type="number" value={formData.scaleExponent} onChange={(e) => setFormData({ ...formData, scaleExponent: e.target.value })} />
                            </>
                        )}
                        {(presetType === 'heat' || presetType === 'he') && (
                            <>
                                <Select fullWidth label="Explosive Type" value={formData.explosiveTypeId || ''} onChange={(e) => setFormData({ ...formData, explosiveTypeId: e.target.value })}>
                                    {explosiveTypes.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <TextField fullWidth label="Diameter (mm)" type="number" value={formData.diameter} onChange={(e) => setFormData({ ...formData, diameter: e.target.value })} />
                                <TextField fullWidth label="Explosive mass (kg)" type="number" value={formData.explosiveMass} onChange={(e) => setFormData({ ...formData, explosiveMass: e.target.value })} />
                                {presetType === 'heat' && (
                                    <>
                                        <TextField fullWidth label="Warhead Coefficient" type="number" value={formData.coefficient} onChange={(e) => setFormData({ ...formData, coefficient: e.target.value })} />
                                        <TextField fullWidth label="Efficiency (%)" type="number" value={formData.efficiency} onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })} />
                                    </>
                                )}
                            </>
                        )}
                        {presetType === 'sub-caliber' && (
                            <>
                                <TextField fullWidth label="Material" value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} />
                                <TextField fullWidth label="Total legth of penetrator (mm)" type="number" value={formData.totalLength} onChange={(e) => setFormData({ ...formData, totalLength: e.target.value })} />
                                <TextField fullWidth label="Diameter (mm)" type="number" value={formData.diameter} onChange={(e) => setFormData({ ...formData, diameter: e.target.value })} />
                                <TextField fullWidth label="Density (kg/m³)" type="number" value={formData.densityPenetrator} onChange={(e) => setFormData({ ...formData, densityPenetrator: e.target.value })} />
                                <TextField fullWidth label="Brinell Hardness Number" type="number" value={formData.hardnessPenetrator} onChange={(e) => setFormData({ ...formData, hardnessPenetrator: e.target.value })} />
                                <TextField fullWidth label="Velocity (m/s)" type="number" value={formData.velocity} onChange={(e) => setFormData({ ...formData, velocity: e.target.value })} />
                            </>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        {currentPreset ? 'Save Changes' : 'Add Preset'}
                    </Button>
                </DialogActions>
            </Dialog>
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
            <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
                <DialogTitle>Confirm Reset</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to reset your presets? This will delete all your custom presets and replace them with the defaults.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleResetPresets} color="warning" autoFocus>
                        Reset
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
