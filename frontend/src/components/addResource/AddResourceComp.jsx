import { useState } from "react";
import "./addResource.css";

import { useAddResourcesApiMutation } from "../../redux/api/teamTaskApiSlice";
import { useToast } from "../../context/ToastContext";

export function AddResourceComp({ addResource, setAddResource }) {
  const [type, setType] = useState("");
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [addResourcesApi, { isLoading }] = useAddResourcesApiMutation();
  const { showToast } = useToast();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const ClickOnCancel = () => {
    setAddResource(null);
  };

  const HandleAddResource = async (e) => {
    e.preventDefault();
    try {
      const submitedData = {
        type,
        fileUrl: type === "Link" ? fileUrl : undefined,
        files: type !== "Link" ? files : undefined,
      };
      const response = await addResourcesApi({
        data: submitedData,
        id: addResource,
      });
      if (response.error) {
        setErrorMessage(
          response.error.data.error ||
            response.error.error ||
            "Unknown error occured",
        );
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        showToast(response.data.message, "success");
        setAddResource(null);
      }
    } catch (error) {
      console.error(error.message || error);
      setErrorMessage(error.message || error);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <section className="AddResourceMainSec">
      <form onSubmit={HandleAddResource}>
        <div className="AddResourceTopDiv">
          <p className="title">Add Resources</p>
        </div>
        <div className="AddResourceActualForm">
          <div className="text">
            <label htmlFor="ResourcetypeId">Resource type</label>
            <br />
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              id="ResourcetypeId"
            >
              {" "}
              <option value="" disabled selected>
                Select upload type
              </option>
              <option value="Document">Document</option>
              <option value="Photo">Photo</option>
              <option value="Link">Link</option>
            </select>
            <br />
          </div>
          {type === "Link" ? (
            <div className="text">
              <label htmlFor="Linkid">Resource link</label>
              <br />
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                id="Linkid"
              />
              <br />
            </div>
          ) : type === "Document" || type === "Photo" ? (
            <div className="DocumentOrPhotoInpDiv text">
              <label htmlFor="fileId">
                {type === "Document" ? "Document" : "Photo"}
              </label>
              <br />
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                id="fileId"
              />
            </div>
          ) : null}
          <div className="AddResourceMainBtnDiv">
            <button type="submit" className="text">Submit</button>
            <button type="button" onClick={ClickOnCancel} className="text">
              Cancel
            </button>
          </div>
          {errorMessage !== "" ? <pre>{errorMessage}</pre> : null}
        </div>
      </form>
    </section>
  );
}
