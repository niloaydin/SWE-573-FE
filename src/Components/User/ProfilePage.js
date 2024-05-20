import React, { useState, useEffect } from "react";
import { Typography, Avatar, Grid, List, Button } from "@mui/material";
import TopBar from "../TopBar";
import { BASE_URL } from "../../baseUrl";
import CommunityCard from "../Community/CommunityCard";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

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
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);
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
      <div style={{ flexGrow: 1, marginTop: "16px" }}>
        {userData ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "20px",
                }}
              >
                <div>
                  <Avatar
                    style={{ width: "120px", height: "120px" }}
                    alt="User Avatar"
                    src={userData.avatar}
                  />
                </div>
                <div>
                  <Typography variant="h5">{userData.username}</Typography>
                  <Typography variant="body1">
                    {userData.firstName} {userData.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {userData.email}
                  </Typography>
                </div>
              </div>
              <Link to={`/edit-profile`}>
                <Button> Edit Profile</Button>
              </Link>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">Communities Owned</Typography>
              <List>
                {userData.ownedCommunities.map((community) => (
                  <div style={{ border: "solid" }}>
                    <CommunityCard
                      name={community.name}
                      description={community.description}
                      id={community.id}
                    />
                  </div>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">Communities Joined</Typography>
              <List>
                {userData.joinedCommunities.map((community) => (
                  <div style={{ border: "solid" }}>
                    <CommunityCard
                      name={community.name}
                      description={community.description}
                      id={community.id}
                    />
                  </div>
                ))}
              </List>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="h6">"Loading..."</Typography>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
