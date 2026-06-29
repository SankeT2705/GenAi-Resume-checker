import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/home";
import Interview from "./features/interview/pages/interview";
import AtsChecker from "./features/ats/pages/AtsChecker";
import AtsResult from "./features/ats/pages/AtsResult";
import Profile from "./features/profile/pages/Profile";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <Protected><Layout><Home /></Layout></Protected>
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><Layout><Interview /></Layout></Protected>
  },
  {
    path: "/ats-checker",
    element: <Protected><Layout><AtsChecker /></Layout></Protected>
  },
  {
    path: "/ats-checker/:checkId",
    element: <Protected><Layout><AtsResult /></Layout></Protected>
  },
  {
    path: "/profile",
    element: <Protected><Layout><Profile /></Layout></Protected>
  }
]);