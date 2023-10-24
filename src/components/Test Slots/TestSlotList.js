import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import UpdateTestSlot from "./UpdateTestSlot";
import "react-toastify/dist/ReactToastify.css";
import "./Timeslot.css";

const TestSlotList = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTestSlot, setSelectedTestSlot] = useState(null);

  const flattenTimeSlots = (testSlots) => {
    const flattenedData = [];
    testSlots.forEach((testSlot) => {
      testSlot.timeSlots.forEach((timeSlot) => {
        const flatRow = {
          ...testSlot,
          ...timeSlot,
          id: `${testSlot._id}_${timeSlot._id}`, // Generating a unique ID
        };
        delete flatRow.timeSlots; // Removing the nested timeSlots array
        flattenedData.push(flatRow);
      });
    });
    return flattenedData;
  };

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots/admin`
        );
        const flattenedSlots = flattenTimeSlots(response.data);
        setTimeSlots(flattenedSlots);
      } catch (error) {
        toast.error("Error fetching test slots.");
      }
    };

    fetchTimeSlots();
  }, []);

  const handleEdit = (row) => {
    const testSlotId = row.id.split('_')[0]; // Extracting the testSlot._id part
    setSelectedTestSlot({ ...row, _id: testSlotId });
  };
  

  const handleUpdateModalClose = () => {
    setSelectedTestSlot(null);
  };

  const handleTestSlotUpdated = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots/admin`
      );
      const flattenedSlots = flattenTimeSlots(response.data);
      setTimeSlots(flattenedSlots);
      toast.success("Test slot list updated!");
    } catch (error) {
      toast.error("Error updating test slot list.");
    }
  };
  const handleCellEdit = async (params) => {
    const field = params.field;
    const id = params.id.split('_')[1]; // Extract the timeSlot's ID from the uniqueId
    const testSlotId = params.id.split('_')[0]; // Extract the testSlot's ID from the uniqueId
    const value = params.props.value;
  
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots/${testSlotId}/timeSlots/${id}`,
        { [field]: value }
      );
      if (response.status === 200) {
        toast.success("Time slot updated successfully!");
        // Optionally, you can refresh the DataGrid here
      }
    } catch (error) {
      toast.error("Error updating time slot.");
    }
  };
  
  const handleDelete = async (testSlotId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this test slot?"
    );
    if (!confirmDelete) {
      return; // User clicked "Cancel", so do nothing.
    }
  
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots/${testSlotId}`
      );
      setTimeSlots((prevTimeSlots) =>
        prevTimeSlots.filter((testSlot) => testSlot._id !== testSlotId)
      );
      toast.success("Test slot deleted successfully!");
    } catch (error) {
      toast.error("Error deleting test slot.");
    }
  };
  

  const renderTooltip = (grades) => (
    <Tooltip id="button-tooltip">{grades.join(", ")}</Tooltip>
  );

  const columns = [
    { field: "title", headerName: "Title", width: 150 },
    { field: "campus", headerName: "Campus", width: 130},
    {
      field: "testGrade",
      headerName: "Age Group",
      width: 160,
      renderCell: (params) => (
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip(params.value)}
        >
          <span>
            {params.value[0]}
            {params.value.length > 1 && "..."}
          </span>
        </OverlayTrigger>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      width: 130,
      valueGetter: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: "startTime", headerName: "Start Time", width: 130,  editable: true, },
    { field: "endTime", headerName: "End Time", width: 130,  editable: true, },
    { field: "capacity", headerName: "Capacity", width: 130,  editable: true, },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        const testSlotId = params.id.split('_')[0]; // Extracting the testSlot._id part from the uniqueId
        return (
          <>
            <button onClick={() => handleEdit(params.row)}>Edit</button>
            <button onClick={() => handleDelete(testSlotId)}>Delete</button> {/* Passing testSlotId here */}
          </>
        );
      },
    }
  ];

  return (
    <div className="timeslots">
      <h2>Test Slot List</h2>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={timeSlots}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onEditCellChangeCommitted={handleCellEdit}  // Add this line
        />
      </div>

      {selectedTestSlot && (
        <UpdateTestSlot
          testSlotId={selectedTestSlot._id}
          onClose={handleUpdateModalClose}
          onUpdated={handleTestSlotUpdated}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default TestSlotList;
