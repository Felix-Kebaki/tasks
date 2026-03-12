import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastProvider } from "./context/ToastContext.jsx";

import store from "./redux/store.js";
import { App } from "./App.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { GoalsPage } from "./pages/GoalsPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { CompletedPage } from "./pages/CompletedPage.jsx";
import { TasksPage } from "./pages/TasksPage.jsx";
import { TeamsPage } from "./pages/TeamsPage.jsx";
import { DailyObjectivesPage } from "./pages/DailyObjectivesPage.jsx";
import { NotificationPage } from "./pages/NotificationPage.jsx";
import { TeamDetailsPage } from "./pages/TeamDetailsPage.jsx";
import { UpcomingPage } from "./pages/UpcomingPage.jsx";
import { ViewSubmissionsPage } from "./pages/ViewSubmissionsPage.jsx";
import { AllPerCategoryPage } from "./pages/AllPerCategoryPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { TeamTaskDetailsPage } from "./pages/TeamTaskDetailsPage.jsx";

const router = createBrowserRouter([
  {
    path:"/",
    element:<Navigate to="/app/dashboard"/>
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "/app/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/app/goals",
        element: <GoalsPage />,
      },
      {
        path:"/app/profile",
        element:<ProfilePage/>
      },
      {
        path: "/app/daily-objectives",
        element: <DailyObjectivesPage />,
      },
      {
        path: "/app/teams",
        element: <TeamsPage />,
      },
      {
        path: "/app/teams/eachTeam",
        children: [
          {
            path: "/app/teams/eachTeam/:id",
            element: <TeamDetailsPage />,
          },
          {
            path: "/app/teams/eachTeam/eachTeamtask/:id",
            element: <TeamTaskDetailsPage />,
          },
          {
            path: "/app/teams/eachTeam/eachTeamtask/submissions/:id",
            element: <ViewSubmissionsPage />,
          },
        ],
      },
      {
        path: "/app/upcoming",
        element: <UpcomingPage />,
      },
      {
        path: "/app/tasks",
        element: <TasksPage />,
      },
      {
        path: "/app/notifications",
        element: <NotificationPage />,
      },
      {
        path: "/app/completed",
        element: <CompletedPage />,
      },
      {
        path: "/app/categories/:categoryName",
        element: <AllPerCategoryPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <p>Page not found</p>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
  </StrictMode>
);
