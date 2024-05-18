import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import TopBar from "../TopBar";
import { BASE_URL } from "../../baseUrl";
export const API_URL = `${BASE_URL}/community`;

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleIsPublicChange = (event) => {
    setIsPublic(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          isPublic,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create community");
      }
      const data = await response.json();
      navigate(`/community/${data.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <TopBar isLoggedIn={true} />
      <Container>
        <Typography variant="h6" gutterBottom>
          Create a New Community
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box marginBottom={2}>
                <TextField
                  label="Community Name"
                  value={name}
                  onChange={handleNameChange}
                  fullWidth
                  required
                />
              </Box>
              <Box marginBottom={2}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                  fullWidth
                  required
                  multiline
                  rows={4}
                />
              </Box>
              <Box marginBottom={2}>
                <label>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={handleIsPublicChange}
                  />
                  Is Public
                </label>
              </Box>
              <Button type="submit" variant="contained" color="primary">
                Create Community
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default CreateCommunity;
