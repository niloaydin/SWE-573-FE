import React, { useState, useEffect } from "react";
import {
  Typography,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import TopBar from "../TopBar";
import { BASE_URL } from "../../baseUrl";
import CommunityCard from "../Community/CommunityCard";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
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
        alert(error.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <TopBar isLoggedIn={true} />
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
          <Typography variant="body1">Loading...</Typography>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
