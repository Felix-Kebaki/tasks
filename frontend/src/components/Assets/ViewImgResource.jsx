import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import "./viewSubmissions.css";

export function ViewImgResource({ setViewResource, viewResource }) {
  return (
    <section className="ViewResourceMainSection">
      <div className="ViewResourceMainDiv">
        <img src={viewResource} alt="Resource_Image" />
        <div className="CloseViewOfImgResourceDiv">
          <FontAwesomeIcon
            icon={faX}
            onClick={() => setViewResource(null)}
            className="CloseViewResourceIcon"
          />
        </div>
      </div>
    </section>
  );
}
