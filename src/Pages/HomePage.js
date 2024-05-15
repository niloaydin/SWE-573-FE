import React, { useState, useEffect } from "react";

import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import { BASE_URL } from "../baseUrl";

const HomePage = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    // Fetch communities and posts when the component mounts
    fetchCommunities();
  }, []);

  //   useEffect(() => {
  //     fetchPosts();
  //   }, []);

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
      console.log(`COMMUNITY RESPONSE = ${JSON.stringify(response)}`);
      if (response?.ok) {
        const data = await response.json();
        setCommunities(data);
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  //   const fetchPosts = async () => {
  //     try {
  //       const response = await fetch(`${BASE_URL}/post`);
  //       if (response.ok) {
  //         const data = await response.json();
  //         setPosts(data);
  //       } else {
  //         const error = await response.text();
  //         throw new Error(error);
  //       }
  //     } catch (error) {
  //       alert(error.message);
  //     }
  //   };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Communities
      </Typography>
      <Grid container spacing={3}>
        {communities.map((community) => (
          <Grid item key={community.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {community.name}
                </Typography>
                <Typography color="text.secondary">
                  {community.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" gutterBottom>
        Latest Posts
      </Typography>
      {/* <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item key={post.id} xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {post.templateName}
                </Typography>
                <Typography color="text.secondary">{post.content}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid> */}
    </Container>
  );
};

export default HomePage;
