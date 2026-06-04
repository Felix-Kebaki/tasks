import React, { useMemo, useState } from "react";
import "./addUpcoming.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useCreateEventMutation } from "../../redux/api/upcomingApiSlice";
import { useToast } from "../../context/ToastContext";

import Loader from "../../assets/images/blackLoader.png";

export function AddUpcoming({ setAdd, add }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const { showToast } = useToast();

  const [createEvent, { isLoading }] = useCreateEventMutation();

  const HandleSubmitUpcoming = async (e) => {
    e.preventDefault();
    try {
      const timezone=Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await createEvent({ title: name, eventDate: add ,timezone});
      if (res.error) {
        setErrorMessage(res.error.data.error || res.error.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        showToast(res.data.message, "success");
        setAdd(null);
      }
    } catch (error) {
      console.error(error.message || error);
      setErrorMessage(error.message || error);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const isUnchanged = useMemo(() => {
    return name.length == 0;
  }, [name]);

  return (
    <section className="AddUpcomingMainSec">
      <form className="AddUpcomingMainForm" onSubmit={HandleSubmitUpcoming}>
        <div className="AddUpcomingTopDiv">
          <p className="title">Add Upcoming event</p>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setAdd(null)}
            className="CloseAddUpcomingIcon"
          />
        </div>
        <div className="ActualUpcomintFormDiv">
          <div className="UpcomingInputDiv">
            <label htmlFor="upcomingLabel" className="text">
              Upcoming event
            </label>
            <br />
            <input
              type="text"
              id="upcomingLabel"
              className="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="UpcomingCreateBtn">
            <button
              disabled={isUnchanged}
              className={
                isUnchanged
                  ? "DisabledUpcomingBtn text"
                  : isLoading
                  ? "CreateUpcomingLoader"
                  : !isLoading
                  ? "CreateUpcomingBtn text"
                  : null
              }
            >
              {isLoading ? <img src={Loader} alt="Loading..." /> : "Create"}
            </button>
          </div>
        </div>
        <pre className="text">{errorMessage!==""?errorMessage:null}</pre>
      </form>
    </section>
  );
}
