import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
const backendURL = process.env.REACT_APP_BACKEND_URL;

export default function Campus() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [newCampusName, setNewCampusName] = useState("");
  const [ageGroupDialogOpen, setAgeGroupDialogOpen] = useState(false);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
  const [newAgeGroups, setNewAgeGroups] = useState([{ ageGroup: '', canBook: false }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/campus`);
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    };
    fetchData();
  }, []);

  const handleAddCampusClose = () => {
    setOpen(false);
  };

  const handleAddCampusConfirm = async () => {
    if (newCampusName === "") {
      console.error("Name cannot be empty");
      return;
    }
  
    // Validate age groups if necessary
    if (newAgeGroups.some(ag => ag.ageGroup === '')) {
      console.error("All age groups must have names");
      return;
    }
  
    try {
      // Include the newAgeGroups in the API call
      await axios.post(`${backendURL}/api/campus/create`, {
        name: newCampusName,
        ageGroups: newAgeGroups  // Assuming the backend accepts it in this format
      });
  
      // Refresh the campus data
      const response = await axios.get(`${backendURL}/api/campus`);
      setRows(response.data);
  
      // Reset state and close dialog
      toast.success("Campus added successfully");
      setNewCampusName("");
      setNewAgeGroups([{ ageGroup: '', canBook: false }]); // Reset to initial state
      setOpen(false);
    } catch (error) {
      console.error("Error creating campus:", error);
      toast.error("Error creating campus");
    }
  };
  
  // Add new age group row to the state
const addNewAgeGroup = () => {
  setNewAgeGroups([...newAgeGroups, { ageGroup: '', canBook: false }]);
};

// Remove an age group row from the state
const removeNewAgeGroup = (index) => {
  const copy = [...newAgeGroups];
  copy.splice(index, 1);
  setNewAgeGroups(copy);
};

// Update an age group
const handleAgeGroupChange = (index, event) => {
  const values = [...newAgeGroups];
  values[index].ageGroup = event.target.value;
  setNewAgeGroups(values);
};

  const handleDeleteClick = (id) => () => {
    axios
      .delete(`${backendURL}/api/campus/${id}`)
      .then(async () => {
        const response = await axios.get(`${backendURL}/api/campus`);
        setRows(response.data);
        toast.success("Campus deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting campus:", error);
        toast.error("Error deleting campus");
      });
  };

  const handleRowClick = (params) => {
    const ageGroupsWithCampusId = (params.row.ageGroups || []).map(ag => ({ ...ag, campusId: params.row._id }));
    setSelectedAgeGroups(ageGroupsWithCampusId);
    setAgeGroupDialogOpen(true);
  };
  

  const handleAgeGroupCanBookChange = async (campusId, ageGroup, checked) => {
    try {
      const response = await axios.patch(`${backendURL}/api/campus/agegroup/${campusId}`, {
        ageGroup: ageGroup,
        canBook: checked,
      });
  
      if (response.status === 200) {
        const updatedCampus = response.data;
  
        // Find the row that has the updated campus ID and update its ageGroups.
        const updatedRows = rows.map(row => {
          if (row._id === updatedCampus._id) {
            // Find the index of the age group to be updated
            const ageGroupIndex = row.ageGroups.findIndex(ag => ag.ageGroup === ageGroup);
  
            // Update the canBook value of that age group
            row.ageGroups[ageGroupIndex].canBook = checked;
          }
          return row;
        });
  
        // Update the rows state
        setRows(updatedRows);
  
        toast.success("Successfully updated age group");
      }
    } catch (error) {
      console.error("Error updating age group:", error);
      toast.error("Error updating age group");
    }
  };
  
  

  function EditToolbar() {
    const handleClick = () => {
      setOpen(true);
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add Campus
        </Button>
      </GridToolbarContainer>
    );
  }

 



  const handleCanBookChange = (id, value) => {
    axios
      .patch(`${backendURL}/api/campus/canbook/${id}`, { canBook: value })
      .then(async () => {
        const response = await axios.get(`${backendURL}/api/campus`);
        setRows(response.data);
        toast.success("Can Book updated successfully");
      })
      .catch((error) => {
        console.error("Error updating canBook:", error);
        toast.error("Error updating can book");
      });
  };

  const columns = [
    { field: "name", headerName: "Name", width: 180, editable: false },
    {
      field: "canBook",
      headerName: "Can Book",
      width: 180,
      editable: false,
      renderCell: (params) => {
        return (
          <Checkbox
            checked={params.value}
            onChange={(event) =>
              handleCanBookChange(params.id, event.target.checked)
            }
          />
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
        />,
      ],
    },
    {
      field: "ageGroup",
      headerName: "Age Groups",
      sortable: false,
      width: 125,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <button onClick={() => handleRowClick(params)}>
            Show Age Groups
          </button>
        );
      },
    },
  ];

  const ageGroupColumns = [
    { field: "ageGroup", headerName: "Age Group", width: 180 },
    {
      field: "canBook",
      headerName: "Can Book",
      width: 180,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) =>
            handleAgeGroupCanBookChange(params.row.campusId, params.row.ageGroup, event.target.checked)
          }
        />
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        slots={{
          toolbar: EditToolbar,
        }}
      />
   <Dialog open={open} onClose={handleAddCampusClose}>
    <DialogTitle>Add New Campus</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Please enter the name of the new campus and its age groups.
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Campus Name"
        type="text"
        fullWidth
        value={newCampusName}
        onChange={(e) => setNewCampusName(e.target.value)}
      />

      {/* Add age group fields */}
      {newAgeGroups.map((inputField, index) => (
        <div key={index}>
          <TextField
            margin="dense"
            id={`ageGroup-${index}`}
            label="Age Group"
            type="text"
            value={inputField.ageGroup}
            onChange={event => handleAgeGroupChange(index, event)}
          />
          <IconButton onClick={() => addNewAgeGroup()} color="primary">
            <AddCircleIcon />
          </IconButton>
          {index !== 0 && (
            <IconButton onClick={() => removeNewAgeGroup(index)} color="secondary">
              <RemoveCircleIcon />
            </IconButton>
          )}
        </div>
      ))}

    </DialogContent>
    <DialogActions>
      <Button onClick={handleAddCampusClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleAddCampusConfirm} color="primary">
        Add
      </Button>
    </DialogActions>
  </Dialog>
      <Dialog
    
        open={ageGroupDialogOpen}
        onClose={() => setAgeGroupDialogOpen(false)}
      >
        <DialogTitle>Manage Age Groups</DialogTitle>
        <DialogContent>
          <DataGrid
          style={{minHeight:"400px"}}
            rows={selectedAgeGroups}
            columns={ageGroupColumns}
            getRowId={(row) => row._id}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAgeGroupDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
