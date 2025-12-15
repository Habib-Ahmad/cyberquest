import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import App from "./App.tsx";
import {
  LoginPage,
  SignupPage,
  ChallengesPage,
  ChallengeDetailPage,
  LeaderboardPage,
  ProfilePage,
  SubmissionsPage,
  NotFoundPage,
} from "./pages/index";
import {
  AdminDashboard,
  AdminChallenges,
  AdminChallengeForm,
} from "./pages/admin/index";
import { ProtectedRoute } from "./components/auth/index";
import AdminRoute from "./components/auth/AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/challenges" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "challenges",
        element: <ChallengesPage />,
      },
      {
        path: "challenges/:id",
        element: <ChallengeDetailPage />,
      },
      {
        path: "leaderboard",
        element: <LeaderboardPage />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "submissions",
        element: (
          <ProtectedRoute>
            <SubmissionsPage />
          </ProtectedRoute>
        ),
      },
      // Admin Routes
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "admin/challenges",
        element: (
          <AdminRoute>
            <AdminChallenges />
          </AdminRoute>
        ),
      },
      {
        path: "admin/challenges/new",
        element: (
          <AdminRoute>
            <AdminChallengeForm />
          </AdminRoute>
        ),
      },
      {
        path: "admin/challenges/:id/edit",
        element: (
          <AdminRoute>
            <AdminChallengeForm />
          </AdminRoute>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
