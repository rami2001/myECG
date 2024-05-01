import React from "react";
import ReactDOM from "react-dom/client";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import "./index.css";

import Protected from "@/pages/Protected";
import Missing from "@/pages/Missing";
import Loading from "@/pages/Loading";

import PublicLayout from "@/pages/public/layout/PublicLayout";

import HomePage from "@/pages/public/home/HomePage";
import LoginPage from "@/pages/public/login/LoginPage";
import RegisterPage from "@/pages/public/register/RegisterPage";
import AboutPage from "@/pages/public/about/AboutPage";
import ApiPage from "@/pages/public/api/ApiPage";

import PrivateLayout from "@/pages/private/layout/PrivateLayout";
import ProfilesPage from "@/pages/private/profiles/ProfilesPage";
import DashboardPage from "@/pages/private/dasboard/DashboardPage";
import SettingsPage from "@/pages/private/settings/SettingsPage";
import EcgPage from "@/pages/private/ecg/EcgPage";
import PersistLogin from "./components/PersistLogin";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "home/",
        element: <PublicLayout />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
          {
            path: "about",
            element: <AboutPage />,
          },
          {
            path: "api",
            element: <ApiPage />,
          },
        ],
      },
      {
        path: "dashboard/",
        element: <PersistLogin />,
        children: [
          {
            element: <Protected />,
            children: [
              {
                element: <PrivateLayout />,
                children: [
                  {
                    path: "",
                    element: <DashboardPage />,
                  },
                  {
                    path: "profiles/",
                    element: <ProfilesPage />,
                  },
                  {
                    path: "settings",
                    element: <SettingsPage />,
                  },
                  {
                    path: "ecg",
                    element: <EcgPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/*",
        element: <Missing />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
