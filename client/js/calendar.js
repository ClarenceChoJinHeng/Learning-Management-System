const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");

// ========== GETTING THE CURRENT DATE ==========
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

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

// =========== FUNCTION TO ADD DAYS ============

function initCalendar() {
  // TO GET PREV MONTH DAYS AND CURRENT MONTH ALL DAYS AND REM NEXT MONTH DAYS
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  // UPDATE DATE TOP OF CALENDER
  date.innerHTML = months[month] + " " + year;

  // ADDING DAYS ON DOM
  let days = "";

  // PREVIOUS MONTH DAYS

  for (let x = day; x > 0; x--) {
    days = `<div class="day prev-date">${prevDays - x + 1}</div>` + days;
  }

  // CURRENT MONTH DAYS
  for (let i = 1; i <= lastDate; i++) {
    // IF DAY IS TODAY ADD CLASS TODAY
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      days += `<div class="day today">${i}</div>`;
    }
    // ADD REMAINING AS IT IS
    else {
      days += `<div class="day">${i}</div>`;
    }
  }

  // NEXT MONTH DAYS
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
}
initCalendar();

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }

  initCalendar();
}

// NEXT MONTH
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

// =========== GO TO DAYS ============

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

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

gotoBtn.addEventListener("click", gotoDate);


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
