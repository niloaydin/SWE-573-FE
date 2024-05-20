import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import { BASE_URL } from "../../baseUrl";
import TopBar from "../TopBar";

const CreatePost = () => {
  const { id: communityId } = useParams();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates(communityId);
  }, [communityId]);

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
      alert(error.message);
    }
  };

  const handleTemplateChange = (event) => {
    const templateId = parseInt(event.target.value);
    const template = templates.find((template) => template.id === templateId);
    setSelectedTemplate(template);
    // const initialFieldValues = {};
    // template.datafields.forEach((field) => {
    //   initialFieldValues[field.name] = "";
    // });
    // setFieldValues(initialFieldValues);
  };

  const handleFieldValueChange = (fieldName, value) => {
    setFieldValues({ ...fieldValues, [fieldName]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("FIELDSSSS", fieldValues);
      let postCreationUrl;
      if (selectedTemplate.name === "Default Template") {
        postCreationUrl = `${BASE_URL}/post/${communityId}/create`;
      } else {
        postCreationUrl = `${BASE_URL}/post/${communityId}/create?templateId=${selectedTemplate.id}`;
      }
      const response = await fetch(postCreationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fieldValues),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      alert("post created!");
      navigate(`/community/${communityId}`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <TopBar isLoggedIn={true} />
      <h2>Create Post</h2>
      <select onChange={handleTemplateChange}>
        <option value="">Select Template</option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
      {selectedTemplate && (
        <div>
          {selectedTemplate.datafields.map((field) => (
            <Box
              key={field.id}
              sx={{ marginBottom: "10px", marginTop: "20px" }}
            >
              <TextField
                label={field.name}
                value={fieldValues[field.name]}
                type={field.type.toLowerCase()}
                style={{ width: "80%" }}
                multiline
                onChange={(e) =>
                  handleFieldValueChange(field.name, e.target.value)
                }
              />
            </Box>
          ))}
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
