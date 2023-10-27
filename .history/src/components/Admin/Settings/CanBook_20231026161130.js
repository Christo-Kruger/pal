import React, { useState, useEffect } from 'react';
import { DataGrid, useGridApiRef, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CanBookGrid() {
  const [rows, setRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAgeGroup, setNewAgeGroup] = useState('');
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const apiRef = useGridApiRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${backendURL}/api/canBook/`);
      const transformedData = response.data.map(row => ({
        id: row._id,
        ageGroup: row.ageGroup,
        canBook: row.canBook
      }));
      setRows(transformedData);
    };
    fetchData();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'ageGroup', headerName: 'Age Group', width: 150 },
    { field: 'canBook', headerName: 'Can Book', width: 150, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <IconButton onClick={() => deleteRow(params.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const deleteRow = async (id) => {
    await axios.delete(`${backendURL}/api/canBook/${id}`);
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleAddAgeGroup = async () => {
    const newRecord = { ageGroup: newAgeGroup, canBook: false };
    const response = await axios.post(`${backendURL}/api/canBook/`, newRecord);
    setRows([...rows, { id: response.data._id, ...response.data }]);
    setDialogOpen(false);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
        Add Age Group
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        apiRef={apiRef}
        components={{
          Toolbar: GridToolbar,
        }}
      />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New Age Group</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the age group:</DialogContentText>
          <TextField autoFocus margin="dense" label="Age Group" type="text" fullWidth value={newAgeGroup} onChange={(e) => setNewAgeGroup(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddAgeGroup} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
