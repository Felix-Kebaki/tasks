import React, { useState } from "react";
import "./form.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setCredentials } from "../redux/features/authSlice";
import { useRegisterMutation } from "../redux/api/userApiSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";

import formBackground from "../assets/images/authBackground.jpg";
import Logo from "../assets/images/Logo.png";
import Loader from "../assets/images/Loader.png";
import { Verify } from "./verify/Verify";

export function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
  });
  const { firstName, lastName, email, password, password2 } = formData;

  const [register, { isLoading }] = useRegisterMutation();

  const OnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const HandleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === password2) {
        const response = await register(formData);
        if (response.error) {
          setErrorMessage(response.error.data.error);
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
        } else {
          setVerifying(true);
          dispatch(setCredentials(response.data.User));
          navigate("/app/dashboard");
        }
      } else {
        setErrorMessage("Password don't match");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
        throw new Error("Password don't match");
      }
    } catch (error) {
      console.error("Error at frontend in registering", error.message);
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
          {verifying ? (
            <Verify />
          ) : (
            <form className="AuthFormDiv" onSubmit={HandleFormSubmit}>
              <Link to="/register" className="AuthFormLogoAndTitle">
                <img src={Logo} alt="" />
                <p className="title">TaskTracker</p>
              </Link>
              <p className="WhichTypeOfAuth title">Sign up</p>
              <p className="SwitchToOtherFormAuth text">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
              <div className="InsideInputAtAuth">
                <div className="EachInputAuthMainDiv text">
                  <label htmlFor="FirstName" className="text">
                    First name
                  </label>
                  <br />
                  <input
                    type="text"
                    id="FirstName"
                    name="firstName"
                    value={firstName}
                    onChange={OnChange}
                    className="text"
                  />
                  <br />
                </div>
                <div className="EachInputAuthMainDiv text">
                  <label htmlFor="LastName" className="text">
                    Last name
                  </label>
                  <br />
                  <input
                    type="text"
                    id="LastName"
                    name="lastName"
                    value={lastName}
                    onChange={OnChange}
                    className="text"
                  />
                  <br />
                </div>
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
                  <label htmlFor="PasswordId" className="text">
                    Password
                  </label>
                  <div className="EachInputAuthPasswordContainer">
                    <input
                      type={show1 ? "text" : "password"}
                      id="PasswordId"
                      value={password}
                      name="password"
                      onChange={OnChange}
                      className="text"
                    />
                    <div className="InsideShowPasswordIcon">
                      <FontAwesomeIcon
                        icon={!show1 ? faEyeSlash : faEye}
                        onClick={() => setShow1(!show1)}
                        className="ShowHideIcon"
                      />
                    </div>
                  </div>
                </div>

                <div className="EachInputAuthMainDiv text">
                  <label htmlFor="Password2Id" className="text">
                    Confirm password
                  </label>
                  <div className="EachInputAuthPasswordContainer">
                    <input
                      type={show2 ? "text" : "password"}
                      id="Password2Id"
                      value={password2}
                      name="password2"
                      onChange={OnChange}
                      className="text"
                    />
                    <div className="InsideShowPasswordIcon">
                      <FontAwesomeIcon
                        icon={!show2 ? faEyeSlash : faEye}
                        onClick={() => setShow2(!show2)}
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
          )}
        </div>
      </div>
    </section>
  );
}
