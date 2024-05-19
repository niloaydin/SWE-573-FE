import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PrivateRoutes from "./Auth/PrivateRoutes";
import PublicRoutes from "./Auth/PublicRoutes";
import LoginPage from "./Components/Authentication/login";
import Register from "./Components/Authentication/register";
import HomePage from "./Pages/HomePage";
import CommunityDetail from "./Components/Community/CommunityDetail";
import CreateCommunity from "./Components/Community/CreateCommunity";
import CreatePostTemplate from "./Components/Community/CreatePostTemplate";
import CommunitiesPage from "./Pages/Communities";
import CreatePost from "./Components/Community/CreatePost";
import PostDetail from "./Components/Posts/PostDetail";
import ProfilePage from "./Components/User/ProfilePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/community/:id" element={<CommunityDetail />} />
            <Route path="/create-community" element={<CreateCommunity />} />
            <Route
              path="/community/:id/create-template"
              element={<CreatePostTemplate />}
            />
            <Route path="/community/:id/create-post" element={<CreatePost />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route
              path="/community/:communityId/post-details/:postId"
              element={<PostDetail />}
            />
            <Route path="/profile" element={<ProfilePage />} />
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
