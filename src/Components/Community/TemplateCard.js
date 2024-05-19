import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";

const TemplateCard = ({ template, onDelete }) => {
  return (
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {template.name}
        </Typography>
        <Box>
          {template.datafields.map((field, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              <strong>{field.name}: </strong>
              {field.type} {field.required ? "(Required)" : "(Optional)"}
            </Typography>
          ))}
        </Box>
        <Button color="error" onClick={() => onDelete(template.id)}>
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
