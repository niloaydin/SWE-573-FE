import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MembersModal from "./MembersListDialog";
import TemplateListDialog from "./TemplateDialog";
// import CreatePostModal from "./CreatePostDialog";
// import CreatePostTemplateModal from "./CreatePostTemlpateDialog";
import { BASE_URL } from "../../baseUrl";
import TopBar from "../TopBar";
export const API_URL = `${BASE_URL}/community`;

const CommunityDetail = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [fieldValues, setFieldValues] = useState({});
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [openMembersModal, setOpenMembersModal] = useState(false);
  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvancedSearchActive, setIsAdvancedSearchActive] = useState(false);
  const [isPostOwner, setIsPostOwner] = useState(false);

  const token = localStorage.getItem("token");

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchCommunityDetails(id);
    fetchCommunityPosts(id);
    fetchCommunityMembers(id);
    fetchTemplates(id);
  }, [id]);

  useEffect(() => {
    if (members.length > 0) {
      checkIsMember();
    }
  }, [members, email]);

  useEffect(() => {
    if (community !== null) {
      checkIsOwner();
    }
  }, [community, email]);

  const checkIsMember = () => {
    console.log("current user", email);
    const isMember = members.some((user) => {
      console.log("USER", user);
      return user.email === email;
    });
    setIsMember(isMember);
  };

  const checkIsOwner = () => {
    console.log("COMMUNITY EMAIL", community.owner?.email);
    if (community.owner.email === email) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  };

  const fetchCommunityDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const singleCommunity = await resp.json();
      setCommunity(singleCommunity);
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchCommunityMembers = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/${id}/members`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const usersInCommunity = await resp.json();

      setMembers(usersInCommunity);
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchCommunityPosts = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/${id}/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const postsInCommunity = await resp.json();

      setPosts(postsInCommunity);
    } catch (err) {
      alert(err.message);
    }
  };
  const fetchCurrentUserDetails = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.ok) {
        return await resp.json();
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      return null;
    }
  };
  const fetchTemplates = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/templates`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("TEMPLATESSSS", data);
        setTemplates(data);
      } else {
        console.error("Failed to fetch templates");
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleJoinCommunity = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/join/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.ok) {
        const userDetails = await fetchCurrentUserDetails();
        if (userDetails) {
          setMembers((prevMembers) => [...prevMembers, userDetails]);
          setIsMember(true);
        }
      } else {
        const errorData = await resp.json();
        console.error("Failed to join community:", errorData);
      }
    } catch (err) {
      console.error("Error joining community:", err);
      alert(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${id}/deletePost/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeletePostTemplate = async (templateId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/template/${id}/deleteTemplate/${templateId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setTemplates((prevTemplates) =>
          prevTemplates.filter((template) => template.id !== templateId)
        );
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.templateId !== templateId)
        );
      } else {
        alert("Failed to delete template");
      }
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  const handleLeaveCommunity = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (isOwner) {
        throw new Error(
          "You cant leave the community since you are the owner!"
        );
      }
      console.log("COMMUNITY ID", id);
      const resp = await fetch(`${API_URL}/leave/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp?.ok) {
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.email !== email)
        );
        setIsMember(false);
      }
    } catch (err) {
      console.error("Error leaving community:", err);
      alert(err.message);
    }
  };

  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
    setFieldValues({});
    setFilteredPosts([]);
  };

  const handleFieldValueChange = (fieldName, value) => {
    setFieldValues({ ...fieldValues, [fieldName]: value });
  };

  const handleSubmitForAdvancedSearch = async () => {
    try {
      const queryParams = {
        template: selectedTemplate,
        ...fieldValues,
      };

      const queryString = new URLSearchParams(queryParams).toString();

      const response = await fetch(
        `${API_URL}/${id}/searchPosts?${queryString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFilteredPosts(data);
        if (data.length === 0) {
          alert("There is no posts with this requirements!");
        }
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      alert(error.message);
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

  const handleSeeMembers = () => {
    setOpenMembersModal(true);
  };
  const handleSeeTemplates = () => {
    console.log("TEMPLATE AC");
    setOpenTemplateModal(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const basicSearchPosts = posts.filter((post) => {
    const search = searchQuery.toLowerCase();
    return Object.keys(post.content).some((key) =>
      post.content[key].toLowerCase().includes(search)
    );
  });

  return (
    <>
      <TopBar isLoggedIn={true}></TopBar>
      <Container>
        <TextField
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            marginTop: "20px",
            marginBottom: "10px",
            width: "100%",
          }}
        />
        <div style={{ borderStyle: "solid", marginBottom: "10px" }}>
          <Typography variant="h6" gutterBottom>
            {community && community.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {community && community.description}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Member Count: {community && members.length}
          </Typography>
        </div>

        {isMember ? (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleLeaveCommunity(id)}
          >
            Leave Community
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleJoinCommunity(id)}
          >
            Join Community
          </Button>
        )}

        <Box>
          {isOwner && (
            <Link to={`/community/${id}/create-template`}>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginRight: "10px", marginTop: "10px" }}
              >
                Create Post Template
              </Button>
            </Link>
          )}
          <Link to={`/community/${id}/create-post`}>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: "10px", marginTop: "10px" }}
            >
              Create Post
            </Button>
          </Link>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSeeMembers}
            sx={{ marginRight: "10px", marginTop: "10px" }}
          >
            See Members
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSeeTemplates}
            sx={{ marginRight: "10px", marginTop: "10px" }}
          >
            See Post Templates
          </Button>
          <Button
            variant="contained"
            color={isAdvancedSearchActive ? "error" : "primary"}
            sx={{ marginRight: "10px", marginTop: "10px" }}
            onClick={() => setIsAdvancedSearchActive(!isAdvancedSearchActive)}
          >
            {!isAdvancedSearchActive
              ? "Advanced Search"
              : "Close Advanced Search"}
          </Button>
        </Box>
      </Container>
      {isAdvancedSearchActive ? (
        <div>
          <Container>
            <Typography variant="h6" gutterBottom>
              Advanced Search
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select Template</InputLabel>
              <Select value={selectedTemplate} onChange={handleTemplateChange}>
                <MenuItem value="">Select Template</MenuItem>
                {templates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedTemplate && (
              <div>
                {templates
                  .find((template) => template.id === selectedTemplate)
                  ?.datafields.map((field) => (
                    <Box
                      key={field.id}
                      sx={{ marginBottom: "10px", marginTop: "20px" }}
                    >
                      <TextField
                        label={field.name}
                        style={{ width: "100%" }}
                        value={fieldValues[field.name] || ""}
                        type={field.type.toLowerCase()}
                        onChange={(e) =>
                          handleFieldValueChange(field.name, e.target.value)
                        }
                      />
                    </Box>
                  ))}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitForAdvancedSearch}
                >
                  Search
                </Button>
              </div>
            )}
          </Container>
          <Container sx={{ marginTop: "20px" }}>
            <Box sx={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}>
              {filteredPosts.map((post, index) => (
                <Card
                  key={post.id}
                  sx={{ width: "100%", marginBottom: "20px" }}
                >
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
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </Button>
                    <Link to={`/community/${id}/post-details/${post.id}`}>
                      <Button variant="contained" color="primary">
                        Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </div>
      ) : (
        <Container sx={{ marginTop: "20px" }}>
          <Box sx={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}>
            {basicSearchPosts.map((post, index) => (
              <Card key={post.id} sx={{ width: "100%", marginBottom: "20px" }}>
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
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </Button>
                  <Link to={`/community/${id}/post-details/${post.id}`}>
                    <Button variant="contained" color="primary">
                      Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      )}
      {openMembersModal && (
        <MembersModal
          open={openMembersModal}
          handleClose={() => setOpenMembersModal(false)}
          members={members}
        />
      )}
      {openTemplateModal && (
        <TemplateListDialog
          open={openTemplateModal}
          handleClose={() => setOpenTemplateModal(false)}
          templates={templates}
          onDelete={handleDeletePostTemplate}
        />
      )}
    </>
  );
};

export default CommunityDetail;
