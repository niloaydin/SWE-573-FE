import { Link, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../baseUrl";
import TopBar from "../TopBar";

const PostDetail = () => {
  const { communityId, postId } = useParams();
  const [post, setPost] = useState(null);
  const token = localStorage.getItem("token");
  console.log("Post id", postId);
  console.log("Community id", communityId);

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
          console.log("DATA", data);
          setPost(data);
        } else {
          throw new Error(await response.text());
        }
      } catch (error) {
        alert(error.message);
      }
    };

    fetchSinglePost();
  }, [postId, token]);

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
      <TopBar isLoggedIn={true} />
      {post ? (
        <Container sx={{ marginTop: "20px" }}>
          <Box sx={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}>
            <Card key={post.id} sx={{ width: "100%", marginBottom: "20px" }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  posted by: {post?.created_by?.username}
                </Typography>
                {Object.keys(post?.content).map((key) => (
                  <Typography key={key} color="text.secondary">
                    <strong>{key}: </strong>
                    {renderFieldValue(post?.content[key])}
                  </Typography>
                ))}

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => alert("edit function coming")}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Container>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </>
  );
};

export default PostDetail;
