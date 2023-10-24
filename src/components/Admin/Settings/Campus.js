import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from '@mui/material/Checkbox';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backendURL = process.env.REACT_APP_BACKEND_URL;

export default function Campus() {
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [newCampusName, setNewCampusName] = React.useState("");
  

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/campus`);
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error('Error fetching data');
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

    try {
        await axios.post(`${backendURL}/api/campus/create`, {
          name: newCampusName,
        });
        const response = await axios.get(`${backendURL}/api/campus`);
        setRows(response.data);
        toast.success('Campus added successfully');
        setNewCampusName("");
        setOpen(false);
      } catch (error) {
        console.error("Error creating campus:", error);
        toast.error('Error creating campus');
      }
    };

    const handleDeleteClick = (id) => () => {
        axios
          .delete(`${backendURL}/api/campus/${id}`)
          .then(async () => {
            const response = await axios.get(`${backendURL}/api/campus`);
            setRows(response.data);
            toast.success('Campus deleted successfully');
          })
          .catch((error) => {
            console.error("Error deleting campus:", error);
            toast.error('Error deleting campus');
          });
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
        toast.success('Can Book updated successfully');
      })
      .catch((error) => {
        console.error("Error updating canBook:", error);
        toast.error('Error updating can book');
      });
  };

  const columns = [
    { field: "name", headerName: "Name", width: 180, editable: false },
    {
        field: 'canBook',
        headerName: 'Can Book',
        width: 180,
        editable: false,
        renderCell: (params) => {
          return (
            <Checkbox
              checked={params.value}
              onChange={(event) => handleCanBookChange(params.id, event.target.checked)}
            />
          );
        }
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
            Please enter the name of the new campus.
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
    </Box>
  );
}
