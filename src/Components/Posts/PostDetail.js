import { Link, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../baseUrl";
import TopBar from "../TopBar";

const PostDetail = () => {
  const { communityId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        const response = await fetch(`${BASE_URL}/post/${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          throw new Error(await response.text());
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchSinglePost();
  }, [postId, token]);

  useEffect(() => {
    fetchTemplates();
  }, [post]);
  useEffect(() => {
    if (post) {
      const initialFormData = post?.content;
      console.log("INITIAL FORM DATA", initialFormData);
      setFormData(initialFormData);
    }
  }, [post]);

  useEffect(() => {
    setTemplate(templates.find((template) => template.id === post?.templateId));
  }, [templates, post]);

  const fetchTemplates = async () => {
    try {
      const [communityTemplatesResponse, allTemplatesResponse] =
        await Promise.all([
          fetch(`${BASE_URL}/community/${communityId}/templates`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${BASE_URL}/template`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      if (communityTemplatesResponse.ok && allTemplatesResponse.ok) {
        const communityTemplates = await communityTemplatesResponse.json();
        const allTemplates = await allTemplatesResponse.json();
        const defaultTemplate = allTemplates.find(
          (template) => template.name === "Default Template"
        );

        const combinedTemplates = defaultTemplate
          ? [defaultTemplate, ...communityTemplates]
          : communityTemplates;
        setTemplates(combinedTemplates);
      } else {
        console.error("Failed to fetch templates");
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setError(error.message);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/post/${communityId}/edit/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedPost = { ...post, content: formData };
        setPost(updatedPost);
        setEditMode(false);
        alert("Post edited successfully!");
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      setError(error.message);
    }
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
    <>
      {" "}
      {error && (
        <Typography variant="h6" color="red">
          {error}
        </Typography>
      )}
      <TopBar isLoggedIn={true} />
      <Container sx={{ marginTop: "20px" }}>
        <Box sx={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}>
          {post && (
            <Card key={post.id} sx={{ width: "100%", marginBottom: "20px" }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  posted by: {post?.created_by?.username}
                </Typography>
                {editMode ? (
                  <>
                    {template.datafields.map((field) => (
                      <TextField
                        key={field.name}
                        name={field.name}
                        label={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        type={field.type.toLowerCase()}
                        sx={{ marginBottom: "10px" }}
                      />
                    ))}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    {Object.keys(post.content).map((key) => (
                      <Typography key={key} color="text.secondary">
                        <strong>{key}: </strong>
                        {renderFieldValue(post.content[key])}
                      </Typography>
                    ))}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </>
  );
};

export default PostDetail;
