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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    setLoading(true);
    const isSuccess = await saveChild();
    if (isSuccess) {
      navigate("/parent", { replace: true });
    }
  };

  const handleAddAnotherChild = async () => {
    setLoading(true);
    const isSuccess = await saveChild();
    if (isSuccess) {
      resetForm();
    }
  };

  const saveChild = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const response = await axios.post(
      `${backendURL}/api/child`,
      {
        name,
        previousSchool,
        dateOfBirth,
        gender,
        parent: parentId,
      },
      getAuthHeader()
    );

    setLoading(false);

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
        <h2 className="form-title">학생정보</h2>
        <div className="form-field">
          <label className="form-label" htmlFor="name">
            학생(유아)한글명:
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
          <label className="form-label" htmlFor="previousSchool">
            현재 재원중인 기관명:
          </label>
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
            생년월일:
          </label>
          <p className="text-red">
            *생년월일을 기입 시 자동으로 학년선택이 되므로 정확하게 기입해주시기
            바랍니다. 

            *기입시 상단의 년도,날짜를 선택하여 주시기 바람니다.
          
          </p>
          <input
            className="form-input"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
          
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="gender">
            성별:
          </label>
          <select
            className="form-input"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">성별을 선택하세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
        <button className="form-button" onClick={handleSave} disabled={loading}>
          {loading ? "등록..." : "등록"}
        </button>
        <button className="form-button secondary" onClick={handleAddAnotherChild} disabled={loading}>
          {loading ? "학생 추가..." : "학생 추가"}
        </button>
      </form>
    </div>
  );
}

export default ChildForm;
