import React from "react";
import "./index.css";
import { SideNav } from "./components/sideNav/SideNav";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function App() {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <>
      {userInfo ? (
        <main className="AppLoggedInMain">
          <SideNav />
          <div>
            <Outlet />
          </div>
        </main>
      ) :  (
        <Navigate to="/login" />
      )}
    </>
  );
}
