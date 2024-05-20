import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Grid, Avatar } from "@mui/material";
import { BASE_URL } from "../../baseUrl";
import TopBar from "../TopBar";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [editedUserData, setEditedUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    avatar: "",
  });
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        setEditedUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          avatar: data.avatar || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setError(error.message);
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (
        (editedUserData["avatar"] !== null ||
          editedUserData["avatar"] !== "") &&
        !isUrl(editedUserData["avatar"])
      ) {
        throw new Error("Provide a proper url for Avatar!");
      }
      const response = await fetch(`${BASE_URL}/users/profile/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUserData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setUserData(data);

      navigate("/profile");
    } catch (error) {
      console.error("Error updating user data:", error.message);
      setError(error.message);
    }
  };

  const isUrl = (value) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(value);
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      <TopBar isLoggedIn={true} />

      {error && (
        <Typography variant="h6" color="red">
          {error}
        </Typography>
      )}
      {userData ? (
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Avatar
              style={{ width: "120px", height: "120px", margin: "20%" }}
              alt="User Avatar"
              src={userData.avatar}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h5">Edit Profile</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="firstName"
                label="First Name"
                value={editedUserData.firstName}
                onChange={handleChange}
                style={{ width: "80%", marginTop: "10px" }}
              />
              <TextField
                name="lastName"
                label="Last Name"
                value={editedUserData.lastName}
                onChange={handleChange}
                style={{ width: "80%", marginTop: "10px" }}
              />
              <TextField
                name="username"
                label="Username"
                value={editedUserData.username}
                onChange={handleChange}
                style={{ width: "80%", marginTop: "10px" }}
              />
              <TextField
                name="avatar"
                label="Avatar"
                value={editedUserData.avatar}
                onChange={handleChange}
                style={{ width: "80%", marginTop: "10px" }}
              />
            </form>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </div>
  );
};

export default EditProfilePage;
