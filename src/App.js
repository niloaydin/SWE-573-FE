import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PrivateRoutes from "./Auth/PrivateRoutes";
import PublicRoutes from "./Auth/PublicRoutes";
import LoginPage from "./Components/Authentication/login";
import Register from "./Components/Authentication/register";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/community/:id"
              element={<div> community detail page </div>}
            />
          </Route>
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
