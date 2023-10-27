import React, { Component, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import _ from "lodash";
import Select from "react-select";
import "./App.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const App = () => {
  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York");
  const [newEvent, setNewEvent] = useState();
  const [selectedEvent, setSelectedEvent] = useState();
  const [events, setEvents] = useState([
    {
      start: moment("2023-10-26 02:00", "YYYY-MM-DD HH:mm").toDate(),
      end: moment("2023-10-26 03:00", "YYYY-MM-DD HH:mm").toDate(),
      title: "appointment 1",
    },
    {
      start: moment("2023-10-26 05:00", "YYYY-MM-DD HH:mm").toDate(),
      end: moment("2023-10-26 06:00", "YYYY-MM-DD HH:mm").toDate(),
      title: "appointment 1",
    },
    {
      start: moment("2023-10-26 08:00", "YYYY-MM-DD HH:mm").toDate(),
      end: moment("2023-10-26 09:00", "YYYY-MM-DD HH:mm").toDate(),
      title: "appointment 2",
    },
    {
      start: moment("2023-10-26 11:00", "YYYY-MM-DD HH:mm").toDate(),
      end: moment("2023-10-26 12:00", "YYYY-MM-DD HH:mm").toDate(),
      title: "appointment 3",
    },
    {
      start: moment("2023-10-26 14:00", "YYYY-MM-DD HH:mm").toDate(),
      end: moment("2023-10-26 15:00", "YYYY-MM-DD HH:mm").toDate(),
      title: "appointment 4",
    },
    {
      start: moment("2023-10-26 17:00", "YYYY-MM-DD HH:mm").toDate(),
      end: moment("2023-10-26 18:00", "YYYY-MM-DD HH:mm").toDate(),
      title: "appointment 5",
    },
    {
      start: moment("2023-10-26 20:00", "YYYY-MM-DD HH:mm").toDate(),
      end: moment("2023-10-26 21:00", "YYYY-MM-DD HH:mm").toDate(),
      title: "appointment 6",
    },
  ]);
  const [holidays, setHolidays] = useState([
    {
      start: moment("2023-10-02").toDate(),
      end: moment("2023-10-02").toDate(),
      title: "Gandhi Jayanti",
      editable: false,
      isHoliday: true,
    },
    {
      start: moment("2023-10-08").toDate(),
      end: moment("2023-10-08").toDate(),
      title: "Dussehra",
      editable: false,
      isHoliday: true,
    },
    {
      start: moment("2023-10-15").toDate(),
      end: moment("2023-10-15").toDate(),
      title: "Eid-e-Milad",
      editable: false,
      isHoliday: true,
    },
    {
      start: moment("2023-10-19").toDate(),
      end: moment("2023-10-19").toDate(),
      title: "Diwali",
      editable: false,
      isHoliday: true,
    },
    {
      start: moment("2023-11-04").toDate(),
      end: moment("2023-11-04").toDate(),
      title: "Guru Nanak Jayanti",
      editable: false,
      isHoliday: true,
    },
  ]);

  const getUsersTimezone = () => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSelectedTimezone(userTimezone);
  };

  useEffect(() => {
    getUsersTimezone();
  }, []);

  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
  };

  const adjustedEvents = events.map((event) => {
    const start = moment(event.start).tz(selectedTimezone);
    const end = moment(event.end).tz(selectedTimezone);
    return { ...event, start, end };
  });

  const handleSelectEvent = (event) => {
    if (event.isHoliday) {
      // Do not allow selecting holiday events (prevent dragging)
      return;
    }
    setSelectedEvent(event);

    // Handle non-holiday events here (e.g., open a details modal)
  };

  const eventStyleGetter = (event) => {
    if (event.isHoliday) {
      return {
        style: {
          backgroundColor: "lightgray",
          color: "black",
        },
      };
    }
    return {};
  };

  const onEventResize = (data) => {
    const updatedEvents = [...events];

    // Find the index of the existing object in the copied array
    const index = updatedEvents.findIndex((event) => event === data.event);

    if (index !== -1) {
      // Update the properties of the existing object with the values from the updated object
      updatedEvents[index] = {
        ...updatedEvents[index],
        start: data.start,
        end: data.end,
        title: data.event.title, // You can update the title if needed
      };

      // Update the events state with the modified array
      setEvents(updatedEvents);
    }
  };

  const onEventDrop = (data) => {
    const updatedEvents = [...events];

    // Find the index of the existing object in the copied array
    const index = updatedEvents.findIndex((event) => event === data.event);

    if (index !== -1) {
      // Update the properties of the existing object with the values from the updated object
      updatedEvents[index] = {
        ...updatedEvents[index],
        start: data.start,
        end: data.end,
        title: data.event.title, // You can update the title if needed
      };

      // Update the events state with the modified array
      setEvents(updatedEvents);
    }
  };

  const handleFormSubmit = (newEvent) => {
    // Parse the start and end times from the form
    const start = new Date(newEvent.start);
    const end = new Date(newEvent.end);

    // Check if the new event overlaps with existing events or starts one hour before
    const isOverlapping = events.some(
      (event) =>
        (start >= event.start && start <= event.end) ||
        (end >= event.start && end <= event.end)
    );

    const isOneHourBefore = events.some((event) => {
      const oneHourBefore = moment(event.start).subtract(1, "hour");
      return (
        moment(newEvent.start).isSameOrAfter(oneHourBefore) &&
        moment(newEvent.start).isBefore(event.start)
      );
    });
    console.log(isOverlapping, "isOverlapping");
    console.log(isOneHourBefore, "isOneHourBefore");

    if (isOverlapping || isOneHourBefore) {
      alert("Invalid event time. Please select a valid time.");
    } else {
      const appointment = {
        start,
        end,
        title: newEvent.title,
      };

      // Add the new event to the existing events
      setEvents([...events, appointment]);
      setNewEvent({ start: "", end: "", title: "" });
    }
  };

  const Event = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
    </div>
  );

  const createNewAppointment = () => {
    const title = prompt("Enter event title:");
    if (title) {
      const start = prompt("Select start date and time (YYYY-MM-DD HH:mm):");
      if (start) {
        const end = prompt("Select end date and time (YYYY-MM-DD HH:mm):");
        if (title && start && end) {
          // Parse user input and format dates with Moment.js
          const formattedStart = moment(start, "YYYY-MM-DD HH:mm").toDate();
          const formattedEnd = moment(end, "YYYY-MM-DD HH:mm").toDate();

          const newEvent = {
            title,
            start: formattedStart,
            end: formattedEnd,
          };

          setNewEvent(newEvent);
          handleFormSubmit(newEvent);
        }
      }
    }
  };
  let updateAppointment = () => {
    const objectIndex = events.findIndex((obj) =>
      _.isEqual(obj, selectedEvent)
    );

    if (objectIndex === -1) {
      return events;
    }

    const updatedList = [...events];
    const title = prompt("Enter event title:") || selectedEvent?.title;
    const start =
      prompt("Select start date and time (YYYY-MM-DD HH:mm):") ||
      selectedEvent?.start;
    const end =
      prompt("Select end date and time (YYYY-MM-DD HH:mm):") ||
      selectedEvent?.end;
    // Parse user input and format dates with Moment.js
    const formattedStart = moment(start, "YYYY-MM-DD HH:mm").toDate();
    const formattedEnd = moment(end, "YYYY-MM-DD HH:mm").toDate();

    const updatedEventObj = {
      title,
      start: formattedStart,
      end: formattedEnd,
    };
    updatedList[objectIndex] = updatedEventObj;
    setEvents(updatedList);

    return updatedList;
  };
  let deleteAppointment = () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmation) {
      setEvents((state) =>
        _.filter(state, (item) => !_.isEqual(item, selectedEvent))
      );
    } else {
      console.log("User canceled deletion.");
    }
  };

  return (
    <div className="App" style={{ padding: 40 }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <button
          style={{
            border: "none",
            background: "#000",
            height: 40,
            borderRadius: 8,
            color: "white",
            paddingRight: 16,
            paddingLeft: 16,
          }}
          onClick={createNewAppointment}
        >
          Create new appointment
        </button>
        <select
          style={{
            border: "none",
            background: "lightgray",
            height: 40,
            borderRadius: 8,
            color: "gray",
            paddingRight: 8,
            paddingLeft: 8,
          }}
          onChange={handleTimezoneChange}
          value={selectedTimezone}
        >
          {/* {moment.tz.names().map((tz) => ({ value: tz, label: tz }))} */}
          {moment.tz.names().map((tz) => (
            <option value={tz}>{tz}</option>
          ))}
        </select>
        <button
          style={{
            border: "none",
            background: "gray",
            height: 40,
            borderRadius: 8,
            paddingRight: 16,
            paddingLeft: 16,
          }}
          onClick={getUsersTimezone}
        >
          Reset Timezone
        </button>
      </div>
      <DnDCalendar
        popup
        defaultDate={moment().toDate()}
        defaultView="month"
        events={[...events, ...holidays]}
        localizer={localizer}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        style={{ height: "100vh" }}
        onSelectEvent={handleSelectEvent}
        views={["month", "week", "day"]}
        eventPropGetter={eventStyleGetter}
        components={{
          event: Event, // Default event component for non-holiday events
          eventWrapper: ({ event, children }) => {
            if (event.isHoliday) {
              return (
                <div
                  style={{
                    cursor: event.isHoliday ? "not-allowed" : "pointer",
                    pointerEvents: event.isHoliday ? "none" : "auto",
                    // background: "red",
                  }}
                >
                  {children}
                </div>
              );
            }
            return children;
          },
        }}
      />

      {selectedEvent && (
        <dialog
          style={{
            position: "fixed",
            inset: 0,
            background: "lightgray",
            borderColor: "#ababab",
            borderRadius: 10,
            zIndex: 99,
          }}
          open={Object.keys(selectedEvent)?.length > 0}
          onClick={() => setSelectedEvent({})}
        >
          <h2>Event Details</h2>
          <p>Title: {selectedEvent?.title}</p>
          <p>
            Start: {moment(selectedEvent?.start).format("YYYY-MM-DD HH:mm")}
          </p>
          <p>End: {moment(selectedEvent?.end).format("YYYY-MM-DD HH:mm")}</p>
          <div style={{ flex: 1, flexDirection: "column", gap: 8 }}>
            <button
              onClick={updateAppointment}
              style={{
                marginBottom: 8,
                background: "rgb(100,100,225)",
                flex: 1,
                width: "100%",
                paddingTop: 8,
                paddingBottom: 8,
                color: "white",
                borderRadius: 8,
                fontSize: 18,
                border: "none",
              }}
            >
              Edit
            </button>
            <button
              onClick={deleteAppointment}
              style={{
                background: "rgb(225,100,100)",
                flex: 1,
                width: "100%",
                paddingTop: 8,
                paddingBottom: 8,
                color: "white",
                borderRadius: 8,
                fontSize: 18,
                border: "none",
              }}
            >
              Delete
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default App;
