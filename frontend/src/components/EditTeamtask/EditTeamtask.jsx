import "./editTeamtask.css";
import { useEffect, useMemo, useState } from "react";

import { Loading } from "../loading/Loading";

import { useGetEachTeamtaskQuery } from "../../redux/api/teamTaskApiSlice";
import { useEditTheTeamtaskMutation } from "../../redux/api/teamTaskApiSlice";

import moment from "moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Loader from "../../assets/images/blackLoader.png";

export function EditTeamtask({ editTeamtask, setEditTeamtask }) {
  const { refetch, data, isLoading } = useGetEachTeamtaskQuery({
    teamtaskId: editTeamtask,
  });
  const [editTheTeamtask, { isLoading: editLoading }] =
    useEditTheTeamtaskMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [newfile, setNewfile] = useState(null);
  const [newLink, setNewLink] = useState("");
  const [newtype, setNewtype] = useState("");

  const HandleEditTeamtask = async (e) => {
    e.preventDefault();
    try {
      const newDataUpdate = {
        name,
        description,
        dueDate,
        fileType: newtype === "" ? undefined : newtype,
        fileUrl:
          type === "None" || newtype === "None"
            ? undefined
            : newtype === "" && type === "Link"
            ? linkUrl
            : newtype !== "" && newLink !== ""
            ? newLink
            : undefined,
        file:
          type === "None" || newtype === "None"
            ? undefined
            : newtype === "Document" || newtype === "Photo"
            ? newfile
            : undefined,
      };
      const res = await editTheTeamtask({
        data: newDataUpdate,
        teamtaskId: editTeamtask,
      });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
        setErrorMessage(res.error.data.error || res.error.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        console.log(res.data.message);
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
      setLinkUrl(data?.fileType === "Link" ? data.fileUrl : undefined);
    }
  }, [data]);

  const isUnchanged = useMemo(() => {
    return(
      name===data?.name || ""&&
      description===data?.description || "" &&
      type===data?.fileType || "" &&
      dueDate===moment(data?.dueDate).format("YYYY-MM-DD") || ""
    )
  }, [
    name,
    description,
    dueDate,
    type
  ]);

  const isUnchangedLink=useMemo(()=>{
    return(
      linkUrl===data?.fileUrl || "" &&
      name===data?.name || ""&&
      description===data?.description || "" &&
      type===data?.fileType || "" &&
      dueDate===moment(data?.dueDate).format("YYYY-MM-DD") || ""
    )
  },[linkUrl,   name,
    description,
    dueDate,
    type])

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
          {type === "None" ? null : newtype === "" && type === "Link" ? (
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
              disabled={(newtype === "" && type === "Link")?isUnchangedLink:isUnchanged}
              type="submit"
              className={
              ((newtype === "" && type === "Link")?isUnchangedLink:isUnchanged)
                  ? "TeamtaskDisabledBtn"
                  : editLoading
                  ? "TeamtaskEditLoader"
                  : !editLoading
                  ? "TeamtaskEditBtn"
                  : null
              }
            >
              {editLoading ? <img src={Loader} alt="Loading..." /> : "Update"}
            </button>
          </div>
          <pre>{errorMessage}</pre>
        </form>
      </div>
    </section>
  );
}
