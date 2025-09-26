import React, { useEffect, useState } from "react";
import "./notification.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";

import {
  useGetUnreadQuery,
  useGetallQuery,
  useMarkOneSeenMutation,
  useMarkAsSeenMutation,
} from "../../redux/api/notifyApiSlice";
import { useToast } from "../../context/ToastContext";
import moment from "moment";
import { Loading } from "../loading/Loading";
import { NotificationDetails } from "./NotificationDetails";

export function Notifications() {
  const { refetch, data: unread = [], isLoading } = useGetUnreadQuery();
  const {
    refetch: allRefetch,
    data: allNotification = [],
    isLoading: allLoading,
  } = useGetallQuery();
  const [markOneSeen] = useMarkOneSeenMutation();
  const [markAsSeen] = useMarkAsSeenMutation();

  const { showToast } = useToast();

  const [showNotification, setShowNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  let filteredNotification = [];

  if (activeTab === "all") {
    filteredNotification = allNotification;
  } else if (activeTab === "unread") {
    filteredNotification = unread;
  }

  const HandleMarkOneDone = async (id) => {
    try {
      const response = await markOneSeen(id);
      if (response.error) {
        console.error(response.error.data.error || response.error.error);
        showToast(response.error.data.error || response.error.error, "error");
      } else {
        showToast(response.data.message, "success");
        refetch();
        allRefetch();
      }
    } catch (error) {
      console.error(error.message);
      showToast(error.message || error, "error");
    }
  };

  const HandleOpenNotification = (id) => {
    setShowNotification(id);
  };

  const HandleMarkAllRead = async () => {
    try {
      await markAsSeen();
      refetch();
      allRefetch();
    } catch (error) {
      console.error(error.message);
      showToast(error.message || error, "error");
    }
  };

  useEffect(() => {
    allRefetch();
    refetch();
  }, [refetch, allRefetch, showNotification]);

  if (allLoading || isLoading) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }

  return (
    <section className="NotificationMainSec">
      <div className="NotificationMainDiv">
        {allNotification && allNotification.length !== 0 ? (
          <div>
            <div className="NotificationTabsMainDiv text">
              <button
                onClick={() => setActiveTab("all")}
                className={
                  activeTab === "all"
                    ? "EachNotificationTab activeNotiTab"
                    : "EachNotificationTab"
                }
              >
                <FontAwesomeIcon
                  icon={faFolder}
                  className="NotificationTabIcon"
                />
                <div>
                  <p className="TabTitleAtNoti">Overview</p>
                  <p className="OptionalViewNotification"></p>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("unread")}
                className={
                  activeTab === "unread"
                    ? "EachNotificationTab activeNotiTab"
                    : "EachNotificationTab"
                }
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="NotificationTabIcon"
                />
                <div>
                  <p className="TabTitleAtNoti">Unread</p>
                  <p className="OptionalViewNotification"> </p>
                </div>
              </button>
            </div>
            <div className="AllNotificationMainWrapper">
              {filteredNotification && filteredNotification.length !== 0 ? (
                filteredNotification.map((notify) => (
                  <div
                    key={notify._id}
                    className="EachNotificationMainDiv"
                    onClick={() => HandleOpenNotification(notify._id)}
                  >
                    <div className="NotificationReferenceTitle title">
                      {notify.seen ? (
                        <FontAwesomeIcon
                          icon={faSquareCheck}
                          className="NotificationReadIcon"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faSquare}
                          className="MarkAsReadIcon"
                          title="Mark as read"
                          onClick={() => HandleMarkOneDone(notify._id)}
                        />
                      )}
                      <p>{notify?.referenceObj}</p>
                    </div>
                    <div className="AlInNotificationExceptReferenceDiv">
                      <p className="EachNotificationTitleAndMsg text">
                        {notify.title}
                        <span> - {notify.message}</span>
                      </p>
                      <div className="NotificationDateDiv text">
                        <p>{moment(notify?.date).format("DD MMM")}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="TabHasNoNotificationDiv text">
                  <p>You have no notification here.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="NoNotificationMainDiv">
            <p className="text">No notifications at the moment.</p>
          </div>
        )}
        {showNotification !== null ? (
          <div className="OverflowAddMainDiv">
            <NotificationDetails
              id={showNotification}
              setShowNotification={setShowNotification}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
