import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useGetDeadlinesQuery } from '../../redux/apis/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

// Custom calendar styling override
import './FreelancerCalendar.css'; // <- you'll create this CSS file

const localizer = momentLocalizer(moment);

const FreelancerCalendar = () => {
  const { data, isLoading } = useGetDeadlinesQuery();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (data?.deadlines) {
      const formattedEvents = data.deadlines.map(event => ({
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: true,
      }));
      setEvents(formattedEvents);
    }
  }, [data]);

  return (
    <div className="calendar-wrapper p-4 bg-white rounded-2xl ">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700 border-b pb-2">📅 Your Deadlines For The Month</h2>
      <div className="custom-calendar">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          className="rbc-calendar"
          toolbar={false}
          style={{ height: 400, width: '100%' }}
        />
      </div>
    </div>
  );
};

export default FreelancerCalendar;
