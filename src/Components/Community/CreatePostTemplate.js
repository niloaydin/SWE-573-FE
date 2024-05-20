import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  FormControl,
  FormControlLabel,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
} from "@mui/material";
import TopBar from "../TopBar";
import { BASE_URL } from "../../baseUrl";

const PostTemplateCreation = () => {
  const [templateName, setTemplateName] = useState("");
  const [dataFields, setDataFields] = useState([
    { name: "", type: "TEXT", isRequired: false },
  ]);
  const { id: communityId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleChange = (index, field, value) => {
    const newFields = [...dataFields];
    newFields[index][field] = value;
    setDataFields(newFields);
  };

  const handleAddField = () => {
    setDataFields([
      ...dataFields,
      { name: "", type: "TEXT", isRequired: false },
    ]);
  };
  const handleDeleteField = (index) => {
    const newFields = [...dataFields];
    newFields.splice(index, 1);
    setDataFields(newFields);
  };
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (dataFields.length === 0) {
        throw new Error("Template fields cannot be empty");
      }
      for (let i = 0; i < dataFields.length; i++) {
        if (!dataFields[i].name.trim()) {
          throw new Error("Field name cannot be empty");
        }
      }
      const response = await fetch(
        `${BASE_URL}/template?communityId=${communityId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            templateName,
            dataFields,
          }),
        }
      );
      if (response?.ok) {
        navigate(`/community/${communityId}`);
        const responseData = await response.json();
      } else {
        const errorData = await response.text();
        throw new Error(errorData);
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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <TopBar isLoggedIn={true} />
      {error && (
        <Typography variant="h6" color="red">
          {error}
        </Typography>
      )}
      <TextField
        label="Template Name"
        required
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        style={{ marginTop: "20px" }}
      />
      {dataFields.map((field, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            marginTop: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Data Field"
              value={field.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              style={{ marginRight: "30px" }}
            />
            <FormControl style={{ marginRight: "20px", width: "120px" }}>
              <TextField
                label="Data Type"
                select
                value={field.type}
                onChange={(e) => handleChange(index, "type", e.target.value)}
              >
                <MenuItem value="TEXT">Text</MenuItem>
                <MenuItem value="NUMBER">Number</MenuItem>
                <MenuItem value="DATE">Date</MenuItem>
                <MenuItem value="URL">URL</MenuItem>
              </TextField>
            </FormControl>
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={field.isRequired}
                onChange={(e) =>
                  handleChange(index, "isRequired", e.target.checked)
                }
              />
            }
            label="Required"
          />
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteField(index)}
          >
            Delete
          </Button>
        </div>
      ))}
      <div style={{ display: "flex" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddField}
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            marginRight: "10px",
          }}
        >
          Add Field
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          Submit Form
        </Button>
      </div>
    </div>
  );
};

export default PostTemplateCreation;
