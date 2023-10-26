import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mmnt = String(date.getMinutes()).padStart(2, "0");
  return `${mm}/${dd}/${yyyy} ${hh}:${mmnt}`;
};

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/groups/all`);
      setGroups(response.data.map((group) => ({ ...group, id: group._id })));
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit:", id);
  };

  const deleteGroup = async (id) => {
    try {
        console.log('Deleting group with ID:', id);
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.delete(`${backendURL}/api/groups/${id}`);
      
      if (response.status === 200) {
        // Update the local state to remove the deleted group
        setGroups(groups.filter(group => group.id !== id));
        toast("Group deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast("Error deleting group");
    }
  };
  


  const handleRedirect = (id) => {
    console.log("Redirect:", id);
  };

  const toggleCanBook = async (id, currentCanBook, groupName) => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.patch(`${backendURL}/api/groups/canBook/${id}`, {
        canBook: !currentCanBook,
      });
      if (response.status === 200) {
        // Update local state
        setGroups(groups.map(group => group.id === id ? { ...group, canBook: !currentCanBook } : group));
        
        // Show toast based on the updated canBook status
        toast(`${groupName} ${!currentCanBook ? "can now book" : "cannot book"}`);
      }
    } catch (error) {
      console.error("Error updating canBook:", error);
      toast("Error updating");
    }
  };

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 150,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 150,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
        field: 'canBook',
        headerName: 'Can Book',
        width: 120,
        renderCell: (params) => (
          <input 
            type="checkbox" 
            checked={params.value} 
            onChange={() => toggleCanBook(params.id, params.value, params.row.name)}
          />
        ),
      },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <button onClick={() => handleEdit(params.id)}>Edit</button>
          <button onClick={() => deleteGroup(params.id)}>Delete</button>
          <button onClick={() => handleRedirect(params.id)}>View</button>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={groups} columns={columns} />
    </div>
  );
};

export default Groups;
