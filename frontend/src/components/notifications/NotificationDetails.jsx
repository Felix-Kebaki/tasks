import { useGetNotificationDetailsQuery } from "../../redux/api/notifyApiSlice";
import { useDeleteNotificationMutation } from "../../redux/api/notifyApiSlice";
import { useReceiveInviteMutation } from "../../redux/api/invitesApiSlice";
import { useReqestTojoinMutation } from "../../redux/api/invitesApiSlice";
import { useResponseToRequestMutation } from "../../redux/api/invitesApiSlice";
import { useToast } from "../../context/ToastContext";
import { Loading } from "../loading/Loading";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";

import "./notificationDetails.css";

import moment from "moment";
import { useEffect, useState } from "react";

export function NotificationDetails({ id, setShowNotification }) {
  const { refetch, data, isLoading } = useGetNotificationDetailsQuery({ id });
  const [deleteNotification, { isLoading: deleteLoading }] =
    useDeleteNotificationMutation();
  const [receiveInvite, { isLoading: inviteLoading }] =
    useReceiveInviteMutation();
  const [reqestTojoin, { isLoading: requestLoading }] =
    useReqestTojoinMutation();
  const [responseToRequest, { isLoading: responseLoading }] =
    useResponseToRequestMutation();
  const { showToast } = useToast();
  const [refresh, setRefresh] = useState(1);

  const CloseNotificationDetails = () => {
    setShowNotification(null);
  };

  const HandleReceiveInvite = async (choice) => {
    try {
      const res = await receiveInvite({
        inviteId: data.inviteId,
        data: { response: choice },
      });
      if (res.error) {
        setRefresh(2);
        showToast(res.error.data.error || res.error.error, "error");
        console.error(res.error.data.error || res.error.error);
      } else {
        setShowNotification(null);
        showToast(res.data.message, "success");
      }
    } catch (error) {
      console.error(error.message || error);
      showToast(error.message || error, "error");
    }
  };

  const HandleDeleteNotification = async () => {
    try {
      const res = await deleteNotification({ id });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
        showToast(res.error.data.error || res.error.error, "error");
      } else {
        setShowNotification(null);
        showToast(res.data.message, "success");
      }
    } catch (error) {
      console.error(error.message || error);
      showToast(error.message || error, "error");
    }
  };

  const RequestInviteToTeam = async (teamId) => {
    try {
      const res = await reqestTojoin({ data: { teamId } });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
        showToast(res.error.data.error || res.error.error, "error");
      } else {
        setShowNotification(null);
        showToast(res.data.message, "success");
      }
    } catch (error) {
      console.error(error.message || error);
      showToast(error.message || error, "error");
    }
  };

  const TeamAdminOnReceingRequest = async (resp) => {
    try {
      const res = await responseToRequest({ data: { response :resp}, id });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
        showToast(res.error.data.error || res.error.error, "error");
      } else {
        setShowNotification(null);
        showToast(res.data.message, "success");
      }
    } catch (error) {
      console.error(error.message || error);
      showToast(error.message || error, "error");
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch, refresh]);

  if (isLoading || !data) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }
  return (
    <section className="NotificationDetailsMainSec">
      <div className="NotificationDetailsMainDiv">
        <div className="NotificationDetailsTopDiv title">
          <p>
            {data?.referenceObj}
            <span
              className={
                data?.inviteRes === "Accepted"
                  ? "BlueInviteRes"
                  : data?.inviteRes === "Rejected"
                  ? "OrgInviteRes"
                  : data?.inviteRes === "Expired"
                  ? "RedInviteRes"
                  : "NothingAtInviteRes"
              }
            >
              ({data?.inviteRes})
            </span>
          </p>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={CloseNotificationDetails}
            className="NotificationCloseIcon"
          />
        </div>
        <p className="NotificationTitle text">{data?.title}</p>
        <p className="NotificationMsg text">{data?.message}</p>
        {(data?.referenceObj === "Team Invitation" ||
          data?.referenceObj === "Join Request") &&
        (data?.inviteId || data?.requestingUser) ? (
          <div className="AcceptDeclineInviteDiv">
            <button
              className="AcceptInvite"
              onClick={
                data?.inviteId
                  ? () => HandleReceiveInvite("Accepted")
                  : () => TeamAdminOnReceingRequest("Accepted")
              }
            >
              Accept
            </button>
            <button
              className="DeclineInvite"
              onClick={
                data?.inviteId
                  ? () => HandleReceiveInvite("Rejected")
                  : () => TeamAdminOnReceingRequest("Rejected")
              }
            >
              Decline
            </button>
          </div>
        ) : data?.inviteRes === "Expired" ? (
          <div className="RequestToJoinTeam text">
            <button onClick={() => RequestInviteToTeam(data?.referenceId)}>
              Request admin to join
            </button>
          </div>
        ) : null}
        <div className="NotificationDatesDiv text">
          <p>
            Sent on:{" "}
            <span>{moment(data?.createdAt).format("MMM Do YYYY")}</span>
          </p>
          <p>
            Read on: <span>{moment(data?.seenAt).format("MMM Do YYYY")}</span>
          </p>
        </div>
        <div className="NotificationMarkedReadDeleteDiv text">
          <p>
            <FontAwesomeIcon
              icon={faSquareCheck}
              className="NotificationMarkedReadIcon"
            />
            Marked as read
          </p>
          <p
            className="DeleteNotificationBtn"
            onClick={HandleDeleteNotification}
          >
            Delete notification
          </p>
        </div>
      </div>
    </section>
  );
}
