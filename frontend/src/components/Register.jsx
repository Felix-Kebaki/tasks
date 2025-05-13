import React, { useState } from "react";
import "./form.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setCredentials } from "../redux/features/authSlice";
import { useRegisterMutation } from "../redux/api/userApiSlice";
import { useToast } from "../context/ToastContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";

import formBackground from "../assets/images/authBackground.jpg";
import Logo from "../assets/images/Logo.png";
import Loader from "../assets/images/Loader.png";

export function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const [show1,setShow1]=useState(false)
  const [show2,setShow2]=useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
  });
  const { firstName, lastName, email, password, password2 } = formData;
  const {showToast}=useToast()

  const [register, { isLoading }] = useRegisterMutation();

  const OnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const ShowFalse1 = () => {
    setShow1(false);
  };

  const ShowTrue1 = () => {
    setShow1(true);
  };
  const ShowFalse2 = () => {
    setShow2(false);
  };

  const ShowTrue2 = () => {
    setShow2(true);
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
          showToast(response.data.message,"success");
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
          <form className="AuthFormDiv" onSubmit={HandleFormSubmit}>
            <Link to="/home" className="AuthFormLogoAndTitle">
              <img src={Logo} alt="" />
              <p className="title">TaskTracker</p>
            </Link>
            <p className="WhichTypeOfAuth title">Sign up</p>
            <p className="SwitchToOtherFormAuth text">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
            <div className="InsideInputAtAuth">
              <div>
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
              <div>
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
              <div>
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
              <div>
                <label htmlFor="PasswordId" className="text">
                  Password
                </label>
                <div className="passwordsInputDiv">
                  <input
                    type={show1 ? "text" : "password"}
                    id="PasswordId"
                    value={password}
                    name="password"
                    onChange={OnChange}
                    className="text"
                  />
                  <span className="InsideShowPasswordIcon">
                    {!show1 ? (
                      <FontAwesomeIcon icon={faEyeSlash} onClick={ShowTrue1} className="ShowHideIcon" />
                    ) : (
                      <FontAwesomeIcon icon={faEye} onClick={ShowFalse1} className="ShowHideIcon"/>
                    )}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="Password2Id" className="text">
                  Confirm password
                </label>
                <div className="passwordsInputDiv">
                  <input
                    type={show2 ? "text" : "password"}
                    id="Password2Id"
                    value={password2}
                    name="password2"
                    onChange={OnChange}
                    className="text"
                  />
                  <span className="InsideShowPasswordIcon">
                    {!show2 ? (
                      <FontAwesomeIcon icon={faEyeSlash} onClick={ShowTrue2} className="ShowHideIcon"/>
                    ) : (
                      <FontAwesomeIcon icon={faEye} onClick={ShowFalse2} className="ShowHideIcon" />
                    )}
                  </span>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className={
                    isLoading ? "SubmitAuthLoaderMode" : "SubmitAuthForm text"
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
