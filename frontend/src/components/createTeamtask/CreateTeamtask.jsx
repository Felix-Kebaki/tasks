import React, { useMemo, useState } from "react";
import "./createTeamtask.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useCreateTeamtaskMutation } from "../../redux/api/teamTaskApiSlice";

import Loader from "../../assets/images/blackLoader.png";

import { useToast } from "../../context/ToastContext";

export function CreateTeamtask({ setAdd, add }) {
  const [errorMessage,setErrorMessage]=useState("")
  const [data, setData] = useState({
    name: "",
    description: "",
    dueDate: "",
    type: "",
    link: "",
  });
  const [upload, setUpload] = useState(null);
  const { name, description, dueDate, type, link } = data;

  const {showToast}=useToast()

  const OnChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [createTeamtask, { isLoading }] = useCreateTeamtaskMutation();

  const HandleSubmitTeamtask = async (e) => {
    e.preventDefault();
    try {
      const res = await createTeamtask({
        data: {
          name,
          description,
          dueDate,
          type,
          fileUrl:
            type === "None" ? undefined : type === "Link" ? link : undefined,
          file:
            type === "None"
              ? undefined
              : type !== "Link" && type !== "None"
              ? upload
              : undefined,
        },
        teamId: add,
      });

      if (res.error) {
        setErrorMessage(
          res.error.data.error || res.error.error || "Unknown error occured"
        );
        setTimeout(()=>{
          setErrorMessage("")
        },3000)
      } else {
        showToast(res.data.message,"success");
        setAdd(null);
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message || error)
      setTimeout(()=>{
        setErrorMessage("")
      },3000)
    }
  };

  const isAllfield = useMemo(() => {
    return (
      name !== "" &&
      description !== "" &&
      dueDate !== "" &&
      type !== "" &&
      type==="None"?true:type==="Link"?link!=="":upload!==null
    );
  }, [name, description, dueDate, type, link, upload]);

  return (
    <section className="CreateTeamtaskMainSec">
      <form className="CreateTeamtaskForm" onSubmit={HandleSubmitTeamtask}>
        <div className="CreateTeamtaskTopDiv">
          <p className="CreateTeamtaskTitle title">Create a Teamtask</p>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setAdd(null)}
            className="CloseAddTeamtaskIcon"
          />
        </div>
        <p className="CreateTeamtaskDesc text">
          After creating a team, you can assign specific tasks to individual
          members, streamlining teamwork and boosting productivity
        </p>
        <div className="TeamtaskActualFormDiv">
          <div className="InputOfTeamtask">
            <label htmlFor="teamtasknameId" className="text">
              Teamtask name
            </label>
            <br />
            <input
              type="text"
              id="teamtasknameId"
              value={name}
              name="name"
              onChange={OnChange}
              className="text"
            />
          </div>
          <div className="InputOfTeamtask">
            <label htmlFor="teamtaskdescId" className="text">
              Teamtask description
            </label>
            <br />
            <input
              type="text"
              id="teamtaskdescId"
              value={description}
              name="description"
              onChange={OnChange}
              className="text"
            />
          </div>
          <div className="InputOfTeamtask">
            <label htmlFor="dueDateId" className="text">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              name="dueDate"
              onChange={OnChange}
              className="text"
              id="dueDateId"
            />
          </div>
          <div className="InputOfTeamtask">
            <label htmlFor="typeId" className="typeOfUpload text">
              Upload type
            </label>
            <br />
            <select name="type" id="typeId" value={type} onChange={OnChange}>
              <option value="" disabled selected>
                Select upload type
              </option>
              <option value="None">None</option>
              <option value="Document">Document</option>
              <option value="Photo">Photo</option>
              <option value="Link">Link</option>
            </select>
          </div>
          {(type !== "" && type === "Document") || type === "Photo" ? (
            <div className="InputOfTeamtaskFile">
              <label htmlFor="fileId" className="text" id="UploadId">
                {type}
              </label>
              <br />
              <input
                type="file"
                onChange={(e) => setUpload(e.target.files[0])}
                id="UploadId"
                name="upload"
              />
            </div>
          ) : type === "Link" ? (
            <div className="InputOfTeamtask">
              <label htmlFor="fileId" className="text">
                Link to resource
              </label>
              <input
                type="text"
                value={link}
                name="link"
                onChange={OnChange}
                className="text"
                id="fileId"
              />
            </div>
          ) : type === "None" ? null : null}
          <div className="CreateTeamtaskButtonDiv">
            <button
              type="submit"
              disabled={!isAllfield}
              className={
                !isAllfield
                  ? "CreateTeamtaskDisabled text"
                  : isLoading
                  ? "CreateTeamtaskLoader"
                  : !isLoading
                  ? "CreateTeamtaskButton text"
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
