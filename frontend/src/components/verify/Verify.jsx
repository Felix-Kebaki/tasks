import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import loader from "../../assets/images/Loader.png";
import "./verify.css";

export function Verify() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const HandleVerify = (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
    } catch (error) {
      console.error(error.message || error);
    }
  };

  return (
    <section className="VerifyMainSec">
      <div className="VerifyMainDiv">
        <p className="VerifyMainTitle title">Verify your email</p>
        <p className="VerifyMainText text">
          Enter the 6-digit code sent to your email address.
        </p>
        <form onSubmit={HandleVerify}>
          <div className="VerifyDigitsInputDiv">
            {code.map((digit, index) => (
              <input />
            ))}
          </div>
          <div className="VerifyMainBtnDiv">
            <button
              className={
                isLoading ? "VerifyMainLoaderImg" : "VerifyMainBtn text"
              }
            >
              {isLoading ? (
                <img src={loader} alt="Loading..." className="VerifyLoaderImg"/>
              ) : (
                "Verify Email"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
