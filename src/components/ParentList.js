import React, { useState, useEffect } from 'react';
import EditParentModal from './EditParentModal';
import { ProgressBar } from "react-loader-spinner";


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

  return (
    <div>
    <h2>Parent List</h2>

    {isLoading ? (
      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <ProgressBar
          color="#00BFFF"
          height={100}
          width={100}
        />
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
      
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Phone</th>
            <th>Campus</th>
            <th>Children's Names</th>
            <th>Test Grades</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredParents.map(parent => (
            <tr key={parent._id}>
              <td>{parent.email}</td>
              <td>{parent.phone}</td>
              <td>{parent.campus}</td>
              <td>
                {parent.children.map(child => child.name).join(', ')}
              </td>
              <td>
                {parent.children.map(child => child.testGrade).join(', ')}
              </td>
              <td>
                <button onClick={() => { setEditingParent(parent); setIsModalOpen(true); }}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {
        editingParent && 
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
