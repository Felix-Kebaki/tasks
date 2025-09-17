import React from "react";
import { Verify } from "../components/verify/Verify";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function VerifyPage() {
  const { userInfo } = useSelector((state) => state.auth);
  return <>{userInfo ? <Verify /> : <Navigate to="/register" />}</>;
}
