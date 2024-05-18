import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const MembersModal = ({ open, handleClose, members }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Members List</DialogTitle>
      <DialogContent>
        {members.map((member, index) => (
          <div key={index}>
            {member.roleName === "OWNER" ? (
              <span>{member.username} (Owner)</span>
            ) : (
              <span>{member.username}</span>
            )}
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MembersModal;
