import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import TopBar from "../Components/TopBar";
import CommunityCard from "../Components/Community/CommunityCard";
import { BASE_URL } from "../baseUrl";
const API_URL = `${BASE_URL}/community`;

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData.message || "Failed to fetch communities");
      }
      const data = await response.json();
      setCommunities(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <TopBar isLoggedIn={true} />
      <Container>
        <Typography variant="h6" gutterBottom>
          All Communities
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" flexDirection="column" alignItems="center">
          {communities.map((community) => (
            <CommunityCard
              key={community.id}
              name={community.name}
              description={community.description}
              id={community.id}
            />
          ))}
        </Box>
      </Container>
    </>
  );
};

export default CommunitiesPage;
