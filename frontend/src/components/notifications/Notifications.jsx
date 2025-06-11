import React, { useEffect } from "react";
import "./notification.css";

import {
  useGetUnreadQuery,
  useGetReadQuery,
  useMarkOneSeenMutation,
  useMarkAsSeenMutation,
} from "../../redux/api/notifyApiSlice";
import { useReceiveInviteMutation } from "../../redux/api/invitesApiSlice";
import { useToast } from "../../context/ToastContext";
import moment from "moment";

export function Notifications() {
  const { refetch, data: unread, isLoading } = useGetUnreadQuery();
  const { refetch: readRefetch, data: read } = useGetReadQuery();
  const [markOneSeen] = useMarkOneSeenMutation();
  const [markAsSeen] = useMarkAsSeenMutation();
  const [receiveInvite] = useReceiveInviteMutation();

  const { showToast } = useToast();

  const HandleMarkOneNotification = async (id) => {
    try {
      const response = await markOneSeen(id);
      if (response.error) {
        console.error(response.error.data.error || response.error.error);
        showToast(response.error.data.error || response.error.error, "error");
      } else {
        showToast(response.data.message, "success");
        refetch();
        readRefetch();
      }
    } catch (error) {
      console.error(error.message);
      showToast(error.message || error, "error");
    }
  };

  const HandleMarkAllRead = async () => {
    try {
      await markAsSeen();
      refetch();
      readRefetch();
    } catch (error) {
      console.error(error.message);
      showToast(error.message || error, "error");
    }
  };

  const HandleAcceptInvite = async (id) => {
    try {
      const res = await receiveInvite({
        inviteId: id,
        data: { response: "Accepted" },
      });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
        showToast(res.error.data.error || res.error.error, "error");
      } else {
        showToast(res.data.message, "success");
        refetch();
      }
    } catch (error) {
      console.error(error.message);
      showToast(error.message || error, "error");
    }
  };

  const HandleRejectInvite = async (id) => {
    try {
      const res = await receiveInvite({
        inviteId: id,
        data: { response: "Rejected" },
      });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
        showToast(res.error.data.error || res.error.error, "error");
      } else {
        showToast(res.data.message, "success");
        refetch();
      }
    } catch (error) {
      console.error(error.message);
      showToast(error.message || error, "error");
    }
  };

  useEffect(() => {
    refetch();
    readRefetch();
  }, [refetch, readRefetch]);
  return (
    <section className="NotificationMainSec">
      <div className="UnreadTopNotificationDiv">
        <p className="UnreadMainTitle title">Unread</p>
        {unread && unread.length !== 0 ? (
          <button onClick={HandleMarkAllRead}>Mark all as read</button>
        ) : null}
      </div>
      {unread && unread.length !== 0 ? (
        unread &&
        unread.map((unreaded) => (
          <div key={unreaded._id} className="UnreadActualEachMainDiv">
            <p className="text">{unreaded.message}</p>
            {unreaded.type === "Invite" ? (
              <div className="AcceptOrRejectInviteDiv">
                <button
                  className="AcceptInviteBtn text"
                  onClick={() => HandleAcceptInvite(unreaded.referenceId)}
                >
                  Accept
                </button>
                <button
                  className="RejectInviteBtn text"
                  onClick={() => HandleRejectInvite(unreaded.referenceId)}
                >
                  Reject
                </button>
              </div>
            ) : (
              <button
                onClick={() => HandleMarkOneNotification(unreaded._id)}
                className="MarkOneAsReadBtn"
              >
                Mark read
              </button>
            )}
          </div>
        ))
      ) : (
        <div className="NoUnreadNotificationDiv">
          <p className="text">You have no unread notifications</p>
        </div>
      )}
      {read && read.length !== 0 ? (
        <div className="OtherNotificationMainDiv">
          <p className="OtherNotificationTitle title">Read</p>
          <div className="AllOtherNotificationWrapper">
            {read &&
              read.map((readed) => (
                <div key={readed._id}>
                  <p className="text">{readed.message}</p>
                  <p className="DateOfNotifications text">
                    <span>Read on: </span>
                    {moment(readed.seenAt).format("MMMM Do YYYY")}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
