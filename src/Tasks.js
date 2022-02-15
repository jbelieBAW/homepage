import React, { Component } from 'react';
import {Calendar,momentLocalizer} from 'react-big-calendar';
import moment from 'moment';

import $, { event } from 'jquery';
import {Overlay} from 'react-bootstrap';
import {OverlayTrigger} from 'react-bootstrap';
import {Popover} from 'react-bootstrap';

import "./Tasks.css";

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const defaultMessages_fr = {
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

const defaultMessages_en = {
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

function EventAgenda({event}) {
    let cssClass = 'dcc-event-homepage ';
    let statusTaskIcon = '';

	// TASK WITH STATUS (need user action) 
    if (event.statusTask) {
        cssClass += 'dcc-event-clickable';
        if (event.statusTask == 'closed' || event.statusTask == 'validated') {
            statusTaskIcon =  <i class="bi bi-check-circle-fill"></i>;
        } else {
            statusTaskIcon =  <i class="bi bi-exclamation-circle-fill"></i>;
        }
		
		return (
			<div class = {cssClass} style =  {{ borderLeft: '8px solid ' + event.color, backgroundColor : '#DDD', paddingRight: '28px' }} >
				<span class='dcc-event-title'>{event.title}</span>
				<div class='dcc-event-desc'>{event.desc}</div>
				<div class='dcc-event-statusTask'>{statusTaskIcon}</div>
			</div> 
		)
    } else {
	
	// TASK WITHOUT STATUS 
		return (
			<div class = {cssClass} style = {{ backgroundColor: event.color, borderLeft: '8px solid ' + event.color }}  >
				<span class='dcc-event-title'>{event.title}</span>
				<div class='dcc-event-desc'>{event.desc}</div>
				<div class='dcc-event-statusTask'>{statusTaskIcon}</div>
			</div> 
		)
	}

    
}

function navigateTo(elementss) {
	console.log('element', elementss);
	//window.location.href = "http://www.w3schools.com";
}

class Tasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultCulture: '',
            defaultMessages: {},
            defaultDeleteButtonText: '',
            events: []
        };
		this.eventsArray = [];
		this.currentCulture = '';
		this.currentDefaultMessages = {};
		this.localizer = momentLocalizer(moment);
		this.dateFormats = {
			agendaDateFormat: function (date, culture, localizer) {
				return localizer.format(date, 'DD dd', culture);
			}
		};
    };

	navigateTo(event) {
		
		if(event.typeTask == 'dcr') {
			window.location.href = "http://www.w3schools.com";
		} else if (event.typeTask == 'sir') {
			window.location.href = "http://www.w3schools.com";
		}
	}


	componentDidUpdate(prevProps) {
	console.log('componentDidUpdate', $('.rbc-agenda-date-cell'));
	}

    componentDidMount() {
        if ($('[name="com.dcr.datalabel.lang"]').html() == 'FR') {
			this.currentCulture = 'fr';
            this.currentDefaultMessages = defaultMessages_fr;
        } else {
            this.currentCulture = 'en';
            this.currentDefaultMessages = defaultMessages_en;
        }

		this.readEvents('tasks',  $('div[name="homepageTasksList"] .grid-body .grid-body-content tr').not('.empty-grid'));
		this.readEvents('sir',  $('div[name="DCRList"] .grid-body .grid-body-content tr').not('.empty-grid'));
		this.readEvents('dcr',  $('div[name="SIRList"] .grid-body .grid-body-content tr').not('.empty-grid'));
		
		this.setState({
            defaultCulture: this.currentCulture,
            defaultMessages: this.currentDefaultMessages,
            events: this.eventsArray,
            agenda: {
                event: EventAgenda
            }
        });

        // Custom date format
		$('div[name=react-control-root-tasks]').bind('DOMNodeInserted', function(event) {	
				console.log('insert', event.target);
				$('.rbc-agenda-date-cell', event.target).each((index, element) => {
					if ($(element).html() != undefined) {
						let date = $(element).html().split(' ');
						$(element).html("<span class='dcc-date-number'>" + date[0] + "</span><span class='dcc-date-name'>" + date[1] + "</span>");
					}
				});

		});
    }

	


	/**
	* Read events from HTML generate with K2
	* @eventType : tasks, dcr, sir
	* @elementsArray : html element
	*/
    readEvents(eventType, elementsArray) {
		var $this = this;
		elementsArray.each(function(){

			this.event = new Object;
			var my_self = this;
			$(this).children("td").each(function (idx) {
				my_self.event.allDay = true;
				if (eventType == 'tasks') {
					switch (idx) {
						//ID
					case 0:
						my_self.event.id = $(this).data("options").value;
						break;
						//COUNTRY
					case 1:
						my_self.event.country = $(this).data("options").value;
						break;
						//BU
					case 2:
						my_self.event.bu = $(this).data("options").value;
						break;
						//ENTITY
					case 3:
						my_self.event.entity = $(this).data("options").value;
						break;
						//SITE
					case 4:
						my_self.event.site = $(this).data("options").value;
						break;
						//SAFE
					case 5:
						my_self.event.safe = $(this).data("options").value;
						break;
						//START DATE
					case 6:
						my_self.event.start = $(this).data("options").value;
						break;
						//END DATE
					case 7:
						my_self.event.end = $(this).data("options").value;
						break;
						//TASK NAME FR
					case 8:
						var pyramidLevel = '';
						if (my_self.event.site) {
							pyramidLevel = my_self.event.site;
						} else if (my_self.event.entity) {
							pyramidLevel = my_self.event.entity;
						} else if (my_self.event.bu) {
							pyramidLevel = my_self.event.bu;
						} else if (my_self.event.country) {
							pyramidLevel = my_self.event.country;
						}
						my_self.event.translate = $(this).data("options").value + " / " + pyramidLevel;
						break;
						// TASK COLOR
					case 10:
						my_self.event.color = $(this).data("options").value;
						break;
						// STATUS
					case 11:
						console.log('value', $(this).data("options").value);
						my_self.event.statusTask = $(this).data("options").value;
						break;
						// TYPE
					case 12:
						my_self.event.typeTask = $(this).data("options").value;
						break;
					default:
						console.log("Unbound value");
					}
					my_self.event.title = 'test';
					my_self.event.desc = my_self.event.country;
					if (my_self.event.bu) {
						my_self.event.desc += " / " + my_self.event.bu;
						if (my_self.event.entity) {
							my_self.event.desc += " / " + my_self.event.entity;
							if (my_self.event.site) {
								my_self.event.desc += " / " + my_self.event.site;
							}
						}
					}
					if (my_self.event.safe != "") {
						my_self.event.desc = my_self.event.desc + " / " + my_self.event.safe;
					}
				} else {
					switch (idx) {
						//ID
						case 0:
							my_self.event.id = $(this).data("options").value;
							break;
						//NUMBER
						case 1:
							my_self.event.number = $(this).data("options").value;
							break;			
						//DATE
						case 2:
							my_self.event.date = $(this).data("options").value;
							break;
						//STATUS
						case 3:
							my_self.event.statusTask = $(this).data("options").value;
							break;
						default:
						console.log("Unbound value");
					}	
				}
			});
			
			$this.eventsArray.push(this.event);       
		});
    }

	/**
	* Render
	*/
    render() {
        return (
            <div className="PendingTasks">
				<Calendar
				  defaultDate={moment().toDate()}
				  defaultView="agenda"
				  formats={this.dateFormats}
				  events={this.state.events}
				  localizer={this.localizer}
				  messages={this.state.defaultMessages}
				  length={30}
				  onSelectEvent={this.navigateTo}
				  culture={this.state.defaultCulture}
				  style={{ height: "90vh" }}
				  eventPropGetter={event => ({
					style: {
					  border: '0px'
					}
				  })}
				  components={{
					event: EventAgenda
				  }}
				/>
			</div>
		);
    };
};

export default Tasks;
