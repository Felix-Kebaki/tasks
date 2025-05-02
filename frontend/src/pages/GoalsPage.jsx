import React from 'react'
import { Goals } from '../components/goals/Goals'
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function GoalsPage() {
  const { userInfo } = useSelector((state) => state.auth);
  return <>{userInfo ? <Goals /> : <Navigate to="/login"></Navigate>}</>;
}
