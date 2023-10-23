import React, { useState, useEffect } from 'react';
import EditParentModal from './EditParentModal';
import { ProgressBar } from "react-loader-spinner";
import { DataGrid } from "@mui/x-data-grid";


function ParentList() {
  const [parents, setParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingParent, setEditingParent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Added this state for modal visibility
  const [refresh, setRefresh] = useState(false);
  const userRole = localStorage.getItem('userRole');
  const userCampus = localStorage.getItem('userCampus');
  const [isLoading, setIsLoading] = useState(true); // set the initial state to true


  const handleParentUpdated = (updatedParent) => {
    if (updatedParent) {
      setParents(parents.map(p => p._id === updatedParent._id ? updatedParent : p));
    } else {
      // This means a parent was deleted. Adjust your state or logic here as needed.
    }
    setRefresh(prev => !prev);  // Toggle the refresh state regardless.
  };
  
  useEffect(() => {
    async function fetchParents() {
      try {
        setIsLoading(true); // Begin loading
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/parents`);
        let data = await response.json();
        
        if (userRole === 'admin') {
          data = data.filter(parent => parent.campus === userCampus);
        }
        setParents(data);
        setIsLoading(false); // End loading
      } catch (error) {
        console.error("Error fetching parents:", error);
        setIsLoading(false); // End loading on error as well
      }
  }
  
    fetchParents();
  }, [userRole, userCampus,refresh]);

  const filteredParents = Array.isArray(parents) 
? parents.filter(parent => parent.children.some(child => child?.name?.includes(searchTerm)))
: [];

const rows = filteredParents.map(parent => ({
  id: parent._id,
  email: parent.email,
  phone: parent.phone,
  campus: parent.campus,
  childrenNames: parent.children.map(child => child.name).join(', '),
  testGrades: parent.children.map(child => child.testGrade).join(', '),
}));

const columns = [
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "campus", headerName: "Campus", width: 150 },
  { field: "childrenNames", headerName: "Children's Names", width: 250 },
  { field: "testGrades", headerName: "Test Grades", width: 250 },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => (
      <button onClick={() => {
        const parentToEdit = filteredParents.find(parent => parent._id === params.id);
        setEditingParent(parentToEdit);
        setIsModalOpen(true);
      }}>Edit</button>
    ),
  },
];

return (
  <div>
    <h2>Parent List</h2>
    {isLoading ? (
      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <ProgressBar color="#00BFFF" height={100} width={100} />
      </div>
    ) : (
      <>
        <div>
          <input 
            type="text" 
            placeholder="Search by child name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
        {editingParent && 
          <EditParentModal 
            isOpen={isModalOpen} 
            onRequestClose={() => { setEditingParent(null); setIsModalOpen(false); }} 
            onParentUpdated={handleParentUpdated} 
            parent={editingParent} 
          />
        }
      </>
    )}
  </div>
);
}

export default ParentList;