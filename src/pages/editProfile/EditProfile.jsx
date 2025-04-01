import React, { useEffect, useState } from "react";
import styles from "./EditProfile.module.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const EditProfile = () => {
  let [editUser, setEditUser] = useState({});

  let { id } = useParams(); // gets id value from current URL
  console.log(id);

  let navigate = useNavigate();

  useEffect(() => {
    async function getEditUser() {
      let { data } = await axios.get(`http://localhost:3001/users/${id}`);
      console.log(data);
      setEditUser(data);
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
      await axios.patch(`http://localhost:3001/users/${id}`, editUser);
      localStorage.removeItem("userid");
      navigate("/");
    } catch (error) {
      console.log("Error while edit user", error);
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
            value={editUser.username}
            onChange={handleEditUser}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            value={editUser.email}
            onChange={handleEditUser}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="text"
            placeholder="Enter password"
            name="password"
            value={editUser.password}
            onChange={handleEditUser}
          />
        </div>
        <div className={styles.btnGroup}>
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
