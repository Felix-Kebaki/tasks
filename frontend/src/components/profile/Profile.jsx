import React, { useEffect, useMemo, useState } from "react";
import "./profile.css";

import { useEditPasswordMutation } from "../../redux/api/userApiSlice";
import { useEditProfileMutation } from "../../redux/api/userApiSlice";

import { useSelector } from "react-redux";

import { DeleteAccount } from "../confirm/DeleteAccount";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import Loader from "../../assets/images/Loader.png";

export function Profile() {
  const { userInfo } = useSelector((state) => state.auth);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirmNew: "",
  });
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [deleteAcc, setDeleteAcc] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessagePass, setErrorMessagePass] = useState("");

  const { firstName, lastName, email } = profileForm;
  const { current, newPass, confirmNew } = passwordForm;

  const [editPassword, { isLoading: isLoadingPass }] =
    useEditPasswordMutation();
  const [editProfile, { isLoading }] = useEditProfileMutation();

  const OnChange = (e) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const OnChangeProfile = (e) => {
    setProfileForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const HandleEditPassword = async (e) => {
    e.preventDefault();
    try {
      if (newPass === confirmNew) {
        const res = await editPassword({
          data: {
            oldPassword: current,
            newPassword: newPass,
          },
        });
        if (res.error) {
          console.error(res.error.data.error || res.error.error);
          setErrorMessagePass(res.error.data.error || res.error.error);
          setTimeout(() => {
            setErrorMessagePass("");
          }, 3000);
        } else {
          console.log(res.data.message);
          setPasswordForm({ current: "", newPass: "", confirmNew: "" });
        }
      } else {
        setErrorMessagePass("Password don't match");
        setTimeout(() => {
          setErrorMessagePass("");
        }, 3000);
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessagePass(error.message);
      setTimeout(() => {
        setErrorMessagePass("");
      }, 3000);
    }
  };

  const HandleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await editProfile({ data: profileForm });
      if (res.error) {
        console.error(res.error.data.message || res.error.error);
        setErrorMessage(res.error.data.error || res.error.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        console.log(res.data.message);
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const isUnchangedProfile = useMemo(() => {
    return (
      firstName === (userInfo?.firstName || "") &&
      lastName === (userInfo?.lastName || "") &&
      email === (userInfo?.email || "") &&
      !isLoading
    );
  }, [userInfo, profileForm]);

  const isPasswordKeyed = useMemo(() => {
    return current.length > 0 && newPass.length > 0 && confirmNew.length > 0;
  }, [passwordForm]);

  useEffect(() => {
    if (userInfo) {
      setProfileForm({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
      });
    }
  }, [userInfo]);
  return (
    <section className="ProfileEditMainSec">
      <div className="ProfileEditMainDiv">
        <form onSubmit={HandleEditProfile} className="ProfileMainForm">
          <p className="title">Your profile</p>
          <div className="text">
            <label htmlFor="firstNameId">First name</label>
            <br />
            <input
              type="text"
              id="firstNameId"
              value={firstName}
              name="firstName"
              onChange={OnChangeProfile}
            />
          </div>
          <div className="text">
            <label htmlFor="lastNameId">Last name</label>
            <br />
            <input
              type="text"
              id="lastNameId"
              value={lastName}
              name="lastName"
              onChange={OnChangeProfile}
            />
          </div>
          <div className="text">
            <label htmlFor="emailId">Email address</label>
            <br />
            <input
              type="email"
              id="emailId"
              value={email}
              name="email"
              onChange={OnChangeProfile}
            />
          </div>
          <div className="text">
            <button
              disabled={isUnchangedProfile}
              type="submit"
              className={
                isUnchangedProfile
                  ? "DisabledBtn text"
                  : !isLoading
                  ? "EditProfileBtn text"
                  : isLoading
                  ? "EditProfileLoader"
                  : null
              }
            >
              {isLoading ? <img src={Loader} alt="Loading..." /> : "Save"}
            </button>
          </div>
          <pre>{errorMessage}</pre>
        </form>
        <form onSubmit={HandleEditPassword} className="PasswordMainForm">
          <p className="title">Password</p>
          <div>
            <div className="EditPasswordOuterDiv text">
              <label htmlFor="oldPasswordId">Current password</label>
              <div className="EditPasswordInputContainer">
                <input
                  type={show1 ? "text" : "password"}
                  id="oldPasswordId"
                  value={current}
                  name="current"
                  onChange={OnChange}
                />
                <div className="EditPasswordIconsDiv">
                  <FontAwesomeIcon
                    icon={show1 ? faEye : faEyeSlash}
                    className="EditPasswordIcons"
                    onClick={() => setShow1(!show1)}
                  />
                </div>
              </div>
            </div>
            <div className="EditPasswordOuterDiv text">
              <label htmlFor="NewPasswordId">New password</label>
              <div className="EditPasswordInputContainer">
                <input
                  type={show2 ? "text" : "password"}
                  id="NewPasswordId"
                  value={newPass}
                  name="newPass"
                  onChange={OnChange}
                />
                <div className="EditPasswordIconsDiv">
                  <FontAwesomeIcon
                    icon={show2 ? faEye : faEyeSlash}
                    className="EditPasswordIcons"
                    onClick={() => setShow2(!show2)}
                  />
                </div>
              </div>
            </div>
            <div className="EditPasswordOuterDiv text">
              <label htmlFor="confirmPasswordId">Confirm password</label>
              <div className="EditPasswordInputContainer">
                <input
                  type={show3 ? "text" : "password"}
                  id="confirmPasswordId"
                  value={confirmNew}
                  name="confirmNew"
                  onChange={OnChange}
                />
                <div className="EditPasswordIconsDiv">
                  <FontAwesomeIcon
                    icon={show3 ? faEye : faEyeSlash}
                    className="EditPasswordIcons"
                    onClick={() => setShow3(!show3)}
                  />
                </div>
              </div>
            </div>
            <div className="EditPasswordOuterDiv text">
              <button
                disabled={!isPasswordKeyed}
                type="submit"
                className={
                  !isPasswordKeyed
                    ? "DisabledBtn text"
                    : !isLoadingPass
                    ? "EditProfileBtn text"
                    : isLoadingPass
                    ? "EditProfileLoader"
                    : null
                }
              >
                {isLoadingPass ? <img src={Loader} alt="Loading..." /> : "Save"}
              </button>
            </div>
          </div>
          <pre>{errorMessagePass}</pre>
        </form>
        <div className="DeleteAccountMainDiv">
          <p className="DeleteAccountMainTitle title">Delete Account</p>
          <p className="DeleteAccMainDisc text">
            You will lose access to your TaskTracker account once your deletion
            request has been submitted.
          </p>
          <div>
            <button className="text" onClick={() => setDeleteAcc(true)}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
      {deleteAcc ? (
        <div className="OverflowAddMainDiv">
          <DeleteAccount setDeleteAcc={setDeleteAcc} />
        </div>
      ) : null}
    </section>
  );
}
