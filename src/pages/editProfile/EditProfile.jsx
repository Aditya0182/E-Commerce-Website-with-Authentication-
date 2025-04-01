import React, { useState, useEffect } from "react";
import styles from "./EditProfile.module.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  let [editUser, setEditUser] = useState({});
  let { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    async function getEditUser() {
      console.log("Fetching user with ID:", id);
      try {
        let { data } = await axios.get(`https://j-son-server.onrender.com/users/${id}`);
        console.log("User data received:", data);
        setEditUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    getEditUser();
  }, [id]);

  let handleEditUser = (e) => {
    let { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  let formSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`https://j-son-server.onrender.com/users/${id}`, editUser);
      console.log("Update successful:", response);
      localStorage.removeItem("userid");
      navigate("/");
    } catch (error) {
      console.error("Error while editing user:", error);
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
      }
    }
  };

  const handleDeleteProfile = async (e) => {
    e.preventDefault(); // Prevent any default form behavior
    console.log("Delete button clicked, ID:", id);
    try {
      // Add headers explicitly
      const response = await axios.delete(`https://j-son-server.onrender.com/users/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Delete successful, response:", response);
      localStorage.removeItem("userid");
      navigate("/");
    } catch (error) {
      // Check if the request was actually sent
      if (error.request) {
        console.error("Request was made but no response received:", error.request);
      } else if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  return (
    <div className={styles.editprofileContainer}>
      <form className={styles.signupForm} onSubmit={formSubmit}>
        <h2>Update Your Account</h2>
        <div className={styles.formGroup}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            name="username"
            value={editUser.username || ""}
            onChange={handleEditUser}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            value={editUser.email || ""}
            onChange={handleEditUser}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="text"
            placeholder="Enter password"
            name="password"
            value={editUser.password || ""}
            onChange={handleEditUser}
          />
        </div>
        <div className={styles.btnGroup}>
          <button type="submit">Update</button>
          <button type="button" className={styles.deleteBtn} onClick={handleDeleteProfile}>Delete Profile</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;