import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Blogs from "./pages/Blogs";
import Experience from "./pages/Experience";
import Testimonials from "./pages/Testimonials";
import Services from "./pages/Services";
import Messages from "./pages/Messages";
import Media from "./pages/Media";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>

            {/* Login */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* Protected Admin Panel */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={<AdminLayout />}
              >

                {/* Dashboard */}
                <Route
                  index
                  element={<Dashboard />}
                />

                {/* About */}
                <Route
                  path="about"
                  element={<About />}
                />

                {/* Skills */}
                <Route
                  path="skills"
                  element={<Skills />}
                />

                {/* Projects */}
                <Route
                  path="projects"
                  element={<Projects />}
                />

                {/* Blogs */}
                <Route
                  path="blogs"
                  element={<Blogs />}
                />

                {/* Experience */}
                <Route
                  path="experience"
                  element={<Experience />}
                />
                {/* Testimonials */}
                <Route
                  path="testimonials"
                  element={<Testimonials />}
                />
                {/* Services */}
                <Route
                  path="services"
                  element={<Services />}
                />
                {/* Messages */}
                <Route
                  path="messages"
                  element={<Messages />}
                />
                {/* Media */}
                <Route
                  path="media"
                  element={<Media />}
                />
              </Route>
            </Route>

            {/* Fallback */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);