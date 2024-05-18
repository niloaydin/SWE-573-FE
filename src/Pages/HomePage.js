import React, { useState, useEffect } from "react";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { BASE_URL } from "../baseUrl";
import TopBar from "../Components/TopBar";
import CommunityCard from "../Components/Community/CommunityCard";

const HomePage = () => {
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");

  const fetchCommunities = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not Authorized!");
      }
      const response = await fetch(`${BASE_URL}/community`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCommunities(data);
      } else {
        const error = await response.text();
        if (error === "Token has expired") {
          localStorage.removeItem("token");
        } else {
          throw new Error(error);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not Authorized!");
      }
      const response = await fetch(`${BASE_URL}/post`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        const error = await response.text();
        if (error === "Token has expired") {
          localStorage.removeItem("token");
        } else {
          throw new Error(error);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchCommunities();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  return (
    <>
      {" "}
      <TopBar isLoggedIn={isLoggedIn} />
      <Container>
        <Typography variant="h4" gutterBottom>
          Communities
        </Typography>
        <Grid container spacing={3}>
          {communities.map((community) => (
            <Box
              key={community.id}
              width={{ xs: "100%", sm: "50%", md: "33.33%", lg: "25%" }}
              padding="10px"
            >
              <CommunityCard
                name={community.name}
                description={community.description}
                id={community.id}
              />
            </Box>
          ))}
        </Grid>

        <Typography variant="h4" gutterBottom>
          Latest Posts
        </Typography>
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    posted by: {post.created_by.username}
                  </Typography>
                  {Object.keys(post.content).map((key) => (
                    <Typography key={key} color="text.secondary">
                      <strong>{key}: </strong>
                      {post.content[key]}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
