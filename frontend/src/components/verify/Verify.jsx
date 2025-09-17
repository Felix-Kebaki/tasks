import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useVerifyUserMutation } from "../../redux/api/userApiSlice";

import loader from "../../assets/images/Loader.png";
import VerifyBackground from "../../assets/images/authBackground.jpg";
import "./verify.css";

export function Verify() {
    const {userInfo}=useSelector((state)=>state.auth)
    
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const navigate = useNavigate();

  const [verifyUser, { isLoading }] = useVerifyUserMutation();

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRef.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const HandleVerify = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      const response = await verifyUser({ userId:userInfo._id,data:{code: verificationCode }});
      if (response.error) {
        console.error(response.error.data.error || response.error.error);
      } else {
        console.log(response.data.message);
        navigate("/app/dashboard");
      }
    } catch (error) {
      console.error(error.message || error);
    }
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      HandleVerify(new Event("submit"));
    }
  }, [code]);

  return (
    <section className="VerifyMainSec">
      <div className="VerifyMainDivRelative">
        <img src={VerifyBackground} className="VerifyMainDivBackground" />
        <div className="VerifyMainDiv">
          <div className="VerifyMainDivInside">
            <p className="VerifyMainTitle title">Verify your email</p>
            <p className="VerifyMainText text">
              Enter the 6-digit code sent to your email address.
            </p>
            <form onSubmit={HandleVerify}>
              <div className="VerifyDigitsInputDiv">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRef.current[index] = el;
                    }}
                    type="text"
                    maxLength="6"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>
              <div className="VerifyMainBtnDiv">
                <button
                  className={
                    isLoading ? "VerifyMainLoaderImg" : "VerifyMainBtn text"
                  }
                >
                  {isLoading ? (
                    <img
                      src={loader}
                      alt="Loading..."
                      className="VerifyLoaderImg"
                    />
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
