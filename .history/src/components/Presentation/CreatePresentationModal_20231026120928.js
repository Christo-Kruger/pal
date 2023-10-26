import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';

const CreatePresentationModal = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    ageGroup: '',
    timeSlots: [],
    campus: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTimeSlot = () => {
    setFormData((prevData) => ({
      ...prevData,
      timeSlots: [
        ...prevData.timeSlots,
        { startTime: "", endTime: "", maxAttendees: "" },
      ],
    }));
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData((prevData) => {
      const updatedTimeSlots = [...prevData.timeSlots];
      updatedTimeSlots.splice(index, 1);
      return { ...prevData, timeSlots: updatedTimeSlots };
    });
  };

  const handleTimeSlotChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedTimeSlots = [...prevData.timeSlots];
      updatedTimeSlots[index][field] = value;
      return { ...prevData, timeSlots: updatedTimeSlots };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert time strings to full date objects before sending
    const updatedTimeSlots = formData.timeSlots.map((slot) => {
      const startTime = new Date(`${formData.date}T${slot.startTime}`);
      const endTime = new Date(`${formData.date}T${slot.endTime}`);
      return {
        ...slot,
        startTime,
        endTime,
      };
    });

    const updatedFormData = {
      ...formData,
      ageGroup: formData.ageGroup,
      timeSlots: updatedTimeSlots,
    };

    try {
      console.log(updatedFormData);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/presentations`,
        updatedFormData
      );
      toast.success("Presentation created successfully!");
      onRequestClose();
    } catch (error) {
      toast.error("Error creating presentation.");
    }
  };
  return (
    <Dialog open={isOpen} onClose={onRequestClose} fullWidth>
      <DialogTitle style={{ textAlign: "center" }}>
        Create Presentation
      </DialogTitle>
  
      <DialogContent>
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <TextField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            style={{ marginBottom: "20px" }}
          />
          <TextField
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            style={{ marginBottom: "20px" }}
          />
          <TextField
            label="Location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            style={{ marginBottom: "20px" }}
          />
          <TextField
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            style={{ marginBottom: "20px" }}
          />
  
          {formData.timeSlots.map((timeSlot, index) => (
            <div key={index}>
              <TextField
                type="time"
                value={timeSlot.startTime}
                onChange={(e) => handleTimeSlotChange(index, "startTime", e.target.value)}
                required
                variant="outlined"
                style={{ marginBottom: "20px" }}
              />
              <TextField
                type="time"
                value={timeSlot.endTime}
                onChange={(e) => handleTimeSlotChange(index, "endTime", e.target.value)}
                required
                variant="outlined"
                style={{ marginBottom: "20px" }}
              />
              <TextField
                label="Max Attendees"
                type="number"
                value={timeSlot.maxAttendees}
                onChange={(e) => handleTimeSlotChange(index, "maxAttendees", e.target.value)}
                required
                variant="outlined"
                style={{ marginBottom: "20px" }}
              />
              <Button onClick={() => handleRemoveTimeSlot(index)} variant="text" color='secondary'>
                Remove Time Slot
              </Button>
            </div>
          ))}
          <Button onClick={handleAddTimeSlot} variant="outlined" color='primary' style={{ marginBottom: "20px" }}>
            Add Time Slot
          </Button>
  
          <InputLabel>Age Group</InputLabel>
          <FormControl fullWidth required>
            <Select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              variant="outlined"
              style={{ marginBottom: "20px" }}
            >
              <MenuItem value="">
                <em>Select Age Group</em>
              </MenuItem>
              <MenuItem value="Kids">J Lee Kids</MenuItem>
              <MenuItem value="Elementary">J Lee Elementary</MenuItem>
            </Select>
          </FormControl>
  
          <InputLabel>Campus</InputLabel>
          <FormControl fullWidth required>
            <Select
              name="campus"
              value={formData.campus}
              onChange={handleChange}
              variant="outlined"
              style={{ marginBottom: "20px" }}
            >
              <MenuItem value="">
                <em>Select Campus</em>
              </MenuItem>
              <MenuItem value="전체">전체</MenuItem>
              <MenuItem value="동탄">동탄</MenuItem>
            </Select>
          </FormControl>
  
          <DialogActions>
            <Button onClick={onRequestClose} color="primary">
              Close
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create Presentation
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
  
};

export default CreatePresentationModal;
