import "./editTeamtask.css";
import { useEffect, useState } from "react";

import { useGetEachTeamtaskQuery } from "../../redux/api/teamTaskApiSlice";
import { useEditTheTeamtaskMutation } from "../../redux/api/teamTaskApiSlice";

import moment from "moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export function EditTeamtask({ editTeamtask, setEditTeamtask }) {
  const { refetch, data, isLoading } = useGetEachTeamtaskQuery({
    teamtaskId: editTeamtask,
  });
  const [editTheTeamtask] = useEditTheTeamtaskMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [newfile, setNewfile] = useState("");
  const [newtype, setNewtype] = useState("");

  const HandleEditTeamtask = async (e) => {
    e.preventDefault();
    try {
      const res = await editTheTeamtask({
        data: {
          name,
          description,
          dueDate,
          fileType: newtype || type,
          fileUrl: type === "None" ? undefined : newfile || fileUrl,
        },
        teamtaskId: editTeamtask,
      });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
      } else {
        console.log(res.data.message);
        setEditTeamtask(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const HandleChangeType = (e) => {
    const newValue = e.target.value;
    setType(newValue);
    setNewtype(newValue);
  };

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setDescription(data.description || "");
      setDueDate(moment(data.dueDate).format("YYYY-MM-DD") || "");
      setType(data.fileType || "");
      setFileUrl(data.fileUrl || "");
    }
  }, [data]);

  if (!data || isLoading) {
    return <div>Loading...</div>;
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
          {newtype === "" ? (
            <div className="text">
              <label htmlFor="SameLinkId">{type}</label>
              <br />
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
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
                value={newfile}
                onChange={(e) => setNewfile(e.target.value)}
                id="linkId"
              />
            </div>
          ) : newtype === "Photo" || newtype === "Document" ? (
            <div className="DocAndPhotoDiv text">
              <label htmlFor="photoDocId">{type}</label>
              <br />
              <input
                type="file"
                id="photoDocId"
                value={newfile}
                onChange={(e) => setNewfile(e.target.value)}
              />
            </div>
          ) : newtype === "None" ? null : null}
          <div className="TeamtaskEditBtn text">
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </section>
  );
}
