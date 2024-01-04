import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import LandingPage from "./components/LandingPage";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/main/Dashboard";
import Register from "./components/Register";
import { AuthContextProvider } from "./components/context/AuthContext";
import ProtectedRoutes from "./components/protectedRouting/ProtectedRoutes";
import ProfilePage from "./components/main/ProfilePage";
import PostPage from './components/main/PostPage.js'
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
          </Routes>
        </ChakraProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
