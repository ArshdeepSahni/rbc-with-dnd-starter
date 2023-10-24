import React, { Component, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "./App.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const App = () => {
  const [events, setEvents] = useState([
    {
      start: moment().add(0, "days").toDate(),
      end: moment().add(0, "days").toDate(),
      title: "Some title",
    },
  ]);

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

  return (
    <div className="App">
      <DnDCalendar
        defaultDate={moment().toDate()}
        defaultView="month"
        events={events}
        localizer={localizer}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        style={{ height: "100vh" }}
      />
    </div>
  );
};

export default App;
