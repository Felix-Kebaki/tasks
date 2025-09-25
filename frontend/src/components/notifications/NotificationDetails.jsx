import { useGetNotificationDetailsQuery } from "../../redux/api/notifyApiSlice";
import { Loading } from "../loading/Loading";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";

import "./notificationDetails.css";

import moment from "moment";

export function NotificationDetails({ id, setShowNotification }) {
  const { data, isLoading } = useGetNotificationDetailsQuery({ id });

  const CloseNotificationDetails = () => {
    setShowNotification(null);
  };

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
          <p>{data?.referenceObj}</p>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={CloseNotificationDetails}
            className="NotificationCloseIcon"
          />
        </div>
        <p className="NotificationTitle text">{data?.title}</p>
        <p className="NotificationMsg text">{data?.message}</p>
        {
            data?.referenceObj==="Team Invitation"?<div className="AcceptDeclineInviteDiv">
                <button className="AcceptInvite">Accept</button><button className="DeclineInvite">Decline</button>
            </div>:null
        }
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
            Mark as read
          </p>
          <p className="DeleteNotificationBtn">Delete notification</p>
        </div>
      </div>
    </section>
  );
}
