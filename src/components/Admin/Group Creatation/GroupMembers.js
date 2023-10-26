import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const GroupChildren = () => {
  const [childrenData, setChildrenData] = React.useState([]);

  React.useEffect(() => {
    // Fetch the children data
    axios
      .get("/api/group/someGroupId/children")
      .then((response) => {
        setChildrenData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching children data:", error);
      });
  }, []);

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "dateOfBirth", headerName: "DOB", width: 120 },
    { field: "gender", headerName: "Gender", width: 110 },
    { field: "testGrade", headerName: "Test Grade", width: 130 },
    { field: "campus", headerName: "Campus", width: 130 },
    { field: "hadBooked", HeaderName: "Booked", width: 90 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={childrenData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
    </div>
  );
};

export default GroupChildren;
