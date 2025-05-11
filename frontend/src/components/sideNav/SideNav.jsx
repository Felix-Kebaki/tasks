import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";

import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { logoutS } from "../../redux/features/authSlice";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { useGetUnreadQuery } from "../../redux/api/notifyApiSlice";
import { useGetCategoryQuery } from "../../redux/api/allCategoryApiSlice";

import "./sideNav.css";
import { ProfileEdit } from "../profileEdit/ProfileEdit";

export function SideNav() {
  const [profileView, setProfileView] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logout] = useLogoutMutation();
  const { refetch, data: notifications, isLoading } = useGetUnreadQuery();
  const {refetch:catrefetch,data:categories}=useGetCategoryQuery()

  const HanldeMouseEnter = () => {
    document
      .querySelector(".AppearAtTopOnSideNav")
      .classList.add("AppearAtTopOnSideNavShow");
  };
  const HandleMouseLeave = () => {
    document
      .querySelector(".AppearAtTopOnSideNav")
      .classList.remove("AppearAtTopOnSideNavShow");
  };

  const HandleViewProfile = () => {
    setProfileView(true);
  };

  const HandleClickLogout = async () => {
    try {
      await logout();
      dispatch(logoutS());
      navigate("/home");
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(()=>{
    catrefetch()
  },[catrefetch])

  return (
    <section className="SideNavMainSec">
      <nav>
        <div className="SideNavTopMainDiv">
          <div
            className="SideNavProfileAndNameDiv"
            onMouseEnter={HanldeMouseEnter}
            onMouseLeave={HandleMouseLeave}
          >
            <div className="SideNavProfileDiv">
              <p className="title">
                {userInfo && userInfo.firstName.charAt(0).toUpperCase()}
                {userInfo && userInfo.lastName.charAt(0).toUpperCase()}
              </p>
            </div>
            <p className="text">
              {userInfo && userInfo.firstName}
              <FontAwesomeIcon icon={faAngleDown} id="SideNavNameArrow" />
            </p>
            <div className="AppearAtTopOnSideNav">
              <p className="text" onClick={HandleViewProfile}>
                <FontAwesomeIcon
                  icon={faUser}
                  className="SideNavSubMenuIcons"
                />
                Profile
              </p>
              <p onClick={HandleClickLogout} className="text">
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="SideNavSubMenuIcons"
                />{" "}
                Logout
              </p>
            </div>
          </div>
          <Link
            to="/app/notifications"
            className="SideNavNotificationIconMainDiv"
          >
            <FontAwesomeIcon icon={faBell} id="BellIcon" />
            {notifications && notifications.length !== 0 ? (
              <div className="NotificationNumberDiv">
                <p className="text">
                  {notifications && notifications.length >= 5
                    ? "5+"
                    : notifications && notifications.length}
                </p>
              </div>
            ) : null}
          </Link>
        </div>
        <div className="SideNavMainNavlinksDiv">
          <NavLink to="/app" className="EachLink text" activeclassname="active">
            <FontAwesomeIcon
              icon={faTableColumns}
              className="SideNavLinkIcons"
            />
            Dashboard
          </NavLink>
          <NavLink
            to="/app/daily-objectives"
            className="EachLink text TodayLink"
            activeclassname="active"
          >
            <div>{new Date().getDate()}</div>Today
          </NavLink>
          <NavLink
            to="/app/goals"
            className="EachLink text"
            activeclassname="active"
          >
            <FontAwesomeIcon icon={faBullseye} className="SideNavLinkIcons" />
            Personal
          </NavLink>
          <NavLink
            to="/app/upcoming"
            className="EachLink text"
            activeclassname="active"
          >
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="SideNavLinkIcons"
            />
            Upcoming
          </NavLink>
          <NavLink
            to="/app/teams"
            className="EachLink text"
            activeclassname="active"
          >
            <FontAwesomeIcon
              icon={faPeopleGroup}
              className="SideNavLinkIcons"
            />
            Your teams
          </NavLink>
          <NavLink
            to="/app/tasks"
            className="EachLink text"
            activeclassname="active"
          >
            <FontAwesomeIcon icon={faListCheck} className="SideNavLinkIcons" />
            Team tasks
          </NavLink>
          <NavLink
            to="/app/completed"
            className="EachLink text"
            activeclassname="active"
          >
            <FontAwesomeIcon
              icon={faCalendarCheck}
              className="SideNavLinkIcons"
            />
            Completed
          </NavLink>
        </div>
      </nav>
      {
        categories && categories.length!==0?
      <div className="SideNavMainCategoryDiv">
        <p className="CategoryMainTitleNav title">Categories</p>
      {
        categories && categories.map((cat)=>(
          <Link to={"/app/categories/"+cat.category} key={cat} className="SideNavCategorydiv">
            <p className="ActualCategory text"><span>#</span>{cat.category}</p>
            <p className="ActualCategoryNo text">{cat.count}</p>
          </Link>
        ))
      }
      </div>:null}
      {profileView ? <div className="OverflowAddMainDiv">
        <ProfileEdit/>
      </div> : null}
    </section>
  );
}
