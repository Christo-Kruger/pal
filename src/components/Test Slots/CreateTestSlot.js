import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const CreateTestSlot = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    testGrade: [],
    campus: "",
    timeSlots: [],
    group: "",
  });
  const [selectedGroup, setSelectedGroup] = useState(null); //
  const [showNewTimeSlot, setShowNewTimeSlot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState({
    startTime: "",
    endTime: "",
    capacity: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      if (formData.testGrade.includes(value)) {
        setFormData({
          ...formData,
          testGrade: formData.testGrade.filter((grade) => grade !== value),
        });
      } else {
        setFormData({
          ...formData,
          testGrade: [...formData.testGrade, value],
        });
      }
    } else {
      let processedValue = value;
      // If the field is 'group', extract and store the group's ID
      if (name === "group") {
        const selectedGroup = JSON.parse(value);
        setSelectedGroup(selectedGroup); // Update the selectedGroup state
        processedValue = selectedGroup._id;
      }
      setFormData({ ...formData, [name]: processedValue });
    }
  };
  const handleNewTimeSlotChange = (field, value) => {
    setNewTimeSlot((prev) => ({ ...prev, [field]: value }));
  };

  const addTimeSlot = () => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: "", endTime: "", capacity: "" }],
    }));
  };


  const [groups, setGroups] = useState([]); // New state for groups

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/groups/groupNames`
        );
        setGroups(response.data);
      } catch (error) {
        console.log("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const confirmAddTimeSlot = () => {
    if (newTimeSlot.startTime && newTimeSlot.endTime && newTimeSlot.capacity) {
      setFormData((prev) => ({
        ...prev,
        timeSlots: [...prev.timeSlots, newTimeSlot],
      }));
      setNewTimeSlot({ startTime: "", endTime: "", capacity: "" }); // Reset the new time slot data
      setShowNewTimeSlot(false); // Hide the fields for adding new time slot
    } else {
      alert("Please fill out all fields for the new time slot.");
    }
  };

  const handleTimeSlotChange = (index, field, value) => {
    console.log("Index:", index);
    console.log("Field:", field);
    console.log("Value:", value);

    const newSlot = formData.timeSlots[index]
      ? { ...formData.timeSlots[index] }
      : {};
    newSlot[field] = value;

    const updatedSlots = Object.assign([], formData.timeSlots, {
      [index]: newSlot,
    });

    setFormData({ ...formData, timeSlots: updatedSlots });
  };

  const removeTimeSlot = (index) => {
    const updatedSlots = [...formData.timeSlots];
    updatedSlots.splice(index, 1);
    setFormData({ ...formData, timeSlots: updatedSlots });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Test slot created successfully!");
      setLoading(false);
      setFormData({
        title: "",
        date: "",
        testGrade: [],
        campus: "",
        timeSlots: [],
        group: "",
      });
      setShowNewTimeSlot(false);
    } catch (error) {
      alert("Error creating test slot.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onRequestClose} fullWidth>
      <DialogTitle style={{ textAlign: "center" }}>
        Create Test Slot
      </DialogTitle>
  
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel id="group-label">Group</InputLabel>
            <Select
              labelId="group-label"
              name="group"
              value={selectedGroup ? JSON.stringify(selectedGroup) : ""}
              onChange={handleChange}
            >
              {groups.map((group, index) => (
                <MenuItem key={index} value={JSON.stringify(group)}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel id="campus-label">Campus</InputLabel>
            <Select
              labelId="campus-label"
              name="campus"
              value={formData.campus}
              onChange={handleChange}
            >
              <MenuItem value="분당">분당</MenuItem>
              <MenuItem value="동탄">동탄</MenuItem>
              <MenuItem value="수지">수지</MenuItem>
            </Select>
          </FormControl>
  
          <TextField
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            required
          />
  
          {formData.timeSlots.map((slot, index) => (
            <div key={index}>
              <TextField
                type="time"
                value={slot.startTime}
                onChange={(e) => handleTimeSlotChange(index, "startTime", e.target.value)}
                required
              />
              <TextField
                type="time"
                value={slot.endTime}
                onChange={(e) => handleTimeSlotChange(index, "endTime", e.target.value)}
                required
              />
              <TextField
                label="Capacity"
                type="number"
                value={slot.capacity}
                onChange={(e) => handleTimeSlotChange(index, "capacity", e.target.value)}
                required
              />
              <Button onClick={() => removeTimeSlot(index)}>
                Remove Time Slot
              </Button>
            </div>
          ))}
          <Button onClick={addTimeSlot}>
            Add Time Slot
          </Button>
  
          <InputLabel>Age Group</InputLabel>
          <FormGroup
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {[
              "예비 5세",
              "예비 6세",
              "예비 7세",
              "예비 초등 1학년",
              "예비 초등 2학년",
              "예비 초등 3학년",
              "예비 초등 4학년",
              "예비 초등 5학년",
              "예비 초등 6학년",
              "예비 중등 1학년",
              "예비 중등 2학년",
            ].map((grade) => (
              <div
                key={grade}
                style={{ margin: "8px", display: "flex", alignItems: "center" }}
              >
                <Checkbox
                  name="testGrade"
                  value={grade}
                  checked={formData.testGrade.includes(grade)}
                  onChange={handleChange}
                />
                <span>{grade}</span>
              </div>
            ))}
          </FormGroup>
  
          <DialogActions>
            <Button onClick={onRequestClose} color="primary">
              Close
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              color="primary"
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                "Create Slot"
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );  
};

export default CreateTestSlot;
