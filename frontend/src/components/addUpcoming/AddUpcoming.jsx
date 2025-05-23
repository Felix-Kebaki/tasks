import React, { useState } from "react";
import "./addUpcoming.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useCreateEventMutation } from "../../redux/api/upcomingApiSlice";
import { useToast } from "../../context/ToastContext";

import Loader from "../../assets/images/blackLoader.png";

export function AddUpcoming({ setAdd, add }) {
  const [name, setName] = useState("");
  const { showToast } = useToast();

  const [createEvent, { isLoading }] = useCreateEventMutation();

  const HandleSubmitUpcoming = async (e) => {
    e.preventDefault();
    try {
      const res = await createEvent({ title: name, eventDate: add });
      if (res.error) {
        showToast(res.error.data.error || res.error.error, "error");
        setAdd(null);
      } else {
        showToast(res.data.message, "success");
        setAdd(null);
      }
    } catch (error) {
      console.error(error.message);
      showToast(error.message, "error");
    }
  };

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
              className={
                isLoading ? "CreateUpcomingLoader" : "CreateUpcomingBtn text"
              }
            >
              {isLoading ? <img src={Loader} alt="Loading..." /> : "Create"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
