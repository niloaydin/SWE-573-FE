import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import TemplateCard from "./TemplateCard"; // Import the TemplateCard component
import { API_URL } from "../../baseUrl";

const TemplateListDialog = ({ open, handleClose, templates, onDelete }) => {
  return (
    <>
      <Button onClick={open}>View Templates</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Templates List</DialogTitle>
        <DialogContent>
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDelete={onDelete}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TemplateListDialog;
