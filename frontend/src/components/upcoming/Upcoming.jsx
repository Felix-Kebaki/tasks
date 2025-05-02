import { useState, useEffect } from "react";
import "./upcoming.css";

import { AddUpcoming } from "../addUpcoming/AddUpcoming";

import { useGetUpcomingsQuery } from "../../redux/api/upcomingApiSlice";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Upcoming() {
  const [add, setAdd] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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

  const arg = { year, month:month+1};
  const { refetch, data } = useGetUpcomingsQuery(arg);

  const fetchEvents = async () => {
    try {
        const fetchedEvents = {};
        data && data.forEach((event) => {
          const dateKey = new Date(event.date).toISOString().split("T")[0];
          if (!fetchedEvents[dateKey]) fetchedEvents[dateKey] = [];
          fetchedEvents[dateKey].push(event);
          console.log("Event on:", dateKey);
        });
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
  };

  const handleDateClick =async (date) => {
    setAdd(date)
     };

     

  useEffect(() => {
    const today = new Date();
    if (today.getMonth() !== month || today.getFullYear() !== year) {
      setEvents({});
    }
    if(data){
    fetchEvents()}
    console.log(data)
  }, [month, year,add]);

  const blankDays = [];
  if (days.length > 0) {
    for (let i = 0; i < days[0].getDay(); i++) {
      blankDays.push(
        <div key={`blank-${i}`} className="calendar-day empty"></div>
      );
    }
  }
  return (
    <section className="UpcomingMainSec">
      <div
        className={
          add !== null ? "calenderContainerNoScroll" : "calendarContainer"
        }
      >
        <div className="calendarHeader">
          <p className="title">
            {currentDate.toLocaleString("default", { month: "long" })} {year}
          </p>
        </div>

        <div className="calendar-days">
          {daysOfWeek.map((day) => (
            <div key={day} className="calendar-day-name text">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {blankDays}
          {days.map((date) => {
            const dateKey = date.toISOString().split("T")[0];
            return (
              <div
                key={dateKey}
                onClick={() => handleDateClick(date)}
                className="calendar-day"
              >
                <div className="OnlyDateDiv text">{date.getDate()}</div>

                {events[dateKey]?.map((e, i) => (
                  <div key={i} className="eventMainDiv text">
                    {e.name}
                  </div>
                ))}
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
    </section>
  );
}
