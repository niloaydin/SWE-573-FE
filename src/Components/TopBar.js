import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { BASE_URL } from "../baseUrl";

function TopBar({ isLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error.message);
      alert(error.message);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          style={{ marginRight: "auto" }}
        >
          My App
        </Typography>

        {isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/create-community">
              Create a Community
            </Button>
            <Button color="inherit" component={Link} to="/communities">
              Communities
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
