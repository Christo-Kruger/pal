import React, { useState, useEffect } from 'react';
import EditParentModal from './EditParentModal';

function ParentList() {
  const [parents, setParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingParent, setEditingParent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Added this state for modal visibility

  const userRole = localStorage.getItem('userRole');
  const userCampus = localStorage.getItem('userCampus');

  const handleParentUpdated = (updatedParent) => {
      setParents(parents.map(p => p._id === updatedParent._id ? updatedParent : p));
  };
  
  useEffect(() => {
    async function fetchParents() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/parents`);
      let data = await response.json();
      
      if (userRole === 'admin') {
        data = data.filter(parent => parent.campus === userCampus);
      }

      setParents(data);
    }
    
    fetchParents();
  }, [userRole, userCampus]);

  const filteredParents = Array.isArray(parents) 
  ? parents.filter(parent => parent.name && parent.name.toLowerCase().includes(searchTerm.toLowerCase()))
  : [];

  return (
    <div>
      <h2>Parent List</h2>

      <div>
        <input 
          type="text" 
          placeholder="Search by parent name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
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
              <td>{parent.name}</td>
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
    </div>
  );
}

export default ParentList;
