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

import PublicLayout from "@/pages/public/layout/PublicLayout";

import HomePage from "@/pages/public/home/HomePage";
import LoginPage from "@/pages/public/login/LoginPage";
import RegisterPage from "@/pages/public/register/RegisterPage";
import AboutPage from "@/pages/public/about/AboutPage";
import ApiPage from "@/pages/public/api/ApiPage";
import PrivateLayout from "./pages/private/layout/PrivateLayout";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Missing />,
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
        element: <PrivateLayout />,
        children: [{}],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
