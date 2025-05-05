import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./redux/store.js";
import App from "./App.jsx";
import { AppLogged } from "./AppLogged.jsx";
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
import { SubmissionsPage } from "./pages/SubmissionsPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/app",
    element: <AppLogged />,
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
        path: "/app/daily-objectives",
        element: <DailyObjectivesPage />,
      },
      {
        path: "/app/teams",
        element: <TeamsPage />,
      },
      {
        path: "/app/teams/eachTeamtask",
        children: [
          {
            path: "/app/teams/eachTeamtask/:id",
            element: <TeamDetailsPage />,
          },
          {
            path: "/app/teams/eachTeamtask/submissions/:teamtaskId",
            element: <SubmissionsPage />,
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
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
