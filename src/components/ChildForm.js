import React, { useState } from "react";
import axios from "axios";
import { getAuthHeader } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../styles/ChildForm.css";

function ChildForm({ parentId }) {
  const [name, setName] = useState("");
  const [previousSchool, setPreviousSchool] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    const isSuccess = await saveChild();
    if (isSuccess) {
      navigate("/parent", { replace: true });
    }
  };

  const handleAddAnotherChild = async () => {
    const isSuccess = await saveChild();
    if (isSuccess) {
      resetForm();
    }
  };

  const saveChild = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const response = await axios.post(`${backendURL}/api/child`, {
      name,
      previousSchool,
      dateOfBirth,
      gender,
      parent: parentId
    }, getAuthHeader());

    if (response.status === 201) {
      console.log("Child created:", response.data);
      return true;
    } else {
      console.error("Failed to create child:", response.data);
      return false;
    }
  };

  const resetForm = () => {
    setName("");
    setPreviousSchool("");
    setDateOfBirth("");
    setGender("");
  };

  return (
    <div className="form-container">  
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <h2 className="form-title">Child Details</h2>
        <div className="form-field">
          <label className="form-label" htmlFor="name">
            Name:
          </label>
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
        <label className="form-label" htmlFor="previousSchool">Last Attended School:</label>
          <input
            className="form-input"
            type="text"
            value={previousSchool}
            onChange={(e) => setPreviousSchool(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="dateOfBirth">
            Date of Birth:
          </label>
          <input
            className="form-input"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
    <label className="form-label" htmlFor="gender">Gender:</label>
    <select
        className="form-input"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required
    >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
    </select>
</div>
        <button className="form-button" onClick={handleSave}>
          Save
        </button>
        <button className="form-button secondary" onClick={handleAddAnotherChild}>Add Another Child</button>
      </form>
     
    </div>
  );
}

export default ChildForm;
