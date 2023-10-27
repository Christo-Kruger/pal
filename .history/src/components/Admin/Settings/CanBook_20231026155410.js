import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';

export default function CanBookGrid() {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'ageGroup', headerName: 'Age Group', width: 150 },
    { field: 'canBook', headerName: 'Can Book', width: 150 },
  ];

  useEffect(() => {
    // Fetch all canBook age groups
    const fetchData = async () => {
      const response = await axios.get(`{/api/canBook/`);
      setRows(response.data);
    };
    fetchData();
  }, []);

  const addRow = async () => {
    // Add a new canBook record
    const newRecord = { ageGroup: 'NewAgeGroup', canBook: true };
    const response = await axios.post('/api/your_route_here', newRecord);
    setRows([...rows, response.data]);
  };

  const updateRow = async () => {
    // Update the first selected row
    if (selectedRows.length > 0) {
      const idToUpdate = selectedRows[0];
      const recordToUpdate = rows.find((row) => row.id === idToUpdate);
      recordToUpdate.canBook = !recordToUpdate.canBook;
      const response = await axios.put(`/api/your_route_here/${idToUpdate}`, recordToUpdate);
      setRows(rows.map((row) => (row.id === idToUpdate ? response.data : row)));
    }
  };

  const deleteRow = async () => {
    // Delete the first selected row
    if (selectedRows.length > 0) {
      const idToDelete = selectedRows[0];
      await axios.delete(`/api/your_route_here/${idToDelete}`);
      setRows(rows.filter((row) => row.id !== idToDelete));
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <button onClick={addRow}>Add Row</button>
      <button onClick={updateRow}>Update Selected Row</button>
      <button onClick={deleteRow}>Delete Selected Row</button>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        onSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection.selectionModel);
        }}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
}
