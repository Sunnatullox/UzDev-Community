import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Colendar() {
  const [value, onChange] = useState(new Date());
  return (
    <div>
      <div className="schedule">
      <Calendar onChange={onChange} value={value} />
      </div>
    </div>
  );
}

export default Colendar;
