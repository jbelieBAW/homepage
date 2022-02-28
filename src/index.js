import React from 'react';
import ReactDOM from 'react-dom';
import Tasks from './Tasks';

var calendarTasks = ReactDOM.render(
  <Tasks status="all"/>,
  document.getElementsByName('react-control-root-tasks')[0]
);
window.CalendarTasks = calendarTasks;

var calendarPendingTasks = ReactDOM.render(
  <Tasks status="pending"/>,
  document.getElementsByName('react-control-root-pendingtasks')[0]
);
window.CalendarPendingTasks = calendarPendingTasks;