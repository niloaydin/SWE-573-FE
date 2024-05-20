import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { BASE_URL } from "../baseUrl";
import TopBar from "../Components/TopBar";
import CommunityCard from "../Components/Community/CommunityCard";

const HomePage = () => {
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

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
        throw new Error(error);
      }
    } catch (error) {
      if (error.message) {
        setError(error.message);
      } else {
        setError(
          "Unexpected Error Happened. Please clear your cache and try log in again"
        );
      }
    }
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCommunities = communities.filter((community) => {
    const search = searchQuery.toLowerCase();
    return (
      community.name.toLowerCase().includes(search) ||
      community.description.toLowerCase().includes(search)
    );
  });
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
        console.log(data);
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      if (error.message) {
        setError(error.message);
      } else {
        setError(
          "Unexpected Error Happened. Please clear your cache and try log in again"
        );
      }
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

  const isUrl = (value) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(value);
  };

  const renderFieldValue = (value) => {
    if (isUrl(value)) {
      return (
        <img
          src={value}
          alt="URL"
          style={{ height: "100px", widht: "100px" }}
        />
      );
    }
    return value;
  };

  return (
    <>
      <TopBar isLoggedIn={isLoggedIn} />
      {!error ? (
        <Container>
          <TextField
            variant="outlined"
            label="Search for Communities"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              width: "100%",
            }}
          />
          <Typography variant="h4" gutterBottom>
            Communities
          </Typography>
          <Grid container spacing={3}>
            {filteredCommunities.map((community) => (
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
            {posts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                <Grid item key={post.id} xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">
                        posted by: {post.created_by.username}
                      </Typography>
                      {Object.keys(post.content).map((key) => (
                        <Typography key={key} color="text.secondary">
                          <strong>{key}: </strong>
                          {renderFieldValue(post.content[key])}
                        </Typography>
                      ))}
                      <Link
                        to={`/community/${post.community.id}/post-details/${post.id}`}
                      >
                        <Button variant="contained" color="primary">
                          Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
      ) : (
        <Typography variant="h4">{error}</Typography>
      )}
    </>
  );
};

export default HomePage;
