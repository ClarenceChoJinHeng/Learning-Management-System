const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");
const eventsContainer = document.querySelector(".events");
const addEventSubmit = document.querySelector(".add-event-btn");
const closeEvent = document.querySelector(".bx-x");
const eventContainer = document.querySelector(".event");
const backgroundEventOverlay = document.getElementById(
  "backgroundEventOverlay"
);
const displayCalendarDataContainer = document.getElementById(
  "displayCalendarDataContainer"
);
const addEventBtn = document.querySelector(".add-event");
const closeEventDisplay = document.getElementById("closeEventDisplay");
const addEventContainer = document.querySelector(".add-event-wrapper");
const addEventCloseBtn = document.querySelector(".close");
const addEventTitle = document.querySelector(".event-name");
const addEventFrom = document.querySelector(".event-time-from");
const addEventTo = document.querySelector(".event-time-to");
const addEventDescription = document.querySelector(".event-description");
const addEventP = document.querySelector(".add-event-p");
const addEvent = document.querySelectorAll(".event");

// ========== GETTING THE CURRENT DATE ==========
let today = new Date();
let activeDay; // GLOBAL DECLARATION
let month = today.getMonth();
let year = today.getFullYear();
console.log(month);

// ======= ARRAYS OF MONTHS AND DAYS ==========
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let eventsArr = [];
getEvents();

// =========== FUNCTION TO ADD DAYS ============

function initCalendar() {
  // TO GET PREV MONTH DAYS AND CURRENT MONTH ALL DAYS AND REM NEXT MONTH DAYS
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0); // getting the last month day for the current year and month
  const prevLastDay = new Date(year, month, 0); // getting last day previous month
  const prevDays = prevLastDay.getDate(); // previous month date = DD only
  const lastDate = lastDay.getDate(); // Getting last date of current month or last month date
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1; // Getting the first 3 days of the next month for curent month
  console.log(lastDay);

  // UPDATE DATE TOP OF CALENDER
  date.innerHTML = months[month] + " " + year;

  // ADDING DAYS ON DOM
  let days = "";

  // PREVIOUS MONTH DAYS
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // CURRENT MONTH DAYS || TO DISPLAY ALL THE DAYS OF THE MONTH IN THE CALENDAR
  for (let i = 1; i <= lastDate; i++) {
    // CHECK IF EVENT EXISTS ON CURRENT DAY
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });

    // IF DAY IS TODAY ADD CLASS TODAY
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);

      // If EVENT WAS ALSO FOUND ADD EVENT CLASS
      // ADD ACTIVE CLASS TO TODAY
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } // DAYS DISPLAYED
    else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day">${i}</div>`;
      }
    }
  }

  // NEXT MONTH DAYS AND DISPLAY ON CURRENT MONTH
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  // ADD LISTENER AFTER CALENDAR INITIALIZED
  addListener();
}
initCalendar();

// PREVIOUS MONTH FUNCTION
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }

  initCalendar();
}

// NEXT MONTH FUNCTION
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

// ADD EVENLISTENERS ON PREV AND NEXT BUTTONS

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// =========== GO TODAY DATE  ============

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

// ========== GO TO DATE FUNCTION ============

dateInput.addEventListener("change", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    // ADD A SLASH IF TWO NUMBERS ENTERED
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    // DONT ALLOW MORE THAN 7 CHARACTER
    dateInput.value = dateInput.value.slice(0, 7);
  }

  // REMOVING SLASHES IF BACKSPACE PRESSED
  if ((e.inputType = "deleteContentBackward")) {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

// ============== GO TO WHICH DATE FUNCTION USING TYPE IN ============

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  // DATE VALIDATION
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }

  alert("Data Format Must Be : (MM/YYYY)");
}

gotoBtn.addEventListener("click", gotoDate);

// =============== ADD EVENT POPUP || CSS ALTERNATIVE ===============

addEventBtn.addEventListener("click", () => {
  addEventContainer.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (
    e.target !== addEventBtn &&
    !addEventBtn.contains(e.target) &&
    !addEventContainer.contains(e.target)
  ) {
    addEventContainer.classList.remove("active");
  }
});

// =============== ADD EVENT FUNCTION FOR DAYS AFTER AND BEFORE MAKING IT ACTIVE FOR BOTH ===============

function addListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      // SET CURRENT DAY AS ACTIVE DAY
      activeDay = Number(e.target.innerHTML); // Convert String to number
      console.log(activeDay, "t");
      // CALL ACTIVE DAY AFTER CLICK
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));

      // REMOVE ACTIVE FROM ALREADY ACTIVE DAY WHEN USER CLICKS ON ANOTHER DAY
      days.forEach((day) => {
        day.classList.remove("active");
      });

      // IF PREVIOUS MONTH DAY CLICKED GOTO PREV MONTH AND ADD ACTIVE
      if (e.target.classList.contains("prev-date")) {
        prevMonth();

        setTimeout(() => {
          // SELECT ALL DAYS OF THAT MONTH
          const days = document.querySelectorAll(".day");

          // AFTER GOING TO PREV MONTH ADD ACTIVE TO BE CLICKED
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);

        // IF NEXT MONTH DAY CLICKED GOTO NEXT MONTH AND ADD ACTIVE
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();

        setTimeout(() => {
          // SELECT ALL DAYS OF THAT MONTH
          const days = document.querySelectorAll(".day");

          // AFTER GOING TO PREV MONTH ADD ACTIVE TO BE CLICKED
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        // REMAINING CURRENT MONTH DAYS
        e.target.classList.add("active");
      }
    });
  });
}

