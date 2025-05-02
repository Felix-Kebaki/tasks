import React from "react";
import { Dashboard } from "../components/dashboard/Dashboard";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function DashboardPage() {
  const { userInfo } = useSelector((state) => state.auth);
  return <>{userInfo ? <Dashboard /> : <Navigate to="/login"></Navigate>}</>;
}
