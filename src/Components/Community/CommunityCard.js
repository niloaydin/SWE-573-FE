import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useHistory } from "react-router-dom"; // Correct import statement
import { useNavigate } from "react-router-dom";

const CommunityCard = ({ name, description, id }) => {
  const navigate = useNavigate();

  const handleVisitCommunity = () => {
    navigate(`/community/${id}`);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleVisitCommunity}
        >
          Visit
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunityCard;
