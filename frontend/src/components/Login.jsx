import React, { useState } from "react";
import "./form.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useLoginMutation } from "../redux/api/userApiSlice";
import { setCredentials } from "../redux/features/authSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";

import formBackground from "../assets/images/authBackground.jpg";
import Logo from "../assets/images/Logo.png";
import Loader from "../assets/images/Loader.png";

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const OnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [login, { isLoading }] = useLoginMutation();

  const HandleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      if (response.error) {
        console.error(
          "Error logging in",
          response.error.data.error || response.error.error
        );
        setErrorMessage(response.error.data.error || response.error.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        dispatch(setCredentials(response.data.User));
        navigate("/app/dashboard");
      }
    } catch (error) {
      console.error("Error in frontend on trying to login", error.message);
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <section className="AuthFormMainSec">
      <div className="AuthFormMainDiv">
        <img src={formBackground} className="AuthBackground" />
        <div className="AuthActualFormDiv">
          <form className="AuthFormDiv" onSubmit={HandleSubmitLogin}>
            <Link to="/login" className="AuthFormLogoAndTitle">
              <img src={Logo} alt="" />
              <p className="title">TaskTracker</p>
            </Link>
            <p className="WhichTypeOfAuth text">Sign in</p>
            <p className="SwitchToOtherFormAuth text">
              New user? <Link to="/register">Create an account</Link>
            </p>
            <div className="InsideInputAtAuth">
              <div className="EachInputAuthMainDiv text">
                <label htmlFor="EmailId" className="text">
                  Email address
                </label>
                <br />
                <input
                  type="email"
                  id="EmailId"
                  name="email"
                  value={email}
                  onChange={OnChange}
                  className="text"
                />
                <br />
              </div>
              <div className="EachInputAuthMainDiv text">
                <label htmlFor="passwordId">Password</label>
                <div className="EachInputAuthPasswordContainer">
                  <input
                    type={show ? "text" : "password"}
                    id="PasswordId"
                    value={password}
                    name="password"
                    onChange={OnChange}
                    className="text"
                  />
                  <div className="InsideShowPasswordIcon">
                      <FontAwesomeIcon
                        icon={!show?faEyeSlash :faEye}
                        onClick={()=>setShow(!show)}
                        className="ShowHideIcon"
                      />
                  </div>
                </div>
              </div>
              <div className="SubmitAuthFormMainDiv">
                <button
                  type="submit"
                  className={
                    isLoading
                      ? "SubmitAuthLoaderMode"
                      : "SubmitAuthFormBtn text"
                  }
                >
                  {isLoading ? (
                    <img
                      src={Loader}
                      alt="Loading..."
                      className="LoaderImage"
                    />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
            <pre className="text">{errorMessage ? errorMessage : null}</pre>
          </form>
        </div>
      </div>
    </section>
  );
}
