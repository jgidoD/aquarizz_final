import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import LandingPage from "./components/LandingPage";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/main/Dashboard";
import Register from "./components/Register";
import { AuthContextProvider } from "./components/context/AuthContext";
import ProtectedRoutes from "./components/protectedRouting/ProtectedRoutes";
import ProfilePage from "./components/main/ProfilePage";
import PostPage from "./components/main/PostPage.js";
import Explore from "./components/Explore.js";
import FishLibrary from "./components/main/FishLibrary.js";
import About from "./components/main/About.js";
function App() {
  return (
    <>
      <AuthContextProvider>
        <ChakraProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/discover"
              element={
                <ProtectedRoutes>
                  <FishLibrary />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoutes>
                  <ProfilePage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/profile/:userId/post/:postId"
              element={
                <ProtectedRoutes>
                  <PostPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoutes>
                  <About />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </ChakraProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
