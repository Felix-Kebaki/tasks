import React, { useEffect } from "react";
import "./index.css";
import { SideNav } from "./components/sideNav/SideNav";
import { useGetMeQuery } from "./redux/api/userApiSlice";
import { logoutS } from "./redux/features/authSlice";
import { useLogoutMutation } from "./redux/api/userApiSlice";

import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch=useDispatch()

  const [logout,{isLoading}]=useLogoutMutation();
const {refetch}=useGetMeQuery(undefined,{skip:!userInfo});

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await refetch();
        if (res.error) {
          // token invalid/expired → logout
          await logout();
          dispatch(logoutS());
        }
      } catch (err) {
        await logout();
        dispatch(logoutS());
      }
    };

    if (userInfo) {
      checkSession();
    }
  }, [userInfo, refetch, dispatch]);

  return (
    <>
      {userInfo ? (
        <main className="AppLoggedInMain">
          <SideNav />
          <div>
            <Outlet />
          </div>
        </main>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}