// =============== INPUT EVENT VALIDATION ===============

addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 50);
});

addEventFrom.addEventListener("input", (e) => {
  e.preventDefault();
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  // IF TWO NUMBERS ENTERED ADD A COLON
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  // STOP USER FROM ENTERING MORE THANT 5 CHARACTERS
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

// =============== INPUT EVENT VALIDATION ===============

addEventTo.addEventListener("input", (e) => {
  e.preventDefault();
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  // IF TWO NUMBERS ENTERED ADD A COLON
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  // STOP USER FROM ENTERING MORE THANT 5 CHARACTERS
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

// ================= SHOW ACTIVE DAY EVENTS AND DATE AT TOP =================

function getActiveDay(date) {
  const day = new Date(year, month, date);
  console.log(day);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

// =============== ADD EVENT FUNCTION FOR CREATING AN EVENT ===============

function convertTime(time) {
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMinute = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMinute + " " + timeFormat;
  return time;
}

// ============== CREATE A FUNCTION TO REMOVE EVENT ON CLICK DELETION ===============
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventElement = e.target.closest(".event-container");
      const eventTitle = eventElement.querySelector(".event-title").innerHTML;
      eventsArr.forEach((event, eventIndex) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          //if no events left in a day then remove that day from eventsArr
          if (event.events.length === 0) {
            eventsArr.splice(eventIndex, 1);
            //remove event class from day
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

// =============== SEND DATA TO THE DATABASE =================
const addNoteCalendar = async () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  const eventDescription = addEventDescription.value;

  //=========== VALIDATIONS ============
  if (
    eventTitle === " " ||
    eventTimeFrom === "" ||
    eventTimeTo === "" ||
    eventDescription === ""
  ) {
    alert("All Fields Are Required");
    return;
  }

  //============ TIME FORMAT VALIDATION =============
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");

  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Invalid Time Format (HH:MM) 24 Hours Format");
    return;
  }

  if (
    timeFromArr[0] > timeToArr[0] ||
    (timeFromArr[0] == timeToArr[0] && timeFromArr[1] >= timeToArr[1])
  ) {
    alert("The 'from' time must be earlier than the 'to' time or later");
    return;
  }

  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  const newEvent = {
    title: eventTitle,
    timeFrom: timeFrom,
    timeTo: timeTo,
    description: eventDescription,
  };

  let eventAdded = false;

  // CHECK IF EVENT ALREADY EXISTS ON CURRENT DAY
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        // IF EVENT ALREADY EXISTS PUSH NEW EVENT
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  // IF EVENT ARRAY IS EMPTY OR CURRENT DAY HAS NO EVENT CREATE NEW

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  // SHOW CURRENT ADDED EVENT
  console.log(activeDay);
  updateEvents(activeDay);

  // also add event class to newly added day if not already

  const activeDayElem = document.querySelector(".day.active");
  if (!activeDayElem.classList.contains("event")) {
    activeDayElem.classList.add("event");
  }
};

// ============== FUNCTION TO CHECK FOR THE CURRENT CLICK EVENT IF THERE IS ANY OR NOT ===============

function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      // SHOW EVENT ON DOCUMENT

      event.events.forEach((event) => {
        events += `
          <div class="event-container">
          <div class="event__container">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time"> ${event.timeFrom} - ${event.timeTo}</div>
          </div>
          <div class="tick__container">
          <i class='bx bx-x delete-event'></i>
          </div>
        </div>`;
      });
    }
  });

  // IF THERE IS NOTHING

  if (events === "") {
    events = `<div class="no-event"><h3>No Events</h3></div>`;
  }
  console.log(events);
  eventsContainer.innerHTML = events;

  // SAVE EVENTS WHEN NEW ONE CALLED
  saveEvents(); // Replace with retrieveEvents
}

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
  console.log("Events Saved", eventsArr);
}

function getEvents() {
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events"))); // PUSHING THE LOCAL STORAGE INTO THE ARRAY
}

addEventSubmit.addEventListener("click", (event) => {
  addNoteCalendar(event);
  addEventContainer.classList.remove("active");
});

// =============== RETRIEVE EVENTS FROM DATABASE ===============
// const retrieveEvents = async () => {

//   const userEmail = localStorage.getItem("userEmail");
//   const response = await fetch(
//     `http://localhost:5001/client/retrieve-calendar?userEmail=${userEmail}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   if (response.ok) {
//     const data = await response.json();
//     console.log(data.message);

//     data.retrieveCalendar.forEach((item) => {
//       console.log(item,"123");
//     });

//   } else {
//     const error = await response.json();
//     console.log(error.message);
//   }
// };
