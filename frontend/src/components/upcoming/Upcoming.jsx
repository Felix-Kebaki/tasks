import { useState, useEffect } from "react";
import "./upcoming.css";

import { AddUpcoming } from "../addUpcoming/AddUpcoming";
import { UpcomingConfirm } from "../confirm/UpcomingConfirm";
import { Loading } from "../loading/Loading";

import { useGetUpcomingsQuery } from "../../redux/api/upcomingApiSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Upcoming() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [add, setAdd] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data, refetch, isLoading } = useGetUpcomingsQuery({
    month: month + 1,
    year,
  });

  useEffect(() => {
    refetch();
    if (data && Array.isArray(data)) {
      const eventMap = {};
      data.forEach((event) => {
        if (event.eventDate) {
          const dateObj = new Date(event.eventDate);
          if (!isNaN(dateObj)) {
            const dateKey = dateObj.toISOString().split("T")[0];
            if (!eventMap[dateKey]) {
              eventMap[dateKey] = [];
            }
            eventMap[dateKey].push(event.title || "Untitled");
          } else {
            console.warn("Invalid date format in event:", event);
          }
        } else {
          console.warn("Missing date in event:", event);
        }
      });
      setEvents(eventMap);
    }
  }, [data, month, year, add, confirm]);

  const handleNextMonth = () => {
    const nextMonth = new Date(year, month + 1, 1);
    setCurrentDate(nextMonth);
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(year, month - 1, 1);
    setCurrentDate(prevMonth);
  };

  const handleDateClick = async (date) => {
    setAdd(null);
    setAdd(date);
  };

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const days = getDaysInMonth(year, month);

  const blankDays = [];
  if (days.length > 0) {
    for (let i = 0; i < days[0].getDay(); i++) {
      blankDays.push(
        <div key={`blank-${i}`} className="calendarDays empty"></div>
      );
    }
  }

  if (isLoading) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }

  return (
    <section className="UpcomingMainSec">
      <div className="UpcomingMainDiv">
        <p className="UpcomingMainTitle title">Events calendar</p>
        <div className="calendarHeader">
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="nextMonthbutton"
            onClick={handlePrevMonth}
          />
          <p className="text">
            {currentDate.toLocaleString("default", { month: "long" })} {year}
          </p>

          <FontAwesomeIcon
            icon={faAngleRight}
            onClick={handleNextMonth}
            className="nextMonthbutton"
          />
        </div>
        <div className="calendarContainer">
          <div className="calendarDays">
            {daysOfWeek.map((day) => (
              <div key={day} className="calendarDayName text">
                {day}
              </div>
            ))}
          </div>

          <div className="CalendarGridMainDiv">
            {blankDays}
            {days.map((date) => {
              const dateKey = date.toISOString().split("T")[0];
              return (
                <div
                  key={dateKey}
                  onClick={() => handleDateClick(date)}
                  className="CalenderDayMainDiv"
                >
                  <div
                    className={
                      events[dateKey]
                        ? " OnlyDateDivAndDeleteUpcoming text"
                        : "OnlyDateDivWithoutDeleteUpcoming text"
                    }
                  >
                    <p className="OnlyDatesWithEvent">
                      {date.toDateString() === new Date().toDateString()
                        ? "Today"
                        : date.getDate()}
                    </p>
                    {events[dateKey] ? (
                      <FontAwesomeIcon
                        icon={faXmark}
                        id="DeleteUpcomingIcon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirm(date);
                        }}
                      />
                    ) : null}
                  </div>
                  {events[dateKey] && (
                    <div className="event">
                      {events[dateKey].map((ev, i) => (
                        <div key={i} className="eventMainDiv text">
                          <div>
                            <FontAwesomeIcon
                              icon={faHashtag}
                              id="HashtagIconAtUpcomings"
                            />
                            <p>{ev}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {add !== null ? (
          <div className="OverflowAddMainDiv">
            <AddUpcoming setAdd={setAdd} add={add} />
          </div>
        ) : null}
        {confirm !== null ? (
          <div className="OverflowAddMainDiv">
            <UpcomingConfirm setConfirm={setConfirm} confirm={confirm} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
