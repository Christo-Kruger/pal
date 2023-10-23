import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    console.log(backendURL);

    try {
      const response = await fetch(`${backendURL}/api/groups/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        toast.success("Group created successfully");
      } else {
        toast.error("Failed to create group");
      }
    } catch (error) {
      toast.error("There was an error creating the group");
      console.error("There was an error creating the group", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Create Group</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          label="Group Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          label="Start Date"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          label="End Date"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Create Group
        </Button>
      </form>
      <ToastContainer />
    </Container>
  );
};

export default CreateGroup;
