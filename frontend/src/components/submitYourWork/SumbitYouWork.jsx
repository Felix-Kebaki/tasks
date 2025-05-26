import React, { useState } from "react";
import "./submitYourWork.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useMarkAsDoneMutation } from "../../redux/api/assignTaskApiSlice";

import Loader from '../../assets/images/blackLoader.png'

export function SumbitYouWork({ submit, setSubmit }) {
  const [submitForm, setSubmitForm] = useState({
    type: "",
    link: "",
  });
  const [upload, setUpload] = useState(null);
  const { type, link } = submitForm;

  const OnChange = (e) => {
    setSubmitForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [markAsDone,{isLoading}] = useMarkAsDoneMutation();

  const HandleSubmitWork = async (e) => {
    e.preventDefault();
    try {
      const res = await markAsDone({
        teamtaskId: submit,
        data: {
          type,
          fileUrl: type === "None" ? undefined : type === "Link" ? link : undefined,
          file: type === "None"
          ? undefined
          : type !== "Link" && type !== "None"
          ? upload
          : undefined,
        },
      });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
      } else {
        console.log(res.data.message);
        setSubmit(null);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const Cancel = () => {
    setSubmit(null);
  };

  return (
    <section className="SubmitYourWorkMainSec">
      <form onSubmit={HandleSubmitWork}>
        <div className="SubmitYourWorkTopDiv">
          <p className="title">Submit your work</p>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={Cancel}
            id="SubmitYourWorkCancelIcon"
          />
        </div>
        <p className="SubmitYourWorkDesc text">
          Submit your work either as document, photo or link
        </p>
        <div className="InputOfYourWorkType">
          <label htmlFor="typeId" className="typeOfSubmission text">
            Type of submission
          </label>
          <br />
          <select name="type" id="typeId" value={type} onChange={OnChange}>
            <option value="" disabled selected>
              Select upload type
            </option>
            <option value="None">None</option>
            <option value="Document">Documents</option>
            <option value="Photo">Images</option>
            <option value="Link">Links</option>
          </select>
        </div>
        {type !== "" && type !== "Link" && type !== "None" ? (
          <div className="InputOfTeamtaskFile">
            <label htmlFor="fileId" className="text" id="UploadId">
              {type}
            </label>
            <br />
            <input
              type="file"
              onChange={(e) => setUpload(e.target.files[0])}
              id="UploadId"
            />
          </div>
        ) : type === "Link" ? (
          <div className="SubmitWorkLink">
            <label htmlFor="fileId" className="text">
              Link to resource
            </label>
            <br />
            <input
              type="text"
              value={link}
              name="link"
              onChange={OnChange}
              className="text"
              id="fileId"
            />
          </div>
        ) : null}
        {type !== "" ? (
          <div className="SubmitWorkMainSubmitDiv">
            <button className={isLoading?"SubmitWorkMainSubmitLoader":"SubmitWorkMainSubmit"}>{isLoading?<img src={Loader} alt="Loading..."/>:type==="None"?"Done":"Submit"}</button>
          </div>
        ) : null}
      </form>
    </section>
  );
}
