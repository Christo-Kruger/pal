import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

const UpdateTestSlot = ({ testSlotId, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    campus: "",
    testGrade: [],
    capacity: "",
  });

  useEffect(() => {
    const fetchTestSlot = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots/${testSlotId}`
        );
        setFormData({
          ...response.data,
          date: new Date(response.data.date).toISOString().split("T")[0],
        });
      } catch (error) {
        alert("Error fetching test slot.");
      }
    };
    fetchTestSlot();
  }, [testSlotId]);

  const handleChange = (e) => {
    if (e.target.name === "testGrade") {
      const value = e.target.value;
      if (e.target.checked) {
        setFormData((prevData) => ({
          ...prevData,
          testGrade: [...prevData.testGrade, value],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          testGrade: prevData.testGrade.filter((grade) => grade !== value),
        }));
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/timeSlots/${testSlotId}`,
        formData
      );
      onClose();
      onUpdated();
    } catch (error) {
      alert("Error updating test slot.");
    }
  };

  return (
    <div>
      <Modal
        isOpen={true}
        onRequestClose={onClose}
        contentLabel="Update Test Slot"
        style={{
          content: {
            maxWidth: "500px",
            margin: "0 auto", // This will center the modal
          },
        }}
      >
        <h2>Update Test Slot</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Campus:</label>
            <select
              name="campus"
              value={formData.campus}
              onChange={handleChange}
            >
              <option value="수지">수지</option>
              <option value="동탄">동탄</option>
              <option value="분당">분당</option>
            </select>
          </div>
          <div>
            <div>
              <label>Test Grade:</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px",
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    name="testGrade"
                    value="예비 5세"
                    checked={formData.testGrade.includes("예비 5세")}
                    onChange={handleChange}
                  />
                  <label>예비 5세</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="testGrade"
                    value="예비 6세"
                    checked={formData.testGrade.includes("예비 6세")}
                    onChange={handleChange}
                  />
                  <label>예비 6세</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="testGrade"
                    value="예비 7세"
                    checked={formData.testGrade.includes("예비 7세")}
                    onChange={handleChange}
                  />
                  <label>예비 7세</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="testGrade"
                    value="예비 초등 1학년"
                    checked={formData.testGrade.includes("예비 초등 1학년")}
                    onChange={handleChange}
                  />
                  <label>예비 초등 1학년</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="testGrade"
                    value="예비 초등 2학년"
                    checked={formData.testGrade.includes("예비 초등 2학년")}
                    onChange={handleChange}
                  />
                  <label>예비 초등 2학년</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="testGrade"
                    value="예비 초등 3학년"
                    checked={formData.testGrade.includes("예비 초등 3학년")}
                    onChange={handleChange}
                  />
                  <label>예비 초등 3학년</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="testGrade"
                    value="예비 초등 4학년"
                    checked={formData.testGrade.includes("예비 초등 4학년")}
                    onChange={handleChange}
                  />
                  <label>예비 초등 4학년</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="testGrade"
                    value="예비 초등 5학년"
                    checked={formData.testGrade.includes("예비 초등 5학년")}
                    onChange={handleChange}
                  />
                  <label>예비 초등 5학년</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="testGrade"
                    value="예비 초등 6학년"
                    checked={formData.testGrade.includes("예비 초등 6학년")}
                    onChange={handleChange}
                  />
                  <label>예비 초등 6학년</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="testGrade"
                    value="예비 중등 1학년"
                    checked={formData.testGrade.includes("예비 중등 1학년")}
                    onChange={handleChange}
                  />
                  <label>예비 중등 1학년</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="testGrade"
                    value="예비 중등 2학년"
                    checked={formData.testGrade.includes("예비 중등 2학년")}
                    onChange={handleChange}
                  />
                  <label>예비 중등 2학년</label>
                </div>
              </div>
            </div>

            <label>Capacity:</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Update Slot</button>
        </form>
      </Modal>
    </div>
  );
};

export default UpdateTestSlot;
