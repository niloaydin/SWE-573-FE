import React, { useState } from "react";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../baseUrl";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isValidURL = (url) => {
    // Basic URL validation
    return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !isValidURL(formData.avatar)
    ) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const resp = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (resp.ok) {
        navigate(`/`);
      } else {
        const error = await resp.text();
        throw new Error(error);
      }
    } catch (err) {
      alert(err.message);
    }
    console.log("Form submitted:", formData);
    //@TODO - Add API call to create user
  };

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" align="center">
            Signup
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Avatar"
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Register;
