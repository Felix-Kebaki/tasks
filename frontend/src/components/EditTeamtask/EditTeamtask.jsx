import "./editTeamtask.css";
import { useEffect, useMemo, useState } from "react";

import { Loading } from "../loading/Loading";

import { useGetEachTeamtaskQuery } from "../../redux/api/teamTaskApiSlice";
import { useEditTheTeamtaskMutation } from "../../redux/api/teamTaskApiSlice";

import moment from "moment";

import { useToast } from "../../context/ToastContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Loader from "../../assets/images/blackLoader.png";

export function EditTeamtask({ editTeamtask, setEditTeamtask }) {
  const { refetch, data, isLoading } = useGetEachTeamtaskQuery(editTeamtask);
  const [editTheTeamtask, { isLoading: editLoading }] =
    useEditTheTeamtaskMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [newLink, setNewLink] = useState("");
  const [newtype, setNewtype] = useState("");
  const [newfile, setNewfile] = useState("");

  const { showToast } = useToast();

  const HandleEditTeamtask = async (e) => {
    e.preventDefault();
    try {
      const newDataUpdate = {};

      if (name !== data?.name) newDataUpdate.name = name;
      if (description !== data?.description)
        newDataUpdate.description = description;
      if (newtype !== "" && newtype !== data?.fileType)
        newDataUpdate.fileType = newtype;
      if (dueDate !== moment(data?.dueDate).format("YYYY-MM-DD"))
        newDataUpdate.dueDate = dueDate;
      if (newtype === "" && type === "Link") {
        newDataUpdate.fileUrl = linkUrl;
      } else if (newtype !== "" && newLink !== "") {
        newDataUpdate.fileUrl = newLink;
      }
      if (newtype === "Document" || newtype === "Photo")
        newDataUpdate.file = newfile;

      const res = await editTheTeamtask({
        data: newDataUpdate,
        teamtaskId: editTeamtask,
      });
      if (res.error) {
        setErrorMessage(res.error.data.error || res.error.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        showToast(res.data.message, "success");
        setEditTeamtask(null);
      }
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const HandleChangeType = (e) => {
    const newValue = e.target.value;
    setType(newValue);
    setNewtype(newValue);
  };

  const HandleChangeFile = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setNewfile(selected);
    }
  };

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setDescription(data.description || "");
      setDueDate(moment(data.dueDate).format("YYYY-MM-DD") || "");
      setType(data.fileType || "");
      setLinkUrl(data.fileType === "Link" ? data.fileUrl : "");
    }
  }, [data]);

  const isUnchanged = useMemo(() => {
    const baseMatch =
      description === data?.description &&
      name === data?.name &&
      type === data?.fileType &&
      dueDate === moment(data?.dueDate).format("YYYY-MM-DD");

    const linkMatch = linkUrl !== "" ? linkUrl === data?.fileUrl : true;

    return baseMatch && linkMatch;
  }, [name, description, dueDate, type, linkUrl]);

  if (!data || isLoading) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }

  return (
    <section>
      <div className="EditTeamtaskMainDiv">
        <div className="EditTeamtaskTopDiv">
          <p className="title">Teamtask</p>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setEditTeamtask(null)}
            className="TeamtaskEditExitIcon"
          />
        </div>
        <form onSubmit={HandleEditTeamtask} className="EditTeamtaskActualForm">
          <div className="text">
            <label htmlFor="nameId">Name</label>
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="nameId"
            />
          </div>
          <div className="text">
            <label htmlFor="descId">Description</label>
            <br />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="descId"
            />
          </div>
          <div className="text">
            <label htmlFor="dueDateId">Due date</label>
            <br />
            <input
              type="date"
              className="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              id="dueDateId"
            />
          </div>
          <div className="text">
            <label htmlFor="typeId">Type of upload</label>
            <br />
            <select id="typeId" value={type} onChange={HandleChangeType}>
              <option value="None">None</option>
              <option value="Link">Link</option>
              <option value="Photo">Photo</option>
              <option value="Document">Document</option>
            </select>
          </div>
          {type === "None" ? null : linkUrl !== "" && newtype === "" ? (
            <div className="text">
              <label htmlFor="SameLinkId">Link</label>
              <br />
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                id="SameLinkId"
              />
            </div>
          ) : null}
          {newtype === "Link" ? (
            <div className="text">
              <label htmlFor="linkId">Link</label>
              <br />
              <input
                type="text"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                id="linkId"
              />
            </div>
          ) : newtype === "Photo" || newtype === "Document" ? (
            <div className="DocAndPhotoDiv text">
              <label htmlFor="photoDocId">{type}</label>
              <br />
              <input type="file" id="photoDocId" onChange={HandleChangeFile} />
            </div>
          ) : newtype === "None" || type === "None" ? null : null}
          <div className="TeamtaskEditBtnDiv text">
            <button
              disabled={isUnchanged}
              type="submit"
              className={
                isUnchanged
                  ? "TeamtaskDisabledBtn text"
                  : editLoading
                  ? "TeamtaskEditLoader"
                  : !editLoading
                  ? "TeamtaskEditBtn text"
                  : null
              }
            >
              {editLoading ? <img src={Loader} alt="Loading..." /> : "Update"}
            </button>
          </div>
          <pre className="text">
            {errorMessage !== "" ? errorMessage : null}
          </pre>
        </form>
      </div>
    </section>
  );
}
