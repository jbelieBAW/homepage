import React, { Component } from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
//import 'moment/locale/fr';

import $, { event } from 'jquery';
import {Overlay} from 'react-bootstrap';
import {OverlayTrigger} from 'react-bootstrap';
import {Popover} from 'react-bootstrap';

import "./Tasks.css";

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const localizer = momentLocalizer(moment) // or globalizeLocalizer

const defaultMessages_fr={
  date: 'Date',
  time: 'Heure',
  event: 'Evènement',
  allDay: 'Toute la journée',
  week: 'Semaine',
  work_week: 'Semaine de travail',
  day: 'Jour',
  month: 'Mois',
  previous: 'Précédent',
  next: 'Suivant',
  yesterday: 'Hier',
  tomorrow: 'Demain',
  today: "Aujourd'hui",
  agenda: 'Agenda',
  noEventsInRange: "Il n'y a pas d'évènements dans cette période.",
  deleteButton: "SUPPRIMER",
  showMore: function showMore(total) {
    return "+" + total + " de plus";
  }
};

const defaultMessages_en={
  date: 'Date',
  time: 'Time',
  event: 'Event',
  allDay: 'All Day',
  week: 'Week',
  work_week: 'Work Week',
  day: 'Day',
  month: 'Month',
  previous: 'Back',
  next: 'Next',
  yesterday: 'Yesterday',
  tomorrow: 'Tomorrow',
  today: 'Today',
  agenda: 'Agenda',
  noEventsInRange: 'There are no events in this range.',
  deleteButton: "DELETE",
  showMore: function showMore(total) {
    return "+" + total + " more";
  }
};

function Event({ event }) {
  let popoverClickRootClose = (
    <Popover id="popover-trigger-click-root-close">
      <Popover.Header as="h3">{event.title}</Popover.Header>
      <Popover.Body>
        <span>{event.country}</span><br/>
        <span>{event.bu}</span><br/>
        <span>{event.entity}</span><br/>
        <span>{event.site}</span><br/>
        <span>{event.safe}</span><br/>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger id="help" trigger="click" rootClose container={this} placement="top" overlay={popoverClickRootClose}>
      <div><span class="eventTitle">{event.title}</span></div>
    </OverlayTrigger>
  );
}

class PendingTasks extends Component {

  constructor(props) {
    super(props);
    this.state = {defaultCulture: '', defaultMessages: {}, defaultDeleteButtonText:'', events: []};
  };

  componentDidMount() {
    var eventsArray = [];
    var currentCulture = '';
    var currentDefaultMessages = {};
    if ($('#4fc81828-2dd7-683c-153b-760f79d3f694_67e9243d-d6fd-fbb4-991c-f23e3eff15de .input-control span').html()=='FR'){
    //if (/^fr\b/.test(navigator.language)) {
      currentCulture = 'fr';
      currentDefaultMessages = defaultMessages_fr;
    }else{
      currentCulture = 'en';
      currentDefaultMessages = defaultMessages_en;
    }
    
    $('div[name="homepagePendingTasksList"] .grid-body .grid-body-content tr').not('.empty-grid').each(function(){
      var $this = $(this);
      this.event = new Object;
      var my_self = this;
      $this.children("td").each(function( idx ) {
        my_self.event.allDay=true;
        switch(idx){
          //ID
          case 0:
            my_self.event.id=$(this).data("options").value;
            break;
          //COUNTRY
          case 1:
            my_self.event.country=$(this).data("options").value;
            break;
          //BU
          case 2:
            my_self.event.bu=$(this).data("options").value;
            break;
          //ENTITY
          case 3:
            my_self.event.entity=$(this).data("options").value;
            break;
          //SITE
          case 4:
            my_self.event.site=$(this).data("options").value;
            break;
          //SAFE
          case 5:
            my_self.event.safe=$(this).data("options").value;
            break;  
          //START DATE
          case 6:
            my_self.event.start=$(this).data("options").value;
            break;
          //END DATE
          case 7:
            my_self.event.end=$(this).data("options").value;
            break;
          //TASK NAME FR
          case 8:
            if (currentCulture=='fr') {
              my_self.event.title=$(this).data("options").value +" / "+ my_self.event.site; 
            }
            break;
          //TASK NAME EN
          case 9:
            if (currentCulture=='en') {
              my_self.event.title=$(this).data("options").value +" / "+ my_self.event.site;
            }
            break;  
          //TASK TYPE INSTANCE
          case 10:
            break;
          //TASK TYPE ID
          case 11:
            break;
          // TASK COLOR
          case 12:
            my_self.event.color=$(this).data("options").value;
            break;
          default:
            console.log("Unbound value");    
        }
        my_self.event.desc= my_self.event.country +" / " + my_self.event.bu + " / " + my_self.event.entity + " / " + my_self.event.site;
        if(my_self.event.safe != ""){
          my_self.event.desc = my_self.event.desc + " / " + my_self.event.safe;
        }
      });
      eventsArray.push(this.event);
    });
    this.setState({defaultCulture: currentCulture, defaultMessages: currentDefaultMessages, events : eventsArray});
  };

  render() {
    return (
      <div className="PendingTasks">
        <Calendar
          defaultDate={moment().toDate()}
          defaultView="agenda"
          events={this.state.events}
          localizer={localizer}
          messages={this.state.defaultMessages}
          //onEventDrop={this.onEventDrop}
          //onEventResize={this.onEventResize}
          //resizable
          length={30}
          culture={this.state.defaultCulture}
          style={{ height: "90vh" }}
          //resources={resourceMap}
          //resourceIdAccessor="resourceId"
          //resourceTitleAccessor="resourceTitle"
          eventPropGetter={event => ({
            style: {
              backgroundColor: event.color,
              color: 'white',
              border: '0px'
            }
          })}
          components={{
            event: Event
          }}
        />
    </div>
    );
  };
};

export default PendingTasks; 