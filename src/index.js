import React from 'react';
import ReactDOM from 'react-dom';
import Tasks from './Tasks';
import PendingTasks from './PendingTasks';

var calendarTasks = ReactDOM.render(
  <Tasks />,
  document.getElementsByName('react-control-root-tasks')[0]
);
window.CalendarTasks = calendarTasks;

var calendarPendingTasks = ReactDOM.render(
  <PendingTasks />,
  document.getElementsByName('react-control-root-pendingtasks')[0]
);
window.CalendarPendingTasks = calendarPendingTasks;