import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ParentChildList() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [groupNames, setGroupNames] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkGroup, setBulkGroup] = useState("");

  const fetchData = async () => {
    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const childResponse = await axios.get(`${backendURL}/api/groups/children`);
      const fetchedData = childResponse.data.map((child, index) => ({
        id: index,
        ...child,
      }));
      setData(fetchedData);

      const groupResponse = await axios.get(
        `${backendURL}/api/groups/groupNames`
      );
      setGroupNames(groupResponse.data);
    } catch (error) {
      toast.error("Failed to fetch data.");
      setError("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGroupChange = async (rowId, selectedGroup) => {
    try {
      const rowData = data.find((row) => row.id === rowId);
      if (!rowData) {
        toast.error("Row data not found");
        return;
      }

      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.patch(
        `${backendURL}/api/groups/updateGroupAssignments`,
        {
          childIds: [rowData.id],
          groupName: selectedGroup,
        }
      );

      if (response.status === 200) {
        toast.success("Group updated successfully");
        fetchData();
      }
    } catch (error) {
      toast.error("Error updating group.");
    }
  };

  const handleBulkGroupChange = async () => {
    if (selectedRows.length === 0) {
      toast.warning("No rows selected for bulk update.");
      return;
    }

    try {
      const selectedRowData = selectedRows.map((id) =>
        data.find((row) => row.id === id)
      );
      const childIds = selectedRowData.map((row) => row.id);

      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.patch(
        `${backendURL}/api/groups/updateGroupAssignments`,
        {
          childIds,
          groupName: bulkGroup,
        }
      );

      if (response.status === 200) {
        toast.success("Group updated successfully for selected users.");
        fetchData();
      }
    } catch (error) {
      toast.error("Error updating group.");
    }
  };

  const CustomToolbar = () => {
    return (
      <FormControl fullWidth>
        <InputLabel>Bulk Group Assignment</InputLabel>
        <Select
          value={bulkGroup}
          onChange={(e) => {
            setBulkGroup(e.target.value);
          }}
        >
          {groupNames.map((group, index) => (
            <MenuItem key={index} value={group.name}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
        <button onClick={handleBulkGroupChange}>Apply Bulk Update</button>
      </FormControl>
    );
  };

  const columns = [
    { field: "childName", headerName: "Child Name", width: 150 },
    { field: "campus", headerName: "Campus", width: 150},
    { field: "testGrade", headerName: "Test Grade", width: 150 },
    { field: "parentName", headerName: "Parent Name", width: 150 },
    { field: "bookedAt", headerName: "Booked At", width: 200 },
    {
      field: "attendedPresentation",
      headerName: "Attended Presentation",
      width: 200,
    },
    {
      field: "group",
      headerName: "Group",
      width: 200,
      renderCell: (params) => (
        <FormControl fullWidth>
          <InputLabel>Group</InputLabel>
          <Select
            value={params.row.group || ""}
            onChange={(e) => handleGroupChange(params.row.id, e.target.value)}
          >
            {groupNames.map((group, index) => (
              <MenuItem key={index} value={group.name}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
  ];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        checkboxSelection
        onSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection.selectionModel);
        }}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
      <ToastContainer />
    </div>
  );
}
