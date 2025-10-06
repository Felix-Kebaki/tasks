import "./showNotificationInstr.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export function ShowNotificationInstr({
  setShowInstructions,
  showInstructions,
}) {
  const ExitInstr = () => {
    setShowInstructions(null);
  };
  return (
    <section className="ShowNotificationInstrMainSec">
      <div className="ShowNotificationInstrMainDiv">
        <div className="ShowNotificationInstrTopDiv">
          <p className="title">Enable Notifications</p>
          <FontAwesomeIcon
            icon={faXmark}
            className="CloseInstrIcon"
            onClick={ExitInstr}
          />
        </div>
        {showInstructions === "Chrome" ? (
          <div className="EachBrowserInstructionsDiv text">
            <p>1. Click the lock 🔒 icon in the address bar.</p>
            <p>2. Find Notifications.</p>
            <p>3. Select Allow.</p>
            <p>4. Refresh this page.</p>
          </div>
        ) : showInstructions === "Firefox" ? (
          <div className="EachBrowserInstructionsDiv text">
            <p>1. Click the lock 🔒 icon in the address bar.</p>
            <p>2. Go to Permissions → Send Notifications.</p>
            <p>3. Select Allow.</p>
            <p>4. Refresh this page.</p>
          </div>
        ) : showInstructions === "Safari" ? (
          <div className="EachBrowserInstructionsDiv text">
            <p>1. Go to Safari › Preferences › Websites › Notifications.</p>
            <p>2. Find this website in the list.</p>
            <p>3. Set to Allow.</p>
            <p>4. Refresh this page.</p>
          </div>
        ) : showInstructions === "Edge" ? (
          <div className="EachBrowserInstructionsDiv text">
            <p>1. Click the lock 🔒 icon in the address bar.</p>
            <p>2. Under Permissions for this site, find Notifications.</p>
            <p>3. Select Allow.</p>
            <p>4. Refresh this page.</p>
          </div>
        ) : showInstructions === "Opera" ? (
          <div className="EachBrowserInstructionsDiv text">
            <p>1. Click the lock 🔒 icon in the address bar.</p>
            <p>2. Go to Site settings.</p>
            <p>3. Find Notifications and select Allow.</p>
            <p>4. Refresh this page.</p>
          </div>
        ) : showInstructions === "Other" ? (
          <div className="EachBrowserInstructionsDiv text">
            <p>1. Open your browser’s Settings or Preferences.</p>
            <p>2. Search for Notifications or Site Permissions.</p>
            <p>3. Locate this website and set permissions to Allow.</p>
            <p>4. Refresh this page.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
