import React, { useEffect, useState } from "react";
const vapidKey = import.meta.env.VITE_VAPID_PUBLIC;
import "./index.css";
import { SideNav } from "./components/sideNav/SideNav";
import { useGetMeQuery } from "./redux/api/userApiSlice";
import { logoutS } from "./redux/features/authSlice";
import { useLogoutMutation } from "./redux/api/userApiSlice";
import { useToast } from "./context/ToastContext";
import { useGetSubscriptionQuery } from "./redux/api/subscriptionApiSlice";
import { useDeleteSubsMutation } from "./redux/api/subscriptionApiSlice";
import { useCreateSubscriptionMutation } from "./redux/api/subscriptionApiSlice";
import { ShowNotificationInstr } from "./components/showNotificationInstruction/ShowNotificationInstr";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Loading } from "./components/loading/Loading";

export function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [hidePrompt, setHidePrompt] = useState(false);
  const [showInstructions, setShowInstructions] = useState(null);
  const [endpoint, setEndpoint] = useState(null);

  const [logout, { isLoading }] = useLogoutMutation();
  const { refetch, data } = useGetMeQuery(undefined, { skip: !userInfo });
  const [deleteSubs] = useDeleteSubsMutation();
  const [createSubscription] = useCreateSubscriptionMutation();

  function getBrowserName() {
    const userAgent = navigator.userAgent;

    if (
      userAgent.includes("Chrome") &&
      !userAgent.includes("Edg") &&
      !userAgent.includes("OPR")
    ) {
      return "Chrome";
    } else if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      return "Safari";
    } else if (userAgent.includes("Edg")) {
      return "Edge";
    } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
      return "Opera";
    } else {
      return "Other";
    }
  }

  const XIconClick = () => {
    setHidePrompt(true);
  };

  useEffect(() => {
    const getEndpoint = async () => {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        setEndpoint(sub.endpoint);
      }
    };
    getEndpoint();
  }, []);

  const {
    refetch: subscribeRefetch,
    data: subscription,
    isLoading: subscLoading,
  } = useGetSubscriptionQuery(endpoint, { skip: !endpoint });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await refetch();
        if (res.error) {
          const logres = await logout(userInfo._id);
          if (logres.error) {
            showToast(logres.error.data.error || logres.error.error, "error");
            console.error(logres.error.data.error || logres.error.error);
          } else {
            dispatch(logoutS());
            showToast("Your session expired.", "error");
          }
        }
      } catch (err) {
        const loggres = await logout( userInfo._id );
        if (loggres.error) {
          showToast(loggres.error.data.error || loggres.error.error, "error");
          console.error(loggres.error.data.error || loggres.error.error);
        } else {
          dispatch(logoutS());
          showToast("Your session expired.", "error");
        }
      }
    };

    if (userInfo) {
      checkSession();
    }
  }, [userInfo, refetch, dispatch]);

  useEffect(() => {
    let prevPermission = Notification.permission;

    const interval = setInterval(async () => {
      if (Notification.permission !== prevPermission) {
        prevPermission = Notification.permission;

        if (Notification.permission === "denied" && subscription) {
          if (endpoint) {
            await deleteSubs({ endpoint });
            subscribeRefetch();
            showToast("Unsubscribed successfully.", "success");
            window.location.reload();
          } else {
            showToast("Unable to unsubscribe", "error");
          }
        } else if (Notification.permission === "default" && subscription) {
          if (endpoint) {
            await deleteSubs({ endpoint });
            subscribeRefetch();
            showToast("Unsubscribed successfully.", "success");
            window.location.reload();
          } else {
            showToast("Unable to unsubscribe", "error");
          }
        } else if (Notification.permission === "granted" && !subscription) {
          try {
            const reg = await navigator.serviceWorker.register("/sw.js");
            const sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: vapidKey,
            });

            await createSubscription({ subscription: sub });
            subscribeRefetch();
            showToast("Subscribed successfully!", "success");
            window.location.reload();
          } catch (err) {
            console.error("Error creating subscription:", err);
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [subscription, deleteSubs, subscribeRefetch, createSubscription]);

  const handleEnableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        const browser = getBrowserName();
        setShowInstructions(browser);
      } else if (permission === "granted") {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey,
        });

        const res = await createSubscription({ data: { subscription: sub } });
        if (res.error) {
          showToast(res.error.data.error || res.error.errror, "error");
          console.error(res.error.data.error || res.error.errror);
        } else {
          subscribeRefetch();
          setHidePrompt(true);
          showToast(res.data.message, "success");
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Error enabling notifications:", err);
    }
  };

  if (subscLoading) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {userInfo ? (
        <main className="AppLoggedInMain">
          <SideNav />
          <div>
            {!hidePrompt &&
            (!subscription || Notification.permission === "denied") ? (
              <div className="ConvinceToSubscribeMainDiv">
                <p className="text">
                  <span
                    onClick={handleEnableNotifications}
                    className="OnclickAllowNotiSpan"
                  >
                    Allow notifications
                  </span>{" "}
                  for a better experience
                  <span className="DisappearSpan">
                    {" "}
                    – get reminders, alerts and updates
                  </span>
                  .
                </p>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="NotificationXIcon"
                  onClick={XIconClick}
                />
              </div>
            ) : null}
            <Outlet />
          </div>
          {showInstructions !== null ? (
            <div className="OverflowAddMainDiv">
              <ShowNotificationInstr
                setShowInstructions={setShowInstructions}
                showInstructions={showInstructions}
              />
            </div>
          ) : null}
        </main>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}
