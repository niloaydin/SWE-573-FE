import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../baseUrl";
import { TextField, Button, Typography, Box } from "@mui/material";

function LoginPage() {
  const [formState, setFormState] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formState);
    setIsLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (resp.ok) {
        const result = await resp.json();
        if (result.token !== null) {
          localStorage.setItem("token", result.token);
          navigate(`/`);
        }
      } else {
        const error = await resp.text();
        throw new Error(error);
      }
    } catch (err) {
      console.log("HAYDAAA", err.message);
      setWarning(err.message);
    }
    setIsLoading(false);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  useEffect(() => {
    const warningTime = setTimeout(() => {
      setWarning("");
    }, 2500);
    return () => clearTimeout(warningTime);
  }, [warning]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="text-center warning-container text-danger">
        <Typography variant="body1" className="warning text-danger">
          {warning}
        </Typography>
      </div>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            p: "64px 450px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            label="Email"
            id="email"
            name="email"
            type="text"
            value={formState.email}
            onChange={handleChange}
            required
            fullWidth
            sx={{ mb: 2, width: "450px" }}
          />
          <TextField
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            required
            fullWidth
            sx={{ mb: 2, width: "450px" }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ mb: 2, width: "450px" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <Typography> Don't you have an account?</Typography>
          <Button
            onClick={handleRegisterClick}
            variant="contained"
            color="secondary"
          >
            Register here!
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default LoginPage;
